import type { CSSProperties } from "react";
import { matasellos, type CartaBoveda } from "./boveda.ts";
import { useVentanaCarta } from "./ventanaCarta.ts";
import { diaYMes } from "../../lib/fechas.ts";
import { TEXTOS } from "../../lib/contenido.ts";
import { rellenar } from "../../lib/rellenar.ts";

interface TarjetaBovedaAbiertaProps {
  item: CartaBoveda;
  estilo: CSSProperties;
}

/*
  Carta de La Bóveda que ya se puede leer: un sobre cerrado con un sello de
  cera (el ícono de la carta) y el matasellos con su fecha; se abre al
  tocarlo. El título es el botón, estirado para cubrir todo el sobre (ver
  .boveda-abrir en boveda.css): así el botón se llama como la carta. El sobre
  no muestra el texto: lo descifra la ventana al abrirla.
*/
export default function TarjetaBovedaAbierta({ item, estilo }: TarjetaBovedaAbiertaProps) {
  const { abrir } = useVentanaCarta();
  const sello = matasellos(item.fecha);

  return (
    <article className="boveda-card boveda-sobre is-unlocked" style={estilo}>
      <span className="boveda-sobre-solapa" aria-hidden="true" />
      <span className="boveda-sobre-sello" aria-hidden="true">
        {item.carta.icono || TEXTOS.cartaIcono}
      </span>
      <span className="boveda-sobre-matasellos" aria-hidden="true">
        {sello.diaMes}
        <span>{sello.anio}</span>
      </span>
      <div className="boveda-sobre-texto">
        <h3>
          <button className="boveda-abrir" type="button" onClick={() => abrir(item)}>
            {item.carta.titulo || TEXTOS.cartaSinTitulo}
          </button>
        </h3>
        <p className="boveda-sobre-detalle">{rellenar(TEXTOS.bovedaSobreAbierto, { fecha: diaYMes(item.fecha) })}</p>
      </div>
    </article>
  );
}
