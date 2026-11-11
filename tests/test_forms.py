"""Exercise real local forms while intercepting every submission before the server.

Run after `npm run build`: python -B tests/test_forms.py -v
An existing loopback server can be used with --base-url http://127.0.0.1:PORT.
Requires Python Playwright and its Chromium browser; no Netlify account is used.
"""

import argparse
from pathlib import Path
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import unittest
from urllib.parse import parse_qs, urlsplit

from playwright.sync_api import expect, sync_playwright


def local_origin(value):
    """Reject public hosts and URL components that could redirect the test target."""
    url = urlsplit(value)
    if (
        url.scheme != 'http'
        or url.hostname not in ('127.0.0.1', '::1')
        or url.username is not None
        or url.password is not None
        or url.path not in ('', '/')
        or url.query
        or url.fragment
    ):
        raise ValueError('Form tests require a plain HTTP loopback origin.')
    # Validate the port before a browser or server is started.
    _ = url.port
    return value.rstrip('/')


FORMS = (
    ('contact', '/contact', 'Send Message', 'Message Sent'),
    ('enroll', '/enroll?course=wedding-master-class', 'Submit Application', 'Application Received'),
)


class TargetSafetyTests(unittest.TestCase):
    def test_public_and_ambiguous_targets_are_rejected(self):
        for value in (
            'https://modeshempowermenthub.org',
            'http://modeshempowermenthub.org',
            'http://127.0.0.1.evil.example:3100',
            'http://user@127.0.0.1:3100',
            'http://127.0.0.1:3100/contact',
            'http://127.0.0.1:3100?redirect=https://example.com',
        ):
            with self.subTest(target=value), self.assertRaises(ValueError):
                local_origin(value)


