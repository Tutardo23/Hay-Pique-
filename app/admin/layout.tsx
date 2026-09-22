import { ClerkProvider, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#24aebe",
          colorForeground: "#243238",
          colorBackground: "#fffaf1",
          colorRing: "#24aebe",
        },
      }}
    >
      <div className="hp-admin hp-admin-topbar-layout">
        <header className="hp-admin-topbar">
          <div className="hp-admin-topbar-inner">
            <div className="hp-admin-topbar-head">
              <Link
                href="/admin/servicios"
                className="hp-admin-topbar-brand"
                aria-label="Panel de Fundación Hay Pique"
              >
                <Image
                  src="/brand/logo-hay-pique-horizontal.png"
                  alt="Fundación Hay Pique"
                  width={240}
                  height={62}
                  priority
                />
                <span>Panel</span>
              </Link>

              <div className="hp-admin-topbar-account">
                <div className="hp-admin-topbar-security" title="Acceso protegido">
                  <ShieldCheck size={15} aria-hidden="true" />
                  <span>Acceso seguro</span>
                </div>

                <div className="hp-admin-topbar-user-copy">
                  <strong>{admin.name}</strong>
                  <small>{admin.role === "owner" ? "Propietario" : "Editor"}</small>
                </div>

                <UserButton />
              </div>
            </div>

            <AdminNav isOwner={admin.role === "owner"} />
          </div>
        </header>

        <main className="hp-admin-main">{children}</main>
      </div>
    </ClerkProvider>
  );
}
