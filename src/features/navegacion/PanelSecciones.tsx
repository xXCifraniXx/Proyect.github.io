import { clsx } from "clsx";
import { useEffect, useRef } from "react";
import { TEXTOS } from "../../lib/contenido.ts";
import EnlacePagina from "./EnlacePagina.tsx";
import { estadoEstrella, INICIO, type Enlace } from "./enlaces.ts";

interface PanelSeccionesProps {
  abierto: boolean;
  /** Las páginas, en su orden. */
  secciones: Enlace[];
  /** Posición de la página actual en "secciones" (-1 en la portada). */
  indiceActual: number;
  onCerrar: () => void;
}

/*
  PANEL CON TODAS LAS PÁGINAS
  Sale desde abajo al tocar ✦ en la barra. Es un <dialog> del navegador,
  como la ventana de las cartas: mientras está abierto, lo de atrás no se
  puede tocar ni alcanzar con Tab, y al cerrarlo sin elegir el foco vuelve
  al botón.
  Se cierra con la ×, con Escape, tocando fuera o eligiendo una página.
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

  // Primero se cierra y después el enlace lleva a la página: el foco pasa a
  // la página nueva (useCambioDePagina).
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
            <EnlacePagina
              className="panel-secciones-enlace is-inicio"
              ruta={INICIO}
              aria-current={indiceActual < 0 ? "page" : undefined}
              onClick={alElegir}
            >
              <span className="panel-secciones-marca" aria-hidden="true">
                ↑
              </span>
              {TEXTOS.barraVolverInicio}
            </EnlacePagina>
          </li>
          {secciones.map((enlace, i) => {
            const estado = estadoEstrella(i, indiceActual);
            return (
              <li key={enlace.id}>
                <EnlacePagina
                  className={clsx("panel-secciones-enlace", `is-${estado}`)}
                  ruta={enlace.ruta}
                  aria-current={estado === "actual" ? "page" : undefined}
                  onClick={alElegir}
                >
                  <span className="panel-secciones-marca" aria-hidden="true">
                    <span className="panel-secciones-estrella" />
                  </span>
                  {enlace.texto}
                </EnlacePagina>
              </li>
            );
          })}
        </ol>
      </div>
    </dialog>
  );
}
