import { useState } from "react";
import { MAX_ETIQUETA } from "./estrellas.ts";

interface CompositorEstrellaProps {
  onGuardar: (etiqueta: string) => void;
  onCancelar: () => void;
}

/** Cuadro para escribir el recuerdo de la estrella nueva. */
export default function CompositorEstrella({ onGuardar, onCancelar }: CompositorEstrellaProps) {
  const [texto, setTexto] = useState("");

  return (
    <div className="composer">
      <input
        type="text"
        maxLength={MAX_ETIQUETA}
        placeholder="un recuerdo, una palabra, una fecha…"
        autoComplete="off"
        autoFocus
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onGuardar(texto);
          if (e.key === "Escape") onCancelar();
        }}
      />
      <div className="composer-row">
        <button type="button" className="chip ghost" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="button" className="chip primary" onClick={() => onGuardar(texto)}>
          Añadir estrella ✦
        </button>
      </div>
    </div>
  );
}
