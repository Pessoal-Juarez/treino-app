import { readFile } from 'node:fs/promises';
import { afterEach, expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

const files = ['index.html', 'treino_hibrido_juarez_v3_standalone.html'];
const windows = [];
async function runner(file) {
  const dom = new JSDOM(await readFile(new URL(`../${file}`, import.meta.url), 'utf8'), { runScripts: 'dangerously', url: 'http://localhost/' });
  dom.window.startWorkoutByKey('segunda');
  dom.window.navigateExercise(6);
  windows.push(dom.window);
  return dom.window.document;
}
afterEach(() => windows.splice(0).forEach((window) => window.close()));
for (const file of files) {
  // SPECSFY: US-001 FR-001 NFR-001 AC-001
  test(`${file} renders the isometric card in the approved position`, async () => {
    const document = await runner(file);
    const card = document.querySelector('[data-isometric-timer]');
    expect(card).not.toBeNull();
    expect(document.querySelector('#runnerVideoLink').compareDocumentPosition(card) & document.defaultView.Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(card.nextElementSibling.textContent).toContain('Séries Realizadas:');
    expect(card.nextElementSibling.nextElementSibling.id).toBe('runnerSetsContainer');
  });
  // SPECSFY: US-001 FR-001 NFR-001 AC-002
  test(`${file} starts and pauses the adjusted isometric duration without rest`, async () => {
    const document = await runner(file);
    const display = document.querySelector('[data-isometric-display]');
    const rest = document.querySelector('#runnerTimerDisplay').textContent;
    document.querySelector('[data-isometric-adjust]').click();
    expect(display.textContent).toBe('00:50');
    document.querySelector('[data-isometric-play]').click();
    await new Promise((resolve) => setTimeout(resolve, 1100));
    expect(display.textContent).toBe('00:49');
    expect(document.querySelector('#runnerTimerDisplay').textContent).toBe(rest);
    document.querySelector('[data-isometric-play]').click();
    await new Promise((resolve) => setTimeout(resolve, 1100));
    expect(display.textContent).toBe('00:49');
  });
  // SPECSFY: US-001 FR-001 NFR-001 AC-003
  test(`${file} clears an isometric timer when navigating away`, async () => {
    const document = await runner(file);
    document.querySelector('[data-isometric-play]').click();
    document.defaultView.navigateExercise(-1);
    expect(document.querySelector('[data-isometric-timer]').style.display).toBe('none');
    document.defaultView.navigateExercise(1);
    document.querySelector('[data-isometric-play]').click();
    expect(document.querySelector('[data-isometric-play]').textContent).toContain('Pausar');
  });
}
