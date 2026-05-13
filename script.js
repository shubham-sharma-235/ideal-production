/* ================================================================
   IDEAL COFFEE MACHINES — Interactive layer
   ================================================================ */

(function () {
  'use strict';

  /* -------- Helpers -------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ===========================================================
     1. Custom cursor (desktop only) with magnetic hover
     =========================================================== */
  const cursor = $('#cursor');
  const cursorDot = $('#cursorDot');
  const isDesktop = window.matchMedia('(min-width: 1025px)').matches
    && window.matchMedia('(pointer: fine)').matches;

  if (isDesktop && cursor && cursorDot) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let cursorX = mouseX, cursorY = mouseY;
    let dotX = mouseX, dotY = mouseY;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      dotX = e.clientX; dotY = e.clientY;
      cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    }, { passive: true });

    const animateCursor = () => {
      cursorX = lerp(cursorX, mouseX, 0.18);
      cursorY = lerp(cursorY, mouseY, 0.18);
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Hover state for interactive elements
    const hoverables = 'a, button, [data-cursor="pointer"], .product, .industry, .faq-item summary, .voice-dot, input, select, textarea';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverables)) cursor.classList.add('hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverables)) cursor.classList.remove('hover');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
    });
  } else if (cursor && cursorDot) {
    cursor.style.display = 'none';
    cursorDot.style.display = 'none';
  }

  /* ===========================================================
     2. Navbar — scroll state, mobile menu, page progress
     =========================================================== */
  const nav = $('#nav');
  const progress = $('#pageProgress');

  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 60);

    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = ((y / h) * 100) + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile burger
  const burger = $('#navBurger');
  const navMobile = $('#navMobile');
  if (burger && navMobile) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navMobile.classList.toggle('open');
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });
    $$('a', navMobile).forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      navMobile.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ===========================================================
     3. Smooth scroll with nav offset
     =========================================================== */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ===========================================================
     4. IntersectionObserver-driven reveals
     =========================================================== */
  const revealTargets = [
    ...$$('.product'),
    ...$$('.craft-tile'),
    ...$$('.industry'),
    ...$$('.pillar')
  ];
  // Add a generic reveal-on-scroll class to large content
  $$('.intro-title, .section-title, .clients-title, .voices-title, .craft-title, .pillars-title, .contact-title, .faq-title, .intro-cols, .intro-meta, .filter-tabs, .contact-form, .contact-info').forEach(el => el.classList.add('reveal-on-scroll'));
  revealTargets.push(...$$('.reveal-on-scroll'));

  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger items in the same container
        const delay = entry.target.dataset.delay
          ? parseFloat(entry.target.dataset.delay)
          : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  // Apply stagger to grids
  $$('.product-grid .product').forEach((el, i) => el.dataset.delay = (i % 3) * 90);
  $$('.craft-grid .craft-tile').forEach((el, i) => el.dataset.delay = (i % 4) * 80);
  $$('.industries-grid .industry').forEach((el, i) => el.dataset.delay = (i % 3) * 90);

  revealTargets.forEach(el => io.observe(el));

  /* ===========================================================
     5. Animated counters (hero stats)
     =========================================================== */
  const heroStats = $('#heroStats');
  if (heroStats) {
    const counterIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$('.counter', entry.target).forEach(el => {
          const target = parseFloat(el.dataset.target);
          const duration = 1800;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - t, 3);
            const val = Math.floor(eased * target);
            el.textContent = val.toLocaleString();
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString();
          };
          requestAnimationFrame(tick);
        });
        counterIO.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    counterIO.observe(heroStats);
  }

  /* ===========================================================
     6. Product filter tabs
     =========================================================== */
  const filterTabs = $('#filterTabs');
  const productGrid = $('#productGrid');
  if (filterTabs && productGrid) {
    filterTabs.addEventListener('click', e => {
      const tab = e.target.closest('.filter-tab');
      if (!tab) return;
      $$('.filter-tab', filterTabs).forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      $$('.product', productGrid).forEach((p, i) => {
        const match = filter === 'all' || p.dataset.cat === filter;
        if (match) {
          p.classList.remove('hidden-filter');
          // re-reveal animation
          p.style.opacity = '0';
          p.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            p.style.transition = `opacity .5s ease ${i * 60}ms, transform .5s ease ${i * 60}ms`;
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
          });
        } else {
          p.classList.add('hidden-filter');
        }
      });
    });
  }

  /* ===========================================================
     7. Product card 3D tilt (subtle)
     =========================================================== */
  if (isDesktop) {
    $$('[data-tilt]').forEach(card => {
      const img = $('.product-image', card);
      if (!img) return;
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        img.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(0)`;
      });
      card.addEventListener('mouseleave', () => {
        img.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
      });
    });
  }

  /* ===========================================================
     8. Testimonial carousel
     =========================================================== */
  const voicesTrack = $('#voicesTrack');
  const voicesDots = $('#voicesDots');
  if (voicesTrack && voicesDots) {
    const voices = $$('.voice', voicesTrack);
    let current = 0;
    let autoplayId;

    voices.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'voice-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.dataset.cursor = 'pointer';
      dot.addEventListener('click', () => go(i, true));
      voicesDots.appendChild(dot);
    });

    const go = (i, manual = false) => {
      voices[current].classList.remove('active');
      $$('.voice-dot', voicesDots)[current].classList.remove('active');
      current = (i + voices.length) % voices.length;
      voices[current].classList.add('active');
      $$('.voice-dot', voicesDots)[current].classList.add('active');
      if (manual) restartAuto();
    };

    const startAuto = () => {
      autoplayId = setInterval(() => go(current + 1), 6500);
    };
    const restartAuto = () => {
      clearInterval(autoplayId);
      startAuto();
    };

    $$('.voices-arrow').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.dir === 'next' ? 1 : -1;
        go(current + dir, true);
      });
    });

    // Track height (so absolute layout doesn't collapse on small screens)
    const fitTrackHeight = () => {
      const active = $('.voice.active', voicesTrack);
      if (!active) return;
      voicesTrack.style.height = active.scrollHeight + 'px';
    };
    fitTrackHeight();
    window.addEventListener('resize', fitTrackHeight);
    new ResizeObserver(fitTrackHeight).observe(voicesTrack);
    setTimeout(fitTrackHeight, 200);
    // After any change in current
    const obs = new MutationObserver(fitTrackHeight);
    voices.forEach(v => obs.observe(v, { attributes: true, attributeFilter: ['class'] }));

    startAuto();
    voicesTrack.addEventListener('mouseenter', () => clearInterval(autoplayId));
    voicesTrack.addEventListener('mouseleave', startAuto);
  }

  /* ===========================================================
     9. FAQ — exclusive open
     =========================================================== */
  const faqList = $('#faqList');
  if (faqList) {
    faqList.addEventListener('toggle', e => {
      if (e.target.tagName !== 'DETAILS' || !e.target.open) return;
      $$('details', faqList).forEach(d => { if (d !== e.target) d.open = false; });
    }, true);
  }

  /* ===========================================================
     10. Contact form validation
     =========================================================== */
  const form = $('#contactForm');
  const formSuccess = $('#formSuccess');
  if (form) {
    const fields = {
      name:     { el: $('#cf-name'),     re: /.{2,}/, msg: 'Please enter your full name.' },
      email:    { el: $('#cf-email'),    re: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Please enter a valid email.' },
      phone:    { el: $('#cf-phone'),    re: /^[+\d][\d\s\-()]{7,}$/, msg: 'Please enter a valid phone number.' },
      business: { el: $('#cf-business'), re: /.+/, msg: 'Please choose a business type.' }
    };

    const showError = (key, msg) => {
      const err = form.querySelector(`.field-error[data-for="${key}"]`);
      if (err) { err.textContent = msg; err.classList.add('show'); }
    };
    const clearError = (key) => {
      const err = form.querySelector(`.field-error[data-for="${key}"]`);
      if (err) { err.textContent = ''; err.classList.remove('show'); }
    };

    Object.entries(fields).forEach(([key, f]) => {
      if (!f.el) return;
      f.el.addEventListener('input', () => clearError(key));
      f.el.addEventListener('change', () => clearError(key));
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      Object.entries(fields).forEach(([key, f]) => {
        if (!f.el) return;
        const v = (f.el.value || '').trim();
        if (!f.re.test(v)) { showError(key, f.msg); valid = false; }
      });
      if (!valid) return;
      form.reset();
      if (formSuccess) {
        formSuccess.hidden = false;
        setTimeout(() => { formSuccess.hidden = true; }, 8000);
      }
    });
  }

  /* ===========================================================
     11. Back to top
     =========================================================== */
  const floatTop = $('#floatTop');
  if (floatTop) {
    window.addEventListener('scroll', () => {
      floatTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    floatTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ===========================================================
     12. Modal (8s delay + exit intent, once per session)
     =========================================================== */
  const modal = $('#modal');
  const modalForm = $('#modalForm');
  if (modal) {
    const shown = () => sessionStorage.getItem('icm-modal-shown') === '1';
    const markShown = () => sessionStorage.setItem('icm-modal-shown', '1');

    const openModal = () => {
      if (shown()) return;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      markShown();
    };
    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    };

    setTimeout(openModal, 8000);

    document.addEventListener('mouseleave', e => {
      if (e.clientY <= 0 && !shown()) openModal();
    });

    $$('[data-modal-close]', modal).forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    if (modalForm) {
      modalForm.addEventListener('submit', e => {
        e.preventDefault();
        modalForm.innerHTML = '<p style="margin:0;padding:16px;font-family:var(--font-display);font-size:18px;color:var(--red-700);">Thank you. Check your inbox.</p>';
      });
    }
  }

  /* ===========================================================
     13. Float parallax in hero
     =========================================================== */
  if (isDesktop) {
    const floats = $$('.float');
    let mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const animFloat = () => {
      tx = lerp(tx, mx, 0.05);
      ty = lerp(ty, my, 0.05);
      floats.forEach((f, i) => {
        const depth = (i + 1) * 14;
        f.style.transform = `translate(${tx * depth}px, ${ty * depth}px)`;
      });
      requestAnimationFrame(animFloat);
    };
    requestAnimationFrame(animFloat);
  }

  /* ===========================================================
     14. Hero background subtle parallax on scroll
     =========================================================== */
  const heroBg = $('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = `translateY(${y * 0.25}px) scale(${1 + y * 0.0003})`;
      }
    }, { passive: true });
  }

  /* ===========================================================
     15. Brand mark rotation easter-egg (already in CSS)
     ===========================================================
     We also rotate the brand mark on each visit-load for variety. */
  const mark = document.querySelector('.brand-mark svg');
  if (mark) {
    mark.style.transform = `rotate(${Math.floor(Math.random() * 30) - 15}deg)`;
    setTimeout(() => { mark.style.transform = ''; }, 800);
  }

  /* ===========================================================
     16. Console signature 
     =========================================================== */
  try {
    console.log(
      '%cIDEAL COFFEE MACHINES\n%cMilano · India · since 1962\n%cwww.idealcoffeemachines.com',
      'font-family:Georgia,serif;font-size:24px;font-style:italic;color:#8b2424;',
      'font-family:monospace;font-size:11px;color:#b8924a;letter-spacing:.2em;',
      'font-family:monospace;font-size:10px;color:#7a6a56;'
    );
  } catch (_) {}

  /* ===========================================================
     17. Magnetic buttons (desktop)
     =========================================================== */
  if (isDesktop) {
    const magnetics = $$('.btn-primary, .nav-cta, .form-submit, .voices-arrow');
    magnetics.forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ===========================================================
     18. Section parallax depth on scroll
     =========================================================== */
  const parallaxSections = $$('.craft, .voices');
  if (isDesktop && parallaxSections.length) {
    window.addEventListener('scroll', () => {
      parallaxSections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const shift = (progress - 0.5) * 30;
          sec.style.backgroundPositionY = `${50 + shift}%`;
        }
      });
    }, { passive: true });
  }

  /* ===========================================================
     19. Ticker speed controlled by scroll velocity
     =========================================================== */
  let lastScrollY = window.scrollY;
  let scrollSpeed = 0;
  const ticker = $('.ticker-track');
  if (ticker) {
    const updateTickerSpeed = () => {
      scrollSpeed = lerp(scrollSpeed, Math.abs(window.scrollY - lastScrollY), 0.1);
      lastScrollY = window.scrollY;
      const duration = Math.max(8, 30 - scrollSpeed * 0.5);
      ticker.style.animationDuration = duration + 's';
      requestAnimationFrame(updateTickerSpeed);
    };
    requestAnimationFrame(updateTickerSpeed);
  }

  /* ===========================================================
     20. Lazy image fade-in on load
     =========================================================== */
  $$('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity .6s ease';
    const reveal = () => { img.style.opacity = '1'; };
    if (img.complete) reveal();
    else img.addEventListener('load', reveal);
    img.addEventListener('error', () => {
      // Keep fallback visible and hide the broken image
      img.style.opacity = '0';
    });
  });

  /* ===========================================================
     21. Smooth scroll-linked section dividers
     =========================================================== */
  $$('.eyebrow-line').forEach(line => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          line.style.width = '48px';
          line.style.transition = 'width .8s var(--ease-out)';
        }
      });
    }, { threshold: 0.5 });
    line.style.width = '0';
    io.observe(line);
  });
})();
