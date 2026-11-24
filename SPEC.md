# SPEC.md: Contrato de la aplicación

Versión 2 (noviembre de 2026; la 2 pasó de una sola página larga a una
página por sección, aprobado por Jorge el 22-11-2026). Describe el
comportamiento que el sitio debe conservar en cualquier refactorización.
Cambiarlo requiere la aprobación de Jorge.

Todas las fechas y horas se calculan con el **reloj del dispositivo que abre
la página** (hora local; hoy Perú, UTC−5).

---

## 1. Páginas, vistas y secciones

### 1.1 El sitio (`index.html`): portada y pocas páginas

Es una sola página HTML (SPA): según la ruta del link se ve la portada o una
de las páginas, y se cambia de página **sin recargar**, con el historial del
navegador (atrás y adelante funcionan; cada página tiene su link). Desde el
24-11-2026 el menú es corto (lo pidió Jorge): los mensajes van en la portada,
el tiempo juntos y la música están siempre a mano, la constelación y el juego
van juntos, y lo que ya pasó queda de recuerdo en La Bóveda.

Capas fijas, en todas las páginas:

- **Barra de progreso** arriba: se llena según cuánto se bajó en la página
  que se está viendo (si la página entra entera en la pantalla, no se ve).
- **Franja del tiempo juntos**, pegada arriba: "♡ Juntos: {tiempo}" (por
  ejemplo "8 meses y 16 días"; lo que vale 0 no se nombra). Al tocarla se
  abre debajo el detalle: "El tiempo que hemos compartido" con 4 contadores
  (años, meses, días, días en total) y, solo si la rotación está apagada en
  `config` y `fechas.regreso` es válida, la tarjeta de regreso con su cuenta
  regresiva (cada segundo). Se cierra con el mismo botón, con Escape o
  tocando fuera. Cambia sola a medianoche.
- **Música**: la canción (`musica.cancion`) vive en toda la página y sigue
  sonando al cambiar de página. Se toca desde la barra de secciones (1.2);
  no suena sola. Volumen `musica.volumenInicial` (0.24).
- **Fondo**: tres luces (caramelo, cacao rosa, espuma; ver 1.6) y `opciones.corazones` (18)
  corazones que flotan (♡ ❤). El día del cumpleaños son 🎈 ✨ ❤ 🎉 ♡.
  - **En diciembre** (todo el mes, cada año; `opciones.fondoNavidad`, que si
    falta es `true`): fondo navideño. En lugar de corazones que suben, cae
    nieve que se mece (❄ ❅ ✻ ❆ •, la misma cantidad), y las luces pasan a
    caramelo, verde pino y rojo arándano (`body.is-navidad`). El día del
    cumpleaños gana su fondo. Al empezar o terminar diciembre con la página
    abierta, se recarga. Vista previa en cualquier fecha: `?fondo=navidad`.
- **Bienvenida**: pantalla encima de todo con etiqueta, título, texto, botón
  "Entrar a la carta" y nota. Al pulsar se oculta. Sale **una vez, solo si se
  abre el sitio por la portada** (`/`): un link directo a una página (o un
  link viejo, como `/carta` o `/tiempo`) entra directo, y volver a la portada
  desde el sitio no la muestra de nuevo. El día del cumpleaños usa
  `cumpleanos.textosHoy` y lanza confeti a los 300 ms.
- **Ventana de carta** (modal): la abren La Bóveda, el adviento y el pastel (ver 2.2).
- **Barra de secciones** (1.2).

Páginas, en este orden (el del menú):

| Ruta | id | Página | Condición | Elementos |
|---|---|---|---|---|
| `/` | `inicio` | Portada | siempre | Menú (1.2); etiqueta, título y texto; botones "Abrir mi carta" (baja a la carta de esta misma portada) y segundo botón (→ `/boveda`, o `/cumple` el día del cumpleaños); sobre con carta (1.3); después, el **mensaje del mes** (solo si hay uno vigente, 2.3: hoja de papel con fecha larga, título como "Ocho meses", párrafos y firma); la **carta** (cabecera y botón "Ver mensaje sorpresa 💗" / "Ocultar mensaje 💌" que muestra u oculta `textos.surpriseMessage`); al final, el **cierre**: etiqueta, frase final, firma |
| `/adviento` | `adviento` | Calendario de adviento | en el menú entre `adviento.desde` y `adviento.hasta`; desde `hasta`, solo desde La Bóveda (2.8) | Cabecera, aviso del día y 24 puertas (2.8) |
| `/meses` | `linea-tiempo` | Galería mensual | siempre | Una foto por mes (2.6), flechas ‹ ›, línea de meses |
| `/bajada` | `calendario` | Bajada (14×7) | si la rotación está activa en `config` | Leyenda, estado actual con cuenta regresiva, barra (‹ mes › y "Hoy"), mes(es) del calendario, panel "Ajustar bajadas de mina" (2.1) |
| `/cumple` | `cumple` | Cumpleaños | en el menú en los estados `antes` y `hoy` (**el día del cumpleaños va primera**); en `despues`, solo desde La Bóveda (2.4) | ver 2.4 |
| `/boveda` | `boveda` | La Bóveda | siempre | Tarjetas de cartas selladas o abiertas (2.2) y, si hay, **Recuerdos** (2.2) |
| `/entretenimiento` | `entretenimiento` | Entretenimiento | siempre | La **constelación** (cielo animado de adorno y botón "Abrir nuestra constelación ✦" → `constelacion/index.html`, la página del cielo, 1.4) y, debajo, el **minijuego** (movimientos, parejas `n/6`, "Reiniciar", tablero, mensaje de victoria con "Otra vez", 2.7) |

