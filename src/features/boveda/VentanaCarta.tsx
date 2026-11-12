import { clsx } from "clsx";
import { useEffect, useRef, type MouseEvent } from "react";
import { useTextoCarta } from "../../hooks/useTextoCarta.ts";
import type { CartaAbierta } from "./boveda.ts";
import { formatoFechaLarga } from "../../lib/fechas.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import { rellenar } from "../../lib/rellenar.ts";

interface VentanaCartaProps {
  /** La carta a mostrar, o null si la ventana está cerrada. */
  abierta: CartaAbierta | null;
  onCerrar: () => void;
}

/*
  VENTANA DE UNA CARTA ABIERTA
  La usan La Bóveda y el pastel de cumpleaños. Se cierra con la ×, con
  Escape o tocando fuera. Si la carta trae un botón (accion), lleva a esa
  sección.
*/
export default function VentanaCarta({ abierta, onCerrar }: VentanaCartaProps) {
  // Si no llegó el texto ya descifrado, se descifra aquí.
  const descifrado = useTextoCarta(abierta && abierta.texto === undefined ? abierta.carta : null);
  const texto = abierta?.texto ?? descifrado ?? "";
  const cerrar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierta) return undefined;
    cerrar.current?.focus();
    const alPulsarTecla = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alPulsarTecla);
    return () => document.removeEventListener("keydown", alPulsarTecla);
  }, [abierta, onCerrar]);

  const accion = abierta && !abierta.sinAccion ? abierta.carta.accion : undefined;

  const irA = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!accion) return;
    event.preventDefault();
    onCerrar();
    document.getElementById(accion.destino)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={clsx("lightbox", abierta && "show")}
      aria-hidden={!abierta}
      role="dialog"
      aria-modal="true"
      aria-label={TEXTOS.ariaCartaAbierta}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      {abierta && (
        <div className="lightbox-card boveda-modal-card">
          <button
            ref={cerrar}
            className="lightbox-close"
            type="button"
            aria-label={TEXTOS.ariaCerrarCarta}
            onClick={onCerrar}
          >
            ×
          </button>
          <span className="boveda-modal-icon">{abierta.carta.icono || TEXTOS.cartaIcono}</span>
          <span className="boveda-modal-date">
            {rellenar(TEXTOS.bovedaDesbloqueada, { fecha: formatoFechaLarga(abierta.fecha) })}
          </span>
          <h3>{abierta.carta.titulo || TEXTOS.cartaSinTitulo}</h3>
          <p>{texto}</p>
          {accion && (
            <a className="btn btn-primary" href={`#${accion.destino}`} onClick={irA}>
              {accion.etiqueta || TEXTOS.cartaIrAhi}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
