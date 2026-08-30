// Contrato executável dos papéis ativos e da rotina da Partitura.
import { execFileSync } from 'node:child_process';
import { expect, test } from 'vitest';

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
const show = (kind, name) => execFileSync(maestri, [kind, 'show', name], executionOptions);

const roles = {
  farol: show('role', 'Specsfy Discovery Steward'),
  orquestrador: show('role', 'Specsfy Orchestration Steward v2'),
  prisma: show('role', 'Specsfy Specification Steward'),
  cadencia: show('role', 'Specsfy Delivery Steward'),
};
const rotina = show('routine', 'Monitorar pedidos azul e rosa');

function expectConcepts(text, concepts) {
  for (const [label, pattern] of concepts) {
    expect(text, `contrato ausente: ${label}`).toMatch(pattern);
  }
}

// SPECSFY: US-001 FR-001 FR-002 FR-003 FR-006 FR-008 NFR-001 NFR-002 AC-001
test('aplica a recomendação com precedente como AUTO_CONFIRMADA e a envia ao Prisma', () => {
  expectConcepts(roles.farol, [
    ['identificador', /identificador/i],
    ['opções', /opç(?:ão|ões)/i],
    ['recomendação', /recomendaç(?:ão|ões)/i],
    ['base', /\bbase\b/i],
    ['efeito', /\befeito\b/i],
    ['reversibilidade', /reversibilidade/i],
    ['classe', /\bclasse\b/i],
    ['classificador', /classificador/i],
  ]);
  expectConcepts(roles.orquestrador, [
    ['capacidade de Procurador', /Procurador/i],
    ['precedente explícito', /precedente explícito/i],
    ['estado AUTO_CONFIRMADA', /AUTO_CONFIRMADA/],
    ['registro da escolha', /registr(?:a|e|ar).{0,80}(?:escolha|decisão)/is],
    ['auditoria do Prisma', /Prisma.{0,100}audit/is],
  ]);
});

// SPECSFY: US-001 FR-001 FR-002 FR-003 FR-004 FR-005 FR-006 FR-008 FR-009 NFR-001 NFR-002 NFR-003 AC-002
test('mantém a recomendação segura sem precedente como AUTO_PROVISORIA e reversível', () => {
  expectConcepts(roles.orquestrador, [
    ['estado AUTO_PROVISORIA', /AUTO_PROVISORIA/],
    ['ausência de precedente explícito', /sem precedente|ainda sem precedente/i],
    ['baixo risco', /baixo risco/i],
    ['rollback confiável', /rollback.{0,40}(?:confiável|verificável)|(?:confiável|verificável).{0,40}rollback/is],
    ['resumo final', /resumo final/i],
    ['aprovação observável', /(?:exercício|teste|resultado).{0,80}observável/is],
  ]);
});

// SPECSFY: US-001 FR-001 FR-003 FR-004 FR-005 FR-007 FR-008 FR-009 NFR-001 NFR-003 AC-003
test('encerra a lacuna sem base após uma devolução com o menor experimento reversível', () => {
  expectConcepts(roles.orquestrador, [
    ['uma única devolução', /(?:uma|1) (?:única )?devolução|devolv(?:a|e|er).{0,80}(?:uma|1) (?:única )?vez/is],
    ['estado SEM_BASE', /SEM_BASE/],
    ['menor experimento reversível', /menor experimento reversível/i],
    ['fim do ciclo', /(?:não inicia|sem iniciar|encerra).{0,60}(?:novo|outro|o) ciclo/is],
  ]);
  expectConcepts(roles.cadencia, [
    ['auditoria antes do efeito', /Prisma.{0,100}(?:antes do efeito|antes de (?:executar|implementar|alterar))/is],
  ]);
});

// SPECSFY: US-001 FR-002 FR-004 FR-005 FR-007 FR-008 NFR-003 AC-004
test('bloqueia todos os riscos duros como HUMANA_ANTES sem produzir efeito', () => {
  expectConcepts(roles.orquestrador, [
    ['estado HUMANA_ANTES', /HUMANA_ANTES/],
    ['destrutivo ou irreversível', /destrutiv.{0,30}irreversível/is],
    ['dados reais protegidos', /dados reais.{0,100}backup.{0,80}rollback/is],
    ['gasto e credencial', /gasto.{0,60}credencial/is],
    ['privacidade e segurança', /privacidade.{0,60}segurança/is],
    ['publicação e produção', /publicação.{0,60}produção/is],
    ['efeito externo', /efeito externo/i],
    ['mudança material de propósito ou escopo', /mudança material.{0,50}(?:propósito|escopo)/is],
    ['conflito humano', /conflito.{0,60}(?:texto|decisão) humana/is],
    ['rollback não confiável', /rollback não confiável/i],
  ]);
  expectConcepts(rotina, [
    ['ação rosa para HUMANA_ANTES', /HUMANA_ANTES.{0,160}(?:rosa|pessoa)|(?:rosa|pessoa).{0,160}HUMANA_ANTES/is],
    ['nenhum efeito antes da resposta', /(?:não|nenhum).{0,60}efeito.{0,80}(?:antes|sem).{0,40}(?:resposta|confirmação)/is],
  ]);
});

