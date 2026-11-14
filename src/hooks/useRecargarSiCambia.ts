import { useEffect, useState } from "react";

const recargarPagina = () => window.location.reload();

/**
 * Recarga la página si "valor" cambia mientras está abierta.
 *
 * Para lo que se arma una sola vez al cargar. Por ejemplo, los textos, la
 * carta y los adornos del cumpleaños: si su estado cambia a medianoche con la
 * página abierta, se recarga y así nunca queda a medias.
 */
export function useRecargarSiCambia(valor: unknown, recargar: () => void = recargarPagina): void {
  const [alCargar] = useState(valor);
  useEffect(() => {
    if (!Object.is(valor, alCargar)) recargar();
  }, [valor, alCargar, recargar]);
}
