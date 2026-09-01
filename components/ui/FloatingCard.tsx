"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type FloatingCardProps = {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: string;
  className?: string;
  rotate?: number;
  children?: ReactNode;
};

export function FloatingCard({
  eyebrow,
  title,
  description,
  meta,
  className = "",
  rotate = 0,
  children,
}: FloatingCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`floating-card ${className}`}
      initial={false}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -12,
              rotate: rotate * 0.28,
              scale: 1.018,
              boxShadow: "0 30px 55px rgba(32,42,45,.17)",
            }
      }
      whileTap={reduceMotion ? undefined : { y: -4, scale: 0.995 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.7 }}
      style={{ rotate }}
    >
      <div className="floating-card-glow" aria-hidden="true" />
      <div className="floating-card-copy">
        <span>{eyebrow}</span>
        <strong>{title}</strong>
        {description ? <p>{description}</p> : null}
        {meta ? <small>{meta}</small> : null}
      </div>
      {children}
    </motion.article>
  );
}
