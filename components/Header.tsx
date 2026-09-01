"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Historia", "#historia"],
  ["Así acompañamos", "#que-hacemos"],
  ["Programas", "#programas"],
  ["Sumate", "#sumate"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="#inicio" className="brand" aria-label="Fundación Hay Pique - Inicio">
          <Image src="/brand/logo-hay-pique.jpeg" alt="Fundación Hay Pique!" width={108} height={89} priority />
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <Link href="#sumate" className="header-cta">Quiero sumarme <span>↗</span></Link>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Cerrar menú" : "Abrir menú"}>
          {open ? <X size={22}/> : <Menu size={22}/>} 
        </button>
      </div>
      {open && (
        <div className="mobile-panel">
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link href="#sumate" className="mobile-cta" onClick={() => setOpen(false)}>Quiero sumarme ↗</Link>
        </div>
      )}
    </header>
  );
}
