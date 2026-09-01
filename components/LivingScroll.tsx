"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const moments = [
  {
    index: "01",
    kicker: "ESTAR",
    title: "Todo puede empezar en algo pequeño.",
    body: "Una tarea compartida, un cuento, una merienda o simplemente alguien que se sienta al lado y presta atención.",
    photo: "FOTO CERCANA",
    note: "manos, cuaderno, lectura o acompañamiento 1 a 1",
    tone: "aqua",
    background: "#e4f5f7",
  },
  {
    index: "02",
    kicker: "VOLVER",
    title: "La confianza aparece cuando alguien vuelve.",
    body: "El miércoles siguiente importa. Y el otro también. La continuidad convierte un encuentro en vínculo y un vínculo en acompañamiento.",
    photo: "FOTO DE ENCUENTRO",
    note: "llegada, saludo, merienda o chicos + voluntarios",
    tone: "pink",
    background: "#faebf2",
  },
  {
    index: "03",
    kicker: "TEJER",
    title: "Cuando hace falta, la red se mueve.",
    body: "Educación, salud, familias, profesionales, escuelas y oportunidades se conectan alrededor de necesidades concretas.",
    photo: "FOTO DE COMUNIDAD",
    note: "actividad grupal, salud, oficio o articulación con otra institución",
    tone: "green",
    background: "#eef5dd",
  },
] as const;

export function LivingScroll() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0.04, 1]);

  useEffect(() => {
    return scrollYProgress.on("change", (value) => {
      const nextIndex = value < 0.34 ? 0 : value < 0.68 ? 1 : 2;
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    });
  }, [scrollYProgress]);

  const moment = moments[activeIndex];

  return (
    <section className="living-scroll" ref={ref} aria-label="Lo que nos mueve">
      <motion.div
        className={`living-sticky living-bg-${moment.tone}`}
        animate={{ backgroundColor: moment.background }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
      >
        <div className="shell living-shell">
          <div className="living-header">
            <div>
              <div className="eyebrow"><span /> Lo que nos mueve</div>
              <h2>Acompañar también es <em>volver, escuchar y quedarse cerca.</em></h2>
            </div>
            <div className="living-counter" aria-hidden="true">
              <span>{moment.index}</span><i /><span>03</span>
            </div>
          </div>

          <div className="living-stage">
            <svg className="living-thread" viewBox="0 0 220 520" preserveAspectRatio="none" aria-hidden="true">
              <motion.path
                d="M115 5 C22 92 205 150 102 236 C28 299 190 356 86 438 C55 463 68 496 110 515"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                style={{ pathLength: reduceMotion ? 1 : progress }}
              />
            </svg>

            <motion.article
              key={moment.index}
              className={`living-scene living-${moment.tone}`}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="living-copy">
                <div className="living-number" aria-hidden="true">{moment.index}</div>
                <span>{moment.kicker}</span>
                <h3>{moment.title}</h3>
                <p>{moment.body}</p>
              </div>

              <div className="living-photo">
                <div className="living-photo-inner">
                  <b>{moment.photo}</b>
                  <small>{moment.note}</small>
                </div>
              </div>
            </motion.article>
          </div>

          <div className="living-progress" aria-hidden="true">
            <span>seguí bajando</span>
            <div><motion.i style={{ scaleX: reduceMotion ? 1 : progress }} /></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
