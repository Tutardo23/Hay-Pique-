import { programs } from "@/content/programs";
import { MediaFrame } from "@/components/media/MediaFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProgramsSection() {
  return (
    <section className="programs-section section" id="programas">
      <div className="shell">
        <SectionHeading
          label="Así acompañamos"
          title={<>Estar cerca toma <em>muchas formas.</em></>}
          copy="Educación, cuidado, vínculos y oportunidades se cruzan porque cada historia necesita algo distinto. Los programas ordenan ese trabajo sin perder la mirada integral."
        />
        <div className="programs-cards">
          {programs.map((program) => (
            <article className="program-card" key={program.number}>
              <div>
                <div className="program-card-head"><span className="doodle-number">{program.number}</span></div>
                <h3>{program.title}</h3>
                <p>{program.text}</p>
              </div>
              <MediaFrame
                className="program-media"
                src={program.src}
                alt={program.alt}
                position={program.position}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
