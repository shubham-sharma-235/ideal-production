/* =======================================================
   IDEAL COFFEE MACHINES — script.js
   ======================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR ── */
  const navbar = document.getElementById('navbar');
  const btt    = document.getElementById('btt');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  /* ── MOBILE MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    })
  );

  /* ── SCROLL REVEAL ── */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealIO.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

  /* ── STAT COUNTERS ── */
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target);
      if (isNaN(target)) return;
      const dur   = 1500;
      const start = performance.now();
      const tick  = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(easeOut(p) * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-target]').forEach(el => counterIO.observe(el));

  /* ── TESTIMONIAL SLIDER ── */
  const tcards = document.querySelectorAll('.tcard');
  const tdots  = document.querySelectorAll('.tdot');
  let cur = 0, tTimer;

  const goTo = (idx) => {
    tcards[cur].classList.remove('active');
    tdots[cur].classList.remove('active');
    cur = ((idx % tcards.length) + tcards.length) % tcards.length;
    tcards[cur].classList.add('active');
    tdots[cur].classList.add('active');
  };
  const autoPlay = () => { clearInterval(tTimer); tTimer = setInterval(() => goTo(cur + 1), 5000); };

  tdots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.index); autoPlay(); }));
  autoPlay();

  // Swipe
  let swipeX = 0;
  const slider = document.getElementById('tSlider');
  slider?.addEventListener('touchstart', e => { swipeX = e.touches[0].clientX; }, { passive: true });
  slider?.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - swipeX;
    if (Math.abs(dx) > 44) { goTo(cur + (dx < 0 ? 1 : -1)); autoPlay(); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { goTo(cur + 1); autoPlay(); }
    if (e.key === 'ArrowLeft')  { goTo(cur - 1); autoPlay(); }
  });

  /* ── FORM ── */
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const btn = document.getElementById('submitBtn');
    btn.querySelector('.bt').style.display = 'none';
    btn.querySelector('.bl').style.display = 'inline';
    btn.disabled = true;
    await new Promise(r => setTimeout(r, 1500));
    form.style.display = 'none';
    document.getElementById('formOk').style.display = 'flex';
  });

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const offset = (navbar?.offsetHeight || 70) + 16;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ── BACK TO TOP ── */
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── HERO PARALLAX (desktop) ── */
  if (window.matchMedia('(min-width: 1100px)').matches) {
    const imgWrap = document.querySelector('.hero-img-wrap');
    if (imgWrap) {
      window.addEventListener('scroll', () => {
        imgWrap.style.transform = `translateY(${window.scrollY * 0.1}px)`;
      }, { passive: true });
    }
  }

});