import Link from "next/link";
import { listAllServices } from "@/lib/services";
import { requireAdmin } from "@/lib/admin-auth";
import { createDemoServiceAction, deleteServicePermanentlyAction, setServiceStatusAction } from "@/app/admin/servicios/actions";

const statusLabel = { draft: "Borrador", published: "Publicado", archived: "Archivado" } as const;

export default async function AdminServicesPage() {
  const admin = await requireAdmin();
  const services = await listAllServices();

  return (
    <div className="hp-admin-page">
      <div className="hp-admin-page-header">
        <div>
          <span className="hp-admin-eyebrow">Hay Pique · Contenidos</span>
          <h1>Propuestas y servicios</h1>
          <p>Creá, revisá y publicá nuevas propuestas sin tocar la página ni el código.</p>
        </div>
        <div className="hp-admin-header-actions">
          {admin.role === "owner" ? (
            <form action={createDemoServiceAction}>
              <button className="hp-admin-button hp-admin-button-secondary" type="submit">
                Crear demo automática
              </button>
            </form>
          ) : null}
          <Link href="/admin/servicios/nuevo" className="hp-admin-button hp-admin-button-primary">
            + Nueva propuesta
          </Link>
        </div>
      </div>

      {services.length ? (
        <div className="hp-admin-service-list">
          {services.map((service) => {
            const publishAction = setServiceStatusAction.bind(null, service.id, "published");
            const draftAction = setServiceStatusAction.bind(null, service.id, "draft");
            const archiveAction = setServiceStatusAction.bind(null, service.id, "archived");
            const deleteAction = deleteServicePermanentlyAction.bind(null, service.id);
            return (
              <article className="hp-admin-service-row" key={service.id}>
                <div className="hp-admin-service-row-main">
                  <span className={`hp-admin-status hp-admin-status-${service.status}`}>{statusLabel[service.status]}</span>
                  <h2>{service.title}</h2>
                  <p>{service.subtitle || "Sin bajada todavía"}</p>
                  <small>Actualizado {new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(new Date(service.updated_at))}</small>
                </div>
                <div className="hp-admin-service-row-actions">
                  <Link href={`/admin/servicios/${service.id}/editar`} className="hp-admin-button hp-admin-button-secondary">Editar</Link>
                  {service.status === "published" ? (
                    <Link href={`/servicios/${service.slug}`} target="_blank" className="hp-admin-text-button">Ver ↗</Link>
                  ) : null}
                  {service.status === "draft" ? (
                    service.cta_url && (!service.image_url || service.media_authorized) ? (
                      <form action={publishAction}><button className="hp-admin-text-button" type="submit">Publicar</button></form>
                    ) : (
                      <Link href={`/admin/servicios/${service.id}/editar`} className="hp-admin-text-button">Completar para publicar</Link>
                    )
                  ) : null}
                  {service.status === "published" ? (
                    <form action={draftAction}><button className="hp-admin-text-button" type="submit">Despublicar</button></form>
                  ) : null}
                  {service.status !== "archived" ? (
                    <form action={archiveAction}><button className="hp-admin-text-button hp-admin-danger" type="submit">Archivar</button></form>
                  ) : (
                    <>
                      <form action={draftAction}>
                        <button className="hp-admin-text-button" type="submit">Restaurar</button>
                      </form>
                      {admin.role === "owner" ? (
                        <form action={deleteAction}>
                          <button
                            className="hp-admin-text-button hp-admin-danger"
                            type="submit"
                            title="Elimina definitivamente esta propuesta archivada"
                          >
                            Eliminar definitivamente
                          </button>
                        </form>
                      ) : null}
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="hp-admin-empty">
          <span>Tu primer servicio</span>
          <h2>Cuando tengan una propuesta, la cargan desde acá.</h2>
          <p>Podés guardarla como borrador, verla con calma y publicarla cuando esté lista.</p>
          {admin.role === "owner" ? (
            <form action={createDemoServiceAction}>
              <button className="hp-admin-button hp-admin-button-primary" type="submit">
                Crear demo completa automáticamente
              </button>
            </form>
          ) : (
            <Link href="/admin/servicios/nuevo" className="hp-admin-button hp-admin-button-primary">
              Crear primera propuesta
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
