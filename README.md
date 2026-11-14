# Proyecto romántico para Anthuanete

Sitio hecho con **React + TypeScript + Vite**, publicado en GitHub Pages:
https://xxcifranixx.github.io/Proyect.github.io/

Todo lo que se edita a mano (textos, fotos, mensajes, cartas, fechas) está en
[`src/config/`](src/config/index.ts). El comportamiento que el sitio debe
conservar está en [`SPEC.md`](SPEC.md). El sitio estático anterior (HTML + CSS
+ JavaScript sin compilar) quedó guardado en el tag `v1-estatico`.

## Cómo verlo en tu equipo

```bash
npm install
npm run dev
```

Abre http://localhost:5173/Proyect.github.io/ . Los cambios se ven al instante.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Sitio en tu equipo, con recarga al guardar |
| `npm run build` | Revisa los tipos y compila el sitio en `dist/` |
| `npm run preview` | Sirve `dist/` como lo haría GitHub Pages |
| `npm run typecheck` | Solo revisa los tipos |
| `npm run lint` | Revisa el código (oxlint): reglas de los hooks y de accesibilidad. Falla con cualquier aviso |
| `npm test` | Tests (Vitest); `npm run test:watch` mientras editas |
| `npm run format` | Da formato (Prettier); `format:check` solo revisa |
| `npm run revisar-peso` | Después de `build`: la carga inicial debe pesar menos de 100 KB comprimidos |

Los tests cubren la rotación de mina, el cumpleaños, el mensaje del mes, las
fechas, el sello de las cartas (abre todas las cartas reales sin mostrar su
texto) y el contenido de `src/config/` (fechas válidas, fotos que existen,
cartas selladas, miembros iguales a `firestore.rules`).

## Estructura

```text
Proyect.github.io/
├── index.html                  Página principal (la carta)
├── constelacion/index.html     Página del cielo
├── herramientas/sellar-carta.html  Sellar / abrir cartas (para ti)
├── public/assets/
│   ├── images/                 Fotos de cada mes, íconos e imagen para compartir
│   └── audio/                  Canción
├── src/
│   ├── config/                 ← TODO el contenido editable (ver abajo)
│   ├── main.tsx                Arranque de la página principal
│   ├── constelacion/main.tsx   Arranque de la página del cielo
│   ├── herramientas/           Lógica de sellar-carta.html
│   ├── App.tsx                 Junta las secciones en orden
│   ├── features/               Una carpeta por sección (inicio, mensaje-mes, carta,
│   │                           galeria, tiempo, bajadas, musica, boveda, cumple,
│   │                           constelacion, cielo, juego, cierre, sesion)
│   ├── components/ui/          Piezas que usan varias secciones (Seccion, CuentaRegresiva, LimiteDeError…)
│   ├── hooks/                  Hooks compartidos (useAhora / useDia, useRevelar, useTextoCarta, useSuscripcionFirestore)
│   ├── lib/                    Lógica compartida sin pantalla (fechas, sello, Firebase, cumpleaños…)
│   ├── styles/                 index.css (orden de las capas), tokens.css y base.css
│   └── types/config.ts         Tipos del contenido
├── firestore.rules             Reglas para pegar en Firebase
├── SPEC.md                     Contrato: lo que el sitio debe seguir haciendo
└── .github/workflows/          Revisión y publicación automáticas
```

Piezas que usa toda la página:

- **Reloj:** `useAhora()` (cada segundo) y `useDia()` (cambia a medianoche)
  comparten un solo temporizador (`src/lib/reloj.ts`). Para lo del cumpleaños,
  `useAhora(RELOJ_CUMPLE)`, que respeta la vista previa `?cumple=…`.
- **Ventana de carta:** `const { abrir } = useVentanaCarta()` desde cualquier
  componente; nunca abre una carta antes de su fecha.
- **Errores:** cada sección va dentro de `LimiteDeError`; si una falla, las
  demás se siguen viendo y el error queda en la consola con su nombre.

Un componente por archivo `.tsx`, con el mismo nombre que el componente. Cada
carpeta de `features/` y `components/ui/` tiene un `index.ts` con lo que se usa
desde fuera: entre carpetas se importa desde ese `index.ts`; dentro de una
carpeta, directo del archivo. TypeScript está en modo estricto: si un dato
puede faltar, hay que decir qué se muestra en ese caso.

## Estilos

CSS sin librerías, en tres capas (`@layer`), de menos a más fuerte:

