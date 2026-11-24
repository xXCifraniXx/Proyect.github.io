import { createContext, useContext } from "react";

/*
  MÚSICA SIEMPRE A MANO
  La canción vive en un <audio> de toda la página (ProveedorMusica), así que
  sigue sonando al cambiar de página. El botón de la barra de secciones
  (BotonMusica) la pausa o la hace sonar.
*/

export interface EstadoMusica {
  /** Hay canción en config.musica (si no, no hay botón). */
  disponible: boolean;
  sonando: boolean;
  /** El navegador no la pudo reproducir. */
  error: boolean;
  /** El nombre de la canción, para el botón. */
  titulo: string;
  /** Pausa o hace sonar la canción. */
  alternar: () => void;
}

export const ContextoMusica = createContext<EstadoMusica>({
  disponible: false,
  sonando: false,
  error: false,
  titulo: "",
  alternar: () => undefined
});

/** El estado de la canción y cómo pausarla o hacerla sonar. */
export const useMusica = (): EstadoMusica => useContext(ContextoMusica);
