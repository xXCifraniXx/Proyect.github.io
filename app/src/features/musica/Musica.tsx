import { useEffect, useRef, useState } from "react";
import { CONFIG, TEXTOS } from "../../lib/contenido.ts";
import { CabeceraSeccion, Seccion } from "../../components/ui/index.ts";

const CANCION = CONFIG.musica?.cancion;
const VOLUMEN_INICIAL = Number(CONFIG.musica?.volumenInicial ?? 0.24);

/** Sección "Música": reproductor de la canción de los dos, con volumen. */
export default function Musica() {
  const audio = useRef<HTMLAudioElement>(null);
  const [sonando, setSonando] = useState(false);
  const [volumen, setVolumen] = useState(VOLUMEN_INICIAL);
  const [error, setError] = useState(false);

  // El volumen de un <audio> no es un atributo: se ajusta en el elemento.
  useEffect(() => {
    if (audio.current) audio.current.volume = volumen;
  }, [volumen]);

  if (!CANCION?.src) return null;

  const alternar = async () => {
    const el = audio.current;
    if (!el) return;
    try {
      if (sonando) el.pause();
      else await el.play();
    } catch {
      setError(true);
    }
  };

  return (
    <Seccion id="musica">
      <audio
        ref={audio}
        src={CANCION.src}
        preload="none"
        playsInline
        onPlay={() => setSonando(true)}
        onPause={() => setSonando(false)}
        onEnded={() => setSonando(false)}
      />
      <CabeceraSeccion etiqueta={TEXTOS.musicaEyebrow} titulo={TEXTOS.musicaTitle} intro={TEXTOS.musicaIntro} />
      <div className="music-panel glass-soft">
        <div className="music-info">
          <span className="music-label">{TEXTOS.musicLabel}</span>
          <strong>{CANCION.titulo || "Nuestra canción"}</strong>
          <span>{error ? "No se pudo reproducir el audio en este navegador." : CANCION.artista}</span>
        </div>
        <div className="music-controls">
          <button className="btn btn-primary" type="button" onClick={() => void alternar()}>
            {sonando ? TEXTOS.musicPause || "Pausar ⏸" : TEXTOS.musicPlay || "Reproducir 🎵"}
          </button>
          <label className="volume-control">
            <span>{TEXTOS.musicVolume}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volumen}
              onChange={(e) => setVolumen(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
    </Seccion>
  );
}
