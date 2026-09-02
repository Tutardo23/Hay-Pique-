import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/sections.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://hay-pique.vercel.app"),
  title: {
    default: "Fundación Hay Pique! | Estar cerca puede cambiar una historia",
    template: "%s | Fundación Hay Pique!",
  },
  description: "Fundación Hay Pique! acompaña a niños, niñas y jóvenes a través de educación, cuidado, comunidad y nuevas oportunidades.",
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
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
