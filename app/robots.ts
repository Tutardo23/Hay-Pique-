import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/sign-in/", "/api/admin/"],
    },
    sitemap: "https://www.haypique.org/sitemap.xml",
  };
}
