import { useEffect, useState } from "react";

/** Barra fina arriba que se llena a medida que se baja por la página. */
export default function ProgresoScroll() {
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
