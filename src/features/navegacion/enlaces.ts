import { CONFIG, TEXTOS } from "../../lib/contenido.ts";
import type { Ocurrencia } from "../../lib/cumple.ts";

/*
  PÁGINAS DEL SITIO
  Una sola lista para todo: de acá salen el menú de la portada, la barra de
  secciones, el "Seguir" al final de cada página y las rutas. Una página
  nueva se suma acá (y su ruta en firebase.json: un test avisa si falta).

  Desde el 24-11-2026 el menú es corto (lo pidió Jorge): el mensaje del mes
  y la carta van en la portada, el tiempo juntos y la música están siempre a
  mano (franja de arriba y barra de abajo), la constelación y el juego van
  juntos en "Entretenimiento", y el cumpleaños y el adviento, cuando ya
  pasaron, quedan de recuerdo en La Bóveda.
*/

/** Id de cada página (el de su sección). */
export type IdPagina = "adviento" | "linea-tiempo" | "calendario" | "cumple" | "boveda" | "entretenimiento";

export interface Enlace {
  id: IdPagina;
  /** Ruta de la página: "/meses", "/boveda"… */
  ruta: `/${string}`;
  /** Nombre en el menú y en la barra. */
  texto: string;
}

/** La portada. */
export const INICIO = "/";

/** Todas las páginas, en el orden del menú. */
export const PAGINAS: readonly Enlace[] = [
  { id: "adviento", ruta: "/adviento", texto: TEXTOS.navAdviento },
  { id: "linea-tiempo", ruta: "/meses", texto: TEXTOS.navMeses },
  { id: "calendario", ruta: "/bajada", texto: TEXTOS.navBajada },
  { id: "cumple", ruta: "/cumple", texto: TEXTOS.navCumple },
  { id: "boveda", ruta: "/boveda", texto: TEXTOS.navBoveda },
  { id: "entretenimiento", ruta: "/entretenimiento", texto: TEXTOS.navEntretenimiento }
];

/** Dónde quedó una sección: su página y, si va dentro de otra, el id de la sección para bajar hasta ella. */
export interface Destino {
  ruta: string;
  ancla?: string;
}

/*
  Las secciones que antes tenían página propia y ahora van dentro de otra.
  Sus rutas viejas (/carta, /juego…) siguen funcionando: llevan a su nuevo
  lugar. "tiempo" y "musica" ya no son una sección: van a la portada.
*/
const SECCIONES_MOVIDAS: Record<string, Destino & { rutaVieja: `/${string}` }> = {
  "mensaje-mes": { rutaVieja: "/este-mes", ruta: INICIO, ancla: "mensaje-mes" },
  carta: { rutaVieja: "/carta", ruta: INICIO, ancla: "carta" },
  tiempo: { rutaVieja: "/tiempo", ruta: INICIO },
  musica: { rutaVieja: "/musica", ruta: INICIO },
  constelacion: { rutaVieja: "/cielo", ruta: "/entretenimiento", ancla: "constelacion" },
  juego: { rutaVieja: "/juego", ruta: "/entretenimiento", ancla: "juego" }
};

/** Las rutas viejas que siguen funcionando (firebase.json también las sirve). */
export const RUTAS_VIEJAS: readonly `/${string}`[] = Object.values(SECCIONES_MOVIDAS).map((s) => s.rutaVieja);

/** Lo que cambia con la fecha (lo calcula App). */
export interface EnlacesVisibles {
  /** Época del calendario de adviento (lib/adviento.ts): en el menú mientras dura; después, en La Bóveda. */
  adviento?: "vigente" | "pasado" | null;
  /** Estado del cumpleaños; fuera de sus fechas (null) no hay página. */
  cumple?: Ocurrencia["estado"] | null;
}

/** Las páginas de hoy: las del menú y, además, las que se abren desde La Bóveda (recuerdos). */
export interface PaginasDeHoy {
  menu: Enlace[];
  todas: Enlace[];
}

