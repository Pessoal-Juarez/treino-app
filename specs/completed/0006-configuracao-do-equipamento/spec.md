# SPEC-0006 — Configuração do equipamento por exercício

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0006 |
| Slug | 0006-configuracao-do-equipamento |
| Status | Complete |
| Effort | M |
| Effort updated at | 2026-08-28 |
| Effort rationale | Três campos nomeáveis, persistência existente e UI móvel; sem entidade nova. |
| ClickUp Task | |
| Milestones | |
| Definition Gate | Passed |
| Plan Gate | Passed |
| Delivery Gate | Passed |
| Evidence Contract | 1 |
| Atualizada em | 2026-08-28 |

## Ato I — Definir
### 1. Problema e resultado
Salvar três ajustes nomeáveis da máquina por exercício e recuperá-los ao reabrir o mesmo exercício.
### 2. Research e esclarecimentos
Precor RSL0619 documenta encosto, posição inicial, apoio de coxa e pino: https://files.precor.com/en-US/products/RSL0619
Life Fitness Axiom Seated Leg Curl/Extension: https://www.lifefitness.com/en-eu/catalog/strength-training/selectorized/axiom-series-seated-leg-curl-extension
Mockup aprovado: `specs/mockups/0006-configuracao-do-equipamento.md`.
Artefatos de pesquisa armazenados: `research/2026-08-28-precor-rsl0619.md` e `research/2026-08-28-life-fitness-axiom.md`.
### 3. Escopo e atores
Pessoa em treino configura o exercício atual; sem cadastro ou seletor de equipamento.
### 4. Princípios e restrições do projeto
Preservar IDs de exercícios, fluxo mobile, offline e carga por série separada.
### 5. Histórias de usuário
#### US-001 — Ajustes da máquina
Como pessoa em treino, quero salvar ajustes da máquina para reencontrá-los no exercício.
### 6. Cenários BDD de aceite
#### AC-001
**Cobre**: US-001, FR-001, FR-002, NFR-001
```gherkin
@US-001 @FR-001 @FR-002 @NFR-001 @AC-001
Given um exercício do plano
When o cartão é exibido
Then mostra três ajustes nomeáveis e o botão Configurar equipamento
```
#### AC-002
**Cobre**: US-001, FR-001, FR-002, NFR-002
```gherkin
@US-001 @FR-001 @FR-002 @NFR-002 @AC-002
Given o painel aberto
When a pessoa edita
Then vê três campos com rótulos editáveis e fonte 16px/alvo 44px
```
#### AC-003
**Cobre**: US-001, FR-001, FR-003, NFR-001
```gherkin
@US-001 @FR-001 @FR-003 @NFR-001 @AC-003
Given valores nos três campos
When a pessoa salva
Then os três são gravados de uma vez e vazio remove o anterior
```
#### AC-004
**Cobre**: US-001, FR-002, FR-003, NFR-002
```gherkin
@US-001 @FR-002 @FR-003 @NFR-002 @AC-004
Given edição em andamento
When a pessoa cancela
Then nenhuma alteração é gravada
```
#### AC-005
**Cobre**: US-001, FR-001, FR-002, NFR-001
```gherkin
@US-001 @FR-001 @FR-002 @NFR-001 @AC-005
Given dois exercícios distintos
When um é reaberto
Then recupera somente sua configuração
```
#### AC-006
**Cobre**: US-001, FR-003, NFR-001, NFR-002
```gherkin
@US-001 @FR-003 @NFR-001 @NFR-002 @AC-006
Given carga registrada por série
When ajustes são salvos
Then a carga não é duplicada
```
#### AC-007
**Cobre**: US-001, FR-002, FR-003, NFR-002
```gherkin
@US-001 @FR-002 @FR-003 @NFR-002 @AC-007
Given rótulo ou valor excedente
When ultrapassa 40 caracteres
Then o excedente é impedido sem truncamento silencioso
```
#### AC-008
**Cobre**: US-001, FR-002, NFR-003
```gherkin
@US-001 @FR-002 @NFR-003 @AC-008
Given o cartão de um exercício no aplicativo atual
When o botão Configurar equipamento é exibido
Then mantém os tokens visuais já usados nos cartões e botões do aplicativo
```
#### AC-009
**Cobre**: US-001, FR-002, NFR-003
```gherkin
@US-001 @FR-002 @NFR-003 @AC-009
Given o painel de configuração aberto
When a pessoa vê os três pares nome e valor
Then a tipografia, os espaçamentos e as ações Cancelar e Salvar seguem o padrão visual existente
```
#### AC-010
**Cobre**: US-001, FR-002, NFR-003
```gherkin
@US-001 @FR-002 @NFR-003 @AC-010
Given as variantes indexada e standalone do aplicativo
When a configuração do equipamento é aberta em qualquer uma delas
Then ambas apresentam a mesma identidade visual e o mesmo fluxo
```
### 7. Requisitos
- **FR-001**: Associar três pares rótulo/valor ao ID do exercício.
- **FR-002**: Permitir rótulos editáveis e valores livres curtos.
- **FR-003**: Salvar atomicamente e remover valores vazios.
- **NFR-001**: Não criar cadastro, seletor global ou categorias universais.
- **NFR-002**: Garantir fonte mínima 16px e alvo mínimo 44px.
- **NFR-003**: Reutilizar cores, tipografia, cartões, espaçamentos e padrão dos botões já existentes no aplicativo.

