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
      if (savedState) window.localStorage.setItem(STORAGE_KEY, savedState);
    },
  });
}

function getStoredOnboarding(dom) {
  return JSON.parse(dom.window.localStorage.getItem(STORAGE_KEY)).onboardingSeen;
}

for (const file of variants) {
  // SPECSFY: SPEC-0013 supersedes SPEC-0011 tutorial ACs for first use; the configurator is now direct.
  test(`${file} shows the direct local configurator on first use without legacy tutorial controls`, async () => {
    const dom = await openApp(file);
    const overlay = dom.window.document.querySelector('[data-onboarding-overlay]');
    expect(overlay).not.toBeNull();
    expect(overlay.querySelector('[data-onboarding-profile]')).not.toBeNull();
    expect(overlay.querySelector('[data-onboarding-import-own]')).not.toBeNull();
    expect(overlay.querySelector('[data-onboarding-continue]')).not.toBeNull();
    expect(overlay.querySelector('[data-onboarding-step]')).toBeNull();
    expect(overlay.querySelector('[data-onboarding-next]')).toBeNull();
    expect(overlay.querySelector('[data-onboarding-back]')).toBeNull();
    expect(overlay.querySelector('[data-onboarding-skip]')).toBeNull();
    expect(overlay.querySelector('[data-onboarding-finish]')).toBeNull();
    dom.window.close();
  });

  // SPECSFY: SPEC-0013 AC-003
  test(`${file} saves only the configurator draft when continued later without remote activity`, async () => {
    const dom = await openApp(file);
    const { window } = dom;
    const before = window.localStorage.getItem(STORAGE_KEY);
    window.document.querySelector('[data-onboarding-name]').value = 'Pai';
    window.document.querySelector('[data-onboarding-goal]').value = 'Força';
    window.document.querySelector('[data-onboarding-continue]').click();
    expect(getStoredOnboarding(dom)).not.toBe(true);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).initialProfileDraft).toEqual({ name: 'Pai', goal: 'Força' });
    expect(window.document.querySelector('[data-onboarding-overlay]').hidden).toBe(true);
    expect(window.fetch).toBeUndefined();
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBe(before);
    dom.window.close();
  });

  // SPECSFY: SPEC-0013 AC-003
  test(`${file} reopens the configurator from Settings without clearing a completed preference`, async () => {
    const savedState = JSON.stringify({ profile:{name:'Pai'}, sessions:[], onboardingSeen:true, onboardingConfigured:true });
    const reopened = await openApp(file, savedState);
    const overlay = reopened.window.document.querySelector('[data-onboarding-overlay]');
    expect(overlay.hidden).toBe(true);
    const review = reopened.window.document.querySelector('[data-onboarding-review]');
    expect(review).not.toBeNull();
    expect(review.style.minHeight).toBe('44px');
    review.click();
    expect(overlay.hidden).toBe(false);
    expect(getStoredOnboarding(reopened)).toBe(true);
    reopened.window.close();
  });
}

test('onboarding source contract is materially equivalent in both HTML variants', async () => {
  const sources = await Promise.all(variants.map(file => readFile(new URL(`../${file}`, import.meta.url), 'utf8')));
  const material = sources.map(source => {
    const settings = source.match(/<button[^>]*data-onboarding-review[\s\S]*?<\/button>/);
    const overlay = source.match(/<section[^>]*data-onboarding-overlay[\s\S]*?<\/section>/);
    const behaviorStart = source.indexOf('function getOnboardingSeen()');
    const behaviorEnd = source.indexOf('const ALERT_PREFERENCES_DEFAULT');
    expect(settings).not.toBeNull();
    expect(overlay).not.toBeNull();
    expect(behaviorStart).toBeGreaterThan(-1);
    expect(behaviorEnd).toBeGreaterThan(behaviorStart);
    const onboardingMaterial = `${settings[0]}\n${overlay[0]}\n${source.slice(behaviorStart, behaviorEnd)}`;
    expect(onboardingMaterial).not.toMatch(/https?:\/\//);
    return onboardingMaterial;
  });
  expect(material[0]).toBe(material[1]);
});
