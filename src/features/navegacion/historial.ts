import { destinoDeRutaVieja, destinoDeSeccion, INICIO } from "./enlaces.ts";

/*
  RUTAS CON EL HISTORIAL DEL NAVEGADOR
  El sitio es una sola página (index.html): React muestra lo que toca según
  la ruta del link (/meses, /boveda…). Se cambia de página con el historial
  del navegador, sin recargar, así que atrás y adelante del celular
  funcionan y cada página tiene su propio link. Firebase sirve index.html
  en esas rutas (rewrites en firebase.json).

  El "?…" del link (las vistas previas ?cumple=… y ?tema=rosa) se conserva
  al cambiar de página: así una recarga sigue en la misma vista previa.

  Algunas secciones van dentro de otra página (la carta en la portada, el
  juego en Entretenimiento): para llegar a ellas se cambia de página y se
  baja hasta la sección (el "ancla"), sin ponerla en el link.
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

// La sección a la que hay que bajar cuando se muestre la página nueva.
let anclaPendiente: string | null = null;

// Se abrió el sitio con el link de una página que ya no existe (/carta, /tiempo…)
// o de una sección que va dentro de otra: es un link directo, sin bienvenida.
let entroPorLinkDirecto = false;

/** Si se abrió el sitio con un link viejo a una página o a una sección (entonces no sale la bienvenida). */
export const llegoPorLinkDirecto = (): boolean => entroPorLinkDirecto || anclaPendiente !== null;

/** La sección a la que hay que bajar, una sola vez: después ya no está. */
export function tomarAncla(): string | null {
  const ancla = anclaPendiente;
  anclaPendiente = null;
  return ancla;
}

// Lo que espera bajarA a que aparezca la sección (una página que se descarga aparte tarda un poco).
const ESPERA_ANCLA_MS = 3000;
const PASO_ANCLA_MS = 50;
// Después de bajar, lo de arriba todavía puede cambiar de alto (el mensaje del
// mes se descifra, llegan las letras): se vuelve a alinear un rato.
const PRIMERA_CORRECCION_MS = 700;
const PASO_CORRECCION_MS = 200;
const CORRECCIONES = 12;
const GESTOS_PROPIOS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/**
 * Baja hasta la sección con ese id. Si todavía no está (la página se está
 * descargando), la espera un rato; si no llega, se queda donde está. Si lo de
 * arriba cambia de alto mientras termina de cargar, se vuelve a alinear con la
 * sección, salvo que la persona ya se esté moviendo por su cuenta.
 */
export function bajarA(id: string): void {
  const inicio = Date.now();
  const quieto = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  let movidaPropia = false;
  const alMoverse = () => {
    movidaPropia = true;
  };
  const dejarDeMirar = () => GESTOS_PROPIOS.forEach((gesto) => window.removeEventListener(gesto, alMoverse));

  const corregir = (seccion: HTMLElement, vuelta: number) => {
    if (movidaPropia || vuelta >= CORRECCIONES) {
      dejarDeMirar();
      return;
    }
    const margen = parseFloat(getComputedStyle(seccion).scrollMarginTop) || 0;
    if (Math.abs(seccion.getBoundingClientRect().top - margen) > 4) {
      seccion.scrollIntoView({ behavior: "instant", block: "start" });
    }
    setTimeout(() => corregir(seccion, vuelta + 1), PASO_CORRECCION_MS);
  };

  const intentar = () => {
    const seccion = document.getElementById(id);
    if (!seccion) {
      if (Date.now() - inicio < ESPERA_ANCLA_MS) setTimeout(intentar, PASO_ANCLA_MS);
      return;
    }
    seccion.scrollIntoView({ behavior: quieto ? "instant" : "smooth", block: "start" });
    GESTOS_PROPIOS.forEach((gesto) => window.addEventListener(gesto, alMoverse, { passive: true }));
    setTimeout(() => corregir(seccion, 0), quieto ? PASO_CORRECCION_MS : PRIMERA_CORRECCION_MS);
  };
  intentar();
}

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
 * /boveda, /#juego → /entretenimiento), las rutas de las secciones que ahora
 * van dentro de otra página (/carta → la portada, bajando hasta la carta), la
 * "/" del final y /index.html. El "?…" queda igual. Se llama al abrir la
 * página y al ir atrás o adelante.
 */
export function corregirLink(): void {
  const { pathname, search, hash } = window.location;
  const deSeccion = hash.length > 1 ? destinoDeSeccion(decodificar(hash.slice(1))) : null;
  const deRutaVieja = destinoDeRutaVieja(normalizar(pathname));
  const destino = deSeccion ?? deRutaVieja;
  if (destino) anclaPendiente = destino.ancla ?? null;
  if (deRutaVieja) entroPorLinkDirecto = true;
  const correcto = destino ? destino.ruta + search : normalizar(pathname) + search + hash;
  if (correcto !== pathname + search + hash) window.history.replaceState(null, "", correcto);
}

/**
 * Va a otra página del sitio (sin recargar). Con "reemplazar", no deja la
 * anterior en el historial. Con "ancla", baja hasta esa sección de la página.
 */
export function navegar(ruta: string, reemplazar = false, ancla?: string): void {
  if (ruta === rutaActual() && !reemplazar) {
    // Ya está en esa página: baja a la sección, o vuelve arriba.
    if (ancla) bajarA(ancla);
    else window.scrollTo({ top: 0 });
    return;
  }
  anclaPendiente = ancla ?? null;
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
