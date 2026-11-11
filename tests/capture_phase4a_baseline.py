"""Read-only baseline capture against the existing loopback preview."""
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

out = Path('artifacts/phase-4a')
out.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(service_workers='block')
    context.route('**/*', lambda route: route.continue_() if urlsplit(route.request.url).hostname == '127.0.0.1' and route.request.method in ('GET', 'HEAD') else route.abort())
    for route in ('faq', 'updates'):
        for width in (390, 1440):
            page = context.new_page()
            page.set_viewport_size({'width': width, 'height': 900})
            page.goto(f'http://127.0.0.1:3100/{route}', wait_until='networkidle')
            page.evaluate('document.fonts.ready')
            page.screenshot(path=str(out / f'before-{route}-{width}.png'), full_page=True)
            page.close()
    browser.close()
