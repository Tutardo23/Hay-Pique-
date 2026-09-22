"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { del } from "@vercel/blob";
import { requireAdmin, requireOwner } from "@/lib/admin-auth";
import { parseServiceForm, type ServiceInput } from "@/lib/service-validation";
import { getSql } from "@/lib/db";
import {
  auditService,
  deleteService,
  getServiceById,
  insertService,
  makeUniqueSlug,
  updateService,
  updateServiceStatus,
} from "@/lib/services";
import type { ServiceRecord, ServiceStatus } from "@/types/service";

export type ServiceActionState = { error?: string };

function firstError(error: z.ZodError) {
  return error.issues[0]?.message || "Revisá los datos ingresados.";
}


function getNextStatus(current: ServiceStatus | undefined, intent: string | null): ServiceStatus {
  if (intent === "publish") return "published";
  return current ?? "draft";
}

export async function createServiceAction(
  _previousState: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  const admin = await requireAdmin();
  const parsed = parseServiceForm(formData);
  if (!parsed.success) return { error: firstError(parsed.error) };

  const input = parsed.data;
  const intent = String(formData.get("intent") ?? "save");
  const status = getNextStatus(undefined, intent);

  if ((input.image_url || input.media_gallery.length) && !input.media_authorized) {
    return { error: "Para publicar fotos o videos tenés que confirmar que cuentan con autorización." };
  }
  if (status === "published" && !input.cta_url) {
    return { error: "Antes de publicar, agregá el enlace del botón de inscripción o contacto." };
  }

  let service: ServiceRecord;
  try {
    const slug = await makeUniqueSlug(input.title, input.slug);
    service = await insertService(input, slug, admin.email, status);
    await auditService(service, admin.email, status === "published" ? "created_and_published" : "created_draft");
  } catch (error) {
    console.error("createServiceAction", error);
    return { error: "No se pudo guardar la propuesta. Revisá la conexión con Neon e intentá de nuevo." };
  }

  revalidatePath("/");
  revalidatePath("/servicios");
  redirect(`/admin/servicios/${service.id}/editar?guardado=1`);
}

export async function updateServiceAction(
  id: string,
  _previousState: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  const admin = await requireAdmin();
  const existing = await getServiceById(id);
  if (!existing) return { error: "La propuesta ya no existe." };

  const parsed = parseServiceForm(formData);
  if (!parsed.success) return { error: firstError(parsed.error) };

  const input = parsed.data;
  const intent = String(formData.get("intent") ?? "save");
  const status = getNextStatus(existing.status, intent);

  if ((input.image_url || input.media_gallery.length) && !input.media_authorized) {
    return { error: "Para publicar fotos o videos tenés que confirmar que cuentan con autorización." };
  }
  if (status === "published" && !input.cta_url) {
    return { error: "Antes de publicar, agregá el enlace del botón de inscripción o contacto." };
  }

  let service: ServiceRecord;
  try {
    const slug = await makeUniqueSlug(input.title, input.slug, id);
    const updatedService = await updateService(
      id,
      input,
      slug,
      admin.email,
      status,
    );

    if (!updatedService) {
      return { error: "La propuesta ya no existe." };
    }

    service = updatedService;

    await cleanupRemovedAssets(existing, service);
    await auditService(
      service,
      admin.email,
      status === "published" ? "updated_published" : "updated",
    );
  } catch (error) {
    console.error("updateServiceAction", error);
    return { error: "No se pudo guardar el cambio. Intentá nuevamente." };
  }

  revalidatePath("/");
  revalidatePath("/servicios");
  revalidatePath(`/servicios/${service.slug}`);
  redirect(`/admin/servicios/${id}/editar?guardado=1`);
}

const statusSchema = z.enum(["draft", "published", "archived"]);

export async function setServiceStatusAction(id: string, nextStatus: string, _formData: FormData) {
  const admin = await requireAdmin();
  const parsedStatus = statusSchema.safeParse(nextStatus);
  if (!parsedStatus.success) return;

  const existing = await getServiceById(id);
  if (!existing) return;
  if (parsedStatus.data === "published" && !existing.cta_url) return;
  if ((existing.image_url || existing.media_gallery.length) && !existing.media_authorized) return;

  const service = await updateServiceStatus(id, parsedStatus.data, admin.email);
  await auditService(service, admin.email, `status:${parsedStatus.data}`);
  revalidatePath("/");
  revalidatePath("/servicios");
  revalidatePath(`/servicios/${existing.slug}`);
}


