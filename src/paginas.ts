import { lazy } from "react";

/*
  PÁGINAS QUE SE DESCARGAN APARTE
  Cada una se baja recién cuando hace falta, así la primera carga queda
  liviana (SPEC.md, criterio 6). Un rato después de abrir el sitio se bajan
  todas en segundo plano (precargarPaginas), para que cambiar de página sea
  inmediato. La portada, La Bóveda y el mensaje del mes vienen en la carga
  inicial: App ya usa algo de sus carpetas.
*/
const cargadores = {
  adviento: () => import("./features/adviento/index.ts").then((m) => ({ default: m.Adviento })),
  carta: () => import("./features/carta/index.ts").then((m) => ({ default: m.CartaSorpresa })),
  galeria: () => import("./features/galeria/index.ts").then((m) => ({ default: m.Galeria })),
  tiempo: () => import("./features/tiempo/index.ts").then((m) => ({ default: m.TiempoJuntos })),
  bajadas: () => import("./features/bajadas/index.ts").then((m) => ({ default: m.Bajadas })),
  musica: () => import("./features/musica/index.ts").then((m) => ({ default: m.Musica })),
  cumple: () => import("./features/cumple/index.ts").then((m) => ({ default: m.Cumpleanos })),
  constelacion: () => import("./features/constelacion/index.ts").then((m) => ({ default: m.Constelacion })),
  juego: () => import("./features/juego/index.ts").then((m) => ({ default: m.Minijuego }))
};

export const Adviento = lazy(cargadores.adviento);
export const CartaSorpresa = lazy(cargadores.carta);
export const Galeria = lazy(cargadores.galeria);
export const TiempoJuntos = lazy(cargadores.tiempo);
export const Bajadas = lazy(cargadores.bajadas);
export const Musica = lazy(cargadores.musica);
export const Cumpleanos = lazy(cargadores.cumple);
export const Constelacion = lazy(cargadores.constelacion);
export const Minijuego = lazy(cargadores.juego);

/** Baja todas las páginas sin mostrarlas. Si falla (sin conexión), se bajan al abrirlas. */
export function precargarPaginas(): void {
  for (const cargar of Object.values(cargadores)) cargar().catch(() => undefined);
}
