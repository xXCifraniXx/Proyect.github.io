import { TEXTOS } from "../../lib/contenido.ts";
import { rellenar } from "../../lib/rellenar.ts";
import { useMusica } from "./musica.ts";

/**
 * Botón ⏭ (va en la barra de secciones, junto al ▶): pasa a la siguiente
 * canción y la hace sonar. Solo sale si hay más de una. Su nombre dice cuál
 * sigue.
 */
export default function BotonSiguiente() {
  const { hayVarias, tituloSiguiente, siguiente } = useMusica();
  if (!hayVarias) return null;
  const etiqueta = rellenar(TEXTOS.ariaSiguienteCancion, { titulo: tituloSiguiente });

  return (
    <button className="boton-siguiente" type="button" aria-label={etiqueta} title={etiqueta} onClick={siguiente}>
      {/* Dibujado y no con el carácter ⏭, que algunos celulares muestran como emoji. */}
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor" />
      </svg>
    </button>
  );
}
