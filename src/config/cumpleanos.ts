import type { Cumpleanos } from "../types/config.ts";

/* -------------------------------------------------------------------------
   CUMPLEAÑOS
   "nacimiento" (AAAA-MM-DD) es la única fuente: de ahí salen la fecha del
   cumpleaños de cada año y la edad. Escribe {edad} en cualquier texto y se
   reemplaza por la edad que cumple (27 en 2026, 28 en 2027...).

   Cada año la sección pasa por tres momentos y el resto del año no se ve:
     antes    → desde "diasAntes" días antes: regalo sellado con cuenta regresiva
     hoy      → modo cumpleaños: bienvenida especial, confeti, pastel con velas
     después  → durante "diasDespues" días queda de recuerdo
   La carta se agrega sola a La Bóveda con la fecha de ese año (se abre a las 00:00).
   Al cambiar de año, el pastel vuelve a empezar con las velas encendidas.

   Para probarlo sin cambiar el reloj:  index.html?cumple=antes | hoy | despues

   "velas": cuántas velas dibuja el pastel (1 a 9).
   "textosHoy": textos que reemplazan a "textos" SOLO el día del cumpleaños.
   El texto de la carta va sellado en "carta.mensajeSellado" ({edad} también
   funciona dentro del sello). Se sella con herramientas/sellar-carta.html.
------------------------------------------------------------------------- */
export const cumpleanos: Cumpleanos = {
  activo: true,
  nacimiento: "1999-10-11",
  diasAntes: 45,
  diasDespues: 60,
  velas: 5,
  carta: {
    icono: "🎂",
    titulo: "Feliz cumpleaños, mi amor",
    mensajeSellado:
      "v1.AGeP3x84cKMdT8bouJfrgA==.KUHduomlJs4e2VLW.EBN/1TDVh+2U8ABoC/ioM3iDiHH3036Y188qwKR6JSUp5Heyu7UyKshHf8FB9ZWMFsY4xTrLve+Kw6kZtRFz3sPwbq+i4OnqBJ+o6Ifb0NpgqP2+nhvzc/mYryyX90gHHQfdikbV1zIgf6Mk5Miw+0FdkJ18tBKUOfqlPKUrgdJZ+5O5aQzvUyQVuIIuzeoWinpVZ+9Q/wbdSKEMvCm1Avbsa0Inao06pIMU0Not91IsCik/GpXzwluL/d5pdcQ/1J8JZcADj1/dA7487XXUbyBMPAnOVzNEek5yCVJIbR/dBocuqlaE7OUK5aD4tt6wyZM7UBV5c5faayuvf9ZYicvHvFMOYdlcOUK+XeHYZD9yLNzyXu+uIFrC9dwd9OGMpNsJ60xGMm8NpRllwmkw8fMTnnSPPjpbSsMe8sx99W+kiT+6m+gky5m02RDFDEi+PNYg3DLl2okWvqsdHKJjZmNIAeaOT1whH+xkHxBtYWc2PIPXOORB1nveGcllTJBW8rfEt+Zu2/Z7begfKm4vuGMgdHmocxTgYcQte9cmfy7AV+tf6F1SazJjqNk2+LTsFFE7NexhHLt2hsm8g4bfPGg1Vec/IztOevORtYQBQ0b/RBST3j1RqA1K46ZOYV4sqBiUL06xz/xYC8n1VW1QNqPcwmSHBtbtJBge590WKrsldSLeygD7AvM1iRbNfeAfsqdEQrkKUeme2nT+as0v2iYUYXxs689NDG3ZyJW/34ThLmEcp55mJVRW+dk4EYdRB8qj8QlXTeZ+Okm1/jRqCLdB38I0olp7v7QfQeEGT8zz3+LP0dnLy2TU65RzG9CLDvDM/iwVkEyFoA1dwSr5P8yQFzIqByLkV0VStdQa8hzLM9sSr9MMiqxX6INxIkkfY1V5CdIth0INx8WE0LSGlIQv0iSYdu15+PP2jtHQgtP5LPtFoHP+882+WkZ4mD+NrInV+wekK7BqYuFdpyqNmQqrZEykBp9fRcnJ02V04dSZFhP/5L5FVfIy4XaPGtVL1nMwKF4TWKn3f44pnBmStWLXDCWDUxmC99UIz4unUUr/VpWLZ/U3KwCWbxPL"
  },
  textosHoy: {
    welcomeEyebrow: "Hoy es tu día 🎂",
    welcomeTitle: "¡Feliz cumpleaños, Anthu!",
    welcomeText: "Hoy cumples {edad} años y actualicé la página de fiesta para ti. Te amo 💜",
    welcomeButton: "Entrar a mi sorpresa 🎁",
    welcomeNote: "Con todo mi amor, Jorge",
    heroEyebrow: "Hoy es tu día",
    heroTitle: "Feliz cumpleaños, mi amor",
    heroCtaBoveda: "Sopla tus velas 🎂"
  }
};
