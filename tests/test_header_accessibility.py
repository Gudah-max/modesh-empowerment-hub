"""Header/focus geometry and Programs reflow on the real loopback production app.

Uses the existing protected browser harness: external traffic and writes cannot
reach a service. Root-text enlargement is distinct from native browser zoom.
"""
import argparse
import sys
import unittest

from playwright.sync_api import expect
from test_accessibility_reflow import AccessibilityReflowTests, evidence_directory
import test_forms as existing


CASES = tuple((w, p) for w in (320, 390, 768, 1024, 1440) for p in (100, 200))
FOCUS = r'''e => {
  const r=e.getBoundingClientRect(), h=document.querySelector('header'),
    hr=h.getBoundingClientRect(), s=getComputedStyle(e),
    gap=parseFloat(s.outlineWidth)+parseFloat(s.outlineOffset);
  const fragments=[...e.getClientRects()].map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom}));
  return {fragments, width:innerWidth,height:innerHeight,header:hr.toJSON(),
    inHeader:h.contains(e), gap, outline:s.outlineStyle,outlineWidth:parseFloat(s.outlineWidth),
    visible:e.matches(':focus-visible'),
    hits:fragments.map(f=>{let hit=document.elementFromPoint((f.left+f.right)/2,(f.top+f.bottom)/2);return !!hit&&(e===hit||e.contains(hit));}),
    rect:r.toJSON()};
}'''


