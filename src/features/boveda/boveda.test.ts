import { describe, expect, it } from "vitest";
import { matasellos } from "./boveda.ts";

describe("matasellos (el sello con la fecha en el sobre)", () => {
  it("da el día y el mes en tres letras, y el año aparte", () => {
    expect(matasellos(new Date(2026, 2, 8))).toEqual({ diaMes: "8 MAR", anio: "2026" });
    expect(matasellos(new Date(2026, 9, 11))).toEqual({ diaMes: "11 OCT", anio: "2026" });
  });

  it("septiembre queda en tres letras aunque el navegador lo abrevie distinto", () => {
    expect(matasellos(new Date(2026, 8, 8)).diaMes).toBe("8 SEP");
  });
});
