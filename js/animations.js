/**
 * animations.js — Anime.js powered animations v2
 * Requires js/anime.min.js loaded before this file.
 */

const _isTouch = window.matchMedia('(pointer: coarse)').matches;

/* ═══════════════════════════════════════════
   1. STATS COUNTER + ACCENT FLASH
   Numbers count up from 0 after the hero CSS
   entrance finishes, then flash accent on done.
═══════════════════════════════════════════ */
(function initStatsCounter() {
  if (typeof anime === 'undefined') return;

  const statEls = document.querySelectorAll('.hero__stat-num');
  if (!statEls.length) return;

  const stats = Array.from(statEls).map(el => {
    const raw = el.textContent.trim();
    return { el, value: parseInt(raw, 10), suffix: raw.replace(/[0-9]/g, '') };
  });

  setTimeout(() => {
    stats.forEach(({ el, value, suffix }, i) => {
      const proxy = { n: 0 };
      anime({
        targets:  proxy,
        n:        value,
        duration: 1600,
        delay:    i * 260,
        easing:   'easeOutExpo',
        round:    1,
        update()   { el.textContent = proxy.n + suffix; },
        complete() {
          el.textContent = value + suffix;
          // flash accent colour, then settle back
          anime({
            targets:  el,
            color:    ['#c8ff00', '#ececec'],
            duration: 700,
            easing:   'easeOutExpo',
          });
        },
      });
    });
  }, 1400);
})();


/* ═══════════════════════════════════════════
   2. SKILLS WAVE — (desactivado, reemplazado por globo 3D)

   Scale punches up from 0.7 with a back-ease
   overshoot for a more energetic feel.
═══════════════════════════════════════════ */
(function initSkillsWave() {
  if (typeof anime === 'undefined') return;

  const groups = document.querySelectorAll('.skills__group');
  if (!groups.length) return;

  // Pre-mark visible so the CSS reveal system ignores these
  groups.forEach(g => {
    g.classList.add('is-visible');
    g.querySelectorAll('.tag').forEach(t => (t.style.transitionDelay = '0ms'));
  });

  anime.set(document.querySelectorAll('.skills__group .tag'), {
    opacity: 0, translateY: 22, scale: 0.7,
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const tags = entry.target.querySelectorAll('.tag');
      anime({
        targets:    tags,
        opacity:    [0, 1],
        translateY: [22, 0],
        scale:      [0.7, 1],
        duration:   550,
        delay:      anime.stagger(55, { easing: 'easeOutSine' }),
        easing:     'easeOutBack',
        complete()  { tags.forEach(t => (t.style.transform = '')); },
      });
    });
  }, { threshold: 0.1 });

  groups.forEach(g => obs.observe(g));
})();


/* ═══════════════════════════════════════════
   3a. PHOTO DECO — glow flicker on reveal
   Simula el mismo "encendido" que el pillar__line
═══════════════════════════════════════════ */
(function initPhotoDeco() {
  if (typeof anime === 'undefined') return;

  const deco  = document.querySelector('.about__photo-deco');
  const photo = document.querySelector('.about__photo');
  if (!deco) return;

  // Empieza sin dibujar — mismo punto de partida que pillar__line
  anime.set(deco, { transformOrigin: 'top right', scaleY: 0 });

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();

    // 1. Se dibuja hacia abajo desde la esquina (igual que pillar__line)
    anime({
      targets:  deco,
      scaleY:   [0, 1],
      duration: 500,
      delay:    350,
      easing:   'easeOutCubic',
      complete() {
        // 2. Flicker de glow al terminar de dibujarse
        anime({
          targets:   deco,
          boxShadow: [
            '2px -2px 8px rgba(200,255,0,0.3)',
            '2px -2px 22px rgba(200,255,0,0.75)',
            '2px -2px 8px rgba(200,255,0,0.3)',
          ],
          duration:  700,
          easing:    'easeOutExpo',
        });
      },
    });
  }, { threshold: 0.3 });

  obs.observe(photo || deco);
})();

/* ═══════════════════════════════════════════
   3. ABOUT PILLARS — slide in from the left
═══════════════════════════════════════════ */
(function initPillarsAnime() {
  if (typeof anime === 'undefined') return;

  const container = document.querySelector('.about__pillars');
  if (!container) return;

  container.classList.add('is-visible');
  const pillars = container.querySelectorAll('.pillar');
  const lines   = container.querySelectorAll('.pillar__line');

  anime.set(pillars, { opacity: 0, translateX: -36 });
  anime.set(lines,   { height: 0 });

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();

    // 1. Pillars slide in from the left
    anime({
      targets:    pillars,
      opacity:    [0, 1],
      translateX: [-36, 0],
      duration:   700,
      delay:      anime.stagger(120),
      easing:     'easeOutCubic',
      complete()  {
        pillars.forEach(p => (p.style.transform = ''));

        // 2. After pillars are in place, accent lines draw downward
        anime({
          targets:  lines,
          height:   ['0%', '100%'],
          duration: 500,
          delay:    anime.stagger(100),
          easing:   'easeOutCubic',
        });
      },
    });
  }, { threshold: 0.15 });

  obs.observe(container);
})();


/* ═══════════════════════════════════════════
   4. PROJECT GRID — depth entrance with rotateX
   Cards tilt forward into place as if falling
   from behind the screen.
═══════════════════════════════════════════ */
(function initProjectGridAnime() {
  if (typeof anime === 'undefined') return;

  const grid = document.querySelector('.projects__grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.card');
  if (!cards.length) return;

  cards.forEach(c => {
    c.classList.add('is-visible');
    c.style.transitionDelay = '0ms';
  });

  grid.style.perspective = '1200px';
  anime.set(cards, { opacity: 0, translateY: 64, scale: 0.92, rotateX: 10 });

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    anime({
      targets:    cards,
      opacity:    [0, 1],
      translateY: [64, 0],
      scale:      [0.92, 1],
      rotateX:    [10, 0],
      duration:   850,
      delay:      anime.stagger(140),
      easing:     'easeOutExpo',
      complete() {
        cards.forEach(c => {
          c.style.transform = '';
          c.style.opacity   = '';
          c.dataset.ready   = '1'; // signal that hover tilt is now safe
        });
      },
    });
  }, { threshold: 0.08 });

  obs.observe(grid);
})();


