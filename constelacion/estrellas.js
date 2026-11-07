/*
  CONSTELACIÓN DE NOSOTROS
  Un lienzo donde cada toque crea una estrella con un recuerdo.
  Las estrellas se conectan en el orden en que nacieron y forman una constelación.
  Todo se guarda en este navegador (localStorage) y se puede exportar como imagen.
*/
(function () {
  "use strict";

  var STORAGE_KEY = "constelacion-nosotros-v1";
  // Si nube.js está configurado con Firebase, las estrellas se comparten entre
  // los dos; localStorage queda como copia en este dispositivo.
  var sync = function (op, payload) {
    if (window.CieloSync && typeof window.CieloSync[op] === "function") window.CieloSync[op](payload);
  };
  var cloudState = "local";

  function makeId(s) {
    return "s" + Math.round(s.born || Date.now()).toString(36) + Math.random().toString(36).slice(2, 8);
  }
  var HIT_RADIUS = 26;        // px de tolerancia para tocar una estrella existente
  var TAP_MOVE_MAX = 10;      // px: si el dedo se mueve más que esto, no es un toque

  var canvas = document.getElementById("sky");
  var ctx = canvas.getContext("2d");

  var composer = document.getElementById("composer");
  var composerInput = document.getElementById("composerInput");
  var composerSave = document.getElementById("composerSave");
  var composerCancel = document.getElementById("composerCancel");

  var starPop = document.getElementById("starPop");
  var starPopLabel = document.getElementById("starPopLabel");
  var starPopDelete = document.getElementById("starPopDelete");

  var hint = document.getElementById("hint");
  var counter = document.getElementById("counter");
  var undoBtn = document.getElementById("undoBtn");
  var downloadBtn = document.getElementById("downloadBtn");
  var clearBtn = document.getElementById("clearBtn");

  var W = 0, H = 0, dpr = 1;
  var stars = load();
  var dust = [];
  var pendingPos = null;      // posición normalizada donde se creará la próxima estrella
  var activeStar = null;      // estrella seleccionada en el pop
  var labelTimer = 0;         // frames restantes para mostrar la etiqueta de la última estrella

  // Parallax: objetivo y valor suavizado
  var targetPX = 0, targetPY = 0, px = 0, py = 0;

  // ----- almacenamiento -----
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter(function (s) {
        return s && typeof s.x === "number" && typeof s.y === "number";
      }).map(function (s) {
        return {
          id: s.id || makeId(s),
          x: s.x, y: s.y,
          label: (s.label || "").toString().slice(0, 60),
          born: s.born || Date.now(),
          seed: Math.random() * 1000
        };
      });
    } catch (e) {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stars.map(function (s) {
        return { id: s.id, x: s.x, y: s.y, label: s.label, born: s.born };
      })));
    } catch (e) { /* modo privado, etc. */ }
    updateCounter();
  }

  function updateCounter() {
    var n = stars.length;
    var text = n === 0
      ? "El cielo está vacío. Empieza por la primera estrella."
      : n + (n === 1 ? " estrella en nuestro cielo" : " estrellas en nuestro cielo");
    if (cloudState === "online") text += " · compartido ✦";
    else if (cloudState === "offline") text += " · sin conexión, se enviará al volver";
    else if (cloudState === "error") text += " · sin nube, guardado solo en este dispositivo";
    counter.textContent = text;
    undoBtn.disabled = n === 0;
  }

  // ----- tamaño del lienzo -----
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildDust();
  }

  function buildDust() {
    var count = Math.round((W * H) / 6000);
    dust = [];
    for (var i = 0; i < count; i++) {
      dust.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.1 + 0.2,
        a: Math.random() * 0.5 + 0.15,
        tw: Math.random() * Math.PI * 2
      });
    }
  }

  // ----- dibujo -----
  function drawBackground(context, w, h) {
    var g = context.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#120817");
    g.addColorStop(0.5, "#231027");
    g.addColorStop(1, "#421b3f");
    context.fillStyle = g;
    context.fillRect(0, 0, w, h);

    // nebulosas suaves
    nebula(context, w * 0.18, h * 0.22, Math.max(w, h) * 0.5, "rgba(255,158,184,0.16)");
    nebula(context, w * 0.85, h * 0.30, Math.max(w, h) * 0.45, "rgba(201,155,255,0.16)");
    nebula(context, w * 0.55, h * 0.90, Math.max(w, h) * 0.55, "rgba(243,217,159,0.10)");
  }

  function nebula(context, x, y, radius, color) {
    var rg = context.createRadialGradient(x, y, 0, x, y, radius);
    rg.addColorStop(0, color);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = rg;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  function drawDust(context, w, h, offX, offY, t) {
    for (var i = 0; i < dust.length; i++) {
      var d = dust[i];
      var tw = 0.6 + 0.4 * Math.sin(t * 0.001 + d.tw);
      context.beginPath();
      context.arc(d.x * w + offX * 0.25, d.y * h + offY * 0.25, d.r, 0, Math.PI * 2);
      context.fillStyle = "rgba(255,255,255," + (d.a * tw).toFixed(3) + ")";
      context.fill();
    }
  }

  function drawConstellation(context, w, h, offX, offY, t, forExport) {
    if (stars.length === 0) return;

    // líneas en el orden de nacimiento
    if (stars.length > 1) {
      context.lineWidth = 1;
      for (var i = 0; i < stars.length - 1; i++) {
        var a = stars[i], b = stars[i + 1];
        var ax = a.x * w + offX, ay = a.y * h + offY;
        var bx = b.x * w + offX, by = b.y * h + offY;
        var lg = context.createLinearGradient(ax, ay, bx, by);
        lg.addColorStop(0, "rgba(255,158,184,0.45)");
        lg.addColorStop(1, "rgba(201,155,255,0.45)");
        context.strokeStyle = lg;
        context.beginPath();
        context.moveTo(ax, ay);
        context.lineTo(bx, by);
        context.stroke();
      }
    }

    // estrellas
    for (var j = 0; j < stars.length; j++) {
      var s = stars[j];
      var x = s.x * w + offX;
      var y = s.y * h + offY;
      var twinkle = 0.75 + 0.25 * Math.sin(t * 0.002 + s.seed);
      var core = 2.2 + 1.3 * twinkle;
      var glow = 22 * twinkle;

      var rg = context.createRadialGradient(x, y, 0, x, y, glow);
      rg.addColorStop(0, "rgba(255,249,251,0.9)");
      rg.addColorStop(0.25, "rgba(255,158,184,0.5)");
      rg.addColorStop(1, "rgba(255,158,184,0)");
      context.fillStyle = rg;
      context.beginPath();
      context.arc(x, y, glow, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#fff9fb";
      context.beginPath();
      context.arc(x, y, core, 0, Math.PI * 2);
      context.fill();

      // destello en cruz
      context.strokeStyle = "rgba(255,249,251," + (0.35 * twinkle).toFixed(2) + ")";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(x - glow * 0.6, y);
      context.lineTo(x + glow * 0.6, y);
      context.moveTo(x, y - glow * 0.6);
      context.lineTo(x, y + glow * 0.6);
      context.stroke();

      var showLabel = forExport || (j === stars.length - 1 && labelTimer > 0) || s._hover;
      if (showLabel && s.label) {
        drawLabel(context, x, y + glow + 4, s.label);
      }
    }
  }

  function drawLabel(context, x, y, text) {
    context.font = "13px Inter, system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "top";
    var padX = 8, padY = 4;
    var wText = context.measureText(text).width;
    var boxW = wText + padX * 2;
    var boxH = 20;
    context.fillStyle = "rgba(18,8,23,0.72)";
    roundRect(context, x - boxW / 2, y, boxW, boxH, 8);
    context.fill();
    context.fillStyle = "rgba(255,248,251,0.92)";
    context.fillText(text, x, y + padY);
  }

  function roundRect(context, x, y, w, h, r) {
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
  }

  // ----- bucle -----
  function frame(t) {
    px += (targetPX - px) * 0.06;
    py += (targetPY - py) * 0.06;
    if (labelTimer > 0) labelTimer--;

    ctx.clearRect(0, 0, W, H);
    drawBackground(ctx, W, H);
    drawDust(ctx, W, H, px, py, t);
    drawConstellation(ctx, W, H, px, py, t, false);

    if (activeStar) positionPop(activeStar);
    requestAnimationFrame(frame);
  }

  // ----- interacción -----
  function screenToNorm(clientX, clientY) {
    return { x: (clientX - px) / W, y: (clientY - py) / H };
  }

  function hitStar(clientX, clientY) {
    for (var i = stars.length - 1; i >= 0; i--) {
      var s = stars[i];
      var sx = s.x * W + px;
      var sy = s.y * H + py;
      if (Math.hypot(sx - clientX, sy - clientY) <= HIT_RADIUS) return s;
    }
    return null;
  }

  var down = null;
  canvas.addEventListener("pointerdown", function (e) {
    down = { x: e.clientX, y: e.clientY, moved: false };
  });
  canvas.addEventListener("pointermove", function (e) {
    targetPX = (e.clientX / W - 0.5) * -30;
    targetPY = (e.clientY / H - 0.5) * -30;
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > TAP_MOVE_MAX) {
      down.moved = true;
    }
    // hover para etiquetas en escritorio
    var hovered = hitStar(e.clientX, e.clientY);
    for (var i = 0; i < stars.length; i++) stars[i]._hover = false;
    if (hovered) hovered._hover = true;
    canvas.style.cursor = hovered ? "pointer" : "crosshair";
  });
  canvas.addEventListener("pointerup", function (e) {
    if (!down || down.moved) { down = null; return; }
    down = null;
    if (!composer.hidden) return;

    var hit = hitStar(e.clientX, e.clientY);
    if (hit) {
      openPop(hit);
      return;
    }
    hidePop();
    pendingPos = screenToNorm(e.clientX, e.clientY);
    openComposer();
  });
  canvas.addEventListener("pointercancel", function () { down = null; });

  window.addEventListener("deviceorientation", function (e) {
    if (e.gamma == null) return;
    targetPX = Math.max(-30, Math.min(30, e.gamma)) * -1;
    targetPY = Math.max(-30, Math.min(30, (e.beta || 0) - 45)) * -0.5;
  });

  // ----- composer -----
  function openComposer() {
    composer.hidden = false;
    composerInput.value = "";
    setTimeout(function () { composerInput.focus(); }, 30);
    fadeHint();
  }
  function closeComposer() {
    composer.hidden = true;
    pendingPos = null;
  }
  function commitStar() {
    if (!pendingPos) return;
    var label = composerInput.value.trim().slice(0, 60);
    var star = {
      x: Math.max(0.02, Math.min(0.98, pendingPos.x)),
      y: Math.max(0.06, Math.min(0.96, pendingPos.y)),
      label: label,
      born: Date.now(),
      seed: Math.random() * 1000
    };
    star.id = makeId(star);
    stars.push(star);
    labelTimer = 240;
    save();
    sync("add", star);
    closeComposer();
  }
  composerSave.addEventListener("click", commitStar);
  composerCancel.addEventListener("click", closeComposer);
  composerInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") commitStar();
    if (e.key === "Escape") closeComposer();
  });

  // ----- pop de estrella -----
  function openPop(star) {
    activeStar = star;
    starPopLabel.textContent = star.label || "estrella sin nombre";
    starPop.hidden = false;
    positionPop(star);
  }
  function positionPop(star) {
    starPop.style.left = (star.x * W + px) + "px";
    starPop.style.top = (star.y * H + py) + "px";
  }
  function hidePop() {
    activeStar = null;
    starPop.hidden = true;
  }
  starPopDelete.addEventListener("click", function () {
    if (!activeStar) return;
    var removed = activeStar;
    var idx = stars.indexOf(removed);
    if (idx >= 0) stars.splice(idx, 1);
    hidePop();
    save();
    sync("remove", removed);
  });
  document.addEventListener("pointerdown", function (e) {
    if (activeStar && !starPop.contains(e.target) && e.target !== canvas) hidePop();
  });

  // ----- botones -----
  undoBtn.addEventListener("click", function () {
    var removed = stars.pop();
    hidePop();
    save();
    if (removed) sync("remove", removed);
  });
  clearBtn.addEventListener("click", function () {
    if (stars.length === 0) return;
    var shared = cloudState === "online" || cloudState === "offline";
    var question = shared
      ? "¿Vaciar el cielo por completo? Se borra para los dos y no se puede deshacer."
      : "¿Vaciar el cielo por completo? Esto no se puede deshacer.";
    if (!window.confirm(question)) return;
    var removedAll = stars;
    stars = [];
    hidePop();
    save();
    sync("clear", removedAll);
  });
  downloadBtn.addEventListener("click", exportImage);

  function exportImage() {
    var scale = 2;
    var ex = document.createElement("canvas");
    ex.width = W * scale;
    ex.height = H * scale;
    var ectx = ex.getContext("2d");
    ectx.scale(scale, scale);
    var now = performance.now();
    drawBackground(ectx, W, H);
    drawDust(ectx, W, H, 0, 0, now);
    drawConstellation(ectx, W, H, 0, 0, now, true);

    ectx.font = "600 16px Inter, system-ui, sans-serif";
    ectx.fillStyle = "rgba(255,248,251,0.85)";
    ectx.textAlign = "left";
    ectx.textBaseline = "alphabetic";
    ectx.fillText("Constelación de nosotros", 20, H - 20);

    var link = document.createElement("a");
    link.download = "constelacion-de-nosotros.png";
    link.href = ex.toDataURL("image/png");
    link.click();
  }

  function fadeHint() { hint.classList.add("fade"); }

  // ----- puente con la nube (lo usa nube.js) -----
  window.Cielo = {
    // Estrellas guardadas en este dispositivo (para subirlas la primera vez).
    locales: function () {
      return stars.map(function (s) { return { id: s.id, x: s.x, y: s.y, label: s.label, born: s.born }; });
    },
    // Reemplaza el cielo por la versión compartida, conservando el brillo de cada estrella.
    reemplazar: function (list) {
      var seeds = {};
      stars.forEach(function (s) { seeds[s.id] = s.seed; });
      stars = list.filter(function (s) {
        return s && typeof s.x === "number" && typeof s.y === "number";
      }).map(function (s) {
        return {
          id: s.id,
          x: s.x, y: s.y,
          label: (s.label || "").toString().slice(0, 60),
          born: s.born || 0,
          seed: seeds[s.id] != null ? seeds[s.id] : Math.random() * 1000
        };
      }).sort(function (a, b) { return a.born - b.born; });
      if (activeStar) {
        var activeId = activeStar.id;
        var still = stars.filter(function (s) { return s.id === activeId; })[0];
        if (still) activeStar = still;
        else hidePop();
      }
      save();
      if (stars.length > 0) fadeHint();
    },
    estado: function (value) {
      cloudState = value;
      updateCounter();
    }
  };

  // ----- arranque -----
  window.addEventListener("resize", resize);
  resize();
  updateCounter();
  if (stars.length > 0) fadeHint();
  requestAnimationFrame(frame);
})();
