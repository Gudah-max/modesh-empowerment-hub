"""Run bounded local checks and save their complete output as review evidence."""
from pathlib import Path
import shutil
import socket
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts/phase-4a'
OUT.mkdir(parents=True, exist_ok=True)
mode = sys.argv[1]
if mode == 'build':
    # The fixture compiler's generated bundle is evidence, not lintable source.
    # Remove only its verified local output after the preview has been stopped.
    with socket.socket() as check:
        if check.connect_ex(('127.0.0.1', 3101)) == 0:
            raise RuntimeError('Stop the local CMS fixture preview before final build checks.')
    generated = (OUT / 'fixture-next').resolve()
    assert generated.parent == OUT.resolve() and generated.name == 'fixture-next'
    if generated.exists():
        shutil.rmtree(generated)
    next_env = ROOT / 'next-env.d.ts'
    baseline = subprocess.check_output(['git', 'show', 'HEAD:next-env.d.ts'], cwd=ROOT)
    current = next_env.read_bytes()
    if current != baseline:
        restored = current.replace(b'./artifacts/phase-4a/fixture-next/types/routes.d.ts', b'./.next/types/routes.d.ts')
        assert restored.replace(b'\r\n', b'\n') == baseline.replace(b'\r\n', b'\n'), 'Unexpected next-env change; preserve it for review'
        next_env.write_bytes(baseline)
groups = {
    'build': [('lint', [shutil.which('npm.cmd'), 'run', 'lint']), ('typecheck', [shutil.which('npm.cmd'), 'run', 'typecheck']), ('build', [shutil.which('npm.cmd'), 'run', 'build'])],
    'unit': [('unit', [shutil.which('node'), '--experimental-strip-types', '--test', 'tests/course-content.test.mjs', 'tests/institutional-content.test.mjs', 'tests/updates-seo.test.mjs', 'tests/option-b-homepage.test.mjs'])],
    'browser': [(name, [sys.executable, '-B', script, '--base-url', 'http://127.0.0.1:3100', '-v']) for name, script in [('forms', 'tests/test_forms.py'), ('phase3b', 'tests/test_programs_enrollment.py'), ('phase3c', 'tests/test_institutional.py'), ('faq-updates', 'tests/test_faq_updates.py'), ('accessibility-reflow', 'tests/test_accessibility_reflow.py')]],
    'states': [('cms-states', [sys.executable, '-B', 'tests/test_updates_states.py', '-v'])],
    'inspect': [('browser-inspection', [sys.executable, '-B', 'tests/inspect_phase4a.py'])],
    'review': [('code-review', [shutil.which('codex'), 'review', '--uncommitted'])],
}
groups['browser'].append(('header-accessibility', [sys.executable, '-B', 'tests/test_header_accessibility.py', '--base-url', 'http://127.0.0.1:3100', '-v']))
groups['browser'].append(('home-reflow', [sys.executable, '-B', 'tests/test_home_reflow.py', '--base-url', 'http://127.0.0.1:3100', '-v']))
for name, command in groups[mode]:
    if name == 'code-review' and (OUT / 'code-review.log').exists():
        name = 'code-review-retry'
    print(f'Running {name}', flush=True)
    with (OUT / f'{name}.log').open('w', encoding='utf-8') as log:
        result = subprocess.run(command, cwd=ROOT, stdout=log, stderr=subprocess.STDOUT, text=True)
    lines = (OUT / f'{name}.log').read_text(encoding='utf-8', errors='replace').splitlines()
    print('\n'.join(lines[-18:]), flush=True)
    print(f'{name}: exit {result.returncode}', flush=True)
    if result.returncode:
        sys.exit(result.returncode)
