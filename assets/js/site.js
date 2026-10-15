// Interactions modelled on the RS Card demo: preloader, sticky header,
// active menu item, mobile menu, scroll reveal, ripple buttons, back to top.
(function () {
  var doc = document.documentElement;
  doc.classList.add("js");

  function onLoaded() {
    document.body.classList.add("loaded");
  }
  if (document.readyState === "complete") onLoaded();
  else window.addEventListener("load", onLoaded);
  setTimeout(onLoaded, 2500);

  document.addEventListener("DOMContentLoaded", function () {
    var headBar = document.querySelector(".head-bar");
    var header = document.querySelector(".header");
    var toTop = document.querySelector(".btn-scroll-top");

    function onScroll() {
      var y = window.scrollY;
      headBar.classList.toggle("is-sticky", y > header.offsetHeight - 60);
      toTop.classList.toggle("show", y > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mobile menu
    var mobileNav = document.querySelector(".mobile-nav");
    var overlay = document.querySelector(".overlay");
    var openBtn = document.querySelector(".btn-mobile-nav");
    function setMenu(open) {
      mobileNav.classList.toggle("open", open);
      overlay.classList.toggle("open", open);
      openBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) mobileNav.querySelector("a").focus();
    }
    openBtn.addEventListener("click", function () { setMenu(true); });
    overlay.addEventListener("click", function () { setMenu(false); });
    document.querySelector(".mobile-nav-close").addEventListener("click", function () { setMenu(false); });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });

    // Scroll reveal
    var reveal = document.querySelectorAll(".animate-up, .animate-left, .animate-right");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -60px 0px" });
      reveal.forEach(function (el) { io.observe(el); });
    } else {
      reveal.forEach(function (el) { el.classList.add("animated"); });
    }

    // Highlight the menu item of the section in view
    var links = document.querySelectorAll(".nav a[href^='#'], .mobile-nav a[href^='#']");
    var sections = Array.prototype.map.call(document.querySelectorAll(".nav a[href^='#']"), function (a) {
      return document.querySelector(a.getAttribute("href"));
    }).filter(Boolean);
    if ("IntersectionObserver" in window) {
      var navIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          links.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === id);
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (s) { navIo.observe(s); });
    }

    // Ripple on buttons
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var wave = document.createElement("span");
        wave.className = "ripple-wave";
        wave.style.width = wave.style.height = size + "px";
        wave.style.left = e.clientX - rect.left - size / 2 + "px";
        wave.style.top = e.clientY - rect.top - size / 2 + "px";
        btn.appendChild(wave);
        setTimeout(function () { wave.remove(); }, 650);
      });
    });

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  });
})();
