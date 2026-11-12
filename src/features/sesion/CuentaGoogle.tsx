import type { Sesion } from "./useSesion.ts";

interface CuentaGoogleProps {
  sesion: Sesion;
}

/** Fila del panel de bajadas: quién inició sesión y el botón para entrar o salir. */
export default function CuentaGoogle({ sesion }: CuentaGoogleProps) {
  if (!sesion.lista) return null;
  const { usuario, miembro } = sesion;
  const nombre = (usuario?.displayName || usuario?.email || "").split(" ")[0];

  let texto = "Inicia sesión para que el cambio se vea en los dos celulares.";
  if (usuario && miembro) texto = `Con sesión de ${nombre}: los cambios se guardan para los dos.`;
  else if (usuario) texto = `Con ${usuario.email || "esta cuenta"} los cambios se guardan solo en este dispositivo.`;

  return (
    <div className="roster-editor-account">
      <span>{sesion.error ?? texto}</span>
      <button type="button" className="btn btn-ghost" onClick={() => void (usuario ? sesion.salir() : sesion.entrar())}>
        {usuario ? "Salir" : "Iniciar sesión"}
      </button>
    </div>
  );
}
