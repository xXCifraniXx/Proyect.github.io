/*
  CONFIGURACION PRINCIPAL
  Edita este archivo para cambiar nombres, fechas, textos, musica y galeria.
  No necesitas tocar index.html ni app.js para personalizar el contenido.
*/
window.APP_CONFIG = {
  nombres: {
    novia: "Anthuanete",
    autor: "Jorge"
  },

  fechas: {
    // Cambia por la fecha real desde que estan juntos.
    inicioRelacion: "2026-03-08T00:00:00",

    // Cambia por la fecha real de regreso. Si no quieres usarlo, deja null.
    regreso: "2026-05-28T21:00:00"
  },

  rotacionMina: {
    // Activa o desactiva la seccion de calendario de mina.
    activa: true,

    // Fecha en que ella subio o se fue a mina.
    // Ejemplo: se fue jueves 14 y vuelve jueves 28 por la noche.
    salidaBase: "2026-05-14T08:00:00",

    // Patron de trabajo. Para 14 x 7: 14 dias en mina y 7 dias de bajada/descanso.
    diasMina: 14,
    diasDescanso: 7,

    // Hora aproximada del regreso del dia de bajada.
    horaRegreso: "21:00",

    // Cuantos meses mostrar al mismo tiempo.
    // Jorge pidio mostrar solo 1 mes para que se vea mas limpio en celular.
    mesesAMostrar: 1
  },

  textos: {
    welcomeEyebrow: "Una sorpresa para ti",
    welcomeTitle: "Lee esto con calma",
    welcomeText: "Preparé esta página como una carta pequeña, bonita y hecha con amor, para que puedas sentirme cerca incluso a la distancia.",
    heroEyebrow: "Hecho con cariño",
    heroTitle: "Anthu, contigo todo se siente más bonito",
    heroIntro: "Quiero que esta página sea algo para los dos y puedas abrir desde tu celular para sentirnos cerca incluso estando lejos. Algo bonito y sincero, porque pensar en ti siempre me da paz.",
    letterTitle: "Para Anthuanete",
    letterMessage: "Gracias por estar en mi vida de una manera tan bonita. No importa la distancia, sigues siendo ese lugar feliz y cálido en mi corazón. Siempre te voy a cuidar, valorar y amar con todo mi ser.",
    letterSignature: "Con amor, Jorge",
    cartaIntro: "Tu forma de ser, tu ternura, tu risa y tu manera de estar en mi vida hacen que cada día me sienta afortunado.",
    surpriseMessage: "Perdón por no actualizar nuestra página :(. A partir de ahora voy a ser más constante con esto, intentaré poner cosas nuevas cada con mayor frecuencia. También siente libre de decirme qué te gustaría que agregara o cambiara, quiero que esta página represente nuestra relación. Dejando eso de lado, quiero que sepas que te amo mucho y que cada día me siento más feliz de tenerte en mi vida. Espero que esta sorpresa te guste y te haga sentir cerca de mí.",
    timeIntro: "El tiempo contigo. Cada día suma algo bonito a esta historia.",
    returnTitle: "Para volver a verte",
    returnText: "Falta cada vez menos para volver a abrazarte con calma.",
    calendarTitle: "Días de mina y bajada",
    calendarIntro: "Aquí se marcan los días en mina, de bajada y los días que tienes de descanso. Así sabremos exactamente en qué día estamos y cuánto falta para volver a vernos.",
    finalPhrase: "Te amo hoy, mañana y siempre.",
    finalSign: "Con amor, Jorge ❤️"
  },

  historia: [
    {
      numero: "01",
      titulo: "Lo admirable que eres",
      texto: "Eres increíblemente fuerte y cada día me enseñas que puedes superar cualquier problema que se presente."
    },
    {
      numero: "02",
      titulo: "Tu amor me hace soñar",
      texto: "Tu manera de amar me hace sentir tan querido que a veces pienso que estoy en un sueño del que nunca quiero despertar."
    },
    {
      numero: "03",
      titulo: "Nuestro futuro es real",
      texto: "El amor que te tengo es infinito; siempre te voy a amar y ya tenemos la meta de vivir juntos y, algún día, decirte ESPOSA MÍA 💜."
    }
  ],

  musica: {
    volumenInicial: 0.24,
    playlist: [
      {
        titulo: "The First Time",
        artista: "Damiano David",
        src: "assets/audio/the-first-time.mp3"
      }
      // Para agregar otra canción:
      // 1. Copia el mp3 dentro de assets/audio
      // 2. Agrega aquí:
      // { titulo: "Nombre", artista: "Artista", src: "assets/audio/archivo.mp3" }
    ]
  },

  galeria: [
    {
      src: "assets/images/primera_Cita.jpg",
      titulo: "Donde todo comenzó",
      frase: "Desde nuestra primera cita supe que había algo muy bonito en ti."
    },
    {
      src: "assets/images/picnic.jpg",
      titulo: "Un recuerdo suave",
      frase: "Hay momentos simples que contigo se sienten enormes."
    },
    {
      src: "assets/images/Compromiso.jpg",
      titulo: "Lo que quiero cuidar",
      frase: "Me gusta construir contigo algo sincero, bonito y real."
    },
    {
      src: "assets/images/Astronautas.jpg",
      titulo: "Nuestro universo",
      frase: "Entre mundos, partidas y días largos, tú sigues siendo mi lugar favorito."
    }
    // Para agregar otra foto permanente:
    // 1. Copia la imagen dentro de assets/images
    // 2. Agrega aquí:
    // { src: "assets/images/foto-nueva.jpg", titulo: "Titulo", frase: "Frase" }
  ],

  opciones: {
    galeriaAutoMs: 3600,
    corazones: 18,
    // true = el calendario abre en el mes actual.
    calendarioDesdeHoy: true
  }
};
