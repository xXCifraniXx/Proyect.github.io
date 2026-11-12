# Proyecto romántico para Anthuanete

Sitio que se publica en **GitHub Pages**. Desde el 12 de noviembre de 2026 lo
que se publica es la versión **React + TypeScript** de [`app/`](app/README.md),
compilada por GitHub Actions. Esta guía describe el sitio estático de la raíz
(HTML + CSS + JavaScript vanilla), que queda como respaldo en el tag
`v1-estatico`. Las dos versiones leen el mismo contenido editable:
[`assets/js/config.js`](assets/js/config.js).

## Estructura

```text
Proyect.github.io/
├── index.html                  Plantilla: solo estructura, sin textos fijos
├── assets/
│   ├── css/styles.css          Estilos
│   ├── js/config.js            ← TODO el contenido editable
│   ├── js/app.js               Lógica: rellena la plantilla y maneja interacciones
│   ├── js/sello.js             Cifrado de las cartas de La Bóveda
│   ├── js/cumple.js            Cumpleaños: estados, pastel con velas, cuenta regresiva
│   ├── js/confetti.js          Confeti en canvas (reutilizable)
│   ├── js/nube-config.js       ← configuración de Firebase (las dos páginas)
│   ├── js/nube-bajadas.js      Bajadas de mina compartidas con Firebase
│   ├── images/                 Fotos de la línea de tiempo, icono e imagen para compartir
│   └── audio/                  Canción
├── firestore.rules             Reglas para pegar en Firebase
├── herramientas/
│   ├── sellar-carta.html       Sellar / abrir cartas de La Bóveda (para ti)
│   └── servidor-local.js       Ver el sitio en tu equipo: node herramientas/servidor-local.js
└── constelacion/               Mini-experiencia aparte (lienzo de estrellas)
    ├── index.html
    ├── estrellas.css
    ├── estrellas.js
    └── nube.js                 Cielo compartido con Firebase
```

Para verlo en tu equipo: `node herramientas/servidor-local.js` y abre
http://localhost:4173 (solo necesita Node).

## Cómo funciona la plantilla

`index.html` no contiene textos: cada elemento visible lleva un atributo
`data-bind="textos.clave"`. Al cargar, `app.js` recorre esos elementos y les
pone el texto correspondiente de `config.textos`. Para cambiar cualquier frase
del sitio, editas `config.js` y nada más.

Las secciones con contenido repetido (línea de tiempo, calendario 14×7,
La Bóveda, minijuego) se generan solas desde las listas de `config.js`.

## Qué se puede editar en `config.js`

| Clave | Para qué sirve |
|---|---|
| `nombres` | Nombre de ella y del autor (título, marca, firma). |
| `fechas.inicioRelacion` | Desde cuándo están juntos (contadores y línea de tiempo). |
| `fechas.regreso` | Cuenta regresiva de reencuentro (o `null`). |
| `rotacionMina` | Turno 14×7: `salidaBase` (un día en que subió a mina), días de mina/descanso, hora de bajada. `activa: false` oculta la sección. |
| `textos` | Todas las frases del sitio. |
| `lineaTiempo` | Una foto por mes. `mes` en formato `"AAAA-MM"`. Un mes sin entrada se muestra vacío. |
| `musica.cancion` | Título, artista y ruta del mp3 (`assets/audio/...`). |
| `mensajesMes` | Mensaje de cada mesiversario, en un bloque aparte debajo del inicio. |
| `boveda.cartas` | Cartas que se desbloquean solas en su fecha. |
| `juego.parejas` | Emojis del memory (cada uno se duplica para formar un par). |

### La Bóveda

Cada carta tiene una `fecha`. Antes de esa fecha se ve sellada con una cuenta
regresiva; a partir de ahí se puede abrir y leer. Una carta puede incluir:

```js
accion: { destino: "constelacion", etiqueta: "Ir a nuestra constelación ✦" }
```

