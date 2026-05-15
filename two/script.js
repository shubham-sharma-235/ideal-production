/* ═══════════════════════════════════════════════════
   IDEAL COFFEE MACHINES — Script
   All interactivity: reveals, counters, carousel,
   filters, FAQ, form, modal, navigation, floats
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── HELPERS ── */
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  /* ══════════════════════════════════════════════════
     1. PROGRESS BAR
     ══════════════════════════════════════════════════ */
  const progressBar = $('#progressBar');
  function updateProgress() {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  /* ══════════════════════════════════════════════════
     2. NAV SCROLL STATE
     ══════════════════════════════════════════════════ */
  const nav = $('#nav');
  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  /* ══════════════════════════════════════════════════
     3. BURGER / DRAWER
     ══════════════════════════════════════════════════ */
  const burger = $('#burger');
  const drawer = $('#drawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });
    // close on link click
    $$('a', drawer).forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ══════════════════════════════════════════════════
     4. SMOOTH SCROLL
     ══════════════════════════════════════════════════ */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = $(id);
      if (!el) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 8 : 60;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════════════════════════
     5. SCROLL REVEAL (IntersectionObserver)
     ══════════════════════════════════════════════════ */
  const revealEls = $$('.rv');
  if ('IntersectionObserver' in window && revealEls.length) {
    let revIdx = 0;
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger siblings appearing together
          const delay = (revIdx % 6) * 80;
          revIdx++;
          setTimeout(() => entry.target.classList.add('vis'), delay);
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => revObs.observe(el));
  } else {
    // fallback: show all
    revealEls.forEach(el => el.classList.add('vis'));
  }

  /* ══════════════════════════════════════════════════
     6. ANIMATED COUNTERS
     ══════════════════════════════════════════════════ */
  const counters = $$('.counter');
  let countersRan = false;
  function animateCounters() {
    if (countersRan) return;
    countersRan = true;
    counters.forEach(el => {
      const to = parseInt(el.dataset.to, 10);
      const dur = 2200;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        // easeOutCubic
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(ease * to);
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  if (counters.length && 'IntersectionObserver' in window) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounters(); cObs.disconnect(); }
      });
    }, { threshold: 0.3 });
    counters.forEach(c => cObs.observe(c));
  }

  /* ══════════════════════════════════════════════════
     7. PRODUCT FILTER TABS
     ══════════════════════════════════════════════════ */
  const filters = $$('.filter');
  const products = $$('.product');
  if (filters.length && products.length) {
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.f;
        products.forEach(card => {
          if (cat === 'all' || card.dataset.cat === cat) {
            card.classList.remove('hide');
            card.style.animation = 'none';
            card.offsetHeight; // reflow
            card.style.animation = 'filterIn .45s cubic-bezier(.22,1,.36,1) forwards';
          } else {
            card.classList.add('hide');
          }
        });
      });
    });
    // inject filter animation
    const style = document.createElement('style');
    style.textContent = `@keyframes filterIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`;
    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════════════
     8. TESTIMONIAL CAROUSEL
     ══════════════════════════════════════════════════ */
  const testimonials = $$('.testimonial');
  // For testimonials grid (not a carousel here - they're static grid)
  // If you want a carousel, uncomment below:
  // Currently using 2x2 grid layout with hover effects - no carousel needed

  /* ══════════════════════════════════════════════════
     9. FAQ ACCORDION (exclusive open)
     ══════════════════════════════════════════════════ */
  const faqItems = $$('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

  /* ══════════════════════════════════════════════════
     10. CONTACT FORM VALIDATION
     ══════════════════════════════════════════════════ */
  const contactForm = $('#contactForm');
  const formOk = $('#formOk');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      const rules = {
        name: v => v.trim().length >= 2,
        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        phone: v => /^[+\d][\d\s\-]{7,}$/.test(v.trim()),
        business: v => v.trim() !== ''
      };
      const msgs = {
        name: 'Please enter your name',
        email: 'Please enter a valid email',
        phone: 'Please enter a valid phone number',
        business: 'Please select a business type'
      };
      Object.keys(rules).forEach(name => {
        const input = contactForm.querySelector(`[name="${name}"]`);
        const errEl = contactForm.querySelector(`.field-err[data-for="${name}"]`);
        if (!input) return;
        const ok = rules[name](input.value);
        if (!ok) valid = false;
        if (errEl) {
          errEl.textContent = ok ? '' : msgs[name];
          errEl.classList.toggle('show', !ok);
        }
        input.style.borderBottomColor = ok ? '' : '#C5503D';
      });
      if (valid) {
        contactForm.style.display = 'none';
        if (formOk) { formOk.hidden = false; }
      }
    });
    // clear errors on input
    $$('input, select, textarea', contactForm).forEach(el => {
      el.addEventListener('input', () => {
        el.style.borderBottomColor = '';
        const err = contactForm.querySelector(`.field-err[data-for="${el.name}"]`);
        if (err) err.classList.remove('show');
      });
    });
  }

  /* ══════════════════════════════════════════════════
     11. BACK TO TOP
     ══════════════════════════════════════════════════ */
  const topBtn = $('#topBtn');
  function updateTopBtn() {
    if (topBtn) topBtn.classList.toggle('show', window.scrollY > 600);
  }
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ══════════════════════════════════════════════════
     12. MODAL POPUP
     ══════════════════════════════════════════════════ */
  const modal = $('#modal');
  const modalForm = $('#modalForm');
  function openModal() {
    if (!modal || sessionStorage.getItem('idealModalDone')) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem('idealModalDone', '1');
  }
  if (modal) {
    // Close buttons
    $$('[data-close]', modal).forEach(el => {
      el.addEventListener('click', closeModal);
    });
    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
    // Timer: show after 8 seconds
    setTimeout(openModal, 8000);
    // Exit intent
    document.addEventListener('mouseout', e => {
      if (e.clientY < 2 && !sessionStorage.getItem('idealModalDone')) openModal();
    });
  }
  if (modalForm) {
    modalForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = $('input', modalForm);
      if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        modalForm.innerHTML = '<p style="color:var(--gold);font-size:15px;font-weight:500">Thank you! Check your inbox.</p>';
        setTimeout(closeModal, 2000);
      }
    });
  }

  /* ══════════════════════════════════════════════════
     13. MAGNETIC HOVER (desktop only)
     ══════════════════════════════════════════════════ */
  if (window.matchMedia('(hover: hover)').matches) {
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
        btn.style.transform = `translateY(-2px) translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ══════════════════════════════════════════════════
     SCROLL LISTENER (combined)
     ══════════════════════════════════════════════════ */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNav();
        updateTopBtn();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial state
  updateProgress();
  updateNav();
  updateTopBtn();

})();
