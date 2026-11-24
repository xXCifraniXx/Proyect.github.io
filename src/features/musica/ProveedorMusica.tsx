import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CONFIG, TEXTOS } from "../../lib/contenido.ts";
import { ContextoMusica, type EstadoMusica } from "./musica.ts";

const CANCION = CONFIG.musica?.cancion;
const VOLUMEN_INICIAL = Number(CONFIG.musica?.volumenInicial ?? 0.24);

/**
 * La canción de los dos para toda la página. No suena sola: solo cuando se
 * toca el botón (y el navegador lo permite). Sin canción en config, no hay
 * <audio> ni botón.
 */
export default function ProveedorMusica({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [sonando, setSonando] = useState(false);
  const [error, setError] = useState(false);
  const disponible = !!CANCION?.src;

  // El volumen de un <audio> no es un atributo: se ajusta en el elemento.
  useEffect(() => {
    if (audio.current) audio.current.volume = VOLUMEN_INICIAL;
  }, []);

  const alternar = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    if (!el.paused) {
      el.pause();
      return;
    }
    el.play().then(
      () => setError(false),
      () => setError(true)
    );
  }, []);

  const valor = useMemo<EstadoMusica>(
    () => ({ disponible, sonando, error, titulo: CANCION?.titulo || TEXTOS.musicaSinTitulo, alternar }),
    [disponible, sonando, error, alternar]
  );

  return (
    <ContextoMusica.Provider value={valor}>
      {children}
      {disponible && (
        // Es una canción: no lleva subtítulos.
        // oxlint-disable-next-line jsx-a11y/media-has-caption
        <audio
          ref={audio}
          src={CANCION?.src}
          preload="none"
          playsInline
          onPlay={() => setSonando(true)}
          onPause={() => setSonando(false)}
          onEnded={() => setSonando(false)}
        />
      )}
    </ContextoMusica.Provider>
  );
}
