import { useRevelar } from "../../hooks/useRevelar.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import { rellenar } from "../../lib/rellenar.ts";
import EnlacePagina from "./EnlacePagina.tsx";
import { INICIO, type Enlace } from "./enlaces.ts";

interface SiguientePaginaProps {
  /** La página que sigue, o null después de la última. */
  siguiente: Enlace | null;
}

/** Al final de cada página: el link a la que sigue, para recorrer todo en orden. */
export default function SiguientePagina({ siguiente }: SiguientePaginaProps) {
  // Aparece suave, junto con la página.
  const ref = useRevelar<HTMLDivElement>();
  return (
    <div ref={ref} className="siguiente-pagina reveal">
      <EnlacePagina className="btn btn-secondary" ruta={siguiente?.ruta ?? INICIO}>
        {siguiente ? rellenar(TEXTOS.seguirPagina, { pagina: siguiente.texto }) : TEXTOS.barraVolverInicio}
      </EnlacePagina>
    </div>
  );
}
