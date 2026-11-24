/*
  TEMA DE LA PÁGINA
  El script del <head> (index.html, constelacion/index.html) pone
  data-tema="cafe" con ?tema=cafe en el link, antes de pintar. Los colores
  salen solos de los tokens; la letra del tema café (Nunito) se descarga aparte
  y solo en ese tema. Mientras llega se ve la letra de respaldo del token.
*/
export function cargarLetrasDelTema(): void {
  if (document.documentElement.dataset.tema !== "cafe") return;
  // Si no se puede descargar, se queda la letra de respaldo: no rompe nada.
  import("./letrasCafe.ts").catch(() => undefined);
}
