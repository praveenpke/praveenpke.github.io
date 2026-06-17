/* Praveen Emani — reveal-on-scroll (progressive enhancement) */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!els.length) return;

  if (reduce) { els.forEach(function (el) { el.classList.add("in"); }); return; }

  function check() {
    var h = window.innerHeight || document.documentElement.clientHeight;
    for (var i = els.length - 1; i >= 0; i--) {
      if (els[i].getBoundingClientRect().top < h * 0.9) {
        els[i].classList.add("in");
        els.splice(i, 1);
      }
    }
  }

  window.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", check, { passive: true });
  check();
  requestAnimationFrame(check);
  setTimeout(check, 300);
  /* hard fallback so nothing can stay hidden */
  setTimeout(function () { els.slice().forEach(function (el) { el.classList.add("in"); }); }, 1600);
})();
