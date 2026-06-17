/* Praveen Emani — shared site behavior (progressive enhancement) */
(function () {
  "use strict";

  /* ---- theme toggle ---- */
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      toggle.setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
  }

  /* ---- mobile nav ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- scroll-spy for in-page anchor nav ---- */
  var spyLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href^="/#"]')
  );
  if (spyLinks.length && "IntersectionObserver" in window) {
    var map = {};
    spyLinks.forEach(function (a) {
      var id = a.getAttribute("href").replace(/^\/?#/, "");
      if (id) map[id] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          spyLinks.forEach(function (l) { l.classList.remove("active"); });
          var active = map[en.target.id];
          if (active) active.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
  }
})();
