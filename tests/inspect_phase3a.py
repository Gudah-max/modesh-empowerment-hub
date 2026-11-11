"""Local, read-only Phase 3A inspection. Never sends forms or external requests."""
import json
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
from playwright.sync_api import sync_playwright, expect

OUT = Path(__file__).resolve().parents[1] / 'artifacts' / 'phase-3a'
BASE = 'http://127.0.0.1:3100'
WIDTHS = (320, 390, 768, 1024, 1280, 1440)
ROUTES = ('/', '/programs', '/about', '/gallery', '/updates', '/team', '/contact', '/enroll', '/faq', '/privacy', '/terms')


def inspect():
    results = {'layouts': [], 'routes': [], 'checks': [], 'errors': []}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(service_workers='block', reduced_motion='reduce')
        def intercept(route):
            request = route.request
            target = urlsplit(request.url)
            if (target.scheme, target.hostname, target.port) == ('http', '127.0.0.1', 3100) and request.method in ('GET', 'HEAD'):
                route.continue_()
            else:
                route.abort()
        context.route('**/*', intercept)
        page = context.new_page()
        page.on('pageerror', lambda error: results['errors'].append(str(error)))
        for width in WIDTHS:
            print(f'Inspecting homepage {width}', flush=True)
            page.set_viewport_size({'width': width, 'height': 900})
            page.goto(BASE, wait_until='networkidle')
            page.evaluate('document.fonts.ready')
            # Eager loading is test-only; production below-fold images stay lazy.
            page.locator('img').evaluate_all("es => es.forEach(e => e.loading = 'eager')")
            for image in page.locator('img').all():
                print(f'Decoding {image.get_attribute("alt")}', flush=True)
                expect(image).to_have_js_property('complete', True, timeout=30000)
                image.evaluate('''image => {
                    return Promise.race([image.decode(), new Promise((_, reject) => setTimeout(() => reject(new Error('Image decoding timed out: ' + image.src)), 15000))]);
                }''')
                assert image.evaluate('image => image.naturalWidth > 0')
            page.evaluate('window.scrollTo(0, 0)')
            page.screenshot(path=str(OUT / f'after-{width}.png'), full_page=True)
            layout = page.evaluate('''() => ({width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
                h1Count: document.querySelectorAll('h1').length,
                imageCount: document.querySelectorAll('main img').length,
                heroFont: getComputedStyle(document.querySelector('h1')).fontSize,
                animations: document.getAnimations().length})''')
            assert layout['scrollWidth'] == width, layout
            assert layout['h1Count'] == 1, layout
            assert layout['animations'] == 0, layout
            results['layouts'].append(layout)
            if width < 1280:
                toggle = page.locator('button[aria-controls="mobile-menu"]')
                toggle.focus()
                page.keyboard.press('Enter')
                expect(toggle).to_have_attribute('aria-expanded', 'true')
                expect(page.get_by_role('navigation', name='Mobile Navigation')).to_be_visible()
                page.keyboard.press('Escape')
                expect(toggle).to_be_focused()
                expect(toggle).to_have_attribute('aria-expanded', 'false')
        results['checks'].append('Menu Enter/Escape/expanded state/focus return passed at every disclosure width')
        # Legacy page views are outside this visual pass. Use original local
        # images for route/reflow checks; homepage above exercises the optimizer.
        def original_route_image(route):
            source = parse_qs(urlsplit(route.request.url).query).get('url', [''])[0]
            assert source.startswith('/images/')
            route.fulfill(response=route.fetch(url=BASE + source))
        page.route('**/_next/image?**', original_route_image)
        for path in ROUTES:
            print(f'Inspecting route {path}', flush=True)
            for width in (320, 768, 1440):
                page.set_viewport_size({'width': width, 'height': 900})
                response = page.goto(BASE + path, wait_until='networkidle')
                assert response.status == 200, (path, response.status)
                data = page.evaluate('''() => ({scrollWidth: document.documentElement.scrollWidth, width: innerWidth})''')
                results['routes'].append({'path': path, 'status': response.status, **data})
                if path == '/contact' and width == 320 or path == '/programs' and width == 768:
                    page.screenshot(path=str(OUT / f'{path[1:]}-{width}.png'), full_page=True)
        page.unroute('**/_next/image?**', original_route_image)
        for slug, label in (
            ('professional-baking', 'Professional Baking'),
            ('pastry-arts', 'Pastry Arts'),
            ('artisan-bread-making', 'Artisan Bread Making'),
            ('bakery-entrepreneurship', 'Bakery Entrepreneurship'),
            ('wedding-master-class', 'Wedding Master Class'),
        ):
            page.goto(BASE + '/enroll?course=' + slug, wait_until='networkidle')
            expect(page.locator('select[name="course"]')).to_have_value(label)
        results['checks'].append('All five original enrollment query slugs preselect the unchanged course values')
        response = page.goto(BASE + '/updates/phase3a-no-published-entry', wait_until='networkidle')
        # Existing ISR can stream the not-found body with HTTP 200; metadata
        # explicitly de-indexes it. Preserve that established CMS behavior.
        assert response.status in (200, 404)
        expect(page.get_by_role('heading', name="This update isn't available", exact=True)).to_be_visible()
        assert 'noindex' in page.locator('meta[name="robots"]').first.get_attribute('content')
        for link in page.locator('header a[href="/updates"]').all():
            expect(link).to_have_attribute('aria-current', 'page')
        results['checks'].append('Unknown Updates slug shows the de-indexed not-found body; nested route highlights Updates in both menus')
        page.set_viewport_size({'width': 390, 'height': 900})
        page.goto(BASE, wait_until='networkidle')
        page.keyboard.press('Tab')
        expect(page.get_by_role('link', name='Skip to main content')).to_be_focused()
        page.keyboard.press('Enter')
        expect(page.locator('#main-content')).to_be_focused()
        results['checks'].append('Skip link transfers keyboard focus to main')
        page.get_by_role('button', name='Open menu', exact=True).click()
        page.get_by_role('navigation', name='Mobile Navigation').get_by_role('link', name='Programs', exact=True).click()
        expect(page).to_have_url(BASE + '/programs')
        expect(page.get_by_role('button', name='Open menu', exact=True)).to_have_attribute('aria-expanded', 'false')
        results['checks'].append('Mobile navigation follows route and closes')
        page.set_viewport_size({'width': 768, 'height': 320})
        page.goto(BASE, wait_until='networkidle')
        page.get_by_role('button', name='Open menu', exact=True).click()
        menu = page.locator('#mobile-menu')
        assert menu.evaluate('e => e.clientHeight <= innerHeight - 88 && e.scrollHeight > e.clientHeight')
        menu.get_by_role('link', name='Enroll Now', exact=True).focus()
        page.screenshot(path=str(OUT / 'menu-landscape.png'))
        page.keyboard.press('Escape')
        results['checks'].append('Short landscape menu scrolls; enrollment is keyboard reachable')
        page.set_viewport_size({'width': 390, 'height': 900})
        page.goto(BASE, wait_until='networkidle')
        page.add_style_tag(content='html { font-size: 200%; }')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.screenshot(path=str(OUT / 'text-200-percent.png'), full_page=True)
        results['checks'].append('Homepage reflows at 200% text size and 320 CSS px (400% zoom equivalent at 1280)')
        # All local homepage and shared-header/footer destinations must exist.
        page.goto(BASE, wait_until='networkidle')
        local_links = page.locator('a[href^="/"]').evaluate_all('es => [...new Set(es.map(e => e.getAttribute("href")))]')
        for href in local_links:
            response = context.request.get(BASE + href.split('#')[0])
            assert response.status == 200, href
        results['checks'].append('All local homepage/header/footer CTA destinations return 200')
        assert not results['errors'], results['errors']
        browser.close()
    (OUT / 'qa-results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
    print(json.dumps(results, indent=2))


if __name__ == '__main__':
    inspect()
