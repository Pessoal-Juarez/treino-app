#!/usr/bin/env node
/**
 * Importa o MVP como M01 e cria Inboxes e backlogs candidatos para cada tema
 * encontrado. Os backlogs permanecem em Captured até a entrevista do usuário.
 */

import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const skillRoot = dirname(fileURLToPath(import.meta.url));
const inboxScript = resolve(skillRoot, "../../specsfy-01-inbox/scripts/capturar_inbox.mjs");
const backlogScript = resolve(skillRoot, "../../specsfy-02-backlog/scripts/iniciar_backlog.mjs");

function fail(message) { throw new Error(message); }

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--")) fail(`argumento inválido: ${key}`);
    if (value === undefined || value.startsWith("--")) fail(`valor ausente para ${key}`);
    values[key.slice(2)] = value;
    index += 1;
  }
  return values;
}

function containsSensitiveData(content) {
  return /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*\S+/iu.test(content);
}

function slug(value) {
  const result = value.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-+|-+$/gu, "");
  return result || "tema-do-mvp";
}

function titleFromTheme(theme, index) {
  const firstLine = theme.split(/\r?\n/u).find((line) => line.trim())?.replace(/^#+\s*/u, "").trim();
  return firstLine && firstLine.length <= 100 ? firstLine : `Tema ${index} do MVP`;
}

function quotedTheme(theme) {
  return theme.trim().split(/\r?\n/gu).map((line) => `> ${line}`).join("\n");
}

function initialBacklogFields(theme, inboxPath) {
  const evidence = `O MVP declara:\n\n${quotedTheme(theme)}`;
  return {
    idea: theme,
    problem: evidence,
    person: "Não identificada explicitamente no trecho importado do MVP.",
    result: evidence,
    context: `Tema derivado de \`${inboxPath}\` e da milestone \`M01\`.`,
  };
}

function mvpEvidence(inboxPath, theme) {
  return [
    "## Registros confirmados no MVP",
    "",
    `- Inbox de origem: \`${inboxPath}\`.`,
    "- Milestone de origem: `specs/milestones/M01.md`.",
    "- Use o texto abaixo para preencher respostas já declaradas antes de formular perguntas.",
    "- Pergunte somente sobre lacuna, ambiguidade ou contradição que permaneça após a leitura.",
    "",
    "### Trecho importado",
    "",
    quotedTheme(theme),
    "",
  ].join("\n");
}

/** Divide o MVP por seções ou parágrafos sem inventar temas de produto. */
function themes(content) {
  const sections = content
    .split(/(?=^#{2,}\s+)/mu)
    .map((section) => section.trim())
    .filter((section) => section && section.replace(/^#\s+.*$/mu, "").trim());
  if (sections.length > 1) return sections;

  const paragraphs = content.split(/\r?\n\s*\r?\n/gu).map((item) => item.trim()).filter(Boolean);
  return paragraphs.length ? paragraphs : [content.trim()];
}

async function resolveSuperprojectRoot(root) {
  try {
    const { stdout } = await execFileAsync("git", ["-C", root, "rev-parse", "--show-superproject-working-tree"], { encoding: "utf8" });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

async function readMvpSource(root) {
  const localSource = join(root, "MVP.md");
  try {
    return { content: await readFile(localSource, "utf8"), source: localSource };
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  const superprojectRoot = await resolveSuperprojectRoot(root);
  if (!superprojectRoot) fail("MVP.md não encontrado na raiz do projeto");
  const source = join(superprojectRoot, "MVP.md");
  try {
    return { content: await readFile(source, "utf8"), source };
  } catch (error) {
    if (error?.code === "ENOENT") fail("MVP.md não encontrado no projeto nem no repositório pai");
    throw error;
  }
}

async function run(script, args) {
  const { stdout } = await execFileAsync("node", [script, ...args], { encoding: "utf8" });
  return stdout.trim();
}

async function createMilestone(root, source, content) {
  const destination = join(root, "specs", "milestones", "M01.md");
  await mkdir(dirname(destination), { recursive: true });
  const hash = createHash("sha256").update(content).digest("hex");
  const milestone = [
    "# Milestone 1.0",
    "",
    "| Metadado | Valor |",
    "| --- | --- |",
    "| Status | Importada de MVP.md |",
    `| Origem | \`${relative(root, source) || "MVP.md"}\` |`,
    `| Integridade da origem | SHA-256 \`${hash}\` |`,
    "",
    "## Material importado",
    "",
    content.trim(),
    "",
    "## Proveniência e próximos passos",
    "",
    "As Inboxes e os backlogs candidatos derivados desta importação devem ser",
    "entrevistados com `$specsfy-02-backlog` antes de qualquer promoção para spec.",
    "",
  ].join("\n");
  try {
    await writeFile(destination, milestone, { encoding: "utf8", flag: "wx" });
  } catch (error) {
    if (error?.code === "EEXIST") fail("a milestone 1.0 já existe e não será sobrescrita");
    throw error;
  }
  return destination;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = resolve(args.root ?? process.cwd());
  const { content, source } = await readMvpSource(root);
  if (!content.trim()) fail("MVP.md não pode estar vazio");
  if (containsSensitiveData(content)) fail("MVP.md contém dado sensível aparente; remova-o antes de importar");

  const milestone = await createMilestone(root, source, content);
  const session = `MVP-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${slug(source === join(root, "MVP.md") ? "local" : "hub")}`;
  const sources = `- \`${relative(root, source) || "MVP.md"}\`: importado em \`specs/milestones/M01.md\`.`;
  const created = [];

  for (const [index, theme] of themes(content).entries()) {
    const title = titleFromTheme(theme, index + 1);
    const inbox = await run(inboxScript, [
      "--input", theme,
      "--title", title,
      "--session", session,
      "--turn", String(index + 1),
      "--sources", sources,
      "--root", root,
    ]);
    const inboxPath = relative(root, inbox);
    const fields = initialBacklogFields(theme, inboxPath);
    const backlog = await run(backlogScript, [
      "--title", title,
      "--idea", fields.idea,
      "--problem", fields.problem,
      "--person", fields.person,
      "--result", fields.result,
      "--context", fields.context,
      "--root", root,
    ]);
    const backlogContent = await readFile(backlog, "utf8");
    await writeFile(backlog, backlogContent.replace(
      "## Referências relacionadas\n\n- Nenhuma referência relevante encontrada.",
      `${mvpEvidence(inboxPath, theme)}\n## Referências relacionadas\n\n- Inbox de origem: \`${inboxPath}\`.\n- Milestone de origem: \`specs/milestones/M01.md\`.\n- Refinamento obrigatório: \`$specsfy-02-backlog\` somente para lacunas, ambiguidades ou contradições antes de promoção.`,
    ), "utf8");
    created.push({ inbox: inboxPath, backlog: relative(root, backlog) });
  }

  console.log(JSON.stringify({ milestone: relative(root, milestone), session, items: created }, null, 2));
}

main().catch((error) => {
  console.error(`erro: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
