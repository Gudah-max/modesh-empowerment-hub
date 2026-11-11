"""Run against tests/fixtures/cms-preview.cjs, never a public site."""
import json
from pathlib import Path
import unittest
from playwright.sync_api import expect
import test_forms as existing

OUT = Path(__file__).resolve().parents[1] / 'artifacts/phase-4a'


class UpdatesStateTests(existing.FormsTests):
    base_url = 'http://127.0.0.1:3101'
    start_server = False

    def setUp(self):
        super().setUp()
        self.context.set_extra_http_headers({'Cache-Control': 'no-cache'})
        self.page.set_default_timeout(15000)
        self.mode('populated')

    def mode(self, mode):
        (OUT / 'cms-state.json').write_text(json.dumps({'mode': mode}), encoding='utf-8')

    def open(self, path='/updates'):
        return self.page.goto(self.base_url + path, wait_until='networkidle', timeout=90000)

    def test_option_b_keeps_populated_future_views_noindex_and_out_of_sitemap(self):
        for path in ('/updates', '/updates/article', '/updates/opportunity'):
            self.open(path)
            expect(self.page.locator('meta[name="robots"]')).to_have_attribute('content', 'noindex, follow')
        response = self.context.request.get(self.base_url + '/sitemap.xml')
        self.assertEqual(response.status, 200)
        self.assertNotIn('/updates', response.text())

    def assert_no_homepage_updates(self):
        self.open('/')
        expect(self.page.get_by_role('heading', name='Latest Updates & Opportunities', exact=True)).to_have_count(0)
        expect(self.page.locator('main .update-card')).to_have_count(0)
        expect(self.page.locator('main a[href="/updates"], main a[href^="/updates/"]')).to_have_count(0)
        expect(self.page.locator('main')).not_to_contain_text('Local QA fixture:')

    def test_option_b_hides_homepage_updates_with_published_cms_content(self):
        self.open()
        expect(self.page.locator('.update-card')).to_have_count(2)
        self.assert_no_homepage_updates()

    def test_option_b_hides_homepage_updates_with_empty_cms_content(self):
        self.mode('empty')
        self.open()
        expect(self.page.get_by_role('heading', name='No published updates yet', exact=True)).to_be_visible()
        self.assert_no_homepage_updates()

    def test_populated_filters_are_keyboard_operable_and_announce_results(self):
        self.page.set_viewport_size({'width': 1440, 'height': 1000})
        self.open()
        expect(self.page.locator('.update-card')).to_have_count(2)
        text_card = self.page.locator('.update-card--text')
        expect(text_card).to_have_count(1)
        image_card = self.page.locator('.update-card').filter(has=self.page.locator('.update-card-photo'))
        text_box, image_box = text_card.bounding_box(), image_card.bounding_box()
        self.assertLess(text_box['height'], image_box['height'] - 100)
        self.assertLess(abs(text_box['y'] - image_box['y']), 1)
        summary = text_card.locator('p').bounding_box()
        action = text_card.get_by_role('link', name='Read more', exact=False).bounding_box()
        self.assertLessEqual(action['y'] - (summary['y'] + summary['height']), 24)
        photo = image_card.locator('.update-card-photo').bounding_box()
        self.assertAlmostEqual(photo['width'] / photo['height'], 4 / 3, places=2)
        events = self.page.get_by_role('button', name='Events', exact=True)
        events.focus()
        self.page.keyboard.press('Enter')
        expect(events).to_be_focused()
        expect(events).to_have_attribute('aria-pressed', 'true')
        expect(self.page.get_by_role('status')).to_have_text('1 update · Events')
        expect(self.page.locator('.update-card')).to_have_count(1)
        expect(self.page.locator('.update-card h2')).to_contain_text('opportunity detail')
        self.page.get_by_role('button', name='All Updates', exact=True).click()
        expect(self.page.locator('.update-card')).to_have_count(2)

    def test_article_metadata_body_image_and_back_navigation(self):
        self.open('/updates/article')
        expect(self.page.locator('h1')).to_have_text('Local QA fixture: article detail')
        expect(self.page.locator('.update-body h2')).to_have_text('Local QA reading section')
        expect(self.page.locator('.update-cover')).to_have_attribute('alt', 'Decorated cakes displayed on a kitchen counter')
        expect(self.page.locator('link[rel="canonical"]')).to_have_attribute('href', 'https://modeshempowermenthub.org/updates/article')
        expect(self.page.locator('meta[property="og:type"]')).to_have_attribute('content', 'article')
        expect(self.page.locator('meta[property="og:site_name"]')).to_have_attribute('content', 'Modesh Empowerment Hub')
        expect(self.page.locator('meta[property="og:image"]')).to_have_attribute('content', self.base_url + '/opengraph-image.jpeg?w=1200&h=630&fit=crop&auto=format')
        data = json.loads(self.page.locator('script[type="application/ld+json"]').inner_text())
        self.assertEqual(data['@type'], 'Article')
        self.assertNotIn('author', data)
        self.page.get_by_role('link', name='Back to all updates', exact=True).click()
        expect(self.page.locator('h1')).to_have_text('Updates & Opportunities')

    def test_opportunity_has_distinct_dates_optional_cta_and_no_inferred_event_schema(self):
        self.open('/updates/opportunity')
        expect(self.page.locator('.update-cover')).to_have_count(0)
        expect(self.page.locator('.update-meta')).to_contain_text('Posted 2 January 2026')
        expect(self.page.locator('.update-meta')).to_contain_text('Event: 3 January 2026')
        cta = self.page.get_by_role('link', name='Local QA link (opens in a new tab)', exact=True)
        expect(cta).to_have_attribute('href', 'https://example.invalid/local-qa')
        expect(cta).to_have_attribute('rel', 'noopener noreferrer')
        data = json.loads(self.page.locator('script[type="application/ld+json"]').inner_text())
        self.assertEqual(data['@type'], 'Article')
        self.assertNotIn('organizer', data)
        self.assertNotIn('eventStatus', data)
        self.assertNotIn('location', data)

    def test_empty_published_result_is_distinct_from_failure(self):
        self.mode('empty')
        self.open()
        expect(self.page.get_by_role('heading', name='No published updates yet', exact=True)).to_be_visible()
        expect(self.page.locator('.update-card')).to_have_count(0)
        expect(self.page.locator('main a[href="/programs"]')).to_be_visible()

    def test_cms_outage_and_malformed_response_do_not_become_empty_or_missing(self):
        for mode in ('error', 'malformed'):
            self.mode(mode)
            self.open()
            expect(self.page.get_by_role('heading', name='Updates are temporarily unavailable', exact=True)).to_be_visible()
            self.open('/updates/article')
            expect(self.page.get_by_role('heading', name='Updates are temporarily unavailable', exact=True)).to_be_visible()
            expect(self.page.locator('main')).not_to_contain_text('This update isn’t available')
            self.assertTrue(all('noindex' in content for content in self.page.locator('meta[name="robots"]').evaluate_all('es => es.map(e => e.content)')))

    def test_unknown_unpublished_future_expired_paths_are_unavailable_and_noindex(self):
        for slug in ('unknown', 'draft', 'future', 'expired'):
            self.open('/updates/' + slug)
            expect(self.page.get_by_role('heading', name='This update isn’t available', exact=True)).to_be_visible()
            robots = self.page.locator('meta[name="robots"]').evaluate_all('es => es.map(e => e.content)')
            self.assertTrue(robots and all('noindex' in value for value in robots))
            expect(self.page.locator('link[rel="canonical"]')).to_have_count(0)
            expect(self.page.locator('script[type="application/ld+json"]')).to_have_count(0)

    def test_cms_text_cannot_break_out_of_jsonld_script(self):
        self.open('/updates/script-test')
        self.assertIsNone(self.page.evaluate('window.fixtureInjected'))
        scripts = self.page.locator('script[type="application/ld+json"]')
        expect(scripts).to_have_count(1)
        self.assertIn('</script>', json.loads(scripts.inner_text())['headline'])
        self.assertNotIn('</script>', scripts.inner_text())


def state_suite():
    return unittest.TestSuite(UpdatesStateTests(name) for name in sorted(UpdatesStateTests.__dict__) if name.startswith('test_'))


if __name__ == '__main__':
    unittest.main(defaultTest='state_suite')
