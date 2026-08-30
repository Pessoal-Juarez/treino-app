# Especificação integrada: Onboarding para primeiro uso

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0011 |
| Slug | onboarding-primeiro-uso |
| Status | Complete |
| Effort | 1 |
| Definition Gate | Passed |
| Plan Gate | Passed |
| Delivery Gate | Passed |
| Atualizada em | 2026-08-29 |

## Ato I — Definir

### 1. Problema e resultado

#### Pedido humano literal

> Quero colocar o meu pai para usar o app e receber feedbaks, então pensei que ele precisa ter um onboard para a primeira vez que a pessoa loga einstala.

#### Problema

Uma pessoa no primeiro uso local pode não saber escolher um treino, iniciar o dia e registrar a primeira série.

#### Resultado desejado

Na primeira abertura local do dispositivo, a pessoa vê uma introdução curta e observável que ensina o fluxo essencial do app; pode pular ou concluir e pode reabri-la em Ajustes sem apagar que já a viu.

#### Métricas de sucesso

- Em testes focais nas duas variantes HTML, os três passos, Pular, conclusão e reabertura devem cumprir AC-001–AC-003; alvo: 100% dos cenários focais verdes.
- A inspeção estática não encontra rede, login, conta ou telemetria introduzidos pelo onboarding; alvo: zero ocorrências no bloco novo.

### 2. Research e esclarecimentos

#### Researchs executados

- **R-001**: `codegraph explore "onboarding first launch login install profile"` → o binário disponível respondeu `unknown command explore`; foi usado apenas como limitação da ferramenta, sem inferir comportamento.
- **R-002**: busca estática nos HTMLs por `onboarding` e `login` → não há fluxo de onboarding, login, conta ou rede no produto atual. Impacto: “primeira vez que a pessoa loga” é interpretado pela decisão aprovada como primeira abertura local por dispositivo, não autenticação.
- **R-003**: tokens reais do portal T036 Mobile Evidence Replacement já confirmados no código: Plus Jakarta Sans; fundo `#090d12`; superfícies `#141b24` e `#1b2430`; borda `#263342`; destaque `#d4ff32`; texto `#f3f7fa`; raios 12/16. Impacto: o mockup deve reutilizá-los fielmente.

#### Fontes e contexto consultados

- `index.html` e `treino_hibrido_juarez_v3_standalone.html`: variantes locais da interface e seus padrões.
- `specs/mockups/0011-onboarding-primeiro-uso.html`: referência visual aprovada, estática e local.
- Codex - Procurador: DEC-001 e DEC-002 em 2026-08-29.

#### Documentação consultada

- Nenhuma documentação externa: o escopo não usa APIs, bibliotecas ou serviços externos.

#### Artefatos de pesquisa armazenados

- Nenhum artefato externo; o mockup local é a referência de experiência.

#### Dúvidas respondidas

- **Q**: Qual é o gatilho e escopo inicial sem login, conta ou rede? → **A**: DEC-001, primeiro uso local por dispositivo, revisável em Ajustes.

#### Dúvidas abertas

- Nenhuma de produto. A aprovação combinada foi recebida; resta validar canonicamente a fonte normativa.

### 3. Escopo e atores

#### Incluído na proposta para aprovação

- Até três passos: (1) escolher treino/dia e iniciar; (2) registrar peso e repetições e avançar série/descanso; (3) conhecer Ver Execução Correta e Ajustes úteis, então Começar treino.
- Pular, Próximo, Voltar, indicador de progresso e Começar treino.
- Pular e concluir marcam o onboarding como visto localmente.
- Controle **Ver introdução** em Ajustes reabre a introdução sem apagar o estado visto.
- Alvos de interação de no mínimo 44 px e texto/campos mobile de 16 px.

#### Fora de escopo

- Login, conta, perfil remoto, feedback remoto, telemetria, analytics, upload, rede, backend e qualquer coleta de dados.
- Implementação do produto, Definition Gate ou Plan Gate antes da aprovação solicitada.

#### Atores