| Capa | Dónde | Qué va ahí |
|---|---|---|
| `tokens` | `src/styles/tokens.css` | Variables: colores, sombras, radios, medidas. |
| `base` | `src/styles/base.css` | Lo común: reset, fondo, superficies, botones, títulos, secciones, cuenta regresiva, aparición al hacer scroll. |
| `secciones` | `src/features/<sección>/<sección>.css` | Un archivo por sección, junto a su componente. |

[`src/styles/index.css`](src/styles/index.css) declara las capas e importa
los archivos en el orden de la página (dentro de una capa gana la regla que
viene después). Una regla de `secciones` gana a una de `base` aunque sea
menos específica. La página del cielo usa las mismas capas en
`src/features/cielo/cielo.css`. Las clases condicionales se arman con
`clsx`, por ejemplo `clsx("envelope", abierto && "open")`.

Los prefijos como `-webkit-` no se escriben a mano: la compilación los
agrega según los navegadores. Con `backdrop-filter` escrito dos veces (con y
sin prefijo), la compilación dejaba solo el prefijado y Chrome no mostraba
el desenfoque.

## Qué se puede editar en `src/config/`

| Archivo | Qué tiene |
|---|---|
| `textos.ts` | Todas las frases del sitio, por nombre (`heroTitle`, `navCarta`…), incluidas las etiquetas para lectores de pantalla y los mensajes del cielo y de la sesión. `{fecha}`, `{nombre}`, `{n}`… se reemplazan solos. Si un componente usa un nombre que no existe aquí, TypeScript avisa. |
| `meses.ts` | `lineaTiempo` (una foto por mes, `mes` en formato `"AAAA-MM"`) y `mensajesMes` (mensaje de cada mesiversario). |
| `boveda.ts` | Las cartas de La Bóveda. |
| `cumpleanos.ts` | Fecha de nacimiento, carta, velas y textos del día del cumpleaños. |
| `general.ts` | `nombres`, `fechas.inicioRelacion`, `rotacionMina` (turno 14×7), la canción, los emojis del juego y opciones. |
| `firebase.ts` | Proyecto de Firebase, `cieloId` y UID de las cuentas que pueden cambiar cosas. |

Si agregas una clave nueva y la usas en un componente, súmala también en
`src/types/config.ts`. Al terminar, `npm test` revisa que el contenido esté bien
escrito.

### La Bóveda

Cada carta tiene una `fecha`. Antes de esa fecha se ve sellada con una cuenta
regresiva; a partir de ahí se puede abrir y leer. Una carta puede incluir:

```ts
accion: { destino: "constelacion", etiqueta: "Ir a nuestra constelación ✦" }
```

que añade un botón dentro de la carta para saltar a esa sección (`destino` es
el `id` de la sección: `constelacion`, `juego`, `cumple`…).

**Cartas selladas.** El texto va cifrado en `mensajeSellado`, para que no se
pueda leer en el código de la página antes de su fecha; la página solo lo
descifra cuando la carta se desbloquea. Para escribir, leer o corregir una
carta abre `herramientas/sellar-carta.html` (en el link publicado o con
`npm run dev`): pega el texto, pulsa **Sellar** y copia el resultado en
`mensajeSellado`.

> La clave viaja con la página (no hay servidor), así que esto evita que se lea
> a simple vista, no a alguien que se proponga descifrarlo. Además, los textos
> que alguna vez estuvieron sin sellar siguen en el historial de Git.

**Borradores.** `borrador: true` oculta una carta que aún no tiene texto.

### Mensaje del mes

Cada entrada de `mensajesMes` (en `meses.ts`) tiene una `fecha` (normalmente el
día 8) y el texto sellado en `mensajeSellado`. El bloque aparece desde esa
fecha hasta el mismo día del mes siguiente, con el título calculado solo
("Ocho meses", "Nueve meses"…) salvo que pongas `titulo`. Los párrafos se
separan con una línea en blanco. `borrador: true` lo oculta.

### Añadir la foto de un mes

1. Copia la imagen a `public/assets/images/` (mejor en `.webp`, unos 1080 px de ancho).
2. Añade un objeto en `lineaTiempo` (`meses.ts`) con `mes`, `titulo`,
   `src: "assets/images/…"` y `texto`.

La galería abre en el mes más reciente; se recorre deslizando, con las flechas
o tocando un mes en la línea de abajo.

### Cambiar la canción

1. Copia el mp3 a `public/assets/audio/`.
2. Actualiza `musica.cancion.src` en `general.ts` (`"assets/audio/…"`).

### Cumpleaños

Todo sale de `cumpleanos.ts`. La única fecha que se escribe es la de
`nacimiento` (`"1999-10-11"`): de ahí se calcula el cumpleaños de cada año y la
**edad**, que se puede usar como `{edad}` en cualquier texto (27 en 2026, 28 en
2027…). Cada año pasa por tres momentos y el resto del tiempo la sección no se ve:

