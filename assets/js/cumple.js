/*
  CUMPLEAÑOS
  ----------
  Todo lo relacionado con el cumpleaños vive aquí; el contenido sale de
  config.cumpleanos. Se parte de la fecha de nacimiento: de ahí salen la fecha
  del cumpleaños de cada año y la edad ({edad} en cualquier texto).

  Cada año la sección recorre tres momentos y el resto del año permanece oculta:

    antes    desde "diasAntes" días antes: regalo sellado y cuenta regresiva
    hoy      el día: modo cumpleaños (bienvenida especial, confeti, pastel con velas)
    despues  durante "diasDespues" días: queda de recuerdo (se pueden volver a encender)

  La carta de cumpleaños se agrega sola a La Bóveda con la fecha de ese año.

  Vista previa sin cambiar el reloj:  index.html?cumple=antes | hoy | despues

  app.js usa esta API antes de arrancar (now / estado / textos / carta) y llama
  a setup() cuando el HTML ya está listo.
*/
(() => {
  "use strict";

  const HOUR = 3600000;
  const DAY = 24 * HOUR;

  const config = () => window.APP_CONFIG?.cumpleanos || null;
  const pad2 = (value) => String(value).padStart(2, "0");
  const dayKey = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

  function birth() {
    const cfg = config();
    if (!cfg || cfg.activo === false) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(cfg.nacimiento || ""));
    return match ? { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) } : null;
  }

  // Cumpleaños relevante en el instante "current": el de este momento (hoy / recuerdo)
  // o el próximo si ya está cerca. Devuelve { date, edad, estado } o null.
  function occurrenceAt(current) {
    const b = birth();
    if (!b) return null;
    const cfg = config();
    const daysBefore = Number(cfg.diasAntes ?? 45);
    const daysAfter = Number(cfg.diasDespues ?? 60);

    const year = current.getFullYear();
    const all = [year - 1, year, year + 1].map((y) => ({ year: y, date: new Date(y, b.month, b.day) }));
    const past = all.filter((o) => o.date <= current).pop();
    const next = all.find((o) => o.date > current);
    const make = (o, estado) => ({ date: o.date, edad: o.year - b.year, estado });

    if (past) {
      const endOfDay = new Date(past.date.getFullYear(), past.date.getMonth(), past.date.getDate() + 1);
      if (current < endOfDay) return make(past, "hoy");
      if (current.getTime() < endOfDay.getTime() + daysAfter * DAY) return make(past, "despues");
    }
    if (next && next.date.getTime() - current.getTime() <= daysBefore * DAY) return make(next, "antes");
    return null;
  }

  // Vista previa: desplaza el "reloj" solo para lo relacionado con el cumpleaños.
  const PREVIEW = new URLSearchParams(window.location.search).get("cumple");
  const clockOffset = (() => {
    const b = birth();
    if (!b || !PREVIEW) return 0;
    const cfg = config();
    const reference = new Date(new Date().getFullYear(), b.month, b.day).getTime();
    const at = {
      antes: reference - Math.min(5, Number(cfg.diasAntes ?? 45)) * DAY,
      hoy: reference + 9 * HOUR,
      despues: reference + Math.min(3, Number(cfg.diasDespues ?? 60)) * DAY
    }[PREVIEW];
    return at === undefined ? 0 : at - Date.now();
  })();

  const now = () => new Date(Date.now() + clockOffset);
  const occurrence = () => occurrenceAt(now());
  const estado = () => occurrence()?.estado || "off";

  if (estado() === "hoy") document.body.classList.add("is-birthday");

  // {edad} en cualquier texto se reemplaza por la edad que cumple.
  const fill = (text, occ) => String(text).split("{edad}").join(occ.edad);

  // Textos: el día del cumpleaños, config.cumpleanos.textosHoy reemplaza a config.textos.
  function textos(base) {
    const occ = occurrence();
    if (!occ) return base;
    const merged = occ.estado === "hoy" ? { ...base, ...(config().textosHoy || {}) } : base;
    return Object.fromEntries(
      Object.entries(merged).map(([key, value]) => [key, typeof value === "string" ? fill(value, occ) : value])
    );
  }

  // Carta que se suma a La Bóveda, con la fecha del cumpleaños de este año.
  function carta() {
    const occ = occurrence();
    const cfg = config();
    if (!occ || !cfg?.carta) return null;
    return {
      ...cfg.carta,
      titulo: fill(cfg.carta.titulo || "", occ),
      mensaje: fill(cfg.carta.mensaje || "", occ),
      id: "cumple",
      edad: occ.edad,
      fecha: occ.date.toISOString(),
      accion: { destino: "cumple", etiqueta: window.APP_CONFIG?.textos?.cumpleIrVelas || "Ir a soplar mis velas 🎂" }
    };
  }

  /* ---------------------------------------------------------------------------
     PASTEL: velas que se apagan tocándolas o con el botón "Soplar".
  --------------------------------------------------------------------------- */
  function buildCake(cake, candleCount) {
    const candles = Array.from({ length: candleCount }, (_, i) => `
      <button class="candle" type="button" aria-label="Apagar la vela ${i + 1}">
        <span class="flame"></span><span class="smoke"></span><span class="wick"></span>
      </button>`).join("");

    cake.innerHTML = `
      <div class="cake-glow"></div>
      <div class="cake-candles">${candles}</div>
      <div class="cake-layer cake-top"></div>
      <div class="cake-layer cake-mid"></div>
      <div class="cake-layer cake-base"></div>
      <div class="cake-plate"></div>`;
  }

  function setupStage(api, cfg, occ) {
    const stage = api.$("#cumpleStage");
    const cake = api.$("#cake");
    const blowBtn = api.$("#cumpleBlow");
    const wish = api.$("#cumpleWish");
    if (!stage || !cake) return;

    stage.hidden = false;
    const count = Math.min(9, Math.max(1, Number(cfg.velas) || 5));
    buildCake(cake, count);
    const candles = api.$$(".candle", cake);

    // Una marca por año: cada cumpleaños empieza con las velas encendidas.
    const storageKey = `cumple-velas-${dayKey(occ.date)}`;
    const readDone = () => {
      if (PREVIEW) return false;
      try { return localStorage.getItem(storageKey) === "1"; } catch (_) { return false; }
    };
    const writeDone = (value) => {
      if (PREVIEW) return;
      try {
        if (value) localStorage.setItem(storageKey, "1");
        else localStorage.removeItem(storageKey);
      } catch (_) { /* modo privado */ }
    };

    let finished = false;
    const lit = () => candles.filter((c) => !c.classList.contains("is-out"));

    const refresh = () => {
      cake.style.setProperty("--lit", String(lit().length / candles.length));
      if (!finished && lit().length === 0) finish(true);
    };

    function finish(celebrate) {
      finished = true;
      if (blowBtn) blowBtn.hidden = true;
      if (wish) wish.hidden = false;
      if (celebrate) {
        window.Confetti?.celebrate();
        api.burstHearts(26);
        writeDone(true);
      }
    }

    candles.forEach((candle) => {
      candle.addEventListener("click", () => {
        if (candle.classList.contains("is-out")) return;
        candle.classList.add("is-out");
        refresh();
      });
    });

    blowBtn?.addEventListener("click", () => {
      lit().forEach((candle, i) => {
        setTimeout(() => {
          candle.classList.add("is-out");
          refresh();
        }, i * 140);
      });
    });

    api.$("#cumpleRelight")?.addEventListener("click", () => {
      finished = false;
      cake.classList.remove("is-restored");
      candles.forEach((candle) => candle.classList.remove("is-out"));
      if (blowBtn) blowBtn.hidden = false;
      if (wish) wish.hidden = true;
      writeDone(false);
      refresh();
    });

    api.$("#cumpleOpenLetter")?.addEventListener("click", () => {
      const letter = carta();
      if (letter) api.openCarta(letter, new Date(letter.fecha));
    });

    // Si ya las apagó antes, vuelve a verse apagado y con la carta a mano.
    if (readDone()) {
      cake.classList.add("is-restored");
      candles.forEach((candle) => candle.classList.add("is-out"));
      cake.style.setProperty("--lit", "0");
      finish(false);
    } else {
      cake.style.setProperty("--lit", "1");
    }
  }

  /* ---------------------------------------------------------------------------
     CUENTA REGRESIVA (estado "antes")
  --------------------------------------------------------------------------- */
  function setupCountdown(api, occ) {
    const locked = api.$("#cumpleLocked");
    if (!locked) return;
    locked.hidden = false;
    const target = occ.date;

    const tick = () => {
      const current = now();
      if (current >= target) {
        window.location.reload();
        return;
      }
      const parts = api.splitCountdown(target, current);
      api.safeText("#cumpleDays", parts.days);
      api.safeText("#cumpleHours", parts.hours);
      api.safeText("#cumpleMinutes", parts.minutes);
      api.safeText("#cumpleSeconds", parts.seconds);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------------------
     ARRANQUE DE LA SECCIÓN
  --------------------------------------------------------------------------- */
  function setup(api) {
    const cfg = config();
    const section = api.$("#cumple");
    const occ = occurrence();

    if (!section) return;
    if (!occ || !cfg) {
      section.remove();
      api.$("#navCumple")?.remove();
      return;
    }

    const T = api.textos;
    const title = api.$("#cumpleTitle");
    const intro = api.$("#cumpleIntro");

    if (occ.estado === "antes") {
      if (title) title.textContent = T.cumpleTituloAntes || "";
      if (intro) intro.textContent = T.cumpleIntroAntes || "";
      setupCountdown(api, occ);
      return;
    }

    const hoy = occ.estado === "hoy";
    if (title) title.textContent = (hoy ? T.cumpleTituloHoy : T.cumpleTituloDespues) || "";
    if (intro) intro.textContent = (hoy ? T.cumpleIntroHoy : T.cumpleIntroDespues) || "";

    api.$("#navCumple")?.removeAttribute("hidden");
    setupStage(api, cfg, occ);

    if (hoy) {
      // El día del cumpleaños lo primero que ve es su sorpresa.
      api.$("#carta")?.before(section);
      const cta = api.$("#heroCtaBoveda");
      if (cta) cta.setAttribute("href", "#cumple");
      api.$("#enterBtn")?.addEventListener("click", () => {
        setTimeout(() => window.Confetti?.celebrate(), 300);
      });
    }
  }

  window.Cumple = { now, estado, textos, carta, setup };
})();
