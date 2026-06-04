/**
 * main.js — Lógica del portfolio
 * Sin dependencias externas. Vanilla JS puro.
 */

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) {
    if (cursor) cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    // translate es compositor-only — no dispara layout como left/top
    cursor.style.translate = `${curX}px ${curY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = 'a, button, .pj-card, .tag, .pillar';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
  });
})();

/* ═══════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
   Handled here so html { scroll-behavior } can
   stay 'auto', avoiding the initial-section lag.
═══════════════════════════════════════════ */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

/* ═══════════════════════════════════════════
   NAV — scroll + mobile toggle
═══════════════════════════════════════════ */
(function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('is-open');
    links.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const i18n = window.i18n;
    toggle.setAttribute('aria-label', open
      ? (i18n ? i18n.t('nav.toggle.close') : 'Close menu')
      : (i18n ? i18n.t('nav.toggle.open')  : 'Open menu'));
  });

  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      links.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
})();

/* ═══════════════════════════════════════════
   HERO — SCRAMBLE TEXT EFFECT
   Las palabras revelan sus letras aleatoriamente
   hasta lock-in en el texto final.
═══════════════════════════════════════════ */
(function initScramble() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

  function scramble(el) {
    const final = el.dataset.final || el.textContent;
    const len   = final.length;
    let frame   = 0;
    const totalFrames = len * 4;

    const tick = setInterval(() => {
      el.textContent = Array.from({ length: len }, (_, i) => {
        // Once enough frames have passed for this index, lock it in
        if (frame > i * 3) return final[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      frame++;
      if (frame > totalFrames) {
        el.textContent = final; // ensure clean final state
        clearInterval(tick);
      }
    }, 35);
  }

  // Fire scramble after the CSS animation has run (≈ 1.2s)
  setTimeout(() => {
    document.querySelectorAll('.hero__word[data-final]').forEach((el, i) => {
      setTimeout(() => scramble(el), i * 180);
    });
  }, 1200);
})();

/* ═══════════════════════════════════════════
   SKILLS — renderizado dinámico desde skills.js
═══════════════════════════════════════════ */
(function renderSkills() {
  const wrapper = document.getElementById('skillsWrapper');
  if (!wrapper || typeof SKILLS === 'undefined') return;

  SKILLS.forEach(group => {
    const section = document.createElement('div');
    section.className = 'skills__group reveal';

    const label = document.createElement('span');
    label.className = 'skills__group-label mono';
    label.textContent = group.label;

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'skills__tags';

    group.items.forEach((item, i) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = item;
      tag.style.transitionDelay = `${i * 40}ms`;
      tagsDiv.appendChild(tag);
    });

    section.appendChild(label);
    section.appendChild(tagsDiv);
    wrapper.appendChild(section);
  });
})();

/* ═══════════════════════════════════════════
   REVEAL ON SCROLL — Intersection Observer
═══════════════════════════════════════════ */
(function initReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Don't unobserve skills groups — tags need the class to stay
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════
   ACTIVE NAV LINK — highlight section in view
═══════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(link => {
        const active = link.getAttribute('href') === `#${id}`;
        link.style.color = active ? 'var(--text)' : '';
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ═══════════════════════════════════════════
   PROJECTS — Reveal al entrar al viewport
   Reveal liviano basado en clase CSS (.is-visible)
   con stagger por transition-delay. Sin animar
   cada elemento por JS → scroll fluido.
═══════════════════════════════════════════ */
(function initProjectsReveal() {
  const cards = Array.from(document.querySelectorAll('#projectsList .pj-card'));
  if (!cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    cards.forEach(card => card.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    // Stagger sutil entre tarjetas que entran a la vez
    let shown = 0;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      card.style.transitionDelay = `${shown * 70}ms`;
      card.classList.add('is-visible');
      shown++;
      obs.unobserve(card);
    });
  }, { threshold: 0.12 });

  cards.forEach(card => observer.observe(card));
})();

/* ═══════════════════════════════════════════
   EXIT MODAL — aparece cuando el usuario llega
   al fondo y sube hacia otra sección
═══════════════════════════════════════════ */
(function initExitModal() {
  const modal    = document.getElementById('exitModal');
  const backdrop = document.getElementById('exitModalBackdrop');
  const btnClose = document.getElementById('exitModalClose');
  const btnDismiss = document.getElementById('exitModalDismiss');
  if (!modal) return;

  let reachedBottom = false;
  let shown = false;

  function openModal() {
    if (shown) return;
    shown = true;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  btnClose.addEventListener('click', closeModal);
  btnDismiss.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  window.addEventListener('scroll', () => {
    const atBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 60;

    if (atBottom) {
      reachedBottom = true;
      return;
    }
    // Subió desde el fondo → mostrar modal (una sola vez)
    if (reachedBottom && !shown) {
      openModal();
    }
  }, { passive: true });
})();
