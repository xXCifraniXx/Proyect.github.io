import { clsx } from "clsx";
import { useEffect, useRef } from "react";
import { TEXTOS } from "../../lib/contenido.ts";
import { estadoEstrella, type Enlace } from "./enlaces.ts";

interface PanelSeccionesProps {
  abierto: boolean;
  /** Las secciones en el orden de la página. */
  secciones: Enlace[];
  /** Posición de la sección actual en "secciones" (-1 si todavía ninguna). */
  indiceActual: number;
  onCerrar: () => void;
}

/*
  PANEL CON TODAS LAS SECCIONES
  Sale desde abajo al tocar ✦ en la barra. Es un <dialog> del navegador,
  como la ventana de las cartas: mientras está abierto, lo de atrás no se
  puede tocar ni alcanzar con Tab, y al cerrarlo sin elegir el foco vuelve
  al botón.
  Se cierra con la ×, con Escape, tocando fuera o eligiendo una sección.
*/
export default function PanelSecciones({ abierto, secciones, indiceActual, onCerrar }: PanelSeccionesProps) {
  const panel = useRef<HTMLDialogElement>(null);

  // Abre o cierra el <dialog> según el estado.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    if (abierto && !el.open) el.showModal();
    else if (!abierto && el.open) el.close();
  }, [abierto]);

  // Primero se cierra y después el enlace lleva a la sección como cualquier
  // ancla: el teclado sigue desde esa sección, igual que con el menú.
  const alElegir = () => {
    panel.current?.close();
    onCerrar();
  };

  return (
    // Tocar fuera del panel lo cierra; con teclado, Escape (lo hace el navegador).
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={panel}
      className="panel-secciones"
      aria-label={TEXTOS.ariaPanelSecciones}
      // Escape (o "atrás" en Android) cierra el <dialog> por su cuenta: se avisa
      // para que quede cerrado. No se usa onClose: ese aviso llega tarde y, si
      // se vuelve a abrir rápido, cerraría el panel nuevo.
      onCancel={onCerrar}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      {/* Todo el contenido va en esta caja: así un toque en el panel nunca
          llega al <dialog>, que solo recibe los toques de afuera. */}
      <div className="panel-secciones-contenido">
        <div className="panel-secciones-cabecera">
          <span className="panel-secciones-asa" aria-hidden="true" />
          <button
            className="panel-secciones-cerrar"
            type="button"
            aria-label={TEXTOS.ariaCerrarSecciones}
            onClick={onCerrar}
          >
            ×
          </button>
        </div>
        <ol className="panel-secciones-lista">
          <li>
            <a className="panel-secciones-enlace is-inicio" href="#inicio" onClick={alElegir}>
              <span className="panel-secciones-marca" aria-hidden="true">
                ↑
              </span>
              {TEXTOS.barraVolverInicio}
            </a>
          </li>
          {secciones.map((enlace, i) => {
            const estado = estadoEstrella(i, indiceActual);
            return (
              <li key={enlace.href}>
                <a
                  className={clsx("panel-secciones-enlace", `is-${estado}`)}
                  href={enlace.href}
                  aria-current={estado === "actual" ? "location" : undefined}
                  onClick={alElegir}
                >
                  <span className="panel-secciones-marca" aria-hidden="true">
                    <span className="panel-secciones-estrella" />
                  </span>
                  {enlace.texto}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </dialog>
  );
}
