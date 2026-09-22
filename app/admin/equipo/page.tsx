import { AddEditorForm } from "@/components/admin/AddEditorForm";
import { removeEditorAction } from "@/app/admin/equipo/actions";
import { requireOwner } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

export default async function TeamPage() {
  const owner = await requireOwner();
  const sql = getSql();

  const editors = (await sql`
    SELECT email, created_at
    FROM hp_admin_users
    ORDER BY created_at DESC
  `) as Array<{ email: string; created_at: string }>;

  return (
    <div className="hp-admin-page">
      <div className="hp-admin-page-header">
        <div>
          <span className="hp-admin-eyebrow">Seguridad</span>
          <h1>Quién puede entrar</h1>
          <p>
            Agregás el Gmail acá y queda habilitado de inmediato. No se manda
            invitación: la persona entra normalmente con “Continuar con Google”.
          </p>
        </div>
      </div>

      <div className="hp-admin-team-card">
        <div className="hp-admin-team-owner">
          <span>Propietario</span>
          <strong>{owner.email}</strong>
          <small>Se define mediante HAYPIQUE_OWNER_EMAIL.</small>
        </div>

        <AddEditorForm />
      </div>

      <div className="hp-admin-team-list">
        {editors.map((editor) => {
          const remove = removeEditorAction.bind(null, editor.email);

          return (
            <div key={editor.email}>
              <div>
                <strong>{editor.email}</strong>
                <small>
                  Acceso directo con Google · no necesita aceptar invitaciones
                </small>
              </div>

              <form action={remove}>
                <button
                  className="hp-admin-text-button hp-admin-danger"
                  type="submit"
                >
                  Quitar acceso
                </button>
              </form>
            </div>
          );
        })}

        {!editors.length ? (
          <p>
            Todavía no agregaste editores. Escribí el Gmail de Cata arriba y
            podrá entrar directamente con Google.
          </p>
        ) : null}
      </div>
    </div>
  );
}
