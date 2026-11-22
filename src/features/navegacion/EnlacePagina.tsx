import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { hrefDe, navegar } from "./historial.ts";

interface EnlacePaginaProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Ruta de la página: "/carta", "/"… */
  ruta: string;
}

/**
 * Link a otra página del sitio: cambia de página sin recargar. Es un <a>
 * de verdad, así que también se puede abrir en otra pestaña o copiar.
 */
export default function EnlacePagina({ ruta, onClick, children, ...resto }: EnlacePaginaProps) {
  const alTocar = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    // Con Ctrl, Cmd, Shift, Alt o la rueda del mouse, el navegador hace lo suyo (pestaña nueva…).
    const conModificador = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (event.defaultPrevented || event.button !== 0 || conModificador) return;
    event.preventDefault();
    navegar(ruta);
  };

  return (
    <a {...resto} href={hrefDe(ruta)} onClick={alTocar}>
      {children}
    </a>
  );
}
