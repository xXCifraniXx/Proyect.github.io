import type { Ref } from "react";
import type { Estrella } from "./estrellas.ts";
import { textos } from "../../config/textos.ts";

interface BurbujaEstrellaProps {
  estrella: Estrella;
  /** Si es false, no aparece la × para quitarla. */
  puedeQuitar: boolean;
  onQuitar: () => void;
  // El lienzo la mueve para que siga a la estrella.
  ref?: Ref<HTMLDivElement>;
}

/** Globito con el recuerdo de una estrella tocada (y la × para quitarla). */
export default function BurbujaEstrella({ estrella, puedeQuitar, onQuitar, ref }: BurbujaEstrellaProps) {
  return (
    <div ref={ref} className="star-pop">
      <span>{estrella.label || textos.estrellaSinNombre}</span>
      {puedeQuitar && (
        <button type="button" aria-label={textos.ariaQuitarEstrella} onClick={onQuitar}>
          ×
        </button>
      )}
    </div>
  );
}
