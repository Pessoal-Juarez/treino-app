import { readFile } from 'node:fs/promises';
import { afterEach, expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const windows = [];
const key = 'treino_hibrido_juarez_v5';

function state(sessions = []) {
  return { profile: { weight_kg: 79, waist_cm: 98, chest_cm: 100, goal: 'Teste' }, sessions };
}
function render({ savedState = state(), start = true } = {}) {
  const downloads = [];
  const registrations = [];
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', beforeParse(window) {
    window.localStorage.setItem(key, JSON.stringify(savedState));
    window.scrollTo = () => {};
    window.URL.createObjectURL = () => 'blob:test'; window.URL.revokeObjectURL = () => {};
    window.HTMLAnchorElement.prototype.click = function () { downloads.push({ download: this.download, href: this.href }); };
    Object.defineProperty(window.navigator, 'serviceWorker', { configurable: true, value: { register: (url) => { registrations.push(url); return Promise.resolve(); } } });
  }});
  const result = { window: dom.window, document: dom.window.document, downloads, registrations };
  windows.push(result);
  if (start) dom.window.startWorkoutByKey('segunda');
  return result;
}
afterEach(() => { while (windows.length) windows.pop().window.close(); });

// SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-002 AC-001
test('starts the current programmed workout through the real Home handler', () => {
  const { window, document } = render({ start: false }); window.startTodayWorkout();
  expect(document.querySelector('#runnerOverlay').classList.contains('active')).toBe(true);
  expect(document.querySelector('#runnerExerciseName').textContent).not.toBe('');
});
// SPECSFY: US-002 FR-004 FR-005 FR-006 NFR-002 AC-002
test('preloads the matching historical series and advances the runner', () => {
  const { window, document } = render({ savedState: state([{ date: '2099-01-01', exercises: [{ name: 'Supino vertical articulado', sets: [{ weight: '25', reps: '8' }] }] }]) });
  expect(document.querySelector('#runnerSetsContainer input').value).toBe('25'); window.navigateExercise(1);
  expect(document.querySelector('#runnerExerciseName').textContent).toContain('Puxada');
});
// SPECSFY: US-003 FR-007 FR-008 AC-003
test('keeps a skipped exercise in the pending modal at the end of the runner', () => {
  const { window, document } = render(); window.skipCurrentExercise(); for (let i = 0; i < 7; i++) window.navigateExercise(1);
  expect(document.querySelector('#skippedModal').classList.contains('active')).toBe(true);
  expect(document.querySelector('#skippedModalList').textContent).toContain('Supino vertical');
});
// SPECSFY: US-004 FR-009 FR-010 NFR-001 AC-004
test('starts the real rest timer after a completed set', () => {
  const { window, document } = render(); window.toggleCompleteSet(0, 0, 90);
  expect(document.querySelector('#runnerTimerLabel').textContent).toBe('Descanso em andamento');
  expect(document.querySelector('#btnToggleRest').textContent).toBe('Pausar');
});
// SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-002 AC-006
test('renders the seven-day responsive Home calendar and workout hero', () => {
  const { document } = render({ start: false });
  expect(document.querySelectorAll('#calendarStrip .day-pill')).toHaveLength(7);
  expect(document.querySelector('#todayHeroTitle').textContent).not.toBe('');
});
// SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-002 AC-007
test('starts the workout selected from the calendar', () => {
  const { window, document } = render({ start: false }); window.onCalendarDayClick('2099-01-06', 1); window.startTodayWorkout();
  expect(document.querySelector('#runnerExerciseName').textContent).toContain('Leg press');
});
// SPECSFY: US-002 FR-004 FR-005 FR-006 FR-013 NFR-002 NFR-004 AC-009
test('persists a series changed through its real inline handler', () => {
  const { window, document } = render(); const field = document.querySelector('#runnerSetsContainer input'); field.value = '47'; field.dispatchEvent(new window.Event('change', { bubbles: true })); window.saveActiveWorkoutSession();
  expect(JSON.parse(window.localStorage.getItem(key)).sessions.at(-1).exercises[0].sets[0].weight).toBe('47');
});
// SPECSFY: US-002 FR-004 FR-005 FR-006 FR-013 NFR-002 NFR-004 AC-010
test('projects a legacy load with exactly one terminal kg removed', () => {
  const { document } = render({ savedState: state([{ date: '2099-01-01', exercises: [{ name: 'Supino vertical articulado', sets: [{ weight: '12 kg kg', reps: '8' }] }] }]) });
  expect(document.querySelector('#runnerSetsContainer input').value).toBe('12 kg');
});
// SPECSFY: US-003 FR-007 FR-008 AC-013
test('marks the current exercise skipped and navigates forward', () => {
  const { window, document } = render(); window.skipCurrentExercise();
  expect(document.querySelector('#runnerExerciseName').textContent).toContain('Puxada');
});
// SPECSFY: US-003 FR-007 FR-008 AC-014
test('returns a skipped exercise from the pending modal to the runner', () => {
  const { window, document } = render(); window.skipCurrentExercise(); for (let i = 0; i < 7; i++) window.navigateExercise(1); window.jumpToSkippedExercise('ex-sup-vert');
  expect(document.querySelector('#skippedModal').classList.contains('active')).toBe(false);
  expect(document.querySelector('#runnerExerciseName').textContent).toContain('Supino vertical');
});
// SPECSFY: US-004 FR-009 FR-010 NFR-001 AC-016
test('shows active rest after a completed series', () => {
  const { window, document } = render(); window.toggleCompleteSet(0, 0, 90);
  expect(document.querySelector('#runnerTimerDisplay').textContent).toBe('01:30');
});
// SPECSFY: US-004 FR-009 FR-010 NFR-001 AC-017
test('shows the completion notice when rest finishes', () => {
  const { window, document } = render(); window.startRunnerRestTimer(1); window.finishRunnerRest();
  expect(document.querySelector('#runnerTimerDisplay').textContent).toBe('PRONTO!');
});
// SPECSFY: US-003 FR-011 AC-019
test('opens the real overview drawer with the session exercises', () => {
  const { window, document } = render(); window.openExerciseOverviewDrawer();
  expect(document.querySelector('#overviewDrawer').classList.contains('active')).toBe(true);
  expect(document.querySelectorAll('#overviewDrawerList .exercise-list-item').length).toBeGreaterThan(1);
});
// SPECSFY: US-003 FR-011 AC-020
test('navigates to an exercise from the overview drawer', () => {
  const { window, document } = render(); window.openExerciseOverviewDrawer(); window.jumpToExercise(1);
  expect(document.querySelector('#runnerExerciseName').textContent).toContain('Puxada');
});
// SPECSFY: US-003 FR-011 AC-021
test('reflects completed sets in the overview status', () => {
  const { window, document } = render(); [0, 1, 2].forEach((set) => window.toggleCompleteSet(0, set, 90)); window.openExerciseOverviewDrawer();
  expect(document.querySelector('#overviewDrawerList').textContent).toContain('Concluído');
});
// SPECSFY: FR-012 NFR-003 AC-022
test('saves the finalized runner session in local storage', () => {
  const { window } = render(); window.saveActiveWorkoutSession();
  expect(JSON.parse(window.localStorage.getItem(key)).sessions).toHaveLength(1);
});
// SPECSFY: FR-012 NFR-003 AC-023
test('exports local history through the browser download boundary', () => {
  const { window, downloads } = render(); window.exportMarkdown();
  expect(downloads.at(-1).download).toMatch(/^treino_meu-treino_.*\.md$/);
});
// SPECSFY: FR-012 NFR-003 AC-024
test('registers the service worker at the real browser load boundary', async () => {
  const { window, registrations } = render({ start: false }); window.dispatchEvent(new window.Event('load')); await Promise.resolve();
  expect(registrations).toContain('./sw.js');
});
