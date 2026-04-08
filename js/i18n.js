/**
 * i18n.js — Bilingual support (English default / Spanish)
 * Exposes window.i18n.t(key) for use in other scripts.
 */
(function () {

  /* ─── TRANSLATIONS ───────────────────────── */
  const TRANSLATIONS = {
    en: {
      /* Nav */
      'nav.projects'      : 'Projects',
      'nav.stack'         : 'Stack',
      'nav.about'         : 'About',
      'nav.contact'       : 'Contact',
      'nav.toggle.open'   : 'Open menu',
      'nav.toggle.close'  : 'Close menu',

      /* Exit modal */
      'modal.close'   : 'Close',
      'modal.eyebrow' : 'Wait a moment...',
      'modal.title'   : 'Leaving already?',
      'modal.body'    : 'I have the skills to turn your idea into a real product.<br>Let\'s talk, no commitment.',
      'modal.cta'     : "Let's chat on WhatsApp",
      'modal.dismiss' : 'Maybe another time',

      /* Hero */
      'hero.status'       : 'Available for projects',
      'hero.label'        : '— Senior Full Stack Developer',
      'hero.word1'        : 'DESIGN',
      'hero.word2'        : 'BUILD',
      'hero.word3'        : 'SCALE',
      'hero.desc'         : 'I turn complex ideas into digital products people love to use.<br>Specialized in modern architectures, performance, and user experience.',
      'hero.btn.projects' : 'View projects',
      'hero.btn.contact'  : "Let's talk",

      /* Projects */
      'projects.title'            : 'Projects',
      'projects.sub'              : 'A selection of recent work',
      'projects.vamosrural.desc'  : 'Rural tourism platform in the Dominican Republic',
      'projects.mapple.desc'      : 'Online sublimation and custom merchandise store in the Dominican Republic',
      'projects.als.desc'         : 'Job platform in the Dominican Republic — connects candidates and companies',
      'projects.eoe.desc'         : 'Course platform to learn how to speak English online',
      'projects.lomasserenas.desc': 'Real estate website with affordable apartment project',
      'projects.estancia.desc'    : 'Apartment rental website built on WordPress',
      'projects.btn'              : 'View project ↗',
      'projects.toggle.more'      : 'View all projects',
      'projects.toggle.less'      : 'View less',

      /* Skills */
      'skills.title': 'Tech <em class="accent-word" style="color:#c8ff00;font-style:normal;text-shadow:0 0 18px rgba(200,255,0,0.5)">Stack</em>',
      'skills.sub'  : 'Technologies I work with daily',

      /* About */
      'about.title': 'About me',
      'about.p1'   : 'I\'m a full stack developer with over <strong>5 years building</strong> digital products from start to finish. I\'m equally comfortable on the frontend and backend, and obsessed with code quality as much as the end-user experience.',
      'about.p2'   : 'I work best in environments where autonomy matters and problems are genuinely hard. If your team values clean code, direct communication, and shipping on time, we\'re probably a great fit.',
      'about.cta'  : "Let's work together",
      'about.cv'   : 'Download CV',

      /* Pillars */
      'pillar1.title': 'Clean Code',
      'pillar1.desc' : 'The code I write today is maintained by someone tomorrow.',
      'pillar1.back' : 'Code that reads like prose, not a puzzle.',
      'pillar2.title': 'Performance',
      'pillar2.desc' : 'Every millisecond counts in the user experience.',
      'pillar2.back' : 'Metrics first, optimization after. Always measured.',
      'pillar3.title': 'Communication',
      'pillar3.desc' : 'Clear updates, without unnecessary jargon.',
      'pillar3.back' : 'The best teams speak plainly. So do I.',

      /* Contact */
      'contact.title': 'Have a project <em>in mind?</em>',
      'contact.sub'  : 'Tell me about it. <span class="contact__sub-inline">I reply in less than 24 hours.</span>',
      'contact.btn'  : 'Send a message',
      'contact.cv'   : 'Download CV',

      /* Footer */
      'footer.made': 'Made &amp; in Dominican Republic',
    },

    es: {
      /* Nav */
      'nav.projects'      : 'Proyectos',
      'nav.stack'         : 'Stack',
      'nav.about'         : 'Sobre mí',
      'nav.contact'       : 'Contacto',
      'nav.toggle.open'   : 'Abrir menú',
      'nav.toggle.close'  : 'Cerrar menú',

      /* Exit modal */
      'modal.close'   : 'Cerrar',
      'modal.eyebrow' : 'Espera un momento...',
      'modal.title'   : '¿Ya te vas?',
      'modal.body'    : 'Tengo las habilidades para convertir tu idea en un producto real.<br>Hablemos, sin compromiso.',
      'modal.cta'     : 'Hablemos por WhatsApp',
      'modal.dismiss' : 'Quizás en otro momento',

      /* Hero */
      'hero.status'       : 'Disponible para proyectos',
      'hero.label'        : '— Senior Full Stack Developer',
      'hero.word1'        : 'DISEÑO',
      'hero.word2'        : 'CONSTRUYO',
      'hero.word3'        : 'ESCALO',
      'hero.desc'         : 'Transformo ideas complejas en productos digitales que las personas disfrutan usar.<br>Especializado en arquitecturas modernas, rendimiento y experiencia de usuario.',
      'hero.btn.projects' : 'Ver proyectos',
      'hero.btn.contact'  : 'Hablemos',

      /* Projects */
      'projects.title'            : 'Proyectos',
      'projects.sub'              : 'Una selección de trabajos recientes',
      'projects.vamosrural.desc'  : 'Plataforma de turismo rural en República Dominicana',
      'projects.mapple.desc'      : 'Tienda en línea de sublimación y artículos personalizados en República Dominicana',
      'projects.als.desc'         : 'Plataforma de empleos en República Dominicana — conecta candidatos y empresas',
      'projects.eoe.desc'         : 'Plataforma de cursos para aprender a hablar inglés online',
      'projects.lomasserenas.desc': 'Sitio web de real estate con proyecto de apartamentos de bajo costo',
      'projects.estancia.desc'    : 'Sitio web de apartamentos en renta creado con WordPress',
      'projects.btn'              : 'Ver proyecto ↗',
      'projects.toggle.more'      : 'Ver todos los proyectos',
      'projects.toggle.less'      : 'Ver menos',

      /* Skills */
      'skills.title': 'Stack <em class="accent-word" style="color:#c8ff00;font-style:normal;text-shadow:0 0 18px rgba(200,255,0,0.5)">Tecnológico</em>',
      'skills.sub'  : 'Tecnologías con las que trabajo a diario',

      /* Tech globe descriptions */
      'tech.React.desc'      : 'Librería UI para construir interfaces',
      'tech.Next.js.desc'    : 'Framework React con SSR y enrutamiento',
      'tech.TypeScript.desc' : 'Superset tipado de JavaScript',
      'tech.JavaScript.desc' : 'El lenguaje de la web',
      'tech.Node.js.desc'    : 'JavaScript en el servidor',
      'tech.PHP.desc'        : 'Lenguaje de scripting del servidor',
      'tech.Python.desc'     : 'Lenguaje de alto nivel y versatilidad',
      'tech.Django.desc'     : 'Framework web Python con baterías',
      'tech.MySQL.desc'      : 'Base de datos relacional open-source',
      'tech.PostgreSQL.desc' : 'Base de datos SQL avanzada open-source',
      'tech.MongoDB.desc'    : 'Base de datos NoSQL orientada a docs',
      'tech.Docker.desc'     : 'Plataforma de contenedores para apps',
      'tech.Git.desc'        : 'Control de versiones distribuido',
      'tech.Laravel.desc'    : 'Elegante framework web en PHP',
      'tech.CSS.desc'        : 'Lenguaje de estilos para la web',
      'tech.HTML.desc'       : 'Estructura de marcado de la web',
      'tech.Figma.desc'      : 'Herramienta de diseño UI colaborativa',
      'tech.Bootstrap.desc'  : 'Framework CSS para UI responsiva',

      /* About */
      'about.title': 'Sobre mí',
      'about.p1'   : 'Soy un desarrollador full stack con más de <strong>5 años construyendo</strong> productos digitales de principio a fin. Me muevo con igual comodidad en el frontend y el backend, y me obsesiona la calidad del código tanto como la experiencia del usuario final.',
      'about.p2'   : 'Trabajo mejor en entornos donde la autonomía importa y los problemas son genuinamente difíciles. Si tu equipo valora el código limpio, la comunicación directa y entregar a tiempo, probablemente seamos una buena combinación.',
      'about.cta'  : 'Trabajemos juntos',
      'about.cv'   : 'Descargar CV',

      /* Pillars */
      'pillar1.title': 'Clean Code',
      'pillar1.desc' : 'El código que escribo hoy lo mantiene alguien mañana.',
      'pillar1.back' : 'Código que se lee como prosa, no como un acertijo.',
      'pillar2.title': 'Rendimiento',
      'pillar2.desc' : 'Cada milisegundo cuenta en la experiencia del usuario.',
      'pillar2.back' : 'Métricas primero, optimización después. Siempre medido.',
      'pillar3.title': 'Comunicación',
      'pillar3.desc' : 'Actualizaciones claras, sin tecnicismos innecesarios.',
      'pillar3.back' : 'Los mejores equipos hablan claro. Yo también.',

      /* Contact */
      'contact.title': '¿Tienes un proyecto <em>en mente?</em>',
      'contact.sub'  : 'Cuéntame sobre él. <span class="contact__sub-inline">Respondo en menos de 24 horas.</span>',
      'contact.btn'  : 'Escribir un mensaje',
      'contact.cv'   : 'Descargar CV',

      /* Footer */
      'footer.made': 'Hecho &amp; en Republica Dominicana',
    }
  };

  /* ─── STATE ──────────────────────────────── */
  let currentLang = localStorage.getItem('lang') || 'en';

  /* ─── HELPERS ────────────────────────────── */
  function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
        || (TRANSLATIONS['en'][key])
        || key;
  }

  /* ─── APPLY ──────────────────────────────── */
  function applyTranslations(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const text = t(el.dataset.i18n);
      el.innerHTML = text;

      // Keep data-text in sync (used by nav link CSS pseudo-elements)
      if (el.hasAttribute('data-text')) el.setAttribute('data-text', text);

      // Keep data-final in sync (used by hero scramble effect)
      if (el.classList.contains('hero__word')) el.dataset.final = text;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });

    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.textContent = lang === 'en' ? 'ES' : 'EN';

    localStorage.setItem('lang', lang);
  }

  /* ─── INIT ───────────────────────────────── */
  // Scripts are loaded at the end of <body>, so the DOM is already
  // fully parsed when this runs — no need for DOMContentLoaded.
  // Running synchronously ensures translations are applied BEFORE
  // animations.js splits elements like .contact__title into spans.
  applyTranslations(currentLang);

  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      applyTranslations(currentLang === 'en' ? 'es' : 'en');
    });
  }

  /* ─── PUBLIC API ─────────────────────────── */
  window.i18n = {
    t,
    setLang: applyTranslations,
    get currentLang() { return currentLang; }
  };

})();
