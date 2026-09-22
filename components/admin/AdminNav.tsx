"use client";

import Link from "next/link";
import { ExternalLink, LayoutGrid, UsersRound } from "lucide-react";
import { usePathname } from "next/navigation";

export function AdminNav({ isOwner }: { isOwner: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="hp-admin-topnav" aria-label="Panel de administración">
      <Link
        href="/admin/servicios"
        className={pathname.startsWith("/admin/servicios") ? "is-active" : undefined}
      >
        <LayoutGrid size={16} strokeWidth={2} aria-hidden="true" />
        <span>Propuestas</span>
      </Link>

      {isOwner ? (
        <Link
          href="/admin/equipo"
          className={pathname.startsWith("/admin/equipo") ? "is-active" : undefined}
        >
          <UsersRound size={16} strokeWidth={2} aria-hidden="true" />
          <span>Equipo</span>
        </Link>
      ) : null}

      <Link href="/servicios" target="_blank" rel="noreferrer">
        <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
        <span>Ver página pública</span>
      </Link>
    </nav>
  );
}
