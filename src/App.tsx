import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Bienvenida, Inicio } from "./features/inicio/index.ts";
import {
  BarraSecciones,
  enlacesVisibles,
  INICIO,
  navegar,
  SiguientePagina,
  siguienteDe,
  useCambioDePagina,
  useRuta,
  type IdPagina
} from "./features/navegacion/index.ts";
import { Boveda, ProveedorVentanaCarta } from "./features/boveda/index.ts";
import { Cierre } from "./features/cierre/index.ts";
import { Fondo, LimiteDeError, PaginaConError, ProgresoScroll } from "./components/ui/index.ts";
import { MensajeDelMes, mensajeMesVigente } from "./features/mensaje-mes/index.ts";
import {
  Adviento,
  Bajadas,
  CartaSorpresa,
  Constelacion,
  Cumpleanos,
  Galeria,
  Minijuego,
  Musica,
  precargarPaginas,
  TiempoJuntos
} from "./paginas.ts";
import { advientoVisible } from "./lib/adviento.ts";
import { celebrar } from "./lib/confeti.ts";
import { NOMBRES, TEXTOS } from "./lib/contenido.ts";
import { rellenar } from "./lib/rellenar.ts";
import { useDia } from "./hooks/useAhora.ts";
import { useRecargarSiCambia } from "./hooks/useRecargarSiCambia.ts";
import { ocurrenciaEn, RELOJ_CUMPLE } from "./lib/cumple.ts";

// Las demás páginas se bajan en segundo plano cuando la primera ya se ve.
const ESPERA_PRECARGA_MS = 2000;

/*
  EL SITIO
  Una sola página HTML con varias páginas adentro: la portada en "/" y una
  por sección (/carta, /meses…, la lista está en features/navegacion/enlaces.ts).
  Cada sección vive en su carpeta de src/features.
*/
export default function App() {
  // Dependen del día: si la página queda abierta, cambian a medianoche
  // (por ejemplo, el mensaje del mes aparece solo el día 8).
  const dia = useDia(RELOJ_CUMPLE);
  const nota = useMemo(() => mensajeMesVigente(undefined, dia), [dia]);
  const cumple = useMemo(() => ocurrenciaEn(dia), [dia]);
  const estadoCumple = cumple?.estado ?? null;

  // Los textos, la carta y los adornos del cumpleaños se arman al cargar la
  // página: si su estado cambia con la página abierta, se recarga.
  useRecargarSiCambia(estadoCumple);

  const hayNota = nota !== null;
  const hayAdviento = advientoVisible(dia);
  const enlaces = useMemo(
    () => enlacesVisibles({ mes: hayNota, adviento: hayAdviento, cumple: estadoCumple }),
    [hayNota, hayAdviento, estadoCumple]
  );

  const ruta = useRuta();
  const pagina = enlaces.find((enlace) => enlace.ruta === ruta) ?? null;
  // Una ruta que hoy no tiene página (el mensaje del mes ya pasó) lleva a la portada.
  useEffect(() => {
    if (ruta !== INICIO && !pagina) navegar(INICIO, true);
  }, [ruta, pagina]);

  const contenido = useRef<HTMLElement>(null);
  const titulo = pagina
    ? rellenar(TEXTOS.tituloPagina, { pagina: pagina.texto, novia: NOMBRES.novia })
    : rellenar(TEXTOS.tituloInicio, { novia: NOMBRES.novia, autor: NOMBRES.autor });
  useCambioDePagina(ruta, titulo, contenido);

  useEffect(() => {
    const espera = setTimeout(precargarPaginas, ESPERA_PRECARGA_MS);
    return () => clearTimeout(espera);
  }, []);

  // La bienvenida sale una vez, solo si se abre el sitio por la portada: un
  // link directo a una página entra directo.
  const [conBienvenida] = useState(ruta === INICIO);
  // El día del cumpleaños, al entrar hay confeti.
  const alEntrar = () => {
    if (estadoCumple === "hoy") setTimeout(celebrar, 300);
  };

  const secciones: Record<IdPagina, ReactNode> = {
    "mensaje-mes": nota && <MensajeDelMes nota={nota} />,
    adviento: <Adviento />,
    carta: <CartaSorpresa />,
    "linea-tiempo": <Galeria />,
    tiempo: <TiempoJuntos />,
    calendario: <Bajadas />,
    musica: <Musica />,
    cumple: cumple && <Cumpleanos ocurrencia={cumple} />,
    boveda: <Boveda />,
    constelacion: <Constelacion />,
    juego: <Minijuego />
  };

  // Una sola ventana de carta para La Bóveda y el pastel (ver features/boveda/ventanaCarta.ts).
  // Cada parte va dentro de un LimiteDeError: si una falla, lo demás se sigue viendo.
  return (
    <ProveedorVentanaCarta>
      <ProgresoScroll />
      <Fondo />
      {conBienvenida && (
        <LimiteDeError nombre="bienvenida">
          <Bienvenida onEntrar={alEntrar} />
        </LimiteDeError>
      )}
      {/* tabIndex -1: al cambiar de página recibe el foco (useCambioDePagina). */}
      <main ref={contenido} className="app-shell" tabIndex={-1}>
        {pagina ? (
          // key: cada página empieza de cero (y un error en una no sigue en la otra).
          <LimiteDeError key={pagina.id} nombre={pagina.texto} respaldo={<PaginaConError soloTarjeta />}>
            <Suspense fallback={null}>{secciones[pagina.id]}</Suspense>
            <SiguientePagina siguiente={siguienteDe(enlaces, pagina)} />
          </LimiteDeError>
        ) : (
          <>
            <LimiteDeError nombre="inicio">
              <Inicio enlaces={enlaces} />
            </LimiteDeError>
            <LimiteDeError nombre="cierre">
              <Cierre />
            </LimiteDeError>
          </>
        )}
      </main>
      <LimiteDeError nombre="barra de secciones">
        <BarraSecciones enlaces={enlaces} actual={pagina} />
      </LimiteDeError>
    </ProveedorVentanaCarta>
  );
}
