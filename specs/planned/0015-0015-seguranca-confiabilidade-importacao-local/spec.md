# Especificação integrada: Correções de segurança e confiabilidade da importação local

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0015 |
| Slug | 0015-0015-seguranca-confiabilidade-importacao-local |
| Status | Planned |
| Effort | 7 |
| Effort updated at | 2026-08-29 |
| Effort rationale | Quatro regressões de segurança, persistência, ciclo de vida e PWA em fontes HTML compartilhadas. |
| ClickUp Task | |
| Milestones | |
| Definition Gate | Passed |
| Plan Gate | Passed |
| Delivery Gate | Pending |
| Evidence Contract | 1 |
| Atualizada em | 2026-08-29 |

## Ato I — Definir

### 1. Problema e resultado

#### Problema

> O revisor independente bloqueou o PR com quatro achados. Verifiquei-os contra o código e as specs; todos procedem.
>
> 1. CRITICAL XSS: index.html e standalone, por volta de 1638–1643/1687/1970. targetReps importado pode conter markup e entra em innerHTML/atributos do runner. O revisor reproduziu com '3 séries x 12 <img ... onerror=...>' e o nó img apareceu.
>
> 2. IMPORTANT stale preview: openWorkoutImport mantém draft válido após editar textarea ou trocar para arquivo inválido, e Confirmar grava o treino antigo.
>
> 3. IMPORTANT Wake Lock restaurado: com state.keepAwakeEnabled=true após recarga, iniciar treino não chama navigator.wakeLock.request.
>
> 4. IMPORTANT offline PDF: sw.js não precacheia vendor/pdfjs-dist-5.4.54/pdf.min.mjs nem pdf.worker.min.mjs.

#### Resultado desejado

Valores importados permanecem texto em todos os sinks do runner; a confirmação só grava a prévia atual; a preferência Wake Lock restaurada acompanha treino ativo; e PDF.js local fica disponível em cache frio offline.

#### Métricas de sucesso

- Quatro REDs comportamentais e GREENs nas duas variantes, sem backend, rede runtime ou alteração de dados existentes.

### 2. Research e esclarecimentos

#### Researchs executados

- **R-001** [critical] sinks importados no runner — Verdict: verified — Confidence: high — Evidence: `index.html` `renderRunnerExercise`, `openSkippedModal` e `openExerciseOverviewDrawer` — Budget: 1/1.
- **R-002** [critical] prévia, lifecycle e Service Worker — Verdict: verified — Confidence: high — Evidence: `openWorkoutImport`, `startWorkoutByKey`, `toggleWakeLock` e `sw.js` — Budget: 1/1.

#### Fontes e contexto consultados

- SPEC-0009, SPEC-0010, SPEC-0014, ambos os HTMLs, `sw.js` e suites Vitest locais.

#### Documentação consultada

- Nenhuma fonte externa.

#### Artefatos de pesquisa armazenados

- Nenhum artefato externo.

#### Dúvidas respondidas

- **Q**: como preservar specs concluídas? → **A**: SPEC-0015 é sucessora e os adendos de impacto foram acrescentados a SPEC-0009, SPEC-0010 e SPEC-0014.

#### Dúvidas abertas

- Nenhuma.

### 3. Escopo e atores

#### Incluído

- Sinks DOM seguros, invalidação de draft, lifecycle Wake Lock e precache local dos módulos PDF.

#### Fora de escopo

- Backend, upload, CDN, rede runtime, sanitização parcial por regex, deploy e produção.

#### Atores

- **Pessoa que importa treino local**: revisa e usa o próprio treino sem executar markup, confirmar conteúdo antigo ou perder PDF offline.

### 4. Princípios e restrições do projeto

- **PR-001**: dados importados/persistidos são texto em APIs DOM seguras; nunca são interpolados em HTML ou atributos executáveis.
- **PR-002**: os dois HTMLs têm paridade literal e o fluxo continua local.

### 5. Histórias de usuário

#### US-001 — Usar importação local segura e confiável (P1)

Como pessoa que configura seu treino local, quero que importação, runner, Wake Lock e PDF offline se comportem com segurança após recarga, para não executar conteúdo, perder a revisão nem ficar sem o fluxo offline.

**Por que P1**: XSS bloqueia o PR e os demais defeitos comprometem confirmação, tela ligada e PWA.
**Teste independente**: Vitest/JSDOM importação→confirmação→runner/overview, prévia obsoleta, lifecycle e cache frio.
**Requisitos**: FR-001, NFR-001.

