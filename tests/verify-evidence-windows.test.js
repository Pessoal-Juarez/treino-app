import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { afterEach, expect, test } from 'vitest';

const fixtures = [];
afterEach(async () => { while (fixtures.length) await rm(fixtures.pop(), { recursive: true, force: true }); });

// SPECSFY: FR-014 NFR-005 AC-025
test('accepts a safe material evidence file under a Windows root', async () => {
  const root = await mkdtemp(join(tmpdir(), 'specsfy-evidence-')); fixtures.push(root);
  await writeFile(join(root, 'artifact.txt'), 'ok');
  const spec = join(root, 'spec.md');
  await writeFile(spec, `| Evidence Contract | 1 |\n#### AC-025\n- [x] T900 [CODE] Fixture — Refs: AC-025 — Depends: none\n<!-- specsfy:evidence {"task":"T900","refs":["AC-025"],"files":["artifact.txt"],"commands":[{"run":"fixture","exit":0}]} -->\n`);
  const verifier = fileURLToPath(new URL('../.agents/skills/specsfy-07-implement/scripts/verify_evidence.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [verifier, spec, root, '--task', 'T900'], { encoding: 'utf8' });
  expect(result.status, result.stdout + result.stderr).toBe(0);
});
