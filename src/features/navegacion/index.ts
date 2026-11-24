export { default as BarraSecciones } from "./BarraSecciones.tsx";
export { default as EnlacePagina } from "./EnlacePagina.tsx";
export { default as SiguientePagina } from "./SiguientePagina.tsx";
export {
  destinoDeSeccion,
  enlacesVisibles,
  INICIO,
  paginasDeHoy,
  rutaDeSeccion,
  siguienteDe,
  type Destino,
  type Enlace,
  type EnlacesVisibles,
  type IdPagina,
  type PaginasDeHoy
} from "./enlaces.ts";
export { corregirLink, llegoPorLinkDirecto, navegar } from "./historial.ts";
export { useCambioDePagina } from "./useCambioDePagina.ts";
export { useRuta } from "./useRuta.ts";
