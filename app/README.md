# Versión React del sitio (en migración)

Nueva versión del sitio hecha con **React + Vite**. Mientras se migra, el sitio
publicado sigue siendo el de la carpeta raíz; esta versión se publicará en el
mismo link solo cuando haga todo lo que hace la actual.

## Cómo verla en tu equipo

```bash
cd app
npm install
npm run dev
```

Abre http://localhost:5173/Proyect.github.io/ . Los cambios se ven al instante.

Para compilar la versión final: `npm run build` (queda en `app/dist/`).

## Qué usa del sitio actual

Para no duplicar nada durante la migración, lee directamente:

- `../assets/js/config.js` — todo el contenido (textos, fechas, fotos, cartas).
- `../assets/css/styles.css` — los estilos.
- `../assets/images` y `../assets/audio` — fotos y canción (Vite las sirve en
  desarrollo y las copia a `dist/` al compilar; ver `vite.config.js`).

## Estructura

```text
src/
├── main.jsx            Arranque: estilos, título y <App />
├── App.jsx             La página: junta todas las secciones
├── contenido.js        CONFIG, TEXTOS y NOMBRES desde config.js
├── componentes/        Una pieza de la página por archivo
├── hooks/              Lógica reutilizable (p. ej. useRevelar)
└── lib/                Cálculos sin pantalla (cumpleaños, mensaje del mes)
```

## Avance de la migración

- [x] Fase 1: bienvenida, fondo, menú de tres líneas y carta del sobre
- [ ] Mensaje del mes y galería de fotos
- [ ] Tiempo juntos, calendario de bajadas (con Firebase)
- [ ] Música y cumpleaños
- [ ] La Bóveda (cartas selladas)
- [ ] Constelación (con Firebase)
- [ ] Minijuego y cierre
- [ ] Publicar con GitHub Actions en el mismo link
