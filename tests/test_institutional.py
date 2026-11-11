"""Phase 3C local-only Gallery and Contact behavior checks."""
import argparse
import sys
import unittest
from playwright.sync_api import expect
import test_forms as existing

class InstitutionalTests(existing.FormsTests):
    def test_about_image_has_no_founder_identification_and_map_fallback_is_available(self):
        self.page.goto(self.base_url + '/about', wait_until='networkidle')
        image = self.page.locator('.about-story-photo')
        expect(image).to_have_attribute('alt', 'A person standing behind decorated cakes')
        for attribute in ('aria-label', 'aria-labelledby', 'title'):
            self.assertIsNone(image.get_attribute(attribute))
        expect(self.page.get_by_role('region', name='The Story', exact=True)).to_be_visible()
        expect(self.page.locator('.about-story-layout figcaption')).to_have_count(0)
        self.page.goto(self.base_url + '/contact', wait_until='networkidle')
        expect(self.page.locator('iframe')).to_have_attribute('src', 'https://maps.google.com/maps?q=Manyatta,+Kisumu,+Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed')
        fallback = self.page.get_by_role('link', name='Open Manyatta in Google Maps', exact=True)
        expect(fallback).to_be_visible()
        expect(fallback).to_have_attribute('href', 'https://maps.google.com/maps?q=Manyatta,+Kisumu,+Kenya')
        expect(fallback).to_have_attribute('target', '_blank')
        self.assertIn('noopener', fallback.get_attribute('rel').split())
        fallback.focus()
        expect(fallback).to_be_focused()
        self.assertEqual(fallback.evaluate('e => e.tagName'), 'A')

    def test_gallery_filters_expose_selection_and_announce_count(self):
        self.page.goto(self.base_url + '/gallery', wait_until='networkidle')
        all_filter = self.page.get_by_role('button', name='All Moments', exact=True)
        expect(all_filter).to_have_attribute('aria-pressed', 'true')
        expect(self.page.locator('.gallery-grid button')).to_have_count(33)
        kitchen = self.page.get_by_role('button', name='In the Kitchen', exact=True)
        kitchen.focus()
        self.page.keyboard.press('Enter')
        expect(kitchen).to_have_attribute('aria-pressed', 'true')
        expect(all_filter).to_have_attribute('aria-pressed', 'false')
        count = self.page.locator('.gallery-grid button').count()
        expect(self.page.get_by_role('status')).to_have_text(f'{count} photographs · In the Kitchen')
        expect(kitchen).to_be_focused()
        all_filter.click()
        expect(self.page.locator('.gallery-grid button')).to_have_count(33)

    def test_lightbox_contains_focus_and_restores_opener_after_escape(self):
        self.page.goto(self.base_url + '/gallery', wait_until='networkidle')
        opener = self.page.locator('.gallery-grid button').nth(2)
        opener.focus()
        self.page.keyboard.press('Enter')
        viewer = self.page.get_by_role('dialog', name='Image viewer', exact=True)
        expect(viewer).to_be_visible()
        close = viewer.get_by_role('button', name='Close image viewer', exact=True)
        previous = viewer.get_by_role('button', name='Previous image', exact=True)
        next_button = viewer.get_by_role('button', name='Next image', exact=True)
        expect(close).to_be_focused()
        self.page.keyboard.press('Shift+Tab')
        expect(next_button).to_be_focused()
        self.page.keyboard.press('Tab')
        expect(close).to_be_focused()
        self.page.keyboard.press('Tab')
        expect(previous).to_be_focused()
        self.page.keyboard.press('Tab')
        expect(next_button).to_be_focused()
        next_button.click()
        expect(next_button).to_be_focused()
        expect(viewer.get_by_role('status')).to_contain_text('4 of 33')
        self.page.keyboard.press('ArrowLeft')
        expect(viewer.get_by_role('status')).to_contain_text('3 of 33')
        self.page.locator('header a').first.focus()
        self.assertTrue(viewer.evaluate('e => e.contains(document.activeElement)'))
        self.page.keyboard.press('Escape')
        expect(viewer).not_to_be_visible()
        expect(opener).to_be_focused()
        self.assertEqual(self.page.evaluate('document.body.style.overflow'), '')
        opener.click()
        close.click()
        expect(opener).to_be_focused()

    def test_lightbox_wraps_within_filtered_collection_and_backdrop_closes(self):
        self.page.goto(self.base_url + '/gallery', wait_until='networkidle')
        self.page.get_by_role('button', name='Masterpieces', exact=True).click()
        count = self.page.locator('.gallery-grid button').count()
        opener = self.page.locator('.gallery-grid button').first
        opener.click()
        viewer = self.page.get_by_role('dialog', name='Image viewer', exact=True)
        self.page.keyboard.press('ArrowLeft')
        expect(viewer.get_by_role('status')).to_contain_text(f'{count} of {count}')
        self.page.keyboard.press('ArrowRight')
        expect(viewer.get_by_role('status')).to_contain_text(f'1 of {count}')
        viewer.click(position={'x': 2, 'y': 2})
        expect(viewer).not_to_be_visible()
        expect(opener).to_be_focused()

    def test_contact_busy_announcements_and_focused_success_keep_contract(self):
        form = self.open_form('contact', '/contact')
        self.defer_response = True
        form.get_by_role('button', name='Send Message', exact=True).click()
        expect(form).to_have_attribute('aria-busy', 'true')
        progress = self.page.get_by_role('status')
        expect(progress).to_contain_text('Sending')
        self.assertTrue(progress.evaluate("""e => !e.closest('[aria-busy="true"]')"""))
        expect(form.locator('button[type="submit"]')).to_be_disabled()
        self.defer_response = False
        self.pending_routes.pop().fulfill(status=200, content_type='text/html', body='Intercepted local QA')
        expect(self.page.get_by_role('heading', name='Message Sent', exact=True)).to_be_focused()
        self.assertEqual(self.posts[-1]['path'], '/__forms.html')
        self.assertEqual(self.posts[-1]['fields']['form-name'], ['contact'])
        self.assertEqual(set(self.posts[-1]['fields']), {'form-name', 'bot-field', 'firstName', 'lastName', 'email', 'inquiryType', 'message'})

    def test_contact_failure_retains_fields_and_supports_keyboard_retry(self):
        form = self.open_form('contact', '/contact')
        self.network_error = True
        form.get_by_role('button', name='Send Message', exact=True).click()
        alert = form.get_by_role('alert')
        expect(alert).to_be_focused()
        self.assertIn(alert.get_attribute('id'), form.get_attribute('aria-describedby').split())
        expect(form.locator('[name="firstName"]')).to_have_value('Test & Local')
        for field, autocomplete in [('firstName', 'given-name'), ('lastName', 'family-name'), ('email', 'email')]:
            expect(form.locator(f'[name="{field}"]')).to_have_attribute('autocomplete', autocomplete)
        self.network_error = False
        button = form.get_by_role('button', name='Send Message', exact=True)
        button.focus()
        self.page.keyboard.press('Enter')
        expect(self.page.get_by_role('heading', name='Message Sent', exact=True)).to_be_focused()


def institutional_suite():
    return unittest.TestSuite(InstitutionalTests(name) for name in sorted(InstitutionalTests.__dict__) if name.startswith('test_'))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('--base-url', type=existing.local_origin)
    options, remaining = parser.parse_known_args()
    InstitutionalTests.base_url = options.base_url
    InstitutionalTests.start_server = options.base_url is None
    unittest.main(argv=[sys.argv[0], *remaining], defaultTest='institutional_suite')
