import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import { galleryItems } from '../lib/content/gallery.ts';

const baseline = JSON.parse(readFileSync(new URL('./fixtures/phase3c-institutional.json', import.meta.url), 'utf8'));
const source = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('all original gallery sources, thumbnails, provisional categories and ordering survive', () => {
  assert.equal(galleryItems.length, 33);
  assert.deepEqual(galleryItems.map(({ src, thumb, category }) => ({ src, ...(thumb ? { thumb } : {}), category })), baseline.gallery);
  for (const item of galleryItems) {
    for (const file of [item.src, ...(item.thumb ? [item.thumb] : [])]) assert.ok(existsSync(new URL('../public' + file, import.meta.url)), file);
    assert.ok(item.width > 0 && item.height > 0 && item.alt.length > 15);
    assert.doesNotMatch(item.alt, /graduate|graduation|founder|master class|made by Modesh students/i);
  }
});

test('founder account, attribution, mission, vision and supporting introduction stay verbatim', () => {
  const text = source('components/AboutView.tsx').replace(/\s+/g, ' ');
  for (const paragraph of baseline.aboutParagraphs) assert.ok(text.includes(paragraph), paragraph);
  for (const topic of ['Practical, hands-on culinary training.', 'Business management and financial literacy.', 'Mentorship and personal development counseling.']) assert.ok(text.includes(topic));
  assert.ok(text.includes('alt="A person standing behind decorated cakes"'));
});

test('leadership biographies and all eight partner records keep their source values and order', () => {
  const text = source('components/TeamView.tsx');
  for (const record of [...baseline.team, ...baseline.partners]) {
    for (const [key, value] of Object.entries(record)) assert.ok(text.includes(key + ": '" + value + "'"), value);
  }
  assert.equal(baseline.team.length, 2);
  assert.equal(baseline.partners.length, 8);
  for (const records of [baseline.team, baseline.partners]) {
    const positions = records.map(record => text.indexOf("name: '" + record.name + "'"));
    assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  }
});
