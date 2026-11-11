"""Home introduction reflow on the real app; external traffic/writes blocked."""
import argparse
import sys
import unittest

from playwright.sync_api import expect
from test_accessibility_reflow import evidence_directory
from test_header_accessibility import HeaderAccessibilityTests
import test_forms as existing


INTRO = ('Hands-on baking and entrepreneurship training in Manyatta, Kisumu. '
         'Develop practical skills, build confidence, and explore new opportunities.')


class HomeReflowTests(HeaderAccessibilityTests):
    def test_home_introduction_text_stays_readable_and_contained(self):
        # Removing the Home-only wrapping must expose the 324px document and
        # the intro word's Range fragment extending beyond its padded column.
        for width in (320, 390, 768):
            for percent in (100, 200):
                with self.subTest(width=width, text=percent):
                    self.open_at('/', width, percent)
                    self.page.locator('img').evaluate_all('es=>es.forEach(e=>e.loading="eager")')
                    self.page.wait_for_function('[...document.images].every(e=>e.complete&&e.naturalWidth>0)')
                    self.page.locator('img').evaluate_all('es=>Promise.all(es.map(e=>e.decode()))')
                    self.settle()
                    intro = self.page.locator('.home-hero .section-lead')
                    expect(intro).to_have_text(INTRO)
                    m = intro.evaluate('''e=>{
                      const s=getComputedStyle(e),r=e.getBoundingClientRect(),range=new Range();
                      range.selectNodeContents(e);
                      const h=document.querySelector('header');
                      return {width:innerWidth,documentWidth:document.documentElement.scrollWidth,
                        rootFont:parseFloat(getComputedStyle(document.documentElement).fontSize),
                        font:parseFloat(s.fontSize),lineHeight:parseFloat(s.lineHeight),
                        fonts:document.fonts.status,text:e.textContent,overflow:s.overflow,
                        paragraph:r.toJSON(),fragments:[...range.getClientRects()].map(r=>r.toJSON()),
                        header:{height:h.getBoundingClientRect().height,position:getComputedStyle(h).position},
                        images:[...document.images].map(i=>({src:i.currentSrc,complete:i.complete,naturalWidth:i.naturalWidth}))};
                    }''')
                    self.capture(f'home-{width}-text{percent}', m, full_page=percent == 100)
                    self.assertEqual(m['fonts'], 'loaded', m)
                    self.assertEqual(m['rootFont'], 16 * percent / 100, m)
                    self.assertEqual(m['font'], 18 * percent / 100, m)
                    self.assertGreaterEqual(m['lineHeight'], m['font'], m)
                    self.assertEqual(m['overflow'], 'visible', m)
                    self.assertEqual(m['documentWidth'], width, m)
                    self.assertGreater(len(m['fragments']), 0, m)
                    for fragment in m['fragments']:
                        self.assertGreater(fragment['width'], 0, fragment)
                        self.assertGreater(fragment['height'], 0, fragment)
                        self.assertGreaterEqual(fragment['left'], max(0, m['paragraph']['left']), fragment)
                        self.assertLessEqual(fragment['right'], min(width, m['paragraph']['right']), fragment)
                    self.assertLessEqual(m['header']['height'], 450, m)
                    self.assertEqual(m['header']['position'], 'sticky' if percent == 100 else 'static', m)
                    if percent == 100:
                        self.assertEqual(m['header']['height'], 89, m)
                    # Scrolling to Home's action must leave real keyboard focus
                    # and its outline exposed; retain the approved header logic.
                    enroll = self.page.locator('.home-hero a[href="/enroll"]')
                    enroll.focus()
                    self.page.keyboard.press('Tab')
                    self.page.keyboard.press('Shift+Tab')
                    self.assert_exposed(enroll)


def home_suite():
    # Explicitly run only this new regression, without recounting inherited suites.
    return unittest.TestSuite([HomeReflowTests('test_home_introduction_text_stays_readable_and_contained')])


if __name__ == '__main__':
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('--base-url', type=existing.local_origin)
    parser.add_argument('--evidence-dir', type=evidence_directory,
                        default=evidence_directory('artifacts/phase-4a/phase-5d/after'))
    options, remaining = parser.parse_known_args()
    HomeReflowTests.base_url = options.base_url
    HomeReflowTests.start_server = options.base_url is None
    HomeReflowTests.evidence = options.evidence_dir
    unittest.main(argv=[sys.argv[0], *remaining], defaultTest='home_suite')