/* ═══════════════════════════════════════════
   5. 3D CARD TILT
   Cards rotate in 3D based on cursor position.
   Guard with data-ready so tilt only activates
   after the entrance animation completes.
═══════════════════════════════════════════ */
(function initCardTilt() {
  if (typeof anime === 'undefined' || _isTouch) return;

  document.querySelectorAll('.card').forEach(card => {
    // Set perspective on parent once
    const parent = card.parentElement;
    if (parent && !parent.dataset.perspSet) {
      parent.style.perspective = '1000px';
      parent.dataset.perspSet  = '1';
    }

    // For featured cards (not animated by initProjectGridAnime) mark them ready now
    if (!card.closest('.projects__grid')) {
      card.dataset.ready = '1';
    }

    card.addEventListener('mousemove', e => {
      if (!card.dataset.ready) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5; // -0.5 → 0.5
      const y = (e.clientY - r.top)  / r.height - 0.5;
      anime({
        targets:  card,
        rotateY:  x * 14,
        rotateX:  -y * 10,
        duration: 250,
        easing:   'easeOutExpo',
      });
    });

    card.addEventListener('mouseleave', () => {
      if (!card.dataset.ready) return;
      anime({
        targets:  card,
        rotateY:  0,
        rotateX:  0,
        duration: 900,
        easing:   'easeOutElastic(1, .4)',
        complete() { card.style.transform = ''; },
      });
    });
  });
})();


/* ═══════════════════════════════════════════
   6. MAGNETIC BUTTONS
   Buttons pull toward the cursor within their
   bounding box. On leave they spring back with
   an elastic bounce.
═══════════════════════════════════════════ */
(function initMagneticButtons() {
  if (typeof anime === 'undefined' || _isTouch) return;

  document.querySelectorAll('.btn:not([data-runaway])').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      anime({
        targets:    btn,
        translateX: x * 0.38,
        translateY: y * 0.38,
        duration:   180,
        easing:     'easeOutExpo',
      });
    });

    btn.addEventListener('mouseleave', () => {
      anime({
        targets:    btn,
        translateX: 0,
        translateY: 0,
        duration:   800,
        easing:     'easeOutElastic(1, .45)',
        complete()  { btn.style.transform = ''; }, // restore CSS hover transform
      });
    });
  });
})();