### 6. Cenários BDD de aceite

#### AC-001 — Valor importado permanece literal no runner

**Cobre**: US-001, FR-001, NFR-001

```gherkin
Scenario: importar repetição com markup
 Given uma prévia local válida cujo volume contém img, svg e script
 When a pessoa confirma, inicia o runner e abre a visão geral
 Then nenhum nó executável é criado e o valor aparece como texto ou valor literal
```

#### AC-002 — Prévia antiga não é confirmável

**Cobre**: US-001, FR-001, NFR-001

```gherkin
Scenario: editar ou trocar arquivo após prévia válida
 Given uma prévia válida ainda aberta
 When o texto muda ou um arquivo inválido é selecionado
 Then Confirmar fica indisponível e nenhuma importação antiga é gravada
```

#### AC-003 — Wake Lock acompanha runner restaurado

**Cobre**: US-001, FR-001, NFR-001

```gherkin
Scenario: iniciar treino com preferência restaurada
 Given keepAwakeEnabled local é verdadeiro
 When o runner inicia ou a aba volta visível durante treino ativo
 Then request screen ocorre quando necessário e ausência, rejeição ou liberação não quebra a interface
```

#### AC-004 — PDF local abre offline a frio

**Cobre**: US-001, FR-001, NFR-001

```gherkin
Scenario: cache frio do PWA
 Given o Service Worker instala sem rede de runtime
 When pdf.min.mjs ou pdf.worker.min.mjs é requisitado offline
 Then ambos são servidos pelo cache de versão nova
```

### 7. Requisitos

#### Funcionais

- **FR-001**: o fluxo local deve tratar campos importados/persistidos como texto, exigir prévia correspondente na confirmação, restaurar Wake Lock somente com runner ativo e precachear os módulos PDF locais.

#### Não funcionais

- **NFR-001**: não há HTML executável oriundo de importação, CDN ou rede runtime; ambas as variantes permanecem equivalentes e falhas de Wake Lock não quebram a interface. **Verificação**: Vitest, diff e contrato local do Service Worker.

#### Erros e casos-limite

- Texto/arquivo inválido, API Wake Lock ausente/rejeitada e rede indisponível → zero escrita incorreta, interface utilizável e fallback local.

## Ato II — Projetar e provar

### 8. Plano técnico

#### Contexto existente

- HTML5/CSS/JavaScript, localStorage, Vitest/JSDOM e Service Worker local.

#### Arquitetura e módulos

- Os HTMLs usam `createElement`, `textContent`, `value` e listeners para os sinks do runner; `openWorkoutImport` vincula draft ao texto pré-visualizado; runner/visibilidade controlam Wake Lock; `sw.js` precacheia PDF.js.

#### Migrations

- Não aplicável; não muda schema nem chaves locais.

#### Models

- Prévia é transitória e importações/estado existentes continuam compatíveis.

#### Controllers e casos de uso

- `openWorkoutImport`, `startWorkoutByKey`, `toggleWakeLock` e fetch do Service Worker.

#### Views e experiência

- Confirmar inicia disabled e só é reabilitado por prévia válida atual; controles disabled preservam contraste, 16 px e 44 px.

#### Queries e repositórios

- Não aplicável.

#### Jobs e processamento assíncrono

- Leitura PDF e Wake Lock são assíncronos, sem retry de rede.

#### Estrutura de arquivos

```text
specs/draft/0015-0015-seguranca-confiabilidade-importacao-local/spec.md
index.html
treino_hibrido_juarez_v3_standalone.html
sw.js
tests/workout-import.test.js
tests/keep-awake-preference.test.js
tests/service-worker-offline.test.js
```

### 9. Modelo de dados

#### Entidades

| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| Prévia transitória | texto pré-visualizado | draft só confirma se texto atual é idêntico; erro/edição limpa draft | importação local |
| Preferência Wake Lock | `keepAwakeEnabled` | booleano local, efeito só com runner ativo | estado local |

#### Estados e transições

| Entidade | Estado atual | Evento | Próximo estado | Invariantes |
| --- | --- | --- | --- | --- |
| Prévia | válida | input/arquivo muda | inválida | Confirmar disabled, sem escrita |
| Wake Lock | preferência restaurada | iniciar/visibilidade ativa | solicitado | falha segura sem runner ativo |

