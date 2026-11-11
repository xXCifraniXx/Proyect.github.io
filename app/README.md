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

## Qué usa del sitio actual

Para no duplicar nada durante la migración, lee directamente:

- `../assets/js/config.js` — todo el contenido (textos, fechas, fotos, cartas).
- `../assets/css/styles.css` — los estilos.
- `../assets/images` y `../assets/audio` — fotos y canción (Vite las sirve en
  desarrollo y las copia a `dist/` al compilar; ver `vite.config.ts`).

## Estructura

Un componente por archivo `.tsx`, con el mismo nombre que el componente.

```text
src/
├── main.tsx            Arranque: estilos, título y <App />
├── App.tsx             La página: junta todas las secciones
├── components/         Un componente por archivo (Bienvenida.tsx, Menu.tsx…)
├── hooks/              Lógica de React reutilizable (useRevelar.ts)
├── lib/                Cálculos sin pantalla (contenido, fechas, sello de cartas, cumpleaños…)
└── types/              Tipos de TypeScript (config.ts describe el contenido de config.js)
```

TypeScript está en modo estricto: si un dato puede faltar (por ejemplo un texto
de `config.js`), hay que decir qué hacer en ese caso. Si agregas una clave
nueva en `config.js`, súmala en `src/types/config.ts`.

## Avance de la migración

- [x] Fase 1: bienvenida, fondo, menú de tres líneas y carta del sobre (en TypeScript)
- [x] Fase 2: mensaje del mes (cartas selladas en TypeScript), sección Carta y galería de fotos
- [ ] Tiempo juntos, calendario de bajadas (con Firebase)
- [ ] Música y cumpleaños
- [ ] La Bóveda (cartas selladas)
- [ ] Constelación (con Firebase)
- [ ] Minijuego y cierre
- [ ] Publicar con GitHub Actions en el mismo link
