import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CONFIG, TEXTOS } from "../../lib/contenido.ts";
import { ContextoMusica, conArchivo, siguienteIndice, type CancionConArchivo, type EstadoMusica } from "./musica.ts";

const CANCIONES = conArchivo(CONFIG.musica?.canciones);
const VOLUMEN_INICIAL = Number(CONFIG.musica?.volumenInicial ?? 0.24);
// La imagen que muestra el celular en la pantalla bloqueada mientras suena.
const PORTADA = { src: "/assets/images/icono-180.png", sizes: "180x180", type: "image/png" };

interface ProveedorMusicaProps {
  children: ReactNode;
  /** Las canciones, en orden (por defecto, las de config; los tests pasan otras). */
  canciones?: CancionConArchivo[];
}

/** Cambia un control de la pantalla bloqueada (algunos navegadores no tienen todos). */
function controlBloqueo(accion: MediaSessionAction, alTocar: MediaSessionActionHandler | null) {
  try {
    navigator.mediaSession.setActionHandler(accion, alTocar);
  } catch {
    // Ese navegador no tiene este control: se queda sin él.
  }
}

/**
 * Las canciones de los dos para toda la página. No suenan solas: solo cuando
 * se toca el botón (y el navegador lo permite). Cada canción se baja recién
 * cuando le toca sonar, así que tener varias no hace más pesada la página.
 * Al terminar una empieza la siguiente; después de la última, otra vez la
 * primera. Sin canciones en config, no hay <audio> ni botones.
 */
export default function ProveedorMusica({ children, canciones = CANCIONES }: ProveedorMusicaProps) {
  const audio = useRef<HTMLAudioElement>(null);
  const total = canciones.length;
  // La canción que suena (o la que va a sonar). El ref es para los eventos
  // del <audio> y de la pantalla bloqueada, que no cambian con cada canción.
  const [indice, setIndice] = useState(0);
  const indiceActual = useRef(0);
  // La que tiene cargada el <audio>. El src se pone a mano y solo al cambiar
  // de canción: volver a ponerlo, aunque sea el mismo, la empieza de nuevo.
  const cargada = useRef<number | null>(null);
  const [sonando, setSonando] = useState(false);
  const [error, setError] = useState(false);

  // El volumen de un <audio> no es un atributo: se ajusta en el elemento.
  useEffect(() => {
    if (audio.current) audio.current.volume = VOLUMEN_INICIAL;
  }, []);

  // Se llama desde el toque del botón (o desde el fin de la canción anterior),
  // no desde un efecto: el iPhone solo deja sonar algo que pidió un toque.
  const tocar = useCallback(
    (i: number) => {
      const el = audio.current;
      const cancion = canciones[i];
      if (!el || !cancion) return;
      if (cargada.current !== i) {
        el.src = cancion.src;
        cargada.current = i;
      }
      indiceActual.current = i;
      setIndice(i);
      el.play().then(
        () => setError(false),
        () => setError(true)
      );
    },
    [canciones]
  );

  const alternar = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    if (!el.paused) el.pause();
    else tocar(indiceActual.current);
  }, [tocar]);

  const siguiente = useCallback(() => tocar(siguienteIndice(indiceActual.current, total)), [tocar, total]);

  // Con una sola canción, al terminar se queda en pausa (como siempre).
  const alTerminar = () => {
    if (total > 1) siguiente();
    else setSonando(false);
  };

  // En la pantalla bloqueada: el nombre de la canción y sus controles.
  const cancion = canciones[indice];
  useEffect(() => {
    if (!cancion || !("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: cancion.titulo || TEXTOS.musicaSinTitulo,
      artist: cancion.artista ?? "",
      artwork: [PORTADA]
    });
  }, [cancion]);

  useEffect(() => {
    if (!total || !("mediaSession" in navigator)) return;
    controlBloqueo("play", () => tocar(indiceActual.current));
    controlBloqueo("pause", () => audio.current?.pause());
    controlBloqueo("nexttrack", total > 1 ? siguiente : null);
    return () => {
      controlBloqueo("play", null);
      controlBloqueo("pause", null);
      controlBloqueo("nexttrack", null);
    };
  }, [total, tocar, siguiente]);

  const valor = useMemo<EstadoMusica>(
    () => ({
      disponible: total > 0,
      hayVarias: total > 1,
      sonando,
      error,
      titulo: cancion?.titulo || TEXTOS.musicaSinTitulo,
      tituloSiguiente: canciones[siguienteIndice(indice, total)]?.titulo || TEXTOS.musicaSinTitulo,
      alternar,
      siguiente
    }),
    [total, sonando, error, cancion, canciones, indice, alternar, siguiente]
  );

  return (
    <ContextoMusica.Provider value={valor}>
      {children}
      {total > 0 && (
        // Son canciones: no llevan subtítulos.
        // oxlint-disable-next-line jsx-a11y/media-has-caption
        <audio
          ref={audio}
          preload="none"
          playsInline
          onPlay={() => setSonando(true)}
          onPause={() => setSonando(false)}
          onEnded={alTerminar}
        />
      )}
    </ContextoMusica.Provider>
  );
}
