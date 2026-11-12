/* MINIJUEGO DE MEMORIA: armar y mezclar el mazo. */

export interface CartaMemoria {
  /** Único por carta (dos cartas comparten símbolo, no id). */
  id: number;
  simbolo: string;
}

/** Copia mezclada al azar (Fisher–Yates). */
export function mezclar<T>(lista: readonly T[]): T[] {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Cada símbolo dos veces, mezclados. Como mucho 8 parejas. */
export function crearMazo(simbolos: readonly string[]): CartaMemoria[] {
  const usados = simbolos.slice(0, 8);
  return mezclar([...usados, ...usados]).map((simbolo, id) => ({ id, simbolo }));
}