## Ato II — Projetar e provar
### 8. Plano técnico
Reutilizar persistência existente e manter os dois HTMLs em paridade; nenhuma implementação autorizada.
### 9. Modelo de dados
Estrutura indexada pelo ID do exercício com três pares rótulo/valor; sem migration ou API externa.
### 10. Interfaces e contratos
Cartão com botão Configurar equipamento; painel com três campos, Cancelar e Salvar.
### 11. Estratégia TDD
Vitest/JSDOM existente será usado somente após aprovação do plano.

#### Registro aditivo de evidência TDD em 2026-08-28

- **Boundary**: Vitest/JSDOM executa as duas variantes reais; o portal Maestri
  complementa a inspeção móvel do HTML local em 390×844. Não há arquivo
  `.feature` nem step definition.
- **Histórico preservado**: houve implementação parcial antes do Plan Gate.
  Os REDs abaixo são registrados como ocorreram; nenhum RED é criado
  retroativamente para tornar um checklist conveniente.

| Tarefa/IDs | BDD de referência | Teste e comando | RED observado | GREEN/Regressão observados |
| --- | --- | --- | --- | --- |
| T001, T007, T008 — US-001, FR-001, FR-002, NFR-001, NFR-002, NFR-003, AC-001, AC-002, AC-007, AC-008, AC-009 | AC-001, AC-002, AC-007, AC-008, AC-009 | `tests/equipment-configuration.test.js`; `npm run test:tdd -- tests/equipment-configuration.test.js --reporter=verbose --testTimeout=5000 --hookTimeout=5000` | Histórico de 2026-08-28, horário não preservado: exit 1, `expected null not to be null` para `[data-equipment-summary]`. A ausência do cartão também impedia alcançar o editor; esta é a ligação histórica de T007/T008 solicitada. | 2026-08-28 23:48:58 — matriz ampliada nas duas variantes: 14/14 em `equipment-configuration.test.js`; 23/23 com `numeric-inputs.test.js`. |
| T009 — US-001, FR-002, NFR-003, AC-010 | AC-010 | `tests/numeric-inputs.test.js > AC-036 mantém paridade integral dos HTMLs` | Histórico de 2026-08-28, horário não preservado: exit 1 por divergência material do bloco de equipamento entre `index.html` e `treino_hibrido_juarez_v3_standalone.html`. | 2026-08-28 23:48:58 — AC-036 passou; `git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html` não produziu diferença. |
| Complemento visual — US-001, FR-002, NFR-003, AC-008, AC-009 | AC-008, AC-009 | `npm run test:tdd -- tests/equipment-configuration.test.js --reporter=verbose --testTimeout=5000 --hookTimeout=5000` | 2026-08-28 23:46:52 — exit 1: cartão sem `background: var(--panel)` e botão `data-action="edit"` ausente, deixando o editor inalcançável. | 2026-08-28 23:48:58 — 14/14; cartão/painel agora usam tokens T036, controles 16px/44px e DOM seguro. |
| T002, T003 — US-001, FR-001, FR-002, FR-003, NFR-001, NFR-002, AC-003, AC-004, AC-005, AC-006 | AC-003 a AC-006 | Matriz atual em `tests/equipment-configuration.test.js` para cancelar sem escrita, salvar uma vez, restaurar, isolar por ID, vazio e séries intactas. | Não há RED independente preservado para estes subfluxos: a implementação parcial já existia quando seus casos foram materializados. Este registro não os reclassifica como RED histórico. | 2026-08-28 23:48:58 — GREEN de caracterização 14/14; 2026-08-28 23:50:45 — regressão de produto 63/63, exit 0, excluindo apenas Partitura dependente de Maestro. |
### 12. Plano de testes e rastreabilidade
AC-001–AC-007 rastreados a US-001, FR-001–FR-003 e NFR-001–NFR-002.

