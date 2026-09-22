import type { MetadataRoute } from "next";
import { listPublishedServices } from "@/lib/services";

const SITE = "https://www.haypique.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await listPublishedServices().catch(() => []);

  return [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE}/servicios`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...services.map((service) => ({
      url: `${SITE}/servicios/${service.slug}`,
      lastModified: new Date(service.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
