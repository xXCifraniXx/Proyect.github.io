import type { Boveda } from "../types/config.ts";

/* -------------------------------------------------------------------------
   LA BÓVEDA
   Cartas que se desbloquean solas en la fecha indicada. Antes de esa fecha
   se ven selladas con una cuenta regresiva; después se pueden abrir y leer.

   Campo opcional "accion":
     { destino: "constelacion", etiqueta: "..." }
   añade un botón dentro de la carta que lleva a esa sección de la página
   (destino = id de la sección: "constelacion", "juego", "cumple"...).

   Texto de la carta: "mensajeSellado" (cifrado, recomendado) o "mensaje"
   (texto normal, se puede leer mirando el código de la página antes de la
   fecha). Para sellar, leer o corregir una carta usa
   herramientas/sellar-carta.html.

   "borrador: true" oculta una carta que todavía no tiene texto.

   La carta de cumpleaños NO se escribe aquí: se agrega sola desde
   "cumpleanos.carta" con la fecha del cumpleaños.
------------------------------------------------------------------------- */
export const boveda: Boveda = {
  cartas: [
    {
      fecha: "2026-03-08T00:00:00",
      icono: "💌",
      titulo: "Para cuando abras esto por primera vez",
      mensajeSellado:
        "v1.rQ2w+ouOXQH/rAEYlKzfrg==.hpjmeSlpDjgNT7tt.1H5Vv4UaayUI37yKM1+QZWJwvD0ehWURRdrWYI3t7FjDL62Yjiq+vQXY4pwKI71hXhQvqlNXWAABMRJkTBmnWJWhZiC7Qz5uMb6CRBAZ7JvhpNzdRH2/qUk+hX+t3UCxhNhQ0paNWzOym8U8aUf7xvrCTO6Wk9qg+LKaV+bn8RcBBzt9/rHnEwGJKZR8jhd/EgXaXpJ9mC3aqEEsFwkvoxTXqfC9r3IeV36UWTreL+T68bib9EeUzyOR6FkBMH9gCuPzBMB0Py5sfawfUQ=="
    },
    {
      fecha: "2026-09-08T00:00:00",
      icono: "💜",
      titulo: "Seis meses contigo",
      mensajeSellado:
        "v1.oD5l7vKoHF95dIwPjgWieA==.7e4o0S8LR7CVgcCZ.LrGwJf1C8mb9d/uttl89BFcj6HqTwU/t2Oqsy8lmAHQkuMNvgV7AHV51IROoWHahGzpqfdJ13MQ+aVH3iHhlrU5tY4hBes8+wVl6xHU9ArRZoLgydeu0zKLKDEoTim9L4AIyb+6BMRe5wNnj25S46/v3mSdPWJgGUhTq0lFqfMBJ+XUr5NzXJO3rKA/mirsW6WrQccJ+sAB7tOzbPInfatCV0Raez/a04+nSk2kNnN7u1ok9X+hMcO7NNCCd1m1WyHd9EFp1CWydnAWx4MJG2EnguS6XULDcQNoSOEHJrDFZt0WiKa9FPqwBiVin9FQrtJ7kCHWDEKuOPzrVpSW1zarpietmj+ONci9WFAD/bCEKkEbVeUi2GLaZE69XgkM6qdt2aB7mmvHjQpSU5kMwgQdDcJHCT5NOJn3PIXyITDOKKZiwcuV8EovD8YWrdaWMXAEcv7BseOg3nnycIF9eMejk3bxMRC7gN7Ccq0wYAsUj0xuPJ0wsRAtYwBI20WtS8kMmWbNpVBE=",
      accion: { destino: "constelacion", etiqueta: "Ir a nuestra constelación ✦" }
    },
    {
      // borrador: true = no aparece en la página. Quítalo cuando la carta tenga su texto.
      borrador: true,
      fecha: "2026-12-24T00:00:00",
      icono: "🎄",
      titulo: "Feliz Navidad, mi vida",
      mensaje: ""
    }
  ]
};
