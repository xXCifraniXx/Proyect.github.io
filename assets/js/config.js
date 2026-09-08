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
    welcomeNote: "Actualización — Septiembre 2026",

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
    timelineIntro: "Cada mes se suma una foto nueva a esta cinta. Desliza para verlas todas.",

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
        "ajuste se guarda solo en este dispositivo; para dejarlo fijo en el link, edita rotacionMina en config.js.",
    rosterEditorSave: "Guardar bajada",
    rosterEditorReset: "Volver a lo de config.js",
    rosterEditorSavedMsg: "Guardado. El calendario ya usa la nueva bajada.",
    rosterEditorResetMsg: "Listo. Vuelve a la configuración de config.js.",
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

    // Constelación
    constelacionEyebrow: "Nuestro cielo",
    constelacionTitle: "Una constelación para los dos",
    constelacionIntro: "Un cielo en blanco donde cada toque crea una estrella con un recuerdo. Las estrellas se unen y " +
        "forman nuestra constelación. Ábrelo, arma el tuyo y guárdalo como imagen.",
    constelacionBtn: "Abrir nuestra constelación ✦",

    // Minijuego
    juegoEyebrow: "Un momento juntos",
    juegoTitle: "Encuentra las parejas",
    juegoIntro: "Un memory rápido para jugar los dos. Voltea las cartas y encuentra los pares. Cuando termines, hay una " +
        "sorpresa.",
    juegoMovesLabel: "Intentos",
    juegoPairsLabel: "Parejas",
    juegoRestart: "Reiniciar",
    juegoPlayAgain: "Jugar de nuevo",
    juegoWin: "¡Lo lograste! Igual que en la vida real, encontraste todas las parejas. Te amo 💜",

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
      texto: "Recién empieza, llena de emociones pero agradezco que siempre estes a mi lado!"
    },
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
       { tipo: "constelacion", etiqueta: "..." }
     añade un botón dentro de la carta que lleva a la sección Constelación.
  ------------------------------------------------------------------------- */
  boveda: {
    cartas: [
      {
        fecha: "2026-01-01T00:00:00",
        icono: "💌",
        titulo: "Para cuando abras esto por primera vez",
        mensaje: "Esta es la primera carta de La Bóveda. Cada cierto tiempo voy a dejar una nueva, con algo que quiera " +
            "decirte en ese momento. Ábrelas cuando se desbloqueen y guarda las que más te gusten."
      },
      {
        fecha: "2026-09-08T00:00:00",
        icono: "💜",
        titulo: "Seis meses contigo",
        mensaje: "Hoy cumplimos seis meses y quería que lo supieras aquí también. En medio mes construimos algo que se " +
            "siente firme, tranquilo y verdadero. Gracias por elegirme cada día, por tu paciencia con la distancia y por" +
            " hacer que todo sea más ligero. Te preparé un cielo en blanco para que armemos nuestra constelación cada vez" +
            " que entres podremos crear constelaciones juntos unu",
        accion: { tipo: "constelacion", etiqueta: "Ir a nuestra constelación ✦" }
      },
      {
        fecha: "2026-12-24T00:00:00",
        icono: "🎄",
        titulo: "Feliz Navidad, mi vida",
        mensaje: "."
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

  opciones: {
    corazones: 18,
    // true = el calendario abre en el mes actual.
    calendarioDesdeHoy: true
  }
};
