import { DrawnThread } from "@/components/motion/DrawnThread";
import { MediaFrame } from "@/components/media/MediaFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function NetworkSection() {
  return (
    <section className="network-section section">
      <div className="shell network-grid">
        <div className="network-copy">
          <SectionHeading
            label="Una red que acompaña"
            title={<>Nadie hace esto <em>solo.</em></>}
            copy="Acá se encuentran personas e instituciones que, desde distintos lugares, se comprometen y aportan su tiempo, sus conocimientos y sus recursos para transformar realidades."
          />
          <div className="fonbec-card">
            <span className="fonbec-label">Becas</span>
            <strong>9 chicos</strong>
            <p>cuentan con padrinos que acompañan económicamente sus trayectorias escolares gracias a la articulación con FONBEC.</p>
          </div>
        </div>
        <div className="network-photo">
          <DrawnThread className="network-thread" variant="network" />
          <MediaFrame
            className="network-main"
            src="/images/network/red-comunidad-nueva.webp"
            alt="Comunidad de Hay Pique reunida en una actividad compartida"
            position="center center"
          />
          <span className="network-chip nc1">familias</span>
          <span className="network-chip nc2">instituciones educativas</span>
          <span className="network-chip nc3">profesionales</span>
          <span className="network-chip nc4">voluntarios</span>
          <span className="network-chip nc5">parroquias + organizaciones</span>
          <span className="network-chip nc6">padrinos</span>
        </div>
      </div>
    </section>
  );
}
