"""Read-only whole-site and mocked Updates layout/metadata/accessibility evidence.

Production preview: 127.0.0.1:3100. Explicit mock preview: 127.0.0.1:3101.
External requests and every non-read browser request are blocked.
"""
import json
from pathlib import Path
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts/phase-4a'
WIDTHS = (320, 390, 768, 1024, 1440)
ROUTES = ('', 'programs', 'about', 'gallery', 'updates', 'team', 'contact', 'enroll', 'faq', 'privacy', 'terms')
BASE = 'http://127.0.0.1:3100'
MOCK = 'http://127.0.0.1:3101'
SITE = 'https://modeshempowermenthub.org'


def inspect():
    results = {'layouts': [], 'cmsLayouts': [], 'links': [], 'metadata': [], 'checks': [], 'pageErrors': []}
    links = set()
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(service_workers='block', reduced_motion='reduce', extra_http_headers={'Cache-Control': 'no-cache'})

        def intercept(route):
            url = urlsplit(route.request.url)
            if url.scheme == 'http' and url.hostname == '127.0.0.1' and url.port in (3100, 3101) and route.request.method in ('GET', 'HEAD'):
                route.continue_()
            else:
                route.abort()
        context.route('**/*', intercept)

        def visit(url, width):
            page = context.new_page()
            page.set_default_timeout(30000)
            page.set_viewport_size({'width': width, 'height': 900})
            page.on('pageerror', lambda error: results['pageErrors'].append(str(error)))
            response = page.goto(url, wait_until='networkidle', timeout=90000)
            page.evaluate('document.fonts.ready')
            page.wait_for_function('document.getAnimations().every(a=>!["running","pending"].includes(a.playState))')
            return page, response

        def measure(page, width):
            metrics = page.evaluate('''() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth,
              h1: document.querySelectorAll('main h1').length,
              animations: document.getAnimations().filter(a=>['running','pending'].includes(a.playState)).length })''')
            assert metrics['scrollWidth'] == width, (page.url, metrics)
            assert metrics['h1'] == 1 and metrics['animations'] == 0, (page.url, metrics)
            return metrics

        def decode(page):
            page.locator('img').evaluate_all('es=>es.forEach(e=>e.loading="eager")')
            for image in page.locator('img').all():
                expect(image).to_have_js_property('complete', True)
                image.evaluate('e=>e.decode()')
                assert image.evaluate('e=>e.naturalWidth>0')

        titles, descriptions = set(), set()
        for route in ROUTES:
            for width in WIDTHS:
                print(f'Production /{route} at {width}', flush=True)
                page, response = visit(BASE + '/' + route, width)
                assert response.status == 200
                measure_result = measure(page, width)
                results['layouts'].append({'route': '/' + route, **measure_result})
                # Actual native image decoding on all pages, including the approved
                # views, checks integration without altering their implementations.
                decode(page)
                if route in ('faq', 'updates') or width in (390, 1440):
                    page.screenshot(path=str(OUT / f'{route or "home"}-{width}.png'), full_page=True)
                if width == 390:
                    for link in page.locator('a[href^="/"],a[href^="#"]').evaluate_all('es=>es.map(e=>e.getAttribute("href"))'):
                        links.add('/' + route + link if link.startswith('#') else link)
                    title = page.title()
                    description = page.locator('meta[name="description"]').get_attribute('content')
                    assert title not in titles and description not in descriptions
                    titles.add(title)
                    descriptions.add(description)
                    canonical = page.locator('link[rel="canonical"]').get_attribute('href')
                    assert canonical.rstrip('/') == (SITE + '/' + route).rstrip('/'), (route, canonical)
                    assert page.locator('meta[property="og:url"]').get_attribute('content').rstrip('/') == canonical.rstrip('/')
                    assert page.locator('meta[property="og:description"]').get_attribute('content') == description
                    assert page.locator('meta[name="twitter:description"]').get_attribute('content') == description
                    assert page.locator('meta[property="og:title"]').get_attribute('content') == title
                    assert page.locator('meta[name="twitter:title"]').get_attribute('content') == title
                    assert page.locator('meta[property="og:site_name"]').get_attribute('content') == 'Modesh Empowerment Hub'
                    assert page.locator('meta[property="og:image:alt"]').get_attribute('content') == 'Decorated cakes displayed on a kitchen counter'
                    assert page.locator('meta[name="twitter:image:alt"]').get_attribute('content') == 'Decorated cakes displayed on a kitchen counter'
                    results['metadata'].append({'route': '/' + route, 'title': title, 'description': description, 'canonical': canonical})
                page.close()

        # Browser navigation checks preserve query preselection and hash targets.
        for href in sorted(links):
            page, response = visit(BASE + href, 390)
            assert response.status == 200, href
            fragment = unquote(urlsplit(href).fragment)
            if fragment:
                assert page.locator('[id]').evaluate_all('(es,id)=>es.some(e=>e.id===id)', fragment), href
            results['links'].append(href)
            page.close()

        for route in ('faq', 'updates'):
            page, _ = visit(BASE + '/' + route, 390)
            page.keyboard.press('Tab')
            expect(page.get_by_role('link', name='Skip to main content', exact=True)).to_be_focused()
            page.keyboard.press('Enter')
            expect(page.locator('main')).to_be_focused()
            page.add_style_tag(content='html { font-size: 200%; }')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), route
            page.close()
        results['checks'].append('FAQ/Updates skip-link keyboard transfer and 200% text reflow at 390px')

        sitemap = context.request.get(BASE + '/sitemap.xml')
        assert sitemap.status == 200
        tree = ET.fromstring(sitemap.text())
        ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        locations = [e.text for e in tree.findall('s:url/s:loc', ns)]
        assert len(locations) == 10
        assert {location.rstrip('/') for location in locations} == {(SITE + '/' + route).rstrip('/') for route in ROUTES if route != 'updates'}
        assert not tree.findall('s:url/s:lastmod', ns), 'No invented static modification dates'
        robots = context.request.get(BASE + '/robots.txt')
        assert robots.status == 200 and 'Allow: /' in robots.text() and f'Sitemap: {SITE}/sitemap.xml' in robots.text()
        (OUT / 'sitemap.xml').write_text(sitemap.text(), encoding='utf-8')
        (OUT / 'robots.txt').write_text(robots.text(), encoding='utf-8')
        results['checks'].append('Option B sitemap has ten active public routes, excludes Updates and has no fabricated static lastmod; robots preserves allow-all and the existing domain')

        def mode(value):
            (OUT / 'cms-state.json').write_text(json.dumps({'mode': value}), encoding='utf-8')
        for state, route in [('populated', 'updates'), ('populated', 'updates/article'), ('populated', 'updates/opportunity'), ('empty', 'updates'), ('error', 'updates'), ('error', 'updates/article'), ('populated', 'updates/unknown')]:
            mode(state)
            for width in WIDTHS:
                print(f'Mocked {state} /{route} at {width}', flush=True)
                page, response = visit(MOCK + '/' + route, width)
                metrics = measure(page, width)
                decode(page)
                for control in page.locator('.updates-filters button').all():
                    assert control.bounding_box()['height'] >= 48
                if width in (390, 1440):
                    page.screenshot(path=str(OUT / f'mock-{state}-{route.replace("/", "-")}-{width}.png'), full_page=True)
                if state == 'populated' and route == 'updates':
                    text_card = page.locator('.update-card--text')
                    expect(text_card).to_have_count(1)
                    assert text_card.evaluate('e=>getComputedStyle(e).alignSelf') == 'start'
                    summary = text_card.locator('p').bounding_box()
                    action = text_card.get_by_role('link', name='Read more', exact=False).bounding_box()
                    assert action['y'] - summary['y'] - summary['height'] <= 24
                    photo = page.locator('.update-card-photo').bounding_box()
                    assert abs(photo['width'] / photo['height'] - 4 / 3) < .01
                    if width >= 768:
                        image_box = page.locator('.update-card').filter(has=page.locator('.update-card-photo')).bounding_box()
                        text_box = text_card.bounding_box()
                        assert text_box['height'] < image_box['height'] - 100
                        assert abs(text_box['y'] - image_box['y']) < 1
                results['cmsLayouts'].append({'state': state, 'route': '/' + route, 'httpStatus': response.status, **metrics})
                if width == 390:
                    page.add_style_tag(content='html { font-size: 200%; }')
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (state, route)
                page.close()
        mode('populated')
        # Even locally mocked publications cannot opt the deferred feature into
        # the production sitemap. CMS publication guards retain separate tests.
        xml = context.request.get(MOCK + '/sitemap.xml').text()
        assert '/updates' not in xml
        results['checks'].append('Option B sitemap excludes the entire Updates family even with mocked published records')
        assert not results['pageErrors'], results['pageErrors']
        browser.close()
    (OUT / 'qa-results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
    print(f'PASS: {len(results["layouts"])} production layouts, {len(results["cmsLayouts"])} mocked layouts, {len(results["links"])} links, {len(results["metadata"])} metadata records', flush=True)


if __name__ == '__main__':
    inspect()
