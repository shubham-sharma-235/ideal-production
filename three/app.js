/* ═══ IDEAL COFFEE V10 — Script ═══ */
(function () {
  "use strict";

  /* Progress bar */
  const prog = document.getElementById("progress");
  window.addEventListener(
    "scroll",
    () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0) prog.style.width = (window.scrollY / h) * 100 + "%";
    },
    { passive: true },
  );

  /* Nav scroll class */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* logo marquee */
  const marqueeTrack = document.querySelector(".logo-marquee__track");

  let scrollAmount = 0;
  let speed = 1; // increase for faster speed

  function animateMarquee() {
    scrollAmount += speed;
    // Half width because logos are duplicated
    if (scrollAmount >= marqueeTrack.scrollWidth / 2) {
      scrollAmount = 0;
    }
    marqueeTrack.style.transform = `translateX(-${scrollAmount}px)`;
    requestAnimationFrame(animateMarquee);
  }

  animateMarquee();
  /* Burger / Drawer */
  const burger = document.getElementById("burger");
  const drawer = document.getElementById("drawer");
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    drawer.classList.toggle("open");
    document.body.style.overflow = drawer.classList.contains("open")
      ? "hidden"
      : "";
  });
  drawer.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      drawer.classList.remove("open");
      document.body.style.overflow = "";
    }),
  );

  /* Smooth scroll for all anchor links */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const t = document.querySelector(a.getAttribute("href"));
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* Intersection Observer — reveal .rv elements */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("vis");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));

  /* Animated counters */
  function animateCounter(el) {
    const target = parseInt(el.dataset.to);
    if (!target) return;
    const duration = 2200;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4); // easeOutQuart
      el.textContent = Math.floor(ease * target).toLocaleString("en-IN");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterIO.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  document.querySelectorAll(".counter").forEach((el) => counterIO.observe(el));

  /* Product filter tabs */
  const tabs = document.querySelectorAll(".tab");
  const cards = document.querySelectorAll(".cd");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("on"));
      tab.classList.add("on");
      const f = tab.dataset.f;
      cards.forEach((c) => {
        if (f === "all" || c.dataset.cat === f) {
          c.classList.remove("hide");
          c.style.animation = "au .5s var(--ease) forwards";
        } else {
          c.classList.add("hide");
        }
      });
    });
  });

  /* FAQ — exclusive accordion */
  document.querySelectorAll(".faq").forEach((faq) => {
    faq.addEventListener("toggle", () => {
      if (faq.open) {
        document.querySelectorAll(".faq").forEach((other) => {
          if (other !== faq && other.open) other.open = false;
        });
      }
    });
  });

  /* Form validation */
  const form = document.getElementById("contactForm");
  const formOk = document.getElementById("formOk");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach((input) => {
        const err = form.querySelector(`.ferr[data-for="${input.name}"]`);
        if (!input.value.trim()) {
          valid = false;
          if (err) {
            err.textContent = "Required";
            err.classList.add("show");
          }
          input.style.borderBottomColor = "#C5503D";
        } else {
          if (err) err.classList.remove("show");
          input.style.borderBottomColor = "";
        }
      });
      if (valid) {
        form.style.display = "none";
        formOk.hidden = false;
      }
    });
    form.querySelectorAll("[required]").forEach((input) => {
      input.addEventListener("input", () => {
        const err = form.querySelector(`.ferr[data-for="${input.name}"]`);
        if (err && input.value.trim()) {
          err.classList.remove("show");
          input.style.borderBottomColor = "";
        }
      });
    });
  }

  /* Back to top */
  const topBtn = document.getElementById("topBtn");
  window.addEventListener(
    "scroll",
    () => {
      topBtn.classList.toggle("show", window.scrollY > 600);
    },
    { passive: true },
  );
  topBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
})();

const xpPopup = document.getElementById("xpPopup");
const xpOpen = document.getElementById("xpOpen");
const xpClose = document.getElementById("xpClose");

xpOpen.addEventListener("click", () => {
  xpPopup.classList.add("active");
});

xpClose.addEventListener("click", () => {
  xpPopup.classList.remove("active");
});

xpPopup.addEventListener("click", (e) => {
  if (e.target === xpPopup) {
    xpPopup.classList.remove("active");
  }
});
