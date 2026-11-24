import { createContext, useContext } from "react";
import type { Cancion } from "../../types/config.ts";

/*
  MÚSICA SIEMPRE A MANO
  Las canciones suenan en un solo <audio> de toda la página (ProveedorMusica),
  así que siguen sonando al cambiar de página. Los botones de la barra de
  secciones (BotonMusica y BotonSiguiente) la pausan, la hacen sonar o pasan
  a la siguiente.
*/

/** Una canción que sí tiene archivo. */
export type CancionConArchivo = Cancion & { src: string };

/** Las canciones de config que tienen archivo, en su orden. */
export function conArchivo(canciones: Cancion[] = []): CancionConArchivo[] {
  return canciones.filter((cancion): cancion is CancionConArchivo => !!cancion.src);
}

/** La que sigue a la canción i; después de la última, otra vez la primera. */
export function siguienteIndice(i: number, total: number): number {
  return total > 0 ? (i + 1) % total : 0;
}

export interface EstadoMusica {
  /** Hay al menos una canción con archivo (si no, no hay botones). */
  disponible: boolean;
  /** Hay más de una: sale el botón ⏭. */
  hayVarias: boolean;
  sonando: boolean;
  /** El navegador no la pudo reproducir. */
  error: boolean;
  /** El nombre de la canción que suena (o que va a sonar), para el botón. */
  titulo: string;
  /** El nombre de la que sigue, para el botón ⏭. */
  tituloSiguiente: string;
  /** Pausa o hace sonar la canción. */
  alternar: () => void;
  /** Pasa a la siguiente y la hace sonar. */
  siguiente: () => void;
}

export const ContextoMusica = createContext<EstadoMusica>({
  disponible: false,
  hayVarias: false,
  sonando: false,
  error: false,
  titulo: "",
  tituloSiguiente: "",
  alternar: () => undefined,
  siguiente: () => undefined
});

/** El estado de la música y cómo pausarla, hacerla sonar o pasar a la siguiente. */
export const useMusica = (): EstadoMusica => useContext(ContextoMusica);
