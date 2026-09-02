"use client";

import { useEffect, useRef } from "react";

export function VideoFrame({
  src,
  poster,
  className = "",
  label,
}: {
  src: string;
  poster?: string;
  className?: string;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          void video.play().catch(() => {
            // Algunos navegadores pueden bloquear autoplay hasta la primera interacción.
          });
          return;
        }

        video.pause();
      },
      {
        threshold: [0, 0.25, 0.55, 0.8],
        rootMargin: "0px 0px -6% 0px",
      },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className={`video-frame ${className}`}>
      <video
        ref={videoRef}
        controls
        muted
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
        Tu navegador no puede reproducir este video.
      </video>
    </figure>
  );
}