#### Migração e retenção

- Não aplicável; estado e importações existentes são preservados.

### 10. Interfaces e contratos

#### APIs expostas

- Eventos DOM locais de importação, runner e `visibilitychange`.

#### APIs externas utilizadas

- Wake Lock e Cache Storage do navegador, com fallback local seguro.

#### Documentação das APIs consultadas

- Nenhuma fonte externa nesta correção.

#### Eventos e outros contratos

- Confirmar aceita somente o texto que gerou a prévia; fetch offline responde do cache PDF frio.

### 11. Estratégia TDD

- **Unidade**: Vitest/JSDOM para importação, runner e Wake Lock; contrato em memória para Service Worker.
- **Integração/contrato**: importação→confirmação→runner→visão geral e install/fetch offline.
- **BDD/aceite**: AC-001 a AC-004.
- **Runner TDD**: Vitest pelo script existente `npm run test:tdd`.
- **E2E**: PWA offline local somente se houver mecanismo confiável; nenhum portal adicional é necessário para este contrato local.
- **Verificação manual**: não exigida para o gate.

#### Evidência RED-GREEN-REFACTOR

| IDs | BDD de referência | Teste TDD informado pelo BDD | RED observado | GREEN observado | Refactor/regressão |
| --- | --- | --- | --- | --- | --- |
| US-001, FR-001, NFR-001, AC-001 | AC-001 | `tests/workout-import.test.js` | 2 falhas: `HTMLImageElement` apareceu | 2/2 verde, sem img/svg/script | focais 58/58 |
| US-001, FR-001, NFR-001, AC-002 | AC-002 | `tests/workout-import.test.js` | 2 falhas: Confirmar habilitado | 2/2 verde, draft invalidado | focais 58/58 |
| US-001, FR-001, NFR-001, AC-003 | AC-003 | `tests/keep-awake-preference.test.js` | 2 timeouts: request ausente | 2/2 verde, lifecycle seguro | focais 58/58 |
| US-001, FR-001, NFR-001, AC-004 | AC-004 | `tests/service-worker-offline.test.js` | 1 falha: módulos ausentes | 1/1 verde, cache `v7` | focais 58/58 |
| US-001, FR-001, NFR-001, AC-001 | AC-001 | `tests/html-byte-parity.test.js` | 1 falha: `Buffer.compare` retornou -1 após quatro CRLF extras | 1/1 verde, 112332 bytes idênticos | regressão de produto pendente |

### 12. Plano de testes e rastreabilidade

| Requisito | Cenário BDD | Nível | Arquivo/comando esperado | Evidência |
| --- | --- | --- | --- | --- |
| FR-001, NFR-001 | AC-001 | JSDOM | `tests/workout-import.test.js` | Passed — GREEN nas duas variantes, nenhum img/svg/script e valor literal. |
| FR-001, NFR-001 | AC-002 | JSDOM | `tests/workout-import.test.js` | Passed — edição ou arquivo inválido desabilita Confirmar e não grava. |
| FR-001, NFR-001 | AC-003 | JSDOM | `tests/keep-awake-preference.test.js` | Passed — request, release e visibilidade segura nas duas variantes. |
| FR-001, NFR-001 | AC-004 | contrato | `tests/service-worker-offline.test.js` | Passed — cache frio local serve `pdf.min.mjs` e worker da versão v7. |

### 13. Validações

#### Gate do Ato I — Definição

- **Resultado**: Passed.
- **Comando**: `node .agents/skills/specsfy-04-validate/scripts/validate_spec.mjs specs/draft/0015-0015-seguranca-confiabilidade-importacao-local/spec.md --allow-draft`.
- **Achados**: 2026-08-29 — `VALID DRAFT`; as quatro ACs cobrem US-001, FR-001 e NFR-001, sem decisão aberta.

#### Gate do Ato II — Plano

- **Resultado**: Passed.
- **Comando**: `node .agents/skills/specsfy-05-tasks/scripts/validate_tasks.mjs specs/defined/0015-0015-seguranca-confiabilidade-importacao-local/spec.md --allow-draft`.
- **Achados**: 2026-08-29 — `VALID DRAFT`, 9 tarefas completas, 4 predecessoras TDD e 45/45 checklists concluídos.

#### Gate do Ato III — Entrega

