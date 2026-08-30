// Contrato executável da fila não bloqueante e do lock do Despachante.
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { expect, test } from 'vitest';
import { terminalIsBusy } from '../../scripts/partitura/terminal-state.mjs';

const executionOptions = {
  cwd: process.cwd(),
  encoding: 'utf8',
  maxBuffer: 1024 * 1024,
};
const maestri = process.platform === 'win32'
  ? execFileSync('C:\\Windows\\System32\\where.exe', ['maestri'], executionOptions)
      .split(/\r?\n/u)
      .find((path) => path.toLowerCase().endsWith('.exe'))
  : 'maestri';
const lockScript = resolve('scripts/partitura/dispatcher-lock.mjs');
const wakeScript = resolve('scripts/partitura/wake-dispatcher.mjs');

function inspectMaestri(kind, name) {
  return spawnSync(maestri, [kind, 'show', name], executionOptions);
}

function expectAvailable(result, label) {
  expect(result.status, `${label} indisponível:\n${result.stderr || result.stdout}`).toBe(0);
  return result.stdout;
}

function expectConcepts(text, concepts) {
  for (const [label, pattern] of concepts) {
    expect(text, `contrato ausente: ${label}`).toMatch(pattern);
  }
}

function runLock(args) {
  return spawnSync(process.execPath, [lockScript, ...args], executionOptions);
}

function runLockAsync(args) {
  return new Promise((resolveProcess) => {
    const child = spawn(process.execPath, [lockScript, ...args], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (status) => resolveProcess({ status, stdout, stderr }));
  });
}

function acquireArgs(root, task, owner, worktree, files) {
  return [
    'acquire',
    '--root', root,
    '--task', task,
    '--owner', owner,
    '--spec', `specs/in-progress/${task}/spec.md`,
    '--nnnn', task.slice(0, 4),
    '--worktree', worktree,
    '--files', JSON.stringify(files),
  ];
}

