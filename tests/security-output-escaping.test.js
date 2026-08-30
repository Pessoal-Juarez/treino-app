import { readFile } from 'node:fs/promises';
import { afterEach, expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const storageKey = 'treino_hibrido_juarez_v5';
const windows = [];

function render(state) {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', url: 'http://localhost/',
    beforeParse(window) { window.localStorage.setItem(storageKey, JSON.stringify(state)); }
  });
  windows.push(dom.window);
  return { window: dom.window, document: dom.window.document };
}
afterEach(() => { while (windows.length) windows.pop().close(); });

const session = (overrides = {}) => ({
  id: 'safe-id', date: '2026-08-25', dayKey: 'terca', status: 'Concluído', readiness: 'Verde', durationSeconds: 60,
  exercises: [{ name: 'Leg press', sets: [{ weight: '40', reps: '10' }] }], ...overrides
});

// SPECSFY: US-005 FR-014 NFR-005 AC-025
test('renders persisted history notes as text rather than HTML', () => {
  const payload = '<img data-security-note="1" src=x>';
  const { window, document } = render({ profile: {}, sessions: [session({ notes: payload })] });
  window.renderHistory();
  expect(document.querySelector('[data-security-note="1"]')).toBeNull();
  expect(document.querySelector('#historyListContainer').textContent).toContain(payload);
});

// SPECSFY: US-005 FR-014 NFR-005 AC-026
test('renders persisted profile goals as text rather than HTML', () => {
  const payload = '<svg data-security-profile="1"></svg>';
  const { document } = render({ profile: { goal: payload }, sessions: [] });
  expect(document.querySelector('[data-security-profile="1"]')).toBeNull();
  expect(document.querySelector('#profileSummaryView').textContent).toContain(payload);
});

// SPECSFY: US-005 FR-014 NFR-005 AC-027
test('renders persisted exercise values as text rather than HTML', () => {
  const payload = '<b data-security-exercise="1">x</b>';
  const { window, document } = render({ profile: {}, sessions: [session({ exercises: [{ name: payload, sets: [{ weight: payload, reps: '10' }] }] })] });
  window.renderHistory();
  expect(document.querySelector('[data-security-exercise="1"]')).toBeNull();
  expect(document.querySelector('#historyListContainer').textContent).toContain(payload);
});
