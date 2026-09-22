import { getSql, hasDatabase } from "@/lib/db";
import { toSlug } from "@/lib/slug";
import type { ServiceInput } from "@/lib/service-validation";
import type { ServiceRecord, ServiceStatus } from "@/types/service";

function normalizeService(row: ServiceRecord): ServiceRecord {
  return {
    ...row,
    media_gallery: Array.isArray(row.media_gallery) ? row.media_gallery : [],
  };
}

export async function listPublishedServices(limit?: number) {
  if (!hasDatabase()) return [] as ServiceRecord[];
  const sql = getSql();
  const rows = (await sql`
    SELECT *
    FROM hp_services
    WHERE status = 'published'
    ORDER BY featured DESC, sort_order ASC, published_at DESC NULLS LAST, created_at DESC
  `) as ServiceRecord[];
  const normalized = rows.map(normalizeService);
  return typeof limit === "number" ? normalized.slice(0, limit) : normalized;
}

export async function listFeaturedServices(limit = 3) {
  const rows = await listPublishedServices();
  return rows.slice(0, limit);
}

export async function getPublishedServiceBySlug(slug: string) {
  if (!hasDatabase()) return null;
  const sql = getSql();
  const rows = (await sql`
    SELECT *
    FROM hp_services
    WHERE status = 'published' AND slug = ${slug}
    LIMIT 1
  `) as ServiceRecord[];
  return rows[0] ? normalizeService(rows[0]) : null;
}

export async function listAllServices() {
  const sql = getSql();
  const rows = (await sql`
    SELECT *
    FROM hp_services
    ORDER BY
      CASE status WHEN 'published' THEN 0 WHEN 'draft' THEN 1 ELSE 2 END,
      updated_at DESC
  `) as ServiceRecord[];
  return rows.map(normalizeService);
}

export async function getServiceById(id: string) {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM hp_services WHERE id::text = ${id} LIMIT 1
  `) as ServiceRecord[];
  return rows[0] ? normalizeService(rows[0]) : null;
}

async function slugExists(slug: string, excludeId?: string) {
  const sql = getSql();
  const rows = excludeId
    ? ((await sql`
        SELECT id FROM hp_services
        WHERE slug = ${slug} AND id::text <> ${excludeId}
        LIMIT 1
      `) as Array<{ id: string }> )
    : ((await sql`
        SELECT id FROM hp_services
        WHERE slug = ${slug}
        LIMIT 1
      `) as Array<{ id: string }> );
  return Boolean(rows[0]);
}

export async function makeUniqueSlug(title: string, requestedSlug?: string | null, excludeId?: string) {
  const base = toSlug(requestedSlug || title) || "propuesta";
  let candidate = base;
  let counter = 2;
  while (await slugExists(candidate, excludeId)) {
    candidate = `${base}-${counter}`;
    counter += 1;
    if (counter > 100) throw new Error("No se pudo generar una dirección única para la propuesta.");
  }
  return candidate;
}

export async function insertService(input: ServiceInput, slug: string, actorEmail: string, status: ServiceStatus) {
  const sql = getSql();
  const gallery = JSON.stringify(input.media_gallery);
  const rows = (await sql`
    INSERT INTO hp_services (
      slug, title, subtitle, description, highlights, audience,
      professional_name, professional_role, modality, location,
      starts_on, time_label, duration, price_label, capacity,
      image_url, image_alt, media_gallery, media_authorized,
      cta_label, cta_url, status, featured,
      published_at, created_by, updated_by
    ) VALUES (
      ${slug}, ${input.title}, ${input.subtitle}, ${input.description}, ${input.highlights}, ${input.audience},
      ${input.professional_name}, ${input.professional_role}, ${input.modality}, ${input.location},
      ${input.starts_on}, ${input.time_label}, ${input.duration}, ${input.price_label}, ${input.capacity},
      ${input.image_url}, ${input.image_alt}, ${gallery}::jsonb, ${input.media_authorized},
      ${input.cta_label}, ${input.cta_url}, ${status}, ${input.featured},
      CASE WHEN ${status} = 'published' THEN now() ELSE NULL END,
      ${actorEmail}, ${actorEmail}
    )
    RETURNING *
  `) as ServiceRecord[];
  return normalizeService(rows[0]);
}

export async function updateService(id: string, input: ServiceInput, slug: string, actorEmail: string, status: ServiceStatus) {
  const sql = getSql();
  const gallery = JSON.stringify(input.media_gallery);
  const rows = (await sql`
    UPDATE hp_services SET
      slug = ${slug}, title = ${input.title}, subtitle = ${input.subtitle},
      description = ${input.description}, highlights = ${input.highlights}, audience = ${input.audience},
      professional_name = ${input.professional_name}, professional_role = ${input.professional_role},
      modality = ${input.modality}, location = ${input.location}, starts_on = ${input.starts_on},
      time_label = ${input.time_label}, duration = ${input.duration}, price_label = ${input.price_label},
      capacity = ${input.capacity}, image_url = ${input.image_url}, image_alt = ${input.image_alt},
      media_gallery = ${gallery}::jsonb, media_authorized = ${input.media_authorized},
      cta_label = ${input.cta_label}, cta_url = ${input.cta_url}, status = ${status}, featured = ${input.featured},
      published_at = CASE WHEN ${status} = 'published' THEN COALESCE(published_at, now()) ELSE published_at END,
      updated_by = ${actorEmail}, updated_at = now()
    WHERE id::text = ${id}
    RETURNING *
  `) as ServiceRecord[];
  return rows[0] ? normalizeService(rows[0]) : null;
}

export async function updateServiceStatus(id: string, status: ServiceStatus, actorEmail: string) {
  const sql = getSql();
  const rows = (await sql`
    UPDATE hp_services SET
      status = ${status},
      published_at = CASE WHEN ${status} = 'published' THEN COALESCE(published_at, now()) ELSE published_at END,
      updated_by = ${actorEmail}, updated_at = now()
    WHERE id::text = ${id}
    RETURNING *
  `) as ServiceRecord[];
  return rows[0] ? normalizeService(rows[0]) : null;
}

export async function auditService(service: ServiceRecord | null, actorEmail: string, action: string) {
  const sql = getSql();
  const snapshot = service ? JSON.stringify(service) : null;
  await sql`
    INSERT INTO hp_service_audit (service_id, actor_email, action, snapshot)
    VALUES (${service?.id ?? null}, ${actorEmail}, ${action}, ${snapshot}::jsonb)
  `;
}

export async function deleteService(id: string) {
  const sql = getSql();
  const rows = (await sql`
    DELETE FROM hp_services WHERE id::text = ${id} RETURNING *
  `) as ServiceRecord[];
  return rows[0] ? normalizeService(rows[0]) : null;
}