que añade un botón dentro de la carta para saltar a esa sección (`destino` es
el `id` de la sección: `constelacion`, `juego`, `cumple`…).

**Cartas selladas.** El texto va cifrado en `mensajeSellado` para que no se
pueda leer en el código de la página antes de su fecha; la página solo lo
descifra cuando la carta se desbloquea. Para escribir, leer o corregir una
carta abre [`herramientas/sellar-carta.html`](herramientas/sellar-carta.html)
(con el sitio publicado o un servidor local, no con doble clic): pega el texto,
pulsa **Sellar** y copia el resultado en `mensajeSellado`. Sigue funcionando
`mensaje` con texto normal, pero ese se puede leer antes de tiempo.

> La clave viaja con la página (no hay servidor), así que esto evita que se lea
> a simple vista, no a alguien que se proponga descifrarlo. Además, los textos
> que estuvieron en `config.js` sin sellar siguen en el historial de Git.

**Borradores.** `borrador: true` oculta una carta que aún no tiene texto.

### Cumpleaños

Todo sale de `config.cumpleanos`. La única fecha que se escribe es la de
`nacimiento` (`"1999-10-11"`): de ahí se calcula el cumpleaños de cada año y la
**edad**, que se puede usar como `{edad}` en cualquier texto (27 en 2026, 28 en
2027…). Cada año pasa por tres momentos y el resto del tiempo la sección no se ve:

| Momento | Cuándo | Qué pasa |
|---|---|---|
| **Antes** | desde `diasAntes` (45) días antes | Sección con un regalo sellado y cuenta regresiva. La carta aparece sellada en La Bóveda. |
| **Hoy** | el día del cumpleaños | Modo cumpleaños: bienvenida especial (`textosHoy`), confeti al entrar, globos flotando, la sección del pastel sube al inicio y el botón del hero lleva a las velas. |
| **Después** | `diasDespues` (60) días | La sección queda de recuerdo y se pueden volver a encender las velas. |

- **Pastel:** ella toca cada vela o usa "Soplar las velas". Al apagarlas todas
  hay confeti y aparece "Abrir mi carta". Se acuerda de que ya las apagó
  (`localStorage`, por dispositivo).
- **Carta:** se escribe en `cumpleanos.carta` y se suma sola a La Bóveda con la
  fecha del cumpleaños de ese año (se abre a las 00:00 del día). Al terminar
  la ventana `diasDespues` sale de La Bóveda hasta el año siguiente.
- `velas` define cuántas velas dibuja el pastel (1 a 9). Al cambiar de año
  el pastel vuelve a empezar con las velas encendidas.
- **Vista previa** sin cambiar el reloj: `index.html?cumple=antes`, `?cumple=hoy`
  o `?cumple=despues` (en ese modo no se guarda nada).
- Código: `assets/js/cumple.js` (lógica) y `assets/js/confetti.js` (confeti
  reutilizable). Con "reducir movimiento" activado en el dispositivo no hay confeti.

### Ajustar bajadas de mina desde la página

Dentro de la sección **Bajada** hay un panel plegable **"Ajustar bajadas de
mina"**. Se elige el día de la próxima bajada (y, si cambia, días en mina /
descanso / hora de regreso) y el calendario 14×7, el estado y la cuenta
regresiva se recalculan al instante desde esa fecha en adelante.

**Con sesión iniciada** (botón del mismo panel, cuenta de Google de uno de los
dos) el ajuste se guarda en Firebase y el calendario cambia en los dos
celulares al instante. **Sin sesión** se guarda solo en ese dispositivo
(`localStorage`, clave `roster-override-v1`). Si hay un ajuste compartido,
manda sobre el del dispositivo. "Volver al calendario original" lo borra (el
compartido, solo con sesión).

Para que un cambio valga para siempre aunque no haya ajuste, hay que actualizar
`rotacionMina.salidaBase` en `config.js` (por ejemplo: si baja el jueves 10,
`salidaBase` es el jueves anterior a 14 días, el 27 del mes previo).

### Mensaje del mes

