import { useEffect, useRef } from "react";

/*
  Hace aparecer un bloque (clase "show") la primera vez que entra en pantalla,
  igual que las secciones .reveal del sitio actual.
  Uso:  const ref = useRevelar();  <section ref={ref} className="reveal">
*/
export function useRevelar() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
