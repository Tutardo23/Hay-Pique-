import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SsoCallbackPage() {
  return (
    <main className="hp-auth-callback">
      <div className="hp-auth-callback-card">
        <span className="hp-auth-callback-dot" aria-hidden="true" />
        <strong>Verificando tu cuenta de Google…</strong>
        <p>En un momento vas a entrar al panel.</p>
      </div>

      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/admin"
        signUpForceRedirectUrl="/admin"
        signInFallbackRedirectUrl="/admin"
        signUpFallbackRedirectUrl="/admin"
      />

      <div id="clerk-captcha" />
    </main>
  );
}
