import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

const STORAGE_KEY = 'treino_hibrido_juarez_v5';
const variants = ['index.html', 'treino_hibrido_juarez_v3_standalone.html'];

async function waitFor(condition, description, timeoutMs = 1000) {
  const deadline = Date.now() + timeoutMs;
  while (!condition()) {
    if (Date.now() >= deadline) throw new Error(`Timed out waiting for ${description}`);
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

async function openApp(file, { savedState, beforeParse } = {}) {
  const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
  return new JSDOM(source, {
    runScripts: 'dangerously',
    url: 'http://localhost/',
    beforeParse(window) {
      if (savedState !== undefined) window.localStorage.setItem(STORAGE_KEY, savedState);
      beforeParse?.(window);
    },
  });
}

async function changeCheckbox(dom, checked) {
  const toggle = dom.window.document.querySelector('#keepAwakeToggle');
  expect(toggle).not.toBeNull();
  toggle.checked = checked;
  toggle.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  return toggle;
}

function storedPreference(localStorage) {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw).keepAwakeEnabled : undefined;
}

function seedProtectedState(dom) {
  const state = dom.window.eval('JSON.parse(JSON.stringify(state))');
  state.sessions = [{ id: 'session-protected', completedAt: '2026-08-29T12:00:00.000Z' }];
  state.profile = { ...state.profile, name: 'Perfil protegido' };
  state.alertPreferences = { presetId: 'pulse-high', volume: 0.7, vibrationLevelId: 'vibration-long' };
  dom.window.eval(`state = ${JSON.stringify(state)}; persist();`);
  return JSON.parse(dom.window.localStorage.getItem(STORAGE_KEY));
}

for (const file of variants) {
  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-001
  test(`${file} persists the real keep-awake checkbox through the canonical state`, async () => {
    const dom = await openApp(file);
    const { localStorage } = dom.window;
    const control = dom.window.document.querySelector('#keepAwakeToggle');
    expect(control.style.minWidth).toBe('44px');
    expect(control.style.minHeight).toBe('44px');
    const before = seedProtectedState(dom);
    const equipment = JSON.stringify({ 'ex-protected': [{ label: 'Banco', value: 'Inclinado' }] });
    const importedWorkouts = JSON.stringify([{ id: 'import-protected', label: 'Domingo' }]);
    localStorage.setItem(`${STORAGE_KEY}_equipment`, equipment);
    localStorage.setItem(`${STORAGE_KEY}_imported_workouts`, importedWorkouts);
    const toggle = await changeCheckbox(dom, true);

    await waitFor(() => storedPreference(localStorage) === true, 'canonical preference persistence');
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(toggle.checked).toBe(true);
    expect(stored.keepAwakeEnabled).toBe(true);
    const { keepAwakeEnabled, ...restoredFields } = stored;
    const { keepAwakeEnabled: previousKeepAwakeEnabled, ...protectedFields } = before;
    expect(keepAwakeEnabled).toBe(true);
    expect(previousKeepAwakeEnabled).toBe(false);
    expect(restoredFields).toEqual(protectedFields);
    expect(localStorage.getItem(`${STORAGE_KEY}_equipment`)).toBe(equipment);
    expect(localStorage.getItem(`${STORAGE_KEY}_imported_workouts`)).toBe(importedWorkouts);
    expect(localStorage.getItem(`${STORAGE_KEY}_keep_awake`)).toBeNull();
    dom.window.close();
  });

  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-002
  test(`${file} restores both checked and unchecked preference after a fresh window`, async () => {
    const first = await openApp(file);
    await changeCheckbox(first, true);
    await waitFor(() => first.window.localStorage.getItem(STORAGE_KEY) !== null, 'checked preference persistence');
    const checkedState = first.window.localStorage.getItem(STORAGE_KEY);
    first.window.close();

    const restored = await openApp(file, { savedState: checkedState });
    expect(restored.window.document.querySelector('#keepAwakeToggle').checked).toBe(true);
    await changeCheckbox(restored, false);
    await waitFor(
      () => storedPreference(restored.window.localStorage) === false,
      'unchecked preference persistence',
    );
    const uncheckedState = restored.window.localStorage.getItem(STORAGE_KEY);
    restored.window.close();

    const reopened = await openApp(file, { savedState: uncheckedState });
    expect(reopened.window.document.querySelector('#keepAwakeToggle').checked).toBe(false);
    reopened.window.close();
  });

  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-003
  test(`${file} keeps the preference and UI usable without or after rejected Wake Lock`, async () => {
    const unsupported = await openApp(file);
    const unsupportedToggle = await changeCheckbox(unsupported, true);
    await waitFor(
      () => storedPreference(unsupported.window.localStorage) === true,
      'persistence without Wake Lock support',
    );
    expect(unsupportedToggle.checked).toBe(true);
    unsupported.window.close();

    let releaseCalls = 0;
    let requestCalls = 0;
    const releasable = await openApp(file, {
      beforeParse(window) {
        Object.defineProperty(window.navigator, 'wakeLock', {
          configurable: true,
          value: { request: async () => {
            requestCalls += 1;
            return { release: async () => { releaseCalls += 1; } };
          } },
        });
      },
    });
    await changeCheckbox(releasable, true);
    await waitFor(
      () => storedPreference(releasable.window.localStorage) === true,
      'persistence with a Wake Lock sentinel',
    );
    await waitFor(() => requestCalls === 1, 'Wake Lock sentinel request');
    await changeCheckbox(releasable, false);
    await waitFor(() => releaseCalls === 1, 'Wake Lock release after unchecking');
    expect(storedPreference(releasable.window.localStorage)).toBe(false);
    releasable.window.close();

    const rejected = await openApp(file, {
      beforeParse(window) {
        Object.defineProperty(window.navigator, 'wakeLock', {
          configurable: true,
          value: { request: async () => { throw new Error('permission denied'); } },
        });
      },
    });
    const rejectedToggle = await changeCheckbox(rejected, true);
    await waitFor(
      () => storedPreference(rejected.window.localStorage) === true,
      'persistence after Wake Lock rejection',
    );
    expect(rejectedToggle.checked).toBe(true);
    expect(rejected.window.document.querySelector('#keepAwakeToggle')).not.toBeNull();
    rejected.window.close();
  });
}

test('keep-awake material contract is equivalent in both HTML variants', async () => {
  const sources = await Promise.all(variants.map(file => readFile(new URL(`../${file}`, import.meta.url), 'utf8')));
  const material = sources.map(source => {
    const checkbox = source.match(/<input type="checkbox" id="keepAwakeToggle"[\s\S]*?>/);
    const wakeLock = source.match(/async function toggleWakeLock\(enabled\) \{[\s\S]*?\n\}/);
    expect(checkbox).not.toBeNull();
    expect(wakeLock).not.toBeNull();
    return `${checkbox[0]}\n${wakeLock[0]}`;
  });
  expect(material[0]).toBe(material[1]);
});
