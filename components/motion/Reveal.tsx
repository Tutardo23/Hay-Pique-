"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Progressive enhancement only: content is always visible in SSR.
 * This avoids hydration mismatches when prefers-reduced-motion differs
 * between the server render and the browser.
 */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? undefined : { opacity: [0.96, 1], y: [8, 0] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
