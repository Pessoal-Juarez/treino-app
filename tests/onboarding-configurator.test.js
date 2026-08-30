import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

const variants = ['index.html', 'treino_hibrido_juarez_v3_standalone.html'];
const KEY = 'treino_hibrido_juarez_v5';
async function app(file, state) {
  const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
  return new JSDOM(source, { runScripts: 'dangerously', url: 'http://localhost/', beforeParse(w) { w.scrollTo = () => {}; if (state) w.localStorage.setItem(KEY, JSON.stringify(state)); } });
}
for (const file of variants) {
  // SPECSFY: US-001 US-002 US-003 FR-001 NFR-001 NFR-002 AC-001
  test(`${file} closes hidden overlays without computed grid`, async () => {
    const dom = await app(file); const { document, getComputedStyle } = dom.window;
    const onboarding = document.querySelector('[data-onboarding-overlay]');
    document.querySelector('[data-onboarding-continue]').click();
    expect(onboarding.hidden).toBe(true);
    expect(getComputedStyle(onboarding).display).toBe('none');
    document.querySelector('[data-first-use-feedback-open]').click();
    const feedback = document.querySelector('[data-first-use-feedback-overlay]');
    document.querySelector('[data-feedback-close]').click();
    expect(getComputedStyle(feedback).display).toBe('none'); dom.window.close();
  });
  // SPECSFY: US-001 US-002 FR-002 FR-003 NFR-003 AC-002 AC-003 AC-004
  test(`${file} configures only a new installation with own workout and resumes a draft`, async () => {
    const fresh = await app(file); const { document, localStorage } = fresh.window;
    expect(document.querySelector('[data-onboarding-profile]')).not.toBeNull();
    expect(document.querySelector('[data-onboarding-import-own]')).not.toBeNull();
    document.querySelector('[data-onboarding-continue]').click();
    const draft = JSON.parse(localStorage.getItem(KEY));
    expect(draft.onboardingConfigured).not.toBe(true);
    expect(draft.initialProfileDraft).toBeDefined(); fresh.window.close();
    const existing = await app(file, { sessions:[{id:'juarez'}], profile:{name:'Juarez'}, onboardingSeen:true });
    expect(existing.window.document.querySelector('[data-onboarding-overlay]').hidden).toBe(true);
    expect(existing.window.eval('state.sessions[0].id')).toBe('juarez'); existing.window.close();
  });
  // SPECSFY: INC-0013-01 AC-002 AC-003 — RED: o importador precisa ser clicável acima do configurador.
  test(`${file} keeps the own-workout importer above the onboarding overlay`, async () => {
    const dom = await app(file); const { document, getComputedStyle } = dom.window;
    const onboarding = document.querySelector('[data-onboarding-overlay]');
    document.querySelector('[data-onboarding-import-own]').click();
    const importer = document.querySelector('[data-workout-import="true"]');
    expect(importer).not.toBeNull();
    expect(Number(getComputedStyle(importer).zIndex)).toBeGreaterThan(Number(getComputedStyle(onboarding).zIndex));
    dom.window.close();
  });
  // SPECSFY: INC-0013-02 AC-003 — o configurador não mantém os controles legados que concluíam sem treino próprio.
  test(`${file} exposes no legacy Pular or Começar treino path without an imported workout`, async () => {
    const dom = await app(file); const { document, getComputedStyle, localStorage } = dom.window;
    const onboarding = document.querySelector('[data-onboarding-overlay]');
    expect(document.querySelector('[data-onboarding-skip]')).toBeNull();
    expect(document.querySelector('[data-onboarding-finish]')).toBeNull();
    document.querySelector('[data-onboarding-continue]').click();
    expect(dom.window.eval('state.onboardingSeen')).not.toBe(true);
    expect(getComputedStyle(onboarding).display).toBe('none');
    dom.window.openOnboardingIntroduction();
    document.querySelector('[data-onboarding-import-own]').click();
    expect(dom.window.eval('state.onboardingSeen')).not.toBe(true);
    expect(document.querySelector('[data-workout-import="true"]')).not.toBeNull();
    dom.window.close();
  });
  // SPECSFY: INC-0013-03 AC-004 — RED: instalação limpa não pode receber o perfil ou o histórico de Juarez.
  test(`${file} starts a clean installation without Juarez profile or history`, async () => {
    const dom = await app(file);
    expect(dom.window.eval('state.profile.name')).toBe('');
    expect(dom.window.eval('state.sessions')).toEqual([]);
    expect(dom.window.localStorage.getItem('treino_hibrido_juarez_v5_imported_workouts')).toBeNull();
    dom.window.close();
  });
  // SPECSFY: INC-0013-05 AC-004 — RED: o catálogo limpo só expõe o treino importado; legado preserva o plano anterior.
  test(`${file} isolates the workout catalog for a new installation while preserving legacy storage`, async () => {
    const fresh = await app(file);
    expect(fresh.window.eval('Object.keys(getAvailableWorkouts())')).toEqual([]);
    expect(fresh.window.document.getElementById('todayHeroTitle').textContent).not.toContain('Superior A');
    fresh.window.onCalendarDayClick('2026-08-31', 0);
    expect(fresh.window.document.getElementById('todayHeroTitle').textContent).not.toContain('Superior A');
    fresh.window.close();
    const legacy = await app(file, { profile:{name:'Juarez'}, sessions:[{id:'s-legacy'}], onboardingSeen:true });
    expect(legacy.window.eval('Object.keys(getAvailableWorkouts()).length')).toBeGreaterThan(0);
    legacy.window.close();
  });
  // SPECSFY: INC-0013-06 AC-003 AC-004 — RED: confirmação do treino promove o rascunho e só então conclui o onboarding.
  test(`${file} promotes the profile draft only after the own workout is confirmed`, async () => {
    const dom = await app(file); const { document, localStorage } = dom.window;
    document.querySelector('[data-onboarding-name]').value = 'Pai';
    document.querySelector('[data-onboarding-goal]').value = 'Força';
    document.querySelector('[data-onboarding-import-own]').click();
    expect(dom.window.eval('state.onboardingSeen')).not.toBe(true);
    const importer = document.querySelector('[data-workout-import="true"]');
    importer.querySelector('[data-import-text]').value = 'Dia: Pai\nExercício: Agachamento\nSéries: 3\nReps: 8';
    importer.querySelector('[data-import-preview]').click();
    importer.querySelector('[data-import-confirm]').click();
    const saved = JSON.parse(localStorage.getItem(KEY));
    expect(saved.profile.name).toBe('Pai');
    expect(saved.profile.goal).toBe('Força');
    expect(saved.onboardingConfigured).toBe(true);
    expect(saved.onboardingSeen).toBe(true);
    expect(dom.window.eval('Object.keys(getAvailableWorkouts())')).toEqual(['import-pai']);
    expect(document.getElementById('todayHeroTitle').textContent).toBe('Pai');
    expect(document.querySelector('.user-greeting').textContent).toBe('Olá, Pai!');
    dom.window.close();
  });
  // SPECSFY: INC-0013-07 AC-004 — RED: identidade exibida e exportada é genérica ou vem do perfil local, nunca fixa em Juarez.
  test(`${file} keeps identity output generic for a clean install and derives it from a legacy profile`, async () => {
    const fresh = await app(file);
    expect(fresh.window.document.title).not.toContain('Juarez');
    expect(fresh.window.document.querySelector('.user-greeting').textContent).not.toContain('Juarez');
    expect(fresh.window.generateMarkdownContent()).not.toContain('Juarez');
    fresh.window.close();
    const legacy = await app(file, { profile:{name:'Juarez', weight_kg:'', waist_cm:'', chest_cm:'', pullups:'', goal:''}, sessions:[], onboardingSeen:true });
    expect(legacy.window.document.querySelector('.user-greeting').textContent).toContain('Juarez');
    expect(legacy.window.generateMarkdownContent()).toContain('Juarez');
    legacy.window.close();
  });
  // SPECSFY: INC-0013-04 AC-006 — RED: apagar feedback também precisa retirar o overlay do fluxo de cliques.
  test(`${file} closes feedback with computed display none when deleting it`, async () => {
    const dom = await app(file); const { document, getComputedStyle } = dom.window;
    dom.window.eval("state.firstUseFeedback={invited:true,answers:{iniciar:'Fácil',seriesDescanso:'Mais ou menos',fluxoGeral:'Difícil'}};persist();openFirstUseFeedback();");
    document.querySelector('[data-first-use-feedback-delete]').click();
    const overlay = document.querySelector('[data-first-use-feedback-overlay]');
    expect(overlay.hidden).toBe(true);
    expect(getComputedStyle(overlay).display).toBe('none');
    dom.window.close();
  });
  // SPECSFY: US-003 FR-004 NFR-004 AC-005 AC-006
  test(`${file} shares only complete feedback manually`, async () => {
    const dom = await app(file); const { document } = dom.window;
    expect(document.querySelector('[data-first-use-feedback-share]')).not.toBeNull();
    expect(document.querySelector('[data-first-use-feedback-share]').hidden).toBe(true); dom.window.close();
  });
}

test('manifest identity is generic for every installation', async () => {
  const manifest = await readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8');
  expect(manifest).not.toContain('Juarez');
});

test('distributed HTML DEFAULT_STATE contains no Juarez profile or personal session identifier', async () => {
  for (const file of variants) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    const defaultState = source.match(/const DEFAULT_STATE = \{[\s\S]*?\n\};\n+const STORAGE_KEY/);
    expect(defaultState).not.toBeNull();
    expect(defaultState[0]).not.toContain('Juarez Silva');
    expect(defaultState[0]).not.toContain('s-2026-07-20');
  }
});