- **Pessoa no primeiro uso local**: aprende a iniciar e registrar o primeiro treino.
- **Pessoa que já viu a introdução**: pode reabri-la em Ajustes sem alterar o estado registrado.

### 4. Princípios e restrições do projeto

- **PR-001**: fonte de verdade local; nenhuma ação de rede, conta ou telemetria.
- **PR-002**: a decisão visual deve preceder qualquer alteração de comportamento do produto.
- **PR-003**: o mockup deve usar tokens e padrões visuais reais do app T036.

### 5. Histórias de usuário

#### US-001 — Primeira orientação local (P1)

Como pessoa no primeiro uso local, quero uma introdução curta do fluxo essencial, para conseguir iniciar e registrar um treino sem depender de conta ou suporte remoto.

#### US-002 — Rever introdução (P2)

Como pessoa que já viu a introdução, quero reabri-la em Ajustes, para revisar o fluxo sem apagar o estado de que ela já foi vista.

### 6. Cenários BDD de aceite

#### AC-001 — Concluir a orientação

**Cobre**: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003

```gherkin
@US-001 @US-002 @FR-001 @FR-002 @FR-003 @NFR-001 @NFR-002 @NFR-003 @AC-001
Feature: onboarding local curto e revisável

Scenario: pessoa conclui os três passos
  Given que o dispositivo ainda não marcou o onboarding como visto
  When a pessoa percorre os três passos e seleciona "Começar treino"
  Then o onboarding é marcado como visto localmente
  And a pessoa segue para iniciar seu treino
```

#### AC-002 — Pular a orientação

**Cobre**: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003

```gherkin
@US-001 @US-002 @FR-001 @FR-002 @FR-003 @NFR-001 @NFR-002 @NFR-003 @AC-002
Feature: onboarding local curto e revisável

Scenario: pessoa pula a introdução
  Given que o onboarding está aberto no primeiro uso local
  When a pessoa seleciona "Pular"
  Then o onboarding é marcado como visto localmente
  And nenhum dado remoto é enviado
```

#### AC-003 — Reabrir sem resetar o visto

**Cobre**: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003

```gherkin
@US-001 @US-002 @FR-001 @FR-002 @FR-003 @NFR-001 @NFR-002 @NFR-003 @AC-003
Feature: onboarding local curto e revisável

Scenario: pessoa revisita a introdução nos Ajustes
  Given que o onboarding já está marcado como visto
  When a pessoa seleciona "Ver introdução" em Ajustes
  Then a introdução é reaberta
  And o estado visto continua marcado
```

### 7. Requisitos

#### Funcionais

- **FR-001**: mostrar o onboarding de até três passos apenas no primeiro uso local, até Pular ou concluir.
- **FR-002**: Pular e Começar treino devem marcar localmente o onboarding como visto.
- **FR-003**: Ver introdução em Ajustes deve reabrir o fluxo sem apagar o estado visto.

#### Não funcionais

- **NFR-001**: não realizar rede, telemetria, feedback remoto, login ou conta.
- **NFR-002**: controles devem ter alvos de ao menos 44 px e texto/campos de ao menos 16 px no mobile.
- **NFR-003**: respeitar os tokens T036 listados em R-003.

## Ato II — Projetar e provar

### 8. Plano técnico

O mockup estático em `specs/mockups/0011-onboarding-primeiro-uso.html` representa iOS 390×844. Ele mostra o passo 1 como tela principal e documenta os três passos sem script ou comportamento de produto.

#### Contexto existente

- Aplicação HTML/JavaScript local em `index.html` e `treino_hibrido_juarez_v3_standalone.html`, com persistência em `localStorage` e tokens T036 já presentes.

#### Arquitetura e módulos

- Um módulo pequeno e espelhado lê/grava somente a preferência canônica dentro do objeto local existente.
- A renderização constrói o overlay com APIs DOM e `textContent`; não interpola conteúdo persistido em `innerHTML`.
- Ajustes reabre o passo 1 sem alterar `seen`; Pular e concluir o definem como `true` antes de fechar.

