import { clsx } from "clsx";
import { TEXTOS } from "../../lib/contenido.ts";
import { rellenar } from "../../lib/rellenar.ts";
import { useMusica } from "./musica.ts";

/**
 * Botón ▶ / ❚❚ de la canción (va en la barra de secciones). Si el navegador
 * no la puede reproducir, muestra "!" y su nombre dice el aviso.
 */
export default function BotonMusica() {
  const { disponible, sonando, error, titulo, alternar } = useMusica();
  if (!disponible) return null;
  const etiqueta = error
    ? TEXTOS.musicaError
    : rellenar(sonando ? TEXTOS.ariaPausarMusica : TEXTOS.ariaReproducirMusica, { titulo });
  const icono = error ? "!" : sonando ? "❚❚" : "▶";

  return (
    <button
      className={clsx("boton-musica", sonando && "is-sonando", error && "is-error")}
      type="button"
      aria-label={etiqueta}
      aria-pressed={sonando}
      title={etiqueta}
      onClick={alternar}
    >
      <span aria-hidden="true">{icono}</span>
    </button>
  );
}
