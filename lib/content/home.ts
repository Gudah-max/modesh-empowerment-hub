import type { LegacyHomeFeature } from './course-types';

// Existing homepage records retained verbatim; course reconciliation awaits client approval.
export const partners = [
  { name: 'GIZ', src: '/images/giz_logo.png' },
  { name: 'FAO', src: '/images/fao_logo.png' },
  { name: 'SHOFCO', src: '/images/shofco_logo.png' },
  { name: 'NITA', src: '/images/nita_logo.png' },
  { name: 'SOMO', src: '/images/somo_logo.png' },
  { name: 'KIDI', src: '/images/kenya_industrial_development_institute_logo.png' },
  { name: 'World Travel', src: '/images/world_travel_logo.png' },
  { name: 'Cloud Solution', src: '/images/cloud_solution_logo.png' },
];

export const homeFeatures = [
{
                   title: 'Bread Making',
                   desc: 'Master the art of artisanal breads, from sourdough starters to classic baguettes in a supportive environment.',
                   img: '/images/bread_making.jpeg',
                   tag: 'Beginner'
                 },
                 {
                   title: 'Pastry Arts',
                   desc: 'Learn delicate techniques for creating exquisite tarts, eclairs, and complex layered desserts.',
                   img: '/images/pastry_arts.jpeg',
                   tag: 'Intermediate'
                 },
                 {
                   title: 'Cake Decoration',
                   desc: 'Advanced finishing techniques, fondant work, and structural cake design for special events.',
                   img: '/images/cake_decoration.jpeg',
                   tag: 'Advanced'
                 }
] as const satisfies readonly LegacyHomeFeature[];
