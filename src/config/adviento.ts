import type { Adviento } from "../types/config.ts";

/* -------------------------------------------------------------------------
   CALENDARIO DE ADVIENTO (página /adviento)
   24 puertas, del 1 al 24 de diciembre de "anio". Cada una se abre a las
   00:00 de su día (hora del celular). Lo que lleva cada puerta está en
   puertas.ts.

   "desde" y "hasta": entre esas fechas se ve la página y su enlace en el
   menú (antes del 1 de diciembre, con las puertas cerradas). "hasta" no se
   incluye: con "2027-01-01T00:00:00" se ve hasta el 31 de diciembre.

   Para el año que viene: cambia "anio", "desde" y "hasta", y escribe las
   puertas nuevas en puertas.ts.
------------------------------------------------------------------------- */
export const adviento: Adviento = {
  anio: 2026,
  desde: "2026-11-22T00:00:00",
  hasta: "2027-01-01T00:00:00"
};
