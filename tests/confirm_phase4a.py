"""Bounded confirmation captures; only the local Next development toolbox is hidden."""
from pathlib import Path
import json
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect

OUT = Path(__file__).resolve().parents[1] / 'artifacts/phase-4a'
errors, console_messages = [], []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for state, route, heading in [
        ('populated', 'updates', 'Updates & Opportunities'),
        ('populated', 'updates/article', 'Local QA fixture: article detail'),
        ('populated', 'updates/opportunity', 'Local QA fixture: opportunity detail'),
        ('empty', 'updates', 'Updates & Opportunities'),
        ('error', 'updates', 'Updates & Opportunities'),
        ('error', 'updates/article', 'Updates are temporarily unavailable'),
        ('populated', 'updates/unknown', 'This update isn’t available'),
    ]:
        (OUT / 'cms-state.json').write_text(json.dumps({'mode': state}), encoding='utf-8')
        for width in (390, 1440):
            context = browser.new_context(service_workers='block', reduced_motion='reduce', extra_http_headers={'Cache-Control': 'no-cache'})
            context.route('**/*', lambda r: r.continue_() if urlsplit(r.request.url).hostname == '127.0.0.1' and r.request.method in ('GET', 'HEAD') else r.abort())
            page = context.new_page()
            page.set_viewport_size({'width': width, 'height': 900})
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('console', lambda m: console_messages.append({'type': m.type, 'text': m.text}) if m.type in ('warning', 'error') else None)
            page.goto('http://127.0.0.1:3101/' + route, wait_until='networkidle', timeout=90000)
            expect(page.get_by_role('heading', level=1, name=heading, exact=True)).to_be_visible(timeout=20000)
            expect(page.get_by_text('Loading updates…', exact=True)).not_to_be_visible()
            page.evaluate('document.fonts.ready')
            for image in page.locator('img').all():
                image.evaluate('e=>e.decode()')
            if state == 'populated' and route == 'updates':
                control = page.get_by_role('button', name='Training', exact=True)
                control.focus()
                focus = control.evaluate('e=>({style:getComputedStyle(e).outlineStyle,width:getComputedStyle(e).outlineWidth,top:e.getBoundingClientRect().top,height:e.getBoundingClientRect().height})')
                assert focus['style'] == 'solid' and float(focus['width'][:-2]) >= 2 and focus['height'] >= 48
                assert focus['top'] >= 88
                page.keyboard.press('Enter')
                expect(page.get_by_role('status')).to_have_text('1 update · Training')
                page.get_by_role('button', name='All Updates', exact=True).click()
                expect(page.locator('.update-card')).to_have_count(2)
            # Dev diagnostics stay recorded; the framework-only toolbar is not
            # part of the production product and is hidden solely for capture.
            page.add_style_tag(content='nextjs-portal { display: none !important; }')
            page.evaluate('document.activeElement.blur(); window.scrollTo(0,0)')
            page.screenshot(path=str(OUT / f'mock-{state}-{route.replace("/", "-")}-{width}.png'), full_page=True)
            assert page.evaluate('document.documentElement.scrollWidth === innerWidth')
            context.close()
    browser.close()
assert not errors, errors
(OUT / 'confirmation.json').write_text(json.dumps({'pageErrors': errors, 'consoleDiagnostics': console_messages, 'captures': 14, 'keyboardFilterFocus': 'passed', 'devToolboxHiddenOnlyForCapture': True}, indent=2), encoding='utf-8')
print('PASS: 14 final CMS captures, expected headings, visible keyboard filter focus, 48px controls and no page errors')
