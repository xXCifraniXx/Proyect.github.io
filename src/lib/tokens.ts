/*
  COLORES DEL TEMA PARA EL <canvas>
  ---------------------------------
  Un <canvas> no lee CSS: el cielo, el cielo de adorno y el confeti toman sus
  colores de los tokens (src/styles/tokens.css, o cielo.css en la página del
  cielo) al empezar a dibujar. Así el tema café también les llega.

  Cada llamada pasa los valores del tema rosa: son los que quedan si un token
  no está (en los tests no se carga el CSS).
*/

/**
 * Lee los tokens pedidos ("rose-rgb" → --rose-rgb) del documento. Lo que no
 * esté definido queda con su valor por defecto.
 */
export function leerTokens<T extends Record<string, string>>(porDefecto: T): T {
  if (typeof document === "undefined") return porDefecto;
  const estilo = getComputedStyle(document.documentElement);
  const leidos: Record<string, string> = { ...porDefecto };
  for (const nombre of Object.keys(porDefecto)) {
    const valor = estilo.getPropertyValue(`--${nombre}`).trim();
    if (valor) leidos[nombre] = valor;
  }
  return leidos as T;
}

/** Un color con transparencia a partir de un token "-rgb" ("255 158 184"). */
export const conAlfa = (canales: string, alfa: number): string => `rgb(${canales} / ${alfa})`;
