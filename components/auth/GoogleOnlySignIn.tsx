"use client";

import { useSignIn } from "@clerk/nextjs/legacy";
import { useState } from "react";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.482h4.844a4.14 4.14 0 0 1-1.797 2.716v2.258h2.909c1.702-1.568 2.684-3.878 2.684-6.615Z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.468-.806 5.956-2.18l-2.91-2.258c-.805.54-1.835.86-3.046.86-2.344 0-4.33-1.584-5.04-3.71H.951v2.332A9 9 0 0 0 9 18Z"/>
      <path fill="#FBBC05" d="M3.96 10.712A5.41 5.41 0 0 1 3.678 9c0-.594.102-1.17.282-1.712V4.956H.951A9 9 0 0 0 0 9c0 1.452.347 2.827.951 4.044l3.009-2.332Z"/>
      <path fill="#EA4335" d="M9 3.578c1.322 0 2.508.454 3.44 1.346l2.582-2.582C13.464.89 11.426 0 9 0A9 9 0 0 0 .951 4.956L3.96 7.288C4.67 5.162 6.656 3.578 9 3.578Z"/>
    </svg>
  );
}

export function GoogleOnlySignIn() {
  const { signIn } = useSignIn();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    if (!signIn || busy) return;

    setBusy(true);
    setError("");

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/admin",
      });
    } catch (err) {
      console.error("google-sign-in", err);
      setError("No pudimos abrir Google. Intentá nuevamente.");
      setBusy(false);
    }
  }

  return (
    <div className="hp-owner-google">
      <button
        type="button"
        className="hp-owner-google-button"
        onClick={handleGoogle}
        disabled={busy || !signIn}
      >
        <GoogleMark />
        <span>{busy ? "Abriendo Google…" : "Continuar con Google"}</span>
      </button>

      {error ? <p className="hp-credential-error">{error}</p> : null}
      <div id="clerk-captcha" />
    </div>
  );
}
