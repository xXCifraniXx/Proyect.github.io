import { useMemo, useState } from "react";
import { useAhora } from "../hooks/useAhora.ts";
import { useAjusteCompartido } from "../hooks/useAjusteCompartido.ts";
import { useSesion } from "../hooks/useSesion.ts";
import { borrarAjusteLocal, guardarAjusteLocal, leerAjusteLocal } from "../lib/ajusteLocal.ts";
import { CONFIG, TEXTOS } from "../lib/contenido.ts";
import { claveDia, mesYAnio } from "../lib/fechas.ts";
import { armarRotacion, esAjusteValido, faseActual, proximaBajada, type AjusteBajadas } from "../lib/rotacion.ts";
import EditorBajadas from "./EditorBajadas.tsx";
import EstadoRotacion from "./EstadoRotacion.tsx";
import LeyendaCalendario from "./LeyendaCalendario.tsx";
import MesCalendario from "./MesCalendario.tsx";
import Seccion from "./Seccion.tsx";

const primeroDeMes = (fecha: Date) => new Date(fecha.getFullYear(), fecha.getMonth(), 1);

/*
  SECCIÓN "BAJADA": calendario de la rotación 14 x 7
  - Estado actual (en mina o de descanso) con su cuenta regresiva.
  - Uno o más meses del calendario, con flechas y botón "Hoy".
  - Panel para ajustar la próxima bajada: con sesión de uno de los dos se
    guarda en Firebase y lo ven ambos; sin sesión, solo en este dispositivo.
    Si hay un ajuste compartido, manda sobre el del dispositivo.
*/
export default function Bajadas() {
  const ahora = useAhora();
  const sesion = useSesion();
  const compartido = useAjusteCompartido();
  const [local, setLocal] = useState<AjusteBajadas | null>(leerAjusteLocal);

  const ajuste = esAjusteValido(compartido.ajuste) ? compartido.ajuste : local;
  const hoy = claveDia(ahora);

  const rotacion = useMemo(
    () => armarRotacion(CONFIG.rotacionMina ?? {}, ajuste, CONFIG.fechas?.regreso),
    [ajuste]
  );

  const [cursor, setCursor] = useState(() => primeroDeMes(
    CONFIG.opciones?.calendarioDesdeHoy === false ? rotacion.baseDia : ahora
  ));

  // Los meses a dibujar solo cambian con el cursor o la rotación.
  const meses = useMemo(
    () => Array.from({ length: rotacion.mesesAMostrar }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth() + i, 1)),
    [cursor, rotacion.mesesAMostrar]
  );

  if (!rotacion.activa) return null;
  const fase = faseActual(rotacion, ahora);

  const moverMes = (paso: number) => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + paso, 1));
  const irAHoy = () => setCursor(primeroDeMes(new Date()));

  const etiquetaRango = meses.length === 1
    ? mesYAnio(meses[0])
    : `${mesYAnio(meses[0]).split(" ")[0]} - ${mesYAnio(meses[meses.length - 1])}`;

  const inicial: AjusteBajadas = {
    proximaBajada: claveDia(proximaBajada(rotacion, ahora) ?? ahora),
    diasMina: rotacion.diasMina,
    diasDescanso: rotacion.diasDescanso,
    horaRegreso: `${String(rotacion.horaRegreso.hour).padStart(2, "0")}:${String(rotacion.horaRegreso.minute).padStart(2, "0")}`
  };

  const guardar = async (nuevo: AjusteBajadas): Promise<string> => {
    if (sesion.miembro) {
      try {
        await compartido.guardar(nuevo);
      } catch (error) {
        console.warn("[bajadas] no se pudo guardar en la nube:", error);
        return TEXTOS.rosterEditorCloudError || "No se pudo guardar para los dos. Revisa la conexión.";
      }
      borrarAjusteLocal();
      setLocal(null);
      irAHoy();
      return TEXTOS.rosterEditorSavedSharedMsg || TEXTOS.rosterEditorSavedMsg || "Guardado.";
    }
    if (!guardarAjusteLocal(nuevo)) return TEXTOS.rosterEditorStorageError || "No se pudo guardar en este navegador.";
    setLocal(nuevo);
    irAHoy();
    return TEXTOS.rosterEditorSavedMsg || "Guardado.";
  };

  const restablecer = async (): Promise<string> => {
    if (esAjusteValido(compartido.ajuste)) {
      if (!sesion.miembro) {
        return TEXTOS.rosterEditorResetNeedsLogin || "Inicia sesión para volver al calendario original para los dos.";
      }
      try {
        await compartido.borrar();
      } catch (error) {
        console.warn("[bajadas] no se pudo borrar en la nube:", error);
        return TEXTOS.rosterEditorCloudError || "No se pudo guardar para los dos. Revisa la conexión.";
      }
    }
    borrarAjusteLocal();
    setLocal(null);
    irAHoy();
    return TEXTOS.rosterEditorResetMsg || "Listo.";
  };

  return (
    <Seccion id="calendario">
      <div className="section-head calendar-head">
        <div>
          <span className="eyebrow">{TEXTOS.calendarEyebrow}</span>
          <h2>{TEXTOS.calendarTitle}</h2>
          <p>{TEXTOS.calendarIntro}</p>
        </div>
        <LeyendaCalendario />
      </div>

      {fase && <EstadoRotacion fase={fase} ahora={ahora} />}

      <div className="calendar-toolbar glass-soft">
        <button className="round-btn" type="button" aria-label="Mes anterior" onClick={() => moverMes(-1)}>‹</button>
        <strong>{etiquetaRango}</strong>
        <button className="round-btn" type="button" aria-label="Mes siguiente" onClick={() => moverMes(1)}>›</button>
        <button className="today-btn" type="button" onClick={irAHoy}>{TEXTOS.calendarTodayBtn}</button>
      </div>

      <div className="calendar-months" aria-label="Calendario de rotación">
        {meses.map((mes) => <MesCalendario key={claveDia(mes)} mes={mes} rotacion={rotacion} hoy={hoy} />)}
      </div>

      <EditorBajadas
        inicial={inicial}
        minimo={hoy}
        hayAjuste={ajuste !== null}
        editada={rotacion.editada}
        sesion={sesion}
        onGuardar={guardar}
        onRestablecer={restablecer}
      />
    </Seccion>
  );
}
