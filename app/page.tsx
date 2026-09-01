import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Heart, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { LivingScroll } from "@/components/LivingScroll";
import { MediaSlot } from "@/components/MediaSlot";
import { Reveal } from "@/components/Reveal";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { actions, programs, story } from "@/lib/content";

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main id="inicio">
      <Header />

      <section className="hero section-pad">
        <div className="shell hero-grid">
          <Reveal className="hero-copy">
            <div className="eyebrow"><span /> Tucumán · Argentina</div>
            <h1>Estar cerca <em>puede cambiar</em> una historia.</h1>
            <p className="hero-lead">
              Acompañamos a niños, niñas y jóvenes en sus trayectorias educativas, personales y sociales,
              construyendo oportunidades junto a sus familias y su comunidad.
            </p>
            <div className="hero-actions">
              <Link href="#historia" className="btn btn-dark">Conocé Hay Pique <ArrowDownRight size={18}/></Link>
              <Link href="#sumate" className="btn btn-ghost">Quiero sumarme <ArrowUpRight size={18}/></Link>
            </div>
            <div className="manifesto-mini">
              <span className="hand-line" />
              Creyendo en la educación como instrumento de paz y de unión.
            </div>
          </Reveal>

          <Reveal className="hero-art" delay={0.05}>
            <div className="hero-collage">
              <MediaSlot
                className="hero-photo-main"
                label="FOTO PRINCIPAL"
                note="niños + voluntarios en apoyo escolar · horizontal o 4:5"
              />
              <MediaSlot
                className="hero-photo-detail"
                label="FOTO DETALLE"
                note="manos, cuaderno, lectura o merienda"
              />
              <div className="hero-logo-card">
                <Image src="/brand/logo-hay-pique.jpeg" alt="Logo Fundación Hay Pique!" width={900} height={740} priority sizes="180px" />
              </div>
              <div className="tag tag-aqua">APRENDER</div>
              <div className="tag tag-pink">ACOMPAÑAR</div>
              <div className="tag tag-green">CUIDAR</div>
              <div className="caption-card"><Sparkles size={17}/><span>Una red que se construye estando cerca.</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      <LivingScroll />

      <section className="origin section-pad" id="historia">
        <div className="shell origin-grid">
          <div className="origin-intro">
            <Reveal>
              <div className="eyebrow"><span /> Nuestra historia</div>
              <h2>Todo empezó <em>acercándose.</em></h2>
              <p>
                Antes de los programas y los proyectos hubo algo mucho más simple: acercarse, escuchar y quedarse.
                Esa forma de estar fue creciendo hasta convertirse en una red de acompañamiento.
              </p>
              <div className="origin-note">
                <span>De un encuentro simple</span>
                <strong>a una red que sigue creciendo.</strong>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <MediaSlot
                className="origin-photo"
                label="FOTO DE ORIGEN / TERRITORIO"
                note="ideal: Catalina/equipo con chicos o una imagen que represente los primeros años"
              />
            </Reveal>
          </div>

          <div className="story-line">
            {story.map(([number, title, text], index) => (
              <Reveal className="story-step" key={number} delay={index * 0.03}>
                <div className="story-number">{number}</div>
                <div><h3>{title}</h3><p>{text}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="wednesday section-pad">
        <div className="shell">
          <Reveal className="wednesday-head">
            <div className="eyebrow"><span /> Un miércoles · Yerba Buena</div>
            <h2>La siesta tucumana <em>se llena de encuentros.</em></h2>
            <p>Acá van las fotos que mejor cuenten el ritmo del apoyo escolar: llegar, encontrarse, aprender y compartir.</p>
          </Reveal>

          <div className="day-board" aria-label="Lugares para fotografías de un miércoles en Hay Pique">
            <MediaSlot className="day-photo photo-one" label="LLEGAR" note="foto horizontal · llegada / saludo / grupo" />
            <MediaSlot className="day-photo photo-two" label="ENCONTRARSE" note="foto o reel · chicos + voluntarios" />
            <MediaSlot className="day-photo photo-three" label="APRENDER" note="foto detalle · tarea / lectura / útiles" />
            <MediaSlot className="day-photo photo-four" label="COMPARTIR" note="foto · merienda / cierre / comunidad" />
          </div>

          <Reveal className="day-footnote">
            <span>Una vez por semana.</span>
            <p>No se trata solamente de hacer una tarea. Se trata de construir continuidad, confianza y un espacio donde cada chico sepa que alguien lo espera.</p>
          </Reveal>
        </div>
      </section>

      <section className="actions section-pad" id="que-hacemos">
        <div className="shell">
          <Reveal className="actions-head">
            <div className="eyebrow"><span /> Así acompañamos</div>
            <h2>Estar cerca toma <em>muchas formas.</em></h2>
            <p>Educación, cuidado, vínculos y oportunidades se cruzan porque cada historia necesita algo distinto.</p>
          </Reveal>

          <div className="action-cards" aria-label="Formas de acompañamiento">
            {actions.map((item, index) => (
              <div key={item.number} className={`action-card-wrap action-${item.accent}`}>
                <FloatingCard eyebrow={`${item.number} · ${item.verb}`} title={item.title} description={item.text} rotate={[-1.2, .8, -.5, .7][index]}>
                  <div className="action-media-label">FOTO {index === 3 ? "OFICIOS" : index === 2 ? "SALUD / CUIDADO" : index === 1 ? "ACOMPAÑAMIENTO" : "APOYO ESCOLAR"}</div>
                </FloatingCard>
              </div>
            ))}
          </div>
          <p className="swipe-hint">Deslizá para recorrer →</p>
        </div>
      </section>

      <section className="network section-pad">
        <div className="shell network-grid">
          <Reveal className="network-copy">
            <div className="eyebrow"><span /> Una red que acompaña</div>
            <h2>Nadie hace esto <em>solo.</em></h2>
            <p>Acompañar de verdad también es tejer vínculos. Familias, escuelas, profesionales, organizaciones y personas que se acercan hacen posible llegar más lejos sin perder la cercanía.</p>
            <div className="network-note">La red no es un organigrama: son personas que se encuentran alrededor de una necesidad concreta.</div>
          </Reveal>

          <Reveal className="network-portrait" delay={0.05}>
            <MediaSlot label="FOTO DE RED / COMUNIDAD" note="una foto grupal, articulación con otra institución o actividad compartida" />
            <div className="network-label nl-1">familias</div>
            <div className="network-label nl-2">escuelas</div>
            <div className="network-label nl-3">profesionales</div>
            <div className="network-label nl-4">voluntarios</div>
            <div className="network-label nl-5">organizaciones</div>
          </Reveal>
        </div>
      </section>

      <section className="programs section-pad" id="programas">
        <div className="shell programs-grid">
          <Reveal className="programs-title">
            <div className="eyebrow"><span /> Programas y proyectos</div>
            <h2>Una estructura para <em>seguir creciendo.</em></h2>
            <p>Los nombres institucionales ordenan un trabajo que en el territorio sucede de manera integrada.</p>
          </Reveal>
          <div className="program-list">
            {programs.map(([title, text], index) => (
              <Reveal className="program-item" key={title} delay={index * 0.03}>
                <div className="program-index">0{index + 1}</div>
                <div><h3>{title}</h3><p>{text}</p></div>
                <span className="program-arrow">↗</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="horizon section-pad">
        <div className="shell">
          <Reveal className="horizon-head">
            <div className="eyebrow"><span /> Nuestro horizonte</div>
            <h2>Crecer sin perder <em>la cercanía.</em></h2>
            <p>La planificación de la fundación plantea estos objetivos hacia 2029. Son metas futuras, no resultados actuales.</p>
          </Reveal>
          <div className="horizon-grid">
            <div className="h-card h-a"><strong>40</strong><span>niños/as acompañados sostenidamente</span></div>
            <div className="h-card h-b"><strong>4</strong><span>puntos geográficos proyectados</span></div>
            <div className="h-card h-c"><strong>2</strong><span>territorios: Tucumán + Buenos Aires</span></div>
            <div className="h-card h-d"><Heart size={30}/><span>una red de alianzas cada vez más amplia</span></div>
          </div>
          <p className="swipe-hint">Deslizá para recorrer →</p>
        </div>
      </section>

      <section className="social section-pad">
        <div className="shell social-grid">
          <Reveal className="social-copy">
            <div className="eyebrow"><span /> La fundación en movimiento</div>
            <h2>La vida real <em>entra acá.</em></h2>
            <p>Esta sección queda preparada para reemplazar los espacios por publicaciones, fotos y reels reales. No queremos un feed decorativo: queremos mostrar la vida de la fundación.</p>
            <a className="instagram-link" href="https://www.instagram.com/fundacion_hay_pique/" target="_blank" rel="noreferrer"><InstagramIcon size={20}/> @fundacion_hay_pique <ArrowUpRight size={17}/></a>
          </Reveal>
          <div className="social-collage">
            <MediaSlot className="social-shot ss1" label="FOTO" note="apoyo escolar · 4:5" />
            <MediaSlot className="social-shot ss2" label="REEL" note="encuentro en movimiento · vertical" />
            <MediaSlot className="social-shot ss3" label="FOTO" note="oficios / salud / comunidad" />
          </div>
        </div>
      </section>

      <section className="join section-pad" id="sumate">
        <div className="shell join-inner">
          <Reveal>
            <div className="join-mark">¿Hay pique?</div>
            <h2>Hay muchas maneras <em>de estar cerca.</em></h2>
            <p>Cuando Cata confirme las formas reales de colaborar, acá conectamos cada opción con su acción correspondiente.</p>
          </Reveal>
          <div className="join-options">
            <div className="join-option"><span>01</span><strong>Ser voluntario/a</strong><b>↗</b></div>
            <div className="join-option"><span>02</span><strong>Colaborar</strong><b>↗</b></div>
            <div className="join-option"><span>03</span><strong>Generar una alianza</strong><b>↗</b></div>
            <div className="join-option"><span>04</span><strong>Saber más</strong><b>↗</b></div>
          </div>
        </div>
      </section>

      <footer className="footer section-pad">
        <div className="shell footer-grid">
          <div className="footer-logo"><Image src="/brand/logo-hay-pique.jpeg" alt="Fundación Hay Pique!" width={170} height={140}/></div>
          <div><span>Fundación Hay Pique!</span><p>Tucumán, Argentina</p></div>
          <div><span>Redes</span><a href="https://www.instagram.com/fundacion_hay_pique/" target="_blank" rel="noreferrer">Instagram ↗</a></div>
          <div className="credit">Diseño y desarrollo<br/><strong>AUTOMATE</strong></div>
        </div>
      </footer>
    </main>
  );
}
