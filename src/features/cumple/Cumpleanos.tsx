import { CONFIG, TEXTOS } from "../../lib/contenido.ts";
import type { Ocurrencia } from "../../lib/cumple.ts";
import { CabeceraSeccion, Seccion } from "../../components/ui/index.ts";
import CuentaCumple from "./CuentaCumple.tsx";
import Pastel from "./Pastel.tsx";

interface CumpleanosProps {
  /** El cumpleaños de ahora (lo calcula App con ocurrencia()). */
  ocurrencia: Ocurrencia;
}

/*
  SECCIÓN DE CUMPLEAÑOS
    antes    regalo sellado con cuenta regresiva
    hoy      pastel con velas para soplar (la sección sube al inicio)
    despues  queda de recuerdo y se pueden volver a encender las velas
*/
export default function Cumpleanos({ ocurrencia }: CumpleanosProps) {
  const { estado } = ocurrencia;
  const titulo = { antes: TEXTOS.cumpleTituloAntes, hoy: TEXTOS.cumpleTituloHoy, despues: TEXTOS.cumpleTituloDespues }[
    estado
  ];
  const intro = { antes: TEXTOS.cumpleIntroAntes, hoy: TEXTOS.cumpleIntroHoy, despues: TEXTOS.cumpleIntroDespues }[
    estado
  ];

  return (
    <Seccion id="cumple">
      <CabeceraSeccion etiqueta={TEXTOS.cumpleEyebrow} titulo={titulo} intro={intro} />
      <div className="cumple-card glass-soft">
        {estado === "antes" ? (
          <CuentaCumple objetivo={ocurrencia.date} />
        ) : (
          <Pastel dia={ocurrencia.date} velas={CONFIG.cumpleanos?.velas ?? 5} />
        )}
      </div>
    </Seccion>
  );
}
