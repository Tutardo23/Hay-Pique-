"use client";

import { useEffect, useRef, useState } from "react";
import { values } from "@/content/values";
import { MediaFrame } from "@/components/media/MediaFrame";

export function ValuesSection() {
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = chapterRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.index ?? 0);
        setActive(index);
      },
      {
        root: null,
        threshold: [0.28, 0.45, 0.62],
        rootMargin: "-18% 0px -42% 0px",
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const item = values[active];

  return (
    <section
      id="lo-que-nos-mueve"
      className="values-section"
      data-tone={item.tone}
      aria-labelledby="values-title"
    >
      <div className="shell values-intro-block">
        <div className="section-label">Lo que nos mueve</div>
        <h2 id="values-title">
          Acompañar también es <em>volver, escuchar y quedarse cerca.</em>
        </h2>
        <p>
          No se trata de aparecer una vez. Se trata de construir confianza con gestos
          concretos, presencia y continuidad.
        </p>
      </div>

      <div className="shell values-mobile-progress" aria-hidden="true">
        <span>0{active + 1}</span>
        <div className="values-mobile-progress-track">
          <i style={{ width: `${((active + 1) / values.length) * 100}%` }} />
        </div>
        <span>03</span>
      </div>

      <div className="shell values-journey">
        <div className="values-chapters">
          {values.map((value, index) => (
            <article
              key={value.kicker}
              ref={(node) => { chapterRefs.current[index] = node; }}
              data-index={index}
              className={`values-chapter ${active === index ? "is-active" : ""}`}
            >
              <div className="values-chapter-top">
                <span className="doodle-number">0{index + 1}</span>
                <span className="values-kicker">{value.kicker}</span>
              </div>
              <h3>{value.title}</h3>
              <p>{value.body}</p>

              <MediaFrame
                className="values-mobile-media"
                src={value.src}
                alt={value.alt}
                position={value.position}
              />
            </article>
          ))}
        </div>

        <aside className="values-visual-column" aria-live="polite">
          <div className="values-visual-sticky">
            <div className="values-visual-meta">
              <span>0{active + 1}</span>
              <i />
              <span>03</span>
            </div>

            <div className="values-visual-card" data-tone={item.tone}>
              <MediaFrame
                key={item.kicker}
                className="values-desktop-media"
                src={item.src}
                alt={item.alt}
                position={item.position}
              />
              <div className="values-visual-caption">
                <strong>{item.kicker}</strong>
                <span>{item.title}</span>
              </div>
            </div>

            <div className="values-dots" aria-hidden="true">
              {values.map((value, index) => (
                <span key={value.kicker} className={active === index ? "is-active" : ""} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
