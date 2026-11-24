import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Bienvenida, Inicio } from "./features/inicio/index.ts";
import {
  BarraSecciones,
  llegoPorLinkDirecto,
  INICIO,
  navegar,
  paginasDeHoy,
  SiguientePagina,
  siguienteDe,
  useCambioDePagina,
  useRuta,
  type IdPagina
} from "./features/navegacion/index.ts";
import { Boveda, ProveedorVentanaCarta, type Recuerdo } from "./features/boveda/index.ts";
import { CartaSorpresa } from "./features/carta/index.ts";
import { Cierre } from "./features/cierre/index.ts";
import { ProveedorMusica } from "./features/musica/index.ts";
import { FranjaTiempo } from "./features/tiempo/index.ts";
import { Fondo, LimiteDeError, PaginaConError, ProgresoScroll } from "./components/ui/index.ts";
import { MensajeDelMes, mensajeMesVigente } from "./features/mensaje-mes/index.ts";
import { Adviento, Bajadas, Cumpleanos, Entretenimiento, Galeria, precargarPaginas } from "./paginas.ts";
import { estadoAdviento } from "./lib/adviento.ts";
import { celebrar } from "./lib/confeti.ts";
import { CONFIG, NOMBRES, TEXTOS } from "./lib/contenido.ts";
import { rellenar } from "./lib/rellenar.ts";
import { useDia } from "./hooks/useAhora.ts";
import { useRecargarSiCambia } from "./hooks/useRecargarSiCambia.ts";
import { ocurrenciaEn, RELOJ_CUMPLE } from "./lib/cumple.ts";

// Las demás páginas se bajan en segundo plano cuando la primera ya se ve.
const ESPERA_PRECARGA_MS = 2000;

/*
  EL SITIO
  Una sola página HTML con varias páginas adentro: la portada en "/" (con el
  mensaje del mes y la carta) y una por sección (/meses, /boveda…, la lista
  está en features/navegacion/enlaces.ts). Arriba, siempre, la franja del
  tiempo juntos; abajo, la barra de secciones con la música.
  Cada sección vive en su carpeta de src/features.
*/
export default function App() {
  // Dependen del día: si la página queda abierta, cambian a medianoche
  // (por ejemplo, el mensaje del mes aparece solo el día 8).
  const dia = useDia(RELOJ_CUMPLE);
  const nota = useMemo(() => mensajeMesVigente(undefined, dia), [dia]);
  const cumple = useMemo(() => ocurrenciaEn(dia), [dia]);
  const estadoCumple = cumple?.estado ?? null;
  const adviento = estadoAdviento(dia);

  // Los textos, la carta y los adornos del cumpleaños se arman al cargar la
  // página: si su estado cambia con la página abierta, se recarga.
  useRecargarSiCambia(estadoCumple);

  const { menu, todas } = useMemo(() => paginasDeHoy({ adviento, cumple: estadoCumple }), [adviento, estadoCumple]);

  // Lo que ya pasó queda de recuerdo en La Bóveda, con un link a su página.
  const recuerdos = useMemo(() => {
    const lista: Recuerdo[] = [];
    if (cumple?.estado === "despues") {
      lista.push({
        id: "cumple",
        icono: "🎂",
        titulo: rellenar(TEXTOS.bovedaRecuerdoCumple, { edad: cumple.edad }),
        detalle: TEXTOS.bovedaRecuerdoCumpleDetalle,
        ruta: "/cumple"
      });
    }
    if (adviento === "pasado") {
      lista.push({
        id: "adviento",
        icono: "🎄",
        titulo: rellenar(TEXTOS.bovedaRecuerdoAdviento, { anio: CONFIG.adviento?.anio ?? "" }),
        detalle: TEXTOS.bovedaRecuerdoAdvientoDetalle,
        ruta: "/adviento"
      });
    }
    return lista;
  }, [cumple, adviento]);

  const ruta = useRuta();
  const pagina = todas.find((enlace) => enlace.ruta === ruta) ?? null;
  // Una ruta que hoy no tiene página (el cumpleaños ya pasó) lleva a la portada.
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
  // link directo a una página (o a una sección, como /carta) entra directo.
  const [conBienvenida] = useState(ruta === INICIO && !llegoPorLinkDirecto());
  // El día del cumpleaños, al entrar hay confeti.
  const alEntrar = () => {
    if (estadoCumple === "hoy") setTimeout(celebrar, 300);
  };

  const secciones: Record<IdPagina, ReactNode> = {
    adviento: <Adviento />,
    "linea-tiempo": <Galeria />,
    calendario: <Bajadas />,
    cumple: cumple && <Cumpleanos ocurrencia={cumple} />,
    boveda: <Boveda recuerdos={recuerdos} />,
    entretenimiento: <Entretenimiento />
  };

  // Una sola ventana de carta para La Bóveda, el adviento y el pastel (ver
  // features/boveda/ventanaCarta.ts) y una sola canción para todo el sitio.
  // Cada parte va dentro de un LimiteDeError: si una falla, lo demás se sigue viendo.
  return (
    <ProveedorMusica>
      <ProveedorVentanaCarta>
        <ProgresoScroll />
        <Fondo />
        {conBienvenida && (
          <LimiteDeError nombre="bienvenida">
            <Bienvenida onEntrar={alEntrar} />
          </LimiteDeError>
        )}
        <LimiteDeError nombre="tiempo juntos">
          <FranjaTiempo />
        </LimiteDeError>
        {/* tabIndex -1: al cambiar de página recibe el foco (useCambioDePagina). */}
        <main ref={contenido} className="app-shell" tabIndex={-1}>
          {pagina ? (
            // key: cada página empieza de cero (y un error en una no sigue en la otra).
            <LimiteDeError key={pagina.id} nombre={pagina.texto} respaldo={<PaginaConError soloTarjeta />}>
              <Suspense fallback={null}>{secciones[pagina.id]}</Suspense>
              {/* Una página que no está en el menú (un recuerdo) se abrió desde La Bóveda: vuelve ahí. */}
              <SiguientePagina
                siguiente={
                  menu.some((enlace) => enlace.id === pagina.id)
                    ? siguienteDe(menu, pagina)
                    : (menu.find((enlace) => enlace.id === "boveda") ?? null)
                }
              />
            </LimiteDeError>
          ) : (
            <>
              <LimiteDeError nombre="inicio">
                <Inicio enlaces={menu} />
              </LimiteDeError>
              {nota && (
                <LimiteDeError nombre="mensaje del mes">
                  <MensajeDelMes nota={nota} />
                </LimiteDeError>
              )}
              <LimiteDeError nombre="carta">
                <CartaSorpresa />
              </LimiteDeError>
              <LimiteDeError nombre="cierre">
                <Cierre />
              </LimiteDeError>
            </>
          )}
        </main>
        <LimiteDeError nombre="barra de secciones">
          <BarraSecciones enlaces={menu} actual={pagina} />
        </LimiteDeError>
      </ProveedorVentanaCarta>
    </ProveedorMusica>
  );
}
