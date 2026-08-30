import { readFile } from 'node:fs/promises';
import { afterEach, expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const storageKey = 'treino_hibrido_juarez_v5';
const renderedWindows = [];

function render({ savedState = { profile: {}, sessions: [] }, withoutAudio = false } = {}) {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'http://localhost/',
    beforeParse(window) {
      window.localStorage.setItem(storageKey, JSON.stringify(savedState));
      window.scrollTo = () => {};
      if (withoutAudio) {
        Object.defineProperty(window, 'AudioContext', {
          configurable: true,
          value: class AudioContextUnavailable { constructor() { throw new Error('indisponível'); } }
        });
      }
    }
  });
  const rendered = { window: dom.window, document: dom.window.document };
  renderedWindows.push(rendered);
  return rendered;
}

afterEach(() => {
  while (renderedWindows.length) renderedWindows.pop().window.close();
});

// SPECSFY: US-001 FR-001 FR-002 NFR-001 AC-001
test('persists Pulsado imediatamente sem reiniciar o descanso e reserva a escolha para o próximo alarme', () => {
  const { window, document } = render();
  window.startRunnerRestTimer(90);
  const labelBefore = document.querySelector('#runnerTimerLabel').textContent;
  const preset = document.querySelector('#alarmSoundPreset');
  const volume = document.querySelector('#soundVolume');

  preset.value = 'pulse-high';
  preset.dispatchEvent(new window.Event('change', { bubbles: true }));
  volume.value = '0.4';
  volume.dispatchEvent(new window.Event('change', { bubbles: true }));

  expect(document.querySelector('#runnerTimerLabel').textContent).toBe(labelBefore);
  expect(JSON.parse(window.localStorage.getItem(storageKey)).alertPreferences).toEqual({
    presetId: 'pulse-high',
    volume: 0.4,
    vibrationLevelId: 'vibration-standard'
  });
});

// SPECSFY: US-001 FR-001 FR-002 NFR-001 AC-002
test('restaura Alto e 0,9 para preferências ausentes ou inválidas e expõe controle móvel utilizável', () => {
  const missing = render();
  const missingPreset = missing.document.querySelector('#alarmSoundPreset');
  const missingVolume = missing.document.querySelector('#soundVolume');

  expect(missingPreset.value).toBe('triple-high');
  expect(missingVolume.value).toBe('0.9');
  expect(missingPreset.style.fontSize).toBe('16px');
  expect(missingPreset.style.minHeight).toBe('44px');

  const invalid = render({ savedState: { profile: {}, sessions: [], alertPreferences: { presetId: 'fora-da-lista', volume: 9 } } });
  expect(invalid.document.querySelector('#alarmSoundPreset').value).toBe('triple-high');
  expect(invalid.document.querySelector('#soundVolume').value).toBe('0.9');
});

// SPECSFY: US-001 FR-001 FR-002 NFR-001 AC-003
test('mantém a conclusão visual e retorna falha observável quando AudioContext está indisponível', () => {
  const { window, document } = render({ withoutAudio: true });

  expect(window.playHighVolumeAlarm()).toBe(false);
  window.startRunnerRestTimer(1);
  window.finishRunnerRest();

  expect(document.querySelector('#runnerTimerDisplay').textContent).toBe('PRONTO!');
  expect(document.querySelector('#runnerTimerLabel').textContent).toBe('Descanso finalizado! Próxima série.');
  expect(document.querySelector('[data-alarm-audio-status]')).toBeNull();
});
