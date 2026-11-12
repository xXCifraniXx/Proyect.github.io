import { clsx } from "clsx";
import type { Sesion } from "../sesion/index.ts";
import { textos } from "../../config/textos.ts";
import { rellenar } from "../../lib/rellenar.ts";

interface BarraCieloProps {
  /** null si el cielo no usa Firebase (entonces no hay botón de sesión). */
  sesion: Sesion | null;
  /** Resalta "Iniciar sesión" cuando alguien intenta poner una estrella sin sesión. */
  resaltarSesion: boolean;
  puedeDeshacer: boolean;
  onDeshacer: () => void;
  onDescargar: () => void;
  onVaciar: () => void;
}

/** Barra de arriba: volver, título, sesión y botones del cielo. */
export default function BarraCielo({
  sesion,
  resaltarSesion,
  puedeDeshacer,
  onDeshacer,
  onDescargar,
  onVaciar
}: BarraCieloProps) {
  const usuario = sesion?.usuario ?? null;
  const nombre = (usuario?.displayName || usuario?.email || "").split(" ")[0];

  return (
    <header className="topbar">
      <div className="title-wrap">
        <a className="back-link" href="../index.html">
          {textos.cieloVolver}
        </a>
        <h1>{textos.cieloTitulo}</h1>
      </div>
      <div className="actions">
        {sesion?.lista && (
          <button
            type="button"
            className={clsx("chip", !usuario && resaltarSesion && "primary")}
            title={usuario ? (usuario.email ?? "") : textos.cieloEntrarTitle}
            onClick={() => void (usuario ? sesion.salir() : sesion.entrar())}
          >
            {usuario
              ? nombre
                ? rellenar(textos.cieloSalirCon, { nombre })
                : textos.cieloCerrarSesion
              : textos.sesionEntrar}
          </button>
        )}
        <button
          type="button"
          className="chip"
          title={textos.cieloDeshacerTitle}
          disabled={!puedeDeshacer}
          onClick={onDeshacer}
        >
          {textos.cieloDeshacer}
        </button>
        <button type="button" className="chip" title={textos.cieloGuardarImagenTitle} onClick={onDescargar}>
          {textos.cieloGuardarImagen}
        </button>
        <button type="button" className="chip danger" title={textos.cieloVaciarTitle} onClick={onVaciar}>
          {textos.cieloVaciar}
        </button>
      </div>
    </header>
  );
}
