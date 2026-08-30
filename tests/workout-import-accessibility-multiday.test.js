import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

const variants = ['index.html', 'treino_hibrido_juarez_v3_standalone.html'];
const IMPORTS_KEY = 'treino_hibrido_juarez_v5_imported_workouts';
const protectedStorage = {
  treino_hibrido_juarez_v5: '{"sessions":[{"id":"history-1"}],"profile":{"name":"Pessoa existente"}}',
  treino_hibrido_juarez_v5_history: '[{"id":"legacy-history"}]',
  treino_hibrido_juarez_v5_profile: '{"goal":"força"}',
  treino_hibrido_juarez_v5_equipment: '{"prancha":[{"label":"Colchonete","value":"azul"}]}',
};

// Same shape reported by readWorkoutPdf: each PDF page is flattened with spaces,
// and only the page boundary remains a newline. It deliberately contains no pipes
// and no per-cell line breaks.
const weeklyPdfText = [
  'PLANO DE CONDICIONAMENTO FÍSICO SEMANAL  Rotina de segunda a sexta  Segunda-feira: Foco Cardio e Pernas (Membros Inferiores)  Exercício   Volume / Tempo   Instruções / Dica  Esteira (Corrida Intervalada)   15 a 20 min   Alternar 1 min corrida rápida / 1 min caminhada  Agachamento Livre com Halter   4 séries x 12 rep.   Mantenha o peito aberto  Afundo Alternado   3 séries x 10 rep.   Controle a descida  Panturrilha em Pé   3 séries x 15 rep.   Pausa no topo  Prancha Frontal   45 seg.   Mantenha quadril neutro  Terça-feira: Foco Superior e Cardio  Exercício   Volume / Tempo   Instruções / Dica  Supino com Halter   4 séries x 10 rep.   Escápulas estáveis  Remada Curvada   4 séries x 12 rep.   Coluna neutra  Desenvolvimento de Ombros   3 séries x 12 rep.   Sem encolher ombros  Rosca Direta   3 séries x 12 rep.   Movimento controlado  Bicicleta Ergométrica   20 min   Ritmo contínuo  Quarta-feira: Circuito de Corpo Inteiro  Exercício   Volume / Tempo   Instruções / Dica  Agachamento Goblet   3 séries x 12 rep.   Cotovelos altos  Flexão de Braços   3 séries x 10 rep.   Corpo alinhado  Remada Unilateral   3 séries x 12 rep.   Sem girar tronco  Elevação Pélvica   3 séries x 15 rep.   Contraia glúteos  Caminhada Rápida   25 min   Passo constante',
  'Quinta-feira: Foco Pernas e Mobilidade  Exercício   Volume / Tempo   Instruções / Dica  Leg Press   4 séries x 12 rep.   Joelhos alinhados  Levantamento Terra Romeno   3 séries x 10 rep.   Quadril para trás  Passada Caminhando   3 séries x 10 rep.   Alternar pernas  Mobilidade de Quadril   8 min   Sem dor  Alongamento Posterior   5 min   Sem rebote  Sexta-feira: Treino Integrado  Exercício   Volume / Tempo   Instruções / Dica  Supino Inclinado   3 séries x 10 rep.   Pausar no peito  Puxada Frontal   4 séries x 10 rep.   Peito aberto  Elevação Lateral   3 séries x 15 rep.   Ombros baixos  Corrida Leve   20 min   Conversável  Relaxamento Final   5 min   Respirar devagar',
].join('\n');

// Trecho literalmente estruturado como a saída achatada de PDF.js observada no
// aceite humano: células separadas por espaços repetidos, sem pipes nem linhas
// por célula. Os dois formatos abaixo não podem perder a unidade nem "Máximo".
const realMeasurePdfText = 'Segunda-feira: Foco Cardio e Core  Exercício   Volume / Tempo   Instruções / Dica  Corda Naval ou Polichinelos   4 séries x 45 seg.   Alternar o ritmo sem perder a postura  Prancha Abdominal Isométrica   4 séries x 45 seg.   Manter quadril neutro  Flexão de Braço   4 séries x Máximo   Parar antes de perder o alinhamento';

async function app(file) {
  return new JSDOM(await readFile(new URL(`../${file}`, import.meta.url), 'utf8'), {
    runScripts: 'dangerously',
    url: 'http://localhost/',
  });
}

