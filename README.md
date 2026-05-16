# Proyecto romantico escalable para Anthuanete

Esta version separa el proyecto en archivos para que puedas mantenerlo, agregar fotos, cambiar musica y modificar textos sin tocar todo el HTML.

## Estructura

```text
Proyect.github.io-escalable/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── config.js
│   │   └── app.js
│   ├── images/
│   │   ├── primera_Cita.jpg
│   │   ├── picnic.jpg
│   │   ├── Astronautas.jpg
│   │   └── Compromiso.jpg
│   └── audio/
│       └── the-first-time.mp3
```

## Archivo principal para editar

Casi todo lo personalizable esta en:

```text
assets/js/config.js
```

Ahi puedes cambiar nombres, fechas, textos, canciones y fotos.

## Cambiar fecha de inicio

Busca en `assets/js/config.js`:

```js
inicioRelacion: "2026-03-08T00:00:00"
```

Reemplazalo por la fecha real desde que estan juntos.

## Cambiar fecha de regreso

Busca:

```js
regreso: "2026-05-25T00:00:00"
```

Reemplazalo por la fecha en la que ella vuelve. Si no quieres usar la cuenta regresiva, puedes poner:

```js
regreso: null
```

## Agregar una cancion permanente

1. Copia el archivo mp3 a:

```text
assets/audio/
```

2. Abre `assets/js/config.js`.
3. Busca `musica.playlist`.
4. Agrega otra entrada:

```js
{
  titulo: "Nombre de la cancion",
  artista: "Artista o frase especial",
  src: "assets/audio/nombre-del-archivo.mp3"
}
```

Ejemplo:

```js
playlist: [
  {
    titulo: "The First Time",
    artista: "Nuestra cancion",
    src: "assets/audio/the-first-time.mp3"
  },
  {
    titulo: "La cancion que ella eligio",
    artista: "Su favorita",
    src: "assets/audio/cancion-de-anthuanete.mp3"
  }
]
```

## Cambiar musica desde la pagina

La pagina tiene un selector de canciones y tambien permite elegir una cancion desde el celular o PC.

Importante:

- Si eliges una cancion desde el boton de la pagina, queda guardada solo en ese navegador/dispositivo.
- Para que ella la escuche desde el link, debes subir el mp3 dentro de `assets/audio` y agregarlo en `assets/js/config.js`.

## Agregar fotos permanentes

1. Copia las fotos a:

```text
assets/images/
```

2. Abre `assets/js/config.js`.
3. Busca `galeria`.
4. Agrega una entrada:

```js
{
  src: "assets/images/foto-nueva.jpg",
  titulo: "Titulo bonito",
  frase: "Frase para esa foto"
}
```

## Agregar fotos desde la pagina

La pagina permite elegir fotos desde el dispositivo. Esas fotos quedan guardadas en el navegador donde se agregaron.

Importante:

- Si tu agregas fotos desde tu PC, se veran en tu PC.
- Para que ella vea esas fotos desde su celular al abrir el link, las fotos deben estar dentro del proyecto en `assets/images` y registradas en `assets/js/config.js`.

## Agregar foto por URL

Tambien puedes pegar una URL de imagen desde la pagina. Funcionara si la pagina origen permite mostrar la imagen desde otro sitio.

## Galeria en movimiento

La galeria se mueve automaticamente. Puedes cambiar la velocidad en:

```js
galeriaAutoMs: 3600
```

Mas alto = mas lento. Mas bajo = mas rapido.

## Publicar

Sube la carpeta completa a GitHub Pages, Netlify o Vercel. La pagina principal debe seguir llamandose `index.html`.

## Calendario de mina 14 x 7

Esta version incluye una seccion nueva llamada **Bajada**, pensada para el turno 14 x 7.

La configuracion esta en `assets/js/config.js`:

```js
rotacionMina: {
  activa: true,
  salidaBase: "2026-05-14T08:00:00",
  diasMina: 14,
  diasDescanso: 7,
  horaRegreso: "21:00",
  mesesAMostrar: 2
}
```

### Como funciona

- `salidaBase`: el dia que se fue a mina. En este ejemplo: jueves 14.
- `diasMina`: cuantos dias esta en mina. Para 14 x 7, deja `14`.
- `diasDescanso`: cuantos dias dura el ciclo de descanso/bajada. Para 14 x 7, deja `7`.
- `horaRegreso`: hora aproximada en que llega el dia de bajada. Puedes usar `21:00` si vuelve por la noche.
- `mesesAMostrar`: cuantos meses se ven en pantalla al mismo tiempo.

Con estos datos, la pagina marca automaticamente:

- dias en mina,
- dia de bajada,
- dias de descanso,
- proxima subida,
- y cuenta regresiva para la proxima bajada o subida.

Si ella se fue jueves 14 y regresa jueves 28 por la noche, deja:

```js
salidaBase: "2026-05-14T08:00:00",
horaRegreso: "21:00"
```

Y la pagina calculara los siguientes ciclos automaticamente.


## Ajustes recientes

- El calendario 14 x 7 muestra solo un mes para que sea mas limpio en celular.
- Se agrego el boton "Volver a hoy" en el calendario.
- El boton de pausa de la galeria ahora es un boton simple con iconos: pausa y reproducir.

Para volver a mostrar dos meses, cambia `mesesAMostrar: 1` por `mesesAMostrar: 2` en `assets/js/config.js` y ajusta `.calendar-months` si quieres dos columnas.