- Cada página (no la portada) termina con el botón **"Seguir: {siguiente} →"**
  a la página que sigue en este orden; en la última, "Volver al inicio". Una
  página que no está en el menú (un recuerdo) termina con "Seguir: La Bóveda →".
- Una ruta cuya página hoy no existe (por ejemplo `/cumple` fuera de sus
  fechas) lleva a la portada, sin dejarla en el historial.
- `/index.html` y una ruta con `/` al final (`/boveda/`) se corrigen solas
  (`/`, `/boveda`).
- **Al cambiar de página**: la nueva empieza arriba, el título de la pestaña
  pasa a "{página} | Para {novia}" (en la portada, "Para {novia} | Una carta
  de {autor}") y el foco va al contenido. Al abrir el sitio no se mueve nada,
  salvo con un link a una sección que va dentro de otra página (abajo).
- **Secciones dentro de otra página:** para llegar a la carta, al mensaje del
  mes, a la constelación o al juego, se cambia de página (si hace falta) y se
  baja hasta la sección, que queda justo debajo de la franja. Si lo de arriba
  cambia de alto mientras termina de cargar, se vuelve a alinear durante unos
  segundos, salvo que ella ya se esté moviendo. La sección no queda en el link.
- **Rutas viejas** (las páginas que había antes del 24-11-2026) siguen
  funcionando y llevan a su nuevo lugar, sin recargar y con su `?…`:
  `/este-mes` → la portada, en el mensaje del mes; `/carta` → la portada, en
  la carta; `/tiempo` y `/musica` → la portada; `/cielo` → `/entretenimiento`,
  en la constelación; `/juego` → `/entretenimiento`, en el juego.
- El `?…` del link (las vistas previas `?cumple=…`, `?tema=rosa` y `?fondo=navidad`) se
  conserva al cambiar de página, también al ir a la página del cielo y al
  volver de ella.
- **Links viejos** (de cuando todo era una sola página): `/#{id}` pasa solo,
  sin recargar, a la página de esa sección (`/#boveda` → `/boveda`,
  `/#linea-tiempo` → `/meses`, `/#juego` → `/entretenimiento` en el juego,
  `/#carta` → la portada en la carta), con su `?…`. `#inicio`, `#final` y
  `#welcome` llevan a la portada. También si el `#` cambia con el sitio
  abierto.

Las secciones aparecen suavemente la primera vez que entran en pantalla.

### 1.2 Menú y barra de secciones

**Menú de la portada:**

- Marca "Para {novia}" (→ `/`) y un enlace por página del menú, en el orden
  de 1.1: Adviento 🎄*, Meses, Bajada, Cumpleaños*, La Bóveda,
  Entretenimiento.
  - *"Adviento 🎄" solo entre `adviento.desde` y `adviento.hasta` (2.8).
  - *"Cumpleaños" en los estados `antes` y `hoy`; el día del cumpleaños, primero.
  - Con la rotación apagada, Bajada no está.
- Hasta **1200 px** de ancho: botón "☰ Menú" que abre un panel de dos
  columnas sobre la portada. Se cierra al elegir una opción, al tocar fuera
  o con Escape (y el foco vuelve al botón). Abierto, el ícono es ✕.
- Más de 1200 px: botones en una fila.

**Barra de secciones** (en todos los tamaños): la navegación de todo el sitio.

- Flota abajo **en todas las páginas**. En la portada aparece cuando su menú
  ya quedó arriba (nunca dos menús a la vez) y se va al volver a él.
- Muestra el nombre de la página que se está viendo ("Inicio" en la portada)
  y una estrella por cada página del menú, en el mismo orden: las de antes en
  espuma (`--gold`), la actual en caramelo (`--rose`) y más grande, las que
  siguen apagadas (en la portada, y en una página fuera del menú, todas
  apagadas).
- Si hay canción (`musica.cancion.src`), un botón **▶ / ❚❚** la hace sonar o
  la pausa; se llama "Reproducir «{título}»" o "Pausar «{título}»". Sonando,
  va en caramelo. Si el navegador no puede reproducirla, muestra "!" y su
  nombre es `textos.musicaError`.
- El botón ✦ abre un panel desde abajo (un `<dialog>`) con "Volver al
  inicio" y las páginas del menú, con la actual marcada. Si no entran en la
  pantalla, se desplaza con una barra fina del color del tema. Se cierra con
  la ×, con Escape, tocando fuera o eligiendo una página (que lleva a ella).
  Al cerrarlo sin elegir, el foco vuelve al botón; al elegir, el foco pasa a
  la página nueva.
- El final de cada página deja espacio para que la barra no tape nada.
- Los enlaces del menú, de la barra, del panel y de "Seguir" son links de
  verdad (`<a href>`): se pueden abrir en otra pestaña.

### 1.3 Sobre con la carta (portada)

- Se abre y cierra tocando el sobre, con Enter o Espacio, o con el botón
  "Abrir carta" / "Cerrar carta". El texto de ayuda cambia según el estado.
- Hasta 920 px: al abrirse, el sobre baja lo justo para que la carta y la
  solapa **no tapen el menú**. Ese espacio se calcula con la altura real de
  la carta + 16 px.

### 1.4 Página del cielo (`/constelacion/index.html`)

- Lienzo a pantalla completa: fondo degradado con 3 nebulosas, polvo de
  estrellas y la constelación. Se mueve levemente (±30 px) con el mouse o
  la inclinación del celular.
- Barra superior: "← Volver a la carta", título, botón de sesión (solo con
  Firebase), "↶ Deshacer", "⤓ Guardar imagen", "✦ Vaciar cielo".
- Línea de ayuda abajo; contador al pie (2.5).
- Cuadro para escribir el recuerdo y burbuja de la estrella tocada (2.5).

### 1.5 Herramienta (`herramientas/sellar-carta.html`)

Página para Jorge: **sellar** un texto y **abrir** un sello existente, con el
mismo formato que la página (2.2). Usa el mismo `src/lib/sello.ts` que el
sitio y se publica en la misma ruta.

### 1.6 Colores y letras: café y crema (y el rosa de antes)

- El sitio y la página del cielo se ven en **café y crema** (fondo espresso,
  acentos caramelo, cacao rosa y espuma, texto crema) con letra **Nunito**
  (redondeada) en títulos y texto. Lo decidió Jorge el 24-11-2026, después
  de probarlo como vista previa.
- Nunito va guardada en el sitio (paquete `@fontsource-variable/nunito`,
  licencia OFL): no se pide nada a Google. Mientras llega, se ve la letra de
  respaldo.
- Ningún color ni letra va escrito en el CSS de las secciones: todos salen
  de los tokens (`src/styles/tokens.css`; la página del cielo, los suyos en
  `cielo.css`). El cielo, el cielo de adorno y el confeti toman colores y
  letra de los mismos tokens al empezar a dibujar.
- **Vista previa del tema rosa de antes:** con `?tema=rosa` en el link, el
  sitio y la página del cielo se ven como antes del café (fondo morado
  oscuro, rosa, lila y dorado; títulos en Georgia y texto con la letra del
  dispositivo), y Nunito no se descarga. Se aplica antes de pintar (sin un
  instante café) y también cambia el color de la barra del navegador. No
  guarda nada. Se puede combinar con `?cumple=…` (`?tema=rosa&cumple=hoy`).
- `?tema=cafe` (la vista previa anterior) sigue funcionando: muestra lo mismo
  que sin nada.

---

## 2. Reglas de negocio (inmutables)

### 2.1 Rotación de mina 14×7

Fuente: `rotacionMina`.

```text
activa = true
salidaBase = 2026-08-27 08:00
diasMina = 14
diasDescanso = 7
horaRegreso = "21:00"
mesesAMostrar = 1
```

**Fórmula.** Sea `diasCiclo = diasMina + diasDescanso` (21) y `baseDia` el
día de `salidaBase` a las 00:00. Sea `d` el número de días de calendario
entre `baseDia` y el día evaluado (sin importar la hora ni el cambio de
horario).

- `d < 0` → sin marca.
- `i = d mod diasCiclo`:
  - `i = 0` → **Sube** (clases `departure mine`);
  - `0 < i < diasMina` → **Mina**;
  - `i = diasMina` → **Bajada** (`return`);
  - el resto → **Descanso** (`rest`).
- El día de hoy lleva además `today`. La semana del calendario empieza el
  **lunes**.

**Ciclo `n`.**

```text
inicio = baseDia + n·21 días, a la hora de salidaBase (08:00)
bajada = inicio + diasMina días, a horaRegreso (21:00)
siguienteInicio = baseDia + (n+1)·21 días, a las 08:00
```

**Estado actual** (con la cuenta regresiva hacia `objetivo`):

| Momento | Título | Etiqueta | Objetivo |
|---|---|---|---|
| antes del primer inicio | "Próxima subida programada" | Próxima subida | inicio |
| `inicio ≤ ahora < bajada` | "Ahora estás en mina 😿" + "La próxima bajada será el {día} por la noche…" | Próxima bajada | bajada |
| `bajada ≤ ahora < siguienteInicio` | "Estás en tus días de bajada 😼" + "La próxima subida será el {día}…" | Próxima subida | siguienteInicio |

- **Calendario:** abre en el mes actual (`opciones.calendarioDesdeHoy`). La
  cuenta se actualiza cada segundo y los días cambian solo al cambiar el día.

**Ajuste "Próxima bajada".** Campos: día que baja (no antes de hoy), días en
mina y de descanso (1–60) y hora de regreso.

- Al guardar se recalcula `salidaBase = díaBajada − diasMina`, a la hora de
  la `salidaBase` original.
- **Prioridad:** ajuste compartido (Firestore) > ajuste del dispositivo
  (`localStorage` `roster-override-v1`) > `config`.
- **Con sesión de un miembro:** se guarda en Firestore para los dos ("Guardado
  para los dos…") y se borra el del dispositivo.
- **Sin sesión:** solo en el dispositivo ("Guardado solo en este
  dispositivo…").
- **"Volver al calendario original":** borra el ajuste. Si es compartido,
  exige sesión de miembro.
- Con un ajuste activo, el título del panel lleva la marca ✦. Los avisos
  duran 4 s.

### 2.2 Cartas selladas y La Bóveda

**Cifrado** (debe seguir siendo compatible):

- AES-GCM de 256 bits; clave derivada con PBKDF2-SHA-256, **150.000**
  iteraciones, desde la constante `CLAVE` de `src/lib/sello.ts`, que
  **no se cambia**.
- Sal aleatoria de 16 bytes y IV de 12 bytes.
- Formato: `"v1.<sal>.<iv>.<datos>"`, en base64.
- Si no se puede abrir, se muestra `textos.bovedaSelloError`.
- La clave viaja con la página: protege de la lectura casual, no de un ataque.

**Cartas** = `boveda.cartas` + la carta de cumpleaños del año (2.4).

- Se omiten las `borrador: true`.
- Se ordenan por `fecha`.
- Sin cartas: se muestra `textos.bovedaEmpty`.

**Recuerdos** (debajo de las cartas, con el título `textos.bovedaRecuerdos`,
solo si hay alguno): un sobre más bajo, en tono cacao rosa, por cada cosa que
ya pasó, con su ícono en el sello y una flecha; lleva a su página (fuera del
menú).

- El cumpleaños, en su estado `despues` (2.4): 🎂 "Tu cumpleaños {edad}" →
  `/cumple` (el pastel, para volver a encender las velas).
- El adviento, desde `adviento.hasta` (2.8): 🎄 "Adviento {anio}" →
  `/adviento` (las 24 puertas, para volver a abrirlas).

**Estados:**

Cada carta se ve como un **sobre** (lo eligió Jorge el 24-11-2026): solapa en
V y un sello de cera en su punta, con los colores del sobre de la portada
(cambian con el tema, 1.6). Hasta 640 px, uno por fila; hasta 920 px, dos;
más, tres.

- **Sellada** (`fecha > ahora`): sobre atado con un cordel, con 🔒 en el
  sello, "Carta sellada" y "Se abre el {día, mes y año} · faltan {a} {m} {d}".
  No se puede abrir y **su texto no se descifra ni aparece en la página**.
- **Abierta**: el ícono de la carta en el sello, el matasellos con su fecha
  ("8 MAR" y "2026"), el título y "Abierta el {día y mes} · toca para leer".
  El sobre no muestra el texto: se descifra al abrir la ventana. Al tocarlo
  (o con Enter o Espacio) se abre la ventana.

Se revisa cada **60 s** por si una carta se desbloquea con la página abierta.

**Ventana de carta:** ícono, fecha, título, foto (si la carta tiene `foto`)
y texto completo. Si la carta
tiene `accion`, muestra el botón, que cierra la ventana y lleva a la página
de esa sección, bajando hasta ella si va dentro de otra (`destino` es el id
de la sección: `"constelacion"` → `/entretenimiento`, en la constelación;
`"cumple"` → `/cumple`). Un `destino` que no es de ninguna sección no
muestra el botón.

- Se cierra con ×, Escape o tocando fuera; al abrirse, el foco va a la ×.
- **Nunca abre una carta antes de su fecha**, venga de donde venga.

### 2.3 Mensaje del mes (mesiversarios)

- De `mensajesMes` (sin borradores, con texto) se toma el **último** con
  `fecha ≤ ahora`.
- Se ve desde su fecha hasta el **mismo día del mes siguiente** (sin
  incluirlo). Normalmente es el día 8.
- **Título**: `titulo` si existe. Si no, se calcula con los meses completos
  entre `inicioRelacion` y la fecha:
  - de 1 a 11: "Un mes", "Dos meses" … "Once meses";
  - 12: "Un año";
  - de 13 en adelante: "{n} meses".
- **Texto**: descifrado (2.2) y separado en párrafos por cada línea en blanco.
- **Firma**: `textos.mesFirma`.
- Usa el mismo "ahora" que el cumpleaños, incluida la vista previa.

### 2.4 Modo cumpleaños

Fuente: `cumpleanos`.

```text
nacimiento = 1999-10-11
diasAntes = 45
diasDespues = 60
velas = 5
```

- `{edad}` en cualquier texto se reemplaza por los años que cumple (27 en
  2026).
- **Estados**, para el cumpleaños `C` (11 de octubre a las 00:00) más cercano:
  - `hoy`: de `C` a `C + 1 día`;
  - `despues`: hasta `C + 1 día + diasDespues`;
  - `antes`: desde `C − diasAntes` hasta `C`;
  - fuera de esas ventanas, `off`: la sección y su enlace no existen.

| Estado | Comportamiento |
|---|---|
| `antes` | 🎁 + etiqueta + cuenta regresiva (cada segundo). Al llegar a `C` la página se recarga. La carta aparece **sellada** en La Bóveda. |
| `hoy` | `body.is-birthday`; `textosHoy` reemplaza esas claves; globos en el fondo; confeti al entrar (con la bienvenida); su página va primera en el menú; el segundo botón de la portada → `/cumple`; pastel. |
| `despues` | Sale del menú y queda de recuerdo en La Bóveda (2.2), que lleva a `/cumple`: el pastel, donde se pueden volver a encender las velas. |

**Pastel:** `velas`, limitado entre 1 y 9 (por defecto 5).

- Tocar una vela la apaga; el brillo baja según las velas encendidas.
- "Soplar las velas 💨" las apaga una a una cada 140 ms.
- Al apagarse la última: confeti, 26 corazones y se guarda
  `cumple-velas-AAAA-MM-DD` en el dispositivo.
- Después aparecen el deseo, "Abrir mi carta 💌" (abre la carta de
  cumpleaños **sin** el botón "Ir a soplar mis velas") y "Volver a encender
  🕯️" (enciende las velas y borra la marca).
- Si ya se habían apagado, al volver se ven apagadas, sin confeti.

**Carta de cumpleaños:** `cumpleanos.carta` con `fecha = C`, `id = "cumple"`,
`edad` y `accion → cumple`, etiqueta `textos.cumpleIrVelas`.

**Vista previa** (no guarda nada): `?cumple=antes` (C − 5 días),
`?cumple=hoy` (C + 9 h), `?cumple=despues` (C + 3 días). Desplaza el "ahora"
del cumpleaños, de La Bóveda y del mensaje del mes.

### 2.5 Constelación y sincronización

**Estrella:** `{ id, x, y, label, born }`.

- `x` e `y` van de 0 a 1 respecto de la pantalla. Al crearla se limitan a
  `x` 0,02–0,98 e `y` 0,06–0,96.
- `label` tiene hasta 60 caracteres.
- `born` está en ms.
- `id` = `"s" + born en base 36 + 6 caracteres aleatorios`.

**Dibujo:**

- Líneas que unen las estrellas **en el orden de `born`**, con degradado
  caramelo → cacao rosa (`--rose` → `--lilac`).
- Cada estrella tiene halo, núcleo, destello en cruz y un titileo propio.
- La etiqueta se ve en la última estrella creada (4 s), en la que tiene el
  mouse encima, y en todas al exportar.

**Interacción:**

- Un toque es un movimiento de menos de 10 px. Si cae a menos de 26 px de una
  estrella, abre su burbuja (recuerdo + × solo si se puede editar); si no,
  abre el cuadro para escribir un recuerdo (si se puede editar).
- En el cuadro, Enter guarda y Escape cancela.
- Tocar fuera de la burbuja la cierra.
- "Deshacer" quita la última estrella.
- "Vaciar cielo" pide confirmación ("…Se borra para los dos…" si es
  compartido).
- "Guardar imagen" descarga `constelacion-de-nosotros.png`, al doble de
  resolución, con todas las etiquetas y el texto "Constelación de nosotros".

**Modo local** (sin Firebase o si Firebase falla): el cielo se guarda en
`localStorage` `constelacion-nosotros-v1` y se edita libremente.

**Modo nube:**

- Firestore `cielos/{cieloId}/estrellas/{id}`, con campos
  `{x, y, label, born}`. Se escucha en vivo.
- El cielo local no se toca hasta la primera respuesta **del servidor**.
- El cielo compartido también se copia en `constelacion-nosotros-v1`.
- **Editar** (poner, quitar, deshacer, vaciar) solo los UIDs de `miembros`,
  con sesión de Google (ventana emergente). **Mirar** lo puede cualquiera.
- Sin sesión, tocar el cielo muestra "Inicia sesión con Google para poner o
  quitar estrellas ✦" y resalta el botón. Con otra cuenta: "Con {correo}
  puedes mirar el cielo, pero no cambiarlo." (el correo solo se muestra en
  pantalla, nunca se guarda).
- **Subida inicial**, una vez por dispositivo:
  - al abrir, si no existe `constelacion-migrada-{cieloId}`, se apartan las
    estrellas locales en `constelacion-pendientes-{cieloId}`;
  - cuando entra un miembro, se suben las que no estén en la nube y se marca
    como migrado.

**Contador** (al pie):

- "El cielo está vacío. Empieza por la primera estrella.", o
  "{n} estrella(s) en nuestro cielo".
- Más uno de estos sufijos, según el estado:
  - " · compartido ✦";
  - " · sin conexión, se enviará al volver";
  - " · sin nube, guardado solo en este dispositivo".

### 2.6 Galería mensual

- Una tarjeta por mes, desde el mes de `inicioRelacion` hasta el mes actual.
- **Mes con foto** en `lineaTiempo`: foto impresa, "{Mes} de {año}" y texto.
- **Mes sin foto:** 🖼️ y `textos.timelineEmpty`.
- Las tarjetas se inclinan una a cada lado; la activa va derecha y opaca.
- **Abre centrada en el mes más reciente.**
- **Cómo se recorre:**
  - deslizando;
  - con ‹ › (desactivadas en los extremos; ocultas hasta 640 px);
  - con las teclas ← →;
  - tocando una tarjeta lateral;
  - tocando un mes de la línea.
- La línea se llena hasta el mes activo; hasta 640 px solo se ve el nombre
  del mes activo.

### 2.7 Minijuego

- Símbolos de `juego.parejas` (máximo 8; hoy 6), cada uno dos veces, mezclados.
- Por turno se dan vuelta dos cartas:
  - iguales: quedan arriba;
  - distintas: se tapan a los **750 ms**, y en ese tiempo no se puede tocar
    otra.
- Cada par cuenta 1 movimiento.
- Al completar todas las parejas: mensaje `textos.juegoWin`, 26 corazones y
  "Otra vez" (mezcla de nuevo y pone todo en cero).

### 2.8 Calendario de adviento

Fuente: `adviento` (`src/config/adviento.ts`) y las puertas de
`src/config/puertas.ts`.

```text
anio = 2026
desde = 2026-11-22 00:00   (la página y su enlace en el menú existen desde aquí…)
hasta = 2027-01-01 00:00   (…hasta antes de aquí; desde aquí, la página
                            sigue y se abre desde los Recuerdos de La Bóveda, 2.2)
```

- **24 puertas**, del 1 al 24 de diciembre de `anio`, siempre en ese orden.
  La puerta `d` se abre a las **00:00 del `d` de diciembre**, hora del
  celular, con la misma regla que La Bóveda (`puedeAbrirse`): **nunca antes**.
- Cada puerta es una carta (`Carta` sin `fecha`, más `dia`): `icono`,
  `titulo` (si falta, "Día {d}"), `mensajeSellado`, `foto` y `accion`
  opcionales. Un día que falta en `puertas.ts`, o que está repetido, se ve
  como borrador.
- **Estados:**
  - **cerrada** (antes de su día): número y 🔒; no se toca; su texto no se
    descifra y su foto no se pide.
  - **pronto** (ya es su día, pero es `borrador`): igual que cerrada.
  - **disponible**: color espuma (`--gold`) y con un brillo suave; es un botón.
  - **abierta** (ya se abrió en este celular): su ícono y el número chico; es
    un botón para volver a leerla.
- Al tocarla se abre la ventana de carta (2.2) con su foto (si tiene) y su
  texto; queda guardada como abierta en `adviento-abiertas-{anio}`.
- La puerta de hoy lleva borde caramelo (`--rose`). Aviso arriba de las puertas: antes del
  1 de diciembre, "La primera puerta se abre el {fecha larga} ✨"; del 1 al
  24, "Hoy se abre la puerta {d} 🎁"; después, ninguno.
- Usa el mismo "ahora" que La Bóveda (con la vista previa `?cumple=…`) y
  cambia sola a medianoche.
- Hasta 640 px, 4 puertas por fila; hasta 900 px, 6; más, 8.
- Las puertas se descargan con su página, no en la carga inicial.

### 2.9 Otras reglas

- La franja "Tiempo juntos" (1.1) cuenta años, meses y días completos desde
  `inicioRelacion`.
- La música no suena sola: solo al pulsar su botón (1.2). Si el navegador no
  puede reproducirla, el botón lo avisa con `textos.musicaError`.

---

## 3. Contrato de datos

El contenido está en `src/config/` (`textos.ts`, `meses.ts`, `boveda.ts`,
`cumpleanos.ts`, `general.ts`, `adviento.ts`), unido en `CONFIG` por
`src/config/index.ts`; las puertas del adviento, aparte en `puertas.ts`;
Firebase en `src/config/firebase.ts` (`NUBE`). Las fotos y la canción, en
`public/assets/`. Tipos en `src/types/config.ts`. Las fechas son `"AAAA-MM-DDTHH:MM:SS"` en hora
local.

```ts
interface Config {
  nombres: { novia: string; autor: string };
  fechas: { inicioRelacion: string; regreso: string | null };
  rotacionMina: {
    activa: boolean; salidaBase: string; diasMina: number; diasDescanso: number;
    horaRegreso: "HH:MM"; mesesAMostrar: 1 | 2 | 3 | 4;
  };
  textos: Record<ClaveTexto, string>;          // 214 claves, ver abajo
  lineaTiempo: { mes: "AAAA-MM"; titulo: string; src: string; texto: string }[];
  mensajesMes: Carta[];                         // normalmente un día 8
  musica: { volumenInicial: number; cancion: { titulo: string; artista: string; src: string } };
  boveda: { cartas: Carta[] };
  juego: { parejas: string[] };                 // 1 a 8 emojis
  cumpleanos: {
    activo: boolean; nacimiento: "AAAA-MM-DD"; diasAntes: number; diasDespues: number;
    velas: number;                              // 1 a 9
    carta: Omit<Carta, "fecha">;
    textosHoy: Partial<Record<ClaveTexto, string>>;
  };
  opciones: { corazones: number; calendarioDesdeHoy: boolean; fondoNavidad?: boolean };
  adviento: { anio: number; desde: string; hasta: string };   // las puertas, en puertas.ts
}

interface Carta {
  fecha: string;
  icono?: string;
  titulo?: string;
  mensajeSellado?: string;   // obligatorio salvo que borrador sea true
  mensaje?: string;          // solo texto vacío en borradores; nunca texto plano real
  borrador?: boolean;
  accion?: { destino: IdSeccion; etiqueta: string };
  foto?: string;             // "assets/images/…": se ve al abrirla (puertas del adviento)
}

// src/config/puertas.ts
type PuertaAdviento = Omit<Carta, "fecha"> & { dia: number };   // dia: 1 a 24, sin repetir

interface NubeConfig {
  cieloId: string;           // "nosotros-7f3k9q2m"
  miembros: string[];        // UIDs de Firebase, nunca correos
  firebase: { apiKey; authDomain; projectId; storageBucket; messagingSenderId; appId } | null;
}
```

**Grupos de `textos`** (prefijo: cantidad): nav 7, titulo/seguir 3,
welcome 5, hero 5, letter 7, carta 3, surprise 3, timeline 4, mes 1,
tiempo 9 (título y la franja de arriba), franja 1, label 8, return 2,
countdown 1, calendar 4, legend 5,
roster 16, musica 2, boveda 11 (con los recuerdos), adviento 6,
constelacion 4, juego 8,
cumple 13, final 3. El resto son los textos que antes estaban dentro de los
componentes (accesibilidad, avisos, página del cielo, sesión, errores).

- Las frases pueden contener `{edad}`.
- "unu" y "uwu" son intencionales.

**Firestore** (proyecto `anthuanete-6d629`):

| Ruta | Campos | Lee | Escribe |
|---|---|---|---|
| `cielos/{cieloId}/estrellas/{id}` | `x, y` (número 0–1), `label` (texto ≤ 60), `born` (entero); id ≤ 40 | cualquiera | miembros |
| `parejas/{cieloId}/ajustes/bajadas` | `proximaBajada` "AAAA-MM-DD", `diasMina` y `diasDescanso` (enteros 1–60), `horaRegreso` "HH:MM", `actualizado` (entero) | cualquiera | miembros |

Las reglas viven en `firestore.rules` y se publican a mano en la consola.

**Claves de `localStorage`** (se conservan entre versiones; al cambiar de
dominio empiezan vacías, porque el navegador las guarda por dominio):

- `roster-override-v1`
- `constelacion-nosotros-v1`
- `constelacion-migrada-{cieloId}`
- `constelacion-pendientes-{cieloId}`
- `cumple-velas-AAAA-MM-DD`
- `adviento-abiertas-{anio}` (los días de las puertas ya abiertas, `[1,3]`)

---

## 4. Requisitos no funcionales (criterios de aceptación)

1. **Mobile-first:**
   - a **375 px** no hay desplazamiento horizontal y nada se superpone (el
     menú, la carta abierta, la franja de arriba sobre la sección a la que se
     baja y la barra de secciones sobre el final de la página, en especial);
   - funciona también en tablet (768 px) y escritorio (≥1200 px).
2. **Movimiento reducido:** con `prefers-reduced-motion` no hay confeti ni
   cae la nieve de diciembre, el cielo de adorno y la página del cielo quedan
   quietos (sin vaivén ni titileo) y la galería no anima su desplazamiento.
3. **Accesibilidad:**
   - todos los controles se pueden usar con teclado y tienen foco visible;
   - cada carta abierta de La Bóveda es un botón con el nombre de la carta
     (responde a Enter y Espacio);
   - el sobre se abre tocándolo o con su botón; la carta que lleva adentro
     la pueden leer los lectores de pantalla;
   - la ventana de una carta es un `<dialog>`: mientras está abierta, Tab no
     sale de ella y lo de atrás no se puede tocar; al cerrarla, el foco
     vuelve a donde estaba;
   - la barra de secciones y su panel se usan con teclado; escondida, la
     barra no se alcanza con Tab;
   - al cambiar de página, el foco pasa al contenido de la página nueva y el
     título de la pestaña dice en qué página está; la página actual está
     marcada (`aria-current="page"`) en el panel;
   - los botones solo con ícono tienen `aria-label` (el de la música dice qué
     hace y con qué canción, y marca con `aria-pressed` si está sonando);
   - la franja del tiempo es un botón con `aria-expanded`, y su detalle se
     cierra con Escape.
4. **Privacidad y seguridad:**
   - cero correos en el código o el repo (solo UIDs);
   - las cartas solo en `mensajeSellado`;
   - una carta sellada no se descifra ni aparece antes de su fecha; lo mismo
     las puertas del adviento, cuya foto tampoco se pide antes de su día.
5. **Firebase:** solo el plan **Spark** (Firestore, Authentication con Google,
   Hosting). Prohibido lo que requiera el plan Blaze.
6. **Rendimiento:**
   - Firebase se carga aparte y solo cuando se usa;
   - la carga inicial queda por debajo de ~100 KB comprimidos de JS propio
     y de React;
   - las páginas que no hacen falta al abrir se descargan aparte; unos
     segundos después de abrir el sitio se bajan en segundo plano, para que
     cambiar de página sea inmediato.
7. **Vista previa del link:**
   - `og:image` absoluto a `compartir.jpg` de 1200×630;
   - título y descripción fijos en el HTML;
   - íconos SVG, PNG 32 y `apple-touch-icon` 180.
8. **Idioma y fechas:** todo en español (`es-ES`), con fechas en hora local
   del dispositivo.
9. **Publicación:** solo Firebase Hosting (plan Spark), en la raíz de
   `https://para-anthuanete.web.app/`. `main` siempre publicable.
   - `publicar.yml` ya no publica en GitHub Pages.
   - Los links viejos llevan a la misma página, con su `?…` y su `#…`, en el
     link nuevo: el sitio que Firebase le da al proyecto
     (`anthuanete-6d629.web.app`, con un 301) y, mientras GitHub Pages siga
     encendido, el de GitHub Pages (`/Proyect.github.io/…`), con la página
     que quedó publicada el 20-11-2026.
   - Las rutas de las páginas y las rutas viejas (1.1) sirven `index.html`
     (`rewrites` de `firebase.json`, con o sin `/` al final); cualquier otra
     ruta sin archivo da 404. Un test revisa que las rutas de `firebase.json`
     sean justo esas.
   - El HTML no se guarda en la caché del navegador (tampoco el de las rutas
     de las páginas); los `.js` y `.css` con hash, un año; las fotos y la
     canción, un día.
10. **Calidad:** `typecheck`, `lint` (sin ningún aviso), los tests y
    `build` sin errores antes de cada push a `main` (todo se trabaja directo
    en `main` desde el 24-11-2026; `publicar.yml` los vuelve a correr antes
    de publicar).
11. **Robustez:**
    - si una página falla al mostrarse (o no se pudo descargar), en su lugar
      se ve `textos.errorPagina` con un botón para recargar, y la barra de
      secciones sigue funcionando; si falla una parte de la portada, se
      pierde solo esa parte; si falla el sitio entero, se ve
      `textos.errorPagina` con un botón para recargar;
    - lo que depende del día (mensaje del mes, foto del mes nuevo) se
      actualiza solo al pasar la medianoche, sin recargar;
    - si el estado del cumpleaños cambia con la página abierta, la página se
      recarga (sus textos, su carta y sus adornos se arman al cargar);
    - sin conexión a Firebase, la sesión y lo compartido siguen funcionando
      solo en el dispositivo.
12. **Colores y letras (1.6):**
    - sin nada en el link, cada página se ve igual que la vista previa café
      que se aprobó (los mismos estilos calculados que `?tema=cafe` el
      24-11-2026): a 375 px no queda nada del rosa ni del morado, todo el
      texto va en Nunito y se lee bien sobre su fondo;
    - con `?tema=rosa`, cada página se ve igual que el sitio rosa de antes
      del café (los mismos estilos calculados) y no descarga Nunito.
