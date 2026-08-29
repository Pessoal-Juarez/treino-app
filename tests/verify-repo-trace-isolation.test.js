import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { afterEach, expect, test } from 'vitest';

const fixtures = [];
afterEach(async () => { while (fixtures.length) await rm(fixtures.pop(), { recursive: true, force: true }); });

test('trace de enforcement ignora marcadores de outras specs sem perder cobertura da spec avaliada', async () => {
  const root = await mkdtemp(join(tmpdir(), 'specsfy-trace-')); fixtures.push(root);
  const tests = join(root, 'tests');
  await mkdir(tests);
  const spec = join(root, 'spec.md');
  await writeFile(spec, `#### US-001\n- **FR-001**: requisito\n- **NFR-001**: limite\n#### AC-001\n- [x] T001 [TEST] Prova — Refs: US-001, FR-001, NFR-001, AC-001 — Depends: none\n<!-- specsfy:evidence {"task":"T001","refs":["US-001","FR-001","NFR-001","AC-001"],"files":["tests/trace.test.js"],"commands":[{"run":"fixture","exit":0}]} -->\n`);
  await writeFile(join(tests, 'trace.test.js'), `// SPECSFY: US-001 FR-001 NFR-001 AC-001\n// SPECSFY: US-001 FR-001 NFR-001 AC-001\n// SPECSFY: US-001 FR-001 NFR-001 AC-001\n// SPECSFY: US-999\n`);
  const checker = fileURLToPath(new URL('../.agents/skills/specsfy-06-tdd-bdd/scripts/check_traceability.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [checker, spec, root, '--full-chain', '--allow-orphans'], { encoding: 'utf8' });
  expect(result.status, result.stdout + result.stderr).toBe(0);
  expect(result.stdout).toContain('Rastreabilidade: 4/4 IDs cobertos');
});