- **Resultado**: Pending.
- **Comando**: focais, integral, aceite, full-chain, paridade, documentação, monitor e diff.
- **Achados**: integral deste terminal: 166 testes de produto verdes; 4 falhas externas da Partitura pois não é Maestro.

### 14. Tarefas

- [x] T001 [TEST] [TDD] [US-001] RED XSS importação→runner/overview em `tests/workout-import.test.js` — Refs: US-001, FR-001, NFR-001, AC-001 — Depends: none
  - [x] **PREP**: Sinks rastreados.
  - [x] **EXECUTE**: Carga img/svg/script confirmada e iniciada.
  - [x] **VERIFY**: RED 2 falhas, `img` observado.
  - [x] **EVIDENCE**: focal exit 1 na seção 11.
  - [x] **IMPROVE**: runner e overview cobertos.
- [x] T002 [TEST] [TDD] [US-001] RED de prévia obsoleta em `tests/workout-import.test.js` — Refs: US-001, FR-001, NFR-001, AC-002 — Depends: none
  - [x] **PREP**: fluxos texto/arquivo definidos.
  - [x] **EXECUTE**: prévia válida foi editada.
  - [x] **VERIFY**: RED 2 falhas, Confirmar habilitado.
  - [x] **EVIDENCE**: focal exit 1 na seção 11.
  - [x] **IMPROVE**: zero escrita coberta.
- [x] T003 [TEST] [TDD] [US-001] RED Wake Lock restaurado em `tests/keep-awake-preference.test.js` — Refs: US-001, FR-001, NFR-001, AC-003 — Depends: none
  - [x] **PREP**: estado e capability definidos.
  - [x] **EXECUTE**: runner e visibilidade disparados.
  - [x] **VERIFY**: RED 2 timeouts por request ausente.
  - [x] **EVIDENCE**: focal exit 1 na seção 11.
  - [x] **IMPROVE**: release, ausência e inatividade cobertos.
- [x] T004 [TEST] [TDD] [US-001] RED cache frio em `tests/service-worker-offline.test.js` — Refs: US-001, FR-001, NFR-001, AC-004 — Depends: none
  - [x] **PREP**: contrato install/fetch definido.
  - [x] **EXECUTE**: fetch offline foi exercitado.
  - [x] **VERIFY**: RED 1 falha, módulos ausentes.
  - [x] **EVIDENCE**: focal exit 1 na seção 11.
  - [x] **IMPROVE**: sem rede disponível.
