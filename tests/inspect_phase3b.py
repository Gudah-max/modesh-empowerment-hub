"""Read-only local layout QA; every form POST is fulfilled before reaching a server."""
import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect

BASE = 'http://127.0.0.1:3100'
OUT = Path(__file__).resolve().parents[1] / 'artifacts' / 'phase-3b'
WIDTHS = (320, 390, 768, 1024, 1440)
COURSES = json.loads((Path(__file__).parent / 'fixtures' / 'phase3b-courses.json').read_text(encoding='utf-8'))


def inspect():
    results = {'layouts': [], 'checks': [], 'pageErrors': [], 'interceptedPosts': []}
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(service_workers='block', reduced_motion='reduce')
        response_status = 200

        def intercept(route):
            request = route.request
            target = urlsplit(request.url)
            if (target.scheme, target.hostname, target.port) != ('http', '127.0.0.1', 3100):
                route.abort()
            elif request.method == 'POST':
                results['interceptedPosts'].append(target.path)
                route.fulfill(status=response_status, content_type='text/html', body='Intercepted local QA response')
            elif request.method in ('GET', 'HEAD'):
                route.continue_()
            else:
                route.abort()

        context.route('**/*', intercept)
        page = context.new_page()
        page.on('pageerror', lambda error: results['pageErrors'].append(str(error)))

        def settle_images():
            page.evaluate('document.fonts.ready')
            page.locator('img').evaluate_all("es => es.forEach(e => e.loading = 'eager')")
            for image in page.locator('img').all():
                expect(image).to_have_js_property('complete', True, timeout=30000)
                image.evaluate('''e => Promise.race([e.decode(), new Promise((_, reject) => setTimeout(() => reject(new Error('Image decode timeout')), 15000))])''')
                assert image.evaluate('e => e.naturalWidth > 0')

        for path in ('programs', 'enroll'):
            for width in WIDTHS:
                print(f'Inspecting {path} at {width}', flush=True)
                page.set_viewport_size({'width': width, 'height': 900})
                response = page.goto(BASE + '/' + path, wait_until='networkidle')
                assert response.status == 200
                settle_images()
                page.wait_for_function('document.getAnimations().every(a => a.playState !== "running" && a.playState !== "pending")')
                page.evaluate('window.scrollTo(0, 0)')
                # Hiding carets for a screenshot itself creates short native
                # caret-color transitions. Leave unfocused carets unchanged.
                page.screenshot(path=str(OUT / f'{path}-{width}.png'), full_page=True, caret='initial')
                data = page.evaluate('''() => ({width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
                    h1Count: document.querySelectorAll('main h1').length, animations: document.getAnimations().filter(a => a.playState === 'running' || a.playState === 'pending').length})''')
                assert data['scrollWidth'] == width, (path, data)
                assert data['h1Count'] == 1 and data['animations'] == 0, (path, data)
                if path == 'programs':
                    for card in page.locator('#courses article').all():
                        assert card.locator('.course-description').evaluate('e => getComputedStyle(e).webkitLineClamp') == 'none'
                    assert page.locator('#courses article').count() == 5
                else:
                    fields = page.locator('form :is(input:not([type="hidden"]):not([name="bot-field"]), select, textarea)')
                    assert all(float(size[:-2]) >= 16 for size in fields.evaluate_all('es => es.map(e => getComputedStyle(e).fontSize)'))
                    assert all(height >= 48 for height in fields.evaluate_all('es => es.map(e => e.getBoundingClientRect().height)'))
                results['layouts'].append({'page': path, **data})
        results['checks'].append('Both pages: five widths, decoded images, one H1, complete descriptions, readable controls, no horizontal overflow or reduced-motion animation')

        for course in COURSES:
            page.goto(BASE + '/programs', wait_until='networkidle')
            page.locator('#' + course['id']).get_by_role('link', name='Enroll in this course: ' + course['title'], exact=True).click()
            expect(page).to_have_url(BASE + '/enroll?course=' + course['id'])
            expect(page.locator('select[name="course"]')).to_have_value(course['title'])
        results['checks'].append('All five real Programs CTAs navigate to the correct frozen enrollment slug and preselect its existing submitted label')
        for unresolved in ('bread-making', 'cake-decoration', 'not-a-course'):
            page.goto(BASE + '/enroll?course=' + unresolved, wait_until='networkidle')
            expect(page.locator('select[name="course"]')).to_have_value('')
            assert page.locator('select[name="course"] option').count() == 6
        results['checks'].append('Unresolved/unknown aliases do not silently select or create a course')

        page.set_viewport_size({'width': 390, 'height': 900})
        page.goto(BASE + '/enroll', wait_until='networkidle')
        page.locator('#firstName').focus()
        for expected_id in ('lastName', 'email', 'phone', 'course'):
            page.keyboard.press('Tab')
            expect(page.locator('#' + expected_id)).to_be_focused()
        results['checks'].append('Contact fields and course selector follow logical keyboard order')

        for path in ('programs', 'enroll'):
            page.goto(BASE + '/' + path, wait_until='networkidle')
            page.add_style_tag(content='html { font-size: 200%; }')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), path
        results['checks'].append('Both pages reflow at 200% text size at 390 CSS pixels')

        for state, status in (('error', 500), ('success', 200)):
            response_status = status
            page.goto(BASE + '/enroll?course=wedding-master-class', wait_until='networkidle')
            page.locator('#firstName').fill('Local QA')
            page.locator('#lastName').fill('Test')
            page.locator('#email').fill('local-qa@example.invalid')
            page.locator('#phone').fill('+254700000000')
            page.get_by_role('button', name='Submit Application', exact=True).click()
            target = page.locator('form[name="enroll"]').get_by_role('alert') if state == 'error' else page.get_by_role('heading', name='Application Received', exact=True)
            expect(target).to_be_focused()
            settle_images()
            page.evaluate('document.activeElement.blur(); window.scrollTo(0, 0)')
            page.screenshot(path=str(OUT / f'enroll-{state}-390.png'), full_page=True, caret='initial')
        results['checks'].append('Mocked failure and success render, announce and receive focus; state screenshots captured')
        assert results['interceptedPosts'] == ['/__forms.html', '/__forms.html']
        assert not results['pageErrors'], results['pageErrors']
        browser.close()
    (OUT / 'qa-results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
    print(json.dumps(results, indent=2))


if __name__ == '__main__':
    inspect()
