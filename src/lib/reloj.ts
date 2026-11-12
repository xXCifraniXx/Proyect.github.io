/*
  RELOJ COMPARTIDO
  ----------------
  Un solo temporizador por reloj, sin importar cuántas secciones lo usen
  (antes cada sección tenía el suyo). Se apaga cuando nadie lo escucha.

  Da dos valores:
    - actual:  la hora, una vez por segundo;
    - delDia:  la fecha, que solo cambia al pasar la medianoche. Sirve para
               lo que depende del día (mensaje del mes, galería), así esas
               partes no se vuelven a dibujar cada segundo.

  Lo usan los hooks useAhora y useDia (src/hooks/useAhora.ts). Hay dos
  relojes: el normal (RELOJ) y el del cumpleaños (RELOJ_CUMPLE en
  lib/cumple.ts), que respeta la vista previa ?cumple=…
*/
import { claveDia } from "./fechas.ts";

export interface Reloj {
  /** Para useSyncExternalStore: avisa a "aviso" en cada cambio. */
  suscribir: (aviso: () => void) => () => void;
  actual: () => Date;
  delDia: () => Date;
}

export function crearReloj(fuente: () => Date = () => new Date(), cadaMs = 1000): Reloj {
  let actual = fuente();
  let delDia = actual;
  const avisos = new Set<() => void>();
  let temporizador: ReturnType<typeof setInterval> | undefined;

  const avanzar = () => {
    actual = fuente();
    // Mismo objeto mientras sea el mismo día: React no vuelve a dibujar.
    if (claveDia(actual) !== claveDia(delDia)) delDia = actual;
    avisos.forEach((aviso) => aviso());
  };

  return {
    suscribir(aviso) {
      avisos.add(aviso);
      if (!temporizador) {
        // La hora pudo quedar vieja si nadie escuchaba: se pone al día.
        avanzar();
        temporizador = setInterval(avanzar, cadaMs);
      }
      return () => {
        avisos.delete(aviso);
        if (avisos.size === 0 && temporizador) {
          clearInterval(temporizador);
          temporizador = undefined;
        }
      };
    },
    actual: () => actual,
    delDia: () => delDia
  };
}

/** Reloj normal (la hora del dispositivo). */
export const RELOJ = crearReloj();