| Requisito | Cenário BDD | Nível | Arquivo/comando | Evidência |
| --- | --- | --- | --- | --- |
| FR-001, NFR-001 | AC-001, AC-005 | Integração JSDOM | `tests/equipment-configuration.test.js` | Passed — três slots, restauração e isolamento por ID nas duas variantes. |
| FR-002, NFR-002 | AC-002, AC-007 | Integração JSDOM | `tests/equipment-configuration.test.js` | Passed — três pares, fonte 16px, alvo 44px e `maxlength=40` sem truncamento no save programático. |
| FR-003, NFR-001, NFR-002 | AC-003, AC-004, AC-006 | Integração JSDOM | `tests/equipment-configuration.test.js` | Passed — Cancelar sem escrita; Salvar faz uma escrita; vazio mantém três slots e não altera séries. |
| NFR-003 | AC-008, AC-009 | Integração JSDOM e inspeção móvel | Matriz focal; portal Maestri `file:///C:/Users/Samsung/Documents/treino_v3/index.html` em iOS 390×844 | Passed — cartão após vídeo, antes do recorde; painel `#141b24`, bordas/tokens existentes, ações 44px e Plus Jakarta Sans. |
| FR-002, NFR-003 | AC-010 | Paridade | `tests/numeric-inputs.test.js` AC-036 e `git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html` | Passed — fluxo e HTMLs idênticos. |
### 13. Validações
Definition, Plan e Delivery Pending.

#### Gate do Ato II — Plano

- **Resultado**: PASSED (2026-08-28).
- **Comando**: `node .agents/skills/specsfy-05-tasks/scripts/validate_tasks.mjs specs/defined/0006-configuracao-do-equipamento/spec.md --allow-draft`.
- **Achados**: 9 tarefas, 6 predecessoras concluídas, 45 itens de checklist e
  17/17 IDs cobertos. T001/T007/T008 usam o RED inicial preservado; T009 usa
  o RED de paridade preservado; T002/T003 são caracterizações explicitamente
  não apresentadas como RED histórico.

#### Evidência de entrega em andamento — 2026-08-28

