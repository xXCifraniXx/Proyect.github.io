export { default as BarraSecciones } from "./BarraSecciones.tsx";
export { default as EnlacePagina } from "./EnlacePagina.tsx";
export { default as SiguientePagina } from "./SiguientePagina.tsx";
export {
  enlacesVisibles,
  INICIO,
  rutaDeSeccion,
  siguienteDe,
  type Enlace,
  type EnlacesVisibles,
  type IdPagina
} from "./enlaces.ts";
export { corregirLink, navegar } from "./historial.ts";
export { useCambioDePagina } from "./useCambioDePagina.ts";
export { useRuta } from "./useRuta.ts";
