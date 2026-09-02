"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.115,
      smoothWheel: true,
      wheelMultiplier: 0.96,
      gestureOrientation: "vertical",
      // En touch mantenemos la misma sensación de continuidad que en desktop.
      syncTouch: true,
      syncTouchLerp: 0.12,
      touchInertiaExponent: 1.45,
      touchMultiplier: 1.02,
      anchors: { offset: -92 },
      stopInertiaOnNavigate: true,
      // El proyecto prioriza explícitamente el scroll suave también en móvil.
      respectReducedMotion: false,
    });

    document.documentElement.classList.add("has-lenis");

    return () => {
      document.documentElement.classList.remove("has-lenis");
      lenis.destroy();
    };
  }, []);

  return null;
}
