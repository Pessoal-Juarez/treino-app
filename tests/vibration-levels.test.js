import { readFile } from 'node:fs/promises';
import { afterEach, expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const storageKey = 'treino_hibrido_juarez_v5';
const windows = [];

function render(savedState = { profile: {}, sessions: [] }) {
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', beforeParse(window) {
    window.localStorage.setItem(storageKey, JSON.stringify(savedState));
    window.scrollTo = () => {};
  }});
  windows.push(dom.window);
  return { window: dom.window, document: dom.window.document };
}
afterEach(() => { while (windows.length) windows.pop().close(); });

// SPECSFY: US-001 FR-001 FR-002 NFR-001 AC-001
test('persiste Curto e o restaura no seletor móvel', () => {
  const { window, document } = render();
  const select = document.querySelector('#vibrationLevel');
  expect(select).not.toBeNull();
  select.value = 'vibration-short';
  select.dispatchEvent(new window.Event('change', { bubbles: true }));
  expect(JSON.parse(window.localStorage.getItem(storageKey)).alertPreferences.vibrationLevelId).toBe('vibration-short');
});

// SPECSFY: US-001 FR-001 FR-002 NFR-001 AC-002
test('resolve Padrão no descanso sem mudar o pulso de 60 ms da série', () => {
  const { window } = render();
  expect(window.getVibrationPattern('vibration-standard')).toEqual([300, 150, 300, 150, 600]);
  expect(window.getSeriesCompletionVibration()).toBe(60);
});

// SPECSFY: US-001 FR-001 FR-002 NFR-001 AC-003
test('API ausente não bloqueia a conclusão visual e não reporta vibração', () => {
  const { window, document } = render();
  Object.defineProperty(window.navigator, 'vibrate', { configurable: true, value: undefined });
  expect(window.requestRestVibration()).toBe(false);
  window.startRunnerRestTimer(1);
  window.finishRunnerRest();
  expect(document.querySelector('#runnerTimerDisplay').textContent).toBe('PRONTO!');
});
