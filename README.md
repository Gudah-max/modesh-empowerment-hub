# Modesh Empowerment Hub

Marketing website for **Modesh Empowerment Hub** — a baking and entrepreneurship training organization in Kisumu, Kenya, empowering marginalized individuals to build sustainable livelihoods.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router) + React 19
- TypeScript
- Tailwind CSS v4 (CSS-first `@theme` config in `app/globals.css`)
- [lucide-react](https://lucide.dev/) icons
- Deployed on [Netlify](https://www.netlify.com/) via `@netlify/plugin-nextjs`

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

## Project structure

- `app/` — routes (App Router). Each `page.tsx` sets metadata and renders a view component.
- `components/` — view components (`HomeView`, `AboutView`, `ProgramsView`, `TeamView`, `GalleryView`, `ContactView`, `EnrollView`) plus `Header`, `Footer`, and shared pieces.
- `public/images/` — image assets.
- `app/globals.css` — design tokens and base styles.

## Forms

The **Contact** and **Enroll** forms submit through [Netlify Forms](https://docs.netlify.com/forms/setup/). Form definitions are mirrored in `public/__forms.html` so Netlify's build-time detection registers them; the live React forms post to `/` via `fetch`. Configure email notifications for new submissions in the Netlify dashboard (Forms → Settings & notifications).

## Environment variables

- `NEXT_PUBLIC_GA_ID` (optional) — a Google Analytics 4 measurement ID (`G-XXXXXXXXXX`). When set, analytics is loaded automatically; when unset, no analytics is loaded.
