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

  // SPECSFY: US-001 FR-001 NFR-001 AC-003
  test(`${file} restores Wake Lock for an active runner and only reacquires it while active`, async () => {
    let requests = 0; let releases = 0;
    const savedState = JSON.stringify({ onboardingSeen: true, onboardingConfigured: true, keepAwakeEnabled: true, profile: {}, sessions: [] });
    const dom = await openApp(file, { savedState, beforeParse(window) {
      const sentinels = [];
      Object.defineProperty(window.navigator, 'wakeLock', { configurable: true, value: { request: async (type) => {
        requests += 1;
        expect(type).toBe('screen');
        const sentinel = new window.EventTarget();
        sentinel.released = false;
        sentinel.release = async () => {
          releases += 1;
          sentinel.released = true;
          sentinel.dispatchEvent(new window.Event('release'));
        };
        sentinels.push(sentinel);
        return sentinel;
      } } });
      window.__wakeLockSentinels = sentinels;
    } });
    const { document, localStorage } = dom.window;
    localStorage.setItem(`${STORAGE_KEY}_imported_workouts`, JSON.stringify([{ id: 'import-teste', label: 'Teste', exercises: [{ id: 'x', name: 'Agachamento', sets: 1, reps: '8', rest: 60, rir: '—', notes: '', video: '#' }] }]));
    dom.window.startWorkoutByKey('import-teste');
    await waitFor(() => requests === 1 && dom.window.eval('wakeLockSentinel !== null'), 'Wake Lock request at workout start');
    const releasedByUserAgent = dom.window.__wakeLockSentinels[0];
    releasedByUserAgent.released = true;
    releasedByUserAgent.dispatchEvent(new dom.window.Event('release'));
    await waitFor(() => dom.window.eval('wakeLockSentinel === null'), 'Wake Lock release event clears its reference');
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new dom.window.Event('visibilitychange'));
    await waitFor(
      () => requests === 2 && dom.window.eval('wakeLockSentinel === window.__wakeLockSentinels[1]'),
      'Wake Lock reacquisition for active runner',
    );
    await dom.window.toggleWakeLock(false); expect(releases).toBe(1);
    dom.window.eval('activeWorkout = null');
    document.dispatchEvent(new dom.window.Event('visibilitychange'));
    await new Promise(resolve => setTimeout(resolve, 10)); expect(requests).toBe(2);
    dom.window.close();
  });

  // SPECSFY: US-001 FR-001 NFR-001 AC-003
  test(`${file} releases every pending Wake Lock acquisition when leaving concurrently`, async () => {
    let requests = 0; let releases = 0;
    const pending = []; const sentinels = [];
    const dom = await openApp(file, { beforeParse(window) {
      Object.defineProperty(window.navigator, 'wakeLock', { configurable: true, value: { request: () => {
        requests += 1;
        return new Promise(resolve => pending.push(() => {
          const sentinel = new window.EventTarget();
          sentinel.released = false;
          sentinel.release = async () => {
            releases += 1;
            sentinel.released = true;
            sentinel.dispatchEvent(new window.Event('release'));
          };
          sentinels.push(sentinel);
          resolve(sentinel);
        }));
      } } });
    } });

    const first = dom.window.toggleWakeLock(true);
    const second = dom.window.toggleWakeLock(true);
    expect(requests).toBeGreaterThan(0);
    await dom.window.toggleWakeLock(false);
    pending.forEach(resolve => resolve());
    await Promise.all([first, second]);
    await waitFor(
      () => sentinels.length === requests && sentinels.every(sentinel => sentinel.released),
      'release of every acquisition that resolved after exit',
    );
    expect(releases).toBe(requests);
    expect(dom.window.eval('wakeLockSentinel')).toBeNull();
    dom.window.close();
  });

  // SPECSFY: US-001 FR-001 NFR-001 AC-003
  test(`${file} resolves concurrent rejected acquisition safely and can retry`, async () => {
    let requests = 0; let releases = 0; let rejectSharedRequest; let retrySentinel;
    const unhandled = [];
    const dom = await openApp(file, { beforeParse(window) {
      Object.defineProperty(window.navigator, 'wakeLock', { configurable: true, value: { request: () => {
        requests += 1;
        if (requests === 1) return new Promise((resolve, reject) => { rejectSharedRequest = reject; });
        retrySentinel = new window.EventTarget();
        retrySentinel.released = false;
        retrySentinel.release = async () => {
          releases += 1;
          retrySentinel.released = true;
          retrySentinel.dispatchEvent(new window.Event('release'));
        };
        return Promise.resolve(retrySentinel);
      } } });
    } });
    dom.window.addEventListener('unhandledrejection', event => {
      unhandled.push(event.reason);
      event.preventDefault();
    });

    const first = dom.window.toggleWakeLock(true);
    const second = dom.window.toggleWakeLock(true);
    rejectSharedRequest(new Error('permission denied'));
    const outcomes = await Promise.allSettled([first, second]);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(outcomes.map(outcome => outcome.status)).toEqual(['fulfilled', 'fulfilled']);
    expect(unhandled).toEqual([]);
    expect(dom.window.eval('wakeLockRequest')).toBeNull();
    await dom.window.toggleWakeLock(true);
    expect(requests).toBe(2);
    expect(dom.window.eval('wakeLockSentinel')).toBe(retrySentinel);
    await dom.window.toggleWakeLock(false);
    expect(releases).toBe(1);
    expect(dom.window.eval('wakeLockSentinel')).toBeNull();
    dom.window.close();
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
