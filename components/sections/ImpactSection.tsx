import { impact } from "@/content/impact";
import { SectionHeading } from "@/components/ui/SectionHeading";

function AllianceIcons() {
  return (
    <div className="impact-alliance-icons" aria-hidden="true">
      <svg viewBox="0 0 54 54">
        <path d="M27 7v9M22 11h10M15 47V25l12-9 12 9v22M22 47V34h10v13M12 47h30" />
      </svg>
      <svg viewBox="0 0 54 54">
        <path d="M8 46h38M12 46V23h30v23M10 23l17-12 17 12M19 29h6v7h-6zM29 29h6v7h-6zM24 46V39h6v7" />
      </svg>
      <svg viewBox="0 0 54 54">
        <path d="M18 24c4 0 7-3 7-7s-3-7-7-7-7 3-7 7 3 7 7 7ZM36 24c4 0 7-3 7-7s-3-7-7-7-7 3-7 7 3 7 7 7ZM6 45c1-10 5-15 12-15 5 0 8 2 9 5M48 45c-1-10-5-15-12-15-5 0-8 2-9 5M19 38l8 8 8-8" />
      </svg>
    </div>
  );
}

export function ImpactSection() {
  return (
    <section className="impact-section section">
      <div className="shell">
        <SectionHeading
          label="Nuestro horizonte"
          title={<>Crecer sin perder <em>la cercanía.</em></>}
          copy="Hay Pique quiere seguir creciendo sin perder aquello que le dio origen: la presencia, el vínculo y el acompañamiento cercano."
        />
        <span className="impact-note">Objetivos planteados hacia 2029</span>
        <div className="impact-grid">
          {impact.map(([value, label]) => (
            <div className="impact-card" key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
          <div className="impact-card impact-card-alliances">
            <AllianceIcons />
            <span>una red de alianzas cada vez más amplia</span>
          </div>
        </div>

        <div className="territory-map" aria-label="Presencia actual y horizonte territorial de Hay Pique">
          <div className="territory-copy">
            <span>Territorio</span>
            <h3>De donde estamos a donde queremos llegar.</h3>
            <p>Hoy la historia se construye en Yerba Buena, Tucumán. El proyecto de expansión territorial contempla crecer en Tucumán y llegar a Buenos Aires, con tres puntos geográficos proyectados hacia 2029.</p>
          </div>
          <div className="territory-route" aria-hidden="true">
            <div className="territory-point current"><i /><b>HOY</b><strong>Yerba Buena</strong><small>Tucumán</small></div>
            <svg viewBox="0 0 300 150" preserveAspectRatio="none">
              <path d="M42 38 C102 8 126 124 188 92 C228 72 235 117 266 122" />
            </svg>
            <div className="territory-point future"><i /><b>HORIZONTE</b><strong>Buenos Aires</strong><small>expansión proyectada</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}
