import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).transform((value) => value || null);

const optionalHttpsUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:";
    } catch {
      return false;
    }
  }, "El enlace debe ser una URL https válida.")
  .transform((value) => value || null);

const privateImageRoute =
  /^\/api\/media\/service\/hay-pique\/servicios\/(?:images\/)?[a-f0-9-]+\.(?:jpg|png|webp)$/i;

const optionalImageUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => {
    if (!value) return true;
    if (privateImageRoute.test(value)) return true;
    if (/^\/images\/[a-z0-9/_-]+\.(?:jpg|jpeg|png|webp)$/i.test(value)) return true;
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "La portada debe venir del cargador seguro.")
  .transform((value) => value || null);

const optionalDate = z
  .string()
  .trim()
  .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), "Fecha inválida.")
  .transform((value) => value || null);

const mediaSchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(["image", "video"]),
  url: z.string().max(2048).refine(
    (value) =>
      /^\/api\/media\/service\/hay-pique\/servicios\/(?:images|videos)\/[a-f0-9-]+\.(?:jpg|png|webp|mp4|webm)$/i.test(value),
    "Archivo multimedia inválido.",
  ),
  pathname: z.string().max(500).refine(
    (value) =>
      /^hay-pique\/servicios\/(?:images|videos)\/[a-f0-9-]+\.(?:jpg|png|webp|mp4|webm)$/i.test(value),
    "Ruta multimedia inválida.",
  ),
  name: z.string().max(180),
  contentType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
  ]),
  bytes: z.number().int().positive().max(500 * 1024 * 1024),
  alt: z.string().max(220),
});

function parseMediaGallery(raw: string, ctx: { addIssue: (issue: { code: "custom"; message: string }) => void }) {
  try {
    const parsed = JSON.parse(raw || "[]");
    const result = z.array(mediaSchema).max(24, "Podés agregar hasta 24 archivos a la galería.").safeParse(parsed);
    if (!result.success) {
      ctx.addIssue({ code: "custom", message: result.error.issues[0]?.message || "Galería inválida." });
      return z.NEVER;
    }
    return result.data;
  } catch {
    ctx.addIssue({ code: "custom", message: "No se pudo leer la galería multimedia." });
    return z.NEVER;
  }
}

export const serviceInputSchema = z.object({
  title: z.string().trim().min(3, "Poné un nombre para la propuesta.").max(120),
  slug: z
    .string()
    .trim()
    .max(100)
    .refine(
      (value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
      "La dirección solo puede tener letras minúsculas, números y guiones.",
    )
    .transform((value) => value || null),
  subtitle: optionalText(180),
  description: z.string().trim().min(20, "La descripción es demasiado corta.").max(5000),
  highlights: optionalText(2500),
  audience: optionalText(300),
  professional_name: optionalText(150),
  professional_role: optionalText(220),
  modality: z
    .enum(["presencial", "virtual", "hibrida", "a_definir", ""])
    .transform((value) => value || null),
  location: optionalText(220),
  starts_on: optionalDate,
  time_label: optionalText(80),
  duration: optionalText(100),
  price_label: optionalText(100),
  capacity: z
    .union([z.literal(""), z.coerce.number().int().positive().max(100000)])
    .transform((value) => (value === "" ? null : value)),
  image_url: optionalImageUrl,
  image_alt: optionalText(220),
  media_gallery: z.string().max(65000).transform(parseMediaGallery),
  cta_label: optionalText(80),
  cta_url: optionalHttpsUrl,
  featured: z.boolean(),
  media_authorized: z.boolean(),
});

export type ServiceInput = z.infer<typeof serviceInputSchema>;

export function parseServiceForm(formData: FormData) {
  return serviceInputSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    description: String(formData.get("description") ?? ""),
    highlights: String(formData.get("highlights") ?? ""),
    audience: String(formData.get("audience") ?? ""),
    professional_name: String(formData.get("professional_name") ?? ""),
    professional_role: String(formData.get("professional_role") ?? ""),
    modality: String(formData.get("modality") ?? ""),
    location: String(formData.get("location") ?? ""),
    starts_on: String(formData.get("starts_on") ?? ""),
    time_label: String(formData.get("time_label") ?? ""),
    duration: String(formData.get("duration") ?? ""),
    price_label: String(formData.get("price_label") ?? ""),
    capacity: String(formData.get("capacity") ?? ""),
    image_url: String(formData.get("image_url") ?? ""),
    image_alt: String(formData.get("image_alt") ?? ""),
    media_gallery: String(formData.get("media_gallery") ?? "[]"),
    cta_label: String(formData.get("cta_label") ?? ""),
    cta_url: String(formData.get("cta_url") ?? ""),
    featured: formData.get("featured") === "on",
    media_authorized: formData.get("media_authorized") === "on",
  });
}