#### Migrations

- Não aplicável: extensão retrocompatível de um objeto de `localStorage`; ausência ou JSON inválido usa default `false`.

#### Models

- `onboardingSeen: boolean`: preferência local com default `false`; `true` impede reabertura automática. Caminhos: as duas variantes HTML.

#### Controllers e casos de uso

- Handlers para Próximo, Voltar, Pular, Começar treino e Ver introdução; somente locais. Caminhos: as duas variantes HTML.

#### Views e experiência

- Overlay mobile de até três passos, indicador e controles de 44 px; Ajustes recebe Ver introdução. Caminhos: as duas variantes e o mockup aprovado.

#### Queries e repositórios

- Não aplicável: não há banco, query ou repositório.

#### Jobs e processamento assíncrono

- Não aplicável: não há jobs, filas, rede ou processamento remoto.

#### Estrutura de arquivos

```text
index.html
treino_hibrido_juarez_v3_standalone.html
tests/onboarding-first-use.test.js
specs/draft/0011-onboarding-primeiro-uso/spec.md
specs/mockups/0011-onboarding-primeiro-uso.html
```

### 9. Modelo de dados

Uma única preferência local booleana `onboardingSeen` (nome técnico ainda a confirmar na implementação), com default `false`. Não há conta, identidade remota, tabela, migration, API, evento externo ou retenção de dados remota.

#### Entidades

| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| Preferência de treino local | `treino_hibrido_juarez_v5` | `onboardingSeen` booleano; ausente/inválido equivale a `false`; mesclar sem apagar campos existentes | apenas dispositivo/localStorage |

#### Estados e transições

| Entidade | Estado atual | Evento | Próximo estado | Invariantes |
| --- | --- | --- | --- | --- |
| onboarding | não visto | Pular ou Começar treino | visto | grava só `onboardingSeen: true`, sem rede |
| onboarding | visto | Ver introdução | visto com overlay aberto | não limpa nem troca `onboardingSeen` |

#### Migração e retenção

- Sem migração; a propriedade é opcional, local e retrocompatível.

### 10. Interfaces e contratos

- Sem API exposta ou externa; não há URL, autenticação, request, response, timeout ou retry.
- Contrato local: o controle em Ajustes é **Ver introdução**; abre o passo 1 e mantém `onboardingSeen` inalterado.
- Falha local: configuração ausente ou JSON inválido trata `onboardingSeen` como `false` sem quebrar a tela e sem apagar histórico, perfil ou equipamento.

### 11. Estratégia TDD

- **DOM/storage**: `tests/onboarding-first-use.test.js` exercitará as duas variantes em JSDOM.
- **BDD**: AC-001, AC-002 e AC-003 são referência; não criar `.feature`.
- **RED**: três casos independentes, um por AC, devem falhar antes da produção: concluir/persistir, pular/sem rede e reabrir sem reset.
- **GREEN/refactor**: implementação mínima espelhada, seguida de paridade material e regressão de produto.
- **Verificação manual**: não aplicável por restrição vinculante de não abrir navegador; fonte e testes estáticos serão a evidência.

#### Evidência RED-GREEN-REFACTOR

| IDs | BDD de referência | Teste TDD | RED observado | GREEN observado | Refactor/regressão |
| --- | --- | --- | --- | --- | --- |
| US-001, FR-001, FR-002, NFR-001–003, AC-001 | AC-001 | `onboarding-first-use.test.js` conclusão | 2026-08-29: seletor `[data-onboarding-overlay]` ausente em `index.html` e standalone | Pending | Pending |
| US-001, FR-001, FR-002, NFR-001–003, AC-002 | AC-002 | `onboarding-first-use.test.js` Pular | 2026-08-29: seletor `[data-onboarding-skip]` ausente nas duas variantes | Pending | Pending |
| US-002, FR-003, NFR-001–003, AC-003 | AC-003 | `onboarding-first-use.test.js` reabrir | 2026-08-29: ausência de `[data-onboarding-review]` impede reabertura | Pending | Pending |