function controls(document) {
  return [
    document.querySelector('[data-onboarding-name]'),
    document.querySelector('[data-onboarding-goal]'),
    ...document.querySelectorAll('[data-onboarding-goal] option'),
    document.querySelector('[data-import-file]'),
    document.querySelector('[data-import-text]'),
    document.querySelector('[data-import-preview]'),
    document.querySelector('[data-import-confirm]'),
    document.querySelector('[data-import-cancel]'),
  ];
}

for (const file of variants) {
  // SPECSFY: SPEC-0014 US-001 FR-001 NFR-001 NFR-002 AC-001 AC-006
  test(`${file} renders every configurator and importer control with explicit accessible contrast and states`, async () => {
    const dom = await app(file);
    const { document, getComputedStyle } = dom.window;
    dom.window.openWorkoutImport();
    const allControls = controls(document);
    expect(allControls).not.toContain(null);

    for (const control of allControls) {
      const style = getComputedStyle(control);
      expect(style.color).toBe('rgb(9, 13, 18)');
      expect(style.backgroundColor).toBe('rgb(243, 247, 250)');
      expect(Number.parseFloat(style.fontSize)).toBeGreaterThanOrEqual(16);
      expect(Number.parseFloat(style.minHeight)).toBeGreaterThanOrEqual(44);
      expect(control.classList.contains('setup-import-control')).toBe(true);
    }

    dom.window.close();
  });

  // SPECSFY: SPEC-0014 US-001 FR-001 NFR-001 NFR-002 AC-001
  test(`${file} gives importer actions an explicit focus indicator and disabled state`, async () => {
    const dom = await app(file);
    const { document, getComputedStyle } = dom.window;
    dom.window.openWorkoutImport();
    const preview = document.querySelector('[data-import-preview]');
    preview.focus();
    expect(preview.classList.contains('setup-import-control')).toBe(true);
    // JSDOM does not recompute :focus after focus(); assert the real stylesheet
    // contract instead of mistaking that limitation for an inaccessible control.
    const styles = [...document.querySelectorAll('style')].map(style => style.textContent).join('\n');
    expect(styles).toMatch(/\.setup-import-control:focus\s*\{[^}]*outline:\s*2px solid #2a6f97/s);
    preview.disabled = true;
    expect(getComputedStyle(preview).opacity).toBe('0.6');
    dom.window.close();
  });

  // SPECSFY: SPEC-0014 US-002 FR-002 NFR-003 NFR-004 AC-002 AC-006
  test(`${file} previews the reported five-day PDF structure with all 25 exercises locally`, async () => {
    const dom = await app(file);
    const { document, localStorage } = dom.window;
    expect(weeklyPdfText).not.toContain('|');
    expect(weeklyPdfText.split('\n')).toHaveLength(2);
    dom.window.openWorkoutImport();
    document.querySelector('[data-import-text]').value = weeklyPdfText;
    document.querySelector('[data-import-preview]').click();
    expect(document.querySelector('[data-import-result]').textContent).toContain('5 dias');
    expect(document.querySelector('[data-import-result]').textContent).toContain('25 exercícios');
    expect(localStorage.getItem(IMPORTS_KEY)).toBeNull();
    dom.window.close();
  });

  // SPECSFY: SPEC-0014 US-002 US-003 FR-002 FR-003 NFR-003 NFR-004 AC-003 AC-006
  test(`${file} confirms all reported days atomically while preserving protected local values`, async () => {
    const dom = await app(file);
    const { document, localStorage } = dom.window;
    for (const [key, value] of Object.entries(protectedStorage)) localStorage.setItem(key, value);
    const before = Object.fromEntries(Object.keys(protectedStorage).map(key => [key, localStorage.getItem(key)]));
    dom.window.openWorkoutImport();
    document.querySelector('[data-import-text]').value = weeklyPdfText;
    document.querySelector('[data-import-preview]').click();
    document.querySelector('[data-import-confirm]').click();
    const imported = JSON.parse(localStorage.getItem(IMPORTS_KEY));
    expect(imported).toHaveLength(5);
    expect(imported.flatMap(day => day.exercises)).toHaveLength(25);
    expect(imported[0].exercises[1]).toMatchObject({ name: 'Agachamento Livre com Halter', sets: 4, reps: '12', notes: 'Mantenha o peito aberto' });
    expect(imported.flatMap(day => day.exercises).some(exercise => exercise.reps === '45 seg.')).toBe(true);
    expect(Object.fromEntries(Object.keys(protectedStorage).map(key => [key, localStorage.getItem(key)]))).toEqual(before);
    dom.window.close();
  });

  // SPECSFY: SPEC-0014 US-002 US-003 FR-002 FR-003 NFR-003 NFR-004 AC-002 AC-003
  test(`${file} preserves seconds and Máximo from the flattened real-PDF volume cells`, async () => {
    const dom = await app(file);
    const { document, localStorage } = dom.window;
    expect(realMeasurePdfText).not.toContain('|');
    expect(realMeasurePdfText).not.toContain('\n');
    dom.window.openWorkoutImport();
    document.querySelector('[data-import-text]').value = realMeasurePdfText;
    document.querySelector('[data-import-preview]').click();
    expect(document.querySelector('[data-import-result]').textContent).toContain('3 exercícios');
    document.querySelector('[data-import-confirm]').click();
    const exercises = JSON.parse(localStorage.getItem(IMPORTS_KEY))[0].exercises;
    expect(exercises).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Corda Naval ou Polichinelos', sets: 4, reps: '45 seg.' }),
      expect.objectContaining({ name: 'Prancha Abdominal Isométrica', sets: 4, reps: '45 seg.' }),
      expect.objectContaining({ name: 'Flexão de Braço', sets: 4, reps: 'Máximo' }),
    ]));
    dom.window.close();
  });

  // SPECSFY: SPEC-0014 US-003 FR-003 NFR-003 AC-004
  test(`${file} explains accepted formats and persists nothing for text without a workout`, async () => {
    const dom = await app(file);
    const { document, localStorage } = dom.window;
    for (const [key, value] of Object.entries(protectedStorage)) localStorage.setItem(key, value);
    const before = Object.fromEntries(Object.keys(protectedStorage).map(key => [key, localStorage.getItem(key)]));
    dom.window.openWorkoutImport();
    document.querySelector('[data-import-text]').value = 'Lista de compras\nTomate\nArroz';
    document.querySelector('[data-import-preview]').click();
    expect(document.querySelector('[data-import-result]').textContent).toMatch(/Dia:.*Exercício:|Segunda-feira.*Exercício/i);
    expect(localStorage.getItem(IMPORTS_KEY)).toBeNull();
    expect(Object.fromEntries(Object.keys(protectedStorage).map(key => [key, localStorage.getItem(key)]))).toEqual(before);
    dom.window.close();
  });

  // SPECSFY: SPEC-0014 US-002 FR-002 FR-003 NFR-003 AC-005
  test(`${file} keeps the existing Dia and Exercício import contract`, async () => {
    const dom = await app(file);
    const { document, localStorage } = dom.window;
    dom.window.openWorkoutImport();
    document.querySelector('[data-import-text]').value = 'Dia: Domingo\nExercício: Remada\nSéries: 3\nReps: 10';
    document.querySelector('[data-import-preview]').click();
    document.querySelector('[data-import-confirm]').click();
    expect(JSON.parse(localStorage.getItem(IMPORTS_KEY))).toMatchObject([{ label: 'Domingo', exercises: [{ name: 'Remada', sets: 3, reps: '10' }] }]);
    dom.window.close();
  });
}

// SPECSFY: SPEC-0014 US-001 US-003 FR-001 FR-003 NFR-001 NFR-002 NFR-004 AC-006
test('the two distributed HTML variants remain textually identical for the shared controls and importer', async () => {
  const [main, standalone] = await Promise.all(variants.map(file => readFile(new URL(`../${file}`, import.meta.url), 'utf8')));
  const shared = html => {
    const overlayStart = html.indexOf('<section data-onboarding-overlay');
    const overlayEnd = html.indexOf('</section>', overlayStart) + '</section>'.length;
    const importerStart = html.indexOf('const IMPORTED_WORKOUTS_KEY');
    const importerEnd = html.indexOf('/* SERVICE WORKER */', importerStart);
    return html.slice(overlayStart, overlayEnd) + html.slice(importerStart, importerEnd);
  };
  expect(shared(main)).toBe(shared(standalone));
});
