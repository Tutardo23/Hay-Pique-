"use client";
import { motion } from "motion/react";
import type { MotionValue } from "motion/react";

/**
 * The path is visible in the server render. For scroll-driven chapters we
 * progressively bind pathLength to the supplied MotionValue. This keeps
 * server/client markup deterministic even when Reduced Motion is enabled.
 */
export function DrawnThread({ className = "", progress, variant = "hero" }: { className?: string; progress?: MotionValue<number>; variant?: "hero" | "values" | "network" | "join" }) {
  const paths = {
    hero: "M300 8 C296 62 352 78 430 66 C510 54 550 74 575 118 C600 160 590 192 630 218 C672 244 720 225 752 250 C790 280 792 320 760 355 C730 388 708 418 744 448 C780 478 820 458 842 490 C864 522 842 560 812 590 C780 620 760 650 778 690 C792 722 806 744 800 772",
    values: "M96 8 C16 96 185 152 86 232 C16 290 183 357 78 432 C41 460 50 495 105 514",
    network: "M40 250 C128 52 410 30 515 182 C614 324 485 492 290 456 C118 424 12 330 40 250",
    join: "M10 92 C166 14 348 166 512 78 C690 -17 868 151 1030 54",
  } as const;
  const viewBoxes = {
    hero: "0 0 1600 800",
    values: "0 0 220 520",
    network: "0 0 620 520",
    join: "0 0 1040 190",
  } as const;

  return (
    <svg className={className} viewBox={viewBoxes[variant]} preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d={paths[variant]}
        fill="none"
        stroke="currentColor"
        strokeWidth={variant === "hero" ? 3.2 : variant === "network" ? 4 : 5}
        strokeLinecap="round"
        initial={false}
        style={progress ? { pathLength: progress } : undefined}
      />
      {variant === "hero" ? (
        <>
          <path d="M800 772 L785 752" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M800 772 L815 752" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </>
      ) : null}
    </svg>
  );
}