// SPECSFY: US-002 FR-010 FR-011 FR-012 FR-013 FR-014 FR-015 FR-016 FR-017 NFR-004 NFR-005 NFR-006 AC-007
test('pula o item aguardando a pessoa e atribui o próximo acionável no mesmo ciclo', () => {
  const dispatcher = expectAvailable(
    inspectMaestri('role', 'Specsfy Queue Dispatcher'),
    'papel Specsfy Queue Dispatcher',
  );
  const routine = expectAvailable(
    inspectMaestri('routine', 'Monitorar pedidos azul e rosa'),
    'rotina Monitorar pedidos azul e rosa',
  );

  expectConcepts(dispatcher, [
    ['passagem curta e idempotente', /passagem.{0,50}curta.{0,50}idempotente|curta.{0,50}idempotente.{0,50}passagem/is],
    ['independência do Orquestrador ocupado', /independente.{0,100}Orquestrador.{0,80}ocupad|Orquestrador.{0,80}ocupad.{0,100}independente/is],
    ['preservação do texto humano', /(?:preserv|não (?:reescrev|alter)).{0,100}texto.{0,60}(?:humano|original)/is],
    ['estado AGUARDANDO_HUMANO', /AGUARDANDO_HUMANO/],
    ['estado ADIADA_DEPENDENCIA', /ADIADA_DEPENDENCIA/],
    ['estado ADIADA_CONFLITO', /ADIADA_CONFLITO/],
    ['pedido cru vira INTAKE_REQUEST', /INTAKE_REQUEST/],
    ['ausência de spec não bloqueia intake', /(?:ausência|sem).{0,80}spec.{0,80}NNNN.{0,100}não.{0,60}(?:bloque|depend)|não.{0,60}(?:bloque|depend).{0,100}spec.{0,80}NNNN/is],
    ['intake usa caminho prospectivo', /specs\/inbox\//i],
    ['intake pertence à orquestração', /INTAKE[\s\S]{0,700}(?:owner|dono|destinatário).{0,120}(?:Orquestrador|Orchestration Steward)[\s\S]{0,300}(?:nunca|não).{0,80}Farol/i],
    ['captura concluída continua', /INTAKE_CAPTURADA|INTAKE_CONTINUACAO/i],
    ['lock de captura é liberado', /INTAKE_CAPTURED_RELEASE_REQUEST/i],
    ['envelope interterminal não trunca no Windows', /(?:envelope|mensagem)[\s\S]{0,500}JSON.{0,100}(?:uma única linha|linha única)[\s\S]{0,300}(?:caminho relativo|barras? normali[sz]adas?|forward slash)/i],
    ['bloqueio humano libera vaga ativa', /AGUARDANDO_HUMANO[\s\S]{0,500}(?:não|zero).{0,100}(?:conta|consome|ocupa).{0,100}(?:teto|vaga|fluxo ativo)/i],
    ['próximo acionável no mesmo ciclo', /próximo.{0,80}acionável.{0,100}mesmo ciclo|mesmo ciclo.{0,100}próximo.{0,80}acionável/is],
    ['sem pergunta interativa', /não.{0,60}(?:deix|mant).{0,80}pergunta interativa|sem pergunta interativa/is],
    ['não entrevista nem implementa', /não.{0,80}entrevist.{0,80}implement/is],
  ]);
  expectConcepts(routine, [
    ['alvo Despachante', /Target:\s+Despachante/i],
    ['dispatcher não pula quando ocupado', /Skip if busy:\s+no/i],
  ]);
});

// SPECSFY: US-002 FR-010 FR-012 NFR-004 NFR-006 AC-007
test('wake-dispatcher prepara um único ask desacoplado', () => {
  const dryRun = spawnSync(process.execPath, [wakeScript, '--dry-run'], executionOptions);
  expect(dryRun.status, dryRun.stderr || dryRun.stdout).toBe(0);
  const wake = JSON.parse(dryRun.stdout);
  expect(wake).toMatchObject({
    schema_version: 1,
    status: 'DRY_RUN',
    target: 'Despachante',
    detached: true,
  });
  expect(wake.args).toEqual(expect.arrayContaining([
    'ask',
    'Despachante',
    '--timeout',
    '600',
  ]));
  expect(wake.prompt).toMatch(/exatamente uma passagem curta e idempotente/i);

  const wakeSource = readFileSync(wakeScript, 'utf8');
  expect(wakeSource).toMatch(/NOT_READY/);
  expect(wakeSource).toMatch(/responseChanged/);
  expect(wakeSource).toMatch(/promptObserved|activityObserved/);
  expect(wakeSource).toMatch(/terminal não confirmou a passagem/i);

  const reducedEnvironment = { ...process.env };
  delete reducedEnvironment.MAESTRI_CLI;
  const fallbackRun = spawnSync(process.execPath, [wakeScript, '--dry-run'], {
    ...executionOptions,
    env: reducedEnvironment,
  });
  expect(fallbackRun.status, fallbackRun.stderr || fallbackRun.stdout).toBe(0);
  const fallback = JSON.parse(fallbackRun.stdout);
  if (process.platform === 'win32') {
    expect(fallback.command).toMatch(/maestri\.exe$/i);
    expect(existsSync(fallback.command), fallback.command).toBe(true);
  }

  const runtimeRoot = mkdtempSync(join(tmpdir(), 'partitura-wake-runtime-'));
  try {
    const runtimeDirectory = join(runtimeRoot, '.maestri', 'dispatcher');
    mkdirSync(runtimeDirectory, { recursive: true });
    writeFileSync(join(runtimeDirectory, 'runtime.json'), JSON.stringify({
      schema_version: 1,
      maestri_env: {
        MAESTRI_PIPE: 'endpoint-local-de-teste',
        MAESTRI_TERMINAL_ID: 'terminal-local-de-teste',
        MAESTRI_WORKSPACE_ID: 'workspace-local-de-teste',
        MAESTRI_DATA_DIR: 'dados-locais-de-teste',
      },
    }));
    const registeredEnvironment = { ...reducedEnvironment };
    for (const name of [
      'MAESTRI_PIPE',
      'MAESTRI_TERMINAL_ID',
      'MAESTRI_WORKSPACE_ID',
      'MAESTRI_DATA_DIR',
    ]) delete registeredEnvironment[name];
    const registeredRun = spawnSync(process.execPath, [
      wakeScript,
      '--dry-run',
      '--root', runtimeRoot,
    ], { ...executionOptions, env: registeredEnvironment });
    expect(registeredRun.status, registeredRun.stderr || registeredRun.stdout).toBe(0);
    const registered = JSON.parse(registeredRun.stdout);
    expect(registered.runtime_identity).toBe('registered');
    expect(registeredRun.stdout).not.toContain('endpoint-local-de-teste');
    expect(registered.required_runtime).toEqual([
      'MAESTRI_DATA_DIR',
      'MAESTRI_PIPE',
      'MAESTRI_TERMINAL_ID',
      'MAESTRI_WORKSPACE_ID',
    ]);

    const registerPlan = spawnSync(process.execPath, [
      wakeScript,
      '--register-runtime',
      '--dry-run',
      '--root', runtimeRoot,
    ], {
      ...executionOptions,
      env: {
        ...process.env,
        MAESTRI_PIPE: 'endpoint-local-de-teste',
        MAESTRI_TERMINAL_ID: 'terminal-local-de-teste',
        MAESTRI_WORKSPACE_ID: 'workspace-local-de-teste',
        MAESTRI_DATA_DIR: 'dados-locais-de-teste',
      },
    });
    expect(registerPlan.status, registerPlan.stderr || registerPlan.stdout).toBe(0);
    expect(JSON.parse(registerPlan.stdout)).toMatchObject({
      status: 'REGISTER_DRY_RUN',
      runtime_identity: 'environment',
    });
    expect(registerPlan.stdout).not.toContain('endpoint-local-de-teste');
    expect(registerPlan.stdout).not.toContain('terminal-local-de-teste');
  } finally {
    rmSync(runtimeRoot, { recursive: true, force: true });
  }

  expect(readFileSync(resolve('.gitignore'), 'utf8')).toMatch(/^\.maestri\/dispatcher\/$/m);

  const failedRoot = mkdtempSync(join(tmpdir(), 'partitura-wake-error-'));
  try {
    const failed = spawnSync(process.execPath, [
      wakeScript,
      '--worker',
      '--root', failedRoot,
    ], {
      ...executionOptions,
      env: { ...process.env, MAESTRI_CLI: 'maestri-inexistente-para-teste' },
    });
    expect(failed.status).toBe(1);
    expect(JSON.parse(failed.stdout)).toMatchObject({
      schema_version: 1,
      status: 'ERROR',
      delivered: false,
    });
  } finally {
    rmSync(failedRoot, { recursive: true, force: true });
  }
});

// SPECSFY: US-002 FR-010 FR-012 NFR-004 NFR-006 AC-007
test('distingue ocupação atual de Working aninhado no transcript', () => {
  expect(terminalIsBusy(`
• Vou reconciliar a fila.
◦ Working (18s • esc to interrupt)
› Ask Codex to do anything
  `)).toBe(true);

  expect(terminalIsBusy(`
• Ran maestri check "Orquestrador"
  └ ◦ Working (42s • esc to interrupt)
• Passagem concluída sem alterações.
─ Worked for 1m 23s ─
› Ask Codex to do anything
  `)).toBe(false);

  expect(terminalIsBusy(`
╭─ Codex ─╮
› Ask Codex to do anything
  `)).toBe(false);
});

// SPECSFY: US-002 FR-010 FR-012 NFR-004 NFR-006 AC-007
test('rotina aciona o Despachante sem depender de Enter humano', () => {
  const routine = expectAvailable(
    inspectMaestri('routine', 'Monitorar pedidos azul e rosa'),
    'rotina Monitorar pedidos azul e rosa',
  );
  expectConcepts(routine, [
    ['pre-run versionado', /Pre-run:[\s\S]*wake-dispatcher\.mjs/i],
    ['marcador inerte', /Command:[\s\S]*(?:marcador inerte|não execute uma segunda passagem)/i],
  ]);
});

// SPECSFY: US-002 FR-010 FR-011 FR-012 FR-013 FR-014 FR-015 FR-016 FR-017 NFR-004 NFR-005 NFR-006 AC-008
test('retoma prioridade sem interromper o fluxo atual e respeita os tetos', () => {
  const dispatcher = expectAvailable(
    inspectMaestri('role', 'Specsfy Queue Dispatcher'),
    'papel Specsfy Queue Dispatcher',
  );
  const orchestrator = expectAvailable(
    inspectMaestri('role', 'Specsfy Orchestration Steward v2'),
    'papel Specsfy Orchestration Steward v2',
  );

  expectConcepts(dispatcher, [
    ['estado PRONTO_PRIORITARIO', /PRONTO_PRIORITARIO/],
    ['atribuição em até um ciclo', /(?:em até|no máximo).{0,40}(?:uma|1).{0,30}(?:passagem|ciclo)/is],
    ['reutilização antes de recrutamento', /reutiliz.{0,120}(?:antes|primeiro).{0,120}(?:recrut|cri.{0,20}terminal)|(?:antes|primeiro).{0,80}reutiliz/is],
    ['máximo de dois fluxos', /(?:máximo|teto).{0,40}(?:dois|2).{0,30}fluxos/is],
    ['máximo de um terminal temporário', /(?:máximo|teto).{0,40}(?:um|1).{0,40}terminal temporário/is],
    ['Prisma singleton', /Prisma.{0,50}(?:singleton|uma spec|uma auditoria)|(?:singleton|uma spec|uma auditoria).{0,50}Prisma/is],
    ['não contornar conflito com recrutamento', /não.{0,80}(?:recrut|cri.{0,20}terminal).{0,100}conflito|conflito.{0,100}não.{0,80}(?:recrut|cri.{0,20}terminal)/is],
  ]);
  expectConcepts(orchestrator, [
    ['cooperação com Despachante', /Despachante/],
    ['preservação do trabalho atual', /não.{0,80}(?:interromp|reinici).{0,80}(?:trabalho|tarefa|fluxo).{0,30}(?:atual|em andamento)|(?:trabalho|tarefa|fluxo).{0,30}(?:atual|em andamento).{0,80}não.{0,80}(?:interromp|reinici)/is],
    ['bloqueio humano não lota o teto', /AGUARDANDO_HUMANO[\s\S]{0,500}(?:não|zero).{0,100}(?:conta|consome|ocupa).{0,100}(?:teto|vaga|fluxo ativo)/i],
    ['handoff de intake', /INTAKE_ATRIBUIDA/],
    ['intake inicia setup e captura', /INTAKE_ATRIBUIDA[\s\S]{0,500}specsfy-setup[\s\S]{0,300}(?:inbox|captur)/i],
    ['retomada de captura existente', /INTAKE_CONTINUACAO/],
    ['retomada não reescreve inbox', /INTAKE_CONTINUACAO[\s\S]{0,700}(?:não.{0,80}(?:reescrev|recaptur)|preserv.{0,80}(?:literal|hash))/i],
    ['retomada bloqueia a próxima escrita', /INTAKE_CONTINUACAO[\s\S]{0,2000}(?:novo|new).{0,80}(?:LOCK_REQUEST|lock)[\s\S]{0,200}(?:nenhuma|sem).{0,80}(?:escrita|gravação|promoção).{0,80}(?:antes|prévia)/i],
  ]);
});

// SPECSFY: US-002 FR-010 FR-011 FR-012 FR-013 FR-014 FR-015 FR-016 FR-017 NFR-004 NFR-005 NFR-006 AC-009
test('concede um único lock e reconcilia órfãos de forma idempotente', async () => {
  const repositorySteward = expectAvailable(
    inspectMaestri('role', 'Specsfy Repository Steward'),
    'papel Specsfy Repository Steward',
  );
  expectConcepts(repositorySteward, [
    ['contrato LOCK_REQUEST', /LOCK_REQUEST/],
    ['autoridade técnica do Ramo', /Ramo.{0,80}autoridade.{0,80}lock|autoridade.{0,80}lock.{0,80}Ramo/is],
    ['script executável de lock', /dispatcher-lock\.mjs/],
    ['contrato de lock de intake', /INTAKE_LOCK_REQUEST/],
    ['namespace prospectivo de intake', /INTAKE:<queue_id>|INTAKE.{0,80}queue_id/is],
    ['liberação após captura confirmada', /INTAKE_CAPTURED_RELEASE_REQUEST/],
    ['bloco amarelo não é mutex', /(?:bloco|nota).{0,30}amarel.{0,100}não.{0,40}mutex|não.{0,40}mutex.{0,100}(?:bloco|nota).{0,30}amarel/is],
    ['reconciliação de órfão divergente', /órfão.{0,80}(?:diverg|conflito)|(?:diverg|conflito).{0,80}órfão/is],
  ]);

  const root = mkdtempSync(join(tmpdir(), 'partitura-lock-'));
  const worktree = join(root, 'shared-worktree');
  mkdirSync(worktree);

  try {
    const contenders = [
      { task: '0100-fluxo-a', owner: 'Worker A' },
      { task: '0101-fluxo-b', owner: 'Worker B' },
    ];
    const attempts = await Promise.all(contenders.map(({ task, owner }) => (
      runLockAsync(acquireArgs(root, task, owner, worktree, ['spec.md']))
    )));
    expect(
      attempts.map(({ status }) => status).sort((left, right) => left - right),
      attempts.map(({ stderr, stdout }) => stderr || stdout).join('\n'),
    ).toEqual([0, 2]);
    expect(attempts.filter(({ status }) => status === 0)).toHaveLength(1);
    const winnerIndex = attempts.findIndex(({ status }) => status === 0);
    const loserIndex = attempts.findIndex(({ status }) => status === 2);
    const winner = contenders[winnerIndex];
    const loser = contenders[loserIndex];
    const releasedWinner = runLock([
      'release', '--root', root, '--task', winner.task, '--owner', winner.owner,
    ]);
    expect(releasedWinner.status, releasedWinner.stderr).toBe(0);
    const retryLoser = runLock(acquireArgs(root, loser.task, loser.owner, worktree, ['spec.md']));
    expect(retryLoser.status, retryLoser.stderr).toBe(0);

    const intakePath = 'specs/inbox/20260827-125600-blue-0011-som-volume.md';
    const intake = runLock([
      'acquire',
      '--root', root,
      '--task', 'intake-blue-0011',
      '--owner', 'Worker Intake',
      '--spec', intakePath,
      '--nnnn', 'INTAKE:blue-0011',
      '--worktree', root,
      '--files', JSON.stringify([intakePath]),
    ]);
    expect(intake.status, intake.stderr).toBe(0);
    expect(JSON.parse(intake.stdout)).toMatchObject({
      status: 'ACQUIRED',
      lock: { task_id: 'intake-blue-0011', nnnn: 'INTAKE:blue-0011' },
    });
    const releasedIntake = runLock([
      'release', '--root', root, '--task', 'intake-blue-0011', '--owner', 'Worker Intake',
    ]);
    expect(releasedIntake.status, releasedIntake.stderr).toBe(0);

    const reconcileRoot = mkdtempSync(join(tmpdir(), 'partitura-reconcile-'));
    const liveWorktree = join(reconcileRoot, 'live');
    const cleanWorktree = join(reconcileRoot, 'clean');
    const divergentWorktree = join(reconcileRoot, 'divergent');
    for (const path of [liveWorktree, cleanWorktree, divergentWorktree]) mkdirSync(path);

    try {
      const acquisitions = [
        runLock(acquireArgs(reconcileRoot, '0200-live', 'Vivo', liveWorktree, ['live.md'])),
        runLock(acquireArgs(reconcileRoot, '0201-clean', 'Sumido Limpo', cleanWorktree, ['clean.md'])),
        runLock(acquireArgs(reconcileRoot, '0202-dirty', 'Sumido Divergente', divergentWorktree, ['dirty.md'])),
      ];
      expect(acquisitions.map(({ status }) => status)).toEqual([0, 0, 0]);

      const states = JSON.stringify({
        [cleanWorktree]: 'clean',
        [divergentWorktree]: 'divergent',
      });
      const reconcileArgs = [
        'reconcile',
        '--root', reconcileRoot,
        '--live-owners', JSON.stringify(['Vivo']),
        '--worktree-states', states,
      ];
      const first = runLock(reconcileArgs);
      const afterFirst = runLock(['list', '--root', reconcileRoot]);
      const second = runLock(reconcileArgs);
      const afterSecond = runLock(['list', '--root', reconcileRoot]);
      expect(first.status, first.stderr).toBe(0);
      expect(second.status, second.stderr).toBe(0);
      expect(afterFirst.status, afterFirst.stderr).toBe(0);
      expect(afterSecond.status, afterSecond.stderr).toBe(0);

      const firstPayload = JSON.parse(first.stdout);
      const secondPayload = JSON.parse(second.stdout);
      expect(firstPayload.released).toEqual(['0201-clean']);
      expect(firstPayload.conflicts).toEqual(['0202-dirty']);
      expect(secondPayload.released).toEqual([]);
      expect(secondPayload.conflicts).toEqual(['0202-dirty']);
      expect(JSON.parse(afterSecond.stdout)).toEqual(JSON.parse(afterFirst.stdout));

      const listed = runLock(['list', '--root', reconcileRoot]);
      expect(listed.status, listed.stderr).toBe(0);
      expect(JSON.parse(listed.stdout).locks.map(({ task_id }) => task_id).sort()).toEqual([
        '0200-live',
        '0202-dirty',
      ]);
    } finally {
      rmSync(reconcileRoot, { recursive: true, force: true });
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}, 15_000);
