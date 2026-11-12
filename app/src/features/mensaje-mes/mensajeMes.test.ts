import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Carta } from "../../types/config.ts";
import { mensajeMesVigente } from "./mensajeMes.ts";

const nota = (fecha: string, extra: Partial<Carta> = {}): Carta =>
  ({ fecha, titulo: fecha, mensajeSellado: "v1.a.b.c", ...extra }) as Carta;

const LISTA = [
  nota("2026-10-08T00:00:00"),
  nota("2026-11-08T00:00:00"),
  nota("2026-12-08T00:00:00", { borrador: true })
];

const en = (fecha: string) => vi.setSystemTime(new Date(fecha));

beforeEach(() => vi.useFakeTimers({ toFake: ["Date"] }));
afterEach(() => vi.useRealTimers());

describe("mensajeMesVigente", () => {
  it("muestra el último cuya fecha ya llegó", () => {
    en("2026-11-12T10:00:00");
    expect(mensajeMesVigente(LISTA)?.fecha).toBe("2026-11-08T00:00:00");
  });

  it("el día anterior al mesiversario sigue el del mes pasado", () => {
    en("2026-11-07T23:00:00");
    expect(mensajeMesVigente(LISTA)?.fecha).toBe("2026-10-08T00:00:00");
  });

  it("un mes después deja de verse y los borradores no cuentan", () => {
    en("2026-12-08T10:00:00");
    expect(mensajeMesVigente(LISTA)).toBeNull();
  });

  it("antes del primero no hay mensaje", () => {
    en("2026-09-01T10:00:00");
    expect(mensajeMesVigente(LISTA)).toBeNull();
  });

  it("ignora mensajes sin texto ni sello", () => {
    en("2026-11-12T10:00:00");
    expect(mensajeMesVigente([nota("2026-11-08T00:00:00", { mensajeSellado: undefined })])).toBeNull();
  });
});
