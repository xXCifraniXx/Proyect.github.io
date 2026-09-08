# Constelación de nosotros

Un mini-juguete creativo, aparte de la carta principal. Es un cielo en blanco:
cada toque crea una estrella y te pide un recuerdo (una palabra, una fecha, una
frase). Las estrellas se unen con líneas en el orden en que nacieron y van
formando una constelación.

## Cómo se usa

- **Tocar el cielo** → aparece un recuadro para escribir el recuerdo y se crea la estrella.
- **Tocar una estrella** → muestra su recuerdo y un botón `×` para quitarla.
- **Deshacer** → borra la última estrella.
- **Guardar imagen** → descarga la constelación como PNG (`constelacion-de-nosotros.png`).
- **Vaciar cielo** → borra todo (pide confirmación).
- En el celular, inclina el teléfono para un efecto de parallax suave.

## Dónde se guarda

Todo vive en `localStorage` del navegador donde se usa (clave
`constelacion-nosotros-v1`). No hay servidor: si Anthuanete lo abre en su
celular, ella arma su propio cielo; no se comparte entre dispositivos.

Para regalar una constelación ya hecha, usa **Guardar imagen** y manda el PNG.

## Archivos

```text
constelacion/
├── index.html      estructura
├── estrellas.css   estilos (misma paleta que el sitio principal)
└── estrellas.js    lógica del lienzo (canvas 2D, sin librerías)
```

## Publicar

Se publica solo con el resto del sitio en GitHub Pages. Queda accesible en
`https://usuario.github.io/constelacion/`.
