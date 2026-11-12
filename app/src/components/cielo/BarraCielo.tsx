import type { Sesion } from "../../hooks/useSesion.ts";

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
          ← Volver a la carta
        </a>
        <h1>Constelación de nosotros</h1>
      </div>
      <div className="actions">
        {sesion?.lista && (
          <button
            type="button"
            className={`chip${!usuario && resaltarSesion ? " primary" : ""}`}
            title={usuario ? (usuario.email ?? "") : "Entrar con Google para poner estrellas"}
            onClick={() => void (usuario ? sesion.salir() : sesion.entrar())}
          >
            {usuario ? (nombre ? `Salir (${nombre})` : "Cerrar sesión") : "Iniciar sesión"}
          </button>
        )}
        <button
          type="button"
          className="chip"
          title="Quitar la última estrella"
          disabled={!puedeDeshacer}
          onClick={onDeshacer}
        >
          ↶ Deshacer
        </button>
        <button type="button" className="chip" title="Descargar como imagen" onClick={onDescargar}>
          ⤓ Guardar imagen
        </button>
        <button type="button" className="chip danger" title="Borrar todo el cielo" onClick={onVaciar}>
          ✦ Vaciar cielo
        </button>
      </div>
    </header>
  );
}
