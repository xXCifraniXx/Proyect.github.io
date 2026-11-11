import { useEffect, useState } from "react";
import { CONFIG } from "../contenido.js";
import { estadoCumple } from "../lib/cumple.js";

// Barra fina arriba que se llena a medida que se baja por la página.
export function ProgresoScroll() {
  const [avance, setAvance] = useState(0);

  useEffect(() => {
    const actualizar = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setAvance(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", actualizar, { passive: true });
    actualizar();
    return () => window.removeEventListener("scroll", actualizar);
  }, []);

  return <div className="scroll-progress" style={{ width: `${avance}%` }} aria-hidden="true" />;
}

// Luces de fondo y corazones que flotan (globos y confeti el día del cumpleaños).
export function Fondo() {
  // useState con función: los corazones se sortean una sola vez, no en cada render.
  const [corazones] = useState(() => {
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
          <span key={c.id} className="heart" style={c.estilo}>{c.figura}</span>
        ))}
      </div>
    </>
  );
}
