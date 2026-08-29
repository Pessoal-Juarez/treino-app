#!/usr/bin/env node
/** Aciona uma passagem do Despachante sem depender do Enter do terminal. */
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { terminalIsBusy } from './terminal-state.mjs';

const SCHEMA_VERSION = 1;
const TARGET = 'Despachante';
const WORKER_TTL_MS = 20 * 60 * 1000;
const REQUIRED_RUNTIME = [
  'MAESTRI_DATA_DIR',
  'MAESTRI_PIPE',
  'MAESTRI_TERMINAL_ID',
  'MAESTRI_WORKSPACE_ID',
];
const scriptPath = fileURLToPath(import.meta.url);
const cliArgs = process.argv.slice(2);

const PROMPT = [
  'Execute exatamente uma passagem curta e idempotente do papel Specsfy Queue Dispatcher.',
  'Releia integralmente as notas Pedidos para o Orquestrador, Ações que preciso de você e Specsfy - Operação;',
  'reconcilie locks, promova ações rosas concluídas, pule bloqueios, dependências e conflitos e atribua no máximo um item acionável respeitando os tetos.',
  'Não entre em entrevista, implementação ou auditoria; não deixe pergunta interativa; não duplique estados ou ações.',
  'Se houver um marcador inerte da rotina no campo ou no mesmo turno, ignore o marcador e execute somente esta passagem.',
].join(' ');

function valueAfter(flag) {
  const index = cliArgs.indexOf(flag);
  return index >= 0 ? cliArgs[index + 1] : undefined;
}

function emit(payload, exitCode = 0) {
  console.log(JSON.stringify({ schema_version: SCHEMA_VERSION, ...payload }));
  process.exitCode = exitCode;
}

function commandName() {
  if (process.env.MAESTRI_CLI) return process.env.MAESTRI_CLI;
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    const installed = resolve(
      process.env.LOCALAPPDATA,
      'Programs',
      'Maestri',
      'resources',
      'cli',
      'maestri.exe',
    );
    if (existsSync(installed)) return installed;
  }
  return process.platform === 'win32' ? 'maestri.exe' : 'maestri';
}

function acquireWorkerLock(lockPath) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const descriptor = openSync(lockPath, 'wx');
      writeFileSync(descriptor, JSON.stringify({
        schema_version: SCHEMA_VERSION,
        pid: process.pid,
        started_at: new Date().toISOString(),
      }));
      return descriptor;
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
      const age = Date.now() - statSync(lockPath).mtimeMs;
      if (age <= WORKER_TTL_MS || attempt > 0) return null;
      rmSync(lockPath, { force: true });
    }
  }
  return null;
}

function writeState(path, payload) {
  writeFileSync(path, `${JSON.stringify({
    schema_version: SCHEMA_VERSION,
    observed_at: new Date().toISOString(),
    ...payload,
  }, null, 2)}\n`, 'utf8');
}

function deliveryEvidence(before, after) {
  const normalize = (value) => String(value || '').replace(/\r\n/g, '\n').trim();
  const previous = normalize(before);
  const response = normalize(after);
  const responseChanged = Boolean(response) && response !== previous;
  const promptObserved = response.includes(PROMPT.slice(0, 72));
  const activityObserved = /(?:^|\n)\s*•\s+(?!(?:You have|Session renamed|Working|Ran|Running|Waited)\b).+/imu.test(response);
  return {
    response,
    responseChanged,
    promptObserved,
    activityObserved,
    confirmed: responseChanged && promptObserved && activityObserved,
  };
}

function runtimeIdentity(root) {
  const environment = Object.fromEntries(
    REQUIRED_RUNTIME
      .filter((name) => typeof process.env[name] === 'string' && process.env[name])
      .map((name) => [name, process.env[name]]),
  );
  if (REQUIRED_RUNTIME.every((name) => environment[name])) {
    return { source: 'environment', environment };
  }
  const runtimePath = resolve(root, '.maestri', 'dispatcher', 'runtime.json');
  try {
    const registered = JSON.parse(readFileSync(runtimePath, 'utf8'));
    if (
      registered.schema_version === SCHEMA_VERSION
      && registered.maestri_env
      && REQUIRED_RUNTIME.every((name) => typeof registered.maestri_env[name] === 'string' && registered.maestri_env[name])
    ) {
      return {
        source: 'registered',
        environment: Object.fromEntries(REQUIRED_RUNTIME.map((name) => [name, registered.maestri_env[name]])),
      };
    }
  } catch {
    // Ausência ou formato inválido permanece explícito como identidade ausente.
  }
  return { source: 'absent', environment: {} };
}

