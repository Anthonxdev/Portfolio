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

  const hoverTargets = 'a, button, .pj-item, .tag, .pillar';
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
   PROJECTS — Fly-in desde los lados
   Impares ← izquierda, pares → derecha.
   Cada item se activa individualmente al entrar
   en el viewport. Se dispara una sola vez.
═══════════════════════════════════════════ */
(function initProjectsEntrance() {
  if (typeof anime === 'undefined') return;

  const items = Array.from(document.querySelectorAll('#projectsList .pj-item'));
  if (!items.length) return;

  // Estado inicial: escondidos a su lado correspondiente
  items.forEach((item, i) => {
    const fromLeft = i % 2 === 0;
    item.style.opacity  = '0';
    item.style.transform = `translateX(${fromLeft ? '-110px' : '110px'}) rotate(${fromLeft ? '-3' : '3'}deg)`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const i         = items.indexOf(entry.target);
      const fromLeft  = i % 2 === 0;

      anime({
        targets:    entry.target,
        opacity:    [0, 1],
        translateX: [fromLeft ? -110 : 110, 0],
        rotate:     [fromLeft ? -3 : 3, 0],
        duration:   750,
        easing:     'easeOutBack',
      });
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
})();

/* ═══════════════════════════════════════════
   PROJECTS — Imagen de fondo en el row al hover
═══════════════════════════════════════════ */
(function initProjectPreviews() {
  document.querySelectorAll('.pj-item').forEach(item => {
    const img = item.querySelector('.pj-item__preview img');
    if (!img) return;
    item.style.setProperty('--pj-preview-bg', `url('${img.src}')`);
    item.classList.add('has-preview');
  });
})();

/* ═══════════════════════════════════════════
   PROJECTS — Ver más / Ver menos
═══════════════════════════════════════════ */
(function initProjectsToggle() {
  const list = document.getElementById('projectsList');
  const btn  = document.getElementById('projectsToggle');
  if (!list || !btn) return;

  const items   = Array.from(list.querySelectorAll('.pj-item'));
  const VISIBLE = 3;

  // Si hay pocos proyectos, ocultar el botón
  if (items.length <= VISIBLE) {
    btn.closest('.projects__toggle-bar').style.display = 'none';
    return;
  }

  const hidden = items.slice(VISIBLE);
  hidden.forEach(item => item.style.display = 'none');

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen);
    const label = btn.querySelector('.projects__toggle-text');

    if (isOpen) {
      hidden.forEach(item => {
        item.style.display = '';
        item.style.opacity = '0';
        item.style.transform = 'translateX(80px)';
      });
      anime({
        targets: hidden,
        opacity:    [0, 1],
        translateX: [80, 0],
        duration:   600,
        delay:      anime.stagger(80, { start: 60 }),
        easing:     'easeOutCubic'
      });
      label.textContent = window.i18n ? window.i18n.t('projects.toggle.less') : 'View less';
    } else {
      hidden.forEach(item => {
        item.style.display = 'none';
        item.classList.remove('is-visible');
      });
      label.textContent = window.i18n ? window.i18n.t('projects.toggle.more') : 'View all projects';
      list.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
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
