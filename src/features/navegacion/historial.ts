import { INICIO, rutaDeSeccion } from "./enlaces.ts";

/*
  RUTAS CON EL HISTORIAL DEL NAVEGADOR
  El sitio es una sola página (index.html): React muestra lo que toca según
  la ruta del link (/carta, /boveda…). Se cambia de página con el historial
  del navegador, sin recargar, así que atrás y adelante del celular
  funcionan y cada página tiene su propio link. Firebase sirve index.html
  en esas rutas (rewrites en firebase.json).

  El "?…" del link (la vista previa ?cumple=…) se conserva al cambiar de
  página: así una recarga sigue en la misma vista previa.
*/

/** "/boveda/" → "/boveda"; "/index.html" → "/". */
export function normalizar(ruta: string): string {
  const sinIndice = ruta.replace(/\/index\.html$/, "/");
  return sinIndice.replace(/\/+$/, "") || INICIO;
}

/** La ruta de la página que se está viendo. */
export const rutaActual = (): string => normalizar(window.location.pathname);

/** El link a una ruta, con el "?…" de ahora. */
export const hrefDe = (ruta: string): string => ruta + window.location.search;

const avisos = new Set<() => void>();
const avisar = () => avisos.forEach((aviso) => aviso());

// Un "#" mal escrito (un "%" suelto) no tiene que romper la página.
const decodificar = (texto: string): string => {
  try {
    return decodeURIComponent(texto);
  } catch {
    return texto;
  }
};

/**
 * Corrige el link sin recargar: los viejos de una sola página (/#boveda →
 * /boveda, /#linea-tiempo → /meses), la "/" del final y /index.html. El
 * "?…" queda igual. Se llama al abrir la página y al ir atrás o adelante.
 */
export function corregirLink(): void {
  const { pathname, search, hash } = window.location;
  const deSeccion = hash.length > 1 ? rutaDeSeccion(decodificar(hash.slice(1))) : null;
  const correcto = deSeccion !== null ? deSeccion + search : normalizar(pathname) + search + hash;
  if (correcto !== pathname + search + hash) window.history.replaceState(null, "", correcto);
}

/** Va a otra página del sitio (sin recargar). Con "reemplazar", no deja la anterior en el historial. */
export function navegar(ruta: string, reemplazar = false): void {
  if (ruta === rutaActual() && !reemplazar) {
    // Ya está en esa página: solo vuelve arriba.
    window.scrollTo({ top: 0 });
    return;
  }
  if (reemplazar) window.history.replaceState(null, "", hrefDe(ruta));
  else window.history.pushState(null, "", hrefDe(ruta));
  avisar();
}

const alVolver = () => {
  corregirLink();
  avisar();
};

/** Avisa cada vez que cambia la página (con navegar, atrás o adelante). */
export function suscribir(aviso: () => void): () => void {
  if (avisos.size === 0) window.addEventListener("popstate", alVolver);
  avisos.add(aviso);
  return () => {
    avisos.delete(aviso);
    if (avisos.size === 0) window.removeEventListener("popstate", alVolver);
  };
}
