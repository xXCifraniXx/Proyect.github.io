(() => {
  const CONFIG = window.APP_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const DB_NAME = "romantic_landing_media_v1";
  const DB_VERSION = 1;
  const STORE_PHOTOS = "photos";
  const STORE_MUSIC = "music";
  const URL_PHOTOS_KEY = "romantic_landing_url_photos";

  const state = {
    currentSongIndex: 0,
    isPlaying: false,
    galleryIndex: 0,
    galleryTimer: null,
    galleryPaused: false,
    galleryItems: [],
    localObjectUrls: [],
    calendarCursor: null,
    calendarMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  };

  function safeText(id, value) {
    const el = typeof id === "string" ? $(id) : id;
    if (el && value !== undefined && value !== null) el.textContent = value;
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB no disponible"));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_PHOTOS)) db.createObjectStore(STORE_PHOTOS, { keyPath: "id" });
        if (!db.objectStoreNames.contains(STORE_MUSIC)) db.createObjectStore(STORE_MUSIC, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function idbPut(storeName, value) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function idbGet(storeName, id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbGetAll(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbClear(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  function setConfigText() {
    const nombres = CONFIG.nombres || {};
    const textos = CONFIG.textos || {};

    document.title = `Para ${nombres.novia || "Anthuanete"} | Una carta de ${nombres.autor || "Jorge"}`;
    safeText("#brandText", `Para ${nombres.novia || "Anthuanete"}`);
    safeText("#welcomeEyebrow", textos.welcomeEyebrow);
    safeText("#welcomeTitle", textos.welcomeTitle);
    safeText("#welcomeText", textos.welcomeText);
    safeText("#heroEyebrow", textos.heroEyebrow);
    safeText("#heroTitle", textos.heroTitle);
    safeText("#heroIntro", textos.heroIntro);
    safeText("#letterTitle", textos.letterTitle);
    safeText("#letterMessage", textos.letterMessage);
    safeText("#letterSignature", textos.letterSignature);
    safeText("#sectionCartaIntro", textos.cartaIntro);
    safeText("#surpriseMessage", textos.surpriseMessage);
    safeText("#timeIntro", textos.timeIntro);
    safeText("#returnTitle", textos.returnTitle);
    safeText("#returnText", textos.returnText);
    safeText("#calendarTitle", textos.calendarTitle);
    safeText("#calendarIntro", textos.calendarIntro);
    safeText("#finalPhrase", textos.finalPhrase);
    safeText("#finalSign", textos.finalSign);
  }

  function renderStory() {
    const grid = $("#storyGrid");
    if (!grid) return;
    const items = CONFIG.historia || [];
    grid.innerHTML = items.map((item) => `
      <article class="story-card glass-soft">
        <span>${item.numero || ""}</span>
        <h3>${item.titulo || ""}</h3>
        <p>${item.texto || ""}</p>
      </article>
    `).join("");
  }

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
      if (openLetterBtn) openLetterBtn.textContent = isOpen ? "Cerrar carta" : "Abrir carta";
      if (letterHint) {
        letterHint.textContent = isOpen
          ? "La carta ya está abierta. Puedes tocar el sobre para cerrarla."
          : "Toca el sobre para abrirlo con calma.";
      }
    };

    enterBtn?.addEventListener("click", () => {
      welcome?.classList.add("hide");
      setEnvelopeState(false);
    });

    const toggleEnvelope = () => {
      setEnvelopeState(!envelope?.classList.contains("open"));
    };

    envelope?.addEventListener("click", toggleEnvelope);
    envelope?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleEnvelope();
      }
    });

    openLetterBtn?.addEventListener("click", () => {
      const shouldOpen = !envelope?.classList.contains("open");
      setEnvelopeState(shouldOpen);
      envelope?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    // La carta queda cerrada hasta que ella toque el sobre o el boton.
    setEnvelopeState(false);
  }

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

  function pad2(value) {
    return String(value).padStart(2, "0");
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

  function formatDateLong(date) {
    try {
      return date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    } catch (_) {
      return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
    }
  }

  function getRotationInfo(date = new Date()) {
    const minaCfg = CONFIG.rotacionMina || {};
    const cfg = CONFIG.rotacion || {
      activa: minaCfg.activa,
      salidaBase: minaCfg.salidaBase,
      diasMina: minaCfg.diasMina,
      diasCasa: minaCfg.diasDescanso,
      horaRegreso: minaCfg.horaRegreso,
      horaSalida: minaCfg.horaSalida,
      textoEnCasa: "Está en sus días de descanso.",
      textoEnMina: "Está en mina, pero cada día que pasa también acerca más el abrazo de regreso."
    };
    if (cfg.activa === false || !cfg.salidaBase) return null;

    const start = new Date(cfg.salidaBase);
    if (Number.isNaN(start.getTime())) return null;

    const daysMine = Number(cfg.diasMina || 14);
    const daysHome = Number(cfg.diasCasa || cfg.diasDescanso || 7);
    const cycle = daysMine + daysHome;
    const currentDay = dayNumber(date);
    const startDay = dayNumber(start);
    const diff = currentDay - startDay;
    const cycleDay = mod(diff, cycle);
    const cycleStartDay = currentDay - cycleDay;
    const returnDay = cycleStartDay + daysMine;
    const nextDepartureDay = cycleStartDay + cycle;
    const nextReturnDay = cycleDay <= daysMine ? returnDay : nextDepartureDay + daysMine;

    let phase = "casa";
    let label = "En casa";
    let detail = `Día ${cycleDay - daysMine + 1} de ${daysHome} en casa`;

    if (cycleDay === 0) {
      phase = "subida";
      label = "Subida a mina";
      detail = `Día 1 de ${daysMine} en mina`;
    } else if (cycleDay > 0 && cycleDay < daysMine) {
      phase = "mina";
      label = "En mina";
      detail = `Día ${cycleDay + 1} de ${daysMine} en mina`;
    } else if (cycleDay === daysMine) {
      phase = "bajada";
      label = "Día de bajada";
      detail = "Regresa por la noche";
    }

    const nextReturnDate = applyTime(dateFromDayNumber(nextReturnDay), cfg.horaRegreso || "20:00");
    const nextDepartureDate = applyTime(dateFromDayNumber(nextDepartureDay), cfg.horaSalida || "07:00");
    const countdownTarget = phase === "casa" ? nextDepartureDate : nextReturnDate;

    return {
      cfg,
      phase,
      label,
      detail,
      cycleDay,
      daysMine,
      daysHome,
      cycle,
      nextReturnDate,
      nextDepartureDate,
      countdownTarget,
      daysToReturn: Math.max(0, nextReturnDay - currentDay),
      daysToDeparture: Math.max(0, nextDepartureDay - currentDay)
    };
  }

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
        const ms = Math.max(0, targetDate - now);
        const days = Math.floor(ms / 86400000);
        const hours = Math.floor((ms % 86400000) / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        safeText("#returnDays", days);
        safeText("#returnHours", hours);
        safeText("#returnMinutes", minutes);
        safeText("#returnSeconds", seconds);

        if (rotation) {
          if (rotation.phase === "casa") {
            safeText("#returnTitle", "Próxima subida");
            safeText("#returnText", `Está en casa. La próxima subida sería el ${formatDateLong(rotation.nextDepartureDate)}.`);
          } else if (rotation.phase === "bajada") {
            safeText("#returnTitle", "Hoy es día de bajada");
            safeText("#returnText", `Hoy regresa por la noche: ${formatDateLong(rotation.nextReturnDate)}.`);
          } else {
            safeText("#returnTitle", CONFIG.textos?.returnTitle || "Para volver a verte");
            safeText("#returnText", `Próxima bajada: ${formatDateLong(rotation.nextReturnDate)}.`);
          }
        }
      } else {
        $("#returnCard")?.remove();
      }
    };

    update();
    setInterval(update, 1000);
  }

  function getPhaseForCalendar(date) {
    const info = getRotationInfo(date);
    if (!info) return { phase: "casa", label: "Casa", detail: "" };
    if (info.phase === "subida") return { phase: "subida", label: "Subida", detail: info.detail };
    if (info.phase === "mina") return { phase: "mina", label: "Mina", detail: info.detail };
    if (info.phase === "bajada") return { phase: "bajada", label: "Bajada", detail: info.detail };
    return { phase: "casa", label: "Casa", detail: info.detail };
  }

  function updateRotationStatus() {
    const info = getRotationInfo(new Date());
    const panel = $("#calendarStatus");
    if (!info || !panel) {
      $("#calendario")?.remove();
      return;
    }

    safeText("#calendarStatusLabel", info.label);
    safeText("#calendarStatusTitle", info.detail);

    if (info.phase === "casa") {
      safeText("#calendarStatusText", `${info.cfg.textoEnCasa || "Está en casa."} Próxima subida: ${formatDateLong(info.nextDepartureDate)}.`);
    } else if (info.phase === "bajada") {
      safeText("#calendarStatusText", `Hoy es día de bajada. Regresa por la noche (${formatDateLong(info.nextReturnDate)}).`);
    } else {
      safeText("#calendarStatusText", `${info.cfg.textoEnMina || "Está en mina."} Próxima bajada: ${formatDateLong(info.nextReturnDate)}.`);
    }
  }

  function renderRotationCalendar() {
    const container = $("#rotationCalendar");
    const label = $("#calendarMonthLabel");
    if (!container || !label || !getRotationInfo(new Date())) return;

    const monthDate = state.calendarMonth;
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const first = new Date(year, month, 1);
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstWeekdayMonday = (first.getDay() + 6) % 7;
    const todayNumber = dayNumber(new Date());

    label.textContent = first.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    container.innerHTML = "";

    for (let i = 0; i < firstWeekdayMonday; i += 1) {
      const empty = document.createElement("div");
      empty.className = "calendar-day empty";
      container.appendChild(empty);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(year, month, day);
      const phase = getPhaseForCalendar(date);
      const cell = document.createElement("article");
      cell.className = `calendar-day ${phase.phase}`;
      if (dayNumber(date) === todayNumber) cell.classList.add("today");
      cell.innerHTML = `
        <div>
          <strong>${day}</strong>
          <span>${phase.detail}</span>
        </div>
        <small>${phase.label}</small>
      `;
      cell.title = `${formatDateLong(date)} - ${phase.detail}`;
      container.appendChild(cell);
    }
  }

  function setupRotationCalendar() {
    if (!getRotationInfo(new Date())) {
      $("#calendario")?.remove();
      return;
    }

    updateRotationStatus();
    renderRotationCalendar();

    $("#prevCalendarMonth")?.addEventListener("click", () => {
      state.calendarMonth = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() - 1, 1);
      renderRotationCalendar();
    });

    $("#nextCalendarMonth")?.addEventListener("click", () => {
      state.calendarMonth = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() + 1, 1);
      renderRotationCalendar();
    });

    $("#todayCalendarMonth")?.addEventListener("click", () => {
      const now = new Date();
      state.calendarMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      renderRotationCalendar();
      updateRotationStatus();
    });

    setInterval(() => {
      updateRotationStatus();
      renderRotationCalendar();
    }, 60000);
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
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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

  function getRosterConfig() {
    const cfg = CONFIG.rotacionMina || {};
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
      monthsToShow: Math.max(1, Math.min(4, Number(cfg.mesesAMostrar || 1)))
    };
  }

  function buildRosterCycle(roster, cycleNumber) {
    const startDay = addDays(roster.baseDay, cycleNumber * roster.cycleDays);
    const start = setClock(startDay, { hour: roster.base.getHours(), minute: roster.base.getMinutes() });
    const returnDay = addDays(startDay, roster.mineDays);
    const returnDate = setClock(returnDay, roster.returnClock);
    const nextStartDay = addDays(startDay, roster.cycleDays);
    const nextStart = setClock(nextStartDay, { hour: roster.base.getHours(), minute: roster.base.getMinutes() });
    return { startDay, start, returnDay, returnDate, nextStartDay, nextStart };
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
        phase: "before",
        title: "Próxima subida programada",
        text: `La rotación empezará el ${formatLongDate(cycle.start)}.`,
        targetLabel: "Próxima subida",
        target: cycle.start,
        cycle
      };
    }

    if (now < cycle.returnDate) {
      return {
        phase: "mine",
        title: "Ahora estás en mina 😿",
        text: `La próxima bajada será el ${formatLongDate(cycle.returnDate)} por la noche. Falta cada vez menos para volver a verte.`,
        targetLabel: "Próxima bajada",
        target: cycle.returnDate,
        cycle
      };
    }

    return {
      phase: "rest",
      title: "Estás en tus días de bajada 😼",
      text: `La próxima subida será el ${formatLongDate(cycle.nextStart)}. Estos días son para descansar y guardar recuerdos bonitos 💜.`,
      targetLabel: "Próxima subida",
      target: cycle.nextStart,
      cycle
    };
  }

  function classifyRosterDay(roster, day) {
    const diff = diffCalendarDays(roster.baseDay, day);
    if (diff < 0) return { type: "none", label: "" };
    const index = ((diff % roster.cycleDays) + roster.cycleDays) % roster.cycleDays;

    if (index === 0) return { type: "departure mine", label: "Sube" };
    if (index > 0 && index < roster.mineDays) return { type: "mine", label: "Mina" };
    if (index === roster.mineDays) return { type: "return", label: "Bajada" };
    return { type: "rest", label: "Descanso" };
  }

  function updateRosterCountdown(target) {
    const ms = Math.max(0, target - new Date());
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    safeText("#rosterDays", days);
    safeText("#rosterHours", hours);
    safeText("#rosterMinutes", minutes);
    safeText("#rosterSeconds", seconds);
  }

  function renderRosterSummary() {
    const roster = getRosterConfig();
    const section = $("#calendario");
    if (!roster.active) {
      section?.remove();
      return null;
    }

    const phase = getCurrentRosterPhase(roster);
    if (!phase) return roster;
    safeText("#rosterStatusTitle", phase.title);
    safeText("#rosterStatusText", phase.text);
    safeText("#rosterCountdownLabel", phase.targetLabel);
    updateRosterCountdown(phase.target);
    return roster;
  }

  function renderCalendarMonths(roster) {
    const monthsEl = $("#calendarMonths");
    const rangeLabel = $("#calendarRangeLabel");
    if (!monthsEl) return;

    const today = new Date();
    const cursor = state.calendarCursor || new Date(today.getFullYear(), today.getMonth(), 1);
    state.calendarCursor = cursor;
    const monthsToShow = roster.monthsToShow;
    const monthDates = Array.from({ length: monthsToShow }, (_, index) => new Date(cursor.getFullYear(), cursor.getMonth() + index, 1));

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

    setInterval(() => {
      const currentRoster = renderRosterSummary();
      if (currentRoster) renderCalendarMonths(currentRoster);
    }, 1000);

    $("#calendarPrev")?.addEventListener("click", () => {
      state.calendarCursor = new Date(state.calendarCursor.getFullYear(), state.calendarCursor.getMonth() - 1, 1);
      renderCalendarMonths(roster);
    });

    $("#calendarNext")?.addEventListener("click", () => {
      state.calendarCursor = new Date(state.calendarCursor.getFullYear(), state.calendarCursor.getMonth() + 1, 1);
      renderCalendarMonths(roster);
    });

    $("#calendarToday")?.addEventListener("click", () => {
      const today = new Date();
      state.calendarCursor = new Date(today.getFullYear(), today.getMonth(), 1);
      const currentRoster = renderRosterSummary();
      renderCalendarMonths(currentRoster || roster);
    });
  }

  function setupSurprise() {
    const btn = $("#surpriseBtn");
    const message = $("#surpriseMessage");
    btn?.addEventListener("click", () => {
      message?.classList.toggle("show");
      btn.textContent = message?.classList.contains("show") ? "Ocultar mensaje 💌" : "Ver mensaje sorpresa 💗";
    });
  }

  function setupMusic() {
    const audio = $("#audioPlayer");
    const select = $("#musicSelect");
    const playBtn = $("#playMusicBtn");
    const prevBtn = $("#prevSongBtn");
    const nextBtn = $("#nextSongBtn");
    const title = $("#currentSongTitle");
    const artist = $("#currentSongArtist");
    const status = $("#musicStatus");
    const volume = $("#volumeRange");
    const localInput = $("#localMusicInput");
    const playlist = [...(CONFIG.musica?.playlist || [])];

    if (!audio || !select) return;

    audio.volume = Number(CONFIG.musica?.volumenInicial ?? 0.24);
    if (volume) volume.value = audio.volume;

    function renderSelect(extraLocal = false) {
      select.innerHTML = playlist.map((song, index) => `<option value="${index}">${song.titulo}</option>`).join("");
      if (extraLocal) {
        const option = document.createElement("option");
        option.value = "local-saved";
        option.textContent = "Canción guardada en este dispositivo";
        select.appendChild(option);
      }
    }

    function setSong(index) {
      const song = playlist[index];
      if (!song) return;
      state.currentSongIndex = index;
      audio.src = song.src;
      safeText(title, song.titulo || "Canción");
      safeText(artist, song.artista || "");
      safeText(status, "Lista para reproducir. La música inicia cuando presionas el botón.");
      select.value = String(index);
      state.isPlaying = false;
      if (playBtn) playBtn.textContent = "Reproducir 🎵";
    }

    async function playPause() {
      if (!audio.src) return;
      try {
        if (!state.isPlaying) {
          await audio.play();
          state.isPlaying = true;
          if (playBtn) playBtn.textContent = "Pausar ⏸";
          safeText(status, "Música reproduciéndose.");
        } else {
          audio.pause();
          state.isPlaying = false;
          if (playBtn) playBtn.textContent = "Reproducir 🎵";
          safeText(status, "Música pausada.");
        }
      } catch (error) {
        safeText(status, "No se pudo reproducir. Revisa que el archivo exista y el navegador permita audio.");
      }
    }

    async function loadSavedMusicOption() {
      try {
        const saved = await idbGet(STORE_MUSIC, "custom");
        if (saved?.blob) renderSelect(true);
      } catch (_) {
        renderSelect(false);
      }
    }

    select.addEventListener("change", async () => {
      if (select.value === "local-saved") {
        const saved = await idbGet(STORE_MUSIC, "custom");
        if (saved?.blob) {
          audio.src = URL.createObjectURL(saved.blob);
          safeText(title, saved.name || "Canción guardada");
          safeText(artist, "Guardada en este dispositivo");
          safeText(status, "Canción local cargada desde este navegador.");
          state.isPlaying = false;
          if (playBtn) playBtn.textContent = "Reproducir 🎵";
        }
        return;
      }
      setSong(Number(select.value));
    });

    playBtn?.addEventListener("click", playPause);
    prevBtn?.addEventListener("click", () => {
      if (!playlist.length) return;
      const nextIndex = (state.currentSongIndex - 1 + playlist.length) % playlist.length;
      setSong(nextIndex);
    });
    nextBtn?.addEventListener("click", () => {
      if (!playlist.length) return;
      const nextIndex = (state.currentSongIndex + 1) % playlist.length;
      setSong(nextIndex);
    });
    volume?.addEventListener("input", () => { audio.volume = Number(volume.value); });
    audio.addEventListener("ended", () => {
      state.isPlaying = false;
      if (playBtn) playBtn.textContent = "Reproducir 🎵";
    });

    localInput?.addEventListener("change", async () => {
      const file = localInput.files?.[0];
      if (!file) return;
      const objectUrl = URL.createObjectURL(file);
      audio.src = objectUrl;
      safeText(title, file.name.replace(/\.[^/.]+$/, ""));
      safeText(artist, "Elegida desde este dispositivo");
      safeText(status, "Canción local cargada. También intentaré guardarla en este navegador.");
      try {
        await idbPut(STORE_MUSIC, { id: "custom", name: file.name, type: file.type, blob: file, updatedAt: Date.now() });
        renderSelect(true);
        select.value = "local-saved";
        safeText(status, "Canción guardada en este navegador. Para que todos la escuchen desde el link, súbela a assets/audio y configúrala.");
      } catch (_) {
        safeText(status, "Canción cargada para esta sesión. Si quieres que quede en el link, súbela a assets/audio.");
      }
      state.isPlaying = false;
      if (playBtn) playBtn.textContent = "Reproducir 🎵";
    });

    renderSelect(false);
    if (playlist.length) setSong(0);
    loadSavedMusicOption();
  }

  function getUrlPhotos() {
    try {
      return JSON.parse(localStorage.getItem(URL_PHOTOS_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  function saveUrlPhotos(items) {
    localStorage.setItem(URL_PHOTOS_KEY, JSON.stringify(items));
  }

  async function buildGalleryItems() {
    state.localObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    state.localObjectUrls = [];

    const permanent = (CONFIG.galeria || []).map((item, index) => ({
      id: `config-${index}`,
      src: item.src,
      titulo: item.titulo || "Recuerdo",
      frase: item.frase || "Un momento bonito.",
      type: "config"
    }));

    let localPhotos = [];
    try {
      const saved = await idbGetAll(STORE_PHOTOS);
      localPhotos = saved.map((item) => {
        const src = URL.createObjectURL(item.blob);
        state.localObjectUrls.push(src);
        return {
          id: item.id,
          src,
          titulo: item.titulo || "Foto agregada",
          frase: item.frase || "Agregada desde este dispositivo.",
          type: "local"
        };
      });
    } catch (_) {
      localPhotos = [];
    }

    const urlPhotos = getUrlPhotos().map((item, index) => ({
      id: `url-${index}`,
      src: item.src,
      titulo: item.titulo || "Foto por URL",
      frase: item.frase || "Agregada desde un enlace.",
      type: "url"
    }));

    state.galleryItems = [...permanent, ...urlPhotos, ...localPhotos];
  }

  function renderGallery() {
    const track = $("#galleryTrack");
    const dots = $("#galleryDots");
    if (!track || !dots) return;

    track.innerHTML = "";
    dots.innerHTML = "";

    state.galleryItems.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "gallery-card";
      card.dataset.index = String(index);
      card.innerHTML = `
        <img src="${item.src}" alt="${item.titulo}" loading="lazy" />
        <div class="gallery-caption">
          <strong>${item.titulo}</strong>
          <span>${item.frase}</span>
        </div>
      `;
      card.addEventListener("click", () => openLightbox(item));
      track.appendChild(card);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Ver foto ${index + 1}`);
      dot.addEventListener("click", () => goToGallery(index));
      dots.appendChild(dot);
    });

    state.galleryIndex = Math.min(state.galleryIndex, Math.max(0, state.galleryItems.length - 1));
    updateGalleryPosition();
  }

  function getVisibleCards() {
    if (window.matchMedia("(max-width: 640px)").matches) return 1;
    if (window.matchMedia("(max-width: 920px)").matches) return 2;
    return 3;
  }

  function updateGalleryPosition() {
    const track = $("#galleryTrack");
    if (!track) return;
    const firstCard = $(".gallery-card", track);
    const gap = 14;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + gap : 0;
    track.style.transform = `translateX(-${state.galleryIndex * cardWidth}px)`;
    $$("#galleryDots button").forEach((dot, index) => dot.classList.toggle("active", index === state.galleryIndex));
  }

  function goToGallery(index) {
    const maxIndex = Math.max(0, state.galleryItems.length - getVisibleCards());
    state.galleryIndex = Math.max(0, Math.min(index, maxIndex));
    updateGalleryPosition();
  }

  function nextGallery() {
    if (!state.galleryItems.length) return;
    const maxIndex = Math.max(0, state.galleryItems.length - getVisibleCards());
    state.galleryIndex = state.galleryIndex >= maxIndex ? 0 : state.galleryIndex + 1;
    updateGalleryPosition();
  }

  function prevGallery() {
    const maxIndex = Math.max(0, state.galleryItems.length - getVisibleCards());
    state.galleryIndex = state.galleryIndex <= 0 ? maxIndex : state.galleryIndex - 1;
    updateGalleryPosition();
  }

  function startGalleryTimer() {
    stopGalleryTimer();
    if (state.galleryPaused) return;
    const interval = CONFIG.opciones?.galeriaAutoMs || 3600;
    state.galleryTimer = setInterval(nextGallery, interval);
  }

  function stopGalleryTimer() {
    if (state.galleryTimer) clearInterval(state.galleryTimer);
    state.galleryTimer = null;
  }

  function openLightbox(item) {
    const lightbox = $("#lightbox");
    const image = $("#lightboxImage");
    const caption = $("#lightboxCaption");
    if (!lightbox || !image || !caption) return;
    image.src = item.src;
    image.alt = item.titulo;
    caption.textContent = `${item.titulo} — ${item.frase}`;
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
    stopGalleryTimer();
  }

  function closeLightbox() {
    const lightbox = $("#lightbox");
    const image = $("#lightboxImage");
    if (!lightbox || !image) return;
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    image.src = "";
    startGalleryTimer();
  }

  async function setupGallery() {
    await buildGalleryItems();
    renderGallery();
    startGalleryTimer();

    $("#galleryNext")?.addEventListener("click", nextGallery);
    $("#galleryPrev")?.addEventListener("click", prevGallery);
    window.addEventListener("resize", updateGalleryPosition);

    const toggleBtn = $("#toggleGalleryMotion");
    const updateGalleryToggleButton = () => {
      if (!toggleBtn) return;
      toggleBtn.textContent = state.galleryPaused ? "▶" : "⏸";
      toggleBtn.setAttribute("aria-label", state.galleryPaused ? "Reanudar galería" : "Pausar galería");
      toggleBtn.setAttribute("title", state.galleryPaused ? "Reanudar galería" : "Pausar galería");
    };
    updateGalleryToggleButton();
    toggleBtn?.addEventListener("click", () => {
      state.galleryPaused = !state.galleryPaused;
      updateGalleryToggleButton();
      if (state.galleryPaused) stopGalleryTimer();
      else startGalleryTimer();
    });

    const localPhotoInput = $("#localPhotoInput");
    localPhotoInput?.addEventListener("change", async () => {
      const files = Array.from(localPhotoInput.files || []).filter((file) => file.type.startsWith("image/"));
      for (const file of files) {
        try {
          await idbPut(STORE_PHOTOS, {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            titulo: file.name.replace(/\.[^/.]+$/, ""),
            frase: "Foto agregada desde este dispositivo.",
            type: file.type,
            blob: file,
            createdAt: Date.now()
          });
        } catch (_) {
          const src = URL.createObjectURL(file);
          state.localObjectUrls.push(src);
          state.galleryItems.push({ id: src, src, titulo: file.name, frase: "Agregada para esta sesión.", type: "session" });
        }
      }
      await buildGalleryItems();
      renderGallery();
      startGalleryTimer();
      localPhotoInput.value = "";
    });

    $("#clearLocalPhotosBtn")?.addEventListener("click", async () => {
      try { await idbClear(STORE_PHOTOS); } catch (_) {}
      localStorage.removeItem(URL_PHOTOS_KEY);
      await buildGalleryItems();
      renderGallery();
      startGalleryTimer();
    });

    $("#addPhotoUrlBtn")?.addEventListener("click", async () => {
      const input = $("#photoUrlInput");
      const src = input?.value.trim();
      if (!src || !/^https?:\/\//i.test(src)) {
        alert("Pega una URL válida que empiece con http o https.");
        return;
      }
      const items = getUrlPhotos();
      items.push({ src, titulo: "Foto agregada por URL", frase: "Imagen cargada desde un enlace." });
      saveUrlPhotos(items);
      input.value = "";
      await buildGalleryItems();
      renderGallery();
      startGalleryTimer();
    });

    $("#lightboxClose")?.addEventListener("click", closeLightbox);
    $("#lightbox")?.addEventListener("click", (event) => {
      if (event.target.id === "lightbox") closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
    });
  }

  function init() {
    setConfigText();
    renderStory();
    createHearts();
    setupWelcomeAndLetter();
    setupRevealAndProgress();
    setupCounters();
    setupRosterCalendar();
    setupSurprise();
    setupMusic();
    setupGallery();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
