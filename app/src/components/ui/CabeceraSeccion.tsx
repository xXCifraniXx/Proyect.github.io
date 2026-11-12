interface CabeceraSeccionProps {
  etiqueta?: string;
  titulo?: string;
  intro?: string;
}

/** Recuadro con la etiqueta, el título y la introducción de cada sección. */
export default function CabeceraSeccion({ etiqueta, titulo, intro }: CabeceraSeccionProps) {
  return (
    <div className="section-head">
      {etiqueta && <span className="eyebrow">{etiqueta}</span>}
      {titulo && <h2>{titulo}</h2>}
      {intro && <p>{intro}</p>}
    </div>
  );
}