Comando RED: `npm run test:tdd -- tests/onboarding-first-use.test.js --reporter=verbose --testTimeout=5000` (exit 1, 1 arquivo, 7 falhas; seis de comportamento ausente nas duas variantes e uma de contrato material ausente). A primeira execução sem elevação falhou antes de coletar testes por `spawn EPERM`; a execução local autorizada acima produziu o RED válido.

### 12. Plano de testes e rastreabilidade

**Evidência executada**: 2026-08-29 — `npm run test:tdd -- tests/onboarding-first-use.test.js --reporter=verbose --testTimeout=5000`, exit 0, 1 arquivo, 7/7 testes. O RED anterior do mesmo comando teve exit 1 e 7 falhas por controles/overlay ausentes; o GREEN cobre conclusão/persistência, Pular local e reabertura sem reset nas duas variantes.

| Requisito | Cenário BDD | Nível | Arquivo/comando esperado | Evidência |
| --- | --- | --- | --- | --- |
| FR-001 | AC-001, AC-002, AC-003 | DOM | `npm run test:tdd -- tests/onboarding-first-use.test.js --reporter=verbose --testTimeout=5000` | Passed — exit 0, 7/7 nas duas variantes |
| FR-002 | AC-001, AC-002, AC-003 | DOM/storage | `tests/onboarding-first-use.test.js` | Pending |
| FR-003 | AC-001, AC-002, AC-003 | DOM/storage | `tests/onboarding-first-use.test.js` | Pending |
| NFR-001 | AC-001, AC-002, AC-003 | estático | `tests/onboarding-first-use.test.js` | Pending |
| NFR-002 | AC-001, AC-002, AC-003 | estático | `tests/onboarding-first-use.test.js` | Pending |
| NFR-003 | AC-001, AC-002, AC-003 | estático | `tests/onboarding-first-use.test.js` | Pending |
| FR-001, FR-002 | AC-001 | DOM/storage | `npm run test:tdd -- tests/onboarding-first-use.test.js --reporter=verbose --testTimeout=5000` | Passed — exit 0, comportamento nas duas variantes |
| FR-001, FR-002, NFR-001 | AC-002 | DOM/storage | `npm run test:tdd -- tests/onboarding-first-use.test.js --reporter=verbose --testTimeout=5000` | Passed — exit 0, Pular local sem URL remota no bloco |
| FR-003, NFR-002, NFR-003 | AC-003 | DOM/static | `npm run test:tdd -- tests/onboarding-first-use.test.js --reporter=verbose --testTimeout=5000` | Passed — exit 0, reabertura sem reset e contrato material equivalente |

| Requisito | Cenário | Evidência prevista |
| --- | --- | --- |
| FR-001 | AC-001 | teste focal nas duas variantes HTML |
| FR-002 | AC-002 | teste focal de persistência local sem rede |
| FR-003 | AC-003 | teste focal de reabertura sem reset |
| NFR-001–003 | AC-001–003 | inspeção estática, estilos e testes focais |

### 13. Validações

#### Gate do Ato I — Definição

- **Resultado**: Passed
- **Comandos**: `node .agents/skills/specsfy-04-validate/scripts/validate_spec.mjs specs/draft/0011-onboarding-primeiro-uso/spec.md --allow-draft` e `node .agents/skills/specsfy-04-validate/scripts/review_findings.mjs specs/draft/0011-onboarding-primeiro-uso/spec.md`.
- **Evidência**: 2026-08-29 — `RESULTADO: VALID DRAFT`; `Reviews: PASSED`; DEC-002 registra a aprovação combinada de mockup e semântica.

#### Gate do Ato II — Plano

- **Resultado**: Passed
- **Comando**: `node .agents/skills/specsfy-05-tasks/scripts/validate_tasks.mjs specs/defined/0011-onboarding-primeiro-uso/spec.md --allow-draft`.
- **Evidência**: 2026-08-29 — `Contagens: total=5 complete=3 tdd=4 code=1 checklist_items=25 checklist_complete=15 covered_spec_ids=11 required_spec_ids=11`; `RESULTADO: VALID DRAFT`. T001–T003 têm RED observado e são predecessores diretos de T004.

