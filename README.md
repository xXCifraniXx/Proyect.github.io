# Proyecto romántico para Anthuanete

Landing estática (HTML + CSS + JavaScript vanilla, sin backend ni build) que se
publica en **GitHub Pages**. Todo el contenido editable vive en un solo archivo:
[`assets/js/config.js`](assets/js/config.js).

## Estructura

```text
Proyect.github.io/
├── index.html                  Plantilla: solo estructura, sin textos fijos
├── assets/
│   ├── css/styles.css          Estilos
│   ├── js/config.js            ← TODO el contenido editable
│   ├── js/app.js               Lógica: rellena la plantilla y maneja interacciones
│   ├── images/                 Fotos de la línea de tiempo
│   └── audio/                  Canción
└── constelacion/               Mini-experiencia aparte (lienzo de estrellas)
    ├── index.html
    ├── estrellas.css
    └── estrellas.js
```

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
| `boveda.cartas` | Cartas que se desbloquean solas en su fecha. |
| `juego.parejas` | Emojis del memory (cada uno se duplica para formar un par). |

### La Bóveda

Cada carta tiene una `fecha`. Antes de esa fecha se ve sellada con una cuenta
regresiva; a partir de ahí se puede abrir y leer. Una carta puede incluir:

```js
accion: { tipo: "constelacion", etiqueta: "Ir a nuestra constelación ✦" }
```

que añade un botón dentro de la carta para saltar a la sección **Constelación**.

### Ajustar bajadas de mina desde la página

Dentro de la sección **Bajada** hay un panel plegable **"Ajustar bajadas de
mina"**. Se elige el día de la próxima bajada (y, si cambia, días en mina /
descanso / hora de regreso) y el calendario 14×7, el estado y la cuenta
regresiva se recalculan al instante desde esa fecha en adelante.

Ese ajuste se guarda en `localStorage` **solo en ese navegador/dispositivo**
(clave `roster-override-v1`); "Volver a lo de config.js" lo borra. Para que un
cambio valga para siempre en el link, hay que actualizar `rotacionMina.salidaBase`
en `config.js` (por ejemplo: si baja el jueves 10, `salidaBase` es el jueves
anterior a 14 días, el 27 del mes previo).

### Añadir una carta permanente a la línea de tiempo

1. Copia la imagen a `assets/images/`.
2. Añade un objeto en `lineaTiempo` con `mes`, `titulo`, `src` y `texto`.

### Cambiar la canción

1. Copia el mp3 a `assets/audio/`.
2. Actualiza `musica.cancion.src`.

## Constelación

`constelacion/` es una página aparte enlazada desde la sección **Constelación**
y desde la carta de aniversario de La Bóveda. Es un cielo en blanco: cada toque
crea una estrella con un recuerdo y se van uniendo en una constelación. Se
guarda en `localStorage` del navegador y se puede exportar como imagen PNG.

## Publicar

1. **Settings → Pages** en el repositorio.
2. **Source**: `Deploy from a branch`, rama `main`, carpeta `/ (root)`.

GitHub publica en `https://usuario.github.io/` unos minutos después de cada
`push`. No hace falta build ni `npm install`.