function registerRuntime(root, dryRun) {
  const identity = runtimeIdentity(root);
  if (identity.source !== 'environment') {
    emit({
      status: 'ERROR',
      delivered: false,
      runtime_identity: identity.source,
      error: 'MAESTRI_PIPE não está disponível para registrar o runtime local',
    }, 1);
    return;
  }
  if (dryRun) {
    emit({ status: 'REGISTER_DRY_RUN', runtime_identity: 'environment' });
    return;
  }

  const runtimeDirectory = resolve(root, '.maestri', 'dispatcher');
  mkdirSync(runtimeDirectory, { recursive: true });
  writeFileSync(resolve(runtimeDirectory, 'runtime.json'), `${JSON.stringify({
    schema_version: SCHEMA_VERSION,
    maestri_env: identity.environment,
    registered_at: new Date().toISOString(),
    terminal: process.env.MAESTRI_TERMINAL_NAME || 'local-maestro',
  }, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
  emit({ status: 'RUNTIME_REGISTERED', runtime_identity: 'environment' });
}

function runWorker(root, maestri, askArgs) {
  const stateDirectory = resolve(root, '.maestri', 'dispatcher');
  const lockPath = resolve(stateDirectory, 'wake.lock');
  const statePath = resolve(stateDirectory, 'wake.last.json');
  mkdirSync(stateDirectory, { recursive: true });

  let descriptor;
  try {
    descriptor = acquireWorkerLock(lockPath);
    if (descriptor === null) {
      const payload = { status: 'ALREADY_RUNNING', delivered: false, target: TARGET };
      writeState(statePath, payload);
      emit(payload);
      return;
    }

    const check = spawnSync(maestri, ['check', TARGET], {
      encoding: 'utf8',
      windowsHide: true,
      timeout: 30_000,
      maxBuffer: 2 * 1024 * 1024,
    });
    if (check.status === 0 && terminalIsBusy(`${check.stdout}\n${check.stderr}`)) {
      const payload = { status: 'BUSY_SKIPPED', delivered: false, target: TARGET };
      writeState(statePath, payload);
      emit(payload);
      return;
    }

    const result = spawnSync(maestri, askArgs, {
      encoding: 'utf8',
      windowsHide: true,
      timeout: 660_000,
      maxBuffer: 4 * 1024 * 1024,
    });
    if (result.error || result.status !== 0) {
      const payload = {
        status: 'ERROR',
        delivered: false,
        target: TARGET,
        error: result.error?.message || result.stderr?.trim() || `maestri ask saiu ${result.status}`,
      };
      writeState(statePath, payload);
      emit(payload, 1);
      return;
    }

    const evidence = deliveryEvidence(check.stdout, result.stdout);
    if (!evidence.confirmed) {
      const payload = {
        status: 'NOT_READY',
        delivered: false,
        target: TARGET,
        response_changed: evidence.responseChanged,
        prompt_observed: evidence.promptObserved,
        activity_observed: evidence.activityObserved,
        error: 'terminal não confirmou a passagem; nova tentativa permanece pendente',
        response: evidence.response,
      };
      writeState(statePath, payload);
      emit(payload, 1);
      return;
    }

    const payload = {
      status: 'COMPLETED',
      delivered: true,
      target: TARGET,
      response: evidence.response,
    };
    writeState(statePath, payload);
    emit(payload);
  } catch (error) {
    const payload = {
      status: 'ERROR',
      delivered: false,
      target: TARGET,
      error: error instanceof Error ? error.message : String(error),
    };
    try { writeState(statePath, payload); } catch { /* O stdout preserva o diagnóstico. */ }
    emit(payload, 1);
  } finally {
    if (descriptor !== undefined && descriptor !== null) closeSync(descriptor);
    if (descriptor !== undefined && descriptor !== null) rmSync(lockPath, { force: true });
  }
}

const root = resolve(valueAfter('--root') || process.env.MAESTRI_WORKSPACE_DIR || process.cwd());
const maestri = valueAfter('--maestri') || commandName();
const askArgs = ['ask', TARGET, PROMPT, '--timeout', '600'];
const identity = runtimeIdentity(root);

if (cliArgs.includes('--register-runtime')) {
  registerRuntime(root, cliArgs.includes('--dry-run'));
} else if (cliArgs.includes('--dry-run')) {
  emit({
    status: 'DRY_RUN',
    target: TARGET,
    command: maestri,
    args: askArgs,
    prompt: PROMPT,
    root,
    detached: true,
    runtime_identity: identity.source,
    required_runtime: REQUIRED_RUNTIME,
  });
} else if (cliArgs.includes('--worker')) {
  if (identity.source === 'absent') {
    emit({
      status: 'ERROR',
      delivered: false,
      target: TARGET,
      runtime_identity: 'absent',
      error: 'MAESTRI_PIPE ausente e runtime local não registrado',
    }, 1);
  } else {
    runWorker(root, maestri, askArgs);
  }
} else {
  if (identity.source === 'absent') {
    emit({
      status: 'ERROR',
      delivered: false,
      target: TARGET,
      runtime_identity: 'absent',
      error: 'MAESTRI_PIPE ausente e runtime local não registrado',
    }, 1);
  } else try {
    const child = spawn(process.execPath, [
      scriptPath,
      '--worker',
      '--root', root,
      '--maestri', maestri,
    ], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
      env: { ...process.env, ...identity.environment },
    });
    await new Promise((resolveSpawn, rejectSpawn) => {
      child.once('spawn', resolveSpawn);
      child.once('error', rejectSpawn);
    });
    child.unref();
    emit({
      status: 'STARTED',
      delivered: 'pending',
      target: TARGET,
      worker_pid: child.pid,
      detached: true,
    });
  } catch (error) {
    emit({
      status: 'ERROR',
      delivered: false,
      target: TARGET,
      error: error instanceof Error ? error.message : String(error),
    }, 1);
  }
}