class FormsTests(unittest.TestCase):
    base_url = None

    @classmethod
    def setUpClass(cls):
        root = Path(__file__).resolve().parents[1]
        cls.base_url = local_origin(cls.base_url or 'http://127.0.0.1:3100')
        if cls.start_server:
            if not (root / '.next/BUILD_ID').is_file():
                raise RuntimeError('Run npm run build before the form suite.')
            with socket.socket() as check:
                check.bind(('127.0.0.1', 3100))
            log = tempfile.TemporaryFile()
            cls.addClassCleanup(log.close)
            server = subprocess.Popen(
                [shutil.which('node'), 'node_modules/next/dist/bin/next', 'start',
                 '--hostname', '127.0.0.1', '--port', '3100'],
                cwd=root, stdout=log, stderr=subprocess.STDOUT,
            )

            def stop_server():
                if server.poll() is None:
                    server.terminate()
                    try:
                        server.wait(timeout=10)
                    except subprocess.TimeoutExpired:
                        server.kill()
                        server.wait(timeout=10)

            cls.addClassCleanup(stop_server)
            deadline = time.monotonic() + 30
            while time.monotonic() < deadline:
                if server.poll() is not None:
                    log.seek(0)
                    raise RuntimeError(log.read().decode(errors='replace'))
                try:
                    with socket.create_connection(('127.0.0.1', 3100), timeout=0.2):
                        break
                except OSError:
                    time.sleep(0.1)
            else:
                raise RuntimeError('Local production server did not start within 30 seconds.')

        playwright = sync_playwright().start()
        cls.addClassCleanup(playwright.stop)
        cls.browser = playwright.chromium.launch(headless=True)
        cls.addClassCleanup(cls.browser.close)

    start_server = True

    def setUp(self):
        self.context = self.browser.new_context(service_workers='block')
        self.addCleanup(self.context.close)
        self.posts = []
        self.response_status = 200
        self.network_error = False
        self.defer_response = False
        self.pending_routes = []
        self.context.route('**/*', self.route_request)
        self.page = self.context.new_page()
        self.page.set_default_timeout(5000)

    def route_request(self, route):
        request = route.request
        target = urlsplit(request.url)
        origin = urlsplit(self.base_url)
        # No external requests, including maps, analytics and redirects, can leave
        # the browser. Every non-read request is fulfilled or aborted locally.
        if (target.scheme, target.hostname, target.port) != (origin.scheme, origin.hostname, origin.port):
            route.abort()
        elif request.method == 'POST':
            self.posts.append({
                'path': target.path,
                'headers': request.headers,
                'fields': parse_qs(request.post_data or '', keep_blank_values=True),
            })
            if self.defer_response:
                self.pending_routes.append(route)
            elif self.network_error:
                route.abort('failed')
            else:
                route.fulfill(status=self.response_status, content_type='text/html', body='Intercepted local test response')
        elif request.method in ('GET', 'HEAD'):
            route.continue_()
        else:
            route.abort()

    def open_form(self, name, path):
        self.page.goto(self.base_url + path, wait_until='networkidle')
        form = self.page.locator(f'form[name="{name}"]')
        expect(form).to_be_visible()
        form.locator('[name="firstName"]').fill('Test & Local')
        form.locator('[name="lastName"]').fill('Odera + QA')
        form.locator('[name="email"]').fill('local-test@example.invalid')
        form.locator('[name="message"]').fill('Local test only: A&B + 50% / Kisumu')
        if name == 'enroll':
            form.locator('[name="phone"]').fill('+254700000000')
            form.locator('[name="startDate"]').fill('Local test intake')
        return form

    def test_success_posts_complete_encoded_payload_to_static_target(self):
        for name, path, button, confirmation in FORMS:
            with self.subTest(form=name):
                form = self.open_form(name, path)
                if name == 'enroll':
                    expect(form.locator('[name="course"]')).to_have_value('Wedding Master Class')
                before = len(self.posts)
                form.get_by_role('button', name=button, exact=True).click()
                expect(self.page.get_by_role('heading', name=confirmation, exact=True)).to_be_visible()
                self.assertEqual(len(self.posts), before + 1)
                submission = self.posts[-1]
                self.assertEqual(submission['path'], '/__forms.html')
                self.assertIn('application/x-www-form-urlencoded', submission['headers']['content-type'])
                expected = {
                    'form-name': [name], 'bot-field': [''],
                    'firstName': ['Test & Local'], 'lastName': ['Odera + QA'],
                    'email': ['local-test@example.invalid'],
                    'message': ['Local test only: A&B + 50% / Kisumu'],
                }
                if name == 'enroll':
                    expected.update(phone=['+254700000000'], course=['Wedding Master Class'], startDate=['Local test intake'])
                else:
                    expected['inquiryType'] = ['Program Enrollment']
                self.assertEqual(submission['fields'], expected)

    def test_static_definitions_register_every_submitted_field(self):
        self.page.goto(self.base_url + '/__forms.html', wait_until='networkidle')
        definitions = self.page.locator('form').evaluate_all('''forms => Object.fromEntries(forms.map(f => [f.name, {
            fields: [...f.elements].map(e => e.name).filter(Boolean),
            detection: f.getAttribute('data-netlify'),
            honeypot: f.getAttribute('netlify-honeypot')
        }]))''')
        for name, path, _, _ in FORMS:
            with self.subTest(form=name):
                form = self.open_form(name, path)
                fields = form.locator('[name]').evaluate_all('es => es.map(e => e.name)')
                self.assertEqual(set(fields) - {'form-name'}, set(definitions[name]['fields']) - {'form-name'})
                self.assertEqual(definitions[name]['detection'], 'true')
                self.assertEqual(definitions[name]['honeypot'], 'bot-field')

    def test_failed_requests_keep_fields_and_allow_retry(self):
        for network_error in (False, True):
            for name, path, button, confirmation in FORMS:
                with self.subTest(form=name, network_error=network_error):
                    form = self.open_form(name, path)
                    self.response_status = 500
                    self.network_error = network_error
                    form.get_by_role('button', name=button, exact=True).click()
                    expect(form.get_by_role('alert')).to_be_visible()
                    expect(form.locator('[name="firstName"]')).to_have_value('Test & Local')
                    expect(form.get_by_role('button', name=button, exact=True)).to_be_enabled()
                    expect(self.page.get_by_role('heading', name=confirmation, exact=True)).to_have_count(0)
                    self.response_status = 200
                    self.network_error = False
                    form.get_by_role('button', name=button, exact=True).click()
                    expect(self.page.get_by_role('heading', name=confirmation, exact=True)).to_be_visible()

    def test_required_fields_prevent_any_submission(self):
        for name, path, button, _ in FORMS:
            with self.subTest(form=name):
                form = self.open_form(name, path)
                form.locator('[name="email"]').fill('')
                before = len(self.posts)
                form.get_by_role('button', name=button, exact=True).click()
                self.assertFalse(form.evaluate('f => f.checkValidity()'))
                self.assertEqual(len(self.posts), before)

    def test_pending_submission_disables_repeat_sends(self):
        for name, path, button, confirmation in FORMS:
            with self.subTest(form=name):
                form = self.open_form(name, path)
                self.defer_response = True
                before = len(self.posts)
                submit = form.get_by_role('button', name=button, exact=True)
                submit.click()
                submit = form.locator('button[type="submit"]')
                expect(submit).to_be_disabled()
                expect(submit).to_have_text('Sending…' if name == 'contact' else 'Submitting…')
                submit.evaluate('button => button.click()')
                self.assertEqual(len(self.posts), before + 1)
                self.defer_response = False
                self.pending_routes.pop().fulfill(status=200, content_type='text/html', body='Intercepted local test response')
                expect(self.page.get_by_role('heading', name=confirmation, exact=True)).to_be_visible()

    def test_patched_native_image_optimizer_serves_an_existing_png(self):
        self.page.goto(self.base_url + '/contact', wait_until='networkidle')
        image_url = self.base_url + '/_next/image?url=%2Fimages%2Fmodesh_logo_transparent_background.png&w=96&q=75'
        # Next's attachment Content-Disposition starts a download on navigation.
        # Exercise the real subresource path that next/image consumers use.
        with self.page.expect_response(image_url) as result:
            self.page.evaluate('''url => {
                const image = new Image();
                image.id = 'phase1-native-image';
                image.src = url;
                document.body.append(image);
            }''', image_url)
        response = result.value
        self.assertEqual(response.status, 200)
        self.assertTrue(response.headers['content-type'].startswith('image/'))
        self.assertGreater(len(response.body()), 0)
        image = self.page.locator('#phase1-native-image')
        image.evaluate('image => image.decode()')
        self.assertGreater(image.evaluate('image => image.naturalWidth'), 0)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('--base-url', type=local_origin)
    options, remaining = parser.parse_known_args()
    FormsTests.base_url = options.base_url
    FormsTests.start_server = options.base_url is None
    unittest.main(argv=[sys.argv[0], *remaining])
