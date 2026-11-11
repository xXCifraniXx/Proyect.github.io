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
