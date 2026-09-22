import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { createServiceAction } from "@/app/admin/servicios/actions";

export default function NewServicePage() {
  return (
    <div className="hp-admin-page hp-admin-editor-page">
      <div className="hp-admin-page-header hp-admin-page-header-small">
        <div><span className="hp-admin-eyebrow">Nueva propuesta</span><h1>Contemos de qué se trata.</h1><p>Podés dejarla como borrador y publicarla recién cuando esté lista.</p></div>
      </div>
      <ServiceEditor action={createServiceAction} />
    </div>
  );
}
