# Versión React del sitio (en migración)

Nueva versión del sitio hecha con **React + TypeScript + Vite**. Mientras se migra, el sitio
publicado sigue siendo el de la carpeta raíz; esta versión se publicará en el
mismo link solo cuando haga todo lo que hace la actual.

## Cómo verla en tu equipo

```bash
cd app
npm install
npm run dev
```

Abre http://localhost:5173/Proyect.github.io/ . Los cambios se ven al instante.

Para compilar la versión final: `npm run build` (revisa los tipos y deja el sitio en `app/dist/`).
Solo revisar los tipos: `npm run typecheck`.

Tests (Vitest, en `src/**/*.test.ts`): `npm test`, o `npm run test:watch` mientras
editas. Cubren la rotación de mina, el cumpleaños, el mensaje del mes, las
fechas y el sello; el de sello abre todas las cartas reales de `config.js` sin
mostrar su texto.

Formato (Prettier): `npm run format` lo aplica y `npm run format:check` solo revisa.

## Qué usa del sitio actual

Para no duplicar nada durante la migración, lee directamente:

- `../assets/js/config.js` — todo el contenido (textos, fechas, fotos, cartas).
- `../assets/css/styles.css` y `../constelacion/estrellas.css` — los estilos.
- `../assets/js/nube-config.js` — el proyecto de Firebase y quiénes pueden cambiar cosas.
- `../assets/images` y `../assets/audio` — fotos y canción (Vite las sirve en
  desarrollo y las copia a `dist/` al compilar; ver `vite.config.ts`).

## Firebase

Se instala con npm (`firebase`) y se carga aparte, solo cuando una sección lo
usa (ver `src/lib/firebase.ts`). Usa el mismo proyecto, las mismas reglas
(`firestore.rules` en la raíz) y la misma sesión de Google que el sitio actual.
Solo funciones del plan gratuito.

## Estructura

Un componente por archivo `.tsx`, con el mismo nombre que el componente. Cada
sección del sitio es una carpeta en `features/` con sus componentes, su lógica
y sus tests.

```text
src/
├── main.tsx               Arranque de la página principal
├── constelacion/main.tsx  Arranque de la página del cielo (constelacion/index.html)
├── App.tsx                La página: junta todas las secciones en orden
├── features/              Una carpeta por sección
│   ├── inicio/            Bienvenida, menú y sobre
│   ├── mensaje-mes/       Mensaje del mes (y cuál toca mostrar)
│   ├── carta/             Sección Carta
│   ├── galeria/           Una foto por mes
│   ├── tiempo/            Tiempo juntos
│   ├── bajadas/           Calendario, rotación 14×7 y ajuste compartido
│   ├── musica/            Canción
│   ├── boveda/            La Bóveda y la ventana de carta
│   ├── cumple/            Cumpleaños y pastel
│   ├── constelacion/      Sección que lleva al cielo
│   ├── cielo/             Página del cielo: estrellas, dibujo y Firebase
│   ├── juego/             Minijuego de memoria
│   ├── cierre/            Para terminar
│   └── sesion/            Inicio de sesión con Google
├── components/ui/         Piezas que usan varias secciones (Seccion, CuentaRegresiva…)
├── hooks/                 Hooks compartidos (useAhora, useRevelar, useTextoCarta)
├── lib/                   Lógica compartida sin pantalla (contenido, fechas, sello, Firebase, cumpleaños…)
└── types/                 Tipos de TypeScript (config.ts describe el contenido de config.js)
```

Cada carpeta de `features/` y `components/ui/` tiene un `index.ts` con lo que
se usa desde fuera. Entre carpetas se importa siempre desde ese `index.ts`;
dentro de una carpeta, directo del archivo.

TypeScript está en modo estricto: si un dato puede faltar (por ejemplo un texto
de `config.js`), hay que decir qué hacer en ese caso. Si agregas una clave
nueva en `config.js`, súmala en `src/types/config.ts`.

## Avance de la migración

- [x] Fase 1: bienvenida, fondo, menú de tres líneas y carta del sobre (en TypeScript)
- [x] Fase 2: mensaje del mes (cartas selladas en TypeScript), sección Carta y galería de fotos
- [x] Fase 3: tiempo juntos, calendario de bajadas y ajuste compartido con Firebase (npm)
- [x] Fase 4: música, cumpleaños (antes, hoy y después) y confeti
- [x] Fase 5: La Bóveda (cartas selladas, ventana de carta compartida con el pastel)
- [x] Fase 6: sección Constelación y la página del cielo (constelacion/index.html) con Firebase y sesión
- [x] Fase 7: minijuego y cierre (la página completa coincide texto por texto con el sitio actual)
- [ ] Publicar con GitHub Actions en el mismo link