- **GREEN focal**: `npm run test:tdd -- tests/equipment-configuration.test.js tests/numeric-inputs.test.js --reporter=verbose --testTimeout=5000 --hookTimeout=5000` — exit 0, 2 arquivos/23 testes.
- **Regressão de produto**: `npm run test:tdd -- --exclude tests/partitura/** --reporter=verbose --testTimeout=5000 --hookTimeout=5000` — exit 0, 10 arquivos/63 testes. A exclusão é estritamente a pré-condição Maestro.
- **Maestro independente**: terminal Codex – Procurador, evidência humana recebida: `npm run test:tdd -- tests/partitura/dispatcher.test.js tests/partitura/procurador.test.js --reporter=verbose --testTimeout=5000` — exit 0, 2 arquivos/13 testes, duração 4.86s. Esta prova permanece separada da saída local.
- **Paridade e segurança**: `git diff --check` e `git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html` — exit 0; dados persistidos são renderizados com `textContent` e os inputs recebem valores por `.value`.
- **Visual móvel**: portal Maestri abriu o HTML local, user agent iOS e viewport 390×844. O snapshot observou Editar 58×44 após o vídeo e antes de Última Carga; painel mostrou seis inputs em 44px e Cancelar/Salvar em 157×44, enquanto as séries permaneceram no fluxo existente.

#### Gate do Ato III — Entrega

- **Resultado**: PASSED (2026-08-29).
- **Comandos verdes**: focal 2 arquivos/23 testes; produto 10 arquivos/63
  testes, exit 0; `git diff --check`; paridade integral; `validate_spec`,
  `validate_tasks`, rastreabilidade full-chain com marcadores externos
  explicitamente ignorados, aceite, evidência strict, review findings,
  documentador `--check`, monitor CURRENT e enforcement local.
- **Pré-condição independente**: Partitura é comprovada separadamente pelo
  terminal Codex – Procurador (2 arquivos/13 testes, exit 0); a saída de
  produto local exclui somente essa suíte dependente de Maestro.
- **Achados**: nenhum BLOCKER aberto. A implementação parcial pré-Plan Gate e
  a inexistência de RED independente de T002/T003 permanecem transparentes na
  seção 11; não foram usados como evidência TDD retroativa.
### 14. Tarefas
- [x] T001 [TEST] [TDD] [US-001] RED cartão e campos em `tests/equipment-configuration.test.js` — Refs: US-001, FR-001, FR-002, NFR-001, NFR-002, AC-001, AC-002, AC-007 — Depends: none
  - [x] **PREP**: BDD e boundary Vitest/JSDOM confirmados para cartão, pares, fonte e limite.
  - [x] **EXECUTE**: O caso com marcador próprio foi materializado nas duas variantes.
  - [x] **VERIFY**: RED histórico real registrou `[data-equipment-summary]` ausente; a matriz atual passou.
  - [x] **EVIDENCE**: Comando, exit 1 histórico e GREEN 23/23 constam da seção 11.
  - [x] **IMPROVE**: Casos foram separados por comportamento para evitar que o cartão esconda persistência ou segurança.
- [x] T002 [TEST] [US-001] caracterizar salvar/cancelar em `tests/equipment-configuration.test.js` após a implementação parcial histórica — Refs: US-001, FR-002, FR-003, NFR-001, NFR-002, AC-003, AC-004 — Depends: T001
  - [x] **PREP**: Fluxos de Cancelar sem escrita e Salvar atômico foram delimitados contra a chave local real.
  - [x] **EXECUTE**: Casos exercitam os três pares, contam uma única escrita e conferem o JSON persistido.
  - [x] **VERIFY**: GREEN 23/23 confirmou ambos os fluxos em index e standalone; nenhum RED independente foi alegado.
  - [x] **EVIDENCE**: A ausência de RED independente e o comando GREEN estão registrados na seção 11.
  - [x] **IMPROVE**: O teste observa a Storage API real em vez de substituir o fluxo de persistência.
