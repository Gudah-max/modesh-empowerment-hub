import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';
import { test } from 'node:test';
import ts from 'typescript';
import { renderToStaticMarkup } from 'react-dom/server';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const item = {
  _id: 'local-article', slug: 'article', category: 'Training',
  title: 'Local QA fixture: article detail',
  excerpt: 'Local QA fixture only; never published.',
  publishedAt: '2026-01-02T09:00:00Z', coverImage: null,
  eventDate: null, location: null, ctaLabel: null, ctaUrl: null, featured: false,
};

// Run the real TSX component and CMS reader. Only the external fetch and the
// future release setting are isolated; no source file or real CMS is changed.
async function homepage({ configured, records, enabled }) {
  const requests = [];
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const loadedModule = { exports: {} };
    cache.set(filename, loadedModule);
    const source = readFileSync(filename, 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022, esModuleInterop: true,
    } }).outputText;
    const localRequire = specifier => {
      if (specifier.endsWith('.css')) return {};
      if (specifier === '@/lib/content/release' && enabled !== undefined) {
        return { updatesPublicReleaseEnabled: enabled };
      }
      if (specifier.startsWith('@/') || specifier.startsWith('.')) {
        const base = specifier.startsWith('@/') ? path.join(root, specifier.slice(2)) : path.resolve(path.dirname(filename), specifier);
        const target = ['.ts', '.tsx'].map(ext => base + ext).find(existsSync);
        assert.ok(target, `Unknown local module: ${specifier}`);
        return load(target);
      }
      return require(specifier);
    };
    vm.runInNewContext(compiled, {
      module: loadedModule, exports: loadedModule.exports, require: localRequire,
      process: { env: configured ? { NEXT_PUBLIC_SANITY_PROJECT_ID: 'local-test-only' } : {} },
      console, URL,
      fetch: async (url, options) => {
        assert.equal(new URL(url).hostname, 'local-test-only.apicdn.sanity.io');
        requests.push({ url, options });
        return Response.json({ result: records });
      },
    }, { filename });
    return loadedModule.exports;
  }
  const { LatestUpdates } = load(path.join(root, 'components/LatestUpdates.tsx'));
  const element = await LatestUpdates();
  return { html: element === null ? '' : renderToStaticMarkup(element), requests };
}

for (const [name, configured, records] of [
  ['unconfigured CMS', false, []],
  ['configured published CMS', true, [item]],
  ['configured empty CMS', true, []],
]) {
  test(`Option B hides homepage Updates and skips reads with ${name}`, async () => {
    const result = await homepage({ configured, records });
    assert.equal(result.html, '', 'Disabled Updates must render no homepage content');
    assert.equal(result.requests.length, 0, 'Disabled Updates must not query the CMS');
  });
}

test('future enabled teaser renders published content using the real CMS reader', async () => {
  const result = await homepage({ configured: true, records: [item], enabled: true });
  assert.match(result.html, /Latest Updates &amp; Opportunities/);
  assert.match(result.html, /Local QA fixture: article detail/);
  assert.match(result.html, /href="\/updates\/article"/);
  assert.match(result.html, /View All Updates/);
  assert.equal(result.requests.length, 1);
  assert.match(new URL(result.requests[0].url).searchParams.get('query'), /\[0\.\.\.3\]/);
});

test('future enabled teaser stays absent for an empty CMS', async () => {
  const result = await homepage({ configured: true, records: [], enabled: true });
  assert.equal(result.html, '');
  assert.equal(result.requests.length, 1);
});
