import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCieloCompartido } from "./useCieloCompartido.ts";
import { useSesion } from "../sesion/index.ts";
import { descargarImagen } from "./dibujo.ts";
import { crearEstrella, guardarLocales, leerLocales, normalizar, type Estrella } from "./estrellas.ts";
import { marcarMigrado, pendientesQueFaltan, yaMigrado } from "./migracion.ts";
import { nubeActiva } from "../../lib/firebase.ts";
import BarraCielo from "./BarraCielo.tsx";
import BurbujaEstrella from "./BurbujaEstrella.tsx";
import CompositorEstrella from "./CompositorEstrella.tsx";
import LienzoCielo from "./LienzoCielo.tsx";

const PISTA_INICIAL = "Toca cualquier parte del cielo para poner una estrella y escribir un recuerdo.";

/*
  PÁGINA DEL CIELO
  Cada toque en el cielo crea una estrella con un recuerdo; se unen en el
  orden en que nacieron.
  - Sin Firebase (o si falla), el cielo se guarda solo en este dispositivo.
  - Con Firebase, el cielo es el mismo para los dos y se actualiza en vivo.
    Cualquiera puede mirarlo; poner o quitar estrellas solo pueden los dos
    miembros, con su sesión de Google.
*/
export default function PaginaCielo() {
  const sesion = useSesion();
  const nube = useCieloCompartido();
  const [locales, setLocales] = useState<Estrella[]>(leerLocales);

  // Con la nube conectada manda el cielo compartido; si no, el del dispositivo.
  const enNube = nube.remotas !== null && nube.estado !== "error";
  const estrellas = useMemo(
    () => (enNube && nube.remotas ? normalizar(nube.remotas, true) : locales),
    [enNube, nube.remotas, locales]
  );

  // El cielo compartido también queda copiado en el dispositivo.
  useEffect(() => {
    if (enNube) guardarLocales(estrellas);
  }, [enNube, estrellas]);

  // La primera vez que uno de los dos entra desde este dispositivo, sube las
  // estrellas que había guardadas antes de compartir el cielo.
  const { agregar, quitar, vaciar } = nube;
  useEffect(() => {
    if (!nube.remotas || !sesion.miembro || yaMigrado()) return;
    pendientesQueFaltan(new Set(nube.remotas.map((s) => s.id))).forEach((s) => void agregar(s));
    marcarMigrado();
  }, [nube.remotas, sesion.miembro, agregar]);

  // ----- avisos (la línea de abajo) -----
  const [pista, setPista] = useState({ texto: PISTA_INICIAL, visible: true, inicial: true });
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);
  const avisar = useCallback((texto: string) => {
    setPista({ texto, visible: true, inicial: false });
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setPista((p) => ({ ...p, visible: false })), 6000);
  }, []);
  useEffect(() => () => clearTimeout(temporizador.current), []);
  // La pista del principio se va sola cuando ya hay estrellas.
  const pistaVisible = pista.visible && !(pista.inicial && estrellas.length > 0);

  // ----- quién puede editar -----
  const [resaltarSesion, setResaltarSesion] = useState(false);
  const conectando = nubeActiva && nube.estado !== "error" && (!sesion.lista || nube.estado === "conectando");
  // Valor simple para el render (por ejemplo, si se muestra la × de la burbuja).
  const editable = !nubeActiva || nube.estado === "error" || (!conectando && sesion.miembro);

  // En los eventos: además de responder, avisa por qué no se puede.
  const puedeEditar = (): boolean => {
    if (editable) return true;
    if (conectando) avisar("Conectando con el cielo compartido…");
    else if (sesion.usuario)
      avisar(`Con ${sesion.usuario.email || "esta cuenta"} puedes mirar el cielo, pero no cambiarlo.`);
    else {
      avisar("Inicia sesión con Google para poner o quitar estrellas ✦");
      setResaltarSesion(true);
    }
    return false;
  };

  const siFalla = (error: unknown) => {
    console.warn("[constelación] no se pudo guardar:", error);
    avisar(
      (error as { code?: string }).code === "permission-denied"
        ? "Esta cuenta no puede cambiar el cielo. Entra con la cuenta de uno de los dos."
        : "No se pudo guardar en el cielo compartido. Revisa la conexión."
    );
  };

  // ----- acciones -----
  const [nuevaEn, setNuevaEn] = useState<{ x: number; y: number } | null>(null);
  const [activaId, setActivaId] = useState<string | null>(null);
  const [etiquetaHasta, setEtiquetaHasta] = useState(0);
  const burbuja = useRef<HTMLDivElement>(null);
  const activa = estrellas.find((s) => s.id === activaId) ?? null;

  const cambiarLocales = (siguiente: Estrella[]) => {
    setLocales(siguiente);
    guardarLocales(siguiente);
  };

  const anadir = (etiqueta: string) => {
    if (!nuevaEn) return;
    const estrella = crearEstrella(nuevaEn, etiqueta);
    setNuevaEn(null);
    setEtiquetaHasta(Date.now() + 4000);
    if (enNube) void agregar(estrella).catch(siFalla);
    else cambiarLocales([...locales, estrella]);
  };

  const quitarEstrella = (estrella: Estrella) => {
    if (!puedeEditar()) return;
    setActivaId(null);
    if (enNube) void quitar(estrella).catch(siFalla);
    else cambiarLocales(locales.filter((s) => s.id !== estrella.id));
  };

  const deshacer = () => {
    const ultima = estrellas[estrellas.length - 1];
    if (ultima && puedeEditar()) quitarEstrella(ultima);
  };

  const vaciarCielo = () => {
    if (estrellas.length === 0 || !puedeEditar()) return;
    const pregunta = enNube
      ? "¿Vaciar el cielo por completo? Se borra para los dos y no se puede deshacer."
      : "¿Vaciar el cielo por completo? Esto no se puede deshacer.";
    if (!window.confirm(pregunta)) return;
    setActivaId(null);
    if (enNube) void vaciar(estrellas).catch(siFalla);
    else cambiarLocales([]);
  };

  const alTocarVacio = (pos: { x: number; y: number }) => {
    setActivaId(null);
    if (!puedeEditar()) return;
    setNuevaEn(pos);
    setPista((p) => ({ ...p, visible: false }));
  };

  // Tocar fuera de la burbuja (y fuera del cielo) la cierra.
  useEffect(() => {
    if (!activaId) return undefined;
    const alTocar = (e: PointerEvent) => {
      const destino = e.target as Element;
      if (!burbuja.current?.contains(destino) && destino.id !== "sky") setActivaId(null);
    };
    document.addEventListener("pointerdown", alTocar);
    return () => document.removeEventListener("pointerdown", alTocar);
  }, [activaId]);

  // ----- contador -----
  const n = estrellas.length;
  let contador =
    n === 0
      ? "El cielo está vacío. Empieza por la primera estrella."
      : `${n} ${n === 1 ? "estrella en nuestro cielo" : "estrellas en nuestro cielo"}`;
  if (nube.estado === "online") contador += " · compartido ✦";
  else if (nube.estado === "offline") contador += " · sin conexión, se enviará al volver";
  else if (nube.estado === "error") contador += " · sin nube, guardado solo en este dispositivo";

  return (
    <>
      <LienzoCielo
        estrellas={estrellas}
        etiquetaHasta={etiquetaHasta}
        activaId={activaId}
        burbuja={burbuja}
        pausado={nuevaEn !== null}
        onTocarVacio={alTocarVacio}
        onTocarEstrella={(s) => setActivaId(s.id)}
      />
      <BarraCielo
        sesion={nubeActiva ? sesion : null}
        resaltarSesion={resaltarSesion}
        puedeDeshacer={n > 0}
        onDeshacer={deshacer}
        onDescargar={() => descargarImagen(estrellas, window.innerWidth, window.innerHeight)}
        onVaciar={vaciarCielo}
      />
      <p className={`hint${pistaVisible ? "" : " fade"}`}>{pista.texto}</p>
      {nuevaEn && <CompositorEstrella onGuardar={anadir} onCancelar={() => setNuevaEn(null)} />}
      {activa && (
        <BurbujaEstrella
          ref={burbuja}
          estrella={activa}
          puedeQuitar={editable}
          onQuitar={() => quitarEstrella(activa)}
        />
      )}
      <footer className="counter" aria-live="polite">
        {contador}
      </footer>
    </>
  );
}