// SPECSFY: US-001 FR-004 NFR-003 AC-004
test('traduz cada pendência rosa para uma decisão curta e fácil de responder', () => {
  expectConcepts(roles.orquestrador, [
    ['uma decisão por item', /uma (?:única )?decisão (?:por (?:item|pendência)|de cada vez)/i],
    ['linguagem cotidiana', /(?:português|linguagem)(?: do Brasil)? (?:cotidian|simples)/i],
    ['ordem do resumo rosa', /O que preciso de você.{0,220}Minha recomendação.{0,220}Responda.{0,220}Por quê/is],
    ['recomendação primeiro', /recomendaç(?:ão|ões).{0,80}(?:primeiro|antes)/is],
    ['confirmação Aprovo', /(?:peça|responda|resposta).{0,80}`?Aprovo`?/is],
    ['limite de seis linhas', /(?:até|no máximo) (?:seis|6) linhas/i],
    ['limite de três alternativas', /(?:até|no máximo) (?:três|3) alternativas (?:materiais|materialmente distintas)/i],
    ['detalhes técnicos na operação', /(?:IDs?|hashes|gates|locks).{0,240}Specsfy - Operação/is],
    ['entrevista numerada preservada', /(?:contrato|menu).{0,100}numerad.{0,180}(?:separad|preserv)/is],
    ['segurança preservada', /(?:não|nunca).{0,100}(?:remove|enfraquece|substitui).{0,120}HUMANA_ANTES/is],
  ]);
});

// SPECSFY: US-001 FR-004 FR-006 FR-007 FR-008 NFR-002 AC-005
test('faz o Prisma auditar uma decisão tardia antes do efeito e sem autoauditoria', () => {
  expectConcepts(roles.prisma, [
    ['auditoria de decisões delegadas nos gates', /decis(?:ão|ões) delegad.{0,120}(?:Definition|Delivery).{0,80}Gate/is],
    ['auditoria tardia antes do efeito', /após o Definition Gate.{0,160}antes de produzir efeito|decisão tardia.{0,160}antes do efeito/is],
    ['poder de reclassificar', /reclassific/i],
    ['base e reversibilidade', /\bbase\b.{0,100}reversibilidade|reversibilidade.{0,100}\bbase\b/is],
  ]);
  expectConcepts(roles.orquestrador, [
    ['proibição de autoauditoria', /não (?:audita|valida).{0,80}(?:própria|sua) (?:escolha|decisão)|não faz autoauditoria/is],
  ]);
  expectConcepts(roles.cadencia, [
    ['parada apenas da fatia afetada', /(?:pare|interrompa|suspenda).{0,80}(?:somente|apenas).{0,60}(?:fatia|trabalho) afetad/is],
    ['nenhuma alteração antes do Prisma', /não.{0,60}(?:altere|implemente|produza efeito).{0,100}Prisma/is],
  ]);
});

// SPECSFY: US-001 FR-008 FR-009 NFR-002 AC-006
test('usa o teste final para aprender sem confirmar decisões não observadas', () => {
  expectConcepts(roles.orquestrador, [
    ['resumo das provisórias e sem base', /resumo final.{0,180}AUTO_PROVISORIA.{0,120}SEM_BASE|AUTO_PROVISORIA.{0,120}SEM_BASE.{0,180}resumo final/is],
    ['somente exercício observável confirma precedente', /(?:somente|apenas).{0,80}(?:exercício|teste|resultado) observável.{0,120}(?:precedente|confirm)/is],
    ['não observada permanece provisória', /(?:não observad|não exercitad).{0,100}(?:permanece|continua).{0,60}provisóri/is],
    ['feedback contrário por update-spec', /feedback contrário.{0,120}(?:specsfy-)?update-spec|(?:specsfy-)?update-spec.{0,120}feedback contrário/is],
    ['atualização da preferência canônica', /preferência canônica.{0,80}(?:atualiz|corrig)|(?:atualiz|corrig).{0,80}preferência canônica/is],
  ]);
});
