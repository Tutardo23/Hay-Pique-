"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ServiceMediaManager } from "@/components/admin/ServiceMediaManager";
import type { ServiceActionState } from "@/app/admin/servicios/actions";
import type { ServiceRecord } from "@/types/service";

function SubmitButton({ intent, children, secondary = false }: { intent: string; children: React.ReactNode; secondary?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="intent"
      value={intent}
      disabled={pending}
      className={`hp-admin-button ${secondary ? "hp-admin-button-secondary" : "hp-admin-button-primary"}`}
    >
      {pending ? "Guardando…" : children}
    </button>
  );
}

type Action = (previousState: ServiceActionState, formData: FormData) => Promise<ServiceActionState>;

export function ServiceEditor({
  service,
  action,
}: {
  service?: ServiceRecord | null;
  action: Action;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="hp-admin-editor">
      {state.error ? <div className="hp-admin-alert hp-admin-alert-error">{state.error}</div> : null}

      <section className="hp-admin-form-section">
        <div className="hp-admin-form-heading">
          <span>01</span>
          <div><h2>Lo esencial</h2><p>Lo primero que va a ver una persona cuando encuentre la propuesta.</p></div>
        </div>
        <div className="hp-admin-form-grid">
          <label className="hp-admin-field hp-admin-field-wide">
            <span>Nombre de la propuesta *</span>
            <input name="title" defaultValue={service?.title ?? ""} maxLength={120} required placeholder="Ej. Armá tu CV" />
          </label>
          <label className="hp-admin-field hp-admin-field-wide">
            <span>Bajada corta</span>
            <input name="subtitle" defaultValue={service?.subtitle ?? ""} maxLength={180} placeholder="Una frase que explique por qué puede servir" />
          </label>
          <label className="hp-admin-field hp-admin-field-wide">
            <span>Descripción *</span>
            <textarea name="description" defaultValue={service?.description ?? ""} rows={7} maxLength={5000} required placeholder="Contá de qué se trata, con un lenguaje simple y cercano." />
          </label>
          <label className="hp-admin-field hp-admin-field-wide">
            <span>Qué se va a trabajar</span>
            <textarea name="highlights" defaultValue={service?.highlights ?? ""} rows={5} maxLength={2500} placeholder={`Un punto por línea. Por ejemplo:\nReconocer experiencias y habilidades\nOrdenar la información\nArmar un CV claro`} />
          </label>
          <label className="hp-admin-field hp-admin-field-wide hp-admin-advanced-field">
            <span>Dirección de la página (opcional)</span>
            <input name="slug" defaultValue={service?.slug ?? ""} maxLength={100} placeholder="Se genera sola si lo dejás vacío" />
            <small>No hace falta tocar esto normalmente.</small>
          </label>
        </div>
      </section>

      <section className="hp-admin-form-section">
        <div className="hp-admin-form-heading">
          <span>02</span>
          <div><h2>Fotos y videos</h2><p>Elegí una portada y, si querés, sumá una galería. El diseño mantiene tamaños controlados aunque carguen muchos archivos.</p></div>
        </div>
        <ServiceMediaManager initialCover={service?.image_url} initialGallery={service?.media_gallery ?? []} />
        <label className="hp-admin-field hp-admin-field-wide">
          <span>Descripción de la portada</span>
          <input name="image_alt" defaultValue={service?.image_alt ?? ""} maxLength={220} placeholder="Ej. Jóvenes participando del taller" />
        </label>
        <label className="hp-admin-check hp-admin-auth-check">
          <input type="checkbox" name="media_authorized" defaultChecked={service?.media_authorized ?? false} />
          <span>
            <strong>Confirmo que todo el material multimedia puede publicarse.</strong>
            <small>Marcá esto solamente cuando la fundación tenga autorización para usar las fotos y videos cargados.</small>
          </span>
        </label>
      </section>

      <section className="hp-admin-form-section">
        <div className="hp-admin-form-heading">
          <span>03</span>
          <div><h2>Datos prácticos</h2><p>Completá solo lo que corresponda a esta propuesta.</p></div>
        </div>
        <div className="hp-admin-form-grid">
          <label className="hp-admin-field hp-admin-field-wide">
            <span>¿Para quién es?</span>
            <input name="audience" defaultValue={service?.audience ?? ""} maxLength={300} placeholder="Ej. Jóvenes y adultos" />
          </label>
          <label className="hp-admin-field">
            <span>Profesional a cargo</span>
            <input name="professional_name" defaultValue={service?.professional_name ?? ""} maxLength={150} />
          </label>
          <label className="hp-admin-field">
            <span>Presentación profesional</span>
            <input name="professional_role" defaultValue={service?.professional_role ?? ""} maxLength={220} placeholder="Ej. Lic. en Recursos Humanos" />
          </label>
          <label className="hp-admin-field">
            <span>Modalidad</span>
            <select name="modality" defaultValue={service?.modality ?? ""}>
              <option value="">Sin definir</option>
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
              <option value="hibrida">Híbrida</option>
              <option value="a_definir">A definir</option>
            </select>
          </label>
          <label className="hp-admin-field">
            <span>Lugar</span>
            <input name="location" defaultValue={service?.location ?? ""} maxLength={220} placeholder="Ej. Yerba Buena" />
          </label>
          <label className="hp-admin-field">
            <span>Fecha</span>
            <input type="date" name="starts_on" defaultValue={service?.starts_on ?? ""} />
          </label>
          <label className="hp-admin-field">
            <span>Horario</span>
            <input name="time_label" defaultValue={service?.time_label ?? ""} maxLength={80} placeholder="Ej. 18:00 a 20:00" />
          </label>
          <label className="hp-admin-field">
            <span>Duración</span>
            <input name="duration" defaultValue={service?.duration ?? ""} maxLength={100} placeholder="Ej. 2 horas" />
          </label>
          <label className="hp-admin-field">
            <span>Valor</span>
            <input name="price_label" defaultValue={service?.price_label ?? ""} maxLength={100} placeholder="Ej. $25.000 o Consultar" />
          </label>
          <label className="hp-admin-field">
            <span>Cupos</span>
            <input type="number" min="1" max="100000" name="capacity" defaultValue={service?.capacity ?? ""} />
          </label>
        </div>
      </section>

      <section className="hp-admin-form-section">
        <div className="hp-admin-form-heading">
          <span>04</span>
          <div><h2>Inscripción o contacto</h2><p>Hay Pique no procesa tarjetas: este botón lleva al medio que ustedes elijan.</p></div>
        </div>
        <div className="hp-admin-form-grid">
          <label className="hp-admin-field">
            <span>Texto del botón</span>
            <input name="cta_label" defaultValue={service?.cta_label ?? "Quiero participar"} maxLength={80} />
          </label>
          <label className="hp-admin-field hp-admin-field-wide">
            <span>Enlace *</span>
            <input type="url" name="cta_url" defaultValue={service?.cta_url ?? ""} maxLength={2048} placeholder="https://..." />
            <small>Puede ser TotalCoin, un formulario, WhatsApp u otro enlace seguro.</small>
          </label>
          <label className="hp-admin-check">
            <input type="checkbox" name="featured" defaultChecked={service?.featured ?? false} />
            <span><strong>Mostrar también en la página principal</strong><small>Solo aparecen hasta tres propuestas destacadas.</small></span>
          </label>
        </div>
      </section>

      <div className="hp-admin-editor-footer">
        <Link href="/admin/servicios" className="hp-admin-text-button">Cancelar</Link>
        <div className="hp-admin-editor-actions">
          <SubmitButton intent="save" secondary>Guardar</SubmitButton>
          <SubmitButton intent="publish">Guardar y publicar</SubmitButton>
        </div>
      </div>
    </form>
  );
}
