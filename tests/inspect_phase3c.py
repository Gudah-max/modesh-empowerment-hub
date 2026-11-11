"""Read-only Phase 3C layout evidence; all writes and external traffic are blocked."""
import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect

BASE = 'http://127.0.0.1:3100'
OUT = Path(__file__).resolve().parents[1] / 'artifacts' / 'phase-3c'
WIDTHS = (320, 390, 768, 1024, 1440)


def inspect():
    OUT.mkdir(parents=True, exist_ok=True)
    result = {'layouts': [], 'checks': [], 'pageErrors': [], 'interceptedPosts': []}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(service_workers='block', reduced_motion='reduce')
        response_status = 200

        def intercept(route):
            target = urlsplit(route.request.url)
            if (target.scheme, target.hostname, target.port) != ('http', '127.0.0.1', 3100):
                route.abort()
            elif route.request.method == 'POST':
                result['interceptedPosts'].append(target.path)
                route.fulfill(status=response_status, content_type='text/html', body='Intercepted local QA')
            elif route.request.method in ('GET', 'HEAD'):
                route.continue_()
            else:
                route.abort()

        context.route('**/*', intercept)
        page = context.new_page()
        page.on('pageerror', lambda error: result['pageErrors'].append(str(error)))
        pending=set()
        page.on('request',lambda request:pending.add(request.url))
        page.on('requestfinished',lambda request:pending.discard(request.url))
        page.on('requestfailed',lambda request:pending.discard(request.url))

        def fresh_page(width, height=900):
            nonlocal page
            page.close()
            pending.clear()
            page = context.new_page()
            page.on('pageerror', lambda error: result['pageErrors'].append(str(error)))
            page.on('request', lambda request: pending.add(request.url))
            page.on('requestfinished', lambda request: pending.discard(request.url))
            page.on('requestfailed', lambda request: pending.discard(request.url))
            page.set_viewport_size({'width':width,'height':height})

        def images_ready():
            page.evaluate('document.fonts.ready')
            page.locator('img').evaluate_all('es => es.forEach(e => e.loading = "eager")')
            for image in page.locator('img').all():
                expect(image).to_have_js_property('complete', True, timeout=30000)
                image.evaluate('e => e.decode()')
                assert image.evaluate('e => e.naturalWidth > 0')

        for route in ('about', 'team', 'gallery', 'contact'):
            for width in WIDTHS:
                print(f'Inspecting {route} at {width}', flush=True)
                fresh_page(width)
                try:
                    response = page.goto(BASE + '/' + route, wait_until='networkidle')
                except Exception:
                    print('Pending navigation requests:', sorted(pending), flush=True)
                    raise
                assert response.status == 200
                images_ready()
                page.wait_for_function('document.getAnimations().every(a => a.playState !== "running" && a.playState !== "pending")')
                page.evaluate('window.scrollTo(0, 0)')
                page.screenshot(path=str(OUT / f'{route}-{width}.png'), full_page=True, caret='initial')
                if route == 'gallery':
                    page.screenshot(path=str(OUT / f'gallery-top-{width}.png'), caret='initial')
                    assert page.locator('.gallery-grid button').count() == 33
                    assert all(page.locator('.gallery-grid img').evaluate_all('es => es.map(e => Math.abs(e.getBoundingClientRect().width / e.getBoundingClientRect().height - e.naturalWidth / e.naturalHeight) < .01)'))
                    for control in page.locator('.gallery-filters button').all():
                        assert control.bounding_box()['height'] >= 48
                elif route == 'contact':
                    fields = page.locator('form :is(input:not([type="hidden"]):not([name="bot-field"]), select, textarea)')
                    assert all(float(value[:-2]) >= 16 for value in fields.evaluate_all('es=>es.map(e=>getComputedStyle(e).fontSize)'))
                    assert all(value >= 48 for value in fields.evaluate_all('es=>es.map(e=>e.getBoundingClientRect().height)'))
                    fallback = page.get_by_role('link', name='Open Manyatta in Google Maps', exact=True)
                    expect(fallback).to_be_visible()
                    expect(fallback).to_have_attribute('href', 'https://maps.google.com/maps?q=Manyatta,+Kisumu,+Kenya')
                    assert fallback.bounding_box()['height'] >= 48
                    expect(page.locator('iframe')).to_have_attribute('src', 'https://maps.google.com/maps?q=Manyatta,+Kisumu,+Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed')
                    expect(page.locator('.contact-details address')).to_contain_text('3185(40100) Kisumu-Kenya')
                    for value in ('Monday - Friday', '8:00 AM - 5:00 PM', 'Saturday', '9:00 AM - 1:00 PM'):
                        expect(page.locator('main').get_by_text(value, exact=True)).to_be_visible()
                dimensions = page.evaluate('''() => ({viewport:innerWidth, scrollWidth:document.documentElement.scrollWidth,
                    h1:document.querySelectorAll('main h1').length, images:document.images.length,
                    animations:document.getAnimations().filter(a=>a.playState==='running'||a.playState==='pending').length})''')
                assert dimensions['scrollWidth'] == width, (route, dimensions)
                assert dimensions['h1'] == 1 and dimensions['animations'] == 0, (route, dimensions)
                result['layouts'].append({'route':route, **dimensions})
        result['checks'].append('All 20 route/width combinations: decoded local optimized images, one H1, no horizontal overflow or active reduced-motion animation')
        result['checks'].append('Contact: original address/hours/map query, 16px input text and 48px minimum fields; gallery: 33 original images and 48px filters')

        links = set()
        for route in ('about', 'team', 'gallery', 'contact'):
            page.goto(BASE + '/' + route, wait_until='networkidle')
            links.update(page.locator('main a[href^="/"]').evaluate_all('es=>es.map(e=>e.getAttribute("href"))'))
        for href in sorted(links):
            assert page.goto(BASE + href, wait_until='networkidle').status == 200, href
        result['checks'].append('All internal CTA destinations from the four pages return 200: ' + ', '.join(sorted(links)))

        fresh_page(390)
        page.goto(BASE + '/contact', wait_until='networkidle')
        page.locator('#firstName').focus()
        for field_id in ('lastName', 'email', 'inquiryType', 'message'):
            page.keyboard.press('Tab')
            expect(page.locator('#' + field_id)).to_be_focused()
        result['checks'].append('Contact keyboard order follows first name, last name, email, inquiry type, message')
        for route in ('about','team','gallery','contact'):
            page.goto(BASE + '/' + route, wait_until='networkidle')
            page.add_style_tag(content='html { font-size:200%; }')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), route
        result['checks'].append('All four pages reflow at 200% text size at 390 CSS pixels')

        for width in (390, 1440):
            fresh_page(width)
            page.goto(BASE + '/gallery', wait_until='networkidle')
            opener = page.locator('.gallery-grid button').first
            opener.click()
            viewer = page.get_by_role('dialog', name='Image viewer', exact=True)
            expect(viewer).to_be_visible()
            images_ready()
            page.screenshot(path=str(OUT/f'gallery-lightbox-{width}.png'),caret='initial')
            page.keyboard.press('Escape')
            expect(opener).to_be_focused()
        fresh_page(390, 320)
        page.goto(BASE + '/gallery', wait_until='networkidle')
        page.locator('.gallery-grid button').first.click()
        viewer = page.get_by_role('dialog',name='Image viewer',exact=True)
        for control in viewer.get_by_role('button').all():
            box=control.bounding_box()
            assert box['height']>=48 and box['x']>=0 and box['y']>=0 and box['y']+box['height']<=320
        page.keyboard.press('Escape')
        result['checks'].append('Gallery modal desktop/mobile captures, opener restoration, and controls fitting a 390x320 landscape viewport')

        fresh_page(390)
        for state,status in (('error',500),('success',200)):
            response_status=status
            page.goto(BASE+'/contact',wait_until='networkidle')
            for field,value in [('firstName','Local QA'),('lastName','Test'),('email','local-qa@example.invalid'),('message','Intercepted local QA only')]:
                page.locator('[name="'+field+'"]').fill(value)
            page.get_by_role('button',name='Send Message',exact=True).click()
            target=page.locator('form').get_by_role('alert') if state=='error' else page.get_by_role('heading',name='Message Sent',exact=True)
            expect(target).to_be_focused()
            images_ready()
            page.evaluate('document.activeElement.blur();window.scrollTo(0,0)')
            page.screenshot(path=str(OUT/f'contact-{state}-390.png'),full_page=True,caret='initial')
        assert result['interceptedPosts']==['/__forms.html','/__forms.html']
        assert not result['pageErrors'],result['pageErrors']
        result['checks'].append('Contact error/success captures use intercepted POSTs only; focus reaches each state; no uncaught page errors')
        browser.close()
    (OUT/'qa-results.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result,indent=2))

if __name__=='__main__':
    inspect()
