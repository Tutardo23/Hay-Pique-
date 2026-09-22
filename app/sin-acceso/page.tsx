import { ClerkProvider, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function NoAccessPage() {
  return (
    <ClerkProvider>
      <main className="hp-access-denied">
        <section className="hp-access-denied-card">
          <Image
            src="/brand/logo-hay-pique-horizontal.png"
            alt="Fundación Hay Pique"
            width={280}
            height={72}
            className="hp-access-denied-logo"
          />
          <span>Acceso restringido</span>
          <h1>Esta cuenta no está habilitada para administrar la página.</h1>
          <p>
            El inicio de sesión fue válido, pero este correo no forma parte del equipo autorizado.
            Si debería tener acceso, el propietario del panel puede habilitarlo desde “Equipo”.
          </p>
          <div className="hp-access-denied-actions">
            <Link href="/" className="hp-admin-button hp-admin-button-secondary">
              Volver a la página
            </Link>
            <SignOutButton>
              <button className="hp-admin-button hp-admin-button-primary">Usar otra cuenta</button>
            </SignOutButton>
          </div>
        </section>
      </main>
    </ClerkProvider>
  );
}
