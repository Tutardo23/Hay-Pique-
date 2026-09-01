import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://fundacionhaypique.org"),
  title: {
    default: "Fundación Hay Pique! | Educación y acompañamiento",
    template: "%s | Fundación Hay Pique!",
  },
  description:
    "Fundación Hay Pique! acompaña a niños, niñas y jóvenes a través de educación, cuidado, comunidad y nuevas oportunidades.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Fundación Hay Pique!",
    description: "Estar cerca puede cambiar una historia.",
    type: "website",
    locale: "es_AR",
    images: [{ url: "/brand/logo-hay-pique.jpeg", width: 800, height: 658 }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
