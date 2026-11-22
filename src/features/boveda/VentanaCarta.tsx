import { useEffect, useRef } from "react";
import { useTextoCarta } from "../../hooks/useTextoCarta.ts";
import type { CartaAbierta } from "./boveda.ts";
import { formatoFechaLarga } from "../../lib/fechas.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import { rellenar } from "../../lib/rellenar.ts";
import { EnlacePagina, rutaDeSeccion } from "../navegacion/index.ts";

interface VentanaCartaProps {
  /** La carta a mostrar, o null si la ventana está cerrada. */
  abierta: CartaAbierta | null;
  onCerrar: () => void;
}

/*
  VENTANA DE UNA CARTA ABIERTA
  La usan La Bóveda y el pastel de cumpleaños. Se cierra con la ×, con
  Escape o tocando fuera. Si la carta trae un botón (accion), lleva a la
  página de esa sección.

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

  // "destino" es el id de una sección ("constelacion", "cumple"…), como lo
  // guardan las cartas desde antes de las páginas.
  const destino = accion ? rutaDeSeccion(accion.destino) : null;

  // Primero se cierra (el foco vuelve a donde estaba) y después el link lleva a la página.
  const irA = () => {
    ventana.current?.close();
    onCerrar();
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
          {/* La foto se pide recién al abrir la carta, nunca antes de su fecha. */}
          {abierta.carta.foto && (
            <img
              className="boveda-modal-foto"
              src={abierta.carta.foto}
              alt={abierta.carta.titulo || TEXTOS.cartaSinTitulo}
              decoding="async"
            />
          )}
          <p>{texto}</p>
          {accion && destino && (
            <EnlacePagina className="btn btn-primary" ruta={destino} onClick={irA}>
              {accion.etiqueta || TEXTOS.cartaIrAhi}
            </EnlacePagina>
          )}
        </div>
      )}
    </dialog>
  );
}
