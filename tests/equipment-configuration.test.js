import { readFile } from 'node:fs/promises';
import { afterEach, expect, test, vi } from 'vitest';
import { JSDOM } from 'jsdom';

const files = ['index.html', 'treino_hibrido_juarez_v3_standalone.html'];
const equipmentKey = 'treino_hibrido_juarez_v5_equipment';
const stateKey = 'treino_hibrido_juarez_v5';
const windows = [];

async function renderWorkout(file, storedEquipment) {
  const html = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'http://localhost/',
    beforeParse(window) {
      window.scrollTo = () => {};
      window.localStorage.setItem(stateKey, JSON.stringify({ profile: { name: 'Legado' }, sessions: [], onboardingSeen: true }));
      if (storedEquipment !== undefined) {
        window.localStorage.setItem(equipmentKey, storedEquipment);
      }
    },
  });
  dom.window.startWorkoutByKey('segunda');
  windows.push(dom.window);
  return dom.window;
}

function editor(document) {
  return document.querySelector('[data-equipment-editor]');
}

function setPair(document, index, label, value) {
  document.querySelector(`[name="label-${index}"]`).value = label;
  document.querySelector(`[name="value-${index}"]`).value = value;
}

function save(document) {
  document.querySelector('[data-action="save"]').click();
}

afterEach(() => {
  windows.splice(0).forEach((window) => window.close());
  vi.restoreAllMocks();
});