- [x] T003 [TEST] [US-001] caracterizar associação por ID, vazio e não interferência nas séries em `tests/equipment-configuration.test.js` após a implementação parcial histórica — Refs: US-001, FR-001, FR-003, NFR-001, NFR-002, AC-005, AC-006 — Depends: T002
  - [x] **PREP**: IDs distintos, restauração, valor vazio e input de série foram definidos como fronteiras observáveis.
  - [x] **EXECUTE**: Casos alternam exercícios, recriam a janela e preservam três slots quando um valor é esvaziado.
  - [x] **VERIFY**: GREEN 23/23 e regressão 63/63 confirmaram isolamento e ausência de alteração de carga/repetições.
  - [x] **EVIDENCE**: Resultados e a limitação histórica de RED estão registrados na seção 11.
  - [x] **IMPROVE**: A restauração ocorre em nova JSDOM para não confundir estado em memória com persistência.
- [x] T004 [CODE] [US-001] implementar nos dois HTMLs `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-001–AC-010 — Depends: T001, T002, T003, T007, T008, T009
  - [x] **PREP**: Posição no runner, chave por ID, DOM seguro e paridade foram mapeados nos dois HTMLs.
  - [x] **EXECUTE**: A implementação parcial histórica foi revisada; o bloco atual usa funções de topo, `textContent`/`.value`, três slots e uma única escrita após coletar os pares.
  - [x] **VERIFY**: GREEN focal 23/23, regressão de produto 63/63, AC-036 e comparação integral de HTMLs passaram.
  - [x] **EVIDENCE**: Arquivos, comandos e saídas com exit 0 constam no comentário `specsfy:evidence` e nas seções 11–13.
  - [x] **IMPROVE**: O código foi expandido em funções legíveis; JSON inválido recua a defaults e nenhum rótulo/valor persistido entra em `innerHTML`.
  <!-- specsfy:evidence {"task":"T004","refs":["US-001","FR-001","FR-002","FR-003","NFR-001","NFR-002","NFR-003","AC-001","AC-002","AC-003","AC-004","AC-005","AC-006","AC-007","AC-008","AC-009","AC-010"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/equipment-configuration.test.js","tests/numeric-inputs.test.js",".specsfy/DATABASE.md"],"commands":[{"run":"npm run test:tdd -- tests/equipment-configuration.test.js tests/numeric-inputs.test.js --reporter=verbose --testTimeout=5000 --hookTimeout=5000","exit":0},{"run":"npm run test:tdd -- --exclude tests/partitura/** --reporter=verbose --testTimeout=5000 --hookTimeout=5000","exit":0},{"run":"git diff --check","exit":0},{"run":"git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html","exit":0}]} -->
- [x] T005 [DOC] [US-001] documentar persistência em `.specsfy/DATABASE.md`, documentação técnica em `docs/` e inventário em `.specsfy/PACKAGES.md` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-008, AC-009, AC-010 — Depends: T004
  - [x] **PREP**: Persistência local, documentação técnica e pacote npm foram revisados sem alterar texto humano.
  - [x] **EXECUTE**: `update_database.mjs` e o documentador reconstruíram os artefatos; a chave de equipamento foi documentada manualmente porque o detector não reconheceu o LocalStorage inline.
  - [x] **VERIFY**: `build_documentation.mjs --check` retornou exit 0 e o monitor retornou CURRENT.
  - [x] **EVIDENCE**: Os comandos e o inventário de três pares por ID aparecem nas seções 12–13 e em `.specsfy/DATABASE.md`.
  - [x] **IMPROVE**: A correção manual restaurou as estruturas de persistência legítimas que o detector havia reduzido a “A confirmar”.
- [x] T006 [TEST] [US-001] validação final, paridade e inspeção móvel em `tests/equipment-configuration.test.js` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-001–AC-010 — Depends: T004, T005
  - [x] **PREP**: Matriz focal, produto sem Partitura, paridade, contexto e gates foram definidos.
  - [x] **EXECUTE**: Suites, validadores, aceite, evidência strict, review findings e enforcement local foram executados em 2026-08-29.
  - [x] **VERIFY**: 23/23 focal, 63/63 produto, READY/OK/PASSED e portal iOS 390×844 confirmaram o fluxo completo.
  - [x] **EVIDENCE**: Seções 11–13 registram comandos, contagens, paridade, segurança, visual e a prova Maestro independente.
  - [x] **IMPROVE**: Não há refactor seguro adicional; os dois HTMLs permanecem byte a byte iguais e a persistência não altera séries.
- [x] T007 [TEST] [TDD] [US-001] RED da posição e tokens reais em `tests/equipment-configuration.test.js` — Refs: US-001, FR-002, NFR-003, AC-008 — Depends: none
  - [x] **PREP**: Posição após vídeo, antes do recorde e tokens T036 foram ligados a AC-008.
  - [x] **EXECUTE**: Caso materializado para index e standalone em `tests/equipment-configuration.test.js`.
  - [x] **VERIFY**: RED histórico real do cartão ausente e RED complementar de 23:46:52 para `background` foram registrados.
  - [x] **EVIDENCE**: Comando focal, falhas e GREEN 23/23 constam da seção 11.
  - [x] **IMPROVE**: O seletor semântico `data-equipment-summary` evita depender de texto ou estrutura incidental.
- [x] T008 [TEST] [TDD] [US-001] RED do painel com pares e ações em `tests/equipment-configuration.test.js` — Refs: US-001, FR-002, NFR-003, AC-009 — Depends: T007
  - [x] **PREP**: Três pares nome/valor, Cancelar/Salvar, 16px e 44px foram ligados a AC-009.
  - [x] **EXECUTE**: Caso materializado para ambas as variantes com ações e medidas observáveis.
  - [x] **VERIFY**: RED histórico do editor inalcançável por ausência de cartão e falha complementar de `data-action="edit"` foram registrados.
  - [x] **EVIDENCE**: Comando focal, falhas e GREEN 23/23 constam da seção 11.
  - [x] **IMPROVE**: A inspeção móvel 390×844 confirmou dimensões reais sem substituir a matriz automatizada.
- [x] T009 [TEST] [TDD] [US-001] RED de paridade visual e fluxo em `tests/equipment-configuration.test.js` — Refs: US-001, FR-002, NFR-003, AC-010 — Depends: T008
  - [x] **PREP**: A paridade foi limitada ao material existente e à checagem integral já mantida em AC-036.
  - [x] **EXECUTE**: AC-036 e a matriz de equipamento executam index e standalone.
  - [x] **VERIFY**: RED histórico real de AC-036 por divergência material e GREEN posterior foram registrados.
  - [x] **EVIDENCE**: AC-036, `git diff --no-index` e a seção 11 registram os comandos e resultados.
  - [x] **IMPROVE**: Não foram igualadas diferenças preexistentes fora do bloco material; os HTMLs atuais ficaram idênticos.
### 15. Ordem de execução

T001 → T002 → T003 → T007 → T008 → T009 → T004 → T005 → T006.

Registro aditivo: T004 cobre US-001, FR-001–FR-003, NFR-001–NFR-003 e
AC-001–AC-010; suas dependências explícitas incluem T001, T002, T003, T007,
T008 e T009. A ordem preserva os três REDs históricos indicados e não reescreve
a implementação parcial ocorrida antes do Plan Gate.

## Ato III — Entregar e validar
### 16. Dependências, riscos e suposições
Depende do ID existente; três campos são hipótese de layout, não categorias universais.
### 17. Decisões
Três campos nomeáveis; associação por exercício; salvar transacional; cancelar descarta; vazio remove; rótulos editáveis; valores livres; limite 40; exibição no cartão.
### 18. Definition of Done
- [x] Definition Gate Passed — validate_spec --allow-draft retornou VALID DRAFT; transição draft→defined concluída.
- [x] Plan Gate Passed — `validate_tasks --allow-draft` retornou VALID DRAFT com 9 tarefas, 45 checklists e 17/17 IDs; o Gate do Ato II preserva a distinção entre REDs reais e caracterizações.
- [x] Delivery Gate Passed — Gate do Ato III em 2026-08-29: testes, aceite, evidência, rastreabilidade, documentação, contexto, revisão e visual móvel comprovados.

## Conclusão
Mockup aprovado antes da implementação. Status Defined; Definition Gate Passed; Plan e Delivery permanecem Pending. O histórico anterior “Status Draft e gates Pending” é preservado como registro da fase anterior.

Checkpoint 2026-08-28: validate_spec --allow-draft retornou VALID DRAFT. Lock histórico SPEC-0006-DRAFT-REPAIR foi RELEASED; lock vivo atual SPEC-0006-PLAN.

## Registro aditivo — revisão visual aprovada em 2026-08-28

O Codex – Procurador aprovou a revisão do mockup em
`specs/mockups/0006-configuracao-do-equipamento.md`: cada um dos três ajustes
expõe separadamente um nome editável e um valor editável; `Cancelar` e `Salvar`
permanecem ações visíveis e legíveis. A implementação deve reutilizar a
identidade visual atual do aplicativo — cores, tipografia, cartões, espaçamentos
e padrão dos botões. Esta decisão complementa, sem substituir, os requisitos e
decisões anteriores.

## Registro aditivo — pesquisa e critério visual em 2026-08-28

A pesquisa local confirma que três não é um número universal: os fabricantes
consultados descrevem três áreas ergonômicas recorrentes e, em alguns modelos,
outros controles como o pino de carga. A decisão é manter três pares nome/valor
para o encaixe e preservar a carga por série. A condição de identidade visual
aprovada foi materializada em NFR-003 e AC-008 a AC-010, sem substituir os
requisitos anteriores.

## Registro aditivo — revalidação da definição em 2026-08-28

Após a aprovação visual e o arquivamento das fontes primárias, a validação
estrutural retornou `READY` e a revisão de achados retornou `PASSED`. Não há
BLOCKER aberto para o planejamento; Definition Gate permanece Passed e Status
permanece Defined.

## Registro aditivo — correção humana da referência visual em 2026-08-28

Correção humana literal: Juarez aprova a estrutura e o mecanismo dos três
ajustes, mas revogou a aprovação da referência visual anterior porque ela não
reutilizava a identidade original. A revisão final do mockup usa `Plus Jakarta
Sans`, `#090d12`, `#141b24`, `#1b2430`, `#263342`, `#d4ff32`, `#f3f7fa` e
raios de 12/16px, preservando três pares nome/valor e as ações Cancelar/Salvar.

