/*
  ROTACIÓN DE MINA (14 x 7)
  -------------------------
  Todo sale de config.rotacionMina, con un ajuste opcional ("próxima bajada")
  que se guarda en Firebase para los dos o en el dispositivo. El ajuste se
  expresa como el día en que baja; de ahí se recalcula la salidaBase y el
  patrón se repite desde esa fecha en adelante.
*/
import type { RotacionMina } from "../../types/config.ts";
import { claveDia, diasCalendario, fechaSinAnio, inicioDelDia, pad2, sumarDias } from "../../lib/fechas.ts";

/** Lo que se guarda al ajustar las bajadas desde la página. */
export interface AjusteBajadas {
  /** Día en que baja, "AAAA-MM-DD". */
  proximaBajada: string;
  diasMina: number;
  diasDescanso: number;
  /** "HH:MM" */
  horaRegreso: string;
}

interface Hora {
  hour: number;
  minute: number;
}

export interface Rotacion {
  activa: boolean;
  base: Date;
  baseDia: Date;
  diasMina: number;
  diasDescanso: number;
  diasCiclo: number;
  horaRegreso: Hora;
  mesesAMostrar: number;
  /** true si se está usando un ajuste en vez de src/config/general.ts */
  editada: boolean;
}

export interface Ciclo {
  inicioDia: Date;
  inicio: Date;
  bajada: Date;
  siguienteInicio: Date;
}

export interface Fase {
  titulo: string;
  texto: string;
  etiqueta: string;
  objetivo: Date;
}

export type TipoDia = "none" | "departure mine" | "mine" | "return" | "rest";

export function esAjusteValido(dato: unknown): dato is AjusteBajadas {
  return (
    !!dato &&
    typeof dato === "object" &&
    typeof (dato as AjusteBajadas).proximaBajada === "string" &&
    (dato as AjusteBajadas).proximaBajada.length > 0
  );
}

function leerHora(valor: string | undefined, horaPorDefecto = 21, minutoPorDefecto = 0): Hora {
  const [hour, minute] = String(valor ?? "")
    .split(":")
    .map(Number);
  return {
    hour: Number.isFinite(hour) ? hour : horaPorDefecto,
    minute: Number.isFinite(minute) ? minute : minutoPorDefecto
  };
}

function conHora(fecha: Date, hora: Hora): Date {
  const copia = new Date(fecha);
  copia.setHours(hora.hour, hora.minute, 0, 0);
  return copia;
}

/** Junta config.rotacionMina con el ajuste vigente (si hay). */
export function armarRotacion(
  fuente: RotacionMina,
  ajuste: AjusteBajadas | null,
  regresoFijo?: string | null
): Rotacion {
  let activa = fuente.activa !== false;
  let salidaBase = fuente.salidaBase;
  let diasMina = Math.max(1, Number(fuente.diasMina || 14));
  let diasDescanso = Math.max(1, Number(fuente.diasDescanso || 7));
  let horaRegreso = fuente.horaRegreso || "21:00";
  let editada = false;

  if (ajuste) {
    if (Number(ajuste.diasMina) > 0) diasMina = Math.max(1, Number(ajuste.diasMina));
    if (Number(ajuste.diasDescanso) > 0) diasDescanso = Math.max(1, Number(ajuste.diasDescanso));
    if (ajuste.horaRegreso) horaRegreso = ajuste.horaRegreso;
    const bajada = new Date(`${ajuste.proximaBajada}T00:00:00`);
    if (!Number.isNaN(bajada.getTime())) {
      // La salida es "diasMina" días antes de la bajada, a la hora de salida de config.
      const origen = new Date(fuente.salidaBase || 0);
      const h = Number.isNaN(origen.getTime()) ? 8 : origen.getHours();
      const m = Number.isNaN(origen.getTime()) ? 0 : origen.getMinutes();
      const salida = sumarDias(bajada, -diasMina);
      salidaBase = `${claveDia(salida)}T${pad2(h)}:${pad2(m)}:00`;
      activa = true;
      editada = true;
    }
  }

  const base = new Date(salidaBase || regresoFijo || Date.now());
  return {
    activa: activa && !Number.isNaN(base.getTime()),
    base,
    baseDia: inicioDelDia(base),
    diasMina,
    diasDescanso,
    diasCiclo: diasMina + diasDescanso,
    horaRegreso: leerHora(horaRegreso, 21, 0),
    mesesAMostrar: Math.max(1, Math.min(4, Number(fuente.mesesAMostrar || 1))),
    editada
  };
}

