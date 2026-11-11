/*
  CONSTELACIÓN COMPARTIDA (Firebase)
  ----------------------------------
  Mientras "firebase" sea null, la constelación funciona como antes: cada
  dispositivo guarda su propio cielo. Al pegar aquí la configuración de tu
  proyecto de Firebase, los dos verán y crearán las mismas estrellas.

  Pasos (una sola vez), en https://console.firebase.google.com :
    1. Crear proyecto (Analytics no hace falta).
    2. Compilación → Firestore Database → Crear base de datos (modo producción).
    3. Pestaña "Reglas": pega el contenido de constelacion/firestore.rules y publica.
    4. Configuración del proyecto → Tus apps → Web (</>) → registrar app.
       Copia el objeto firebaseConfig y pégalo abajo, en "firebase".

  Estos datos NO son secretos: Firebase está pensado para que vayan en la
  página. Lo que protege el cielo son las reglas de firestore.rules.

  "cieloId" es el nombre del cielo de los dos. Si lo cambias, cámbialo
  también en firestore.rules.

  QUIÉN PUEDE CAMBIAR EL CIELO
  Cualquiera con el link puede mirarlo; poner o quitar estrellas solo pueden
  las cuentas de Google cuyo UID esté en "miembros" (y en firestore.rules).
  Para sumar a alguien: que entre una vez con "Iniciar sesión", copia su UID
  de Firebase → Authentication → Usuarios y pégalo en los dos sitios.
*/
window.CIELO_CONFIG = {
  cieloId: "nosotros-7f3k9q2m",
  // UID de las cuentas que pueden poner y quitar estrellas (iguales que en firestore.rules).
  miembros: [
    "Wi4gXbDEYTgsft4wiuhOvDLWhjo1" // Jorge
  ],
  // Proyecto de Firebase "Anthuanete" (app web "jya08").
  firebase: {
    apiKey: "AIzaSyCNP0nIW55Q6bMlBfB4l24V3atesR_N5gI",
    authDomain: "anthuanete-6d629.firebaseapp.com",
    projectId: "anthuanete-6d629",
    storageBucket: "anthuanete-6d629.firebasestorage.app",
    messagingSenderId: "1094632300755",
    appId: "1:1094632300755:web:b6f15a9a7ed6e4a6343426"
  }
};
