"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/sign-in")) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.115,
      smoothWheel: true,
      wheelMultiplier: 0.96,
      gestureOrientation: "vertical",
      syncTouch: true,
      syncTouchLerp: 0.12,
      touchInertiaExponent: 1.45,
      touchMultiplier: 1.02,
      anchors: { offset: -92 },
      stopInertiaOnNavigate: true,
      respectReducedMotion: false,
    });

    document.documentElement.classList.add("has-lenis");

    return () => {
      document.documentElement.classList.remove("has-lenis");
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
