import Image from "next/image";
export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-logo"><Image src="/brand/logo-hay-pique.jpeg" alt="Fundación Hay Pique!" width={220} height={181} /></div>
        <div><span className="footer-label">Fundación Hay Pique!</span><p>Tucumán, Argentina</p></div>
        <div><span className="footer-label">Redes</span><a href="https://www.instagram.com/fundacion_hay_pique/" target="_blank" rel="noreferrer">Instagram ↗</a></div>
        <div className="footer-credit">Diseño y desarrollo<br /><strong>TORR</strong></div>
      </div>
    </footer>
  );
}
