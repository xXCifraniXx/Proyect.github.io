import { ahora } from "./cumple.js";

/*
  MENSAJE DEL MES: cuál toca mostrar
  De config.mensajesMes se toma el último cuya fecha ya llegó; se ve desde esa
  fecha hasta el mismo día del mes siguiente. Devuelve la nota (con "inicio")
  o null. El texto se descifra en el componente.
*/
export function mensajeMesVigente(lista = window.APP_CONFIG?.mensajesMes || []) {
  const now = ahora();
  const nota = lista
    .filter((item) => !item.borrador && item.fecha && (item.mensaje || item.mensajeSellado))
    .map((item) => ({ ...item, inicio: new Date(item.fecha) }))
    .filter((item) => !Number.isNaN(item.inicio.getTime()) && item.inicio <= now)
    .sort((a, b) => b.inicio - a.inicio)[0];
  if (!nota) return null;

  const fin = new Date(nota.inicio);
  fin.setMonth(fin.getMonth() + 1);
  return now < fin ? nota : null;
}
