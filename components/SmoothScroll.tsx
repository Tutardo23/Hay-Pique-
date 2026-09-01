"use client";
import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const lenis = new Lenis({ autoRaf: true, duration: 1.05, smoothWheel: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
