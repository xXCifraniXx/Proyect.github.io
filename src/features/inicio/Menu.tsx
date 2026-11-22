import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { NOMBRES, TEXTOS } from "../../lib/contenido.ts";
import { EnlacePagina, INICIO, type Enlace } from "../navegacion/index.ts";

interface MenuProps {
  /** Las páginas que existen hoy, en su orden. */
  enlaces: Enlace[];
}

/*
  MENÚ
  En pantallas grandes son botones en una fila; en medianas y móviles se
  esconden en un menú de tres líneas (lo decide el CSS). Se cierra al elegir
  una opción, con Escape o tocando fuera.
*/
export default function Menu({ enlaces }: MenuProps) {
  const [abierto, setAbierto] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return undefined;
    const alTocarFuera = (event: MouseEvent) => {
      const destino = event.target as Node;
      if (!panel.current?.contains(destino) && !boton.current?.contains(destino)) setAbierto(false);
    };
    const alPulsarTecla = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    };
    document.addEventListener("click", alTocarFuera);
    document.addEventListener("keydown", alPulsarTecla);
    return () => {
      document.removeEventListener("click", alTocarFuera);
      document.removeEventListener("keydown", alPulsarTecla);
    };
  }, [abierto]);

  return (
    <nav className="topbar" aria-label={TEXTOS.ariaNavegacion}>
      <EnlacePagina ruta={INICIO} className="brand">
        Para {NOMBRES.novia}
      </EnlacePagina>
      <button
        ref={boton}
        className="menu-toggle"
        type="button"
        aria-expanded={abierto}
        aria-controls="navLinks"
        onClick={() => setAbierto((valor) => !valor)}
      >
        <span className="menu-toggle-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>{TEXTOS.menuBoton}</span>
      </button>
      <div ref={panel} className={clsx("nav-links", abierto && "is-open")} id="navLinks">
        {enlaces.map((enlace) => (
          <EnlacePagina key={enlace.id} ruta={enlace.ruta} onClick={() => setAbierto(false)}>
            {enlace.texto}
          </EnlacePagina>
        ))}
      </div>
    </nav>
  );
}
