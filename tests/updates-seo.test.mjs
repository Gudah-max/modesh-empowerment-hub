import assert from 'node:assert/strict';
import { test } from 'node:test';

const originalFetch = globalThis.fetch;
const originalProject = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
let importId = 0;
async function cms(configured = true) {
  if (configured) process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'local-test-only';
  else delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  return import(`../lib/sanity.ts?test=${++importId}`);
}
const item = {
  _id: 'local-fixture', title: 'Local QA fixture', slug: 'local-qa-fixture',
  category: 'Training', excerpt: 'Local test data; never published.',
  publishedAt: '2026-01-01T08:00:00Z', coverImage: null,
};

test('unconfigured CMS has its own state without making a request', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('must not fetch'); };
  const api = await cms(false);
  const result = await api.getUpdates();
  assert.equal(result.status, 'unconfigured');
  assert.deepEqual(result.data, []);
  assert.equal(calls, 0);
});

test('successful empty results are distinct from unconfigured and failed reads', async () => {
  globalThis.fetch = async () => Response.json({ result: [] });
  const result = await (await cms()).getUpdates();
  assert.equal(result.status, 'ready');
  assert.equal(result.ok, true);
  assert.deepEqual(result.data, []);
});

test('network and HTTP failures return a recoverable error state', async () => {
  const api = await cms();
  for (const fetch of [async () => { throw new Error('local network test'); }, async () => new Response('', { status: 503 })]) {
    globalThis.fetch = fetch;
    const result = await api.getUpdates();
    assert.equal(result.status, 'error');
    assert.equal(result.ok, false);
    assert.deepEqual(result.data, []);
    assert.equal((await api.getUpdateBySlug('unknown')).status, 'error');
  }
});

test('malformed or missing CMS results do not masquerade as published emptiness', async () => {
  const api = await cms();
  for (const response of [{}, { result: {} }, { result: [null] }, { result: [{ title: null }] }]) {
    globalThis.fetch = async () => Response.json(response);
    const result = await api.getUpdates();
    assert.equal(result.status, 'error');
    assert.deepEqual(result.data, []);
  }
  globalThis.fetch = async () => Response.json({ result: [] });
  assert.equal((await api.getUpdateBySlug('unknown')).status, 'error');
});

test('successful null detail means unknown, unpublished or expired content', async () => {
  globalThis.fetch = async () => Response.json({ result: null });
  const result = await (await cms()).getUpdateBySlug('unknown');
  assert.equal(result.status, 'ready');
  assert.equal(result.data, null);
});

test('invalid optional display fields become a CMS error before rendering', async () => {
  const api = await cms();
  for (const invalid of [
    { ...item, location: {} },
    { ...item, eventDate: 123 },
    { ...item, coverImage: { url: 'https://example.invalid/image.jpg', ref: null, alt: 42, width: 800, height: 600 } },
  ]) {
    globalThis.fetch = async () => Response.json({ result: [invalid] });
    assert.equal((await api.getUpdates()).status, 'error');
  }
});

test('all CMS reads explicitly exclude drafts, future and expired records and retain ISR', async () => {
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ query: new URL(url).searchParams.get('query'), options });
    return Response.json({ result: url.includes('%5B0%5D') ? item : [] });
  };
  const api = await cms();
  await api.getUpdates();
  await api.getLatestUpdates();
  await api.getUpdateBySlug('local-qa-fixture');
  await api.getUpdateSlugs();
  assert.equal(requests.length, 4);
  for (const { query, options } of requests) {
    assert.match(query, /!\(_id in path\("drafts\.\*\*"\)\)/);
    assert.match(query, /publishedAt <= now\(\)/);
    assert.match(query, /expiresAt > now\(\)/);
    assert.equal(options.next.revalidate, 600);
  }
});

test('published records retain values while an absent cover image normalises to null', async () => {
  globalThis.fetch = async () => Response.json({ result: [{ ...item, coverImage: { url: null, ref: null } }] });
  const result = await (await cms()).getUpdates();
  assert.equal(result.status, 'ready');
  assert.deepEqual(result.data, [item]);
});

test('slug interpolation treats arbitrary text as data in the GROQ query', async () => {
  const slug = 'test" || true || "<script>';
  let query;
  globalThis.fetch = async url => { query = new URL(url).searchParams.get('query'); return Response.json({ result: null }); };
  await (await cms()).getUpdateBySlug(slug);
  assert.ok(query.includes(`slug.current == ${JSON.stringify(slug)}`));
});

test('page metadata keeps route-specific canonical, sharing and site identity', async () => {
  const { pageMetadata, SITE_NAME, SITE_URL } = await import('../lib/metadata.ts');
  const metadata = pageMetadata('/faq', 'FAQ', 'Answers about training and applying.');
  assert.equal(SITE_NAME, 'Modesh Empowerment Hub');
  assert.equal(SITE_URL, 'https://modeshempowermenthub.org');
  assert.equal(metadata.alternates.canonical, '/faq');
  assert.equal(metadata.openGraph.url, '/faq');
  assert.equal(metadata.openGraph.title, 'FAQ | Modesh Empowerment Hub');
  assert.equal(metadata.openGraph.siteName, SITE_NAME);
  assert.equal(metadata.twitter.description, metadata.description);
  assert.equal(metadata.openGraph.images[0].alt, 'Decorated cakes displayed on a kitchen counter');
});

test.after(() => {
  globalThis.fetch = originalFetch;
  if (originalProject === undefined) delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  else process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = originalProject;
});
