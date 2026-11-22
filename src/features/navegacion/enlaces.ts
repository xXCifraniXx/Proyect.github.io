import { CONFIG, TEXTOS } from "../../lib/contenido.ts";
import type { Ocurrencia } from "../../lib/cumple.ts";

/*
  PÁGINAS DEL SITIO
  Una sola lista para todo: de acá salen el menú de la portada, la barra de
  secciones, el "Seguir" al final de cada página y las rutas. Una página
  nueva se suma acá (y su ruta en firebase.json: un test avisa si falta).
*/

/** Id de cada página: el de su sección y el de los links viejos (#carta, #linea-tiempo…). */
export type IdPagina =
  | "mensaje-mes"
  | "adviento"
  | "carta"
  | "linea-tiempo"
  | "tiempo"
  | "calendario"
  | "musica"
  | "cumple"
  | "boveda"
  | "constelacion"
  | "juego";

export interface Enlace {
  id: IdPagina;
  /** Ruta de la página: "/carta", "/meses"… */
  ruta: `/${string}`;
  /** Nombre en el menú y en la barra. */
  texto: string;
}

/** La portada. */
export const INICIO = "/";

/** Todas las páginas, en el orden del menú. */
export const PAGINAS: readonly Enlace[] = [
  { id: "mensaje-mes", ruta: "/este-mes", texto: TEXTOS.navMes },
  { id: "adviento", ruta: "/adviento", texto: TEXTOS.navAdviento },
  { id: "carta", ruta: "/carta", texto: TEXTOS.navCarta },
  { id: "linea-tiempo", ruta: "/meses", texto: TEXTOS.navMeses },
  { id: "tiempo", ruta: "/tiempo", texto: TEXTOS.navTiempo },
  { id: "calendario", ruta: "/bajada", texto: TEXTOS.navBajada },
  { id: "musica", ruta: "/musica", texto: TEXTOS.navMusica },
  { id: "cumple", ruta: "/cumple", texto: TEXTOS.navCumple },
  { id: "boveda", ruta: "/boveda", texto: TEXTOS.navBoveda },
  // "/constelacion/" es la página del cielo (otro HTML): esta, la del cielo de adorno, va en "/cielo".
  { id: "constelacion", ruta: "/cielo", texto: TEXTOS.navConstelacion },
  { id: "juego", ruta: "/juego", texto: TEXTOS.navJuego }
];

/** Lo que cambia con la fecha (lo calcula App). */
export interface EnlacesVisibles {
  /** Hay un mensaje del mes vigente. */
  mes?: boolean;
  /** Es época del calendario de adviento (config/adviento.ts). */
  adviento?: boolean;
  /** Estado del cumpleaños; fuera de sus fechas (null) no hay página. */
  cumple?: Ocurrencia["estado"] | null;
}

// Sin canción o con la rotación apagada, esas páginas no tendrían nada.
const SIN_PAGINA_POR_CONFIG: Partial<Record<IdPagina, boolean>> = {
  musica: !CONFIG.musica?.cancion?.src,
  calendario: CONFIG.rotacionMina?.activa === false
};

/**
 * Las páginas que existen hoy, en su orden (SPEC 1.2). "Este mes" solo con
 * un mensaje del mes vigente, "Adviento" en su época y "Cumpleaños" solo en
 * sus fechas; el día del cumpleaños esa página sube justo después de "Este mes".
 */
export function enlacesVisibles({ mes = false, adviento = false, cumple = null }: EnlacesVisibles = {}): Enlace[] {
  const existe = (enlace: Enlace): boolean => {
    if (SIN_PAGINA_POR_CONFIG[enlace.id]) return false;
    if (enlace.id === "mensaje-mes") return mes;
    if (enlace.id === "adviento") return adviento;
    if (enlace.id === "cumple") return cumple !== null;
    return true;
  };
  const lista = PAGINAS.filter(existe);
  if (cumple !== "hoy") return lista;
  const sinCumple = lista.filter((enlace) => enlace.id !== "cumple");
  const despues = mes ? 1 : 0;
  return [...sinCumple.slice(0, despues), ...lista.filter((e) => e.id === "cumple"), ...sinCumple.slice(despues)];
}

// Ids viejos que no son una página: llevan a la portada.
const IDS_DEL_INICIO = new Set(["inicio", "final", "welcome"]);

/**
 * La ruta de una sección por su id viejo ("linea-tiempo" → "/meses"). Sirve
 * para los links viejos (/#boveda) y para el botón de las cartas
 * (accion.destino). null si el id no es de ninguna sección.
 */
export function rutaDeSeccion(id: string): string | null {
  if (IDS_DEL_INICIO.has(id)) return INICIO;
  return PAGINAS.find((enlace) => enlace.id === id)?.ruta ?? null;
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
