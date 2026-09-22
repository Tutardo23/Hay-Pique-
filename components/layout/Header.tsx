"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  ["Historia", "/#historia"],
  ["Lo que nos mueve", "/#lo-que-nos-mueve"],
  ["Programas", "/#programas"],
  ["Servicios", "/servicios"],
  ["Sumate", "/#sumate"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="header-logo" href="/" aria-label="Fundación Hay Pique - Inicio">
          <Image
            src="/brand/logo-hay-pique-horizontal.png"
            alt="Fundación Hay Pique!"
            width={320}
            height={82}
            priority
            loading="eager"
          />
        </Link>
        <nav className="header-nav" aria-label="Navegación principal">
          {links.map(([label, href]) => (
            <Link key={href + label} href={href}>{label}</Link>
          ))}
        </nav>
        <Link href="/#sumate" className="header-cta">Quiero sumarme <span>→</span></Link>
        <button
          className="menu-btn"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
      </div>
      {open ? (
        <div className="mobile-menu">
          {links.map(([label, href]) => (
            <Link key={href + label} href={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link className="mobile-primary" href="/#sumate" onClick={() => setOpen(false)}>
            Quiero sumarme →
          </Link>
        </div>
      ) : null}
    </header>
  );
}
