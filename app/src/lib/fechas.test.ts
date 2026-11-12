import { describe, expect, it } from "vitest";
import {
  claveDia,
  claveMes,
  diasCalendario,
  fechaSinAnio,
  mesesDesde,
  mesesEntre,
  nombreMes,
  partirCuenta,
  sumarDias,
  tiempoEntre
} from "./fechas.ts";

const INICIO = new Date("2026-03-08T00:00:00");

describe("mesesEntre", () => {
  it("cuenta meses completos desde el 8 de marzo", () => {
    expect(mesesEntre(INICIO, new Date("2026-11-08T00:00:00"))).toBe(8);
    expect(mesesEntre(INICIO, new Date("2026-11-07T23:00:00"))).toBe(7);
    expect(mesesEntre(INICIO, new Date("2026-01-01T00:00:00"))).toBe(0);
  });
});

describe("tiempoEntre", () => {
  it("años, meses, días y total de días juntos", () => {
    expect(tiempoEntre(INICIO, new Date("2026-11-12T00:00:00"))).toEqual({
      years: 0,
      months: 8,
      days: 4,
      totalDays: 249
    });
  });

  it("al cumplir un año", () => {
    expect(tiempoEntre(INICIO, new Date("2027-03-08T00:00:00"))).toMatchObject({ years: 1, months: 0, days: 0 });
  });
});

describe("claves y nombres", () => {
  it("claveDia y claveMes", () => {
    expect(claveDia(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(claveMes(new Date(2026, 10, 12))).toBe("2026-11");
  });

  it("mesesDesde incluye el mes de inicio y el actual", () => {
    const meses = mesesDesde(INICIO, new Date("2026-11-12T00:00:00"));
    expect(meses).toHaveLength(9);
    expect(meses[0]).toBe("2026-03");
    expect(meses.at(-1)).toBe("2026-11");
  });

  it("nombres en español", () => {
    expect(nombreMes("2026-11")).toBe("Noviembre de 2026");
    expect(fechaSinAnio(new Date(2026, 10, 12))).toBe("jueves, 12 de noviembre");
  });
});

describe("días y cuenta regresiva", () => {
  it("diasCalendario no depende de la hora", () => {
    expect(diasCalendario(new Date("2026-11-12T23:00:00"), new Date("2026-11-13T01:00:00"))).toBe(1);
    expect(diasCalendario(new Date("2026-11-13T00:00:00"), new Date("2026-11-12T00:00:00"))).toBe(-1);
  });

  it("sumarDias cruza meses", () => {
    expect(claveDia(sumarDias(new Date(2026, 9, 29), 14))).toBe("2026-11-12");
  });

  it("partirCuenta separa días, horas, minutos y segundos, y no baja de cero", () => {
    const desde = new Date("2026-11-12T10:00:00");
    expect(partirCuenta(new Date("2026-11-13T21:30:15"), desde)).toEqual({ days: 1, hours: 11, minutes: 30, seconds: 15 });
    expect(partirCuenta(desde, new Date("2026-11-13T00:00:00"))).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});
