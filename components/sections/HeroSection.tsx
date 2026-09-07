import { MediaFrame } from "@/components/media/MediaFrame";
import { ActionButton } from "@/components/ui/ActionButton";

export function HeroSection() {
  return (
    <section className="hero section" aria-labelledby="hero-title">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <div className="section-label">Tucumán · Argentina</div>
          <h1 id="hero-title" className="hero-title">
            Estar cerca <em>puede <span className="hero-underline">cambiar</span></em> una historia.
          </h1>
          <p>
            Acompañamos a niños, niñas y jóvenes en sus trayectorias educativas,
            personales y sociales, construyendo oportunidades junto a sus familias
            y su comunidad.
          </p>

          <div className="hero-actions">
            <ActionButton href="#sumate">Quiero sumarme</ActionButton>
            <ActionButton href="#historia" variant="secondary">Conocé Hay Pique</ActionButton>
          </div>
        </div>

        <div className="hero-art">
          <MediaFrame
            className="hero-main-frame"
            src="/images/hero/hero-mochilas.webp"
            alt="Mochilas preparadas para las actividades educativas de Hay Pique"
            position="center 52%"
            priority
          />
          <MediaFrame
            className="hero-detail-frame"
            src="/images/hero/hero-detalle.webp"
            alt="Lápices de colores utilizados en las actividades de Hay Pique"
            position="center center"
          />
          <span className="hero-leaf" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
