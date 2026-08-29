import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

const variants = ['index.html', 'treino_hibrido_juarez_v3_standalone.html'];
const IMPORTS_KEY = 'treino_hibrido_juarez_v5_imported_workouts';
const protectedStorage = {
  treino_hibrido_juarez_v5: '{"sessions":[{"id":"history-1"}],"profile":{"name":"Juarez"}}',
  treino_hibrido_juarez_v5_history: '[{"id":"legacy-history"}]',
  treino_hibrido_juarez_v5_profile: '{"goal":"força"}',
  treino_hibrido_juarez_v5_equipment: '{"prancha":[{"label":"Colchonete","value":"azul"}]}',
};

// SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-001 AC-002 AC-003
test('PDF import block stays functionally identical in both HTML variants', async () => {
  const [main, standalone] = await Promise.all(variants.map(file => readFile(new URL(`../${file}`, import.meta.url), 'utf8')));
  const extract = html => html.slice(html.indexOf("const IMPORTED_WORKOUTS_KEY"), html.indexOf('/* SERVICE WORKER */'));
  expect(extract(main)).toBe(extract(standalone));
});

async function waitFor(condition, description, timeoutMs = 1000) {
  const deadline = Date.now() + timeoutMs;
  while (!condition()) {
    if (Date.now() >= deadline) throw new Error(`Timed out waiting for ${description}`);
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

function createTextPdf(text) {
  return {
    GlobalWorkerOptions: {},
    getDocument() {
      return {
        promise: Promise.resolve({
          numPages: 2,
          getPage: async page => ({
            getTextContent: async () => ({ items: [{ str: page === 1 ? text.split('\n')[0] : text.split('\n').slice(1).join(' ') }] }),
          }),
        }),
      };
    },
  };
}

for (const file of variants) {
  const app = async () => new JSDOM(
    await readFile(new URL(`../${file}`, import.meta.url), 'utf8'),
    { runScripts: 'dangerously', url: 'http://localhost/' },
  );

  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-001
  test(`${file} extracts every PDF page locally into the existing preview input`, async () => {
    const dom = await app();
    const { document } = dom.window;
    dom.window.pdfjsLib = createTextPdf('Dia: PDF\nExercício: Remada');
    dom.window.openWorkoutImport();
    const input = document.querySelector('[data-import-pdf]');
    expect(input).not.toBeNull();
    expect(input.accept).toContain('.pdf');
    Object.defineProperty(input, 'files', { value: [new dom.window.File(['%PDF-local'], 'treino.pdf', { type: 'application/pdf' })] });
    input.dispatchEvent(new dom.window.Event('change'));
    await waitFor(() => document.querySelector('[data-import-text]').value.includes('Exercício: Remada'), 'local PDF text extraction');
    document.querySelector('[data-import-preview]').click();
    expect(document.querySelector('[data-import-result]').textContent).toContain('PDF');
    expect(document.querySelector('[data-import-text]').value).toContain('Dia: PDF');
    dom.window.close();
  });

  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-002
  test(`${file} confirms PDF preview additively and preserves four protected storage values byte-for-byte`, async () => {
    const dom = await app();
    const { document, localStorage } = dom.window;
    for (const [key, value] of Object.entries(protectedStorage)) localStorage.setItem(key, value);
    const before = Object.fromEntries(Object.keys(protectedStorage).map(key => [key, localStorage.getItem(key)]));
    dom.window.pdfjsLib = createTextPdf('Dia: PDF\nExercício: Remada');
    dom.window.openWorkoutImport();
    const input = document.querySelector('[data-import-pdf]');
    Object.defineProperty(input, 'files', { value: [new dom.window.File(['%PDF-local'], 'treino.pdf', { type: 'application/pdf' })] });
    input.dispatchEvent(new dom.window.Event('change'));
    await waitFor(() => document.querySelector('[data-import-text]').value.includes('Remada'), 'PDF preview text');
    document.querySelector('[data-import-preview]').click();
    document.querySelector('[data-import-confirm]').click();
    expect(JSON.parse(localStorage.getItem(IMPORTS_KEY))).toHaveLength(1);
    expect(Object.fromEntries(Object.keys(protectedStorage).map(key => [key, localStorage.getItem(key)]))).toEqual(before);
    dom.window.close();
  });

  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-003
  test(`${file} reports unreadable or textless PDF locally without a write`, async () => {
    const dom = await app();
    const { document, localStorage } = dom.window;
    dom.window.pdfjsLib = { getDocument: () => ({ promise: Promise.reject(new Error('encrypted')) }) };
    dom.window.openWorkoutImport();
    const input = document.querySelector('[data-import-pdf]');
    Object.defineProperty(input, 'files', { value: [new dom.window.File(['%PDF-local'], 'segredo.pdf', { type: 'application/pdf' })] });
    input.dispatchEvent(new dom.window.Event('change'));
    const error = document.querySelector('[data-import-pdf-error]');
    await waitFor(() => error.textContent.length > 0, 'local PDF error');
    expect(error.textContent).toMatch(/PDF|texto|ler/i);
    expect(localStorage.getItem(IMPORTS_KEY)).toBeNull();
    dom.window.close();
  });

  // SPECSFY: US-001 FR-001 FR-003 NFR-001 AC-003
  test(`${file} rejects a PDF without a textual layer without persistence`, async () => {
    const dom = await app();
    const { document, localStorage } = dom.window;
    dom.window.pdfjsLib = {
      getDocument: () => ({
        promise: Promise.resolve({
          numPages: 1,
          getPage: async () => ({ getTextContent: async () => ({ items: [] }) }),
        }),
      }),
    };
    dom.window.openWorkoutImport();
    const input = document.querySelector('[data-import-pdf]');
    Object.defineProperty(input, 'files', { value: [new dom.window.File(['%PDF-local'], 'escaneado.pdf', { type: 'application/pdf' })] });
    input.dispatchEvent(new dom.window.Event('change'));
    const error = document.querySelector('[data-import-pdf-error]');
    await waitFor(() => error.textContent.length > 0, 'textless PDF error');
    expect(error.textContent).toMatch(/PDF|texto|ler/i);
    expect(localStorage.getItem(IMPORTS_KEY)).toBeNull();
    dom.window.close();
  });

  // SPECSFY: US-001 FR-001 NFR-001 AC-001
  test(`${file} references no CDN or remote parser at runtime`, async () => {
    const html = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    expect(html).not.toMatch(/https?:\/\/(?:cdn|unpkg|cdnjs|jsdelivr)\./i);
    expect(html).toContain('vendor/pdfjs-dist-5.4.54');
    expect(html).not.toContain('node_modules/pdfjs-dist');
  });
}
