"use client";

import { useSignIn } from "@clerk/nextjs/legacy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";

type ClerkErrorShape = {
  errors?: Array<{
    code?: string;
    message?: string;
    longMessage?: string;
  }>;
};

function friendlyError(error: unknown) {
  const clerkError = error as ClerkErrorShape;
  const code = clerkError?.errors?.[0]?.code ?? "";

  if (
    code.includes("password") ||
    code.includes("identifier") ||
    code.includes("not_found")
  ) {
    return "Usuario o contraseña incorrectos.";
  }

  return "No pudimos iniciar sesión. Revisá los datos e intentá nuevamente.";
}

export function UsernamePasswordSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLoaded || !signIn || !setActive || busy) return;

    setBusy(true);
    setError("");

    try {
      const attempt = await signIn.create({
        identifier: username.trim().toLowerCase(),
        password,
      });

      if (attempt.status !== "complete" || !attempt.createdSessionId) {
        setError(
          "Este acceso necesita una verificación adicional. Pedile al administrador que revise el usuario.",
        );
        return;
      }

      await setActive({ session: attempt.createdSessionId });
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="hp-credential-login" onSubmit={handleSubmit}>
      <label className="hp-credential-field">
        <span>Usuario</span>
        <div className="hp-credential-input">
          <UserRound size={17} aria-hidden="true" />
          <input
            name="username"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="username"
            spellCheck={false}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="tu usuario"
            minLength={4}
            maxLength={64}
            required
          />
        </div>
      </label>

      <label className="hp-credential-field">
        <span>Contraseña</span>
        <div className="hp-credential-input">
          <LockKeyhole size={17} aria-hidden="true" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tu contraseña"
            required
          />
          <button
            type="button"
            className="hp-credential-eye"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? (
              <EyeOff size={16} aria-hidden="true" />
            ) : (
              <Eye size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </label>

      <button
        className="hp-credential-submit"
        type="submit"
        disabled={!isLoaded || busy}
      >
        {busy ? "Entrando…" : "Entrar al panel"}
        <span aria-hidden="true">→</span>
      </button>

      {error ? <p className="hp-credential-error">{error}</p> : null}
    </form>
  );
}
