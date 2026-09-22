"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  addEditorAction,
  type TeamActionState,
} from "@/app/admin/equipo/actions";

function Button() {
  const { pending } = useFormStatus();

  return (
    <button
      className="hp-admin-button hp-admin-button-primary"
      disabled={pending}
      type="submit"
    >
      {pending ? "Habilitando…" : "Habilitar Gmail"}
    </button>
  );
}

export function AddEditorForm() {
  const [state, action] = useActionState<TeamActionState, FormData>(
    addEditorAction,
    {},
  );

  return (
    <form action={action} className="hp-admin-add-editor">
      <label className="hp-admin-field">
        <span>Gmail autorizado</span>
        <input
          name="email"
          type="email"
          inputMode="email"
          autoComplete="off"
          required
          placeholder="nombre@gmail.com"
        />
        <small>
          No recibe invitación. Una vez habilitado, entra directamente con su
          cuenta de Google.
        </small>
      </label>

      <Button />

      {state.error ? <p className="hp-admin-error">{state.error}</p> : null}
      {state.ok ? <p className="hp-admin-success">{state.ok}</p> : null}
    </form>
  );
}
