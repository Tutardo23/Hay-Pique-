import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPublishedServiceBySlug } from "@/lib/services";
import type { ServiceMedia } from "@/types/service";

const modalityLabels = { presencial: "Presencial", virtual: "Virtual", hibrida: "Híbrida", a_definir: "A definir" } as const;

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}

function MediaTile({ media, priority = false }: { media: ServiceMedia; priority?: boolean }) {
  return media.kind === "image" ? (
    <figure className="hp-service-gallery-item hp-service-gallery-image">
      <Image src={media.url} alt={media.alt || media.name} fill sizes="(max-width: 700px) 92vw, 520px" priority={priority} unoptimized={media.url.startsWith("/api/media/service/")} />
      {media.alt ? <figcaption>{media.alt}</figcaption> : null}
    </figure>
  ) : (
    <figure className="hp-service-gallery-item hp-service-gallery-video">
      <video src={media.url} controls playsInline preload="metadata" />
      {media.alt ? <figcaption>{media.alt}</figcaption> : null}
    </figure>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug).catch(() => null);
  if (!service) return { title: "Propuesta no encontrada" };
  const description = service.subtitle || service.description.slice(0, 155);
  return {
    title: service.title,
    description,
    alternates: { canonical: `/servicios/${service.slug}` },
    openGraph: { title: service.title, description, type: "website", images: service.image_url ? [{ url: service.image_url }] : undefined },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug).catch(() => null);
  if (!service) notFound();

  const highlights = service.highlights?.split("\n").map((item) => item.trim()).filter(Boolean) ?? [];
  const paragraphs = service.description.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
  const dateLabel = formatDate(service.starts_on);
  const modality = service.modality ? modalityLabels[service.modality] : null;
  const gallery = service.media_gallery ?? [];
  const firstImage = gallery.find((item) => item.kind === "image");
  const heroUrl = service.image_url || firstImage?.url || null;
  const heroAlt = service.image_alt || firstImage?.alt || service.title;
  const displayGallery = gallery.filter((item) => item.url !== heroUrl);

  return (
    <main id="inicio">
      <Header />
      <article className="hp-service-detail section">
        <div className="shell hp-service-detail-shell">
          <Link href="/servicios" className="hp-service-back">← Todas las propuestas</Link>

          <div className={`hp-service-detail-hero hp-service-detail-hero-v3 ${heroUrl ? "has-media" : "no-media"}`}>
            <div className="hp-service-detail-copy">
              <div className="section-label">Servicio con propósito</div>
              <h1>{service.title}</h1>
              {service.subtitle ? <p className="hp-service-lead">{service.subtitle}</p> : null}
              <div className="hp-service-pills">
                {dateLabel ? <span>{dateLabel}</span> : null}
                {modality ? <span>{modality}</span> : null}
                {service.duration ? <span>{service.duration}</span> : null}
                {service.price_label ? <span>{service.price_label}</span> : null}
              </div>
            </div>

            {heroUrl ? (
              <div className="hp-service-detail-image hp-service-detail-image-v3">
                <Image src={heroUrl} alt={heroAlt} fill priority sizes="(max-width: 900px) 92vw, 520px" unoptimized={heroUrl.startsWith("/api/media/service/")} />
              </div>
            ) : null}
          </div>

          <div className="hp-service-detail-grid hp-service-detail-grid-v3">
            <section className="hp-service-content hp-service-content-v3">
              <span className="hp-service-content-kicker">La propuesta</span>
              <h2>Sobre esta experiencia</h2>
              <div className="hp-service-copy-stack">{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>

              {highlights.length ? (
                <div className="hp-service-highlights">
                  <div><span className="hp-service-content-kicker">En concreto</span><h2>Qué vamos a trabajar</h2></div>
                  <ul>{highlights.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ul>
                </div>
              ) : null}
            </section>

            <aside className="hp-service-facts hp-service-facts-v3">
              <div className="hp-service-facts-head"><span>Información práctica</span><strong>Todo lo necesario, en un lugar.</strong></div>
              {service.audience ? <div><span>Para quién es</span><strong>{service.audience}</strong></div> : null}
              {service.professional_name ? <div><span>Quién acompaña</span><strong>{service.professional_name}</strong>{service.professional_role ? <small>{service.professional_role}</small> : null}</div> : null}
              {service.location ? <div><span>Lugar</span><strong>{service.location}</strong></div> : null}
              {service.time_label ? <div><span>Horario</span><strong>{service.time_label}</strong></div> : null}
              {service.capacity ? <div><span>Cupos</span><strong>{service.capacity}</strong></div> : null}
              {service.cta_url ? <a href={service.cta_url} target="_blank" rel="noreferrer" className="hp-service-cta">{service.cta_label || "Quiero participar"}<span>→</span></a> : null}
            </aside>
          </div>

          {displayGallery.length ? (
            <section className="hp-service-gallery-section">
              <div className="hp-service-gallery-heading">
                <span className="hp-service-content-kicker">Galería</span>
                <h2>Un poco más de la propuesta.</h2>
                <p>{displayGallery.length} {displayGallery.length === 1 ? "archivo" : "archivos"} · fotos y videos con tamaños controlados.</p>
              </div>
              <div className={`hp-service-gallery-grid count-${Math.min(displayGallery.length, 4)}`}>
                {displayGallery.map((media, index) => <MediaTile media={media} key={media.id} priority={index < 2} />)}
              </div>
            </section>
          ) : null}

          <section className="hp-service-purpose hp-service-purpose-v3">
            <div><span>Una propuesta con propósito</span><h2>Tu participación también acompaña.</h2></div>
            <p>Los ingresos generados por esta actividad contribuyen a sostener y ampliar las acciones de Fundación Hay Pique para quienes más lo necesitan.</p>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