// Con la rotación apagada, Bajada no tendría nada.
const SIN_PAGINA_POR_CONFIG: Partial<Record<IdPagina, boolean>> = {
  calendario: CONFIG.rotacionMina?.activa === false
};

/**
 * Las páginas que existen hoy (SPEC 1.1 y 1.2). "Adviento" está en el menú
 * en su época y, cuando ya pasó, se abre desde La Bóveda. "Cumpleaños" está
 * en el menú antes y el mismo día (ese día, primero); en los días de después
 * se abre desde La Bóveda.
 */
export function paginasDeHoy({ adviento = null, cumple = null }: EnlacesVisibles = {}): PaginasDeHoy {
  const existe = (enlace: Enlace): boolean => {
    if (SIN_PAGINA_POR_CONFIG[enlace.id]) return false;
    if (enlace.id === "adviento") return adviento !== null;
    if (enlace.id === "cumple") return cumple !== null;
    return true;
  };
  const todas = PAGINAS.filter(existe);
  const enMenu = (enlace: Enlace): boolean => {
    if (enlace.id === "adviento") return adviento === "vigente";
    if (enlace.id === "cumple") return cumple === "antes" || cumple === "hoy";
    return true;
  };
  const lista = todas.filter(enMenu);
  if (cumple !== "hoy") return { menu: lista, todas };
  // El día del cumpleaños su página va primera.
  const menu = [...lista.filter((e) => e.id === "cumple"), ...lista.filter((e) => e.id !== "cumple")];
  return { menu, todas };
}

/** Las páginas del menú de hoy (ver paginasDeHoy). */
export const enlacesVisibles = (visibles: EnlacesVisibles = {}): Enlace[] => paginasDeHoy(visibles).menu;

// Ids viejos que no son una página: llevan a la portada.
const IDS_DEL_INICIO = new Set(["inicio", "final", "welcome"]);

/**
 * Dónde está una sección por su id ("boveda" → /boveda; "juego" →
 * /entretenimiento, bajando hasta el juego). Sirve para los links viejos
 * (/#boveda) y para el botón de las cartas (accion.destino). null si el id
 * no es de ninguna sección.
 */
export function destinoDeSeccion(id: string): Destino | null {
  if (IDS_DEL_INICIO.has(id)) return { ruta: INICIO };
  const movida = SECCIONES_MOVIDAS[id];
  if (movida) return movida.ancla ? { ruta: movida.ruta, ancla: movida.ancla } : { ruta: movida.ruta };
  const pagina = PAGINAS.find((enlace) => enlace.id === id);
  return pagina ? { ruta: pagina.ruta } : null;
}

/** La ruta de una sección por su id (ver destinoDeSeccion). */
export const rutaDeSeccion = (id: string): string | null => destinoDeSeccion(id)?.ruta ?? null;

/** Una ruta vieja (/carta, /juego…) → su nuevo lugar. null si no es una ruta vieja. */
export function destinoDeRutaVieja(ruta: string): Destino | null {
  const movida = Object.values(SECCIONES_MOVIDAS).find((s) => s.rutaVieja === ruta);
  if (!movida) return null;
  return movida.ancla ? { ruta: movida.ruta, ancla: movida.ancla } : { ruta: movida.ruta };
}

/** La página que sigue a la actual, o null si es la última (o es la portada). */
export function siguienteDe(enlaces: readonly Enlace[], actual: Enlace | null): Enlace | null {
  const indice = actual ? enlaces.findIndex((enlace) => enlace.id === actual.id) : -1;
  return indice < 0 ? null : (enlaces[indice + 1] ?? null);
}

export type EstadoEstrella = "pasada" | "actual" | "pendiente";

/** Cómo se ve la estrella de una página según cuál se está viendo. */
export function estadoEstrella(indice: number, indiceActual: number): EstadoEstrella {
  if (indiceActual < 0 || indice > indiceActual) return "pendiente";
  return indice === indiceActual ? "actual" : "pasada";
}
