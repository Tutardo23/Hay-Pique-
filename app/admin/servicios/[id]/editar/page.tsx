import { notFound } from "next/navigation";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { updateServiceAction } from "@/app/admin/servicios/actions";
import { getServiceById } from "@/lib/services";

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ guardado?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const service = await getServiceById(id);
  if (!service) notFound();
  const action = updateServiceAction.bind(null, id);

  return (
    <div className="hp-admin-page hp-admin-editor-page">
      <div className="hp-admin-page-header hp-admin-page-header-small">
        <div>
          <span className="hp-admin-eyebrow">Editar propuesta</span>
          <h1>{service.title}</h1>
          <p>{service.status === "published" ? "Está publicada. Los cambios guardados se verán en la web." : "Todavía no está visible públicamente."}</p>
        </div>
      </div>
      {query.guardado === "1" ? <div className="hp-admin-alert hp-admin-alert-ok">Cambios guardados.</div> : null}
      <ServiceEditor service={service} action={action} />
    </div>
  );
}
