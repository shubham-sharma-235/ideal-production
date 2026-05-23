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
    const slider = document.getElementById("clSlider");

  let isDown = false;
  let startX;
  let scrollLeft;
  let auto = 0;

  /* AUTO SCROLL */
  function autoSlide(){

    if(!isDown){

      auto += 0.7;

      if(auto >= slider.scrollWidth / 2){
        auto = 0;
      }

      slider.scrollLeft = auto;
    }

    requestAnimationFrame(autoSlide);
  }

  autoSlide();

  /* DRAG */
  slider.addEventListener("mousedown", (e) => {

    isDown = true;

    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;

  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
  });

  slider.addEventListener("mousemove", (e) => {

    if(!isDown) return;

    e.preventDefault();

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;

    slider.scrollLeft = scrollLeft - walk;

    auto = slider.scrollLeft;

  });

  /* TOUCH */
  slider.addEventListener("touchstart", (e) => {

    isDown = true;

    startX = e.touches[0].pageX;
    scrollLeft = slider.scrollLeft;

  });

  slider.addEventListener("touchend", () => {
    isDown = false;
  });

  slider.addEventListener("touchmove", (e) => {

    if(!isDown) return;

    const x = e.touches[0].pageX;
    const walk = (x - startX) * 2;

    slider.scrollLeft = scrollLeft - walk;

    auto = slider.scrollLeft;

  });
  
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

/* =========================================================== */

(function(){
  var popup = document.getElementById('popup');
  var backdrop = document.getElementById('popupBackdrop');
  var closeBtn = document.getElementById('popupClose');
  var form = document.getElementById('popupForm');
  var success = document.getElementById('popupSuccess');

  function openPopup(){
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  window.openPopup = openPopup;

  function closePopup(){
    popup.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closePopup);
  backdrop.addEventListener('click', closePopup);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closePopup(); });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var valid = true;
    var fields = form.querySelectorAll('[required]');
    for(var i = 0; i < fields.length; i++){
      if(!fields[i].value.trim()){ valid = false; fields[i].style.borderColor = '#C5503D'; }
      else { fields[i].style.borderColor = ''; }
    }
    if(valid){
      form.style.display = 'none';
      success.hidden = false;
    }
  });

  // Auto popup — every page load, after 3.5 seconds
  setTimeout(openPopup, 3500);
})();