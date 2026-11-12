/* -------------------------------------------------------------------------
   TEXTOS
   Cada clave es una frase de la página (los componentes la leen por su
   nombre, por ejemplo TEXTOS.heroTitle). Cambiar el texto aquí lo cambia en
   la página, sin tocar los componentes. Si un componente usa una clave que
   no está aquí, TypeScript avisa.
------------------------------------------------------------------------- */
export const textos = {
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
  welcomeText:
    "Preparé esta página como una carta pequeña, bonita y hecha con amor, para que puedas sentirme cerca " +
    "incluso a la distancia.",
  welcomeButton: "Entrar a la carta 💗",
  welcomeNote: "Actualización — Noviembre 2026",

  // Portada
  heroEyebrow: "Hecho con cariño",
  heroTitle: "Anthu, contigo todo se siente más bonito",
  heroIntro:
    "Quiero que esta página sea algo para los dos y puedas abrir desde tu celular para sentirnos cerca " +
    "incluso estando lejos. Algo bonito y sincero, porque pensar en ti siempre me da paz.",
  heroCtaCarta: "Abrir mi carta 💌",
  heroCtaBoveda: "Abrir La Bóveda ⏳",

  // Sobre / carta interactiva
  letterTitle: "Para Anthuanete",
  letterMessage:
    "Gracias por estar en mi vida de una manera tan bonita. No importa la distancia, sigues siendo ese " +
    "lugar feliz y cálido en mi corazón. Siempre te voy a cuidar, valorar y amar con todo mi ser.",
  letterSignature: "Con amor, Jorge",
  letterHintClosed: "Toca el sobre para abrirlo con calma.",
  letterHintOpen: "La carta ya está abierta. Puedes tocar el sobre para cerrarla.",
  letterOpen: "Abrir carta",
  letterClose: "Cerrar carta",

  // Sección Carta
  cartaEyebrow: "Carta",
  cartaTitle: "Nunca debes olvidar lo especial que eres para mí",
  cartaIntro:
    "Tu forma de ser, tu ternura, tu risa y tu manera de estar en mi vida hacen que cada día me sienta afortunado.",
  surpriseOpen: "Ver mensaje sorpresa 💗",
  surpriseClose: "Ocultar mensaje 💌",
  surpriseMessage:
    "¡Felices 6 meses, mi vida! 💜\n" +
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
  calendarIntro:
    "Aquí se marcan los días en mina, de bajada y los días de descanso. Así sabemos exactamente en qué " +
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
  rosterEditorNote:
    "Elige el día en que baja y el calendario 14x7 se reacomoda solo desde esa fecha en adelante. " +
    "Con sesión iniciada el cambio se ve en los dos celulares; sin sesión, solo en este dispositivo.",
  rosterEditorSave: "Guardar bajada",
  rosterEditorReset: "Volver al calendario original",
  rosterEditorSavedMsg: "Guardado solo en este dispositivo. Inicia sesión para que lo vean los dos.",
  rosterEditorSavedSharedMsg: "Guardado para los dos. El calendario ya usa la nueva bajada.",
  rosterEditorCloudError: "No se pudo guardar para los dos. Revisa la conexión e inténtalo otra vez.",
  rosterEditorResetNeedsLogin: "Inicia sesión para volver al calendario original para los dos.",
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
  constelacionIntro:
    "Un cielo en blanco donde cada toque crea una estrella con un recuerdo. Las estrellas se unen y " +
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
  cumpleIntroAntes:
    "Estoy preparando algo especial para cuando cumplas {edad}. Cuando llegue el día, esta sección se abre sola.",
  cumpleAntesLabel: "Faltan para tu cumpleaños",
  cumpleTituloHoy: "¡Feliz cumpleaños número {edad}, mi amor!",
  cumpleIntroHoy: "Pide un deseo y apaga las velas: toca cada una o usa el botón.",
  cumpleTituloDespues: "Tu día especial 🎂",
  cumpleIntroDespues:
    "Aquí queda guardada tu sorpresa de cumpleaños. Puedes volver a encender las velas cuando quieras.",
  cumpleBtnSoplar: "Soplar las velas 💨",
  cumpleDeseo: "¡Pide un deseo! ✨ Ojalá se cumpla todo lo que sueñas.",
  cumpleBtnCarta: "Abrir mi carta 💌",
  cumpleBtnEncender: "Volver a encender 🕯️",
  cumpleIrVelas: "Ir a soplar mis velas 🎂",

  // Cierre
  finalEyebrow: "Para terminar",
  finalPhrase: "Te amo hoy, mañana y siempre.",
  finalSign: "Con amor, Jorge ❤️",

  // ----- Textos que antes estaban escritos dentro de los componentes -----
  // {fecha}, {nombre}, {correo}, {tiempo} y {n} se reemplazan solos.

  // Accesibilidad (lo leen los lectores de pantalla) y botones
  ariaBienvenida: "Pantalla de bienvenida",
  ariaNavegacion: "Navegación principal",
  menuBoton: "Menú",
  ariaSobre: "Carta interactiva",
  ariaSobreBoton: "Abrir o cerrar la carta",
  ariaGaleria: "Fotos por mes",
  ariaMesAnterior: "Mes anterior",
  ariaMesSiguiente: "Mes siguiente",
  ariaElegirMes: "Elegir mes",
  ariaCalendario: "Calendario de rotación",
  ariaLeyendaCalendario: "Leyenda del calendario",
  ariaPastel: "Pastel de cumpleaños",
  ariaCartaOculta: "Carta oculta",
  ariaCartaAbierta: "Carta abierta",
  ariaCerrarCarta: "Cerrar carta",

  // Cartas (La Bóveda y la ventana de carta)
  cartaSinTitulo: "Una carta para ti",
  cartaIcono: "💌",
  cartaIrAhi: "Ir ahí",
  bovedaSeAbre: "Se abre el {fecha}",
  bovedaFaltan: "Faltan {tiempo}",
  bovedaDesbloqueada: "Desbloqueada el {fecha}",

  // Música
  musicaSinTitulo: "Nuestra canción",
  musicaError: "No se pudo reproducir el audio en este navegador.",

  // Rotación de mina (sección Bajada)
  faseAntesTitulo: "Próxima subida programada",
  faseAntesTexto: "La rotación empezará el {fecha}.",
  faseMinaTitulo: "Ahora estás en mina 😿",
  faseMinaTexto: "La próxima bajada será el {fecha} por la noche. Falta cada vez menos para volver a verte.",
  faseDescansoTitulo: "Estás en tus días de bajada 😼",
  faseDescansoTexto: "La próxima subida será el {fecha}. Estos días son para descansar y guardar recuerdos bonitos 💜.",
  faseEtiquetaSubida: "Próxima subida",
  faseEtiquetaBajada: "Próxima bajada",
  diaSube: "Sube",
  diaMina: "Mina",
  diaBajada: "Bajada",
  diaDescanso: "Descanso",

  // Sesión de Google
  sesionEntrar: "Iniciar sesión",
  sesionSalir: "Salir",
  sesionPideEntrar: "Inicia sesión para que el cambio se vea en los dos celulares.",
  sesionMiembro: "Con sesión de {nombre}: los cambios se guardan para los dos.",
  sesionNoMiembro: "Con {correo} los cambios se guardan solo en este dispositivo.",
  sesionEstaCuenta: "esta cuenta",
  sesionVentanaBloqueada:
    "El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo otra vez.",
  sesionError: "No se pudo iniciar sesión. Inténtalo otra vez en un momento.",

  // Página del cielo (constelacion/)
  cieloVolver: "← Volver a la carta",
  cieloTitulo: "Constelación de nosotros",
  cieloEntrarTitle: "Entrar con Google para poner estrellas",
  cieloSalirCon: "Salir ({nombre})",
  cieloCerrarSesion: "Cerrar sesión",
  cieloDeshacer: "↶ Deshacer",
  cieloDeshacerTitle: "Quitar la última estrella",
  cieloGuardarImagen: "⤓ Guardar imagen",
  cieloGuardarImagenTitle: "Descargar como imagen",
  cieloVaciar: "✦ Vaciar cielo",
  cieloVaciarTitle: "Borrar todo el cielo",
  cieloPista: "Toca cualquier parte del cielo para poner una estrella y escribir un recuerdo.",
  cieloConectando: "Conectando con el cielo compartido…",
  cieloSoloMirar: "Con {correo} puedes mirar el cielo, pero no cambiarlo.",
  cieloPideEntrar: "Inicia sesión con Google para poner o quitar estrellas ✦",
  cieloSinPermiso: "Esta cuenta no puede cambiar el cielo. Entra con la cuenta de uno de los dos.",
  cieloErrorGuardar: "No se pudo guardar en el cielo compartido. Revisa la conexión.",
  cieloVaciarConfirmarNube: "¿Vaciar el cielo por completo? Se borra para los dos y no se puede deshacer.",
  cieloVaciarConfirmar: "¿Vaciar el cielo por completo? Esto no se puede deshacer.",
  cieloVacio: "El cielo está vacío. Empieza por la primera estrella.",
  cieloUnaEstrella: "{n} estrella en nuestro cielo",
  cieloEstrellas: "{n} estrellas en nuestro cielo",
  cieloCompartido: " · compartido ✦",
  cieloSinConexion: " · sin conexión, se enviará al volver",
  cieloSinNube: " · sin nube, guardado solo en este dispositivo",
  cieloPlaceholder: "un recuerdo, una palabra, una fecha…",
  ariaLienzoCielo: "Lienzo de la constelación",
  ariaQuitarEstrella: "Quitar esta estrella",
  estrellaSinNombre: "estrella sin nombre",

  // Si falla la página entera (solo se ve en ese caso)
  errorPagina: "Algo no cargó bien. Recarga la página, por favor 💜",
  errorRecargar: "Recargar la página"
} satisfies Record<string, string>;
