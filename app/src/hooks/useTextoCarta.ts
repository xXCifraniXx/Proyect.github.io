import { useEffect, useState } from "react";
import { textoDeCarta, type CartaConEdad } from "../lib/cartas.ts";

/**
 * Descifra el texto de una carta cuando el componente se muestra.
 * Devuelve null mientras se abre el sello (o si no hay carta).
 */
export function useTextoCarta(carta: CartaConEdad | null): string | null {
  // Se guarda de qué carta es el texto: si cambia la carta, no se muestra
  // ni por un instante el texto de la anterior.
  const [resultado, setResultado] = useState<{ carta: CartaConEdad; texto: string } | null>(null);

  useEffect(() => {
    if (!carta) return undefined;
    // Si la carta cambia antes de terminar, se ignora el resultado viejo.
    let vigente = true;
    void textoDeCarta(carta).then((texto) => {
      if (vigente) setResultado({ carta, texto });
    });
    return () => {
      vigente = false;
    };
  }, [carta]);

  return carta && resultado?.carta === carta ? resultado.texto : null;
}
