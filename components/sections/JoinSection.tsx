import { DrawnThread } from "@/components/motion/DrawnThread";
import { SectionHeading } from "@/components/ui/SectionHeading";

const instagram = "https://www.instagram.com/fundacion_hay_pique/";
const whatsapp = "https://wa.me/5491168009917";
const colaborarUrl =
  "https://checkoutfrontend.totalcoin.com/workspace/checkout/receptor?BID=0da51f56-fe87-4b5e-b8d7-75e88956d09d";

const options = [
  {
    label: "Ser voluntario/a",
    href: `${whatsapp}?text=${encodeURIComponent(
      "Hola Cata, vi la página de Fundación Hay Pique y me gustaría sumarme como voluntario/a.",
    )}`,
    ariaLabel: "Ser voluntario/a. Contactar a Fundación Hay Pique por WhatsApp",
  },
  {
    label: "Colaborar",
    href: colaborarUrl,
    ariaLabel: "Colaborar con Fundación Hay Pique",
  },
  {
    label: "Generar una alianza",
    href: `${whatsapp}?text=${encodeURIComponent(
      "Hola Cata, vi la página de Fundación Hay Pique y me gustaría conversar sobre una posible alianza.",
    )}`,
    ariaLabel: "Generar una alianza. Contactar a Fundación Hay Pique por WhatsApp",
  },
  {
    label: "Conocer más",
    href: `${whatsapp}?text=${encodeURIComponent(
      "Hola Cata, vi la página de Fundación Hay Pique y me gustaría conocer más sobre lo que hacen.",
    )}`,
    ariaLabel: "Conocer más. Contactar a Fundación Hay Pique por WhatsApp",
  },
] as const;

function whatsappHref(message: string) {
  return `${whatsapp}?text=${encodeURIComponent(message)}`;
}

export function JoinSection() {
  return (
    <section className="join-section section" id="sumate">
      <DrawnThread className="join-thread" variant="join" />
      <div className="shell join-grid">
        <div>
          <span className="join-stamp">¿Hay pique?</span>
          <SectionHeading
            label="Sumate"
            title={<>Hay muchas maneras <em>de estar cerca.</em></>}
            copy="Cada persona, familia, institución u organización puede encontrar una manera distinta de acompañar."
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px 18px",
            }}
          >
            <a className="join-contact" href={instagram} target="_blank" rel="noreferrer">
              Instagram ↗
            </a>
            <a
              className="join-contact"
              href={whatsappHref(
                "Hola Cata, vi la página de Fundación Hay Pique y quería ponerme en contacto.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp ↗
            </a>
          </div>
        </div>

        <div className="join-options">
          {options.map((option, index) => (
            <a
              className="join-row"
              key={option.label}
              href={option.href}
              target="_blank"
              rel="noreferrer"
              aria-label={option.ariaLabel}
            >
              <span>0{index + 1}</span>
              <strong>{option.label}</strong>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
