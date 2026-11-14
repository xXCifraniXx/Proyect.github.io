import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { crearReloj } from "../lib/reloj.ts";
import { useAhora, useDia } from "./useAhora.ts";
import { useRecargarSiCambia } from "./useRecargarSiCambia.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useRecargarSiCambia", () => {
  // Igual que la página: App sigue el día y la cuenta regresiva, el segundo.
  // Al llegar el cumpleaños, App deja de mostrar la cuenta en el mismo
  // instante, así que la recarga tiene que salir de App.
  it("recarga una sola vez cuando el estado cambia a medianoche", () => {
    vi.setSystemTime(new Date("2027-10-10T23:59:58"));
    const reloj = crearReloj();
    const cumple = new Date("2027-10-11T00:00:00");
    const recargar = vi.fn();

    function Cuenta() {
      const ahora = useAhora(reloj);
      return <p>{Math.round((cumple.getTime() - ahora.getTime()) / 1000)}</p>;
    }
    function Pagina() {
      const dia = useDia(reloj);
      const estado = dia < cumple ? "antes" : "hoy";
      useRecargarSiCambia(estado, recargar);
      return estado === "antes" ? <Cuenta /> : <p>pastel</p>;
    }

    const caja = document.createElement("div");
    const raiz = createRoot(caja);
    act(() => raiz.render(<Pagina />));
    act(() => vi.advanceTimersByTime(1000)); // 23:59:59
    expect(recargar).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1000)); // 00:00:00 del cumpleaños
    expect(recargar).toHaveBeenCalledTimes(1);
    act(() => raiz.unmount());
  });

  it("no recarga mientras el valor sigue igual", () => {
    const recargar = vi.fn();
    function Pagina({ valor }: { valor: string }) {
      useRecargarSiCambia(valor, recargar);
      return null;
    }
    const raiz = createRoot(document.createElement("div"));
    act(() => raiz.render(<Pagina valor="antes" />));
    act(() => raiz.render(<Pagina valor="antes" />));
    expect(recargar).not.toHaveBeenCalled();
    act(() => raiz.unmount());
  });
});
