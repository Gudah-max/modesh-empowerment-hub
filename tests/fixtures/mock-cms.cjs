/* Local-only Next preview with mocked server-side CMS reads. Never imported by
 * application code. No credentials or production settings are used or changed. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'artifacts/phase-4a');
fs.mkdirSync(out, { recursive: true });
const statePath = path.join(out, 'cms-state.json');
if (!fs.existsSync(statePath)) fs.writeFileSync(statePath, JSON.stringify({ mode: 'populated' }));
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'local-test-only';
process.env.NEXT_TELEMETRY_DISABLED = '1';

const item = (slug, category = 'Training') => ({
  _id: `local-${slug}`, slug, category,
  title: `Local QA fixture: ${slug === 'opportunity' ? 'opportunity detail' : 'article detail'}`,
  excerpt: 'Local QA fixture only. This is test data for the Updates layout and is never published.',
  publishedAt: '2026-01-02T09:00:00Z',
  eventDate: slug === 'opportunity' ? '2026-01-03T09:00:00Z' : null,
  location: slug === 'opportunity' ? 'Local QA location only' : null,
  ctaLabel: slug === 'opportunity' ? 'Local QA link' : null,
  ctaUrl: slug === 'opportunity' ? 'https://example.invalid/local-qa' : null,
  coverImage: slug === 'article' ? {
    url: 'http://127.0.0.1:3101/opengraph-image.jpeg', ref: null,
    alt: 'Decorated cakes displayed on a kitchen counter', width: 1600, height: 1067,
  } : null,
  featured: false,
  body: [
    { _type: 'block', _key: 'h', style: 'h2', markDefs: [], children: [{ _type: 'span', _key: 'hs', text: 'Local QA reading section', marks: [] }] },
    { _type: 'block', _key: 'p', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 'ps', text: 'This local fixture checks readable article text, heading hierarchy, image descriptions and navigation. No actual training date, event or opportunity is announced by this fixture.', marks: [] }] },
  ],
});

globalThis.fetch = async (input) => {
  const url = new URL(typeof input === 'string' ? input : input.url ?? input.toString());
  if (url.hostname !== 'local-test-only.apicdn.sanity.io') throw new Error('External fetch blocked by local CMS fixture preview');
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  if (state.mode === 'error') return new Response('', { status: 503 });
  if (state.mode === 'malformed') return Response.json({ result: {} });
  if (state.mode === 'slow') await new Promise(resolve => setTimeout(resolve, 1200));
  const query = url.searchParams.get('query') ?? '';
  // Assert every public read contains the real publication guards.
  if (!query.includes('!(_id in path("drafts.**"))') || !query.includes('publishedAt <= now()') || !query.includes('expiresAt > now()')) throw new Error('Public query is missing a publication guard');
  const match = query.match(/slug\.current == ("(?:\\.|[^"\\])*")/);
  let result;
  if (match) {
    const slug = JSON.parse(match[1]);
    result = state.mode === 'empty' || !['article', 'opportunity', 'script-test'].includes(slug) ? null : item(slug, slug === 'opportunity' ? 'Events' : 'Training');
    if (slug === 'script-test' && result) result.title = 'Local QA </script><script>window.fixtureInjected=true</script>';
  } else if (query.includes('"slug": slug.current, publishedAt') && !query.includes('_id,')) {
    result = state.mode === 'empty' ? [] : ['article', 'opportunity'].map(slug => ({ slug, publishedAt: '2026-01-02T09:00:00Z' }));
  } else {
    result = state.mode === 'empty' ? [] : [item('article'), item('opportunity', 'Events')];
  }
  return Response.json({ result });
};

// A private build directory and tsconfig keep the real production build/config
// untouched. The installed Next runtime supplies the actual application views.
const tsconfig = JSON.parse(fs.readFileSync(path.join(root, 'tsconfig.json'), 'utf8'));
tsconfig.compilerOptions.baseUrl = root;
tsconfig.include = [path.join(root, 'next-env.d.ts'), path.join(root, 'app/**/*.ts'), path.join(root, 'app/**/*.tsx'), path.join(root, 'components/**/*.tsx'), path.join(root, 'lib/**/*.ts')];
const tsconfigPath = path.join(out, 'fixture-tsconfig.json');
const tsconfigText = JSON.stringify(tsconfig, null, 2);
if (!fs.existsSync(tsconfigPath)) fs.writeFileSync(tsconfigPath, tsconfigText);

// Next 15's custom dev router loads config independently of the factory's conf
// option. Override only the in-process config result, including render workers.
const configModule = require('next/dist/server/config');
const loadConfig = configModule.default;
const fixtureConfig = async (...args) => {
  const config = await loadConfig(...args);
  return { ...config, distDir: 'artifacts/phase-4a/fixture-next', devIndicators: false,
    typescript: { ...config.typescript, tsconfigPath: 'artifacts/phase-4a/fixture-tsconfig.json' },
    webpack(webpackConfig) {
      webpackConfig.watchOptions = { ...webpackConfig.watchOptions,
        ignored: ['**/node_modules/**', '**/.git/**', '**/artifacts/**', '**/.next/**'] };
      return webpackConfig;
    } };
};
require.cache[require.resolve('next/dist/server/config')].exports = { ...configModule, __esModule: true, default: fixtureConfig };
