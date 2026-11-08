/*
  CONFIGURACIÓN CENTRAL
  ---------------------
  Todo el contenido editable del sitio vive aquí. El HTML es solo una plantilla
  vacía: JavaScript lee este objeto y rellena textos, fechas, música, cartas y
  el minijuego. Para cambiar algo, edita este archivo y nada más.

  Cómo se conecta con el HTML:
  - Los elementos con  data-bind="textos.heroTitle"  reciben ese texto.
  - Las secciones dinámicas (línea de tiempo, calendario, Bóveda, juego) se
    generan desde las listas de más abajo.
*/
window.APP_CONFIG = {
  nombres: {
    novia: "Anthuanete",
    autor: "Jorge"
  },

  fechas: {
    // Fecha real desde la que están juntos.
    inicioRelacion: "2026-03-08T00:00:00",
    // Fecha de regreso. Deja null si no quieres cuenta regresiva.
    regreso: "2026-05-28T21:00:00"
  },

  // Turno 14 x 7 (sección "Bajada"). Deja activa: false para ocultarla.
  //
  // salidaBase = un día en que subió a mina (día 1 del ciclo). El patrón 14x7
  // se recalcula desde ahí. Para reprogramar rápido está el editor de la propia
  // página ("Ajustar bajadas de mina"), pero ese ajuste vive solo en el
  // navegador donde se hace; para dejarlo fijo en el link, cambia salidaBase.
  //
  // Actual: bajó el jueves 27/08, así la bajada cae el jueves 10/09 y luego
  // sigue el 14x7 normal (01/10, 22/10, ...).
  rotacionMina: {
    activa: true,
    salidaBase: "2026-08-27T08:00:00",
    diasMina: 14,
    diasDescanso: 7,
    horaRegreso: "21:00",
    mesesAMostrar: 1
  },

  /* -------------------------------------------------------------------------
     TEXTOS
     Cada clave corresponde a un  data-bind  en index.html. Cambiar el texto
     aquí lo cambia en la página, sin tocar el HTML.
  ------------------------------------------------------------------------- */
  textos: {
    // Navegación
    navMes: "Este mes",
    navCarta: "Carta",
    navMeses: "Meses",
    navTiempo: "Tiempo",
    navBajada: "Bajada",
    navMusica: "Música",
    navBoveda: "La Bóveda",
    navConstelacion: "Constelación",
    navJuego: "Juego",

    // Pantalla de bienvenida
    welcomeEyebrow: "Una sorpresa para ti",
    welcomeTitle: "Lee esto con calma",
    welcomeText: "Preparé esta página como una carta pequeña, bonita y hecha con amor, para que puedas sentirme cerca " +
        "incluso a la distancia.",
    welcomeButton: "Entrar a la carta 💗",
    welcomeNote: "Actualización — Noviembre 2026",

    // Portada
    heroEyebrow: "Hecho con cariño",
    heroTitle: "Anthu, contigo todo se siente más bonito",
    heroIntro: "Quiero que esta página sea algo para los dos y puedas abrir desde tu celular para sentirnos cerca " +
        "incluso estando lejos. Algo bonito y sincero, porque pensar en ti siempre me da paz.",
    heroCtaCarta: "Abrir mi carta 💌",
    heroCtaBoveda: "Abrir La Bóveda ⏳",

    // Sobre / carta interactiva
    letterTitle: "Para Anthuanete",
    letterMessage: "Gracias por estar en mi vida de una manera tan bonita. No importa la distancia, sigues siendo ese " +
        "lugar feliz y cálido en mi corazón. Siempre te voy a cuidar, valorar y amar con todo mi ser.",
    letterSignature: "Con amor, Jorge",
    letterHintClosed: "Toca el sobre para abrirlo con calma.",
    letterHintOpen: "La carta ya está abierta. Puedes tocar el sobre para cerrarla.",
    letterOpen: "Abrir carta",
    letterClose: "Cerrar carta",

    // Sección Carta
    cartaEyebrow: "Carta",
    cartaTitle: "Nunca debes olvidar lo especial que eres para mí",
    cartaIntro: "Tu forma de ser, tu ternura, tu risa y tu manera de estar en mi vida hacen que cada día me sienta afortunado.",
    surpriseOpen: "Ver mensaje sorpresa 💗",
    surpriseClose: "Ocultar mensaje 💌",
    surpriseMessage: "¡Felices 6 meses, mi vida! 💜\n" +
        "\n" +
        "Dejando de lado las disculpas, quería actualizar esta página para celebrar nuestro medio año juntos. Mirar " +
        "atrás y ver todo lo que hemos construido, superando la distancia, los horarios y los enojos, me hace darme " +
        "cuenta de lo afortunado que soy. No somos perfectos, pero somos el mejor equipo y mi compromiso contigo sigue " +
        "siendo estar contigo para siempre.\n" +
        "\n" +
        "Dime qué más te gustaría agregar o cambiar, porque quiero que siga creciendo junto a nuestro amor. Gracias por " +
        "enseñarme tanto y por ser mi hogar. Te amo infinito.",

    // Línea de tiempo mensual
    timelineEyebrow: "Cada mes juntos",
    timelineTitle: "Una foto por mes, desde que empezamos",
    timelineIntro: "Cada mes se suma una foto nueva. Desliza o toca un mes para verla.",
    timelineEmpty: "La foto de este mes está por llegar 💜",

    // Mensaje del mes (el texto de cada mes va en "mensajesMes")
    mesFirma: "Jorge",

    // Nuestro tiempo
    tiempoEyebrow: "Nuestro tiempo",
    tiempoTitle: "El tiempo que hemos compartido",
    timeIntro: "El tiempo contigo también se mide en calma, sonrisas y recuerdos.",
    labelYears: "Años",
    labelMonths: "Meses",
    labelDays: "Días",
    labelTotalDays: "Días en total",
    returnTitle: "Para volver a verte",
    returnText: "Falta cada vez menos para volver a abrazarte con calma.",
    countdownEyebrow: "Cuenta regresiva",
    labelCountdownDays: "Días",
    labelCountdownHours: "Horas",
    labelCountdownMinutes: "Min",
    labelCountdownSeconds: "Seg",

    // Calendario 14 x 7
    calendarEyebrow: "Calendario 14 x 7",
    calendarTitle: "Días de mina y bajada",
    calendarIntro: "Aquí se marcan los días en mina, de bajada y los días de descanso. Así sabemos exactamente en qué " +
        "día estamos y cuánto falta para volver a vernos.",
    legendMine: "En mina",
    legendDeparture: "Sube",
    legendReturn: "Bajada",
    legendRest: "Descanso",
    legendToday: "Hoy",
    calendarTodayBtn: "Volver a hoy",
    rosterEyebrow: "Estado actual",

    // Editor de bajadas (se muestra dentro de la sección del calendario)
    rosterEditorTitle: "Ajustar bajadas de mina",
    rosterEditorNextDown: "Próxima bajada (día que baja)",
    rosterEditorMineDays: "Días en mina",
    rosterEditorRestDays: "Días de descanso",
    rosterEditorReturnTime: "Hora de regreso",
    rosterEditorNote: "Elige el día en que baja y el calendario 14x7 se reacomoda solo desde esa fecha en adelante. El " +
        "ajuste se guarda solo en este dispositivo.",
    rosterEditorSave: "Guardar bajada",
    rosterEditorReset: "Volver al calendario original",
    rosterEditorSavedMsg: "Guardado. El calendario ya usa la nueva bajada.",
    rosterEditorResetMsg: "Listo. El calendario volvió a su versión original.",
    rosterEditorInvalidMsg: "Elige una fecha válida para la próxima bajada.",
    rosterEditorStorageError: "No se pudo guardar en este navegador.",

    // Música
    musicaEyebrow: "Música",
    musicaTitle: "Una canción para acompañar el momento",
    musicaIntro: "Nuestra canción, lista para sonar mientras lees.",
    musicLabel: "Canción actual",
    musicVolume: "Volumen",
    musicPlay: "Reproducir 🎵",
    musicPause: "Pausar ⏸",

    // La Bóveda
    bovedaEyebrow: "La Bóveda",
    bovedaTitle: "Cartas que se abren con el tiempo",
    bovedaIntro: "Cada carta tiene su propio momento para abrirse. Antes de esa fecha solo verás cuánto falta.",
    bovedaLockedTitle: "Carta sellada",
    bovedaReadHint: "Toca para leer",
    bovedaEmpty: "Pronto habrá cartas esperándote aquí 💌",
    bovedaSelloError: "No se pudo abrir esta carta en este navegador. Prueba a abrir la página en otro.",

    // Constelación
    constelacionEyebrow: "Nuestro cielo",
    constelacionTitle: "Una constelación para los dos",
    constelacionIntro: "Un cielo en blanco donde cada toque crea una estrella con un recuerdo. Las estrellas se unen y " +
        "forman una constelación. Podrás guardarla como imagen.",
    constelacionBtn: "Abrir nuestra constelación ✦",

    // Minijuego
    juegoEyebrow: "Un momento juntos",
    juegoTitle: "Encuentra las parejas",
    juegoIntro: "Un memory rápido para jugar los dos.",
    juegoMovesLabel: "Intentos",
    juegoPairsLabel: "Parejas",
    juegoRestart: "Reiniciar",
    juegoPlayAgain: "Jugar de nuevo",
    juegoWin: "¡Lo lograste! Eres muy buena amorcito. Te amo 💜",

    // Cumpleaños (la fecha y la carta están en "cumpleanos", más abajo)
    navCumple: "Cumpleaños 🎂",
    cumpleEyebrow: "Un día especial",
    cumpleTituloAntes: "Falta poco para tu día",
    cumpleIntroAntes: "Estoy preparando algo especial para cuando cumplas {edad}. Cuando llegue el día, esta sección se abre sola.",
    cumpleAntesLabel: "Faltan para tu cumpleaños",
    cumpleTituloHoy: "¡Feliz cumpleaños número {edad}, mi amor!",
    cumpleIntroHoy: "Pide un deseo y apaga las velas: toca cada una o usa el botón.",
    cumpleTituloDespues: "Tu día especial 🎂",
    cumpleIntroDespues: "Aquí queda guardada tu sorpresa de cumpleaños. Puedes volver a encender las velas cuando quieras.",
    cumpleBtnSoplar: "Soplar las velas 💨",
    cumpleDeseo: "¡Pide un deseo! ✨ Ojalá se cumpla todo lo que sueñas.",
    cumpleBtnCarta: "Abrir mi carta 💌",
    cumpleBtnEncender: "Volver a encender 🕯️",
    cumpleIrVelas: "Ir a soplar mis velas 🎂",

    // Cierre
    finalEyebrow: "Para terminar",
    finalPhrase: "Te amo hoy, mañana y siempre.",
    finalSign: "Con amor, Jorge ❤️"
  },

  /* -------------------------------------------------------------------------
     LÍNEA DE TIEMPO MENSUAL
     Una tarjeta por cada mes desde fechas.inicioRelacion hasta el mes actual.
     Se genera sola; aquí solo indicas la foto de cada mes.
     "mes" siempre en formato "AAAA-MM". Un mes sin entrada se muestra vacío.
  ------------------------------------------------------------------------- */
  lineaTiempo: [
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
    },
  ],

  /* -------------------------------------------------------------------------
     MENSAJE DEL MES
     Un bloque aparte (debajo del inicio) con el mensaje de cada "mesiversario".
     Se muestra el último cuya fecha ya llegó; antes de esa fecha no se ve.
     El texto va sellado igual que en La Bóveda (herramientas/sellar-carta.html).
     Si no pones "titulo", se calcula solo: "Ocho meses", "Nueve meses"…
     "borrador: true" lo oculta hasta que tenga texto.
  ------------------------------------------------------------------------- */
  mensajesMes: [
    {
      fecha: "2026-11-08T00:00:00",
      mensajeSellado: "v1.YJmp64Bzd+j33m5CDWEsdg==.zigakxAHTn2Yk8Qw.cCBKl7ZtRjDnHwrD1pwDM7K9OOzcg+xXHCa6GTTScRtCmBjXBDau0/pcVYM2tO9g1hioDsaljDFSuqyP06rx1192b7C6BkV406FAuoVrBEVkgUaF2uU3y2lJCg5iKpBImE/Ch4/1W8W8zvP72PZZip5ynTPCAkRMoCgg99GBSnq1JbvAgjqWIHZeNDUCPzBWXoaCHYoNN6+vvnaPL+I195gSMsKXQJ9ze4cDn3wc6tJRkuZCN5VQhl9EzYXuAODO5t8DJAeV+w+ISzOWyGa4E8GOM3qlnsPpSkwIcCgG+pZ8/Euk2lMCYZj3FFumEzL0Op+1CKkihUvg9YUkO4rg0vNJOogXlrMSJyVhGIVQL5zipO/xHOYdtgt+Cu486oJcebIHY+I8J5XimjOXZNCzRFT7WDLmAqOfZR3HRkc68wEswKEnFWLKdgTW2UgyMz0jYCt3OleTqOGuxggPJLePj0wOVIB2/Nvx8DpRp9QuHDelLT+Vn00B1ERYGi0upR827FzJp9IW9cGbMdGDIq3eL1PEG49+sNXyTfQ9z0k268Nw1WKCPh2LctPLc6IPfn9SZIPIfX5Kmp9JGUpLjtB6Dtn23bEFa1NeUZDqHy+R+dDlbTVbvB8qcYuhTIfc31epBdwI017Kq3DnERmLtNxu7zQ1MQkFEI+uBxhW2FmGPe/SGD/8gluRJKrbu+rT08Xr5C3N901l2mT1VK4Nw+YHlunrvKEcnyWEmJtE4N+d7pK1AuTHqi49hi3zyom+tAI1qhEjyool5UlJFh+4wyK+MOzeXk0dPG5gpvpmjwkHzgEGKKIveddD8oqjwZJanf8RCC1SuuhiDd0L58We9/tMaqPzx9Z4EbCHxPe2bQh5SK3y2iMDgZrR74JoTyduzKHziwza0Az7wbdUxHYrdWJIg4NhxpTIBNGGaUMQxmBPRA7DbClsqsOna9CX2FiH1tOfnHdfvlfW8okZc7P3XdMwBbLjTqN85nr541w6RGNab4x7I/T78x8mbdtSCg=="
    }
  ],

  /* -------------------------------------------------------------------------
     MÚSICA
     Una sola canción (el sitio no tiene servidor para subir más). Para
     cambiarla: copia el mp3 a assets/audio y actualiza "src".
  ------------------------------------------------------------------------- */
  musica: {
    volumenInicial: 0.24,
    cancion: {
      titulo: "The First Time",
      artista: "Damiano David",
      src: "assets/audio/the-first-time.mp3"
    }
  },

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
  boveda: {
    cartas: [
      {
        fecha: "2026-03-08T00:00:00",
        icono: "💌",
        titulo: "Para cuando abras esto por primera vez",
        mensajeSellado: "v1.rQ2w+ouOXQH/rAEYlKzfrg==.hpjmeSlpDjgNT7tt.1H5Vv4UaayUI37yKM1+QZWJwvD0ehWURRdrWYI3t7FjDL62Yjiq+vQXY4pwKI71hXhQvqlNXWAABMRJkTBmnWJWhZiC7Qz5uMb6CRBAZ7JvhpNzdRH2/qUk+hX+t3UCxhNhQ0paNWzOym8U8aUf7xvrCTO6Wk9qg+LKaV+bn8RcBBzt9/rHnEwGJKZR8jhd/EgXaXpJ9mC3aqEEsFwkvoxTXqfC9r3IeV36UWTreL+T68bib9EeUzyOR6FkBMH9gCuPzBMB0Py5sfawfUQ=="
      },
      {
        fecha: "2026-09-08T00:00:00",
        icono: "💜",
        titulo: "Seis meses contigo",
        mensajeSellado: "v1.oD5l7vKoHF95dIwPjgWieA==.7e4o0S8LR7CVgcCZ.LrGwJf1C8mb9d/uttl89BFcj6HqTwU/t2Oqsy8lmAHQkuMNvgV7AHV51IROoWHahGzpqfdJ13MQ+aVH3iHhlrU5tY4hBes8+wVl6xHU9ArRZoLgydeu0zKLKDEoTim9L4AIyb+6BMRe5wNnj25S46/v3mSdPWJgGUhTq0lFqfMBJ+XUr5NzXJO3rKA/mirsW6WrQccJ+sAB7tOzbPInfatCV0Raez/a04+nSk2kNnN7u1ok9X+hMcO7NNCCd1m1WyHd9EFp1CWydnAWx4MJG2EnguS6XULDcQNoSOEHJrDFZt0WiKa9FPqwBiVin9FQrtJ7kCHWDEKuOPzrVpSW1zarpietmj+ONci9WFAD/bCEKkEbVeUi2GLaZE69XgkM6qdt2aB7mmvHjQpSU5kMwgQdDcJHCT5NOJn3PIXyITDOKKZiwcuV8EovD8YWrdaWMXAEcv7BseOg3nnycIF9eMejk3bxMRC7gN7Ccq0wYAsUj0xuPJ0wsRAtYwBI20WtS8kMmWbNpVBE=",
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
  },

  /* -------------------------------------------------------------------------
     MINIJUEGO (Memory Match)
     "parejas": lista de emojis; cada uno se duplica para formar un par.
     Usa entre 4 y 8 para un tablero cómodo.
  ------------------------------------------------------------------------- */
  juego: {
    parejas: ["💌", "🌙", "🌟", "🎧", "🌻", "🪐"]
  },

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
  cumpleanos: {
    activo: true,
    nacimiento: "1999-10-11",
    diasAntes: 45,
    diasDespues: 60,
    velas: 5,
    carta: {
      icono: "🎂",
      titulo: "Feliz cumpleaños, mi amor",
      mensajeSellado: "v1.AGeP3x84cKMdT8bouJfrgA==.KUHduomlJs4e2VLW.EBN/1TDVh+2U8ABoC/ioM3iDiHH3036Y188qwKR6JSUp5Heyu7UyKshHf8FB9ZWMFsY4xTrLve+Kw6kZtRFz3sPwbq+i4OnqBJ+o6Ifb0NpgqP2+nhvzc/mYryyX90gHHQfdikbV1zIgf6Mk5Miw+0FdkJ18tBKUOfqlPKUrgdJZ+5O5aQzvUyQVuIIuzeoWinpVZ+9Q/wbdSKEMvCm1Avbsa0Inao06pIMU0Not91IsCik/GpXzwluL/d5pdcQ/1J8JZcADj1/dA7487XXUbyBMPAnOVzNEek5yCVJIbR/dBocuqlaE7OUK5aD4tt6wyZM7UBV5c5faayuvf9ZYicvHvFMOYdlcOUK+XeHYZD9yLNzyXu+uIFrC9dwd9OGMpNsJ60xGMm8NpRllwmkw8fMTnnSPPjpbSsMe8sx99W+kiT+6m+gky5m02RDFDEi+PNYg3DLl2okWvqsdHKJjZmNIAeaOT1whH+xkHxBtYWc2PIPXOORB1nveGcllTJBW8rfEt+Zu2/Z7begfKm4vuGMgdHmocxTgYcQte9cmfy7AV+tf6F1SazJjqNk2+LTsFFE7NexhHLt2hsm8g4bfPGg1Vec/IztOevORtYQBQ0b/RBST3j1RqA1K46ZOYV4sqBiUL06xz/xYC8n1VW1QNqPcwmSHBtbtJBge590WKrsldSLeygD7AvM1iRbNfeAfsqdEQrkKUeme2nT+as0v2iYUYXxs689NDG3ZyJW/34ThLmEcp55mJVRW+dk4EYdRB8qj8QlXTeZ+Okm1/jRqCLdB38I0olp7v7QfQeEGT8zz3+LP0dnLy2TU65RzG9CLDvDM/iwVkEyFoA1dwSr5P8yQFzIqByLkV0VStdQa8hzLM9sSr9MMiqxX6INxIkkfY1V5CdIth0INx8WE0LSGlIQv0iSYdu15+PP2jtHQgtP5LPtFoHP+882+WkZ4mD+NrInV+wekK7BqYuFdpyqNmQqrZEykBp9fRcnJ02V04dSZFhP/5L5FVfIy4XaPGtVL1nMwKF4TWKn3f44pnBmStWLXDCWDUxmC99UIz4unUUr/VpWLZ/U3KwCWbxPL"
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
  },

  opciones: {
    corazones: 18,
    // true = el calendario abre en el mes actual.
    calendarioDesdeHoy: true
  }
};
