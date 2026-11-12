/* Utilidades de fecha que usan varias secciones. */

export const pad2 = (value: number): string => String(value).padStart(2, "0");

export const capitalizar = (texto: string): string => (texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto);

/** "domingo, 8 de noviembre de 2026" */
export function formatoFechaLarga(fecha: Date): string {
  try {
    return fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  } catch {
    return `${pad2(fecha.getDate())}/${pad2(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
  }
}

/** Clave de mes "AAAA-MM". */
export const claveMes = (fecha: Date): string => `${fecha.getFullYear()}-${pad2(fecha.getMonth() + 1)}`;

/** "Noviembre de 2026" desde "2026-11". */
export function nombreMes(clave: string): string {
  const [year, month] = clave.split("-").map(Number);
  return capitalizar(new Date(year, month - 1, 1).toLocaleDateString("es-ES", { month: "long", year: "numeric" }));
}

/** "nov" desde "2026-11". */
export function nombreMesCorto(clave: string): string {
  const [year, month] = clave.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("es-ES", { month: "short" }).replace(".", "");
}

/** Meses completos entre dos fechas (8 de marzo → 8 de noviembre = 8). */
export function mesesEntre(inicio: Date, fin: Date): number {
  let meses = (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
  if (fin.getDate() < inicio.getDate()) meses -= 1;
  return Math.max(0, meses);
}

/** Todas las claves de mes desde "inicio" hasta el mes de "hasta", inclusive. */
export function mesesDesde(inicio: Date, hasta: Date): string[] {
  const meses: string[] = [];
  const cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
  const limite = new Date(hasta.getFullYear(), hasta.getMonth(), 1);
  while (cursor <= limite) {
    meses.push(claveMes(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return meses;
}

const DIA_MS = 86400000;

export const inicioDelDia = (fecha: Date): Date => new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

export function sumarDias(fecha: Date, dias: number): Date {
  const copia = new Date(fecha);
  copia.setDate(copia.getDate() + dias);
  return copia;
}

/** "AAAA-MM-DD" (sirve también para los <input type="date">). */
export const claveDia = (fecha: Date): string =>
  `${fecha.getFullYear()}-${pad2(fecha.getMonth() + 1)}-${pad2(fecha.getDate())}`;

/** Días de calendario entre dos fechas, sin importar la hora ni el horario de verano. */
export function diasCalendario(inicio: Date, fin: Date): number {
  const a = Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const b = Date.UTC(fin.getFullYear(), fin.getMonth(), fin.getDate());
  return Math.floor((b - a) / DIA_MS);
}

export interface PartesCuenta {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Lo que falta hasta "objetivo", en días, horas, minutos y segundos. */
export function partirCuenta(objetivo: Date, desde: Date): PartesCuenta {
  const ms = Math.max(0, objetivo.getTime() - desde.getTime());
  return {
    days: Math.floor(ms / DIA_MS),
    hours: Math.floor((ms % DIA_MS) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000)
  };
}

export interface TiempoJunto {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

/** Años, meses y días completos entre dos fechas, y el total de días. */
export function tiempoEntre(inicio: Date, fin: Date): TiempoJunto {
  let years = fin.getFullYear() - inicio.getFullYear();
  let months = fin.getMonth() - inicio.getMonth();
  let days = fin.getDate() - inicio.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(fin.getFullYear(), fin.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.max(0, Math.floor((fin.getTime() - inicio.getTime()) / DIA_MS));
  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days), totalDays };
}

/** "jueves, 12 de noviembre" */
export const fechaSinAnio = (fecha: Date): string =>
  new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long" }).format(fecha);

/** "Noviembre de 2026" desde una fecha. */
export const mesYAnio = (fecha: Date): string =>
  capitalizar(new Intl.DateTimeFormat("es", { month: "long", year: "numeric" }).format(fecha));
