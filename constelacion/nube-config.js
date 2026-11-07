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
*/
window.CIELO_CONFIG = {
  cieloId: "nosotros-7f3k9q2m",
  firebase: null
  // firebase: {
  //   apiKey: "...",
  //   authDomain: "...",
  //   projectId: "...",
  //   storageBucket: "...",
  //   messagingSenderId: "...",
  //   appId: "..."
  // }
};
