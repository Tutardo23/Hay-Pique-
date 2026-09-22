import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleOnlySignIn } from "@/components/auth/GoogleOnlySignIn";

export default async function SignInPage() {
  const { userId } = await auth();
  if (userId) redirect("/admin");

  return (
    <ClerkProvider>
      <main className="hp-auth-page hp-auth-page-v3">
        <div className="hp-auth-v3-shell">
          <div className="hp-auth-v3-top">
            <Link href="/" className="hp-auth-back">← Volver al sitio</Link>
            <Image src="/brand/logo-hay-pique-horizontal.png" alt="Fundación Hay Pique" width={260} height={68} priority />
          </div>

          <div className="hp-auth-v3-grid">
            <section className="hp-auth-v3-copy">
              <span className="hp-auth-eyebrow">Panel privado</span>
              <h1>Gestionar la página, <em>simple y seguro.</em></h1>
              <p>El equipo autorizado puede crear propuestas, actualizar información y publicar fotos o videos sin tocar código.</p>
              <div className="hp-auth-v3-points">
                <span><b>01</b> Publicar contenido</span>
                <span><b>02</b> Mantenerlo actualizado</span>
                <span><b>03</b> Acceso solo autorizado</span>
              </div>
            </section>

            <section className="hp-auth-v3-card" aria-label="Acceso privado">
              <span className="hp-auth-v3-badge">✓ Acceso privado</span>
              <h2>Entrá con Google</h2>
              <p>Usá exactamente el Gmail habilitado por el propietario del panel.</p>
              <GoogleOnlySignIn />
              <div className="hp-auth-v3-security"><strong>Sin registro público.</strong><span>No se puede crear una cuenta desde acá.</span></div>
            </section>
          </div>
        </div>
      </main>
    </ClerkProvider>
  );
}