#### Gate do Ato III — Entrega

- **Resultado**: Passed
- **Comandos**: focal `npm run test:tdd -- tests/onboarding-first-use.test.js --reporter=dot --testTimeout=5000`; regressão `npm run test:tdd -- tests --exclude tests/partitura/** --reporter=dot --testTimeout=10000 --pool=forks --poolOptions.forks.singleFork --no-file-parallelism`; rastreabilidade com `--allow-orphans`; `verify_acceptance`, `validate_spec`, `validate_tasks`, `review_findings`, documentator `--check` e `git diff --check`.
- **Evidência**: focal exit 0, 1 arquivo/7 testes; regressão exit 0, 15 arquivos/112 testes; rastreabilidade 11/11 e OK com órfãos globais preexistentes explicitamente ignorados; QA PASSED; validators READY e reviews PASSED. `monitor_context` não pôde iniciar Git como filho (`TypeError` em `spawnSync`); `git status --short` e `git diff --check` diretos foram executados como evidência equivalente. Não houve validação gráfica por restrição vinculante de não abrir navegador, portal, screenshot ou headless.

### 14. Tarefas

#### Fase 1 — RED TDD informado pelo BDD

- [x] T001 [TEST] [TDD] [US-001] Derivar AC-001 para conclusão e persistência local em `tests/onboarding-first-use.test.js` — Refs: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-001 — Depends: none
  - [x] **PREP**: Confirmados três passos, chave canônica e ambas as variantes HTML.
  - [x] **EXECUTE**: Criado caso JSDOM `SPECSFY:` para conclusão e estado local visto.
  - [x] **VERIFY**: RED comportamental observado nas duas variantes.
  - [x] **EVIDENCE**: Comando e falhas registradas na seção 11.
  - [x] **IMPROVE**: Caso permanece sem navegador, rede ou `.feature`.

- [x] T002 [TEST] [TDD] [US-001] Derivar AC-002 para Pular sem rede em `tests/onboarding-first-use.test.js` — Refs: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-002 — Depends: none
  - [x] **PREP**: Confirmados Pular e o isolamento das chaves protegidas.
  - [x] **EXECUTE**: Criado caso JSDOM `SPECSFY:` que pula e observa estado visto.
  - [x] **VERIFY**: RED comportamental observado nas duas variantes.
  - [x] **EVIDENCE**: Comando e falhas registradas na seção 11.
  - [x] **IMPROVE**: Teste não introduz telemetria nem portal.

- [x] T003 [TEST] [TDD] [US-002] Derivar AC-003 para reabrir sem reset em `tests/onboarding-first-use.test.js` — Refs: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-003 — Depends: none
  - [x] **PREP**: Confirmados Ver introdução e default seguro para estado ausente/inválido.
  - [x] **EXECUTE**: Criado caso JSDOM `SPECSFY:` de reabertura e preservação numa nova instância.
  - [x] **VERIFY**: RED comportamental observado nas duas variantes.
  - [x] **EVIDENCE**: Comando e falhas registradas na seção 11.
  - [x] **IMPROVE**: Caso protege campos existentes da configuração.

#### Fase 2 — US-001 e US-002

**Objetivo**: orientar o primeiro treino sem criar login, rede ou telemetria e permitir revisão local.
**Teste independente**: `npm run test:tdd -- tests/onboarding-first-use.test.js` verde nas duas variantes.

