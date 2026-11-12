import { textos } from "../../config/textos.ts";

/**
 * Lo que se ve si falla la página entera (no una sola sección): un aviso y
 * un botón para recargar. Usa textos directo de src/config/textos.ts para no
 * depender de nada más que pueda haber fallado.
 */
export default function PaginaConError() {
  return (
    <main className="app-shell">
      <div className="final-card glass-soft">
        <h2>{textos.errorPagina}</h2>
        <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>
          {textos.errorRecargar}
        </button>
      </div>
    </main>
  );
}
