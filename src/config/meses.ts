import type { Carta, FotoDelMes } from "../types/config.ts";

/* -------------------------------------------------------------------------
   LÍNEA DE TIEMPO MENSUAL
   Una tarjeta por cada mes desde fechas.inicioRelacion hasta el mes actual.
   Se genera sola; aquí solo indicas la foto de cada mes.
   "mes" siempre en formato "AAAA-MM". Un mes sin entrada se muestra vacío.
------------------------------------------------------------------------- */
export const lineaTiempo: FotoDelMes[] = [
  {
    mes: "2026-03",
    titulo: "Marzo",
    src: "assets/images/marzo.webp",
    texto: "El mes en que empezamos esta historia."
  },
  {
    mes: "2026-04",
    titulo: "Abril",
    src: "assets/images/abril.webp",
    texto: "Hay momentos simples que contigo se sienten enormes."
  },
  {
    mes: "2026-05",
    titulo: "Mayo",
    src: "assets/images/mayo.webp",
    texto: "Me gusta construir contigo algo sincero, bonito y real."
  },
  {
    mes: "2026-06",
    titulo: "Junio",
    src: "assets/images/junio.webp",
    texto: "Tú sigues siendo mi lugar favorito."
  },
  {
    mes: "2026-07",
    titulo: "Julio",
    src: "assets/images/julio.webp",
    texto: "Un mes con el cumpleaños que nunca olvidaré. Gracias por pasarla conmigo!"
  },
  {
    mes: "2026-08",
    titulo: "Agosto",
    src: "assets/images/agosto.webp",
    texto: "Preparando nuestro viaje donde comienza nuestra convivencia."
  },
  {
    mes: "2026-09",
    titulo: "Septiembre",
    src: "assets/images/septiembre.webp",
    texto: "Recién empieza, llena de emociones pero agradezco que siempre estés a mi lado!"
  },
  {
    mes: "2026-10",
    titulo: "Octubre",
    src: "assets/images/octubre.webp",
    texto: "Nuestro primer viaje juntos fuera del país: Colombia, tú y yo."
  },
  {
    mes: "2026-11",
    titulo: "Noviembre",
    src: "assets/images/noviembre.webp",
    texto: "Ocho meses y todavía jugamos como niños."
  }
];

/* -------------------------------------------------------------------------
   MENSAJE DEL MES
   Un bloque aparte (debajo del inicio) con el mensaje de cada "mesiversario".
   Se muestra el último cuya fecha ya llegó; antes de esa fecha no se ve.
   El texto va sellado igual que en La Bóveda (herramientas/sellar-carta.html).
   Si no pones "titulo", se calcula solo: "Ocho meses", "Nueve meses"…
   "borrador: true" lo oculta hasta que tenga texto.
------------------------------------------------------------------------- */
export const mensajesMes: Carta[] = [
  {
    fecha: "2026-11-08T00:00:00",
    mensajeSellado:
      "v1.YJmp64Bzd+j33m5CDWEsdg==.zigakxAHTn2Yk8Qw.cCBKl7ZtRjDnHwrD1pwDM7K9OOzcg+xXHCa6GTTScRtCmBjXBDau0/pcVYM2tO9g1hioDsaljDFSuqyP06rx1192b7C6BkV406FAuoVrBEVkgUaF2uU3y2lJCg5iKpBImE/Ch4/1W8W8zvP72PZZip5ynTPCAkRMoCgg99GBSnq1JbvAgjqWIHZeNDUCPzBWXoaCHYoNN6+vvnaPL+I195gSMsKXQJ9ze4cDn3wc6tJRkuZCN5VQhl9EzYXuAODO5t8DJAeV+w+ISzOWyGa4E8GOM3qlnsPpSkwIcCgG+pZ8/Euk2lMCYZj3FFumEzL0Op+1CKkihUvg9YUkO4rg0vNJOogXlrMSJyVhGIVQL5zipO/xHOYdtgt+Cu486oJcebIHY+I8J5XimjOXZNCzRFT7WDLmAqOfZR3HRkc68wEswKEnFWLKdgTW2UgyMz0jYCt3OleTqOGuxggPJLePj0wOVIB2/Nvx8DpRp9QuHDelLT+Vn00B1ERYGi0upR827FzJp9IW9cGbMdGDIq3eL1PEG49+sNXyTfQ9z0k268Nw1WKCPh2LctPLc6IPfn9SZIPIfX5Kmp9JGUpLjtB6Dtn23bEFa1NeUZDqHy+R+dDlbTVbvB8qcYuhTIfc31epBdwI017Kq3DnERmLtNxu7zQ1MQkFEI+uBxhW2FmGPe/SGD/8gluRJKrbu+rT08Xr5C3N901l2mT1VK4Nw+YHlunrvKEcnyWEmJtE4N+d7pK1AuTHqi49hi3zyom+tAI1qhEjyool5UlJFh+4wyK+MOzeXk0dPG5gpvpmjwkHzgEGKKIveddD8oqjwZJanf8RCC1SuuhiDd0L58We9/tMaqPzx9Z4EbCHxPe2bQh5SK3y2iMDgZrR74JoTyduzKHziwza0Az7wbdUxHYrdWJIg4NhxpTIBNGGaUMQxmBPRA7DbClsqsOna9CX2FiH1tOfnHdfvlfW8okZc7P3XdMwBbLjTqN85nr541w6RGNab4x7I/T78x8mbdtSCg=="
  }
];
