import { TEXTOS } from "../../lib/contenido.ts";

/** Qué enlaces opcionales se muestran (dependen de la fecha). */
export interface EnlacesVisibles {
  mes?: boolean;
  cumple?: boolean;
}

export interface Enlace {
  /** "#id" de la sección. */
  href: `#${string}`;
  texto: string;
}

/**
 * Los enlaces del menú, en su orden (SPEC 1.2). Los comparten el menú de la
 * portada y la barra de secciones. "Este mes" y "Cumpleaños" solo aparecen
 * cuando su sección existe.
 */
export function enlacesVisibles(visibles: EnlacesVisibles = {}): Enlace[] {
  const todos: (Enlace & { visible?: boolean })[] = [
    { href: "#mensaje-mes", texto: TEXTOS.navMes, visible: !!visibles.mes },
    { href: "#carta", texto: TEXTOS.navCarta },
    { href: "#linea-tiempo", texto: TEXTOS.navMeses },
    { href: "#tiempo", texto: TEXTOS.navTiempo },
    { href: "#calendario", texto: TEXTOS.navBajada },
    { href: "#musica", texto: TEXTOS.navMusica },
    { href: "#cumple", texto: TEXTOS.navCumple, visible: !!visibles.cumple },
    { href: "#boveda", texto: TEXTOS.navBoveda },
    { href: "#constelacion", texto: TEXTOS.navConstelacion },
    { href: "#juego", texto: TEXTOS.navJuego }
  ];
  return todos.filter((enlace) => enlace.visible !== false).map(({ href, texto }) => ({ href, texto }));
}

/** El id de la sección a la que lleva un enlace ("#carta" → "carta"). */
export const idDe = (enlace: Enlace): string => enlace.href.slice(1);

/**
 * Ordena los ids según dónde están en la página y deja fuera los que no
 * existen (por ejemplo, la música sin canción). El día del cumpleaños su
 * sección va antes de la carta; los demás días, después de La Bóveda.
 */
export function ordenDePagina(ids: readonly string[], documento: Document = document): string[] {
  const elementos = ids.map((id) => documento.getElementById(id)).filter((el): el is HTMLElement => el !== null);
  elementos.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  return elementos.map((el) => el.id);
}

export type EstadoEstrella = "pasada" | "actual" | "pendiente";

/** Cómo se ve la estrella de una sección según dónde está ella ahora. */
export function estadoEstrella(indice: number, indiceActual: number): EstadoEstrella {
  if (indiceActual < 0 || indice > indiceActual) return "pendiente";
  return indice === indiceActual ? "actual" : "pasada";
}
