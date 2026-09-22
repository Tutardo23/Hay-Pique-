import Image from "next/image";
import Link from "next/link";
import type { ServiceRecord } from "@/types/service";

const modalityLabels = {
  presencial: "Presencial",
  virtual: "Virtual",
  hibrida: "Híbrida",
  a_definir: "A definir",
} as const;

export function ServiceCard({ service, index = 0 }: { service: ServiceRecord; index?: number }) {
  const modality = service.modality ? modalityLabels[service.modality] : null;
  const firstImage = service.media_gallery?.find((item) => item.kind === "image");
  const cover = service.image_url || firstImage?.url || null;

  return (
    <article className={`hp-service-card hp-service-card-${(index % 4) + 1}`}>
      <Link href={`/servicios/${service.slug}`} className="hp-service-card-media" aria-label={`Ver ${service.title}`}>
        {cover ? (
          <Image src={cover} alt={service.image_alt || firstImage?.alt || service.title} fill sizes="(max-width: 760px) 88vw, (max-width: 1100px) 44vw, 360px" unoptimized={cover.startsWith("/api/media/service/")} />
        ) : (
          <div className="hp-service-placeholder" aria-hidden="true"><span>Hay Pique</span><i /></div>
        )}
        {service.media_gallery?.some((item) => item.kind === "video") ? <span className="hp-service-card-video-badge">Incluye video</span> : null}
      </Link>
      <div className="hp-service-card-body">
        <div className="hp-service-meta">
          {modality ? <span>{modality}</span> : null}
          {service.price_label ? <span>{service.price_label}</span> : null}
        </div>
        <h3>{service.title}</h3>
        {service.subtitle ? <p>{service.subtitle}</p> : null}
        <Link className="hp-service-link" href={`/servicios/${service.slug}`}>Conocer propuesta <span>→</span></Link>
      </div>
    </article>
  );
}
