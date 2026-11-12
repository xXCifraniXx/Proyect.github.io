import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { CuentaGoogle, type Sesion } from "../sesion/index.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import type { AjusteBajadas } from "./rotacion.ts";
import FormularioBajadas from "./FormularioBajadas.tsx";

interface EditorBajadasProps {
  inicial: AjusteBajadas;
  minimo: string;
  hayAjuste: boolean;
  editada: boolean;
  sesion: Sesion;
  /** Devuelven el mensaje para mostrar (guardado, error…). */
  onGuardar: (ajuste: AjusteBajadas) => Promise<string>;
  onRestablecer: () => Promise<string>;
}

/** Panel plegable "Ajustar bajadas de mina" con su mensaje de estado. */
export default function EditorBajadas({
  inicial,
  minimo,
  hayAjuste,
  editada,
  sesion,
  onGuardar,
  onRestablecer
}: EditorBajadasProps) {
  const [mensaje, setMensaje] = useState("");
  const [visible, setVisible] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const avisar = (texto: string) => {
    setMensaje(texto);
    setVisible(true);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setVisible(false), 4000);
  };

  const ejecutar = async (accion: () => Promise<string>) => {
    setOcupado(true);
    try {
      avisar(await accion());
    } finally {
      setOcupado(false);
    }
  };

  const guardar = (ajuste: AjusteBajadas) => {
    if (Number.isNaN(new Date(`${ajuste.proximaBajada}T00:00:00`).getTime())) {
      avisar(TEXTOS.rosterEditorInvalidMsg || "Elige una fecha válida.");
      return;
    }
    void ejecutar(() => onGuardar(ajuste));
  };

  return (
    <details className={clsx("roster-editor glass-soft", editada && "is-edited")}>
      <summary>
        <span>{TEXTOS.rosterEditorTitle}</span>
      </summary>
      <FormularioBajadas
        key={JSON.stringify(inicial)}
        inicial={inicial}
        minimo={minimo}
        hayAjuste={hayAjuste}
        ocupado={ocupado}
        onGuardar={guardar}
        onRestablecer={() => void ejecutar(onRestablecer)}
      >
        <CuentaGoogle sesion={sesion} />
      </FormularioBajadas>
      <p className={clsx("roster-editor-status", visible && "is-visible")} role="status" aria-live="polite">
        {mensaje}
      </p>
    </details>
  );
}
