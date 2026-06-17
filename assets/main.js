/* Praveen Emani — interactions (progressive enhancement)
   1) reveal-on-scroll  2) landing streaming-text intro  3) grid rover */
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

  /* ---------- 2) landing streaming-text intro ---------- */
  (function () {
    var lead = document.querySelector(".hero .lead");
    if (!lead || !document.documentElement.classList.contains("anim")) return;

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
        var b = n.nodeName === "B";
        var t = n.textContent || "";
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
          if (done) done();
          return;
        }
        typed.push(flat[idx]); idx++; render();
        var c = flat[idx - 1][0];
        var d = c === " " ? 26 : /[.,—–]/.test(c) ? 120 : (15 + Math.random() * 22);
        setTimeout(tick, d);
      })();
    }

    setTimeout(function () {
      typeLead(lead, function () { after.forEach(function (el, i) { show(el, i * 150); }); });
    }, 760);
  })();

  /* ---------- 3) grid rover ---------- */
  (function () {
    var landing = document.querySelector(".landing");
    if (!landing || reduce) return;

    var ROVER = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect x="6" y="7.5" width="12" height="9" rx="2.2" fill="rgba(20,19,19,.6)" stroke="currentColor" stroke-width="1.5"/>' +
      '<rect x="4.4" y="5.8" width="2.4" height="3.2" rx="1" fill="currentColor"/>' +
      '<rect x="4.4" y="15" width="2.4" height="3.2" rx="1" fill="currentColor"/>' +
      '<rect x="17.2" y="5.8" width="2.4" height="3.2" rx="1" fill="currentColor"/>' +
      '<rect x="17.2" y="15" width="2.4" height="3.2" rx="1" fill="currentColor"/>' +
      '<circle cx="14" cy="12" r="1.6" fill="currentColor"/></svg>';

    var layer = document.createElement("div"); layer.className = "rover-layer";
    var canvas = document.createElement("canvas"); canvas.className = "rover-canvas";
    var rover = document.createElement("div"); rover.className = "rover"; rover.innerHTML = ROVER;
    layer.appendChild(canvas); layer.appendChild(rover);
    landing.insertBefore(layer, landing.firstChild);

    var ctx = canvas.getContext("2d");
    var G = 58, SPEED = 0.85, W = 0, H = 0, dpr = 1;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = landing.clientWidth; H = landing.clientHeight;
      canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    var dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    var d = 0;
    var x = Math.max(1, Math.round((W * 0.28) / G)) * G;
    var y = Math.max(1, Math.round((H * 0.5) / G)) * G;

    function canGo(dir, gx, gy) {
      var nx = gx + dirs[dir][0] * G, ny = gy + dirs[dir][1] * G;
      return nx >= G && nx <= W - G && ny >= G && ny <= H - G;
    }
    function turn(gx, gy) {
      var straight = d, left = (d + 3) % 4, right = (d + 1) % 4;
      if (canGo(straight, gx, gy) && Math.random() < 0.62) { d = straight; return; }
      var opts = [];
      if (canGo(left, gx, gy)) opts.push(left);
      if (canGo(right, gx, gy)) opts.push(right);
      if (canGo(straight, gx, gy)) opts.push(straight);
      if (!opts.length && canGo((d + 2) % 4, gx, gy)) opts.push((d + 2) % 4);
      if (opts.length) d = opts[Math.floor(Math.random() * opts.length)];
    }

    function frame() {
      // fade prior trail (erase alpha so the grid behind stays visible)
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.055)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      x += dirs[d][0] * SPEED; y += dirs[d][1] * SPEED;

      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillRect(x - 1.4, y - 1.4, 2.8, 2.8);

      var gx = Math.round(x / G) * G, gy = Math.round(y / G) * G;
      if (Math.abs(x - gx) < SPEED && Math.abs(y - gy) < SPEED) {
        x = gx; y = gy; turn(gx, gy);
      }
      rover.style.transform = "translate(" + x + "px," + y + "px) rotate(" + (d * 90) + "deg)";
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();
})();