/* ═══════════════════════════════════════════
   7. CURSOR PARTICLE TRAIL
   Accent-coloured dots spawn at cursor position
   and shrink + fade out. Distance-gated so they
   only appear when the cursor is moving.
═══════════════════════════════════════════ */
(function initCursorTrail() {
  if (_isTouch) return;

  // Canvas único — cero DOM mutations en cada frame
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position:      'fixed',
    inset:         '0',
    width:         '100%',
    height:        '100%',
    pointerEvents: 'none',
    zIndex:        '9996',
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
  }, { passive: true });

  const dots = [];
  let prevX = 0, prevY = 0;

  document.addEventListener('mousemove', e => {
    const dist = Math.hypot(e.clientX - prevX, e.clientY - prevY);
    if (dist < 14) return;
    prevX = e.clientX;
    prevY = e.clientY;
    dots.push({
      x:       e.clientX,
      y:       e.clientY,
      r:       Math.random() * 2 + 2,   // 2–4 px
      opacity: 0.65,
    });
  }, { passive: true });

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = dots.length - 1; i >= 0; i--) {
      const d = dots[i];
      d.opacity -= 0.025;
      if (d.opacity <= 0) { dots.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * d.opacity, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,255,0,${d.opacity})`;
      ctx.fill();
    }
    requestAnimationFrame(loop);
  })();
})();


/* ═══════════════════════════════════════════
   8. SECTION TITLE CHAR REVEAL
   Each character of section headings drops in
   staggered when the header scrolls into view.
   Fires 250 ms after the header's CSS fadeUp
   so the number appears first, then the title
   text assembles itself letter by letter.
═══════════════════════════════════════════ */
(function initTitleChars() {
  if (typeof anime === 'undefined') return;

  document.querySelectorAll('.section__title').forEach(title => {
    // Process node by node to preserve HTML elements like <em class="accent-word">
    const newHTML = Array.from(title.childNodes).map(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.split('').map(c =>
          c === ' '
            ? ' '
            : `<span class="char" style="display:inline-block;opacity:0;transform:translateY(36px)">${c}</span>`
        ).join('');
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const attrs = Array.from(node.attributes).map(a => `${a.name}="${a.value}"`).join(' ');
        const innerChars = node.textContent.split('').map(c =>
          c === ' '
            ? ' '
            : `<span class="char" style="display:inline-block;opacity:0;transform:translateY(36px)">${c}</span>`
        ).join('');
        return `<${node.tagName.toLowerCase()} ${attrs}>${innerChars}</${node.tagName.toLowerCase()}>`;
      }
      return '';
    }).join('');

    title.innerHTML = newHTML;

    const chars  = title.querySelectorAll('.char');
    const header = title.closest('.section__header') || title;

    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();

      setTimeout(() => {
        anime({
          targets:    chars,
          opacity:    [0, 1],
          translateY: [36, 0],
          duration:   650,
          delay:      anime.stagger(42),
          easing:     'easeOutExpo',
          complete()  { chars.forEach(c => (c.style.transform = '')); },
        });
      }, 250);
    }, { threshold: 0.4 });

    obs.observe(header);
  });
})();


/* ═══════════════════════════════════════════
   9. HERO ORBITAL TECH CONSTELLATION
   Tech labels orbit a pulsing accent center at
   varying radii and speeds, like a planetary
   system. The center drifts subtly toward the
   cursor (parallax). Canvas fades in after the
   hero entrance animations complete.
═══════════════════════════════════════════ */
(function initHeroOrbital() {
  const canvas = document.getElementById('heroOrbit');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  /* ── Orbit definitions ─────────────────── */
  const ORBITS = [
    {
      rFrac: 0.22,
      speed: 0.00030,
      baseColor: '#c8ff00',
      glow:  true,
      dotR:  3.5,
      fSize: 11,
      items: ['React', 'HTML', 'CSS', 'Javascript'],
    },
    {
      rFrac: 0.44,
      speed: 0.00018,
      baseColor: 'rgba(255,255,255,0.70)',
      glow:  false,
      dotR:  3,
      fSize: 11,
      items: ['TypeScript', 'Next.js', 'Docker'],
    },
    {
      rFrac: 0.66,
      speed: 0.00011,
      baseColor: 'rgba(255,255,255,0.42)',
      glow:  false,
      dotR:  2.5,
      fSize: 10,
      items: ['Node.js', 'MySQL', 'PHP', 'Python'],
    },
    {
      rFrac: 0.88,
      speed: 0.000065,
      baseColor: 'rgba(255,255,255,0.24)',
      glow:  false,
      dotR:  2,
      fSize: 10,
      items: ['Mongodb', 'PostgressSQL', 'MySQL', 'Supabase'],
    },
  ];

  // Build node objects with per-item hover state
  ORBITS.forEach((o, oi) => {
    const offset = oi * 0.75;
    o.nodes = o.items.map((label, i) => ({
      label,
      startAngle: offset + (2 * Math.PI * i) / o.items.length,
      highlight:  0, // 0–1, lerped each frame
    }));
  });

  /* ── Mouse tracking (canvas-relative) ──── */
  let mX = -9999, mY = -9999;
  let tOx = 0, tOy = 0, cOx = 0, cOy = 0;
  let cachedRect = null;

  document.addEventListener('mousemove', e => {
    if (!cachedRect) return;
    mX  = e.clientX - cachedRect.left;
    mY  = e.clientY - cachedRect.top;
    tOx = (mX - cachedRect.width  / 2) * 0.020;
    tOy = (mY - cachedRect.height / 2) * 0.020;
  }, { passive: true });

  /* ── Resize ──────────────────────────────── */
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    cachedRect = canvas.getBoundingClientRect();
    W = cachedRect.width;
    H = cachedRect.height;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', () => { cachedRect = canvas.getBoundingClientRect(); }, { passive: true });

  /* ── Visibility gate — pause when off-screen ── */
  /* ── Draw loop ───────────────────────────── */
  let startTime = null;
  let rafId = null;

  function draw(ts) {
    if (!startTime) startTime = ts;
    const t = ts - startTime;

    ctx.clearRect(0, 0, W, H);

    cOx += (tOx - cOx) * 0.04;
    cOy += (tOy - cOy) * 0.04;

    const cx   = W / 2 + cOx;
    const cy   = H / 2 + cOy;
    const maxR = Math.min(W, H) * 0.42;

    /* — Pre-compute node positions & update highlight — */
    ORBITS.forEach(o => {
      o.nodes.forEach(node => {
        const angle = node.startAngle + t * o.speed;
        const ix    = cx + Math.cos(angle) * (maxR * o.rFrac);
        const iy    = cy + Math.sin(angle) * (maxR * o.rFrac);
        node._ix    = ix;
        node._iy    = iy;
        node._angle = angle;

        // Hit radius: dot area + label area (generous)
        const dist    = Math.hypot(mX - ix, mY - iy);
        const hovered = dist < 38;
        node.highlight += ((hovered ? 1 : 0) - node.highlight) * 0.10;
      });
    });

    /* — Orbit rings — */
    ctx.setLineDash([4, 8]);
    ORBITS.forEach(o => {
      const orbitH = Math.max(...o.nodes.map(n => n.highlight)); // ring lights up with its items
      const r      = maxR * o.rFrac;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.lineWidth   = 1.2 + orbitH * 1.2;
      ctx.strokeStyle = orbitH > 0.01
        ? `rgba(200,255,0,${0.18 + orbitH * 0.50})`
        : 'rgba(255,255,255,0.18)';
      ctx.shadowColor = '#c8ff00';
      ctx.shadowBlur  = orbitH * 14;
      ctx.stroke();
      ctx.shadowBlur  = 0;
    });
    ctx.setLineDash([]);

    /* — Center: pulsing dot + glow halo — */
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.0014);

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 36);
    grd.addColorStop(0, `rgba(200,255,0,${0.10 + pulse * 0.08})`);
    grd.addColorStop(1,  'rgba(200,255,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 2.5 + pulse * 1.8, 0, Math.PI * 2);
    ctx.fillStyle   = '#c8ff00';
    ctx.fill();

    /* — Orbital items — */
    ORBITS.forEach(o => {
      const r = maxR * o.rFrac;

      o.nodes.forEach(node => {
        const { _ix: ix, _iy: iy, _angle: angle, highlight: h } = node;
        const cos = Math.cos(angle);

        /* dot — grows and turns accent on hover */
        ctx.beginPath();
        ctx.arc(ix, iy, o.dotR + h * 2.5, 0, Math.PI * 2);
        ctx.fillStyle   = h > 0.05
          ? `rgba(200,255,0,${0.5 + h * 0.5})`
          : (o.glow ? '#c8ff00' : o.baseColor);
        if (h > 0.01) {
          ctx.shadowColor = '#c8ff00';
          ctx.shadowBlur  = h * 14;
        }
        ctx.fill();
        ctx.shadowBlur  = 0;

        /* text */
        const PUSH = 13 + h * 5;
        const tx   = cx + cos * (r + PUSH);
        const ty   = cy + Math.sin(angle) * (r + PUSH);

        ctx.font         = `500 ${o.fSize + h}px "JetBrains Mono", monospace`;
        ctx.textAlign    = cos > 0.15 ? 'left' : cos < -0.15 ? 'right' : 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = h > 0.05
          ? `rgba(200,255,0,${0.6 + h * 0.4})`
          : (o.glow ? '#c8ff00' : o.baseColor);
        if (h > 0.01) {
          ctx.shadowColor = '#c8ff00';
          ctx.shadowBlur  = h * 10;
        }
        ctx.fillText(node.label, tx, ty);
        ctx.shadowBlur   = 0;
      });
    });

    rafId = requestAnimationFrame(draw);
  }

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !rafId) {
      startTime = null;
      rafId = requestAnimationFrame(draw);
    } else if (!entry.isIntersecting && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }, { threshold: 0 }).observe(canvas);

  /* ── Fade in after hero entrance ─────────── */
  if (typeof anime !== 'undefined') {
    anime({ targets: canvas, opacity: [0, 1], duration: 1800, delay: 1600, easing: 'easeOutExpo' });
  } else {
    setTimeout(() => { canvas.style.opacity = '1'; }, 1600);
  }
})();


/* ═══════════════════════════════════════════
   10. RUNAWAY BUTTON
   El botón "Trabajemos juntos" huye del cursor.
   Cuanto más cerca estás, más fuerte escapa.
   Cuando el cursor se aleja vuelve suavemente
   a su posición original.
═══════════════════════════════════════════ */
(function initRunawayButton() {
  if (_isTouch) return;

  const btn = document.querySelector('[data-runaway]');
  if (!btn) return;

  const FLEE_R = 120;   // radio de activación (px desde centro del botón)
  const MAX_D  = 110;   // desplazamiento máximo (px)
  const LERP   = 0.11;  // factor de suavizado — más bajo = más lento/dramático

  let tx = 0, ty = 0;   // target offset
  let cx = 0, cy = 0;   // current offset (lerped)

  // Loop siempre activo — coste mínimo
  (function tick() {
    cx += (tx - cx) * LERP;
    cy += (ty - cy) * LERP;
    btn.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
    requestAnimationFrame(tick);
  })();

  document.addEventListener('mousemove', e => {
    const r    = btn.getBoundingClientRect();
    const bcx  = r.left + r.width  / 2;
    const bcy  = r.top  + r.height / 2;
    const dx   = e.clientX - bcx;
    const dy   = e.clientY - bcy;
    const dist = Math.hypot(dx, dy);

    if (dist < FLEE_R) {
      // Fuerza inversamente proporcional a la distancia (cuadrática)
      const force = Math.pow(1 - dist / FLEE_R, 1.8);
      const angle = Math.atan2(dy, dx);
      tx = -Math.cos(angle) * MAX_D * force;
      ty = -Math.sin(angle) * MAX_D * force;
    } else {
      tx = 0;
      ty = 0;
    }
  }, { passive: true });

  // Vuelve al origen si el cursor sale de la sección about
  const section = document.getElementById('about');
  if (section) {
    section.addEventListener('mouseleave', () => { tx = 0; ty = 0; }, { passive: true });
  }
})();


/* ═══════════════════════════════════════════
   11. CONTACT TITLE — LETTER ASSEMBLY
   Las letras del título llegan dispersas desde
   distintas direcciones y se ensamblan al hacer
   scroll hasta la sección de contacto.
═══════════════════════════════════════════ */
(function initContactTitleAssembly() {
  if (typeof anime === 'undefined') return;

  const title = document.querySelector('#contact .contact__title');
  if (!title) return;

  /* ── Split text preserving the <br> and <em> ─ */
  function splitNode(node, container) {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split('').forEach(ch => {
        const span = document.createElement('span');
        span.className = 'c-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.display        = 'inline-block';
        span.style.willChange     = 'transform, opacity';
        container.appendChild(span);
      });
    } else if (node.nodeName === 'BR') {
      container.appendChild(document.createElement('br'));
    } else if (node.nodeName === 'EM') {
      const em = document.createElement('em');
      Array.from(node.childNodes).forEach(child => splitNode(child, em));
      container.appendChild(em);
    } else {
      Array.from(node.childNodes).forEach(child => splitNode(child, container));
    }
  }

  const fragment = document.createDocumentFragment();
  Array.from(title.childNodes).forEach(child => splitNode(child, fragment));
  title.innerHTML = '';
  title.appendChild(fragment);

  const chars = title.querySelectorAll('.c-char');

  /* ── Assign random scatter origin per char ─── */
  const scatterData = Array.from(chars).map(() => {
    const angle  = Math.random() * Math.PI * 2;
    const dist   = 180 + Math.random() * 320;
    return {
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      rot: (Math.random() - 0.5) * 360,
    };
  });

  /* ── Set initial scattered state ────────────── */
  chars.forEach((ch, i) => {
    anime.set(ch, {
      translateX: scatterData[i].tx,
      translateY: scatterData[i].ty,
      rotate:     scatterData[i].rot,
      opacity:    0,
    });
  });

  /* ── Trigger assembly / decomposition on scroll ─ */
  let currentAnim = null;

  function assemble() {
    if (currentAnim) currentAnim.pause();
    currentAnim = anime({
      targets:    chars,
      translateX: 0,
      translateY: 0,
      rotate:     0,
      opacity:    1,
      duration:   1100,
      delay:      anime.stagger(28, { from: 'center' }),
      easing:     'easeOutExpo',
    });
  }

  function scatter() {
    if (currentAnim) currentAnim.pause();
    currentAnim = anime({
      targets:    chars,
      translateX: (_, i) => scatterData[i].tx,
      translateY: (_, i) => scatterData[i].ty,
      rotate:     (_, i) => scatterData[i].rot,
      opacity:    0,
      duration:   800,
      delay:      anime.stagger(18, { from: 'center' }),
      easing:     'easeInExpo',
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        assemble();
      } else {
        scatter();
      }
    });
  }, { threshold: 0.25 });

  observer.observe(document.getElementById('contact'));

  /* ── Hover: scatter on enter, reassemble on leave ─ */
  if (!_isTouch) {
    title.style.cursor = 'default';
    title.addEventListener('mouseenter', () => scatter());
    title.addEventListener('mouseleave', () => assemble());
  }
})();


/* ═══════════════════════════════════════════
   12. SKILLS GLOBE — Esfera 3D interactiva
   Tecnologías distribuidas con el algoritmo de
   Fibonacci. Depth-cueing de opacidad y escala.
   Malla de meridianos y paralelos.
═══════════════════════════════════════════ */
(function initSkillsGlobe() {
  const canvas = document.getElementById('skillsGlobe');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── Tecnologías con colores de marca ─────── */
  const TECHS = [
    { name: 'React',      color: '#61DAFB', desc: 'UI library for building web interfaces', path: 'M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z' },
    { name: 'Next.js',    color: '#dddddd', desc: 'React framework with SSR & routing', path: 'M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z' },
    { name: 'TypeScript', color: '#3178C6', desc: 'Typed superset of JavaScript', path: 'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z' },
    { name: 'JavaScript', color: '#F7DF1E', desc: 'The language of the web', path: 'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z' },
    { name: 'Node.js',    color: '#8CC84B', desc: 'JavaScript runtime on the server', path: 'M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.151-.023.218.017l2.256 1.339c.082.045.197.045.272 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.192-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271 0L3.075 6.68C2.99 6.729 2.936 6.825 2.936 6.921v10.15c0 .097.054.189.139.235l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675c-.57-.329-.922-.945-.922-1.604V6.921c0-.659.353-1.275.922-1.603l8.795-5.082c.557-.315 1.296-.315 1.848 0l8.794 5.082c.57.329.924.944.924 1.603v10.15c0 .659-.354 1.273-.924 1.604l-8.794 5.078C12.643 23.916 12.324 24 11.998 24zm2.701-6.807c-3.863 0-4.67-1.772-4.67-3.259 0-.142.114-.253.256-.253h1.138c.127 0 .233.092.252.217.172 1.158.684 1.742 3.024 1.742 1.863 0 2.655-.421 2.655-1.41 0-.569-.225-.992-3.118-1.276-2.419-.239-3.912-.772-3.912-2.703 0-1.781 1.5-2.842 4.015-2.842 2.825 0 4.222 .98 4.397 3.088a.256.256 0 0 1-.065.196.255.255 0 0 1-.188.082h-1.143a.253.253 0 0 1-.245-.198c-.274-1.22-.94-1.611-2.756-1.611-2.029 0-2.265.707-2.265 1.237 0 .642.279.829 3.023 1.19 2.717.358 4.007.866 4.007 2.782-.001 1.925-1.605 3.018-4.405 3.018z' },
    { name: 'PHP',        color: '#8892BF', desc: 'Server-side scripting language', path: 'M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z' },
    { name: 'Python',     color: '#4B8BBE', desc: 'Versatile high-level language', path: 'M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08' },
    { name: 'Django',     color: '#44B78B', desc: 'Python web framework, batteries included', path: 'M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.002 2.65-6.6 6.753-6.6.637 0 1.121.05 1.707.203zm0 9.143a3.894 3.894 0 00-1.325-.204c-1.988 0-3.134 1.223-3.134 3.365 0 2.09 1.096 3.236 3.109 3.236.433 0 .79-.025 1.35-.102V9.142zM21.314 6.06v9.098c0 3.134-.229 4.638-.917 5.937-.637 1.249-1.478 2.039-3.211 2.905l-3.644-1.733c1.733-.815 2.574-1.53 3.109-2.625.561-1.121.739-2.421.739-5.835V6.059h3.924zM17.39.021h3.924v4.026H17.39z' },
    { name: 'MySQL',      color: '#00AEF0', desc: 'Open-source relational database', path: 'M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135l-1.016-.5c.09-.076.177-.158.255-.25.433-.506.648-1.258.648-2.253 0-1.83-.718-2.746-2.155-2.746-.704 0-1.254.232-1.65.697-.43.508-.646 1.256-.646 2.245 0 .972.19 1.686.574 2.14.35.41.877.615 1.583.615.264 0 .506-.033.725-.098l1.325.772.36-.622zM15.5 17.588c-.225-.36-.337-.94-.337-1.736 0-1.393.424-2.09 1.27-2.09.443 0 .77.167.977.5.224.362.336.936.336 1.723 0 1.404-.424 2.108-1.27 2.108-.445 0-.77-.167-.978-.5zm-1.658-.425c0 .47-.172.856-.516 1.156-.344.3-.803.45-1.384.45-.543 0-1.064-.172-1.573-.515l.237-.476c.438.22.833.328 1.19.328.332 0 .593-.073.783-.22a.754.754 0 00.3-.615c0-.33-.23-.61-.648-.845-.388-.213-1.163-.657-1.163-.657-.422-.307-.632-.636-.632-1.177 0-.45.157-.81.47-1.085.315-.278.72-.415 1.22-.415.512 0 .98.136 1.4.41l-.213.476a2.726 2.726 0 00-1.064-.23c-.283 0-.502.068-.654.206a.685.685 0 00-.248.524c0 .328.234.61.666.85.393.215 1.187.67 1.187.67.433.305.648.63.648 1.168zm9.382-5.852c-.535-.014-.95.04-1.297.188-.1.04-.26.04-.274.167.055.053.063.14.11.214.08.134.218.313.346.407.14.11.28.216.427.31.26.16.555.255.81.416.145.094.293.213.44.313.073.05.12.14.214.172v-.02c-.046-.06-.06-.147-.105-.214-.067-.067-.134-.127-.2-.193a3.223 3.223 0 00-.695-.675c-.214-.146-.682-.35-.77-.595l-.013-.014c.146-.013.32-.066.46-.106.227-.06.435-.047.67-.106.106-.027.213-.06.32-.094v-.06c-.12-.12-.21-.283-.334-.395a8.867 8.867 0 00-1.104-.823c-.21-.134-.476-.22-.697-.334-.08-.04-.214-.06-.26-.127-.12-.146-.19-.34-.275-.514a17.69 17.69 0 01-.547-1.163c-.12-.262-.193-.523-.34-.763-.69-1.137-1.437-1.826-2.586-2.5-.247-.14-.543-.2-.856-.274-.167-.008-.334-.02-.5-.027-.11-.047-.216-.174-.31-.235-.38-.24-1.364-.76-1.644-.072-.18.434.267.862.422 1.082.115.153.26.328.34.5.047.116.06.235.107.356.106.294.207.622.347.897.073.14.153.287.247.413.054.073.146.107.167.227-.094.136-.1.334-.154.5-.24.757-.146 1.693.194 2.25.107.166.362.534.703.393.3-.12.234-.5.32-.835.02-.08.007-.133.048-.187v.015c.094.188.188.367.274.555.206.328.566.668.867.895.16.12.287.328.487.402v-.02h-.015c-.043-.058-.1-.086-.154-.133a3.445 3.445 0 01-.35-.4 8.76 8.76 0 01-.747-1.218c-.11-.21-.202-.436-.29-.643-.04-.08-.04-.2-.107-.24-.1.146-.247.273-.32.453-.127.288-.14.642-.188 1.01-.027.007-.014 0-.027.014-.214-.052-.287-.274-.367-.46-.2-.475-.233-1.238-.06-1.785.047-.14.247-.582.167-.716-.042-.127-.174-.2-.247-.303a2.478 2.478 0 01-.24-.427c-.16-.374-.24-.788-.414-1.162-.08-.173-.22-.354-.334-.513-.127-.18-.267-.307-.368-.52-.033-.073-.08-.194-.027-.274.014-.054.042-.075.094-.09.088-.072.335.022.422.062.247.1.455.194.662.334.094.066.195.193.315.226h.14c.214.047.455.014.655.073.355.114.675.28.962.46a5.953 5.953 0 012.085 2.286c.08.154.115.295.188.455.14.33.313.663.455.982.14.315.275.636.476.897.1.14.502.213.682.286.133.06.34.115.46.188.23.14.454.3.67.454.11.076.443.243.463.378z' },
    { name: 'PostgreSQL', color: '#5B9BD5', desc: 'Advanced open-source SQL database', path: 'M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698z' },
    { name: 'MongoDB',    color: '#47A248', desc: 'NoSQL document-oriented database', path: 'M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z' },
    { name: 'Docker',     color: '#2496ED', desc: 'Container platform for any app', path: 'M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z' },
    { name: 'Git',        color: '#F54D27', desc: 'Distributed version control system', path: 'M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187' },
    { name: 'Laravel',    color: '#FF2D20', desc: 'Elegant PHP web framework', path: 'M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 01.023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 01.375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 01.024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 01.375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.147 1.225-6.126 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.04-.01-.011-.021-.022-.028-.036h-.002c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 01-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zM5.23.81L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978L16.21 7.087 14.63 6.18v4.283l2.182 1.256 1.58.908zm-8.65 9.654l5.514-3.148 2.756-1.572-3.757-2.163-4.323 2.489-3.941 2.27z' },
    { name: 'CSS',        color: '#264DE4', desc: 'Stylesheet language for the web', path: 'M0 0v20.16A3.84 3.84 0 0 0 3.84 24h16.32A3.84 3.84 0 0 0 24 20.16V3.84A3.84 3.84 0 0 0 20.16 0Zm14.256 13.08c1.56 0 2.28 1.08 2.304 2.64h-1.608c.024-.288-.048-.6-.144-.84-.096-.192-.288-.264-.552-.264-.456 0-.696.264-.696.84-.024.576.288.888.768 1.08.72.288 1.608.744 1.92 1.296q.432.648.432 1.656c0 1.608-.912 2.592-2.496 2.592-1.656 0-2.4-1.032-2.424-2.688h1.68c0 .792.264 1.176.792 1.176.264 0 .456-.072.552-.24.192-.312.24-1.176-.048-1.512-.312-.408-.912-.6-1.32-.816q-.828-.396-1.224-.936c-.24-.36-.36-.888-.36-1.536 0-1.44.936-2.472 2.424-2.448m5.4 0c1.584 0 2.304 1.08 2.328 2.64h-1.608c0-.288-.048-.6-.168-.84-.096-.192-.264-.264-.528-.264-.48 0-.72.264-.72.84s.288.888.792 1.08c.696.288 1.608.744 1.92 1.296.264.432.408.984.408 1.656.024 1.608-.888 2.592-2.472 2.592-1.68 0-2.424-1.056-2.448-2.688h1.68c0 .744.264 1.176.792 1.176.264 0 .456-.072.552-.24.216-.312.264-1.176-.048-1.512-.288-.408-.888-.6-1.32-.816-.552-.264-.96-.576-1.2-.936s-.36-.888-.36-1.536c-.024-1.44.912-2.472 2.4-2.448m-11.031.018c.711-.006 1.419.198 1.839.63.432.432.672 1.128.648 1.992H9.336c.024-.456-.096-.792-.432-.96-.312-.144-.768-.048-.888.24-.12.264-.192.576-.168.864v3.504c0 .744.264 1.128.768 1.128a.65.65 0 0 0 .552-.264c.168-.24.192-.552.168-.84h1.776c.096 1.632-.984 2.712-2.568 2.688-1.536 0-2.496-.864-2.472-2.472v-4.032c0-.816.24-1.44.696-1.848.432-.408 1.146-.624 1.857-.63' },
    { name: 'HTML',       color: '#E34C26', desc: 'Markup structure of the web', path: 'M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z' },
    { name: 'Figma',      color: '#F24E1E', desc: 'Collaborative UI design tool', path: 'M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z' },
    { name: 'Bootstrap',  color: '#7952B3', desc: 'CSS framework for responsive UI', path: 'M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572zm.324 1.206H9.957v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.326-1.663zM24 11.39v1.218c-1.128.108-1.817.944-2.226 2.268-.407 1.319-.463 2.937-.42 4.186.045 1.3-.968 2.5-2.337 2.5H4.985c-1.37 0-2.383-1.2-2.337-2.5.043-1.249-.013-2.867-.42-4.186-.41-1.324-1.1-2.16-2.228-2.268V11.39c1.128-.108 1.819-.944 2.227-2.268.408-1.319.464-2.937.42-4.186-.045-1.3.968-2.5 2.338-2.5h14.032c1.37 0 2.382 1.2 2.337 2.5-.043 1.249.013 2.867.42 4.186.409 1.324 1.098 2.16 2.226 2.268zm-7.927 2.817c0-1.354-.953-2.333-2.368-2.488v-.057c1.04-.169 1.856-1.135 1.856-2.213 0-1.537-1.213-2.538-3.062-2.538h-4.16v10.172h4.181c2.218 0 3.553-1.086 3.553-2.876z' },
  ];

  /* ── Fibonacci sphere: distribución uniforme ─ */
  const GOLDEN = (1 + Math.sqrt(5)) / 2;
  const nodes  = TECHS.map((tech, i) => {
    const t = Math.acos(1 - 2 * (i + 0.5) / TECHS.length);
    const p = 2 * Math.PI * i / GOLDEN;
    return { ...tech,
      ox: Math.sin(t) * Math.cos(p),
      oy: Math.cos(t),
      oz: Math.sin(t) * Math.sin(p),
    };
  });

  /* ── Canvas & dimensiones ─────────────────── */
  let W, H, R, cx, cy;

  function resize() {
    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    W = rect.width;  H = rect.height;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2;  cy = H / 2;
    R  = Math.min(W, H) * 0.36;
  }

  /* ── Rotaciones 3D ────────────────────────── */
  function rotY(x, y, z, a) {
    return { x: x * Math.cos(a) + z * Math.sin(a), y, z: -x * Math.sin(a) + z * Math.cos(a) };
  }
  function rotX(x, y, z, a) {
    return { x, y: y * Math.cos(a) - z * Math.sin(a), z: y * Math.sin(a) + z * Math.cos(a) };
  }

  /* ── Proyección perspectiva ───────────────── */
  function project(x, y, z) {
    const fov = R * 3.2;
    const s   = fov / (fov + z);
    return { px: cx + x * s, py: cy + y * s, s, depth: (z / R + 1) / 2 };
  }

  /* ── hex → "r,g,b" ───────────────────────── */
  function rgb(hex) {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ].join(',');
  }

  /* ── Hover + Drag ────────────────────────── */
  let mouseCanvasX = -9999, mouseCanvasY = -9999;
  let hoveredNode  = null;
  let hoverAlpha   = 0;

  // Drag para rotar la esfera
  let isDragging  = false;
  let dragStartX  = 0, dragStartY  = 0;
  let dragAngleY  = 0, dragAngleX  = 0;   // acumulado por drag
  let dragBaseY   = 0, dragBaseX   = 0;

  if (!_isTouch) {
    canvas.addEventListener('mousemove', e => {
      mouseCanvasX = e.offsetX;
      mouseCanvasY = e.offsetY;
      if (isDragging) {
        dragAngleY = dragBaseY + (e.offsetX - dragStartX) * 0.007;
        dragAngleX = dragBaseX + (e.offsetY - dragStartY) * 0.007;
      }
    }, { passive: true });

    canvas.addEventListener('mousedown', e => {
      isDragging = true;
      dragStartX = e.offsetX;
      dragStartY = e.offsetY;
      dragBaseY  = dragAngleY;
      dragBaseX  = dragAngleX;
      canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) { isDragging = false; canvas.style.cursor = 'none'; }
    });

    canvas.addEventListener('mouseleave', () => {
      mouseCanvasX = -9999; mouseCanvasY = -9999; hoveredNode = null;
    });
  }

  /* ── Parallax con el ratón ────────────────── */
  let tiltX = 0.28, tiltY = 0;
  let tgtX  = 0.28, tgtY  = 0;

  const section = document.getElementById('skills');
  if (section && !_isTouch) {
    section.addEventListener('mousemove', e => {
      const r = section.getBoundingClientRect();
      tgtX = 0.28 + ((e.clientY - r.top)  / r.height - 0.5) * 0.55;
      tgtY =        ((e.clientX - r.left) / r.width  - 0.5) * 0.55;
    }, { passive: true });
    section.addEventListener('mouseleave', () => { tgtX = 0.28; tgtY = 0; });
  }

  /* ── Malla de la esfera ───────────────────── */
  function drawMesh(ay, ax) {
    const SEG = 64;
    ctx.lineWidth   = 0.55;
    ctx.strokeStyle = 'rgba(110, 130, 220, 0.13)';
    ctx.setLineDash([3, 8]);

    for (let i = 1; i <= 8; i++) {               // paralelos
      const phi = (i / 9) * Math.PI;
      ctx.beginPath();
      for (let j = 0; j <= SEG; j++) {
        const theta = (j / SEG) * Math.PI * 2;
        const r1 = rotY(R * Math.sin(phi) * Math.cos(theta), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(theta), ay);
        const r2 = rotX(r1.x, r1.y, r1.z, ax);
        const { px, py } = project(r2.x, r2.y, r2.z);
        j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    for (let i = 0; i < 12; i++) {               // meridianos
      const theta = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      for (let j = 0; j <= SEG; j++) {
        const phi = (j / SEG) * Math.PI;
        const r1 = rotY(R * Math.sin(phi) * Math.cos(theta), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(theta), ay);
        const r2 = rotX(r1.x, r1.y, r1.z, ax);
        const { px, py } = project(r2.x, r2.y, r2.z);
        j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  /* ── Nodos de tecnología con iconos SVG ──── */
  function drawNodes(pts) {
    const dimmed = hoveredNode !== null;

    pts.forEach(n => {
      const { px, py, depth, s } = n;
      const isHovered = hoveredNode && n.name === hoveredNode.name;
      const baseAlpha = 0.15 + depth * 0.85;
      const alpha     = dimmed && !isHovered ? baseAlpha * 0.25 : baseAlpha;
      const iconSize  = Math.max(16, (21 + depth * 17) * s);
      const fSize     = Math.max(9,  (11 + depth * 8)  * s);
      const c         = rgb(n.color);

      const isHoveredNode = hoveredNode && n.name === hoveredNode.name;
      if (isHoveredNode) {
        ctx.shadowColor = n.color;
        ctx.shadowBlur  = depth * 18;
      }

      ctx.save();
      ctx.translate(px - iconSize / 2, py - iconSize / 2);
      ctx.scale(iconSize / 24, iconSize / 24);
      ctx.fillStyle = `rgba(${c},${alpha})`;
      try { ctx.fill(new Path2D(n.path)); } catch(e) {}
      ctx.restore();

      ctx.shadowBlur = 0;

      ctx.font         = `500 ${fSize}px "JetBrains Mono", monospace`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle    = `rgba(${c},${alpha * 0.9})`;
      ctx.fillText(n.name, px, py + iconSize / 2 + 3 * s);
    });
  }

  /* ── Overlay central al hacer hover ─────── */
  function drawHoverOverlay() {
    if (hoverAlpha < 0.01 || !hoveredNode) return;
    const n        = hoveredNode;
    const c        = rgb(n.color);
    const iconSize = Math.min(W, H) * 0.22;
    const fSize    = Math.max(14, iconSize * 0.22);
    const dSize    = Math.max(10, fSize * 0.68);
    const a        = hoverAlpha;
    const yShift   = fSize * 0.85;   // desplaza todo hacia arriba para dejar espacio a la desc

    // Fondo semitransparente (ligeramente más grande para acomodar la descripción)
    ctx.save();
    ctx.globalAlpha = a * 0.12;
    ctx.beginPath();
    ctx.arc(cx, cy, iconSize * 0.96, 0, Math.PI * 2);
    ctx.fillStyle = n.color;
    ctx.fill();
    ctx.restore();

    // Icono grande centrado (desplazado hacia arriba)
    ctx.shadowColor = n.color;
    ctx.shadowBlur  = 28 * a;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(cx - iconSize / 2, cy - iconSize / 2 - fSize * 0.6 - yShift);
    ctx.scale(iconSize / 24, iconSize / 24);
    ctx.fillStyle = n.color;
    try { ctx.fill(new Path2D(n.path)); } catch(e) {}
    ctx.restore();
    ctx.shadowBlur = 0;

    // Nombre debajo del icono
    const nameY = cy + iconSize / 2 - fSize * 0.6 - yShift + 8;
    ctx.globalAlpha  = a;
    ctx.font         = `700 ${fSize}px "JetBrains Mono", monospace`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle    = n.color;
    ctx.fillText(n.name, cx, nameY);

    // Descripción con word-wrap (i18n-aware)
    const desc = (window.i18n && window.i18n.t('tech.' + n.name + '.desc') !== 'tech.' + n.name + '.desc')
      ? window.i18n.t('tech.' + n.name + '.desc')
      : n.desc;
    if (desc) {
      ctx.font      = `400 ${dSize}px "Space Grotesk", sans-serif`;
      ctx.fillStyle = `rgba(${c},${a * 0.72})`;
      const maxW  = iconSize * 1.7;
      const words = desc.split(' ');
      const lines = [];
      let line = '';
      words.forEach(word => {
        const test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width > maxW && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      });
      if (line) lines.push(line);
      const lineH = dSize * 1.45;
      const descY = nameY + fSize * 1.45;
      lines.forEach((ln, i) => ctx.fillText(ln, cx, descY + i * lineH));
    }

    ctx.globalAlpha = 1;
  }

  /* ── Loop de animación ────────────────────── */
  let t0 = null, rafId = null, running = false;
  let prevTs   = 0;
  let rotAngle = 0;   // ángulo Y acumulado (no salta al reanudar)

  function draw(ts) {
    if (!t0) { t0 = ts; prevTs = ts; }
    const delta = ts - prevTs;
    prevTs = ts;
    ctx.clearRect(0, 0, W, H);

    tiltX += (tgtX - tiltX) * 0.04;
    tiltY += (tgtY - tiltY) * 0.04;

    // Solo avanza cuando no hay hover ni drag activo
    if (!hoveredNode && !isDragging) rotAngle += 0.00022 * delta;

    const ay = rotAngle + dragAngleY + tiltY;
    const ax = tiltX + dragAngleX;

    // Proyectar todos los nodos
    const pts = nodes.map(n => {
      const r1 = rotY(n.ox * R, n.oy * R, n.oz * R, ay);
      const r2 = rotX(r1.x, r1.y, r1.z, ax);
      return { ...n, ...project(r2.x, r2.y, r2.z) };
    }).sort((a, b) => a.depth - b.depth);

    // Detectar nodo bajo el cursor
    if (!_isTouch) {
      let closest = null, closestDist = Infinity;
      pts.forEach(n => {
        const iconSize = Math.max(10, (13 + n.depth * 11) * n.s);
        const hitR     = iconSize * 0.8;
        const dx = n.px - mouseCanvasX, dy = n.py - mouseCanvasY;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < hitR && d < closestDist) { closestDist = d; closest = n; }
      });
      hoveredNode = closest;
    }

    // Lerp overlay alpha
    hoverAlpha += ((hoveredNode ? 1 : 0) - hoverAlpha) * 0.12;

    drawMesh(ay, ax);
    drawNodes(pts);
    drawHoverOverlay();

    if (running) rafId = requestAnimationFrame(draw);
  }

  /* ── Inicialización ───────────────────────── */
  canvas.style.opacity = '0';
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let fadedIn = false;

  /* Solo animar cuando es visible (ahorra CPU) */
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) {
      running = true; t0 = null;
      rafId = requestAnimationFrame(draw);
      // Fade in la primera vez
      if (!fadedIn) {
        fadedIn = true;
        if (typeof anime !== 'undefined') {
          anime({ targets: canvas, opacity: [0, 1], duration: 1200, easing: 'easeOutExpo' });
        } else {
          canvas.style.opacity = '1';
        }
      }
    } else if (!entry.isIntersecting && running) {
      running = false;
      cancelAnimationFrame(rafId);
    }
  }, { threshold: 0.1 }).observe(canvas);
})();
