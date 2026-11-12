# SPEC.md: Contrato de la aplicación

Versión 1 (noviembre de 2026). Describe el comportamiento que el sitio debe
conservar en cualquier refactorización. Cambiarlo requiere la aprobación de
Jorge.

Todas las fechas y horas se calculan con el **reloj del dispositivo que abre
la página** (hora local; hoy Perú, UTC−5).

---

## 1. Páginas, vistas y secciones

### 1.1 Página principal (`/`)

Capas fijas, siempre presentes:

- **Barra de progreso** arriba: se llena según cuánto se bajó en la página.
- **Fondo**: tres luces (rosa, lila, dorada) y `opciones.corazones` (18)
  corazones que flotan (♡ ❤). El día del cumpleaños son 🎈 ✨ ❤ 🎉 ♡.
- **Bienvenida**: pantalla encima de todo con etiqueta, título, texto, botón
  "Entrar a la carta" y nota. Al pulsar se oculta. El día del cumpleaños
  usa `cumpleanos.textosHoy` y lanza confeti a los 300 ms.
- **Ventana de carta** (modal): la abren La Bóveda y el pastel (ver 2.2).

Secciones, en este orden:

| # | id | Sección | Condición | Elementos |
|---|---|---|---|---|
| 0 | `inicio` | Portada | siempre | Menú (1.2); etiqueta, título y texto; botones "Abrir mi carta" (→ `#carta`) y segundo botón (→ `#boveda`, o `#cumple` el día del cumpleaños); sobre con carta (1.3) |
| 1 | `mensaje-mes` | Mensaje del mes | solo si hay uno vigente (2.3) | Hoja de papel: fecha larga, título ("Ocho meses"), párrafos, firma |
| 1′ | `cumple` | Cumpleaños | **solo el día del cumpleaños**: va aquí, antes de Carta | ver 2.4 |
| 2 | `carta` | Carta | siempre | Cabecera; botón "Ver mensaje sorpresa 💗" / "Ocultar mensaje 💌" que muestra u oculta `textos.surpriseMessage` |
| 3 | `linea-tiempo` | Galería mensual | siempre | Una foto por mes (2.6), flechas ‹ ›, línea de meses |
| 4 | `tiempo` | Tiempo juntos | siempre | 4 contadores: años, meses, días, días en total (cada segundo). Tarjeta de regreso solo si la rotación está desactivada y `fechas.regreso` es válida |
| 5 | `calendario` | Bajada (14×7) | si la rotación está activa | Leyenda, estado actual con cuenta regresiva, barra (‹ mes › y "Hoy"), mes(es) del calendario, panel "Ajustar bajadas de mina" (2.1) |
| 6 | `musica` | Música | si `musica.cancion.src` existe | Título, artista, botón Reproducir/Pausar, control de volumen (inicial `0.24`) |
| 7 | `boveda` | La Bóveda | siempre | Tarjetas de cartas selladas o abiertas (2.2) |
| 8 | `cumple` | Cumpleaños | estados `antes` o `despues` (en `hoy` va en 1′) | ver 2.4 |
| 9 | `constelacion` | Constelación | siempre | Cielo animado de adorno y botón "Abrir nuestra constelación ✦" → `constelacion/index.html` |
| 10 | `juego` | Minijuego | siempre | Movimientos, parejas `n/6`, "Reiniciar", tablero, mensaje de victoria con "Otra vez" (2.7) |
| 11 | `final` | Cierre | siempre | Etiqueta, frase final, firma |

Las secciones aparecen suavemente la primera vez que entran en pantalla.

### 1.2 Menú

- Marca "Para {novia}" (→ `#inicio`) y estos enlaces, en orden:
  Este mes*, Carta, Meses, Tiempo, Bajada, Música, Cumpleaños*, La Bóveda,
  Constelación, Juego.
  - *"Este mes" solo con un mensaje del mes vigente.
  - *"Cumpleaños" solo en los estados `hoy` y `despues`.
- Hasta **1200 px** de ancho: botón "☰ Menú" que abre un panel de dos
  columnas sobre la portada. Se cierra al elegir una opción, al tocar fuera
  o con Escape (y el foco vuelve al botón). Abierto, el ícono es ✕.
- Más de 1200 px: botones en una fila.

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

**Estados:**

- **Sellada** (`fecha > ahora`): 🔒, "Carta sellada", "Se abre el {fecha
  larga}", "Faltan {a} {m} {d}". No se puede abrir y **su texto no se
  descifra ni aparece en la página**.
- **Abierta**: ícono, título, los primeros 90 caracteres (+ "…") y
  "Desbloqueada el {fecha}". Al tocarla (o con Enter o Espacio) se abre la
  ventana.

Se revisa cada **60 s** por si una carta se desbloquea con la página abierta.

**Ventana de carta:** ícono, fecha, título y texto completo. Si la carta
tiene `accion`, muestra el botón, que cierra la ventana y lleva a
`#{destino}`.

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
| `antes` | 🎁 + etiqueta + cuenta regresiva (cada segundo). Al llegar a `C` la página se recarga. La carta aparece **sellada** en La Bóveda. Sin enlace en el menú. |
| `hoy` | `body.is-birthday`; `textosHoy` reemplaza esas claves; globos en el fondo; confeti al entrar; la sección va antes de Carta; el segundo botón de la portada → `#cumple`; pastel. |
| `despues` | Sección de recuerdo con pastel; se pueden volver a encender las velas. |

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
  rosa → lila.
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

