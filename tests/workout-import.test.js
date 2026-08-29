import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

async function waitFor(condition, description, timeoutMs = 1000) {
  const deadline = Date.now() + timeoutMs;
  while (!condition()) {
    if (Date.now() >= deadline) throw new Error(`Timed out waiting for ${description}`);
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

for (const file of ['index.html', 'treino_hibrido_juarez_v3_standalone.html']) {
  const app = async () => new JSDOM(await readFile(new URL(`../${file}`, import.meta.url), 'utf8'), { runScripts: 'dangerously', url: 'http://localhost/' });
  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-001
  test(`${file} previews pasted workout without persistence`, async () => {
    const dom = await app(); const { document, localStorage } = dom.window;
    dom.window.switchSection('config'); document.querySelector('[data-workout-import]').click();
    document.querySelector('[data-import-text]').value = 'Dia: Sábado\nExercício: Agachamento\nSéries: 3\nReps: 8';
    document.querySelector('[data-import-preview]').click();
    expect(document.querySelector('[data-import-result]').textContent).toContain('Sábado');
    expect(localStorage.getItem('treino_hibrido_juarez_v5_imported_workouts')).toBeNull(); dom.window.close();
  });
  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-002
  test(`${file} confirms an additive imported day only once`, async () => {
    const dom = await app(); const { document, localStorage } = dom.window;
    dom.window.openWorkoutImport(); document.querySelector('[data-import-text]').value = 'Dia: Sábado\nExercício: Agachamento\nSéries: 3\nReps: 8'; document.querySelector('[data-import-preview]').click(); document.querySelector('[data-import-confirm]').click();
    expect(JSON.parse(localStorage.getItem('treino_hibrido_juarez_v5_imported_workouts'))).toHaveLength(1); dom.window.close();
  });
  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-003
  test(`${file} rejects invalid input and cancel does not persist`, async () => {
    const dom = await app(); const { document, localStorage } = dom.window;
    dom.window.openWorkoutImport(); document.querySelector('[data-import-text]').value = '<img>'; document.querySelector('[data-import-preview]').click(); expect(document.querySelector('[data-import-result]').textContent).toContain('inválido'); document.querySelector('[data-import-cancel]').click(); expect(localStorage.getItem('treino_hibrido_juarez_v5_imported_workouts')).toBeNull(); dom.window.close();
  });
  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-001
  test(`${file} accepts local TXT only and reads it without network`, async () => {
    const dom = await app(); const { document } = dom.window; dom.window.openWorkoutImport();
    const input = document.querySelector('[data-import-file]'); expect(input.accept).toContain('.txt');
    const file = new dom.window.File(['Dia: Sábado\nExercício: Agachamento'], 'treino.txt', { type: 'text/plain' });
    Object.defineProperty(input, 'files', { value: [file] }); input.dispatchEvent(new dom.window.Event('change'));
    await waitFor(() => document.querySelector('[data-import-text]').value.includes('Sábado'), 'FileReader local');
    expect(document.querySelector('[data-import-text]').value).toContain('Sábado');
    expect(document.querySelector('[data-import-text]').style.fontSize).toBe('16px');
    expect(input.style.fontSize).toBe('16px');
    expect(input.style.maxWidth).toBe('100%');
    expect(document.querySelector('[data-import-text]').style.maxWidth).toBe('100%');
    for (const selector of ['[data-import-preview]', '[data-import-confirm]', '[data-import-cancel]']) {
      expect(document.querySelector(selector).style.minHeight).toBe('44px');
    }
    expect(document.querySelector('[data-import-dialog]').style.boxSizing).toBe('border-box');
    dom.window.close();
  });
  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-002
  test(`${file} renders and starts confirmed imported workout`, async () => {
    const dom = await app(); const { document } = dom.window; dom.window.openWorkoutImport(); document.querySelector('[data-import-text]').value='Dia: Sábado\nExercício: Agachamento'; document.querySelector('[data-import-preview]').click(); document.querySelector('[data-import-confirm]').click(); dom.window.renderFullPlan(); expect(document.querySelector('#fullPlanContainer').textContent).toContain('Sábado'); dom.window.startWorkoutByKey('import-s-bado'); expect(document.querySelector('#runnerExerciseName').textContent).toContain('Agachamento'); dom.window.close();
  });
  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-003
  test(`${file} rejects an unsupported file without persistence`, async () => { const dom=await app(),{document,localStorage}=dom.window;dom.window.openWorkoutImport();const input=document.querySelector('[data-import-file]');Object.defineProperty(input,'files',{value:[new dom.window.File(['x'],'treino.csv',{type:'text/csv'})]});input.dispatchEvent(new dom.window.Event('change'));await new Promise(r=>setTimeout(r,10));expect(document.querySelector('[data-import-result]').textContent).toContain('TXT ou PDF');expect(localStorage.getItem('treino_hibrido_juarez_v5_imported_workouts')).toBeNull();dom.window.close(); });
  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-002
  test(`${file} preserves existing state and de-duplicates`, async () => { const dom=await app(),{document,localStorage}=dom.window;localStorage.setItem('treino_hibrido_juarez_v5','{"sessions":[1],"profile":{"x":1}}');localStorage.setItem('treino_hibrido_juarez_v5_equipment','{"x":1}');const main=localStorage.getItem('treino_hibrido_juarez_v5'),eq=localStorage.getItem('treino_hibrido_juarez_v5_equipment');for(let i=0;i<2;i++){dom.window.openWorkoutImport();document.querySelector('[data-import-text]').value='Dia: Sábado\nExercício: Agachamento';document.querySelector('[data-import-preview]').click();document.querySelector('[data-import-confirm]').click();}expect(localStorage.getItem('treino_hibrido_juarez_v5')).toBe(main);expect(localStorage.getItem('treino_hibrido_juarez_v5_equipment')).toBe(eq);expect(JSON.parse(localStorage.getItem('treino_hibrido_juarez_v5_imported_workouts'))).toHaveLength(1);dom.window.close(); });
  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-003
  test(`${file} never turns imported markup into executable nodes`, async () => { const dom=await app(),{document}=dom.window;dom.window.openWorkoutImport();document.querySelector('[data-import-text]').value='Dia: <img src=x>\nExercício: <script>x</script>';document.querySelector('[data-import-preview]').click();if(document.querySelector('[data-import-confirm]'))document.querySelector('[data-import-confirm]').click();dom.window.renderFullPlan();expect(document.querySelector('#fullPlanContainer img,#fullPlanContainer svg,#fullPlanContainer script')).toBeNull();dom.window.close(); });
  // SPECSFY: US-001 FR-001 FR-002 FR-003 NFR-001 AC-002
  test(`${file} restores imported workout in a fresh window`, async () => { const first=await app(),d=first.window.document;first.window.openWorkoutImport();d.querySelector('[data-import-text]').value='Dia: Domingo\nExercício: Remada';d.querySelector('[data-import-preview]').click();d.querySelector('[data-import-confirm]').click();const saved=first.window.localStorage.getItem('treino_hibrido_juarez_v5_imported_workouts');first.window.close();const next=await app();next.window.localStorage.setItem('treino_hibrido_juarez_v5_imported_workouts',saved);next.window.renderFullPlan();expect(next.window.document.querySelector('#fullPlanContainer').textContent).toContain('Domingo');next.window.startWorkoutByKey('import-domingo');expect(next.window.document.querySelector('#runnerExerciseName').textContent).toContain('Remada');next.window.close(); });
}
