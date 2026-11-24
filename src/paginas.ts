import { lazy } from "react";

/*
  PÁGINAS QUE SE DESCARGAN APARTE
  Cada una se baja recién cuando hace falta, así la primera carga queda
  liviana (SPEC.md, criterio 6). Un rato después de abrir el sitio se bajan
  todas en segundo plano (precargarPaginas), para que cambiar de página sea
  inmediato. La portada (con el mensaje del mes y la carta), La Bóveda, la
  franja del tiempo y la música vienen en la carga inicial.
*/
const cargadores = {
  adviento: () => import("./features/adviento/index.ts").then((m) => ({ default: m.Adviento })),
  galeria: () => import("./features/galeria/index.ts").then((m) => ({ default: m.Galeria })),
  bajadas: () => import("./features/bajadas/index.ts").then((m) => ({ default: m.Bajadas })),
  cumple: () => import("./features/cumple/index.ts").then((m) => ({ default: m.Cumpleanos })),
  entretenimiento: () => import("./features/entretenimiento/index.ts").then((m) => ({ default: m.Entretenimiento }))
};

export const Adviento = lazy(cargadores.adviento);
export const Galeria = lazy(cargadores.galeria);
export const Bajadas = lazy(cargadores.bajadas);
export const Cumpleanos = lazy(cargadores.cumple);
export const Entretenimiento = lazy(cargadores.entretenimiento);

/** Baja todas las páginas sin mostrarlas. Si falla (sin conexión), se bajan al abrirlas. */
export function precargarPaginas(): void {
  for (const cargar of Object.values(cargadores)) cargar().catch(() => undefined);
}
