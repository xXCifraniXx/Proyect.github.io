import { textos } from "../../config/textos.ts";

interface PaginaConErrorProps {
  /** Solo la tarjeta, para cuando falla una página y el resto del sitio sigue (App). */
  soloTarjeta?: boolean;
}

/**
 * Lo que se ve si falla la página entera (o no se pudo descargar): un aviso
 * y un botón para recargar. Usa textos directo de src/config/textos.ts para
 * no depender de nada más que pueda haber fallado.
 */
export default function PaginaConError({ soloTarjeta = false }: PaginaConErrorProps) {
  const tarjeta = (
    <div className="final-card glass-soft">
      <h2>{textos.errorPagina}</h2>
      <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>
        {textos.errorRecargar}
      </button>
    </div>
  );
  return soloTarjeta ? <div className="section">{tarjeta}</div> : <main className="app-shell">{tarjeta}</main>;
}
