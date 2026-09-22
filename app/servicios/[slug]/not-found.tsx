import Link from "next/link";

export default function ServiceNotFound() {
  return (
    <div className="hp-services-empty hp-service-not-found">
      <span>Propuesta no disponible</span>
      <h2>Esta actividad no está publicada.</h2>
      <Link className="hp-service-link" href="/servicios">Ver propuestas disponibles →</Link>
    </div>
  );
}
