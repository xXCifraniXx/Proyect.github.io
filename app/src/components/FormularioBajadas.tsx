import { useState, type FormEvent, type ReactNode } from "react";
import { TEXTOS } from "../lib/contenido.ts";
import type { AjusteBajadas } from "../lib/rotacion.ts";

interface FormularioBajadasProps {
  /** Valores con que arranca el formulario (los vigentes). */
  inicial: AjusteBajadas;
  /** Fecha mínima elegible, "AAAA-MM-DD". */
  minimo: string;
  hayAjuste: boolean;
  ocupado: boolean;
  onGuardar: (ajuste: AjusteBajadas) => void;
  onRestablecer: () => void;
  /** Lo que va entre los campos y los botones (la fila de la cuenta). */
  children?: ReactNode;
}

/*
  Campos del panel "Ajustar bajadas de mina". Es un formulario "controlado":
  React guarda lo que se escribe en el estado y de ahí sale lo que se ve.
  Bajadas le cambia la "key" cuando llegan valores nuevos (por ejemplo, de la
  nube), y React lo vuelve a crear con esos valores.
*/
export default function FormularioBajadas({ inicial, minimo, hayAjuste, ocupado, onGuardar, onRestablecer, children }: FormularioBajadasProps) {
  const [proximaBajada, setProximaBajada] = useState(inicial.proximaBajada);
  const [diasMina, setDiasMina] = useState(String(inicial.diasMina));
  const [diasDescanso, setDiasDescanso] = useState(String(inicial.diasDescanso));
  const [horaRegreso, setHoraRegreso] = useState(inicial.horaRegreso);

  const enviar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const limitar = (valor: string, porDefecto: number) => Math.min(60, Math.max(1, Math.round(Number(valor) || porDefecto)));
    onGuardar({
      proximaBajada,
      diasMina: limitar(diasMina, 14),
      diasDescanso: limitar(diasDescanso, 7),
      horaRegreso: horaRegreso || "21:00"
    });
  };

  return (
    <form className="roster-editor-form" noValidate onSubmit={enviar}>
      <label className="roster-editor-field">
        <span>{TEXTOS.rosterEditorNextDown}</span>
        <input type="date" required min={minimo} value={proximaBajada} onChange={(e) => setProximaBajada(e.target.value)} />
      </label>
      <div className="roster-editor-grid">
        <label className="roster-editor-field">
          <span>{TEXTOS.rosterEditorMineDays}</span>
          <input type="number" min={1} max={60} inputMode="numeric" value={diasMina} onChange={(e) => setDiasMina(e.target.value)} />
        </label>
        <label className="roster-editor-field">
          <span>{TEXTOS.rosterEditorRestDays}</span>
          <input type="number" min={1} max={60} inputMode="numeric" value={diasDescanso} onChange={(e) => setDiasDescanso(e.target.value)} />
        </label>
        <label className="roster-editor-field">
          <span>{TEXTOS.rosterEditorReturnTime}</span>
          <input type="time" value={horaRegreso} onChange={(e) => setHoraRegreso(e.target.value)} />
        </label>
      </div>
      {children}
      <p className="roster-editor-note">{TEXTOS.rosterEditorNote}</p>
      <div className="roster-editor-actions">
        <button type="submit" className="btn btn-primary" disabled={ocupado}>{TEXTOS.rosterEditorSave}</button>
        {hayAjuste && (
          <button type="button" className="btn btn-ghost" disabled={ocupado} onClick={onRestablecer}>{TEXTOS.rosterEditorReset}</button>
        )}
      </div>
    </form>
  );
}