Cada entrada de `mensajesMes` tiene una `fecha` (normalmente el día 8) y el
texto sellado en `mensajeSellado` (o `mensaje` sin sellar). El bloque aparece
desde esa fecha hasta el mismo día del mes siguiente, con el título calculado
solo ("Ocho meses", "Nueve meses"…) salvo que pongas `titulo`. Los párrafos se
separan con una línea en blanco. `borrador: true` lo oculta.

### Añadir la foto de un mes

1. Copia la imagen a `assets/images/` (mejor en `.webp`, unos 1080 px de ancho).
2. Añade un objeto en `lineaTiempo` con `mes`, `titulo`, `src` y `texto`.

La galería abre en el mes más reciente; se recorre deslizando, con las flechas
o tocando un mes en la línea de abajo.

### Cambiar la canción

1. Copia el mp3 a `assets/audio/`.
2. Actualiza `musica.cancion.src`.

## Constelación

`constelacion/` es una página aparte enlazada desde la sección **Constelación**
y desde la carta de aniversario de La Bóveda. Es un cielo en blanco: cada toque
crea una estrella con un recuerdo y se van uniendo en una constelación. Se
puede exportar como imagen PNG.

**Cielo compartido (Firebase).** Sin configurar, cada dispositivo guarda su
propio cielo en `localStorage`. Para que los dos vean y creen las mismas
estrellas en tiempo real, sigue los pasos de
[`assets/js/nube-config.js`](assets/js/nube-config.js): crear un proyecto
gratuito en Firebase, activar Firestore, pegar las reglas de
[`firestore.rules`](firestore.rules) y copiar la configuración web en
`nube-config.js`. La primera vez que cada dispositivo se
conecta sube las estrellas que ya tenía; después todo se sincroniza solo. El
contador indica si el cielo está compartido o sin conexión.

**Quién puede cambiarlo.** Cualquiera con el link puede mirar el cielo, pero
solo ustedes dos pueden poner o quitar estrellas, tras pulsar **Iniciar
sesión** (Google). Las cuentas permitidas se identifican por su UID, en
`miembros` de `assets/js/nube-config.js` y en `firestore.rules` (hay que ponerlo en los
dos sitios y volver a publicar las reglas). Para sumar a alguien: que entre una
vez con "Iniciar sesión", copia su UID en Firebase → Authentication → Usuarios
y agrégalo. Todo esto funciona en el plan gratuito (Spark).

## Vista previa del enlace

El texto y la imagen que aparecen al compartir el link (WhatsApp, Instagram…)
están en las etiquetas `<meta>` del `<head>` de `index.html` (`og:title`,
`og:description`, `og:image`). Van ahí fijas y **no** en `config.js` porque los
lectores de enlaces no ejecutan JavaScript.

- Para cambiar el mensaje: edita `og:title` / `og:description` (y `description`).
- Para cambiar la imagen: apunta `og:image` / `twitter:image` a otra foto con
  URL absoluta. Si alguna app no muestra la imagen `.webp`, sube una `.jpg` o
  `.png` (ideal 1200×630) y usa esa.
- Los enlaces ya compartidos guardan la vista previa vieja en caché; se refresca
  con el depurador de cada plataforma (p. ej. developers.facebook.com/tools/debug).

## Publicar

**Settings → Pages → Source** está en `GitHub Actions`. Cada vez que algo llega a
`main`, [`.github/workflows/publicar.yml`](.github/workflows/publicar.yml) revisa
el código (tipos, lint, tests, formato, peso), compila `app/` y publica
`app/dist` en `https://xxcifranixx.github.io/Proyect.github.io/` (el repo se
llama `Proyect.github.io`, no `usuario.github.io`, por eso va en esa carpeta).
Si una revisión falla, no se publica nada y el sitio sigue como estaba.

Las ramas y los PR hacia `develop` o `main` pasan por
[`calidad.yml`](.github/workflows/calidad.yml). Detalles en
[`app/README.md`](app/README.md).
