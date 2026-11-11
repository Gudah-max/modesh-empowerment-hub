"""Real local-page reflow regressions; all writes/external requests are intercepted.

Run against a production build with --base-url http://127.0.0.1:3100, or omit
that option to let the existing Forms harness own the loopback server.
"""
import argparse
import json
from pathlib import Path
import sys
import unittest

from playwright.sync_api import expect
import test_forms as existing

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / 'artifacts/phase-4a/phase-5b/after'
CASES = ((320, 100), (320, 200), (390, 100), (390, 200), (1440, 100), (1440, 200))


def evidence_directory(value):
    path = (ROOT / value).resolve()
    if not path.is_relative_to((ROOT / 'artifacts/phase-4a').resolve()):
        raise argparse.ArgumentTypeError('Evidence must stay inside ignored artifacts/phase-4a.')
    return path


class AccessibilityReflowTests(existing.FormsTests):
    evidence = EVIDENCE

    def setUp(self):
        super().setUp()
        self.page.set_default_timeout(15000)
        self.page.emulate_media(reduced_motion='reduce')
        self.evidence.mkdir(parents=True, exist_ok=True)

    def settle(self):
        # Wait for actual fonts, visible image decoding, animations and two
        # paints before checking dimensions, never hide overflow in the test.
        self.page.evaluate('''async () => {
          await document.fonts.ready;
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }''')
        self.page.wait_for_function('''() => [...document.images].filter(e => {
          const r = e.getBoundingClientRect();
          return r.width && r.height && r.top < innerHeight && r.bottom > 0;
        }).every(e => e.currentSrc && e.complete && e.naturalWidth > 0)''')
        self.page.evaluate('''async () => {
          await Promise.all([...document.images].filter(e => {
            const r = e.getBoundingClientRect();
            return r.width && r.height && r.top < innerHeight && r.bottom > 0;
          }).map(e => e.decode()));
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }''')
        self.page.wait_for_function('document.getAnimations().every(a => !["running", "pending"].includes(a.playState))')

    def open_at(self, path, width, percent):
        self.page.set_viewport_size({'width': width, 'height': 900})
        self.page.goto(self.base_url + path, wait_until='networkidle')
        self.page.evaluate('percent => document.documentElement.style.fontSize = percent + "%"', percent)
        self.settle()

    def capture(self, name, measurements, full_page=False):
        self.page.screenshot(path=str(self.evidence / (name + '.png')), full_page=full_page)
        (self.evidence / (name + '.json')).write_text(json.dumps(measurements, indent=2), encoding='utf-8')

    def assert_focus_visible(self, control):
        expect(control).to_be_focused()
        self.settle()
        focus = control.evaluate('e => ({visible: e.matches(":focus-visible"), width: parseFloat(getComputedStyle(e).outlineWidth), style: getComputedStyle(e).outlineStyle})')
        self.assertTrue(focus['visible'])
        self.assertEqual(focus['style'], 'solid')
        self.assertGreaterEqual(focus['width'], 2)

    def test_legal_email_links_stay_contained_with_text_enlargement(self):
        # Removing the legal email wrapping must expose overflow, while keeping
        # the exact public address/href, actual rendered fragments and focus.
        for path in ('/privacy', '/terms'):
            for width, percent in CASES:
                with self.subTest(path=path, width=width, text=percent):
                    self.open_at(path, width, percent)
                    links = self.page.locator('main a[href^="mailto:"]')
                    self.assertGreater(links.count(), 0)
                    for link in links.all():
                        expect(link).to_have_text('info@modeshempowermenthub.org')
                        expect(link).to_have_attribute('href', 'mailto:info@modeshempowermenthub.org')
                    links.first.focus()
                    self.assert_focus_visible(links.first)
                    measurements = self.page.evaluate('''() => ({
                      width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
                      rootFont: getComputedStyle(document.documentElement).fontSize,
                      focusedLink: (() => {const r=document.activeElement.getBoundingClientRect();
                        return {top:r.top, bottom:r.bottom, headerBottom:document.querySelector('header').getBoundingClientRect().bottom, viewportHeight:innerHeight};})(),
                      links: [...document.querySelectorAll('main a[href^="mailto:"]')].map(e => {
                        const section=e.closest('section'), container=section.getBoundingClientRect(), style=getComputedStyle(section);
                        return {container: {left: container.left + parseFloat(style.paddingLeft), right: container.right - parseFloat(style.paddingRight)},
                          fragments: [...e.getClientRects()].map(r => ({left:r.left, right:r.right, width:r.width}))};
                      })
                    })''')
                    self.capture(f'{path[1:]}-{width}-text{percent}', measurements, full_page=True)
                    self.assertLessEqual(measurements['scrollWidth'], width, measurements)
                    for link in measurements['links']:
                        for fragment in link['fragments']:
                            self.assertGreaterEqual(fragment['left'], max(0, link['container']['left']) - 1)
                            self.assertLessEqual(fragment['right'], min(width, link['container']['right']) + 1)

    def test_lightbox_controls_stay_contained_with_text_enlargement(self):
        # Removing modal track constraints/control wrapping must put controls
        # outside the viewport. Keep labels, real images and keyboard behavior.
        for width, percent in CASES:
            with self.subTest(width=width, text=percent):
                self.open_at('/gallery', width, percent)
                opener = self.page.locator('.gallery-grid button').nth(2)
                opener.focus()
                self.page.keyboard.press('Enter')
                viewer = self.page.get_by_role('dialog', name='Image viewer', exact=True)
                expect(viewer).to_be_visible()
                self.settle()
                close = viewer.get_by_role('button', name='Close image viewer', exact=True)
                previous = viewer.get_by_role('button', name='Previous image', exact=True)
                next_button = viewer.get_by_role('button', name='Next image', exact=True)
                self.assert_focus_visible(close)
                measurements = viewer.evaluate('''e => ({
                  width: innerWidth, height: innerHeight,
                  documentWidth: document.documentElement.scrollWidth,
                  clientWidth: e.clientWidth, scrollWidth: e.scrollWidth,
                  controls: [...e.querySelectorAll('button')].map(b => {
                    const r = b.getBoundingClientRect();
                    return {name:b.getAttribute('aria-label'), left:r.left, right:r.right, top:r.top, bottom:r.bottom};
                  }),
                  image: (() => {const i=e.querySelector('img'), r=i.getBoundingClientRect();
                    return {naturalWidth:i.naturalWidth, naturalHeight:i.naturalHeight,
                      width:r.width, height:r.height, objectFit:getComputedStyle(i).objectFit};})()
                })''')
                self.capture(f'lightbox-{width}-text{percent}', measurements)
                self.assertLessEqual(measurements['documentWidth'], width, measurements)
                self.assertLessEqual(measurements['scrollWidth'], measurements['clientWidth'], measurements)
                for control in measurements['controls']:
                    self.assertGreaterEqual(control['left'], 0, control)
                    self.assertLessEqual(control['right'], width, control)
                    self.assertGreaterEqual(control['top'], 0, control)
                    self.assertLessEqual(control['bottom'], measurements['height'], control)
                self.assertEqual(measurements['image']['objectFit'], 'contain')
                self.assertGreater(measurements['image']['naturalWidth'], 0)
                self.assertGreater(measurements['image']['naturalHeight'], 0)
                self.assertGreater(measurements['image']['width'], 0)
                self.assertGreater(measurements['image']['height'], 0)
                self.page.keyboard.press('Shift+Tab')
                self.assert_focus_visible(next_button)
                self.page.keyboard.press('Tab')
                expect(close).to_be_focused()
                self.page.keyboard.press('Tab')
                self.assert_focus_visible(previous)
                self.page.keyboard.press('Tab')
                expect(next_button).to_be_focused()
                self.page.keyboard.press('ArrowRight')
                expect(viewer.get_by_role('status')).to_contain_text('4 of 33')
                self.page.keyboard.press('ArrowLeft')
                expect(viewer.get_by_role('status')).to_contain_text('3 of 33')
                self.settle()
                self.page.locator('header a').first.focus()
                self.assertTrue(viewer.evaluate('e => e.contains(document.activeElement)'))
                self.page.keyboard.press('Escape')
                expect(viewer).not_to_be_visible()
                expect(opener).to_be_focused()
                self.assertEqual(self.page.evaluate('document.body.style.overflow'), '')
                self.page.keyboard.press('Enter')
                expect(viewer).to_be_visible()
                self.settle()
                close.click()
                expect(opener).to_be_focused()
                self.page.keyboard.press('Enter')
                expect(viewer).to_be_visible()
                viewer.click(position={'x': 2, 'y': 2})
                expect(viewer).not_to_be_visible()
                expect(opener).to_be_focused()


def reflow_suite():
    return unittest.TestSuite(AccessibilityReflowTests(name) for name in sorted(AccessibilityReflowTests.__dict__) if name.startswith('test_'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('--base-url', type=existing.local_origin)
    parser.add_argument('--evidence-dir', type=evidence_directory, default=EVIDENCE)
    options, remaining = parser.parse_known_args()
    AccessibilityReflowTests.base_url = options.base_url
    AccessibilityReflowTests.start_server = options.base_url is None
    AccessibilityReflowTests.evidence = options.evidence_dir
    unittest.main(argv=[sys.argv[0], *remaining], defaultTest='reflow_suite')
