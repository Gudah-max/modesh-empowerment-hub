"""Focused Phase 3B checks using the existing local-only interception harness."""
import argparse
import json
from pathlib import Path
import sys
import unittest
from playwright.sync_api import expect
import test_forms as existing

BASELINE = json.loads((Path(__file__).parent / 'fixtures' / 'phase3b-courses.json').read_text(encoding='utf-8'))


class ProgramsEnrollmentTests(existing.FormsTests):
    def test_every_course_card_keeps_complete_content_and_its_frozen_enrollment_link(self):
        self.page.goto(self.base_url + '/programs', wait_until='networkidle')
        for course in BASELINE:
            card = self.page.locator(f'article[id="{course["id"]}"]')
            expect(card.get_by_role('heading', name=course['title'], exact=True)).to_be_visible()
            description = card.locator('.course-description')
            expect(description).to_have_text(course['desc'])
            self.assertEqual(description.evaluate('e => getComputedStyle(e).webkitLineClamp'), 'none')
            for topic in course['list']:
                expect(card.get_by_text(topic, exact=True)).to_be_visible()
            link = card.get_by_role('link', name='Enroll in this course: ' + course['title'], exact=True)
            expect(link).to_have_attribute('href', '/enroll?course=' + course['id'])
        self.assertEqual(self.page.locator('#courses article').count(), 5)

    def test_required_optional_labels_autocomplete_and_help_are_accessible(self):
        self.page.goto(self.base_url + '/enroll', wait_until='networkidle')
        for name, autocomplete in [('firstName', 'given-name'), ('lastName', 'family-name'), ('email', 'email'), ('phone', 'tel')]:
            field = self.page.locator(f'[name="{name}"]')
            expect(field).to_have_attribute('autocomplete', autocomplete)
            self.assertTrue(field.evaluate('e => e.required'))
            self.assertIn('required', field.evaluate('e => e.labels[0].textContent').lower())
        for name in ('startDate', 'message'):
            field = self.page.locator(f'[name="{name}"]')
            self.assertFalse(field.evaluate('e => e.required'))
            self.assertIn('optional', field.evaluate('e => e.labels[0].textContent').lower())
        for name in ('course', 'startDate'):
            field = self.page.locator(f'[name="{name}"]')
            help_id = field.get_attribute('aria-describedby')
            self.assertTrue(help_id)
            expect(self.page.locator('#' + help_id)).to_be_visible()
        course = self.page.locator('[name="course"]')
        self.assertTrue(course.evaluate('e => e.required'))
        self.assertIn('required', course.evaluate('e => e.labels[0].textContent').lower())
        expect(self.page.locator('a[href="/privacy"]').first).to_be_visible()
        expect(self.page.get_by_role('link', name='Ask on WhatsApp', exact=True)).to_have_attribute('href', 'https://wa.me/254726844169')
        expect(self.page.get_by_role('heading', name='Application guidance', exact=True)).to_be_visible()
        expect(self.page.locator('main a[href="/terms"]')).to_have_text(['Terms of Service', 'Read our terms'])
        self.page.get_by_role('link', name='Read our terms', exact=True).click()
        expect(self.page).to_have_url(self.base_url + '/terms')
        expect(self.page.get_by_role('heading', name='Terms of Service', exact=True)).to_be_visible()

    def test_success_announces_and_focuses_confirmation(self):
        form = self.open_form('enroll', '/enroll?course=wedding-master-class')
        self.defer_response = True
        form.get_by_role('button', name='Submit Application', exact=True).click()
        expect(form).to_have_attribute('aria-busy', 'true')
        expect(self.page.get_by_role('status')).to_contain_text('Submitting')
        self.assertTrue(self.page.get_by_role('status').evaluate('e => !e.closest(\'[aria-busy="true"]\')'))
        expect(form.locator('button[type="submit"]')).to_be_disabled()
        self.defer_response = False
        self.pending_routes.pop().fulfill(status=200, content_type='text/html', body='Intercepted local test response')
        heading = self.page.get_by_role('heading', name='Application Received', exact=True)
        expect(heading).to_be_focused()
        expect(self.page.get_by_role('status')).to_contain_text('Application Received')
        expect(self.page.get_by_role('heading', name='Application guidance', exact=True)).to_have_count(0)
        self.assertNotIn('soon', self.page.locator('main').inner_text().lower())

    def test_failure_focuses_associated_alert_and_preserves_input_for_retry(self):
        form = self.open_form('enroll', '/enroll?course=pastry-arts')
        self.response_status = 500
        form.get_by_role('button', name='Submit Application', exact=True).click()
        alert = form.get_by_role('alert')
        expect(alert).to_be_focused()
        self.assertIn(alert.get_attribute('id'), form.get_attribute('aria-describedby').split())
        expect(form.locator('[name="firstName"]')).to_have_value('Test & Local')
        expect(form.locator('[name="course"]')).to_have_value('Pastry Arts')
        self.response_status = 200
        form.get_by_role('button', name='Submit Application', exact=True).click()
        expect(self.page.get_by_role('heading', name='Application Received', exact=True)).to_be_focused()
        self.assertEqual(self.posts[-1]['path'], '/__forms.html')
        self.assertEqual(self.posts[-1]['fields']['course'], ['Pastry Arts'])


def focused_suite():
    return unittest.TestSuite(ProgramsEnrollmentTests(name) for name in sorted(ProgramsEnrollmentTests.__dict__) if name.startswith('test_'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('--base-url', type=existing.local_origin)
    options, remaining = parser.parse_known_args()
    ProgramsEnrollmentTests.base_url = options.base_url
    ProgramsEnrollmentTests.start_server = options.base_url is None
    unittest.main(argv=[sys.argv[0], *remaining], defaultTest='focused_suite')
