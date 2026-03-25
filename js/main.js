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
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = 'a, button, .card, .tag, .pillar';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
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
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
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
   STAGGER REVEAL — project cards
═══════════════════════════════════════════ */
(function staggerCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
  });
})();
