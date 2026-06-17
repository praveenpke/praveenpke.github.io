/* Praveen Emani — interactions (progressive enhancement)
   1) reveal-on-scroll  2) landing streaming intro + looping badge  3) golden-spiral rover */
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
    var phrases = ["AI/ML projects", "robotics", "LLM inference", "multi-agent systems",
                   "agent evaluation", "RAG pipelines", "autonomous agents"];
    var i = 0;
    function typeP(s, cb) {
      var j = 0;
      (function t() {
        el.textContent = s.slice(0, j);
        if (j++ <= s.length) setTimeout(t, 45 + Math.random() * 45); else cb();
      })();
    }
    function delP(cb) {
      var s = el.textContent, j = s.length;
      (function d() {
        el.textContent = s.slice(0, j);
        if (j-- > 0) setTimeout(d, 26); else cb();
      })();
    }
    function next() {
      var s = phrases[i % phrases.length]; i++;
      typeP(s, function () { setTimeout(function () { delP(next); }, 1500); });
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

  /* ---------- 3) golden-spiral rover ---------- */
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
    var W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R0 = 0;
    var THETA0 = Math.PI * 1.25;   // start in the upper-left
    var K = 0.20;                  // inward decay (~3-4 fibonacci-style turns)
    var V = 1.35;                  // ~constant linear speed (px/frame)
    var MINR = 7;
    var theta = THETA0, prevX = null, prevY = null;

    function reset() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = landing.clientWidth; H = landing.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W * 0.34; cy = H * 0.50;
      R0 = Math.min(cx, cy) * 1.25;   // start ~75% toward the top-left, not the corner
    }
    reset();
    window.addEventListener("resize", function () { reset(); theta = THETA0; prevX = prevY = null; }, { passive: true });

    function frame() {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      var r = R0 * Math.exp(-K * (theta - THETA0));
      var x = cx + r * Math.cos(theta), y = cy + r * Math.sin(theta);

      ctx.fillStyle = "rgba(255,77,61,0.6)";
      ctx.beginPath(); ctx.arc(x, y, 1.7, 0, Math.PI * 2); ctx.fill();

      var deg = 0;
      if (prevX !== null) deg = Math.atan2(y - prevY, x - prevX) * 180 / Math.PI;
      rover.style.transform = "translate(" + x + "px," + y + "px) rotate(" + deg + "deg)";
      prevX = x; prevY = y;

      theta += V / Math.max(r, 11);
      if (r < MINR) { theta = THETA0; prevX = prevY = null; }   // loop the spiral
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();
})();
