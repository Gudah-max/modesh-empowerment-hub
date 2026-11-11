# Modesh Empowerment Hub

Next.js 15 and React 19 website for baking and entrepreneurship training in Kisumu, Kenya.

## Development and production

Run `npm ci`, then `npm run dev` for development. Run `npm run lint`,
`npm run typecheck`, and `npm run build` before serving with `npm start`.
Netlify runs `npm run build`, publishes `.next`, and uses `@netlify/plugin-nextjs`.

## Forms and safe tests

Contact and Enrollment use Netlify Forms. Keep `public/__forms.html` field names
in sync with the React forms. Registration is separate from storage and notification delivery.
Do not submit forms during ordinary QA. Browser suites intercept writes and reject public targets.

Python requirements are in `tests/requirements.txt`; install Playwright Chromium separately.
After building, `npm test` runs the intercepted local forms suite. Other browser suites
accept `--base-url http://127.0.0.1:3100`. The test runner
`python -B tests/run_phase4a_checks.py` accepts `build`, `unit`, `browser`, `states`,
and `inspect`. Browser checks require a loopback production server on port 3100.
States and inspection also require `node tests/fixtures/cms-preview.cjs` on port 3101.
Generated evidence belongs only in ignored `artifacts/phase-4a/`; never publish it.
The fixture launcher and tests are local tools and must never be deployed as a server.

## Deferred Updates (Option B)

Updates remains deferred: `updatesPublicReleaseEnabled` is false. Navigation and
sitemap exclude Updates; retained routes use noindex. CMS source and synthetic
fixtures remain available for future separately authorized development.
No CMS setup or publishing is part of this release.

Optional website environment variables are `NEXT_PUBLIC_GA_ID`,
`NEXT_PUBLIC_SANITY_PROJECT_ID`, and `NEXT_PUBLIC_SANITY_DATASET`.
Keep credentials and environment files out of Git. Public-prefixed values are browser-visible.
