"""Local FAQ/SEO checks; populated CMS states are in test_updates_states.py."""
import argparse
import sys
import unittest
import xml.etree.ElementTree as ET
from playwright.sync_api import expect
import test_forms as existing


class FaqUpdatesTests(existing.FormsTests):
    def test_faq_answers_are_visible_with_group_and_practical_links(self):
        self.page.goto(self.base_url + '/faq', wait_until='networkidle')
        expect(self.page.get_by_role('heading', level=1)).to_have_text('Frequently Asked Questions')
        expect(self.page.get_by_role('navigation', name='FAQ topics')).to_be_visible()
        expect(self.page.locator('details')).to_have_count(0)
        for question in ('Who can enroll at Modesh Empowerment Hub?', 'What programs do you offer?', 'How do I enroll?', 'Where are you located?', 'What are your operating hours?', 'Do you offer support beyond training?'):
            expect(self.page.get_by_role('heading', name=question, exact=True)).to_be_visible()
        main = self.page.locator('main')
        expect(main).to_contain_text('Professional Baking, Pastry Arts, Artisan Bread Making, and Bakery Entrepreneurship.')
        expect(main).to_contain_text('Each program ranges from 4 to 12 weeks.')
        for path in ('/programs', '/enroll', '/contact', '/privacy', '/terms'):
            self.assertGreater(main.locator(f'a[href="{path}"]').count(), 0)
        topic = self.page.get_by_role('link', name='Visiting the Hub', exact=True)
        topic.focus()
        self.page.keyboard.press('Enter')
        self.assertTrue(self.page.url.endswith('#visiting'))

    def test_unconfigured_listing_is_truthful_and_offers_recovery(self):
        self.page.goto(self.base_url + '/updates', wait_until='networkidle')
        expect(self.page.get_by_role('heading', name='Online updates are not connected yet', exact=True)).to_be_visible()
        expect(self.page.locator('main')).not_to_contain_text('Nothing here just yet')
        expect(self.page.locator('main a[href="/contact"]')).to_be_visible()
        expect(self.page.locator('meta[name="robots"]')).to_have_attribute('content', 'noindex, follow')

    def test_option_b_navigation_omits_updates_and_preserves_keyboard_menu(self):
        for width in (320, 390, 768, 1024, 1440):
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': 900})
                self.page.goto(self.base_url, wait_until='networkidle')
                expect(self.page.locator('header a[href="/updates"], footer a[href="/updates"]')).to_have_count(0)
                expect(self.page.get_by_role('heading', name='Latest Updates & Opportunities', exact=True)).to_have_count(0)
                if width < 1280:
                    toggle = self.page.locator('button[aria-controls="mobile-menu"]')
                    toggle.focus()
                    self.page.keyboard.press('Enter')
                    expect(toggle).to_have_attribute('aria-expanded', 'true')
                    nav = self.page.get_by_role('navigation', name='Mobile Navigation', exact=True)
                else:
                    nav = self.page.get_by_role('navigation', name='Main Navigation', exact=True)
                for name, href in (('Programs', '/programs'), ('Our Story', '/about'), ('Student Life', '/gallery'), ('Contact', '/contact')):
                    expect(nav.get_by_role('link', name=name, exact=True)).to_have_attribute('href', href)
                expect(nav).to_be_visible()
                self.assertEqual(self.page.evaluate('document.documentElement.scrollWidth'), width)
                if width < 1280:
                    self.page.keyboard.press('Escape')
                    expect(toggle).to_be_focused()
                    expect(toggle).to_have_attribute('aria-expanded', 'false')
                expect(self.page.locator('meta[name="robots"]')).to_have_count(0)

    def test_option_b_sitemap_keeps_ten_active_pages_without_updates(self):
        response = self.context.request.get(self.base_url + '/sitemap.xml')
        self.assertEqual(response.status, 200)
        tree = ET.fromstring(response.text())
        ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        locations = {e.text.rstrip('/') for e in tree.findall('s:url/s:loc', ns)}
        expected = {'https://modeshempowermenthub.org' + path for path in
                    ('', '/about', '/programs', '/gallery', '/team', '/contact', '/enroll', '/faq', '/privacy', '/terms')}
        self.assertEqual(locations, expected)
        self.assertFalse(tree.findall('s:url/s:lastmod', ns))

    def test_unknown_article_is_noindex_without_homepage_canonical(self):
        self.page.goto(self.base_url + '/updates/phase4a-unknown', wait_until='networkidle')
        expect(self.page.locator('meta[name="robots"]')).to_have_attribute('content', 'noindex, follow')
        expect(self.page.locator('link[rel="canonical"]')).to_have_count(0)
        expect(self.page.locator('main a[href="/updates"]')).to_be_visible()
        expect(self.page.locator('script[type="application/ld+json"]')).to_have_count(0)
        recovery = self.page.locator('main a[href="/contact"]')
        recovery.focus()
        expect(recovery).to_be_focused()
        self.page.keyboard.press('Enter')
        expect(self.page).to_have_url(self.base_url + '/contact')
        expect(self.page.get_by_role('heading', level=1)).to_have_text('Contact & Connect')


def focused_suite():
    return unittest.TestSuite(FaqUpdatesTests(name) for name in sorted(FaqUpdatesTests.__dict__) if name.startswith('test_'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('--base-url', type=existing.local_origin)
    options, remaining = parser.parse_known_args()
    FaqUpdatesTests.base_url = options.base_url
    FaqUpdatesTests.start_server = options.base_url is None
    unittest.main(argv=[sys.argv[0], *remaining], defaultTest='focused_suite')
