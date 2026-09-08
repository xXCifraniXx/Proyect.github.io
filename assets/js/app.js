/*
  LÓGICA DEL SITIO
  ----------------
  El HTML es una plantilla vacía. Este archivo:
   1. Rellena todos los textos desde config.textos (data-bind).
   2. Genera las secciones dinámicas (línea de tiempo, calendario, Bóveda, juego).
   3. Maneja las interacciones (sobre, música, minijuego, modales).

  Para editar contenido no hace falta tocar este archivo: casi todo sale de
  assets/js/config.js.
*/
(() => {
  const CONFIG = window.APP_CONFIG || {};
  const TEXTOS = CONFIG.textos || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const state = {
    isPlaying: false,
    calendarCursor: null
  };

  function safeText(id, value) {
    const el = typeof id === "string" ? $(id) : id;
    if (el && value !== undefined && value !== null) el.textContent = value;
  }

  function resolvePath(obj, path) {
    return String(path).split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /* ---------------------------------------------------------------------------
     TEXTOS: un solo lugar. Cada [data-bind="ruta.en.config"] recibe su texto.
  --------------------------------------------------------------------------- */
  function bindTexts() {
    const nombres = CONFIG.nombres || {};
    document.title = `Para ${nombres.novia || "Anthuanete"} | Una carta de ${nombres.autor || "Jorge"}`;
    safeText("#brandText", `Para ${nombres.novia || "Anthuanete"}`);

    $$("[data-bind]").forEach((el) => {
      const value = resolvePath(CONFIG, el.dataset.bind);
      if (value !== undefined && value !== null) el.textContent = value;
    });
  }

  /* ---------------------------------------------------------------------------
     FONDO: corazones flotantes y ráfaga de celebración.
  --------------------------------------------------------------------------- */
  function createHearts() {
    const container = $("#floatingHearts");
    if (!container) return;
    const total = CONFIG.opciones?.corazones || 18;
    container.innerHTML = "";
    for (let i = 0; i < total; i += 1) {
      const heart = document.createElement("span");
      heart.className = "heart";
      heart.textContent = i % 3 === 0 ? "♡" : "❤";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.setProperty("--drift", `${Math.random() * 70 - 35}px`);
      heart.style.animationDuration = `${10 + Math.random() * 10}s`;
      heart.style.animationDelay = `${Math.random() * 8}s`;
      heart.style.fontSize = `${13 + Math.random() * 10}px`;
      container.appendChild(heart);
    }
  }

  function burstHearts(count = 22) {
    const layer = $("#floatingHearts");
    if (!layer) return;
    for (let i = 0; i < count; i += 1) {
      const heart = document.createElement("span");
      heart.className = "heart burst";
      heart.textContent = i % 2 ? "❤" : "♡";
      heart.style.left = `${38 + Math.random() * 24}%`;
      heart.style.fontSize = `${16 + Math.random() * 18}px`;
      heart.style.setProperty("--drift", `${Math.random() * 260 - 130}px`);
      heart.style.animationDuration = `${1.6 + Math.random() * 1.3}s`;
      layer.appendChild(heart);
      setTimeout(() => heart.remove(), 3200);
    }
  }

  /* ---------------------------------------------------------------------------
     BIENVENIDA + SOBRE / CARTA INTERACTIVA
  --------------------------------------------------------------------------- */
  function setupWelcomeAndLetter() {
    const welcome = $("#welcome");
    const enterBtn = $("#enterBtn");
    const envelope = $("#envelope");
    const openLetterBtn = $("#openLetterBtn");
    const letterHint = $("#letterHint");

    const setEnvelopeState = (isOpen) => {
      if (!envelope) return;
      envelope.classList.toggle("open", isOpen);
      envelope.setAttribute("aria-pressed", isOpen ? "true" : "false");
      if (openLetterBtn) {
        openLetterBtn.textContent = isOpen
          ? (TEXTOS.letterClose || "Cerrar carta")
          : (TEXTOS.letterOpen || "Abrir carta");
      }
      if (letterHint) {
        letterHint.textContent = isOpen
          ? (TEXTOS.letterHintOpen || "La carta ya está abierta. Toca el sobre para cerrarla.")
          : (TEXTOS.letterHintClosed || "Toca el sobre para abrirlo con calma.");
      }
    };

    enterBtn?.addEventListener("click", () => {
      welcome?.classList.add("hide");
      setEnvelopeState(false);
    });

    const toggleEnvelope = () => setEnvelopeState(!envelope?.classList.contains("open"));

    envelope?.addEventListener("click", toggleEnvelope);
    envelope?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleEnvelope();
      }
    });

    openLetterBtn?.addEventListener("click", () => {
      setEnvelopeState(!envelope?.classList.contains("open"));
      envelope?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    setEnvelopeState(false);
  }

  /* ---------------------------------------------------------------------------
     PROGRESO DE SCROLL + APARICIÓN DE SECCIONES
  --------------------------------------------------------------------------- */
  function setupRevealAndProgress() {
    const progress = $("#scrollProgress");
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (progress) progress.style.width = `${value}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    }, { threshold: 0.12 });

    $$(".reveal").forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------------------------
     UTILIDADES DE FECHA (compartidas por contadores y calendario)
  --------------------------------------------------------------------------- */
  function calculateDiff(start, end) {
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += previousMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.max(0, Math.floor((end - start) / 86400000));
    return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days), totalDays };
  }

  function dayNumber(date) {
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  }

  function dateFromDayNumber(value) {
    const utc = new Date(value * 86400000);
    return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
  }

  function applyTime(date, timeValue) {
    const [hours = "0", minutes = "0"] = String(timeValue || "00:00").split(":");
    const copy = new Date(date);
    copy.setHours(Number(hours), Number(minutes), 0, 0);
    return copy;
  }

  function mod(value, total) {
    return ((value % total) + total) % total;
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function formatDateLong(date) {
    try {
      return date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    } catch (_) {
      return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
    }
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addDays(date, days) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  function dateKey(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function diffCalendarDays(start, end) {
    const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    return Math.floor((endUtc - startUtc) / 86400000);
  }

  function parseClock(value, fallbackHour = 21, fallbackMinute = 0) {
    const [hour, minute] = String(value || "").split(":").map((part) => Number(part));
    return {
      hour: Number.isFinite(hour) ? hour : fallbackHour,
      minute: Number.isFinite(minute) ? minute : fallbackMinute
    };
  }

  function setClock(date, clock) {
    const copy = new Date(date);
    copy.setHours(clock.hour, clock.minute, 0, 0);
    return copy;
  }

  function formatMonthName(date) {
    return new Intl.DateTimeFormat("es", { month: "long", year: "numeric" }).format(date);
  }

  function formatLongDate(date) {
    return new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long" }).format(date);
  }

  function capitalize(text) {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
  }

  function splitCountdown(target, from = new Date()) {
    const ms = Math.max(0, target - from);
    return {
      days: Math.floor(ms / 86400000),
      hours: Math.floor((ms % 86400000) / 3600000),
      minutes: Math.floor((ms % 3600000) / 60000),
      seconds: Math.floor((ms % 60000) / 1000)
    };
  }

  /* ---------------------------------------------------------------------------
     LÍNEA DE TIEMPO MENSUAL
  --------------------------------------------------------------------------- */
  function monthKey(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
  }

  function monthLabel(key) {
    const [year, month] = key.split("-").map(Number);
    const label = new Date(year, month - 1, 1).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    return capitalize(label);
  }

  function renderMonthlyTimeline() {
    const track = $("#timelineTrack");
    if (!track) return;

    const startRaw = CONFIG.fechas?.inicioRelacion;
    const start = startRaw ? new Date(startRaw) : null;
    if (!start || Number.isNaN(start.getTime())) {
      track.innerHTML = "";
      return;
    }

    const now = new Date();
    const configuredByMonth = new Map((CONFIG.lineaTiempo || []).map((item) => [item.mes, item]));

    const months = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const limit = new Date(now.getFullYear(), now.getMonth(), 1);
    while (cursor <= limit) {
      months.push(monthKey(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    track.innerHTML = months.map((key) => {
      const item = configuredByMonth.get(key);
      if (item && item.src) {
        return `
          <article class="timeline-card">
            <img src="${item.src}" alt="${item.titulo || monthLabel(key)}" loading="lazy" />
            <div class="timeline-body">
              <span class="timeline-month">${monthLabel(key)}</span>
              <h3>${item.titulo || ""}</h3>
              <p>${item.texto || ""}</p>
            </div>
          </article>
        `;
      }
      return `
        <article class="timeline-card is-empty">
          <span class="timeline-empty-icon">🖼️</span>
          <h3>${monthLabel(key)}</h3>
          <p>Aún no tiene foto. Agrégala en <code>lineaTiempo</code> dentro de <code>config.js</code>.</p>
        </article>
      `;
    }).join("");
  }

  function setupMonthlyTimeline() {
    renderMonthlyTimeline();
    const viewport = $("#timelineViewport");
    $("#timelinePrev")?.addEventListener("click", () => viewport?.scrollBy({ left: -230, behavior: "smooth" }));
    $("#timelineNext")?.addEventListener("click", () => viewport?.scrollBy({ left: 230, behavior: "smooth" }));
  }

  /* ---------------------------------------------------------------------------
     CONFIGURACIÓN DE LA ROTACIÓN DE MINA
     Fuente única: config.rotacionMina, con un ajuste opcional que la persona
     puede guardar desde la página (solo en su dispositivo, en localStorage).
     El ajuste se expresa como "próxima bajada"; de ahí se deriva la salidaBase
     y el patrón 14x7 se recalcula desde esa fecha en adelante.
  --------------------------------------------------------------------------- */
  const ROSTER_OVERRIDE_KEY = "roster-override-v1";

  function readRosterOverride() {
    try {
      const raw = localStorage.getItem(ROSTER_OVERRIDE_KEY);
      const data = raw ? JSON.parse(raw) : null;
      return data && typeof data === "object" && data.proximaBajada ? data : null;
    } catch (_) {
      return null;
    }
  }

  function writeRosterOverride(data) {
    try {
      localStorage.setItem(ROSTER_OVERRIDE_KEY, JSON.stringify(data));
      return true;
    } catch (_) {
      return false;
    }
  }

  function clearRosterOverride() {
    try { localStorage.removeItem(ROSTER_OVERRIDE_KEY); } catch (_) { /* noop */ }
  }

  function readMinaConfig() {
    const source = CONFIG.rotacionMina || {};
    const cfg = {
      activa: source.activa,
      salidaBase: source.salidaBase,
      diasMina: Math.max(1, Number(source.diasMina || 14)),
      diasDescanso: Math.max(1, Number(source.diasDescanso || 7)),
      horaRegreso: source.horaRegreso || "21:00",
      horaSalida: source.horaSalida,
      mesesAMostrar: source.mesesAMostrar,
      edited: false
    };

    const override = readRosterOverride();
    if (override) {
      if (Number(override.diasMina) > 0) cfg.diasMina = Math.max(1, Number(override.diasMina));
      if (Number(override.diasDescanso) > 0) cfg.diasDescanso = Math.max(1, Number(override.diasDescanso));
      if (override.horaRegreso) cfg.horaRegreso = override.horaRegreso;

      const bajada = new Date(`${override.proximaBajada}T00:00:00`);
      if (!Number.isNaN(bajada.getTime())) {
        const origen = new Date(source.salidaBase || 0);
        const hora = Number.isNaN(origen.getTime()) ? 8 : origen.getHours();
        const min = Number.isNaN(origen.getTime()) ? 0 : origen.getMinutes();
        const salida = new Date(bajada);
        salida.setDate(salida.getDate() - cfg.diasMina);
        cfg.salidaBase = `${salida.getFullYear()}-${pad2(salida.getMonth() + 1)}-${pad2(salida.getDate())}T${pad2(hora)}:${pad2(min)}:00`;
        cfg.activa = true;
        cfg.edited = true;
      }
    }
    return cfg;
  }

  /* ---------------------------------------------------------------------------
     CONTADORES + CUENTA REGRESIVA DE REGRESO
  --------------------------------------------------------------------------- */
  function getRotationInfo(date = new Date()) {
    const cfg = readMinaConfig();
    if (cfg.activa === false || !cfg.salidaBase) return null;

    const start = new Date(cfg.salidaBase);
    if (Number.isNaN(start.getTime())) return null;

    const daysMine = Number(cfg.diasMina || 14);
    const daysHome = Number(cfg.diasDescanso || 7);
    const cycle = daysMine + daysHome;
    const currentDay = dayNumber(date);
    const startDay = dayNumber(start);
    const cycleDay = mod(currentDay - startDay, cycle);
    const cycleStartDay = currentDay - cycleDay;
    const returnDay = cycleStartDay + daysMine;
    const nextDepartureDay = cycleStartDay + cycle;
    const nextReturnDay = cycleDay <= daysMine ? returnDay : nextDepartureDay + daysMine;

    let phase = "casa";
    if (cycleDay === 0) phase = "subida";
    else if (cycleDay > 0 && cycleDay < daysMine) phase = "mina";
    else if (cycleDay === daysMine) phase = "bajada";

    const nextReturnDate = applyTime(dateFromDayNumber(nextReturnDay), cfg.horaRegreso || "20:00");
    const nextDepartureDate = applyTime(dateFromDayNumber(nextDepartureDay), cfg.horaSalida || "07:00");

    return {
      phase,
      nextReturnDate,
      nextDepartureDate,
      countdownTarget: phase === "casa" ? nextDepartureDate : nextReturnDate
    };
  }

  // Reasignada por setupCounters; la usa el editor de bajadas para refrescar
  // la cuenta regresiva al instante en vez de esperar al siguiente segundo.
  let refreshCounters = () => {};

  function setupCounters() {
    const startDate = new Date(CONFIG.fechas?.inicioRelacion || Date.now());
    const staticReturnDate = CONFIG.fechas?.regreso ? new Date(CONFIG.fechas.regreso) : null;

    const update = () => {
      const now = new Date();
      const together = calculateDiff(startDate, now);
      safeText("#yearsTogether", together.years);
      safeText("#monthsTogether", together.months);
      safeText("#daysTogether", together.days);
      safeText("#totalDaysTogether", together.totalDays);

      const rotation = getRotationInfo(now);
      const targetDate = rotation?.countdownTarget || staticReturnDate;

      if (targetDate && !Number.isNaN(targetDate.getTime())) {
        const parts = splitCountdown(targetDate, now);
        safeText("#returnDays", parts.days);
        safeText("#returnHours", parts.hours);
        safeText("#returnMinutes", parts.minutes);
        safeText("#returnSeconds", parts.seconds);

        if (rotation) {
          if (rotation.phase === "casa") {
            safeText("#returnTitle", "Próxima subida");
            safeText("#returnText", `Está en casa. La próxima subida sería el ${formatDateLong(rotation.nextDepartureDate)}.`);
          } else if (rotation.phase === "bajada") {
            safeText("#returnTitle", "Hoy es día de bajada");
            safeText("#returnText", `Hoy regresa por la noche: ${formatDateLong(rotation.nextReturnDate)}.`);
          } else {
            safeText("#returnTitle", TEXTOS.returnTitle || "Para volver a verte");
            safeText("#returnText", `Próxima bajada: ${formatDateLong(rotation.nextReturnDate)}.`);
          }
        }
      } else {
        $("#returnCard")?.remove();
      }
    };

    refreshCounters = update;
    update();
    setInterval(update, 1000);
  }

  /* ---------------------------------------------------------------------------
     CALENDARIO DE ROTACIÓN 14 x 7
  --------------------------------------------------------------------------- */
  function getRosterConfig() {
    const cfg = readMinaConfig();
    const base = new Date(cfg.salidaBase || CONFIG.fechas?.regreso || Date.now());
    const mineDays = Math.max(1, Number(cfg.diasMina || 14));
    const restDays = Math.max(1, Number(cfg.diasDescanso || 7));
    return {
      active: cfg.activa !== false && !Number.isNaN(base.getTime()),
      base,
      baseDay: startOfDay(base),
      mineDays,
      restDays,
      cycleDays: mineDays + restDays,
      returnClock: parseClock(cfg.horaRegreso, 21, 0),
      monthsToShow: Math.max(1, Math.min(4, Number(cfg.mesesAMostrar || 1))),
      edited: cfg.edited
    };
  }

  // Próxima fecha de bajada (día "return") a partir de ahora.
  function nextBajadaDate(roster, now = new Date()) {
    if (!roster.active) return null;
    let cycleNumber = Math.floor(diffCalendarDays(roster.baseDay, now) / roster.cycleDays);
    if (cycleNumber < 0) cycleNumber = 0;
    for (let i = 0; i < 500; i += 1) {
      const cycle = buildRosterCycle(roster, cycleNumber + i);
      if (cycle.returnDate >= now) return cycle.returnDate;
    }
    return null;
  }

  function toDateInputValue(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function buildRosterCycle(roster, cycleNumber) {
    const startDay = addDays(roster.baseDay, cycleNumber * roster.cycleDays);
    const start = setClock(startDay, { hour: roster.base.getHours(), minute: roster.base.getMinutes() });
    const returnDate = setClock(addDays(startDay, roster.mineDays), roster.returnClock);
    const nextStartDay = addDays(startDay, roster.cycleDays);
    const nextStart = setClock(nextStartDay, { hour: roster.base.getHours(), minute: roster.base.getMinutes() });
    return { startDay, start, returnDate, nextStartDay, nextStart };
  }

  function getCurrentRosterPhase(roster, now = new Date()) {
    if (!roster.active) return null;

    let cycleNumber = Math.floor(diffCalendarDays(roster.baseDay, now) / roster.cycleDays);
    if (cycleNumber < 0) cycleNumber = 0;

    let cycle = buildRosterCycle(roster, cycleNumber);
    while (now >= cycle.nextStart) {
      cycleNumber += 1;
      cycle = buildRosterCycle(roster, cycleNumber);
    }
    while (cycleNumber > 0 && now < cycle.start) {
      cycleNumber -= 1;
      cycle = buildRosterCycle(roster, cycleNumber);
    }

    if (now < cycle.start) {
      return {
        title: "Próxima subida programada",
        text: `La rotación empezará el ${formatLongDate(cycle.start)}.`,
        targetLabel: "Próxima subida",
        target: cycle.start
      };
    }
    if (now < cycle.returnDate) {
      return {
        title: "Ahora estás en mina 😿",
        text: `La próxima bajada será el ${formatLongDate(cycle.returnDate)} por la noche. Falta cada vez menos para volver a verte.`,
        targetLabel: "Próxima bajada",
        target: cycle.returnDate
      };
    }
    return {
      title: "Estás en tus días de bajada 😼",
      text: `La próxima subida será el ${formatLongDate(cycle.nextStart)}. Estos días son para descansar y guardar recuerdos bonitos 💜.`,
      targetLabel: "Próxima subida",
      target: cycle.nextStart
    };
  }

  function classifyRosterDay(roster, day) {
    const diff = diffCalendarDays(roster.baseDay, day);
    if (diff < 0) return { type: "none", label: "" };
    const index = mod(diff, roster.cycleDays);

    if (index === 0) return { type: "departure mine", label: "Sube" };
    if (index > 0 && index < roster.mineDays) return { type: "mine", label: "Mina" };
    if (index === roster.mineDays) return { type: "return", label: "Bajada" };
    return { type: "rest", label: "Descanso" };
  }

  function updateRosterCountdown(target) {
    const parts = splitCountdown(target);
    safeText("#rosterDays", parts.days);
    safeText("#rosterHours", parts.hours);
    safeText("#rosterMinutes", parts.minutes);
    safeText("#rosterSeconds", parts.seconds);
  }

  function renderRosterSummary() {
    const roster = getRosterConfig();
    if (!roster.active) {
      $("#calendario")?.remove();
      return null;
    }

    const phase = getCurrentRosterPhase(roster);
    if (!phase) return roster;
    safeText("#rosterStatusTitle", phase.title);
    safeText("#rosterStatusText", phase.text);
    safeText("#rosterCountdownLabel", phase.targetLabel);
    updateRosterCountdown(phase.target);
    $("#rosterEditor")?.classList.toggle("is-edited", !!roster.edited);
    return roster;
  }

  function refreshRoster() {
    const roster = renderRosterSummary();
    if (roster) renderCalendarMonths(roster);
  }

  function renderCalendarMonths(roster) {
    const monthsEl = $("#calendarMonths");
    const rangeLabel = $("#calendarRangeLabel");
    if (!monthsEl) return;

    const today = new Date();
    const cursor = state.calendarCursor || new Date(today.getFullYear(), today.getMonth(), 1);
    state.calendarCursor = cursor;
    const monthDates = Array.from({ length: roster.monthsToShow }, (_, index) =>
      new Date(cursor.getFullYear(), cursor.getMonth() + index, 1));

    if (rangeLabel) {
      const first = monthDates[0];
      const last = monthDates[monthDates.length - 1];
      rangeLabel.textContent = monthDates.length === 1
        ? capitalize(formatMonthName(first))
        : `${capitalize(new Intl.DateTimeFormat("es", { month: "long" }).format(first))} - ${capitalize(formatMonthName(last))}`;
    }

    monthsEl.innerHTML = monthDates.map((monthDate) => {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const leading = (new Date(year, month, 1).getDay() + 6) % 7;
      const blanks = Array.from({ length: leading }, () => `<div class="calendar-day empty" aria-hidden="true"></div>`).join("");
      const days = Array.from({ length: daysInMonth }, (_, index) => {
        const day = new Date(year, month, index + 1);
        const info = classifyRosterDay(roster, day);
        const isToday = dateKey(day) === dateKey(today);
        const classes = ["calendar-day", info.type, isToday ? "today" : ""].filter(Boolean).join(" ");
        const label = info.label ? `<span>${info.label}</span>` : "";
        return `<div class="${classes}" title="${info.label || ""}"><strong>${index + 1}</strong>${label}</div>`;
      }).join("");

      return `
        <article class="calendar-month glass-soft">
          <h3>${capitalize(formatMonthName(monthDate))}</h3>
          <div class="weekdays" aria-hidden="true">
            <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
          </div>
          <div class="calendar-grid">${blanks}${days}</div>
        </article>
      `;
    }).join("");
  }

  function setupRosterCalendar() {
    const roster = renderRosterSummary();
    if (!roster) return;

    const baseForCursor = CONFIG.opciones?.calendarioDesdeHoy === false ? roster.baseDay : new Date();
    state.calendarCursor = new Date(baseForCursor.getFullYear(), baseForCursor.getMonth(), 1);
    renderCalendarMonths(roster);

    setInterval(refreshRoster, 1000);

    $("#calendarPrev")?.addEventListener("click", () => {
      state.calendarCursor = new Date(state.calendarCursor.getFullYear(), state.calendarCursor.getMonth() - 1, 1);
      renderCalendarMonths(getRosterConfig());
    });
    $("#calendarNext")?.addEventListener("click", () => {
      state.calendarCursor = new Date(state.calendarCursor.getFullYear(), state.calendarCursor.getMonth() + 1, 1);
      renderCalendarMonths(getRosterConfig());
    });
    $("#calendarToday")?.addEventListener("click", () => {
      const today = new Date();
      state.calendarCursor = new Date(today.getFullYear(), today.getMonth(), 1);
      refreshRoster();
    });

    setupRosterEditor();
  }

  /* ---------------------------------------------------------------------------
     EDITOR DE BAJADAS: ajustar la próxima bajada desde la propia página.
  --------------------------------------------------------------------------- */
  function setupRosterEditor() {
    const form = $("#rosterEditorForm");
    if (!form) return;

    const nextDownInput = $("#rosterNextDown");
    const mineDaysInput = $("#rosterMineDays");
    const restDaysInput = $("#rosterRestDays");
    const returnTimeInput = $("#rosterReturnTime");
    const resetBtn = $("#rosterReset");
    const statusEl = $("#rosterEditorStatus");

    let statusTimer = null;
    const flash = (message) => {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.add("is-visible");
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => statusEl.classList.remove("is-visible"), 4000);
    };

    const fillForm = () => {
      const cfg = readMinaConfig();
      const bajada = nextBajadaDate(getRosterConfig()) || new Date();
      if (nextDownInput) {
        nextDownInput.value = toDateInputValue(bajada);
        nextDownInput.min = toDateInputValue(new Date());
      }
      if (mineDaysInput) mineDaysInput.value = cfg.diasMina;
      if (restDaysInput) restDaysInput.value = cfg.diasDescanso;
      if (returnTimeInput) returnTimeInput.value = String(cfg.horaRegreso || "21:00").slice(0, 5);
      if (resetBtn) resetBtn.hidden = !readRosterOverride();
    };

    const recenterToToday = () => {
      const today = new Date();
      state.calendarCursor = new Date(today.getFullYear(), today.getMonth(), 1);
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const proximaBajada = nextDownInput?.value;
      const parsed = proximaBajada ? new Date(`${proximaBajada}T00:00:00`) : null;
      if (!parsed || Number.isNaN(parsed.getTime())) {
        flash(TEXTOS.rosterEditorInvalidMsg || "Elige una fecha válida.");
        return;
      }

      const saved = writeRosterOverride({
        proximaBajada,
        diasMina: Math.max(1, Number(mineDaysInput?.value) || 14),
        diasDescanso: Math.max(1, Number(restDaysInput?.value) || 7),
        horaRegreso: returnTimeInput?.value || "21:00"
      });

      if (!saved) {
        flash(TEXTOS.rosterEditorStorageError || "No se pudo guardar en este navegador.");
        return;
      }

      recenterToToday();
      refreshRoster();
      refreshCounters();
      fillForm();
      flash(TEXTOS.rosterEditorSavedMsg || "Guardado.");
    });

    resetBtn?.addEventListener("click", () => {
      clearRosterOverride();
      recenterToToday();
      refreshRoster();
      refreshCounters();
      fillForm();
      flash(TEXTOS.rosterEditorResetMsg || "Listo.");
    });

    fillForm();
  }

  /* ---------------------------------------------------------------------------
     MENSAJE SORPRESA
  --------------------------------------------------------------------------- */
  function setupSurprise() {
    const btn = $("#surpriseBtn");
    const message = $("#surpriseMessage");
    if (!btn || !message) return;

    message.textContent = TEXTOS.surpriseMessage || "";
    btn.textContent = TEXTOS.surpriseOpen || "Ver mensaje sorpresa 💗";
    btn.addEventListener("click", () => {
      const open = message.classList.toggle("show");
      btn.textContent = open
        ? (TEXTOS.surpriseClose || "Ocultar mensaje 💌")
        : (TEXTOS.surpriseOpen || "Ver mensaje sorpresa 💗");
    });
  }

  /* ---------------------------------------------------------------------------
     MÚSICA: una sola canción, controlada por eventos del <audio>.
  --------------------------------------------------------------------------- */
  function setupMusic() {
    const audio = $("#audioPlayer");
    const playBtn = $("#playMusicBtn");
    const volume = $("#volumeRange");
    const song = CONFIG.musica?.cancion;

    if (!audio || !song?.src) {
      $("#musica")?.remove();
      return;
    }

    audio.src = song.src;
    audio.volume = Number(CONFIG.musica?.volumenInicial ?? 0.24);
    if (volume) volume.value = audio.volume;

    safeText("#currentSongTitle", song.titulo || "Nuestra canción");
    safeText("#currentSongArtist", song.artista || "");

    const syncButton = () => {
      if (playBtn) {
        playBtn.textContent = state.isPlaying
          ? (TEXTOS.musicPause || "Pausar ⏸")
          : (TEXTOS.musicPlay || "Reproducir 🎵");
      }
    };
    syncButton();

    playBtn?.addEventListener("click", async () => {
      try {
        if (state.isPlaying) audio.pause();
        else await audio.play();
      } catch (_) {
        safeText("#currentSongArtist", "No se pudo reproducir el audio en este navegador.");
      }
    });

    audio.addEventListener("play", () => { state.isPlaying = true; syncButton(); });
    audio.addEventListener("pause", () => { state.isPlaying = false; syncButton(); });
    audio.addEventListener("ended", () => { state.isPlaying = false; syncButton(); });
    volume?.addEventListener("input", () => { audio.volume = Number(volume.value); });
  }

  /* ---------------------------------------------------------------------------
     LA BÓVEDA: cartas que se desbloquean con el tiempo.
  --------------------------------------------------------------------------- */
  function goToConstelacion() {
    $("#constelacion")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderBoveda() {
    const grid = $("#bovedaGrid");
    if (!grid) return;

    const cartas = [...(CONFIG.boveda?.cartas || [])].sort(
      (a, b) => new Date(a.fecha) - new Date(b.fecha)
    );

    grid.innerHTML = "";
    const now = new Date();

    if (!cartas.length) {
      grid.innerHTML = `<p class="boveda-empty">Aún no hay cartas. Agrega la primera en <code>boveda.cartas</code> dentro de <code>assets/js/config.js</code>.</p>`;
      return;
    }

    cartas.forEach((carta, index) => {
      const fecha = new Date(carta.fecha);
      const isLocked = fecha > now;
      const card = document.createElement("article");
      card.className = `boveda-card glass-soft ${isLocked ? "is-locked" : "is-unlocked"}`;
      card.style.animationDelay = `${index * 60}ms`;

      if (isLocked) {
        const diff = calculateDiff(now, fecha);
        const partes = [];
        if (diff.years) partes.push(`${diff.years} a`);
        if (diff.months) partes.push(`${diff.months} m`);
        partes.push(`${diff.days} d`);
        card.innerHTML = `
          <span class="boveda-icon">🔒</span>
          <h3>${TEXTOS.bovedaLockedTitle || "Carta sellada"}</h3>
          <p class="boveda-lock-note">Se abre el ${formatDateLong(fecha)}</p>
          <span class="boveda-date">Faltan ${partes.join(" ")}</span>
        `;
      } else {
        const mensaje = carta.mensaje || "";
        const preview = mensaje.slice(0, 90);
        card.innerHTML = `
          <span class="boveda-icon">${carta.icono || "💌"}</span>
          <h3>${carta.titulo || "Una carta para ti"}</h3>
          <p>${preview}${mensaje.length > 90 ? "…" : ""}</p>
          <span class="boveda-date">Desbloqueada el ${formatDateLong(fecha)}</span>
        `;
        card.addEventListener("click", () => openBovedaModal(carta, fecha));
      }

      grid.appendChild(card);
    });
  }

  function openBovedaModal(carta, fecha) {
    const modal = $("#bovedaModal");
    if (!modal) return;
    safeText("#bovedaModalIcon", carta.icono || "💌");
    safeText("#bovedaModalDate", `Desbloqueada el ${formatDateLong(fecha)}`);
    safeText("#bovedaModalTitle", carta.titulo || "Una carta para ti");
    safeText("#bovedaModalMessage", carta.mensaje || "");

    const action = $("#bovedaModalAction");
    if (action) {
      const isConstelacion = carta.accion?.tipo === "constelacion";
      action.hidden = !isConstelacion;
      if (isConstelacion) {
        action.textContent = carta.accion.etiqueta || "Ir a nuestra constelación ✦";
        action.href = "#constelacion";
        action.onclick = (event) => {
          event.preventDefault();
          closeBovedaModal();
          goToConstelacion();
        };
      } else {
        action.onclick = null;
      }
    }

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeBovedaModal() {
    const modal = $("#bovedaModal");
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  function setupBoveda() {
    renderBoveda();
    // Revisa cada minuto por si una carta se desbloquea sin recargar.
    setInterval(renderBoveda, 60000);

    $("#bovedaModalClose")?.addEventListener("click", closeBovedaModal);
    $("#bovedaModal")?.addEventListener("click", (event) => {
      if (event.target.id === "bovedaModal") closeBovedaModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeBovedaModal();
    });
  }

  /* ---------------------------------------------------------------------------
     CONSTELACIÓN: cielo decorativo animado + enlace a la experiencia completa.
  --------------------------------------------------------------------------- */
  function setupConstelacionTeaser() {
    const canvas = $("#constelacionTeaser");
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars = [];

    const seed = () => {
      const w = canvas.clientWidth || 600;
      const h = canvas.clientHeight || 240;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.round(w / 14));
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.4 + 0.4,
        tw: Math.random() * Math.PI * 2
      }));
    };

    const draw = (t) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const path = stars.slice(0, 6);
      ctx.strokeStyle = "rgba(255,158,184,0.32)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      path.forEach((s, i) => {
        const x = s.x * w;
        const y = s.y * h;
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();

      stars.forEach((s) => {
        const tw = reduceMotion ? 0.7 : 0.5 + 0.5 * Math.sin(t * 0.002 + s.tw);
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r * (0.7 + tw * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,248,251,${(0.3 + tw * 0.5).toFixed(3)})`;
        ctx.fill();
      });

      if (!reduceMotion) requestAnimationFrame(draw);
    };

    seed();
    draw(0);
    window.addEventListener("resize", () => {
      seed();
      if (reduceMotion) draw(0);
    });
  }

  /* ---------------------------------------------------------------------------
     MINIJUEGO: Memory Match con emojis de config.juego.parejas
  --------------------------------------------------------------------------- */
  function setupMemoryGame() {
    const board = $("#memoryBoard");
    const movesEl = $("#gameMoves");
    const pairsEl = $("#gamePairs");
    const winEl = $("#gameWin");
    if (!board) return;

    const symbols = (CONFIG.juego?.parejas || ["💌", "🌙", "✦", "🎧"]).slice(0, 8);
    const totalPairs = symbols.length;
    const game = { first: null, lock: false, moves: 0, matched: 0 };

    const reset = () => {
      Object.assign(game, { first: null, lock: false, moves: 0, matched: 0 });
      if (movesEl) movesEl.textContent = "0";
      if (pairsEl) pairsEl.textContent = `0/${totalPairs}`;
      if (winEl) winEl.hidden = true;
      board.classList.remove("is-won");
      board.innerHTML = shuffle([...symbols, ...symbols]).map((symbol) => `
        <button class="memory-card" type="button" data-symbol="${symbol}" aria-label="Carta oculta">
          <span class="memory-card-inner">
            <span class="memory-face memory-front">✦</span>
            <span class="memory-face memory-back">${symbol}</span>
          </span>
        </button>
      `).join("");
    };

    const endGame = () => {
      board.classList.add("is-won");
      if (winEl) winEl.hidden = false;
      burstHearts(26);
    };

    const flip = (card) => {
      if (game.lock || card.classList.contains("is-flipped") || card.classList.contains("is-matched")) return;
      card.classList.add("is-flipped");

      if (!game.first) {
        game.first = card;
        return;
      }

      game.moves += 1;
      if (movesEl) movesEl.textContent = String(game.moves);

      if (game.first.dataset.symbol === card.dataset.symbol) {
        game.first.classList.add("is-matched");
        card.classList.add("is-matched");
        game.first = null;
        game.matched += 1;
        if (pairsEl) pairsEl.textContent = `${game.matched}/${totalPairs}`;
        if (game.matched === totalPairs) endGame();
      } else {
        game.lock = true;
        const [a, b] = [game.first, card];
        game.first = null;
        setTimeout(() => {
          a.classList.remove("is-flipped");
          b.classList.remove("is-flipped");
          game.lock = false;
        }, 750);
      }
    };

    board.addEventListener("click", (event) => {
      const card = event.target.closest(".memory-card");
      if (card && board.contains(card)) flip(card);
    });
    $("#gameRestart")?.addEventListener("click", reset);
    $("#gamePlayAgain")?.addEventListener("click", reset);

    reset();
  }

  /* ---------------------------------------------------------------------------
     ARRANQUE
  --------------------------------------------------------------------------- */
  function init() {
    bindTexts();
    createHearts();
    setupWelcomeAndLetter();
    setupRevealAndProgress();
    setupMonthlyTimeline();
    setupCounters();
    setupRosterCalendar();
    setupSurprise();
    setupMusic();
    setupBoveda();
    setupConstelacionTeaser();
    setupMemoryGame();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
