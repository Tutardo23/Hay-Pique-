import { MediaFrame } from "@/components/media/MediaFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";

const shots = [
  {
    label: "ESPERAR",
    src: "/images/wednesday/esperar.webp",
    alt: "Tablones preparados antes de un encuentro de Hay Pique",
    position: "center 46%",
  },
  {
    label: "ENCONTRARSE",
    src: "/images/wednesday/encontrarse.webp",
    alt: "Chicos y voluntarios reunidos durante un encuentro de Hay Pique",
    position: "center center",
  },
  {
    label: "APRENDER",
    src: "/images/wednesday/aprender.webp",
    alt: "Chicos realizando tareas durante el apoyo escolar de Hay Pique",
    position: "center center",
  },
  {
    label: "COMPARTIR",
    src: "/images/wednesday/compartir.webp",
    alt: "Momento compartido durante una actividad de Hay Pique",
    position: "center center",
  },
] as const;

export function WednesdaySection() {
  return (
    <section className="wednesday-section section">
      <div className="shell">
        <SectionHeading
          label="Un miércoles · Yerba Buena"
          title={<>Así los esperamos. <em>Después, todo se llena de encuentros.</em></>}
          copy="Los tablones vacíos son parte de la espera. Después llegan las mochilas, las tareas, las conversaciones y la merienda. Cada miércoles vuelve a empezar."
        />
        <div className="wednesday-strip" data-lenis-prevent-horizontal>
          {shots.map((shot) => (
            <div className="wednesday-shot-wrap" key={shot.label}>
              <MediaFrame
                className="wednesday-shot"
                src={shot.src}
                alt={shot.alt}
                position={shot.position}
              />
              <span>{shot.label}</span>
            </div>
          ))}
        </div>
        <div className="wednesday-caption">
          <strong>Una vez por semana.</strong>
          <p>No se trata solamente de hacer una tarea. Se trata de construir continuidad, confianza y un espacio donde cada chico sepa que alguien lo espera.</p>
        </div>
      </div>
    </section>
  );
}
