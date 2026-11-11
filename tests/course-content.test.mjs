import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import { courses, getCourseOptions } from '../lib/content/courses.ts';

const baseline = JSON.parse(readFileSync(new URL('./fixtures/phase3b-courses.json', import.meta.url), 'utf8'));

test('enrollment projection preserves the five frozen query slugs and POST values', () => {
  assert.deepEqual(getCourseOptions(), [
    { slug: 'professional-baking', label: 'Professional Baking' },
    { slug: 'pastry-arts', label: 'Pastry Arts' },
    { slug: 'artisan-bread-making', label: 'Artisan Bread Making' },
    { slug: 'bakery-entrepreneurship', label: 'Bakery Entrepreneurship' },
    { slug: 'wedding-master-class', label: 'Wedding Master Class' },
  ]);
});

test('catalogue migration preserves every original public course value', () => {
  assert.deepEqual(courses.map(course => ({
    id: course.id, title: course.title, tag: course.level, duration: course.duration,
    desc: course.description, list: [...course.learningTopics], img: course.image.src,
  })), baseline);
  for (const course of courses) {
    assert.ok(existsSync(new URL(`../public${course.image.src}`, import.meta.url)), course.image.src);
  }
});

test('client options exclude editorial verification notes and unavailable commercial facts', () => {
  for (const option of getCourseOptions()) assert.deepEqual(Object.keys(option).sort(), ['label', 'slug']);
  for (const course of courses) {
    assert.equal(course.verification.status, 'repository-only');
    assert.equal(course.fees, null);
    assert.equal(course.credential, null);
    assert.equal(course.intake, null);
  }
});
