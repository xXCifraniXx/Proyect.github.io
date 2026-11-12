import { useState, type CSSProperties } from "react";
import { CONFIG } from "../../lib/contenido.ts";
import { estadoCumple } from "../../lib/cumple.ts";

interface Corazon {
  id: number;
  figura: string;
  // "--drift" es una variable CSS; CSSProperties no la conoce por nombre.
  estilo: CSSProperties & { "--drift": string };
}

/** Luces de fondo y corazones que flotan (globos y confeti el día del cumpleaños). */
export default function Fondo() {
  // useState con función: los corazones se sortean una sola vez, no en cada render.
  const [corazones] = useState<Corazon[]>(() => {
    const total = CONFIG.opciones?.corazones || 18;
    const figuras = estadoCumple() === "hoy" ? ["🎈", "✨", "❤", "🎉", "♡"] : ["♡", "❤", "❤"];
    return Array.from({ length: total }, (_, i) => ({
      id: i,
      figura: figuras[i % figuras.length],
      estilo: {
        left: `${Math.random() * 100}%`,
        "--drift": `${Math.random() * 70 - 35}px`,
        animationDuration: `${10 + Math.random() * 10}s`,
        animationDelay: `${Math.random() * 8}s`,
        fontSize: `${13 + Math.random() * 10}px`
      }
    }));
  });

  return (
    <>
      <div className="ambient" aria-hidden="true">
        <span className="orb orb-rose" />
        <span className="orb orb-lilac" />
        <span className="orb orb-gold" />
      </div>
      <div className="floating-hearts" id="floatingHearts" aria-hidden="true">
        {corazones.map((c) => (
          <span key={c.id} className="heart" style={c.estilo}>
            {c.figura}
          </span>
        ))}
      </div>
    </>
  );
}
