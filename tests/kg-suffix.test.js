import { readFile } from 'node:fs/promises';
import { afterEach, expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const storageKey = 'treino_hibrido_juarez_v5';
const renderedWindows = [];

const render = ({ savedState, promptResponses = [] } = {}) => {
  const promptCalls = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'http://localhost/',
    beforeParse(window) {
      if (savedState) window.localStorage.setItem(storageKey, JSON.stringify(savedState));
      window.scrollTo = () => {};
      window.prompt = (message, defaultValue) => {
        promptCalls.push([message, defaultValue]);
        return promptResponses.shift() ?? null;
      };
    }
  });

  dom.window.startWorkoutByKey('segunda');
  const rendered = { window: dom.window, document: dom.window.document, promptCalls };
  renderedWindows.push(rendered);
  return rendered;
};

afterEach(() => {
  while (renderedWindows.length) renderedWindows.pop().window.close();
});

// SPECSFY: US-002 FR-006 FR-013 NFR-004 AC-005 TC-006
test('renders the fixed kg suffix outside the real series input value', () => {
  const { document } = render({ savedState: { profile: {}, sessions: [] } });
  const field = document.querySelector('#runnerSetsContainer input');
  const group = field.closest('.set-input-group');

  expect(field.value).toBe('');
  expect(group.querySelector('.series-load-suffix')).not.toBeNull();
  expect(group.querySelector('.series-load-suffix').textContent).toBe('kg');
});

// SPECSFY: US-002 FR-006 FR-013 NFR-004 AC-005 TC-006
test('renders the series load placeholder without a unit', () => {
  const { document } = render({ savedState: { profile: {}, sessions: [] } });
  const field = document.querySelector('#runnerSetsContainer input');

  expect(field.placeholder).toBe('Ex: 32');
});

// SPECSFY: US-002 FR-013 NFR-004 AC-005 TC-007
test('removes exactly one terminal kg from a known legacy series value for display', () => {
  const { document } = render({
    savedState: {
      profile: {},
      sessions: [{
        date: '2099-01-01',
        exercises: [{
          name: 'Supino vertical articulado',
          sets: [{ weight: '12 kg kg', reps: '10' }]
        }]
      }]
    }
  });
  const field = document.querySelector('#runnerSetsContainer input');

  expect(field.value).toBe('12 kg');
});

// SPECSFY: US-002 FR-006 FR-013 NFR-004 AC-005 TC-008
test('characterizes raw series-load persistence', () => {
  const { window, document } = render({
    savedState: { profile: { weight_kg: 79, waist_cm: 98 }, sessions: [] }
  });
  const field = document.querySelector('#runnerSetsContainer input');

  field.value = '47';
  field.dispatchEvent(new window.Event('change', { bubbles: true }));
  window.saveActiveWorkoutSession();
  const persisted = JSON.parse(window.localStorage.getItem(storageKey));
  expect(persisted.sessions.at(-1).exercises[0].sets[0].weight).toBe('47');
});