for (const file of files) {
  // SPECSFY: US-001 FR-001 FR-002 NFR-001 NFR-003 AC-001 AC-008
  test(`${file} positions the three-slot card after the video with existing visual tokens`, async () => {
    const window = await renderWorkout(file);
    const { document, Node } = window;
    const summary = document.querySelector('[data-equipment-summary]');
    const video = document.querySelector('#runnerVideoLink');
    const lastRecord = document.querySelector('#runnerLastRecordBadge');
    const edit = summary.querySelector('[data-action="edit"]');

    expect(summary).not.toBeNull();
    expect(video.compareDocumentPosition(summary) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(summary.compareDocumentPosition(lastRecord) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(summary.querySelectorAll('[data-equipment-pair]').length).toBe(3);
    expect(summary.style.background).toBe('var(--panel)');
    expect(summary.style.borderColor).toBe('var(--line)');
    expect(edit.style.minHeight).toBe('44px');
  });

  // SPECSFY: US-001 FR-001 FR-002 NFR-002 NFR-003 AC-002 AC-009
  test(`${file} opens an editor with three 16px and 44px name/value pairs plus matching actions`, async () => {
    const window = await renderWorkout(file);
    const { document } = window;
    document.querySelector('[data-action="edit"]').click();
    const panel = editor(document);

    expect(panel).not.toBeNull();
    expect(panel.style.background).toContain('rgba');
    expect(panel.firstElementChild.style.background).toBe('var(--panel)');
    expect(panel.querySelectorAll('[data-equipment-pair]').length).toBe(3);
    for (let index = 0; index < 3; index += 1) {
      for (const field of ['label', 'value']) {
        const input = panel.querySelector(`[name="${field}-${index}"]`);
        expect(input.maxLength).toBe(40);
        expect(input.style.fontSize).toBe('16px');
        expect(input.style.minHeight).toBe('44px');
      }
    }
    for (const action of ['cancel', 'save']) {
      expect(panel.querySelector(`[data-action="${action}"]`).style.minHeight).toBe('44px');
    }
  });

  // SPECSFY: US-001 FR-002 FR-003 NFR-001 NFR-002 AC-003 AC-004
  test(`${file} cancels without writing and saves all three pairs in one atomic write`, async () => {
    const window = await renderWorkout(file);
    const { document, Storage, localStorage } = window;
    const write = vi.spyOn(Storage.prototype, 'setItem');
    const seriesValue = document.querySelector('#runnerSetsContainer input').value;

    document.querySelector('[data-action="edit"]').click();
    setPair(document, 0, 'Encosto', '6');
    editor(document).querySelector('[data-action="cancel"]').click();
    expect(write.mock.calls.filter(([key]) => key === equipmentKey)).toHaveLength(0);

    document.querySelector('[data-action="edit"]').click();
    setPair(document, 0, 'Encosto', '6');
    setPair(document, 1, 'Rolo', '3');
    setPair(document, 2, 'Posição inicial', '2');
    save(document);

    expect(write.mock.calls.filter(([key]) => key === equipmentKey)).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem(equipmentKey))).toEqual({
      'ex-sup-vert': [
        { label: 'Encosto', value: '6' },
        { label: 'Rolo', value: '3' },
        { label: 'Posição inicial', value: '2' },
      ],
    });
    expect(document.querySelector('#runnerSetsContainer input').value).toBe(seriesValue);
  });

  // SPECSFY: US-001 FR-001 FR-003 NFR-001 AC-005
  test(`${file} isolates configurations by exercise ID and restores the saved exercise`, async () => {
    const window = await renderWorkout(file);
    const { document, localStorage } = window;

    document.querySelector('[data-action="edit"]').click();
    setPair(document, 0, 'Banco', '5');
    save(document);
    const persisted = localStorage.getItem(equipmentKey);

    window.renderRunnerExercise(1);
    expect(document.querySelector('#runnerEquipmentPairs').textContent).not.toContain('Banco: 5');
    window.renderRunnerExercise(0);
    expect(document.querySelector('#runnerEquipmentPairs').textContent).toContain('Banco: 5');

    const restoredWindow = await renderWorkout(file, persisted);
    expect(restoredWindow.document.querySelector('#runnerEquipmentPairs').textContent).toContain('Banco: 5');
  });

  // SPECSFY: US-001 FR-003 NFR-001 NFR-002 AC-003 AC-006
  test(`${file} preserves three slots when an empty value removes a previous value without touching series`, async () => {
    const stored = JSON.stringify({
      'ex-sup-vert': [
        { label: 'Encosto', value: '6' },
        { label: 'Rolo', value: '3' },
        { label: 'Posição inicial', value: '2' },
      ],
    });
    const window = await renderWorkout(file, stored);
    const { document, localStorage } = window;
    const seriesValue = document.querySelector('#runnerSetsContainer input').value;

    document.querySelector('[data-action="edit"]').click();
    setPair(document, 1, 'Rolo', '');
    save(document);

    const saved = JSON.parse(localStorage.getItem(equipmentKey));
    expect(saved['ex-sup-vert']).toHaveLength(3);
    expect(saved['ex-sup-vert'][1]).toEqual({ label: 'Rolo', value: '' });
    expect(document.querySelectorAll('[data-equipment-summary] [data-equipment-pair]')).toHaveLength(3);
    expect(document.querySelector('#runnerSetsContainer input').value).toBe(seriesValue);
  });

  // SPECSFY: US-001 FR-002 NFR-002 AC-007
  test(`${file} exposes a 40-character input limit without silently truncating a programmatic value`, async () => {
    const window = await renderWorkout(file);
    const { document, localStorage } = window;
    const overLimit = 'a'.repeat(41);

    document.querySelector('[data-action="edit"]').click();
    setPair(document, 0, overLimit, '6');
    save(document);

    expect(JSON.parse(localStorage.getItem(equipmentKey))['ex-sup-vert'][0].label).toBe(overLimit);
  });

  // SPECSFY: US-001 FR-001 FR-002 NFR-001 NFR-002 AC-001 AC-005
  test(`${file} handles invalid JSON and renders hostile persisted text as text`, async () => {
    const invalidWindow = await renderWorkout(file, '{invalid json');
    expect(invalidWindow.document.querySelectorAll('[data-equipment-summary] [data-equipment-pair]')).toHaveLength(3);

    const hostileWindow = await renderWorkout(file, JSON.stringify({
      'ex-sup-vert': [{ label: '<img data-hostile>', value: '<b>unsafe</b>' }],
    }));
    const summary = hostileWindow.document.querySelector('[data-equipment-summary]');
    expect(summary.querySelector('[data-hostile]')).toBeNull();
    expect(summary.textContent).toContain('<img data-hostile>: <b>unsafe</b>');
    expect(summary.querySelectorAll('[data-equipment-pair]')).toHaveLength(3);
  });
}