- [x] T004 [CODE] [US-001] Implementar onboarding local, controle Ajustes e estilos T036 em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-001, AC-002, AC-003 — Depends: T001, T002, T003
  - [x] **PREP**: REDs T001–T003 confirmados; fonte canônica `treino_hibrido_juarez_v5` localizada por testes de preferência existentes, sem tocar em chaves protegidas.
  - [x] **EXECUTE**: Implementada UI local de três passos, persistência mesclada e Ver introdução com APIs DOM nas duas variantes.
  - [x] **VERIFY**: Focal GREEN nas duas variantes; o contrato material testa overlay/controle equivalentes e bloqueia URLs remotas no bloco novo.
  - [x] **EVIDENCE**: Comandos, contagem, arquivos e GREEN registrados nas seções 11–13.
  - [x] **IMPROVE**: Documentação reconstruída/verificada; revisão de `PROJECT.md` não identifica mudança material de finalidade, e não há alteração de banco, stack ou regra durável além de DEC-001/002 já registrada.
  <!-- specsfy:evidence {"task":"T004","refs":["US-001","US-002","FR-001","FR-002","FR-003","NFR-001","NFR-002","NFR-003","AC-001","AC-002","AC-003"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/onboarding-first-use.test.js"],"commands":[{"run":"npm run test:tdd -- tests/onboarding-first-use.test.js --reporter=verbose --testTimeout=5000","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0}]} -->

- [x] T005 [TEST] Executar regressão, rastreabilidade e documentação da SPEC-0011 em `tests/`, `docs/` e `specs/in-progress/0011-onboarding-primeiro-uso/spec.md` — Refs: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-001, AC-002, AC-003 — Depends: T004
  - [x] **PREP**: Identificadas suíte de produto sem Partitura, validators e limitação gráfica vinculante.
  - [x] **EXECUTE**: Executados regressão, documentator, rastreabilidade focal, aceite, diff e paridade estática sem navegador.
  - [x] **VERIFY**: Produto passou; monitor reproduziu limitação de processo-filho Git e a equivalência direta de `git status`/`git diff --check` foi registrada, sem esconder pendência de produto.
  - [x] **EVIDENCE**: Comandos e exits reais estão registrados nas seções 11–13; QA passou.
  - [x] **IMPROVE**: Validação gráfica não foi declarada porque a restrição vinculante proíbe navegador, portal, screenshot e headless; hunks preexistentes ficaram fora do escopo.

### 15. Ordem de execução

- Caminho crítico: T001/T002/T003 (RED observados) → T004 (GREEN mínimo) → T005 (qualidade/Delivery).
- Tarefas paralelas: T001, T002 e T003 compartilham o mesmo arquivo de teste, portanto permanecem serializadas.
- Estratégia de MVP: uma preferência local no objeto já existente, overlay de três passos e reabertura por Ajustes, sem rede ou conta.

## Ato III — Entregar e validar

### 16. Dependências, riscos e suposições

#### Dependências

- Nenhuma externa; mockup e semântica foram aprovados pelo Codex - Procurador em 2026-08-29.

#### Riscos

- “Login” no pedido original pode ser interpretado como autenticação inexistente → DEC-001 restringe à primeira abertura local.
- Um tutorial muito longo pode impedir o primeiro treino → limitar a três passos curtos e permitir Pular.

#### Suposições

- A abertura local é o gatilho apropriado enquanto não existe conta ou login no produto.

### 17. Decisões

- **DEC-001**: O onboarding será acionado no primeiro uso local por dispositivo, terá Pular e reabertura via Ajustes, e não terá conta, login, rede, backend, telemetria ou feedback remoto. — Escolha 1 aprovada pelo Codex - Procurador em 2026-08-29; preserva o comportamento existente e evita introduzir uma capacidade não presente.
- **DEC-002**: O mockup estático iOS 390×844 e a semântica de até três passos, indicador, Voltar/Próximo, Pular, Começar treino e reabertura sem reset foram aprovados integralmente pelo Codex - Procurador em 2026-08-29. — A fonte usa os tokens T036 e será a referência visual da implementação.

### 18. Definition of Done

- [x] Texto humano original preservado em Inbox e referenciado nesta fonte.
- [x] Backlog e SPEC Draft locais criados.
- [x] Mockup estático iOS 390×844 criado com tokens reais.
- [x] Aprovação combinada do mockup e da semântica recebida (DEC-002).
- [x] Definition Gate Passed.
- [x] Plan Gate Passed.
- [x] Produto implementado.
- [x] Delivery Gate Passed.
