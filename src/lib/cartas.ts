import type { Carta } from "../types/config.ts";
import { TEXTOS } from "./contenido.ts";
import { abrirSello } from "./sello.ts";

/** Carta que puede traer la edad (la de cumpleaños), para reemplazar {edad}. */
export type CartaConEdad = Carta & { edad?: number };

/**
 * Texto de una carta ya desbloqueada. Si viene sellada (mensajeSellado) se
 * descifra aquí; {edad} se reemplaza en la carta de cumpleaños.
 */
export async function textoDeCarta(carta: CartaConEdad): Promise<string> {
  let texto = carta.mensaje ?? "";
  if (carta.mensajeSellado) {
    try {
      texto = await abrirSello(carta.mensajeSellado);
    } catch {
      texto = TEXTOS.bovedaSelloError;
    }
  }
  return carta.edad != null ? texto.split("{edad}").join(String(carta.edad)) : texto;
}

/** Separa el texto en párrafos (una línea en blanco entre párrafos). */
export const enParrafos = (texto: string): string[] =>
  texto
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
