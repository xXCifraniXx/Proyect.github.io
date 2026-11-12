import type { Sesion } from "./useSesion.ts";
// textos directo (no lib/contenido): sesion/ también lo usa la página del cielo,
// que no necesita cargar todo el contenido de la página principal.
import { textos as TEXTOS } from "../../config/textos.ts";
import { rellenar } from "../../lib/rellenar.ts";

interface CuentaGoogleProps {
  sesion: Sesion;
}

/** Fila del panel de bajadas: quién inició sesión y el botón para entrar o salir. */
export default function CuentaGoogle({ sesion }: CuentaGoogleProps) {
  if (!sesion.lista) return null;
  const { usuario, miembro } = sesion;
  const nombre = (usuario?.displayName || usuario?.email || "").split(" ")[0];

  let texto = TEXTOS.sesionPideEntrar;
  if (usuario && miembro) texto = rellenar(TEXTOS.sesionMiembro, { nombre });
  else if (usuario) texto = rellenar(TEXTOS.sesionNoMiembro, { correo: usuario.email || TEXTOS.sesionEstaCuenta });

  return (
    <div className="roster-editor-account">
      <span>{sesion.error ?? texto}</span>
      <button type="button" className="btn btn-ghost" onClick={() => void (usuario ? sesion.salir() : sesion.entrar())}>
        {usuario ? TEXTOS.sesionSalir : TEXTOS.sesionEntrar}
      </button>
    </div>
  );
}
