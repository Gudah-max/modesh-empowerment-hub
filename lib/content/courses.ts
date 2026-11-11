import type { Course, CourseOption } from './course-types';

// Server consumers render these preserved source records. Client views receive
// only the explicit public projections below, never editorial verification notes.
export const courses = [
  {
    "id": "professional-baking",
    "title": "Professional Baking",
    "enrollmentValue": "Professional Baking",
    "description": "Master the fundamentals of baking cakes, cookies, and patisserie. From understanding basic ingredients to executing advanced presentation techniques.",
    "level": "Beginner to Advanced",
    "duration": "12 Weeks",
    "learningTopics": [
      "Ingredient Science & Measurement",
      "Classic Cake Formulation",
      "Commercial Baking Standards"
    ],
    "image": {
      "src": "/images/proffesional_baking.jpeg",
      "alt": "Professional Baking"
    },
    "verification": {
      "status": "repository-only",
      "sourceFile": "components/ProgramsView.tsx",
      "sourceRevision": "618f99806176cbd5a49b0d3dbde2abe47ca20025",
      "awaitingClient": [
        "name and availability",
        "level and prerequisites",
        "duration",
        "description and learning topics"
      ]
    },
    "fees": null,
    "credential": null,
    "intake": null
  },
  {
    "id": "pastry-arts",
    "title": "Pastry Arts",
    "enrollmentValue": "Pastry Arts",
    "description": "Dive deep into the world of delicate desserts. Master chocolate work, sugarcraft, and high-end dessert presentation suitable for fine dining.",
    "level": "Intermediate",
    "duration": "8 Weeks",
    "learningTopics": [
      "Chocolate Tempering & Sculpting",
      "Advanced Sugarcraft",
      "Plated Dessert Design"
    ],
    "image": {
      "src": "/images/pastry_art.jpeg",
      "alt": "Pastry Arts"
    },
    "verification": {
      "status": "repository-only",
      "sourceFile": "components/ProgramsView.tsx",
      "sourceRevision": "618f99806176cbd5a49b0d3dbde2abe47ca20025",
      "awaitingClient": [
        "name and availability",
        "level and prerequisites",
        "duration",
        "description and learning topics"
      ]
    },
    "fees": null,
    "credential": null,
    "intake": null
  },
  {
    "id": "artisan-bread-making",
    "title": "Artisan Bread Making",
    "enrollmentValue": "Artisan Bread Making",
    "description": "Explore traditional and modern bread techniques. Learn the secrets of sourdough, laminated doughs, and commercial yeast breads.",
    "level": "All Levels",
    "duration": "6 Weeks",
    "learningTopics": [
      "Sourdough Starter Cultivation",
      "Viennoiserie & Lamination",
      "Baking Chemistry"
    ],
    "image": {
      "src": "/images/artisan_bread_making.jpeg",
      "alt": "Artisan Bread Making"
    },
    "verification": {
      "status": "repository-only",
      "sourceFile": "components/ProgramsView.tsx",
      "sourceRevision": "618f99806176cbd5a49b0d3dbde2abe47ca20025",
      "awaitingClient": [
        "name and availability",
        "level and prerequisites",
        "duration",
        "description and learning topics"
      ]
    },
    "fees": null,
    "credential": null,
    "intake": null
  },
  {
    "id": "bakery-entrepreneurship",
    "title": "Bakery Entrepreneurship",
    "enrollmentValue": "Bakery Entrepreneurship",
    "description": "Turn your passion into a business. This course covers business planning, costing, marketing, and the operational logistics of running a bakery.",
    "level": "Business Focus",
    "duration": "4 Weeks",
    "learningTopics": [
      "Business Plan Development",
      "Costing & Pricing Strategy",
      "Brand & Marketing"
    ],
    "image": {
      "src": "/images/bakery_enterprenuership.jpeg",
      "alt": "Bakery Entrepreneurship"
    },
    "verification": {
      "status": "repository-only",
      "sourceFile": "components/ProgramsView.tsx",
      "sourceRevision": "618f99806176cbd5a49b0d3dbde2abe47ca20025",
      "awaitingClient": [
        "name and availability",
        "level and prerequisites",
        "duration",
        "description and learning topics"
      ]
    },
    "fees": null,
    "credential": null,
    "intake": null
  },
  {
    "id": "wedding-master-class",
    "title": "Wedding Master Class",
    "enrollmentValue": "Wedding Master Class",
    "description": "Master the art of wedding cake creation — from structural baking to elegant fondant finishing — and learn to design showstopping tiered cakes for a client's biggest day.",
    "level": "Advanced",
    "duration": "4 Weeks",
    "learningTopics": [
      "Baking and Decoration",
      "Trimming and Crumb Coating",
      "Fondanting and Stenciling",
      "Tiering and Dowelling",
      "Edible Flowers and Presentation"
    ],
    "image": {
      "src": "/images/hero-3.jpeg",
      "alt": "Wedding Master Class"
    },
    "verification": {
      "status": "repository-only",
      "sourceFile": "components/ProgramsView.tsx",
      "sourceRevision": "618f99806176cbd5a49b0d3dbde2abe47ca20025",
      "awaitingClient": [
        "name and availability",
        "level and prerequisites",
        "duration",
        "description and learning topics"
      ]
    },
    "fees": null,
    "credential": null,
    "intake": null
  }
] as const satisfies readonly Course[];

export function getCourseOptions(): CourseOption[] {
  return courses.map(course => ({ slug: course.id, label: course.enrollmentValue }));
}