- [x] T005 [CODE] [US-001] Construir sinks seguros em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, FR-001, NFR-001, AC-001 — Depends: T001, T002, T003
  - [x] **PREP**: RED T001 confirmado.
  - [x] **EXECUTE**: runner/listas usam DOM seguro.
  - [x] **VERIFY**: GREEN 2/2.
  - [x] **EVIDENCE**: focal exit 0.
  - [x] **IMPROVE**: sem regex parcial.
  <!-- specsfy:evidence {"task":"T005","refs":["US-001","FR-001","NFR-001","AC-001"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/workout-import.test.js"],"commands":[{"run":"npm run test:tdd -- tests/workout-import.test.js -t keeps imported target repetitions --reporter=dot --testTimeout=5000","exit":0}]} -->
- [x] T006 [CODE] [US-001] Invalidar draft em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, FR-001, NFR-001, AC-002 — Depends: T001, T002, T003
  - [x] **PREP**: RED T002 confirmado.
  - [x] **EXECUTE**: Confirmar disabled e snapshot obrigatório.
  - [x] **VERIFY**: GREEN 2/2.
  - [x] **EVIDENCE**: focal exit 0.
  - [x] **IMPROVE**: erro de arquivo invalida.
  <!-- specsfy:evidence {"task":"T006","refs":["US-001","FR-001","NFR-001","AC-002"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/workout-import.test.js"],"commands":[{"run":"npm run test:tdd -- tests/workout-import.test.js -t never confirms a stale preview --reporter=dot --testTimeout=5000","exit":0}]} -->
- [x] T007 [CODE] [US-001] Restaurar Wake Lock no lifecycle em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, FR-001, NFR-001, AC-003 — Depends: T001, T002, T003
  - [x] **PREP**: RED T003 confirmado.
  - [x] **EXECUTE**: início, saída e visibilidade controlam sentinela.
  - [x] **VERIFY**: GREEN 2/2.
  - [x] **EVIDENCE**: focal exit 0.
  - [x] **IMPROVE**: falha segura preservada.
  <!-- specsfy:evidence {"task":"T007","refs":["US-001","FR-001","NFR-001","AC-003"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/keep-awake-preference.test.js"],"commands":[{"run":"npm run test:tdd -- tests/keep-awake-preference.test.js -t restores Wake Lock --reporter=dot --testTimeout=5000","exit":0}]} -->
- [x] T008 [CODE] [US-001] Precachear PDF.js em `sw.js` — Refs: US-001, FR-001, NFR-001, AC-004 — Depends: T001, T002, T003, T004
  - [x] **PREP**: RED T004 confirmado.
  - [x] **EXECUTE**: módulos em `ASSETS`, cache `v7`.
  - [x] **VERIFY**: GREEN 1/1.
  - [x] **EVIDENCE**: focal exit 0.
  - [x] **IMPROVE**: install/activate/fetch preservados.
  <!-- specsfy:evidence {"task":"T008","refs":["US-001","FR-001","NFR-001","AC-004"],"files":["sw.js","tests/service-worker-offline.test.js"],"commands":[{"run":"npm run test:tdd -- tests/service-worker-offline.test.js --reporter=dot --testTimeout=5000","exit":0}]} -->
- [x] T009 [DOC] Documentar e verificar gates em `specs/draft/0015-0015-seguranca-confiabilidade-importacao-local/spec.md` — Refs: US-001, FR-001, NFR-001, AC-001, AC-002, AC-003, AC-004 — Depends: T005, T006, T007, T008
  - [x] **PREP**: suites/checks identificados.
  - [x] **EXECUTE**: docs e adendos históricos atualizados.
  - [x] **VERIFY**: focais 58/58; produto 166 verde; Partitura externa indisponível neste terminal.
  - [x] **EVIDENCE**: monitor CURRENT, documentação check e paridade exit 0.
  - [x] **IMPROVE**: contrato offline local determinístico, sem portal adicional.
- [x] T010 [TEST] [TDD] [US-001] Reproduzir e impedir divergência binária em `tests/html-byte-parity.test.js` — Refs: US-001, FR-001, NFR-001, AC-001 — Depends: T005
  - [x] **PREP**: comparação por bytes e offset 91097 confirmados; `git diff --no-index` normaliza CRLF e não é oráculo suficiente.
  - [x] **EXECUTE**: teste lê Buffers sem normalização; a correção restaurou em `index.html` o padrão de bytes do standalone após confirmar conteúdo textual idêntico.
  - [x] **VERIFY**: RED exit 1 com `Buffer.compare=-1`; GREEN exit 0 e ambos medem 112332 bytes.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/html-byte-parity.test.js --reporter=dot --testTimeout=5000`, exit 0.
  - [x] **IMPROVE**: o oráculo binário impede novo falso positivo por normalização de final de linha.

### 15. Ordem de execução

- Caminho crítico: T001→T005→T002→T006→T003→T007→T004→T008→T009→T010.
- Tarefas paralelas: nenhuma; HTMLs e suites são fontes compartilhadas.
- Estratégia de MVP: quatro correções mínimas locais sem mudança de dados ou rede.

## Ato III — Entregar e validar

### 16. Dependências, riscos e suposições

#### Dependências

- APIs DOM, Wake Lock e Cache Storage; módulos PDF locais já versionados.

#### Riscos

- Sink persistido com interpolação HTML → RED de runner/overview e APIs DOM seguras.
- Wake Lock não suportado/rejeitado → captura segura sem impedir treino.
- Cache anterior → versão `v7` substitui a anterior.

#### Suposições

- Nenhuma decisão aberta além dos quatro achados confirmados pelo Procurador.

### 17. Decisões

- **DEC-001**: usar APIs DOM seguras, não sanitização por regex — elimina nós executáveis de campos importados/persistidos.
- **DEC-002**: SPEC-0015 sucede SPEC-0009, SPEC-0010 e SPEC-0014 — preserva o histórico concluído.

### 18. Definition of Done

- [ ] `Definition Gate` está `Passed`.
- [x] `Plan Gate` está `Passed`.
- [ ] `Delivery Gate` está `Passed`.
- [x] Todos os cenários AC têm RED e GREEN focais.
- [x] Todos os requisitos possuem evidência de verificação.
- [x] Todas as tarefas na seção 14 estão concluídas.
- [ ] Testes, checks estáticos, rastreabilidade, documentação, paridade e monitor disponíveis passam.