O Codex – Procurador aprovou exclusivamente essa referência visual final.
Plan Gate e Delivery Gate permanecem Pending; nenhum RED, planejamento ou
implementação foi autorizado nem iniciado.

## Registro aditivo — evidência histórica TDD em 2026-08-28

O RED realmente observado para T001/T007/T008 ocorreu em
`tests/equipment-configuration.test.js`: `expected null not to be null` para
`[data-equipment-summary]`, antes de o bloco e o editor existirem. Comando:
`npm run test:tdd -- tests/equipment-configuration.test.js --reporter=verbose --testTimeout=5000 --hookTimeout=5000`; saída exit 1.

O RED realmente observado para T009 ocorreu na verificação integral
`tests/numeric-inputs.test.js > AC-036 mantém paridade integral dos HTMLs`, que
apontou divergência material no bloco de equipamento entre os dois HTMLs; saída
exit 1. O GREEN posterior foi `11/11` na matriz focal/paridade e `51/51` na
regressão de produto excluindo somente `tests/partitura/**`; a execução Maestro
independente foi `13/13`, exit 0.

Implementação parcial foi feita antes do Plan Gate Passed. Este registro não
reescreve esse fato nem promove gate algum; T004 permanece aberta até que seus
checklists, evidências, validações e documentação sejam concluídos.
