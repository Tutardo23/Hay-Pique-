import { DrawnThread } from "@/components/motion/DrawnThread";
import { SectionHeading } from "@/components/ui/SectionHeading";

const instagram = "https://www.instagram.com/fundacion_hay_pique/";
const options = ["Ser voluntario/a", "Colaborar", "Generar una alianza", "Conocer más"] as const;

export function JoinSection() {
  return (
    <section className="join-section section" id="sumate">
      <DrawnThread className="join-thread" variant="join" />
      <div className="shell join-grid">
        <div>
          <span className="join-stamp">¿Hay pique?</span>
          <SectionHeading
            label="Sumate"
            title={<>Hay muchas maneras <em>de estar cerca.</em></>}
            copy="Cada persona, familia, institución u organización puede encontrar una manera distinta de acompañar."
          />
          <a className="join-contact" href={instagram} target="_blank" rel="noreferrer">Escribinos por Instagram ↗</a>
        </div>
        <div className="join-options">
          {options.map((option, index) => (
            <a
              className="join-row"
              key={option}
              href={instagram}
              target="_blank"
              rel="noreferrer"
              aria-label={`${option}. Contactar a Fundación Hay Pique por Instagram`}
            >
              <span>0{index + 1}</span>
              <strong>{option}</strong>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