export function ciclo(rot: Rotacion, numero: number): Ciclo {
  const horaSalida: Hora = { hour: rot.base.getHours(), minute: rot.base.getMinutes() };
  const inicioDia = sumarDias(rot.baseDia, numero * rot.diasCiclo);
  return {
    inicioDia,
    inicio: conHora(inicioDia, horaSalida),
    bajada: conHora(sumarDias(inicioDia, rot.diasMina), rot.horaRegreso),
    siguienteInicio: conHora(sumarDias(inicioDia, rot.diasCiclo), horaSalida)
  };
}

const cicloInicial = (rot: Rotacion, ahora: Date) =>
  Math.max(0, Math.floor(diasCalendario(rot.baseDia, ahora) / rot.diasCiclo));

/** Próxima fecha de bajada a partir de "ahora". */
export function proximaBajada(rot: Rotacion, ahora: Date): Date | null {
  if (!rot.activa) return null;
  const n = cicloInicial(rot, ahora);
  for (let i = 0; i < 500; i += 1) {
    const c = ciclo(rot, n + i);
    if (c.bajada >= ahora) return c.bajada;
  }
  return null;
}

/** Dónde está ahora (subiendo, en mina o de descanso) y qué cuenta mostrar. */
export function faseActual(rot: Rotacion, ahora: Date): Fase | null {
  if (!rot.activa) return null;
  let n = cicloInicial(rot, ahora);
  let c = ciclo(rot, n);
  while (ahora >= c.siguienteInicio) c = ciclo(rot, ++n);
  while (n > 0 && ahora < c.inicio) c = ciclo(rot, --n);

  if (ahora < c.inicio) {
    return {
      titulo: "Próxima subida programada",
      texto: `La rotación empezará el ${fechaSinAnio(c.inicio)}.`,
      etiqueta: "Próxima subida",
      objetivo: c.inicio
    };
  }
  if (ahora < c.bajada) {
    return {
      titulo: "Ahora estás en mina 😿",
      texto: `La próxima bajada será el ${fechaSinAnio(c.bajada)} por la noche. Falta cada vez menos para volver a verte.`,
      etiqueta: "Próxima bajada",
      objetivo: c.bajada
    };
  }
  return {
    titulo: "Estás en tus días de bajada 😼",
    texto: `La próxima subida será el ${fechaSinAnio(c.siguienteInicio)}. Estos días son para descansar y guardar recuerdos bonitos 💜.`,
    etiqueta: "Próxima subida",
    objetivo: c.siguienteInicio
  };
}

/** Qué es un día del calendario: sube, mina, bajada o descanso. */
export function tipoDeDia(rot: Rotacion, dia: Date): { tipo: TipoDia; etiqueta: string } {
  const diff = diasCalendario(rot.baseDia, dia);
  if (diff < 0) return { tipo: "none", etiqueta: "" };
  const indice = ((diff % rot.diasCiclo) + rot.diasCiclo) % rot.diasCiclo;
  if (indice === 0) return { tipo: "departure mine", etiqueta: "Sube" };
  if (indice < rot.diasMina) return { tipo: "mine", etiqueta: "Mina" };
  if (indice === rot.diasMina) return { tipo: "return", etiqueta: "Bajada" };
  return { tipo: "rest", etiqueta: "Descanso" };
}
