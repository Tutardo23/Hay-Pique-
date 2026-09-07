import { MediaFrame } from "@/components/media/MediaFrame";
import { VideoFrame } from "@/components/media/VideoFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SocialSection() {
  return (
    <section className="social-section section">
      <div className="shell social-grid">
        <div>
          <SectionHeading
            label="La fundación en movimiento"
            title={<>La vida real <em>se muestra acá.</em></>}
            copy="Encuentros, aprendizajes, juegos y pequeños momentos que muestran la vida cotidiana de la fundación."
          />
          <a className="instagram-link" href="https://www.instagram.com/fundacion_hay_pique/" target="_blank" rel="noreferrer">@fundacion_hay_pique ↗</a>
        </div>
        <div className="social-gallery" data-lenis-prevent-horizontal>
          <MediaFrame
            className="social-shot"
            src="/images/social/abrazo.webp"
            alt="Abrazo durante una actividad de Hay Pique"
            position="center center"
          />
          <VideoFrame
            className="social-shot social-video"
            src="/videos/testimonio.mp4"
            poster="/images/posters/testimonio.jpg"
            label="Video compartido por Hay Pique"
          />
          <VideoFrame
            className="social-shot social-video"
            src="/videos/dia-del-nino.mp4"
            poster="/images/posters/dia-del-nino.jpg"
            label="Chicos bailando durante la celebración del Día del Niño en Hay Pique"
          />
        </div>
      </div>
    </section>
  );
}
