import { useEffect, useState } from "react";
import { textoDeCarta, type CartaConEdad } from "../lib/cartas.ts";

/**
 * Descifra el texto de una carta cuando el componente se muestra.
 * Devuelve null mientras se abre el sello (o si no hay carta).
 */
export function useTextoCarta(carta: CartaConEdad | null): string | null {
  const [texto, setTexto] = useState<string | null>(null);

  useEffect(() => {
    if (!carta) return undefined;
    // Si la carta cambia antes de terminar, se ignora el resultado viejo.
    let vigente = true;
    void textoDeCarta(carta).then((resultado) => {
      if (vigente) setTexto(resultado);
    });
    return () => { vigente = false; };
  }, [carta]);

  return carta ? texto : null;
}
