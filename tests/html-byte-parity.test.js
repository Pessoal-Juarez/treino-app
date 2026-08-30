import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

// SPECSFY: US-001 FR-001 NFR-001 AC-001
test('HTML variants are byte-for-byte identical without newline normalization', async () => {
  const [index, standalone] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url)),
    readFile(new URL('../treino_hibrido_juarez_v3_standalone.html', import.meta.url)),
  ]);
  expect(Buffer.compare(index, standalone)).toBe(0);
});
