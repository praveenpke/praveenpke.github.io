/* Praveen Emani — interactions (progressive enhancement)
   1) reveal-on-scroll  2) landing streaming intro + looping badge  3) square-spiral grid rover */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(.16,1,.3,1)";

  /* ---------- 1) reveal-on-scroll ---------- */
  (function () {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;
    if (reduce) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    function check() {
      var h = window.innerHeight || document.documentElement.clientHeight;
      for (var i = els.length - 1; i >= 0; i--) {
        if (els[i].getBoundingClientRect().top < h * 0.9) { els[i].classList.add("in"); els.splice(i, 1); }
      }
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    check(); requestAnimationFrame(check); setTimeout(check, 300);
    setTimeout(function () { els.slice().forEach(function (el) { el.classList.add("in"); }); }, 1600);
  })();

  /* ---------- looping badge text ---------- */
  function startRotor(el) {
    if (!el) return;
    var phrases = ["AI/ML Projects", "Robotics", "LLM Inference", "Multi-Agent Systems",
                   "Agent Evaluation", "RAG Pipelines", "Autonomous Agents"];
    var i = 0;
    function typeP(s, cb) {
      var j = 0;
      (function t() {
        el.textContent = s.slice(0, j);
        if (j++ <= s.length) setTimeout(t, 85 + Math.random() * 70); else cb();
      })();
    }
    function delP(cb) {
      var s = el.textContent, j = s.length;
      (function d() {
        el.textContent = s.slice(0, j);
        if (j-- > 0) setTimeout(d, 45); else cb();
      })();
    }
    function next() {
      var s = phrases[i % phrases.length]; i++;
      typeP(s, function () { setTimeout(function () { delP(next); }, 1700); });
    }
    delP(next);
  }

  /* ---------- 2) landing streaming-text intro ---------- */
  (function () {
    var lead = document.querySelector(".hero .lead");
    var rotEl = document.querySelector(".avail-rot");
    if (!document.documentElement.classList.contains("anim")) return;
    if (!lead) { if (rotEl) startRotor(rotEl); return; }

    function show(el, delay) {
      if (!el) return;
      setTimeout(function () {
        el.style.transition = "opacity .55s " + EASE + ", transform .55s " + EASE;
        el.style.opacity = "1"; el.style.transform = "none";
      }, delay);
    }
    var avatar = document.querySelector(".hero-avatar"),
        kicker = document.querySelector(".hero .kicker"),
        h1 = document.querySelector(".hero h1"),
        after = [document.querySelector(".hero .availability"),
                 document.querySelector(".hero .cta-row"),
                 document.querySelector(".hero .stat-row")];

    show(avatar, 60); show(kicker, 200); show(h1, 340);

    function esc(c) { return c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c; }
    function typeLead(el, done) {
      var flat = [];
      Array.prototype.forEach.call(el.childNodes, function (n) {
        var b = n.nodeName === "B", t = n.textContent || "";
        for (var i = 0; i < t.length; i++) flat.push([t[i], b]);
      });
      el.innerHTML = ""; el.style.visibility = "visible";
      var typed = [], idx = 0;
      function render() {
        var html = "", open = false;
        for (var k = 0; k < typed.length; k++) {
          var b = typed[k][1];
          if (b && !open) { html += "<b>"; open = true; }
          else if (!b && open) { html += "</b>"; open = false; }
          html += esc(typed[k][0]);
        }
        if (open) html += "</b>";
        el.innerHTML = html + '<span class="cursor"></span>';
      }
      (function tick() {
        if (idx >= flat.length) {
          el.innerHTML = el.innerHTML.replace('<span class="cursor"></span>', "");
          if (done) done(); return;
        }
        typed.push(flat[idx]); idx++; render();
        var c = flat[idx - 1][0];
        var d = c === " " ? 26 : /[.,—–]/.test(c) ? 120 : (15 + Math.random() * 22);
        setTimeout(tick, d);
      })();
    }

    setTimeout(function () {
      typeLead(lead, function () {
        after.forEach(function (el, i) { show(el, i * 150); });
        setTimeout(function () { startRotor(rotEl); }, 700);
      });
    }, 760);
  })();

  /* ---------- 3) square-spiral grid rover ---------- */
  (function () {
    var landing = document.querySelector(".landing");
    if (!landing || reduce) return;

    var ROVER = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect x="6" y="7.5" width="12" height="9" rx="2.2" fill="rgba(20,19,19,.7)" stroke="currentColor" stroke-width="1.6"/>' +
      '<rect x="4.3" y="5.6" width="2.6" height="3.4" rx="1" fill="currentColor"/>' +
      '<rect x="4.3" y="15" width="2.6" height="3.4" rx="1" fill="currentColor"/>' +
      '<rect x="17.1" y="5.6" width="2.6" height="3.4" rx="1" fill="currentColor"/>' +
      '<rect x="17.1" y="15" width="2.6" height="3.4" rx="1" fill="currentColor"/>' +
      '<circle cx="13.6" cy="12" r="1.7" fill="currentColor"/></svg>';

    var layer = document.createElement("div"); layer.className = "rover-layer";
    var canvas = document.createElement("canvas"); canvas.className = "rover-canvas";
    var rover = document.createElement("div"); rover.className = "rover"; rover.innerHTML = ROVER;
    layer.appendChild(canvas); layer.appendChild(rover);
    landing.insertBefore(layer, landing.firstChild);

    var ctx = canvas.getContext("2d");
    var G = 58, STEP = 116, SPEED = 1.4, W = 0, H = 0, dpr = 1;
    var DIRV = [[1, 0], [0, 1], [-1, 0], [0, -1]];   // right, down, left, up
    var L, R, T, B, dir, x, y;

    function reset() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = landing.clientWidth; H = landing.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      L = G; T = G;
      R = Math.max(L + STEP, Math.floor((W - G) / G) * G);
      B = Math.max(T + STEP, Math.floor((H - G) / G) * G);
      dir = 0; x = L; y = T;
    }
    reset();
    window.addEventListener("resize", reset, { passive: true });

    function corner() {
      // reached the end of the current edge: inset one bound and turn inward
      if (dir === 0) { T += STEP; dir = 1; }
      else if (dir === 1) { R -= STEP; dir = 2; }
      else if (dir === 2) { B -= STEP; dir = 3; }
      else { L += STEP; dir = 0; }
      if (L >= R || T >= B) reset();   // spiral collapsed → restart from the outer square
    }

    function frame() {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.045)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      x += DIRV[dir][0] * SPEED; y += DIRV[dir][1] * SPEED;

      var reached = false;
      if (dir === 0 && x >= R) { x = R; reached = true; }
      else if (dir === 1 && y >= B) { y = B; reached = true; }
      else if (dir === 2 && x <= L) { x = L; reached = true; }
      else if (dir === 3 && y <= T) { y = T; reached = true; }

      ctx.fillStyle = "rgba(255,77,61,0.6)";
      ctx.beginPath(); ctx.arc(x, y, 1.7, 0, Math.PI * 2); ctx.fill();

      rover.style.transform = "translate(" + x + "px," + y + "px) rotate(" + (dir * 90) + "deg)";

      if (reached) corner();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();
})();
