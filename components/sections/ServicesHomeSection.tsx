import Link from "next/link";
import { listFeaturedServices } from "@/lib/services";
import { ServiceCard } from "@/components/services/ServiceCard";

export async function ServicesHomeSection() {
  const services = await listFeaturedServices(3).catch(() => []);
  if (!services.length) return null;

  return (
    <section className="hp-services-home section" id="servicios">
      <div className="shell">
        <div className="hp-services-heading">
          <div>
            <div className="section-label">Servicios con propósito</div>
            <h2>Aprender también puede <em>multiplicar oportunidades.</em></h2>
            <p>
              Propuestas educativas y de formación abiertas a la comunidad. Cada participación
              ayuda a sostener el trabajo de Fundación Hay Pique y ampliar oportunidades.
            </p>
          </div>
          <Link href="/servicios" className="hp-services-all">Ver todas las propuestas →</Link>
        </div>
        <div className="hp-services-grid">
          {services.map((service, index) => (
            <ServiceCard service={service} index={index} key={service.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