### 2.8 Otras reglas

- La tarjeta "Tiempo juntos" cuenta años, meses y días completos desde
  `inicioRelacion`.
- La música no suena sola: solo al pulsar. Si el navegador no puede
  reproducirla, se muestra el aviso en lugar del artista.

---

## 3. Contrato de datos

El contenido está en `src/config/` (`textos.ts`, `meses.ts`, `boveda.ts`,
`cumpleanos.ts`, `general.ts`), unido en `CONFIG` por `src/config/index.ts`;
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
  textos: Record<ClaveTexto, string>;          // 119 claves, ver abajo
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
  opciones: { corazones: number; calendarioDesdeHoy: boolean };
}

interface Carta {
  fecha: string;
  icono?: string;
  titulo?: string;
  mensajeSellado?: string;   // obligatorio salvo que borrador sea true
  mensaje?: string;          // solo texto vacío en borradores; nunca texto plano real
  borrador?: boolean;
  accion?: { destino: IdSeccion; etiqueta: string };
}

interface NubeConfig {
  cieloId: string;           // "nosotros-7f3k9q2m"
  miembros: string[];        // UIDs de Firebase, nunca correos
  firebase: { apiKey; authDomain; projectId; storageBucket; messagingSenderId; appId } | null;
}
```

**Grupos de `textos`** (prefijo: cantidad): nav 10, welcome 5, hero 5,
letter 7, carta 3, surprise 3, timeline 4, mes 1, tiempo/time 3, label 8,
return 2, countdown 1, calendar 4, legend 5, roster 16, musica/music 7,
boveda 7, constelacion 4, juego 8, cumple 13, final 3.

- Las frases pueden contener `{edad}`.
- "unu" y "uwu" son intencionales.

**Firestore** (proyecto `anthuanete-6d629`):

| Ruta | Campos | Lee | Escribe |
|---|---|---|---|
| `cielos/{cieloId}/estrellas/{id}` | `x, y` (número 0–1), `label` (texto ≤ 60), `born` (entero); id ≤ 40 | cualquiera | miembros |
| `parejas/{cieloId}/ajustes/bajadas` | `proximaBajada` "AAAA-MM-DD", `diasMina` y `diasDescanso` (enteros 1–60), `horaRegreso` "HH:MM", `actualizado` (entero) | cualquiera | miembros |

Las reglas viven en `firestore.rules` y se publican a mano en la consola.

**Claves de `localStorage`** (se conservan entre versiones):

- `roster-override-v1`
- `constelacion-nosotros-v1`
- `constelacion-migrada-{cieloId}`
- `constelacion-pendientes-{cieloId}`
- `cumple-velas-AAAA-MM-DD`

---

## 4. Requisitos no funcionales (criterios de aceptación)

1. **Mobile-first:**
   - a **375 px** no hay desplazamiento horizontal y nada se superpone (el
     menú y la carta abierta, en especial);
   - funciona también en tablet (768 px) y escritorio (≥1200 px).
2. **Movimiento reducido:** con `prefers-reduced-motion` no hay confeti, el
   cielo de adorno queda quieto y la galería no anima su desplazamiento.
3. **Accesibilidad:**
   - todos los controles se pueden usar con teclado y tienen foco visible;
   - las cartas abiertas y el sobre responden a Enter y Espacio;
   - los botones solo con ícono tienen `aria-label`.
4. **Privacidad y seguridad:**
   - cero correos en el código o el repo (solo UIDs);
   - las cartas solo en `mensajeSellado`;
   - una carta sellada no se descifra ni aparece antes de su fecha.
5. **Firebase:** solo el plan **Spark** (Firestore, Authentication con Google,
   Hosting). Prohibido lo que requiera el plan Blaze.
6. **Rendimiento:**
   - Firebase se carga aparte y solo cuando se usa;
   - la carga inicial queda por debajo de ~100 KB comprimidos de JS propio
     y de React.
7. **Vista previa del link:**
   - `og:image` absoluto a `compartir.jpg` de 1200×630;
   - título y descripción fijos en el HTML;
   - íconos SVG, PNG 32 y `apple-touch-icon` 180.
8. **Idioma y fechas:** todo en español (`es-ES`), con fechas en hora local
   del dispositivo.
9. **Publicación:** GitHub Pages en `/Proyect.github.io/`. `main` siempre
   publicable.
10. **Calidad:** `typecheck`, `lint`, los tests y `build` sin errores antes
    de cada merge.
11. **Robustez:**
    - si una sección falla al mostrarse, desaparece solo esa y el resto de la
      página sigue funcionando; si falla la página entera, se ve
      `textos.errorPagina` con un botón para recargar;
    - lo que depende del día (mensaje del mes, cumpleaños, foto del mes nuevo)
      se actualiza solo al pasar la medianoche, sin recargar;
    - sin conexión a Firebase, la sesión y lo compartido siguen funcionando
      solo en el dispositivo.
