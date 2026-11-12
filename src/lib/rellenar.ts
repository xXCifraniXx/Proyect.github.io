/**
 * Cambia cada {clave} de un texto por su valor:
 *   rellenar("Faltan {tiempo}", { tiempo: "3 d" })  →  "Faltan 3 d"
 * Una {clave} sin valor se deja como está ({edad} la rellena cumple.ts).
 */
export const rellenar = (texto: string, valores: Record<string, string | number>): string =>
  texto.replace(/\{(\w+)\}/g, (marca, clave: string) => (clave in valores ? String(valores[clave]) : marca));
