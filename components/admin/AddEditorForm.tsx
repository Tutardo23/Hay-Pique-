"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, KeyRound, Sparkles, UserPlus } from "lucide-react";
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
      <UserPlus size={15} aria-hidden="true" />
      {pending ? "Creando usuario…" : "Crear usuario"}
    </button>
  );
}

function makePassword() {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#%&*";
  const values = new Uint32Array(18);
  crypto.getRandomValues(values);

  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

export function AddEditorForm() {
  const [state, action] = useActionState<TeamActionState, FormData>(
    addEditorAction,
    {},
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="hp-admin-add-editor hp-user-create-form">
      <div className="hp-user-form-grid">
        <label className="hp-admin-field">
          <span>Nombre</span>
          <input
            name="displayName"
            type="text"
            autoComplete="off"
            required
            placeholder="Cata"
            maxLength={60}
          />
        </label>

        <label className="hp-admin-field">
          <span>Usuario</span>
          <input
            name="username"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            required
            minLength={4}
            maxLength={32}
            placeholder="cata"
          />
          <small>Solo letras, números y guion bajo. No necesita email.</small>
        </label>
      </div>

      <label className="hp-admin-field">
        <span>Contraseña inicial</span>
        <div className="hp-user-password-row">
          <div className="hp-user-password-input">
            <KeyRound size={15} aria-hidden="true" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={12}
              maxLength={128}
              required
              placeholder="Mínimo 12 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <button
            type="button"
            className="hp-admin-button hp-admin-button-secondary hp-user-generate"
            onClick={() => {
              setPassword(makePassword());
              setShowPassword(true);
            }}
          >
            <Sparkles size={14} aria-hidden="true" />
            Generar
          </button>
        </div>
        <small>
          La contraseña va directamente a Clerk. Hay Pique no la guarda en Neon.
        </small>
      </label>

      <Button />

      {state.error ? <p className="hp-admin-error">{state.error}</p> : null}
      {state.ok ? <p className="hp-admin-success">{state.ok}</p> : null}
    </form>
  );
}
