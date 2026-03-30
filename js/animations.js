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
   2. SKILLS WAVE — tags cascade in per group
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

  let prevX = 0, prevY = 0;

  document.addEventListener('mousemove', e => {
    const dist = Math.hypot(e.clientX - prevX, e.clientY - prevY);
    if (dist < 14) return; // skip if barely moved
    prevX = e.clientX;
    prevY = e.clientY;

    const dot  = document.createElement('div');
    const size = Math.random() * 4 + 3; // 3–7 px
    Object.assign(dot.style, {
      position:      'fixed',
      width:         size + 'px',
      height:        size + 'px',
      borderRadius:  '50%',
      background:    '#c8ff00',
      pointerEvents: 'none',
      zIndex:        '9996',
      left:          e.clientX + 'px',
      top:           e.clientY + 'px',
      transform:     'translate(-50%, -50%)',
    });
    document.body.appendChild(dot);

    anime({
      targets:  dot,
      opacity:  [0.65, 0],
      scale:    [1, 0.1],
      duration: 650,
      easing:   'easeOutExpo',
      complete() { dot.remove(); },
    });
  });
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
    const text = title.textContent;

    // Replace text with individual character spans
    title.innerHTML = text
      .split('')
      .map(c =>
        c === ' '
          ? ' '
          : `<span class="char" style="display:inline-block;opacity:0;transform:translateY(36px)">${c}</span>`
      )
      .join('');

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

  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mX  = e.clientX - rect.left;
    mY  = e.clientY - rect.top;
    tOx = (mX - rect.width  / 2) * 0.020;
    tOy = (mY - rect.height / 2) * 0.020;
  }, { passive: true });

  /* ── Resize ──────────────────────────────── */
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── Draw loop ───────────────────────────── */
  let startTime = null;

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
    ctx.shadowColor = '#c8ff00';
    ctx.shadowBlur  = 12;
    ctx.fill();
    ctx.shadowBlur  = 0;

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
        ctx.shadowColor = '#c8ff00';
        ctx.shadowBlur  = (o.glow ? 8 : 0) + h * 14;
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
        ctx.shadowColor  = '#c8ff00';
        ctx.shadowBlur   = (o.glow ? 6 : 0) + h * 10;
        ctx.fillText(node.label, tx, ty);
        ctx.shadowBlur   = 0;
      });
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

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
