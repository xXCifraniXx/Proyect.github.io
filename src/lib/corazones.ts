/*
  RÁFAGA DE CORAZONES
  Suelta unos corazones que salen del centro y desaparecen solos (al apagar
  las velas, al ganar el minijuego…). Son un efecto de unos segundos, así que
  se agregan directo a la capa de corazones de Fondo en vez de pasar por el
  estado de React.
*/
export function rafagaCorazones(cantidad = 22) {
  const capa = document.getElementById("floatingHearts");
  if (!capa) return;
  for (let i = 0; i < cantidad; i += 1) {
    const corazon = document.createElement("span");
    corazon.className = "heart burst";
    corazon.textContent = i % 2 ? "❤" : "♡";
    corazon.style.left = `${38 + Math.random() * 24}%`;
    corazon.style.fontSize = `${16 + Math.random() * 18}px`;
    corazon.style.setProperty("--drift", `${Math.random() * 260 - 130}px`);
    corazon.style.animationDuration = `${1.6 + Math.random() * 1.3}s`;
    capa.appendChild(corazon);
    setTimeout(() => corazon.remove(), 3200);
  }
}