function privateBlobPathFromPublicRoute(mediaUrl: string | null) {
  if (!mediaUrl?.startsWith("/api/media/service/")) return null;

  const encoded = mediaUrl.slice("/api/media/service/".length);
  const pathname = encoded
    .split("/")
    .map((part) => decodeURIComponent(part))
    .join("/");

  return /^hay-pique\/servicios\/(?:(?:images\/[a-f0-9-]+\.(?:jpg|png|webp))|(?:videos\/[a-f0-9-]+\.(?:mp4|webm))|(?:[a-f0-9-]+\.(?:jpg|png|webp)))$/i.test(pathname)
    ? pathname
    : null;
}

function referencedBlobPaths(service: ServiceRecord) {
  const paths = new Set<string>();
  const cover = privateBlobPathFromPublicRoute(service.image_url);
  if (cover) paths.add(cover);
  for (const item of service.media_gallery) {
    if (item.pathname) paths.add(item.pathname);
  }
  return paths;
}

async function deleteBlobPath(pathname: string) {
  await del(pathname, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch((error) => {
    console.error("service-media-delete", pathname, error);
  });
}

async function cleanupRemovedAssets(previous: ServiceRecord, next: ServiceRecord) {
  const before = referencedBlobPaths(previous);
  const after = referencedBlobPaths(next);
  const removed = [...before].filter((pathname) => !after.has(pathname));
  await Promise.all(removed.map(deleteBlobPath));
}

async function cleanupAllAssets(service: ServiceRecord) {
  await Promise.all([...referencedBlobPaths(service)].map(deleteBlobPath));
}

export async function createDemoServiceAction(_formData: FormData) {
  const admin = await requireOwner();
  const sql = getSql();
  const demoSlug = "demo-arma-tu-cv";

  const existing = (await sql`
    SELECT id
    FROM hp_services
    WHERE slug = ${demoSlug}
    LIMIT 1
  `) as Array<{ id: string }>;

  if (existing[0]) {
    redirect(`/admin/servicios/${existing[0].id}/editar?demo=existente`);
  }

  const date = new Date();
  date.setDate(date.getDate() + 14);
  const startsOn = date.toISOString().slice(0, 10);

  const input: ServiceInput = {
    title: "DEMO · Armá tu CV",
    slug: demoSlug,
    subtitle:
      "Un espacio para reconocer tu experiencia y transformarla en un CV claro.",
    description:
      "Un encuentro práctico para jóvenes y adultos que quieren ordenar su experiencia, reconocer habilidades y construir un currículum claro para presentarse a nuevas oportunidades.\n\nEsta es una propuesta de prueba creada automáticamente para que puedas ver cómo funciona el módulo completo antes de cargar un servicio real.",
    highlights:
      "Reconocer experiencias y habilidades\nOrdenar la información más importante\nConstruir un CV claro y fácil de leer\nPrepararse para nuevas oportunidades",
    audience: "Jóvenes y adultos",
    professional_name: "Profesional invitada",
    professional_role:
      "Lic. en Recursos Humanos · Consultora organizacional",
    modality: "virtual",
    location: "Online",
    starts_on: startsOn,
    time_label: "18:00 a 19:30",
    duration: "1 encuentro · 90 minutos",
    price_label: "Valor de prueba",
    capacity: 20,
    image_url: "/images/hero/hero-detalle.webp",
    image_alt: "Materiales de trabajo de Fundación Hay Pique",
    media_gallery: [],
    media_authorized: true,
    cta_label: "Botón de prueba",
    cta_url: "https://www.haypique.org",
    featured: true,
  };

  const service = await insertService(
    input,
    demoSlug,
    admin.email,
    "published",
  );

  await auditService(service, admin.email, "demo_created_and_published");

  revalidatePath("/");
  revalidatePath("/servicios");
  revalidatePath(`/servicios/${service.slug}`);
  revalidatePath("/admin/servicios");

  redirect(`/admin/servicios/${service.id}/editar?demo=creada`);
}

export async function deleteServicePermanentlyAction(
  id: string,
  _formData: FormData,
) {
  const admin = await requireOwner();
  const existing = await getServiceById(id);

  if (!existing) return;

  // Doble barrera: primero tiene que estar archivado y además ser owner.
  if (existing.status !== "archived") return;

  // Guardamos una última fotografía de auditoría antes de borrar.
  await auditService(existing, admin.email, "deleted_permanently");

  const deleted = await deleteService(id);

  if (deleted) {
    await cleanupAllAssets(deleted);
  }

  revalidatePath("/");
  revalidatePath("/servicios");
  revalidatePath(`/servicios/${existing.slug}`);
  revalidatePath("/admin/servicios");
}
