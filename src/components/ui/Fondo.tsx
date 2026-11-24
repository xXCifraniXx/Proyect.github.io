import { useState, type CSSProperties } from "react";
import { CONFIG } from "../../lib/contenido.ts";
import { ahora, estadoCumple } from "../../lib/cumple.ts";
import { esNavidad } from "../../lib/navidad.ts";

interface Figura {
  id: number;
  figura: string;
  // "--drift" es una variable CSS; CSSProperties no la conoce por nombre.
  estilo: CSSProperties & { "--drift": string };
}

/*
  FONDO
  Luces difusas y figuras que se mueven detrás de todo:
    - corazones que suben, el resto del año;
    - globos y confeti que suben, el día del cumpleaños;
    - copos de nieve que caen, en diciembre (lib/navidad.ts). Las luces
      también cambian a caramelo, verde pino y rojo arándano (base.css).
  Se arma una sola vez al cargar: si cambia el día del cumpleaños o empieza
  o termina diciembre con la página abierta, App la recarga.
*/
export default function Fondo() {
  // useState con función: las figuras se sortean una sola vez, no en cada render.
  const [figuras] = useState<Figura[]>(() => {
    const total = CONFIG.opciones?.corazones || 18;
    const cumple = estadoCumple() === "hoy";
    const nieve = !cumple && esNavidad(ahora());
    const lista = cumple ? ["🎈", "✨", "❤", "🎉", "♡"] : nieve ? ["❄", "❅", "✻", "❆", "•"] : ["♡", "❤", "❤"];
    return Array.from({ length: total }, (_, i) => ({
      id: i,
      figura: lista[i % lista.length],
      estilo: {
        left: `${Math.random() * 100}%`,
        "--drift": `${Math.random() * 70 - 35}px`,
        animationDuration: `${(nieve ? 14 : 10) + Math.random() * 10}s`,
        animationDelay: `${(nieve ? -14 : 0) + Math.random() * 8}s`,
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
        {figuras.map((f) => (
          <span key={f.id} className="heart" style={f.estilo}>
            {f.figura}
          </span>
        ))}
      </div>
    </>
  );
}
