import { story } from "@/content/story";
import { MediaFrame } from "@/components/media/MediaFrame";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function StorySection() {
  return (
    <section className="story-section section" id="historia">
      <div className="shell story-grid">
        <div className="story-intro">
          <SectionHeading
            label="Nuestra historia"
            title={<>Todo empezó <em>acercándose.</em></>}
            copy="Antes de los programas y los proyectos hubo algo mucho más simple: acercarse, escuchar y quedarse. Esa forma de estar fue creciendo hasta convertirse en una red de acompañamiento."
          />
          <MediaFrame
            className="story-photo"
            src="/images/story/cuentos.webp"
            alt="Libros y cuentos utilizados en los primeros encuentros de Hay Pique"
            position="center center"
          />
          <p className="story-photo-note">Los cuentos estuvieron en el comienzo: una forma sencilla de encontrarse, compartir y empezar a construir confianza.</p>
        </div>
        <div className="story-list">
          {story.map(([number, title, text], index) => (
            <Reveal className="story-item" key={number} delay={index * .03}>
              <span className="doodle-number">{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
