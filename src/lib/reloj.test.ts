import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { crearReloj } from "./reloj.ts";
import { rellenar } from "./rellenar.ts";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("crearReloj", () => {
  it("avanza una vez por segundo mientras alguien escucha, y se apaga después", () => {
    vi.setSystemTime(new Date("2026-11-12T10:00:00"));
    const reloj = crearReloj();
    const aviso = vi.fn();
    const salir = reloj.suscribir(aviso);
    vi.advanceTimersByTime(3000);
    expect(aviso).toHaveBeenCalledTimes(1 + 3); // al suscribirse se pone al día, y 3 segundos
    expect(reloj.actual()).toEqual(new Date("2026-11-12T10:00:03"));
    salir();
    vi.advanceTimersByTime(5000);
    expect(aviso).toHaveBeenCalledTimes(4);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("un solo temporizador aunque escuchen varios", () => {
    const reloj = crearReloj();
    const a = reloj.suscribir(() => {});
    const b = reloj.suscribir(() => {});
    expect(vi.getTimerCount()).toBe(1);
    a();
    expect(vi.getTimerCount()).toBe(1);
    b();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("delDia es el mismo objeto todo el día y cambia al pasar la medianoche", () => {
    vi.setSystemTime(new Date("2026-12-07T23:59:58"));
    const reloj = crearReloj();
    const salir = reloj.suscribir(() => {});
    const antes = reloj.delDia();
    vi.advanceTimersByTime(1000);
    expect(reloj.delDia()).toBe(antes); // 23:59:59: mismo día, mismo objeto
    vi.advanceTimersByTime(1000);
    expect(reloj.delDia()).not.toBe(antes); // 00:00:00 del 8 de diciembre
    expect(reloj.delDia().getDate()).toBe(8);
    salir();
  });

  it("respeta otra fuente de hora (la vista previa del cumpleaños)", () => {
    vi.setSystemTime(new Date("2026-11-12T10:00:00"));
    const reloj = crearReloj(() => new Date(Date.now() + 24 * 3600000));
    reloj.suscribir(() => {})();
    expect(reloj.actual()).toEqual(new Date("2026-11-13T10:00:00"));
  });
});

describe("rellenar", () => {
  it("cambia cada {clave} por su valor", () => {
    expect(rellenar("Faltan {tiempo}", { tiempo: "3 d" })).toBe("Faltan 3 d");
    expect(rellenar("{n} estrellas en nuestro cielo", { n: 5 })).toBe("5 estrellas en nuestro cielo");
  });

  it("deja las {claves} que no tienen valor (como {edad})", () => {
    expect(rellenar("Cumples {edad} el {fecha}", { fecha: "11 de octubre" })).toBe("Cumples {edad} el 11 de octubre");
  });
});
