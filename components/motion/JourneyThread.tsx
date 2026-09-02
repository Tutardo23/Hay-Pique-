type JourneyVariant =
  | "values"
  | "story"
  | "wednesday"
  | "programs"
  | "network"
  | "impact"
  | "social"
  | "join";

const paths: Record<JourneyVariant, string> = {
  // Hero hands the thread to the centre. It immediately moves into a safe edge.
  values:
    "M800 0 C930 36 1180 84 1415 145 C1515 172 1548 254 1518 360 C1490 460 1518 610 1482 745 C1458 840 1444 925 1420 1000",
  // Keep to the right of the story and cross through the lower breathing room.
  story:
    "M1420 0 C1466 126 1518 252 1484 390 C1448 540 1498 712 1432 842 C1355 930 525 925 160 1000",
  // Travel down the left edge; cross only near the bottom of the photographic chapter.
  wednesday:
    "M160 0 C104 116 72 250 106 390 C140 530 72 686 132 822 C194 930 1060 930 1450 1000",
  // Programs are dense, so the line lives almost entirely in the right margin.
  programs:
    "M1450 0 C1510 130 1534 278 1500 424 C1468 574 1525 720 1458 842 C1384 934 522 932 178 1000",
  // The network photo already has visual weight; thread stays left and slips behind the image late.
  network:
    "M178 0 C104 132 76 276 118 420 C160 560 98 702 160 824 C238 920 1055 914 1360 1000",
  // Cards occupy the centre. Use the outer right rail and transition across the final whitespace.
  impact:
    "M1360 0 C1460 120 1518 254 1480 404 C1440 554 1508 706 1430 832 C1340 930 520 930 142 1000",
  // Editorial gallery on the right: the line begins left and ends right, under the lower composition.
  social:
    "M142 0 C82 122 64 260 104 398 C146 544 82 708 148 826 C218 926 1014 924 1320 1000",
  // Final chapter: one last quiet curve, ending in the only arrowhead on the page.
  join:
    "M1320 0 C1455 130 1512 286 1452 426 C1386 578 1476 716 1396 830 C1320 936 1268 970 1238 1000",
};

export function JourneyThread({ variant }: { variant: JourneyVariant }) {
  const isFinal = variant === "join";

  return (
    <svg
      className={`journey-thread journey-thread-${variant}`}
      viewBox="0 0 1600 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={paths[variant]}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {isFinal ? (
        <>
          <path
            d="M1238 1000 L1219 972"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M1238 1000 L1261 978"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </>
      ) : null}
    </svg>
  );
}
