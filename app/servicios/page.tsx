import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServiceCard } from "@/components/services/ServiceCard";
import { listPublishedServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Servicios con propósito",
  description:
    "Propuestas educativas y de formación de Fundación Hay Pique! que ayudan a sostener su trabajo social.",
  alternates: { canonical: "/servicios" },
};

export default async function ServicesPage() {
  const services = await listPublishedServices().catch(() => []);

  return (
    <main id="inicio">
      <Header />

      <section className="hp-services-page section">
        <div className="shell">
          <div className="hp-services-hero hp-services-hero-v2">
            <div className="hp-services-hero-copy">
              <div className="section-label">Servicios con propósito</div>

              <h1>
                Formación que <em>genera oportunidades.</em>
              </h1>

              <p>
                Propuestas educativas y de formación para personas e
                instituciones. Cada participación ayuda a sostener y ampliar el
                trabajo de Fundación Hay Pique!.
              </p>
            </div>

            <aside className="hp-services-purpose-note">
              <span>Una lógica simple</span>
              <strong>Aprender, participar y multiplicar.</strong>
              <p>
                Una propuesta puede tener valor económico y al mismo tiempo
                ayudar a que otras oportunidades lleguen a quienes más las
                necesitan.
              </p>
            </aside>
          </div>

          {services.length ? (
            <div className="hp-services-grid hp-services-grid-page">
              {services.map((service, index) => (
                <ServiceCard service={service} index={index} key={service.id} />
              ))}
            </div>
          ) : (
            <div className="hp-services-empty">
              <span>Próximamente</span>
              <h2>Estamos preparando nuevas propuestas.</h2>
              <p>Cuando haya una actividad abierta, la vas a encontrar acá.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
