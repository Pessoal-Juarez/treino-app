import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

const PDF_MODULE = './vendor/pdfjs-dist-5.4.54/pdf.min.mjs';
const PDF_WORKER = './vendor/pdfjs-dist-5.4.54/pdf.worker.min.mjs';

// SPECSFY: US-001 FR-001 NFR-001 AC-004
test('service worker precaches both local PDF modules and serves them from a cold offline cache', async () => {
  const source = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  expect(source).toContain(PDF_MODULE);
  expect(source).toContain(PDF_WORKER);

  const handlers = {}; const cached = new Map(); let installed;
  const cache = { addAll: async assets => { assets.forEach(asset => cached.set(asset, { asset })); }, put: async () => {} };
  const caches = { open: async () => cache, keys: async () => [], delete: async () => true, match: async request => cached.get(new URL(request.url).pathname.replace(/^\//, './')) || cached.get('./index.html') };
  const self = { addEventListener: (type, handler) => { handlers[type] = handler; }, skipWaiting: () => {}, clients: { claim: async () => {} } };
  new Function('self', 'caches', 'fetch', source)(self, caches, async () => { throw new Error('offline'); });
  handlers.install({ waitUntil: promise => { installed = promise; } }); await installed;
  for (const asset of [PDF_MODULE, PDF_WORKER]) {
    let response; handlers.fetch({ request: { method: 'GET', url: `https://local.test/${asset.slice(2)}` }, respondWith: promise => { response = promise; } });
    expect(await response).toEqual({ asset });
  }
});
