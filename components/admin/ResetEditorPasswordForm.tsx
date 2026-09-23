"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import {
  resetEditorPasswordAction,
  type TeamActionState,
} from "@/app/admin/equipo/actions";

function Submit() {
  const { pending } = useFormStatus();

  return (
    <button
      className="hp-admin-text-button"
      type="submit"
      disabled={pending}
    >
      {pending ? "Cambiando…" : "Cambiar contraseña"}
    </button>
  );
}

export function ResetEditorPasswordForm({ userId }: { userId: string }) {
  const action = resetEditorPasswordAction.bind(null, userId);
  const [state, formAction] = useActionState<TeamActionState, FormData>(
    action,
    {},
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="hp-user-reset-form">
      <div className="hp-user-reset-input">
        <KeyRound size={13} aria-hidden="true" />
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
          placeholder="Nueva contraseña"
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>

      <Submit />

      {state.error ? <small className="hp-user-inline-error">{state.error}</small> : null}
      {state.ok ? <small className="hp-user-inline-success">{state.ok}</small> : null}
    </form>
  );
}
