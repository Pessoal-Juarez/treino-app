#!/usr/bin/env node

import { createHash } from 'node:crypto';
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const LOCK_SCHEMA = 1;
const LOCK_DIRECTORY = join('.maestri', 'locks');

function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}

function normalizeText(value, label) {
  const normalized = String(value ?? '').trim();
  if (!normalized) throw new Error(`${label} obrigatório`);
  return normalized;
}

function parseJson(value, label) {
  try {
    return JSON.parse(normalizeText(value, label));
  } catch (error) {
    throw new Error(`${label} inválido: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function lockPaths(root) {
  const projectRoot = resolve(root);
  const base = join(projectRoot, LOCK_DIRECTORY);
  const tasks = join(base, 'tasks');
  const resources = join(base, 'resources');
  mkdirSync(tasks, { recursive: true });
  mkdirSync(resources, { recursive: true });
  return { projectRoot, base, tasks, resources };
}

function normalizePath(base, value, label) {
  const path = resolve(base, normalizeText(value, label));
  return process.platform === 'win32' ? path.toLowerCase() : path;
}

function normalizeFiles(worktree, files) {
  if (!Array.isArray(files) || files.length === 0) throw new Error('files deve ser um array JSON não vazio');
  return [...new Set(files.map((file) => normalizePath(worktree, file, 'arquivo')))].sort();
}

function resourceKeys(metadata) {
  return [
    `task:${metadata.task_id}`,
    `spec:${metadata.spec}`,
    `nnnn:${metadata.nnnn}`,
    `worktree:${metadata.worktree}`,
    ...metadata.files.map((file) => `file:${file}`),
  ].sort();
}

function taskPath(paths, taskId) {
  return join(paths.tasks, `${digest(taskId)}.json`);
}

function resourcePath(paths, key) {
  return join(paths.resources, `${digest(key)}.json`);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeExclusive(path, payload) {
  mkdirSync(dirname(path), { recursive: true });
  const descriptor = openSync(path, 'wx');
  try {
    writeFileSync(descriptor, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  } finally {
    closeSync(descriptor);
  }
}

function writeReplace(path, payload) {
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function removeIfOwned(path, taskId) {
  if (!existsSync(path)) return;
  try {
    if (readJson(path).task_id !== taskId) return;
  } catch {
    return;
  }
  unlinkSync(path);
}

export function listLocks(root) {
  const paths = lockPaths(root);
  const locks = readdirSync(paths.tasks, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => readJson(join(paths.tasks, entry.name)))
    .sort((left, right) => left.task_id.localeCompare(right.task_id));
  return { schema_version: LOCK_SCHEMA, status: 'LISTED', locks };
}

export function acquireLock({ root, task, owner, spec, nnnn, worktree, files, timestamp }) {
  const paths = lockPaths(root);
  const normalizedWorktree = normalizePath(paths.projectRoot, worktree, 'worktree');
  const metadata = {
    schema_version: LOCK_SCHEMA,
    state: 'ACTIVE',
    task_id: normalizeText(task, 'task'),
    owner_terminal: normalizeText(owner, 'owner'),
    spec: normalizePath(paths.projectRoot, spec, 'spec'),
    nnnn: normalizeText(nnnn, 'nnnn'),
    worktree: normalizedWorktree,
    files: normalizeFiles(normalizedWorktree, files),
    timestamp: timestamp ?? new Date().toISOString(),
  };
  metadata.resource_keys = resourceKeys(metadata);

  const acquired = [];
  const metadataPath = taskPath(paths, metadata.task_id);
  let intentCreated = false;
  try {
    writeExclusive(metadataPath, { ...metadata, state: 'ACQUIRING' });
    intentCreated = true;
    for (const key of metadata.resource_keys) {
      const path = resourcePath(paths, key);
      writeExclusive(path, {
        schema_version: LOCK_SCHEMA,
        resource: key,
        task_id: metadata.task_id,
        owner_terminal: metadata.owner_terminal,
        timestamp: metadata.timestamp,
      });
      acquired.push(path);
    }
    writeReplace(metadataPath, metadata);
    return { schema_version: LOCK_SCHEMA, status: 'ACQUIRED', lock: metadata };
  } catch (error) {
    for (const path of acquired.reverse()) removeIfOwned(path, metadata.task_id);
    if (intentCreated && existsSync(metadataPath)) unlinkSync(metadataPath);
    if (error && typeof error === 'object' && error.code === 'EEXIST') {
      return {
        schema_version: LOCK_SCHEMA,
        status: 'ADIADA_CONFLITO',
        task_id: metadata.task_id,
        reason: 'recurso já possui lock ativo',
      };
    }
    throw error;
  }
}

export function releaseLock({ root, task, owner, force = false }) {
  const paths = lockPaths(root);
  const id = normalizeText(task, 'task');
  const path = taskPath(paths, id);
  if (!existsSync(path)) {
    return { schema_version: LOCK_SCHEMA, status: 'NOT_FOUND', task_id: id };
  }
  const metadata = readJson(path);
  if (!force && metadata.owner_terminal !== normalizeText(owner, 'owner')) {
    return {
      schema_version: LOCK_SCHEMA,
      status: 'OWNER_MISMATCH',
      task_id: id,
      owner_terminal: metadata.owner_terminal,
    };
  }
  for (const key of [...metadata.resource_keys].reverse()) {
    removeIfOwned(resourcePath(paths, key), id);
  }
  unlinkSync(path);
  return { schema_version: LOCK_SCHEMA, status: 'RELEASED', task_id: id };
}

function normalizedStateMap(states) {
  if (!states || typeof states !== 'object' || Array.isArray(states)) {
    throw new Error('worktree-states deve ser um objeto JSON');
  }
  return new Map(Object.entries(states).map(([path, state]) => [normalizePath(process.cwd(), path, 'worktree state'), state]));
}

function removeOrphanResources(paths, activeTasks) {
  const removed = [];
  for (const entry of readdirSync(paths.resources, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const path = join(paths.resources, entry.name);
    let resource;
    try {
      resource = readJson(path);
    } catch {
      continue;
    }
    if (activeTasks.has(resource.task_id)) continue;
    unlinkSync(path);
    removed.push(resource.resource);
  }
  return removed.sort();
}

export function reconcileLocks({ root, liveOwners, worktreeStates }) {
  if (!Array.isArray(liveOwners)) throw new Error('live-owners deve ser um array JSON');
  const live = new Set(liveOwners.map((owner) => normalizeText(owner, 'live owner')));
  const states = normalizedStateMap(worktreeStates);
  const paths = lockPaths(root);
  const kept = [];
  const released = [];
  const conflicts = [];

  for (const lock of listLocks(root).locks) {
    if (live.has(lock.owner_terminal)) {
      kept.push(lock.task_id);
      continue;
    }
    const worktreeState = states.get(normalizePath(process.cwd(), lock.worktree, 'lock worktree')) ?? 'unknown';
    if (worktreeState === 'clean') {
      releaseLock({ root, task: lock.task_id, owner: lock.owner_terminal, force: true });
      released.push(lock.task_id);
      continue;
    }
    if (lock.state !== 'ADIADA_CONFLITO' || !lock.reconciliation?.action_required) {
      const updated = {
        ...lock,
        state: 'ADIADA_CONFLITO',
        reconciliation: {
          reason: worktreeState === 'divergent' ? 'worktree divergente' : 'estado da worktree não comprovado',
          reconciled_at: new Date().toISOString(),
          action_required: true,
        },
      };
      writeReplace(taskPath(paths, lock.task_id), updated);
    }
    conflicts.push(lock.task_id);
  }

  const activeTasks = new Set(listLocks(root).locks.map((lock) => lock.task_id));
  const orphanResources = removeOrphanResources(paths, activeTasks);
  return {
    schema_version: LOCK_SCHEMA,
    status: 'RECONCILED',
    kept: kept.sort(),
    released: released.sort(),
    conflicts: conflicts.sort(),
    orphan_resources_removed: orphanResources,
  };
}

function parseArguments(argv) {
  const [command, ...tokens] = argv;
  const values = { command };
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith('--')) throw new Error(`argumento inválido: ${token}`);
    const value = tokens[index + 1];
    if (value === undefined || value.startsWith('--')) throw new Error(`valor ausente para ${token}`);
    values[token.slice(2)] = value;
    index += 1;
  }
  return values;
}

function runCli(argv) {
  const args = parseArguments(argv);
  if (!['acquire', 'release', 'list', 'reconcile'].includes(args.command)) {
    throw new Error('comando deve ser acquire, release, list ou reconcile');
  }
  if (args.command === 'acquire') {
    const result = acquireLock({
      root: args.root,
      task: args.task,
      owner: args.owner,
      spec: args.spec,
      nnnn: args.nnnn,
      worktree: args.worktree,
      files: parseJson(args.files, 'files'),
    });
    return { result, exitCode: result.status === 'ACQUIRED' ? 0 : 2 };
  }
  if (args.command === 'release') {
    const result = releaseLock({ root: args.root, task: args.task, owner: args.owner });
    return { result, exitCode: result.status === 'RELEASED' || result.status === 'NOT_FOUND' ? 0 : 2 };
  }
  if (args.command === 'list') {
    return { result: listLocks(args.root), exitCode: 0 };
  }
  const result = reconcileLocks({
    root: args.root,
    liveOwners: parseJson(args['live-owners'], 'live-owners'),
    worktreeStates: parseJson(args['worktree-states'], 'worktree-states'),
  });
  return { result, exitCode: 0 };
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    const { result, exitCode } = runCli(process.argv.slice(2));
    process.stdout.write(`${JSON.stringify(result)}\n`);
    process.exitCode = exitCode;
  } catch (error) {
    process.stderr.write(`${JSON.stringify({
      schema_version: LOCK_SCHEMA,
      status: 'ERROR',
      error: error instanceof Error ? error.message : String(error),
    })}\n`);
    process.exitCode = 1;
  }
}

export function removeLockState(root) {
  rmSync(join(resolve(root), LOCK_DIRECTORY), { recursive: true, force: true });
}