| Momento | Cuándo | Qué pasa |
|---|---|---|
| **Antes** | desde `diasAntes` (45) días antes | Sección con un regalo sellado y cuenta regresiva. La carta aparece sellada en La Bóveda. |
| **Hoy** | el día del cumpleaños | Modo cumpleaños: bienvenida especial (`textosHoy`), confeti al entrar, globos flotando, la sección del pastel sube al inicio y el botón del inicio lleva a las velas. |
| **Después** | `diasDespues` (60) días | La sección queda de recuerdo y se pueden volver a encender las velas. |

- **Pastel:** ella toca cada vela o usa "Soplar las velas". Al apagarlas todas
  hay confeti y aparece "Abrir mi carta". Se acuerda de que ya las apagó
  (`localStorage`, por dispositivo).
- **Carta:** se escribe en `cumpleanos.carta` y se suma sola a La Bóveda con la
  fecha del cumpleaños de ese año (se abre a las 00:00 del día).
- **Vista previa** sin cambiar el reloj: `?cumple=antes`, `?cumple=hoy` o
  `?cumple=despues` al final del link (en ese modo no se guarda nada).
- Con "reducir movimiento" activado en el dispositivo no hay confeti.

### Ajustar bajadas de mina desde la página

Dentro de la sección **Bajada** hay un panel plegable **"Ajustar bajadas de
mina"**. Se elige el día de la próxima bajada (y, si cambia, días en mina,
descanso y hora de regreso) y el calendario, el estado y la cuenta regresiva se
recalculan desde esa fecha.

**Con sesión iniciada** (cuenta de Google de uno de los dos) el ajuste se guarda
en Firebase y cambia en los dos celulares al instante. **Sin sesión** se guarda
solo en ese dispositivo. "Volver al calendario original" lo borra.

Para que un cambio valga para siempre aunque no haya ajuste, actualiza
`rotacionMina.salidaBase` en `general.ts` (un día en que subió a mina).

## Constelación y Firebase

`constelacion/` es una página aparte, enlazada desde la sección
**Constelación**: un cielo donde cada toque crea una estrella con un recuerdo,
y se pueden guardar como imagen. Con Firebase, los dos ven y crean las mismas
estrellas en tiempo real; las bajadas compartidas usan el mismo proyecto.

- La configuración y los pasos para crear el proyecto están en
  [`src/config/firebase.ts`](src/config/firebase.ts). Firebase se carga aparte,
  solo cuando una sección lo usa.
- **Quién puede cambiar las cosas:** cualquiera con el link puede mirar, pero
  solo las cuentas cuyo UID está en `miembros` (y en
  [`firestore.rules`](firestore.rules)) pueden escribir. Para sumar a alguien:
  que entre una vez con "Iniciar sesión", copia su UID en Firebase →
  Authentication → Usuarios, agrégalo en los dos archivos y vuelve a publicar
  las reglas en la consola (Firestore → Reglas). Un test avisa si no coinciden.
- Todo funciona en el plan gratuito (Spark).

## Vista previa del enlace

El texto y la imagen que aparecen al compartir el link (WhatsApp, Instagram…)
están en las etiquetas `<meta>` de `index.html` (`og:title`, `og:description`,
`og:image`). Van ahí fijas porque los lectores de enlaces no ejecutan
JavaScript.

- Para cambiar el mensaje: edita `og:title` / `og:description` (y `description`).
- Para cambiar la imagen: apunta `og:image` / `twitter:image` a otra foto con
  URL absoluta, en `.jpg` o `.png` de 1200×630 (hoy, `compartir.jpg`).
- Los enlaces ya compartidos guardan la vista previa vieja en caché; se refresca
  con el depurador de cada plataforma (p. ej. developers.facebook.com/tools/debug).

## Ramas, revisión y publicación

- **`main`** es lo publicado; **`develop`** junta el trabajo revisado. Las tareas
  van en ramas `feat/`, `fix/`, `refactor/` o `docs/` que salen de `develop`;
  el contenido urgente (`content/`) sale de `main`.
- **`calidad.yml`** corre en cada PR hacia `develop` o `main` y en cada push a
  `develop`: tipos, lint, tests, formato, compilación, peso de la carga inicial
  y que no haya correos en el repo.
- **`publicar.yml`** corre cuando algo llega a `main` (o a mano desde la pestaña
  Actions): pasa por las mismas revisiones, compila y publica `dist/` en GitHub
  Pages (*Settings → Pages → Source* = "GitHub Actions"). Si una revisión
  falla, no se publica nada y el sitio sigue como estaba.
