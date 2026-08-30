import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

const STORAGE_KEY = 'treino_hibrido_juarez_v5';
const variants = ['index.html', 'treino_hibrido_juarez_v3_standalone.html'];

async function openApp(file, savedState) {
  const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
  return new JSDOM(source, {
    runScripts: 'dangerously',
    url: 'http://localhost/',
    beforeParse(window) {
      window.scrollTo = () => {};
      if (savedState) window.localStorage.setItem(STORAGE_KEY, savedState);
    },
  });
}

for (const file of variants) {
  // SPECSFY: US-001 US-002 FR-001 FR-002 FR-003 NFR-001 NFR-002 NFR-003 AC-001
  test(`${file} offers first-use feedback only after the first completed session is saved`, async () => {
    const dom = await openApp(file);
    const { window } = dom;
    window.eval(`activeWorkout = {
      dayKey: 'superior-a',
      elapsedSeconds: 60,
      exerciseData: [{ name: 'Supino', sets: [{ weight: '10', reps: '8' }] }]
    }`);

    const sessionsBefore = window.eval('state.sessions.length');
    expect(window.document.querySelector('[data-first-use-feedback-overlay]')).toBeNull();
    window.saveActiveWorkoutSession();

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).sessions).toHaveLength(sessionsBefore + 1);
    const feedback = window.document.querySelector('[data-first-use-feedback-overlay]');
    expect(feedback).not.toBeNull();
    expect(feedback.hidden).toBe(false);
    dom.window.close();
  });

  // SPECSFY: US-001 US-002 FR-001 FR-002 FR-003 NFR-001 NFR-002 NFR-003 AC-002
  test(`${file} stores exactly three local first-use feedback choices without personal data`, async () => {
    const dom = await openApp(file);
    const { window, document } = dom.window;
    window.eval(`activeWorkout = {
      dayKey: 'superior-a', elapsedSeconds: 60,
      exerciseData: [{ name: 'Supino', sets: [{ weight: '10', reps: '8' }] }]
    }`);
    window.saveActiveWorkoutSession();

    expect(document.querySelector('[data-first-use-feedback-overlay]')).not.toBeNull();
    document.querySelector('[data-feedback-answer="iniciar"][data-feedback-value="Fácil"]').click();
    document.querySelector('[data-feedback-answer="series-descanso"][data-feedback-value="Mais ou menos"]').click();
    document.querySelector('[data-feedback-answer="fluxo-geral"][data-feedback-value="Difícil"]').click();
    document.querySelector('[data-feedback-submit]').click();

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)).firstUseFeedback;
    expect(stored.answers).toEqual({ iniciar: 'Fácil', seriesDescanso: 'Mais ou menos', fluxoGeral: 'Difícil' });
    expect(JSON.stringify(stored)).not.toMatch(/nome|coment|nota/i);
    expect(window.fetch).toBeUndefined();
    dom.window.close();
  });

  // SPECSFY: US-001 US-002 FR-001 FR-002 FR-003 NFR-001 NFR-002 NFR-003 AC-003
  test(`${file} reopens skipped feedback only from Settings and never saves a partial answer`, async () => {
    const dom = await openApp(file);
    const { window, document } = dom.window;
    const before = window.eval('JSON.stringify(state)');

    const openFeedback = document.querySelector('[data-first-use-feedback-open]');
    expect(openFeedback).not.toBeNull();
    openFeedback.click();
    expect(document.querySelector('[data-first-use-feedback-overlay]').hidden).toBe(false);
    document.querySelector('[data-feedback-close]').click();

    expect(window.eval('JSON.stringify(state)')).toBe(before);
    expect(document.querySelector('[data-first-use-feedback-overlay]').hidden).toBe(true);
    dom.window.close();
  });

  // SPECSFY: US-001 US-002 FR-001 FR-002 FR-003 NFR-001 NFR-002 NFR-003 AC-004
  test(`${file} shows only complete feedback and deletes it without touching protected state`, async () => {
    const dom = await openApp(file);
    const { window, document } = dom.window;
    window.eval(`state.firstUseFeedback = {
      invited: true,
      answers: { iniciar: 'Fácil', seriesDescanso: 'Mais ou menos', fluxoGeral: 'Difícil' }
    }; persist();`);
    const protectedState = window.eval(`JSON.stringify({ profile: state.profile, sessions: state.sessions, alertPreferences: state.alertPreferences, keepAwakeEnabled: state.keepAwakeEnabled })`);

    const openFeedback = document.querySelector('[data-first-use-feedback-open]');
    expect(openFeedback).not.toBeNull();
    openFeedback.click();
    expect(document.querySelector('[data-first-use-feedback-summary]').textContent).toContain('Fácil');
    document.querySelector('[data-first-use-feedback-delete]').click();

    expect(window.eval('state.firstUseFeedback.answers')).toBeNull();
    expect(window.eval(`JSON.stringify({ profile: state.profile, sessions: state.sessions, alertPreferences: state.alertPreferences, keepAwakeEnabled: state.keepAwakeEnabled })`)).toBe(protectedState);
    dom.window.close();
  });
}
