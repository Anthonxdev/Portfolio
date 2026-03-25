/**
 * skills.js — Fuente única de verdad para tu stack tecnológico.
 *
 * Edita este archivo para mantener consistencia en tu portfolio.
 * Las skills se renderizan automáticamente en la sección #skills.
 *
 * Estructura:
 *   key:   identificador interno (no se muestra)
 *   label: nombre de la categoría que aparece en pantalla
 *   items: array de tecnologías (en el orden que prefieras)
 */

const SKILLS = [
  {
    key:   'frontend',
    label: 'Frontend',
    items: [
      'HTML5', 'CSS3', 'JavaScript (ES2024)', 'TypeScript',
      'React', 'Next.js', 'Vue.js', 'Astro',
      'Tailwind CSS', 'GSAP', 'Figma',
    ],
  },
  {
    key:   'backend',
    label: 'Backend',
    items: [
      'Node.js', 'Express', 'NestJS',
      'Python', 'Django', 'FastAPI',
      'REST APIs', 'GraphQL', 'WebSockets',
    ],
  },
  {
    key:   'databases',
    label: 'Bases de datos',
    items: [
      'PostgreSQL', 'MySQL', 'MongoDB',
      'Redis', 'Prisma', 'Sequelize',
    ],
  },
  {
    key:   'devops',
    label: 'DevOps & Cloud',
    items: [
      'Docker', 'Git / GitHub', 'CI/CD',
      'AWS', 'Vercel', 'Nginx', 'Linux',
    ],
  },
  {
    key:   'testing',
    label: 'Testing',
    items: [
      'Jest', 'Vitest', 'Cypress',
      'Testing Library', 'Postman',
    ],
  },
];
