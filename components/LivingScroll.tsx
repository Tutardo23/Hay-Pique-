"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const moments = [
  {
    kicker: "01 · ESTAR",
    title: "Todo puede empezar en algo pequeño.",
    body: "Una tarea compartida, un cuento, una merienda o simplemente alguien que se sienta al lado y presta atención.",
    photo: "FOTO CERCANA",
    note: "manos, cuaderno, lectura o acompañamiento 1 a 1",
    tone: "aqua",
  },
  {
    kicker: "02 · VOLVER",
    title: "La confianza aparece cuando alguien vuelve.",
    body: "El miércoles siguiente importa. Y el otro también. La continuidad convierte un encuentro en vínculo y un vínculo en acompañamiento.",
    photo: "FOTO DE ENCUENTRO",
    note: "llegada, saludo, merienda o chicos + voluntarios",
    tone: "pink",
  },
  {
    kicker: "03 · TEJER",
    title: "Cuando hace falta, la red se mueve.",
    body: "Educación, salud, familias, profesionales, escuelas y oportunidades se conectan alrededor de necesidades concretas.",
    photo: "FOTO DE COMUNIDAD",
    note: "actividad grupal, salud, oficio o articulación con otra institución",
    tone: "green",
  },
] as const;

export function LivingScroll() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const line = useTransform(scrollYProgress, [0, 1], [0.06, 1]);
  const o1 = useTransform(scrollYProgress, [0, 0.30, 0.42], [1, 1, 0]);
  const o2 = useTransform(scrollYProgress, [0.26, 0.42, 0.64, 0.76], [0, 1, 1, 0]);
  const o3 = useTransform(scrollYProgress, [0.6, 0.76, 1], [0, 1, 1]);
  const y1 = useTransform(scrollYProgress, [0, 0.42], [0, -24]);
  const y2 = useTransform(scrollYProgress, [0.26, 0.42, 0.76], [24, 0, -24]);
  const y3 = useTransform(scrollYProgress, [0.6, 0.76, 1], [24, 0, 0]);
  const wordX = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);

  const sceneStyles = [
    { opacity: o1, y: y1 },
    { opacity: o2, y: y2 },
    { opacity: o3, y: y3 },
  ];

  return (
    <section className="living-scroll" ref={ref} aria-label="Lo que nos mueve">
      <div className="living-sticky">
        <div className="shell living-shell">
          <div className="living-heading">
            <div className="eyebrow"><span /> Lo que nos mueve</div>
            <h2>Acompañar también es <em>volver, escuchar y quedarse cerca.</em></h2>
          </div>

          <div className="living-stage">
            <svg className="living-thread" viewBox="0 0 220 520" preserveAspectRatio="none" aria-hidden="true">
              <motion.path
                d="M115 5 C22 92 205 150 102 236 C28 299 190 356 86 438 C55 463 68 496 110 515"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                style={{ pathLength: line }}
              />
            </svg>

            {moments.map((moment, index) => (
              <motion.article className={`living-scene living-${moment.tone}`} key={moment.kicker} style={sceneStyles[index]}>
                <div className="living-copy">
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
            ))}
          </div>

          <div className="living-progress" aria-hidden="true">
            <span>seguir</span>
            <div><motion.i style={{ scaleX: line }} /></div>
          </div>
        </div>

        <motion.div className="living-words" style={{ x: wordX }} aria-hidden="true">
          <span>leer juntos</span><i>•</i><span>escuchar</span><i>•</i><span>volver</span><i>•</i><span>cuidar</span><i>•</i><span>aprender</span><i>•</i><span>compartir</span><i>•</i><span>abrir caminos</span>
        </motion.div>
      </div>
    </section>
  );
}
