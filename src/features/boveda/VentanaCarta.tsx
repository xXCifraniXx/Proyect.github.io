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

  Es un <dialog> del navegador: mientras está abierta, lo de atrás no se
  puede tocar ni alcanzar con Tab, y al cerrarla el foco vuelve al botón
  que la abrió.
*/
export default function VentanaCarta({ abierta, onCerrar }: VentanaCartaProps) {
  // Si no llegó el texto ya descifrado, se descifra aquí.
  const descifrado = useTextoCarta(abierta && abierta.texto === undefined ? abierta.carta : null);
  const texto = abierta?.texto ?? descifrado ?? "";
  const ventana = useRef<HTMLDialogElement>(null);
  const cerrar = useRef<HTMLButtonElement>(null);
  const hayCarta = abierta !== null;

  // Abre o cierra el <dialog> según el estado.
  useEffect(() => {
    const el = ventana.current;
    if (!el) return;
    if (hayCarta && !el.open) {
      el.showModal();
      cerrar.current?.focus();
    } else if (!hayCarta && el.open) {
      el.close();
    }
  }, [hayCarta]);

  const accion = abierta && !abierta.sinAccion ? abierta.carta.accion : undefined;

  const irA = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!accion) return;
    event.preventDefault();
    // Primero se cierra (el foco vuelve a donde estaba) y después se va a la sección.
    ventana.current?.close();
    onCerrar();
    document.getElementById(accion.destino)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    // Tocar fuera de la carta la cierra; con teclado, Escape (lo hace el navegador).
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ventana}
      className="lightbox"
      aria-label={TEXTOS.ariaCartaAbierta}
      // Escape (o "atrás" en Android) cierra el <dialog> por su cuenta: se avisa
      // para que la carta también quede cerrada. No se usa onClose: ese aviso
      // llega tarde y, si se vuelve a abrir rápido, cerraría la carta nueva.
      onCancel={onCerrar}
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
    </dialog>
  );
}
