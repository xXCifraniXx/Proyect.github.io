import type { ReactNode } from "react";
import { useRevelar } from "../hooks/useRevelar.ts";

interface SeccionProps {
  /** Ancla para el menú (#carta, #linea-tiempo…). */
  id: string;
  /** Clases extra además de "section reveal". */
  className?: string;
  ariaLabelledby?: string;
  children: ReactNode;
}

/** Sección de la página que aparece suavemente al llegar a ella. */
export default function Seccion({ id, className, ariaLabelledby, children }: SeccionProps) {
  const ref = useRevelar<HTMLElement>();
  return (
    <section ref={ref} id={id} className={`section reveal${className ? ` ${className}` : ""}`} aria-labelledby={ariaLabelledby}>
      {children}
    </section>
  );
}
