/* ==========================================================================
   Write on the Dot - Shared JavaScript
   Vanilla JS only. Used across all pages.
   ========================================================================== */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
     1. Mobile navigation (hamburger menu)
     ----------------------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");

  function setNav(open) {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    primaryNav.classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });

    // Close the menu when a link inside it is chosen
    primaryNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });

    // Close with Escape and return focus to the toggle
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && primaryNav.classList.contains("open")) {
        setNav(false);
        navToggle.focus();
      }
    });

    // Reset when resizing up to desktop
    window.matchMedia("(min-width: 961px)").addEventListener("change", function (mq) {
      if (mq.matches) setNav(false);
    });
  }

  /* -----------------------------------------------------------------------
     2. Active navigation highlighting (based on current file name)
     ----------------------------------------------------------------------- */
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(function (link) {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* -----------------------------------------------------------------------
     3. Sticky header shadow + back-to-top visibility
     ----------------------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  var backToTop = document.getElementById("backToTop");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (backToTop) backToTop.classList.toggle("visible", y > 600);
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* -----------------------------------------------------------------------
     4. Scroll-triggered reveal animations (Intersection Observer)
     ----------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  // Stagger items that share a grid for a refined cascading effect
  document.querySelectorAll(".services-grid, .benefits-grid").forEach(function (grid) {
    Array.prototype.forEach.call(grid.children, function (child, i) {
      child.style.setProperty("--reveal-delay", (i % 4) * 0.08 + "s");
    });
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Clear stagger delay after reveal so hover effects stay responsive
          setTimeout(function () { entry.target.style.removeProperty("--reveal-delay"); }, 1200);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* -----------------------------------------------------------------------
     5. Placeholder links (details still to be confirmed)
     Prevents "#" links from jumping to the top of the page.
     ----------------------------------------------------------------------- */
  document.querySelectorAll("[data-placeholder-link]").forEach(function (link) {
    link.addEventListener("click", function (e) { e.preventDefault(); });
  });
})();
