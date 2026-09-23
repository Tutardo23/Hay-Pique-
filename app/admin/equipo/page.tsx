import { clerkClient } from "@clerk/nextjs/server";
import { AddEditorForm } from "@/components/admin/AddEditorForm";
import { ResetEditorPasswordForm } from "@/components/admin/ResetEditorPasswordForm";
import { removeEditorAction } from "@/app/admin/equipo/actions";
import { requireOwner } from "@/lib/admin-auth";

export default async function TeamPage() {
  const owner = await requireOwner();
  const client = await clerkClient();

  const { data: users } = await client.users.getUserList({
    limit: 100,
    orderBy: "-created_at",
  });

  const editors = users.filter(
    (user) => user.privateMetadata?.hayPiqueRole === "editor",
  );

  return (
    <div className="hp-admin-page">
      <div className="hp-admin-page-header">
        <div>
          <span className="hp-admin-eyebrow">Seguridad</span>
          <h1>Usuarios del panel</h1>
          <p>
            Vos creás el usuario y una contraseña inicial. La persona entra
            directamente al panel sin Gmail, invitaciones ni registro público.
          </p>
        </div>
      </div>

      <div className="hp-admin-team-card hp-team-v2">
        <div className="hp-admin-team-owner">
          <span>Propietario</span>
          <strong>{owner.email}</strong>
          <small>
            Tu acceso con Google sigue disponible como acceso del propietario.
          </small>
        </div>

        <div className="hp-team-create">
          <div>
            <span className="hp-admin-eyebrow">Nuevo acceso</span>
            <h2>Crear usuario</h2>
            <p>
              Por ejemplo: usuario <strong>cata</strong> y una contraseña que
              después le pasás de forma privada.
            </p>
          </div>

          <AddEditorForm />
        </div>
      </div>

      <div className="hp-admin-team-list hp-team-list-v2">
        {editors.map((editor) => {
          const remove = removeEditorAction.bind(null, editor.id);
          const username = editor.username || editor.id;
          const displayName =
            editor.fullName || editor.firstName || editor.username || "Editor";

          return (
            <article className="hp-team-user-row" key={editor.id}>
              <div className="hp-team-user-main">
                <span className="hp-team-avatar" aria-hidden="true">
                  {displayName.slice(0, 1).toUpperCase()}
                </span>

                <div>
                  <strong>{displayName}</strong>
                  <small>@{username} · Editor</small>
                </div>
              </div>

              <div className="hp-team-user-controls">
                <ResetEditorPasswordForm userId={editor.id} />

                <form action={remove}>
                  <button
                    className="hp-admin-text-button hp-admin-danger"
                    type="submit"
                  >
                    Quitar acceso
                  </button>
                </form>
              </div>
            </article>
          );
        })}

        {!editors.length ? (
          <div className="hp-team-empty">
            <strong>Todavía no hay usuarios adicionales.</strong>
            <p>Creá el usuario de Cata arriba y ya va a poder entrar.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