class HeaderAccessibilityTests(AccessibilityReflowTests):
    def assert_exposed(self, control):
        expect(control).to_be_focused()
        self.settle()
        m = control.evaluate(FOCUS)
        self.assertTrue(m['visible'], m)
        self.assertEqual(m['outline'], 'solid', m)
        self.assertGreaterEqual(m['outlineWidth'], 2, m)
        for r in m['fragments']:
            self.assertGreaterEqual(r['left'] - m['gap'], 0, m)
            self.assertLessEqual(r['right'] + m['gap'], m['width'], m)
            self.assertGreaterEqual(r['top'] - m['gap'], 0, m)
            self.assertLessEqual(r['bottom'] + m['gap'], m['height'], m)
            if not m['inHeader']:
                self.assertGreaterEqual(r['top'] - m['gap'], max(0, m['header']['bottom']), m)
        self.assertTrue(all(m['hits']), m)
        return m

    def test_closed_header_reflows_without_consuming_viewport(self):
        # The original non-wrapping row makes the 320px enlarged brand 864px high.
        for width, percent in CASES:
            with self.subTest(width=width, text=percent):
                self.open_at('/privacy', width, percent)
                m = self.page.locator('header').evaluate('''e=>({
                  header:e.getBoundingClientRect().toJSON(),position:getComputedStyle(e).position,
                  root:parseFloat(getComputedStyle(document.documentElement).fontSize),
                  brand:document.querySelector('.brand').getBoundingClientRect().toJSON(),
                  brandFont:parseFloat(getComputedStyle(document.querySelector('.brand')).fontSize),
                  text:[...document.querySelector('.brand span').getClientRects()].map(r=>r.toJSON()),
                  controls:[...e.querySelectorAll('a,button')].filter(e=>e.checkVisibility()).map(e=>e.getBoundingClientRect().toJSON()),
                  documentWidth:document.documentElement.scrollWidth})''')
                self.capture(f'header-{width}-text{percent}', m)
                self.assertLessEqual(m['header']['height'], 450, m)
                if m['position'] == 'sticky':
                    self.assertLessEqual(m['header']['height'], 300, m)
                self.assertEqual(m['root'], 16 * percent / 100, m)
                self.assertGreaterEqual(m['brandFont'], 18 * percent / 100, m)
                self.assertEqual(m['documentWidth'], width, m)
                for r in m['controls']:
                    self.assertGreaterEqual(r['left'], 0, m)
                    self.assertLessEqual(r['right'], width, m)
                if percent == 100:
                    # Frozen baseline dimensions: same row, logo and type at every width.
                    self.assertEqual(m['header']['height'], 89, m)
                    self.assertEqual(self.page.locator('.brand-logo').first.evaluate('e=>e.getBoundingClientRect().width'), 48)
                    self.assertEqual(m['brand']['top'], 20, m)

    def test_navigation_keyboard_forward_reverse_escape_and_enrollment(self):
        for width, percent in CASES:
            with self.subTest(width=width, text=percent):
                self.open_at('/privacy', width, percent)
                toggle = self.page.locator('button[aria-controls="mobile-menu"]')
                if width < 1280:
                    toggle.focus()
                    self.assert_exposed(toggle)
                    self.page.keyboard.press('Shift+Tab')
                    self.assert_exposed(self.page.locator('header a:focus'))
                    self.page.keyboard.press('Tab')
                    expect(toggle).to_be_focused()
                    self.page.keyboard.press('Enter')
                    expect(toggle).to_have_attribute('aria-expanded', 'true')
                    nav = self.page.get_by_role('navigation', name='Mobile Navigation', exact=True)
                    links = nav.locator('a')
                    self.assertEqual(links.evaluate_all('es=>es.map(e=>e.getAttribute("href"))'),
                                     ['/programs', '/about', '/gallery', '/contact', '/enroll'])
                    for link in links.all():
                        self.page.keyboard.press('Tab')
                        self.assert_exposed(link)
                    for link in reversed(links.all()[:-1]):
                        self.page.keyboard.press('Shift+Tab')
                        self.assert_exposed(link)
                    self.page.keyboard.press('Escape')
                    expect(toggle).to_have_attribute('aria-expanded', 'false')
                    self.assert_exposed(toggle)
                    self.page.keyboard.press('Enter')
                    for _ in range(5):
                        self.page.keyboard.press('Tab')
                    self.assert_exposed(nav.get_by_role('link', name='Enroll Now', exact=True))
                    self.page.keyboard.press('Enter')
                    expect(self.page).to_have_url(self.base_url + '/enroll')
                    expect(toggle).to_have_attribute('aria-expanded', 'false')
                else:
                    nav = self.page.get_by_role('navigation', name='Main Navigation', exact=True)
                    self.page.locator('header .brand').focus()
                    for link in nav.locator('a').all():
                        self.page.keyboard.press('Tab')
                        self.assert_exposed(link)
                    self.page.keyboard.press('Tab')
                    enroll = self.page.locator('header .button-link').first
                    self.assert_exposed(enroll)
                    self.page.keyboard.press('Shift+Tab')
                    self.assert_exposed(nav.locator('a').last)
                    self.page.keyboard.press('Tab')
                    self.page.keyboard.press('Enter')
                    expect(self.page).to_have_url(self.base_url + '/enroll')

    def test_legal_email_keyboard_focus_is_exposed_after_scrolling(self):
        # Styles alone passed the previous audit even when the header hid the link.
        for path in ('/privacy', '/terms'):
            for width, percent in CASES:
                with self.subTest(path=path, width=width, text=percent):
                    self.open_at(path, width, percent)
                    main = self.page.locator('main')
                    main.focus()
                    link = self.page.locator('main a[href^="mailto:"]').first
                    for _ in range(20):
                        self.page.keyboard.press('Tab')
                        if link.evaluate('e=>e===document.activeElement'):
                            break
                    self.assert_exposed(link)
                    self.capture(f'focus-{path[1:]}-{width}-text{percent}', link.evaluate(FOCUS))
                    self.page.keyboard.press('Tab')
                    self.page.keyboard.press('Shift+Tab')
                    self.assert_exposed(link)
                    # Re-enter a partially obscured target using reverse keyboard focus.
                    self.page.keyboard.press('Tab')
                    self.page.evaluate('''()=>{let e=document.querySelector('main a[href^="mailto:"]');
                      window.scrollBy(0,e.getBoundingClientRect().top-30)}''')
                    self.page.keyboard.press('Shift+Tab')
                    self.assert_exposed(link)

    def test_opening_menu_after_scrolling_keeps_disclosure_in_view(self):
        for width in (320, 390, 768, 1024):
            with self.subTest(width=width):
                self.open_at('/privacy', width, 100)
                self.page.evaluate('window.scrollTo(0, 1200)')
                toggle = self.page.locator('button[aria-controls="mobile-menu"]')
                toggle.focus()
                self.assert_exposed(toggle)
                self.page.keyboard.press('Enter')
                expect(toggle).to_have_attribute('aria-expanded', 'true')
                self.settle()
                # Do not Tab or click a menu link first: either would conceal a
                # disappearing disclosure by automatically scrolling to it.
                first = self.page.get_by_role('navigation', name='Mobile Navigation', exact=True).locator('a').first
                r = first.bounding_box()
                self.assertGreaterEqual(r['y'], 0, r)
                self.assertLessEqual(r['y'] + r['height'], 900, r)
                self.assert_exposed(toggle)
                self.page.keyboard.press('Escape')
                self.assert_exposed(toggle)

    def test_programs_text_and_topics_stay_inside_content_after_settlement(self):
        # Removing the targeted wrapping exposes the 324px document and clipped topics.
        for width, percent in ((320, 200), (390, 200), (768, 200), (1440, 100)):
            for sample in range(3):
                with self.subTest(width=width, text=percent, sample=sample):
                    self.open_at('/programs', width, percent)
                    self.page.locator('img').evaluate_all('es=>es.forEach(e=>e.loading="eager")')
                    self.page.wait_for_function('[...document.images].every(e=>e.complete&&e.naturalWidth>0)')
                    self.settle()
                    m = self.page.evaluate('''()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
                      fonts:document.fonts.status, root:getComputedStyle(document.documentElement).fontSize,
                      images:[...document.images].map(e=>({src:e.currentSrc,complete:e.complete,natural:e.naturalWidth})),
                      text:[...document.querySelectorAll('.training-intro p,.course-topics li')].flatMap(e=>{
                        const parent=e.closest('.course-body')||e.closest('.training-intro'),
                          r=parent.getBoundingClientRect(),s=getComputedStyle(parent), range=new Range();
                        range.selectNodeContents(e);
                        return [...range.getClientRects()].map(t=>({text:e.textContent,left:t.left,right:t.right,
                          boundLeft:r.left+parseFloat(s.paddingLeft),boundRight:r.right-parseFloat(s.paddingRight)}));})})''')
                    self.capture(f'programs-{width}-text{percent}-sample{sample}', m)
                    self.assertEqual(m['scrollWidth'], width, m)
                    for r in m['text']:
                        self.assertGreaterEqual(r['left'], r['boundLeft'] - 1, r)
                        self.assertLessEqual(r['right'], r['boundRight'] + 1, r)


def header_suite():
    # Do not inherit and recount the Forms or Phase 5B tests.
    return unittest.TestSuite(HeaderAccessibilityTests(name) for name in sorted(HeaderAccessibilityTests.__dict__) if name.startswith('test_'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('--base-url', type=existing.local_origin)
    parser.add_argument('--evidence-dir', type=evidence_directory, default=evidence_directory('artifacts/phase-4a/phase-5c/after'))
    options, remaining = parser.parse_known_args()
    HeaderAccessibilityTests.base_url = options.base_url
    HeaderAccessibilityTests.start_server = options.base_url is None
    HeaderAccessibilityTests.evidence = options.evidence_dir
    unittest.main(argv=[sys.argv[0], *remaining], defaultTest='header_suite')
