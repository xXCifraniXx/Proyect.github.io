import { useRevelar } from "../../hooks/useRevelar.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import { estadoCumple } from "../../lib/cumple.ts";
import { EnlacePagina, INICIO, rutaDeSeccion, type Enlace } from "../navegacion/index.ts";
import Menu from "./Menu.tsx";
import Sobre from "./Sobre.tsx";

interface InicioProps {
  /** Las páginas que existen hoy, para el menú. */
  enlaces: Enlace[];
}

/** Portada: menú, saludo, botones y el sobre con la carta. */
export default function Inicio({ enlaces }: InicioProps) {
  const ref = useRevelar<HTMLElement>();
  // El día del cumpleaños el segundo botón lleva directo a las velas.
  const destinoSecundario = rutaDeSeccion(estadoCumple() === "hoy" ? "cumple" : "boveda") ?? INICIO;

  return (
    <header ref={ref} className="hero glass reveal" id="inicio">
      <Menu enlaces={enlaces} />
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{TEXTOS.heroEyebrow}</span>
          <h1>{TEXTOS.heroTitle}</h1>
          <p className="lead">{TEXTOS.heroIntro}</p>
          <div className="hero-actions">
            <EnlacePagina className="btn btn-primary" ruta={rutaDeSeccion("carta") ?? INICIO}>
              {TEXTOS.heroCtaCarta}
            </EnlacePagina>
            <EnlacePagina className="btn btn-secondary" ruta={destinoSecundario}>
              {TEXTOS.heroCtaBoveda}
            </EnlacePagina>
          </div>
        </div>
        <Sobre />
      </div>
    </header>
  );
}
