# Especificação integrada: Onboarding configurador local e feedback manual

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0013 |
| Slug | 0013-onboarding-configurador-local-feedback-manual |
| Status | Complete |
| Effort | 1 |
| Effort updated at | 2026-08-29 |
| Effort rationale | Estimativa inicial; revisar durante a descoberta. |
| ClickUp Task | |
| Milestones | |
| Definition Gate | Passed |
| Plan Gate | Passed |
| Delivery Gate | Passed |
| Evidence Contract | 1 |
| Atualizada em | 2026-08-29 |

## Ato I — Definir

### 1. Problema e resultado

#### Problema

O overlay atual mantém `display:grid` após `hidden=true`, cobre o app no Chromium real e o tutorial não configura pessoa nem treino próprios.

#### Resultado desejado

Instalação nova configura apelido opcional, objetivo e treino próprio; pode retomar depois. Feedback completo pode ser compartilhado manualmente e isolado.

#### Métricas de sucesso

- Portal local Chromium 390x835 comprova overlay oculto e clique subsequente funcional nas duas variantes.
- Instalação nova só conclui com treino próprio; a existente preserva dados de Juarez.

### 2. Research e esclarecimentos

#### Researchs executados

- **R-001**: Chromium real local mostrou `hidden=true` com display computado `grid`; onboarding e feedback repetem a falha. Impacto: RED e aceite medem visibilidade computada e cliques reais.
- **R-002**: importação PDF/TXT/texto e compartilhamento/download manuais já existem localmente. Impacto: reutilizar as fontes sem backend.

#### Fontes e contexto consultados

- Inbox sucessora, specs concluídas 0011/0012 e 0008/0009, `.specsfy/DATABASE.md`, dois HTMLs e testes focais.

#### Documentação consultada

- Nenhuma fonte externa.

#### Artefatos de pesquisa armazenados

- Nenhum artefato externo; reprodução registrada em `Specsfy - Operação-2`.

#### Dúvidas respondidas

- **Q**: tutorial ou configuração? → **A**: configuração inicial local.
- **Q**: perfis múltiplos? → **A**: não; uma pessoa por instalação/navegador.
- **Q**: feedback? → **A**: compartilhar manualmente somente as três respostas.

#### Dúvidas abertas

- Nenhuma.

### 3. Escopo e atores

#### Incluído

- Correção de overlay, configuração direta, rascunho retomável, treino próprio por fonte única, compartilhamento manual de feedback, paridade e aceite portal real.

#### Fora de escopo

- Login, conta, autenticação, perfis múltiplos, backend, telemetria, envio automático, rede automática, serviço pago, dado real e migração destrutiva.

#### Atores

- **Pessoa em instalação nova**: configura dados e treino próprios.
- **Pessoa em instalação existente**: mantém dados de Juarez intactos.
- **Juarez**: recebe apenas resumo voluntariamente compartilhado.

### 4. Princípios e restrições do projeto

- **PR-001**: uma pessoa por instalação/navegador, sem cópia silenciosa de dados de Juarez.
- **PR-002**: Importar novo treino/Trocar treino é fonte única do treino próprio.
- **PR-003**: `hidden` deve ocultar de fato e não interceptar cliques.
- **PR-004**: sem ação externa automática, backend ou serviço pago.

### 5. Histórias de usuário

#### US-001 — Configurar instalação própria (P1)

Como pessoa em instalação nova, quero informar dados mínimos e importar meu treino, para começar sem receber dados de Juarez.

**Por que P1**: elimina o bloqueio real e garante a finalidade do primeiro uso.
**Teste independente**: portal 390x835 conclui só após treino próprio salvo.
**Requisitos**: FR-001, FR-002, FR-003

#### US-002 — Retomar sem bloqueio (P1)

Como pessoa sem treino em mãos, quero continuar depois, para não ficar presa nem perder o rascunho mínimo.

**Requisitos**: FR-001, FR-002, FR-003

#### US-003 — Compartilhar feedback voluntariamente (P2)

Como pessoa com feedback completo, quero compartilhá-lo manualmente, para enviar a Juarez somente esse resumo.

**Requisitos**: FR-001, FR-004

### 6. Cenários BDD de aceite

#### AC-001 — Overlay fecha de verdade

**Cobre**: US-001, US-002, US-003, FR-001, FR-004, NFR-001, NFR-002, NFR-004

```gherkin
@US-001 @US-002 @US-003 @FR-001 @NFR-001 @NFR-002 @AC-001
Feature: overlays observavelmente ocultos

  Scenario: fechar não deixa cobertura residual
    Given o portal móvel limpo 390x835 com onboarding ou feedback aberto
    When a pessoa usa o controle aplicável
    Then o display computado não é grid e o app recebe um clique subsequente
```

#### AC-002 — Configurar treino próprio

**Cobre**: US-001, FR-002, FR-003, NFR-002, NFR-003

```gherkin
@US-001 @FR-002 @FR-003 @NFR-003 @AC-002
Feature: configuração local própria

  Scenario: instalação nova conclui com treino próprio
    Given uma instalação sem configuração concluída
    When a pessoa informa apelido opcional, objetivo válido e importa treino por fonte existente
    Then conclui localmente sem copiar perfil, histórico ou treino de Juarez
```

#### AC-003 — Continuar depois

**Cobre**: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003

```gherkin
@US-001 @US-002 @FR-002 @FR-003 @NFR-003 @AC-003
Feature: rascunho de configuração

  Scenario: pessoa interrompe antes da importação
    Given apelido opcional e objetivo preenchidos sem treino salvo
    When seleciona Continuar depois
    Then o rascunho é retomado e a configuração continua pendente
```

#### AC-004 — Preservar instalação existente

**Cobre**: US-001, US-002, FR-002, FR-003, NFR-003

```gherkin
Scenario: dados existentes permanecem intactos
  Given uma instalação com dados de Juarez
  When o app abre após a atualização
  Then não inicia configuração nova e todos os dados locais permanecem iguais
```

#### AC-005 — Compartilhar somente feedback completo

**Cobre**: US-003, FR-001, FR-004, NFR-001, NFR-004

```gherkin
Scenario: pessoa compartilha resumo isolado
  Given três respostas completas de feedback
  When seleciona Compartilhar feedback em Ajustes
  Then o mecanismo manual recebe somente as três respostas e oferece download como fallback
```

#### AC-006 — Feedback incompleto não sai do aparelho

**Cobre**: US-003, FR-004, NFR-004

```gherkin
Scenario: feedback parcial não é compartilhável
  Given feedback ausente, inválido ou incompleto
  When a pessoa abre Ajustes
  Then não há resumo compartilhável e nenhum envio é iniciado
```

### 7. Requisitos

#### Funcionais

- **FR-001**: overlays de onboarding e feedback ficam realmente ocultos ao fechar e não interceptam cliques.
- **FR-002**: instalação nova coleta apelido opcional, objetivo de lista fixa e exige treino próprio salvo; Continuar depois guarda somente rascunho mínimo.
- **FR-003**: instalação existente preserva dados e não inicia configuração nova; instalação nova não copia dados de Juarez.
- **FR-004**: Ajustes compartilha manualmente somente as três respostas completas com mecanismo existente.

#### Não funcionais

- **NFR-001**: aceite inclui display computado e clique real no Chromium local 390x835. **Verificação**: portal nas duas variantes.
- **NFR-002**: controles têm alvo mínimo 44 px e os dois HTMLs mantêm paridade. **Verificação**: inspeção e teste.
- **NFR-003**: persistência é local, retrocompatível e não apaga dados existentes. **Verificação**: Vitest com snapshots.
- **NFR-004**: sem rede automática, backend, telemetria, login, conta, serviço pago ou identificação adicional. **Verificação**: testes e inspeção estática.

#### Erros e casos-limite

- Importação cancelada, inválida ou incompleta mantém configuração pendente.
- Feedback ausente, inválido ou apagado não gera resumo.

## Ato II — Projetar e provar

### 8. Plano técnico

#### Contexto existente

- `index.html` e `treino_hibrido_juarez_v3_standalone.html` são variantes Vanilla JavaScript equivalentes; o estado canônico está no `localStorage` e Vitest é acionado por `npm run test:tdd`.

#### Arquitetura e módulos

- Um normalizador do estado canônico acrescenta perfil inicial, rascunho e conclusão sem remover campos existentes. O onboarding chama a importação/troca existente; o feedback gera resumo isolado. Ambos os overlays usam uma regra explícita de ocultação que supera o `display` visual.

#### Migrations

- Extensão retrocompatível do objeto local: campos ausentes assumem defaults seguros; instalação já configurada não é reinicializada e nenhum dado existente é removido.

#### Models

- `initialProfileDraft` contém apelido opcional e objetivo fixo; `onboardingConfigured` só fica verdadeiro após treino próprio salvo; `firstUseFeedback` continua com três escolhas completas ou nenhuma. Caminhos: ambos os HTMLs.

#### Controllers e casos de uso

- Handlers locais abrem, fecham, continuam, retomam, importam, concluem e compartilham; não recebem nem enviam dados por rede.

#### Views e experiência

- Configuração direta mostra apelido, objetivo, importação e Continuar depois; Ajustes mostra Compartilhar feedback apenas quando completo. Controles têm pelo menos 44 px e overlays fechados não recebem clique.

#### Queries e repositórios

- Não aplicável: não há banco, API, consulta remota ou repositório.

#### Jobs e processamento assíncrono

- Não aplicável: não há jobs, filas, retry ou processamento externo.

#### Estrutura de arquivos

```text
index.html
treino_hibrido_juarez_v3_standalone.html
tests/onboarding-configurator.test.js
tests/first-use-feedback.test.js
specs/draft/0013-onboarding-configurador-local-feedback-manual/spec.md
```

### 9. Modelo de dados

#### Entidades

| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| Perfil inicial local | instalação/navegador | apelido opcional; objetivo entre Força, Ganho de massa, Condicionamento, Mobilidade/saúde geral ou Outro | um treino próprio |
| Rascunho de configuração | instalação/navegador | somente apelido e objetivo; nunca libera o onboarding | vira configuração concluída |
| Feedback local | instalação/navegador | três respostas completas ou nenhuma; resumo sem outros dados | compartilhamento voluntário |

#### Estados e transições

| Entidade | Estado atual | Evento | Próximo estado | Invariantes |
| --- | --- | --- | --- | --- |
| Configuração | pendente | treino próprio salvo | concluída | não copia dados de Juarez |
| Configuração | pendente | Continuar depois | rascunho | não conclui sem treino |
| Overlay | aberto | fechar | oculto | não cobre nem intercepta clique |

#### Migração e retenção

- Campos ausentes permanecem compatíveis; limpeza do navegador continua removendo somente os dados locais daquela origem.

### 10. Interfaces e contratos

#### APIs expostas

- Nenhuma.

#### APIs externas utilizadas

- Nenhuma; compartilhamento usa a ação manual existente do navegador com fallback de download local.

#### Documentação das APIs consultadas

- Nenhuma documentação externa foi consultada.

#### Eventos e outros contratos

- Contrato local: Continuar depois mantém rascunho sem concluir; Compartilhar feedback produz somente três respostas completas.

### 11. Estratégia TDD

- **Unidade/DOM**: Vitest cobre normalização, rascunho, conclusão e conteúdo do resumo.
- **Integração/contrato**: ambas as variantes HTML, `localStorage`, importação existente e compartilhamento/download existente.
- **BDD/aceite**: AC-001–AC-006 orientam os testes executáveis; não há arquivo `.feature`.
- **Runner TDD**: Vitest pelo script confirmado `npm run test:tdd`.
- **E2E**: Chromium real do portal local em 390x835 para AC-001, AC-003 e fechamento do feedback.
- **Verificação manual**: portal é inevitável porque JSDOM não mede `getComputedStyle` nem clique observável.

#### Evidência RED-GREEN-REFACTOR

| IDs | BDD de referência | Teste TDD informado pelo BDD | RED observado | GREEN observado | Refactor/regressão |
| --- | --- | --- | --- | --- | --- |
| FR-001, NFR-001, AC-001 | AC-001 | `tests/onboarding-configurator.test.js` com marcador `SPECSFY:` | Pending | Pending | Pending |
| FR-002, FR-003, NFR-003, AC-002 | AC-002 | `tests/onboarding-configurator.test.js` com marcador `SPECSFY:` | Pending | Pending | Pending |
| FR-002, FR-003, NFR-003, AC-003 | AC-003 | `tests/onboarding-configurator.test.js` com marcador `SPECSFY:` | Pending | Pending | Pending |
| FR-004, NFR-004, AC-005 | AC-005 | `tests/first-use-feedback.test.js` com marcador `SPECSFY:` | Pending | Pending | Pending |

### 12. Plano de testes e rastreabilidade

| Requisito | Cenário BDD | Nível | Arquivo/comando esperado | Evidência |
| --- | --- | --- | --- | --- |
| FR-001, NFR-001–002 | AC-001 | DOM e portal | `tests/onboarding-configurator.test.js`; portal 390x835 | Passed — RED/GREEN computado nas duas variantes e fechamento físico confirmado. |
| FR-002, FR-003, NFR-003 | AC-002, AC-003, AC-004 | DOM/storage e portal | `tests/onboarding-configurator.test.js`; Chromium 390x826 | Passed — instalação limpa configurada com Treino do Pai/Agachamento, rascunho retomado, perfil/sessões legadas preservados e catálogo próprio isolado. |
| FR-004, NFR-004 | AC-005, AC-006 | DOM/static | `tests/first-use-feedback.test.js` | Passed — compartilhamento manual contém somente três respostas completas; resposta parcial não sai do aparelho. |

### 13. Validações

#### Gate do Ato I — Definição

- **Resultado**: Passed
- **Comandos**: `validate_spec.mjs --allow-draft` e `review_findings.mjs`.
- **Evidência**: 2026-08-29 — Ato II/III consolidado; `validate_spec --allow-draft` retornou `VALID DRAFT` e não há decisão material aberta.
- Findings especializados, quando aplicáveis, seguem `FIND-PROD|ARCH|SEC-NNN`,
  severidade `P1|P2|P3`, estado `Open|Resolved|Accepted`, refs e evidência.

#### Gate do Ato II — Plano

- **Resultado**: Passed
- **Comandos**: `validate_tasks.mjs --allow-draft` e `check_traceability.mjs --allow-orphans`.
- **Evidência**: 2026-08-29 — tarefas 7/7, REDs T001–T003 concluídos com 6 falhas esperadas; `RESULTADO: VALID DRAFT`; rastreabilidade `17/17` e `RESULTADO: OK` com marcadores externos ignorados.

#### Gate do Ato III — Entrega

- **Resultado**: Passed
- **Comandos**: `npm run test:tdd -- tests/onboarding-configurator.test.js tests/onboarding-first-use.test.js tests/first-use-feedback.test.js`; regressão completa local; `verify_acceptance.mjs`; `validate_spec.mjs`; `validate_tasks.mjs`; `check_traceability.mjs --allow-orphans`; `review_findings.mjs`; `build_documentation.mjs --check`; `monitor_context.mjs`; `git diff --no-index` e `git diff --check`.
- **Evidência**: 2026-08-29 — focais 37/37 e evidência independente de suíte completa 155/155 incluindo Partitura, ambos exit 0; aceite PASSED, rastreabilidade 17/17, reviews PASSED, monitor CURRENT e paridade dos HTMLs sem diferença. Chromium real 390×826 percorreu configurador, importação, confirmação, saudação imediata, Treinos e runner por cliques físicos.
- **Achados**: Nenhum aberto; sem deploy, publicação, produção, rede ou dado real.

### 14. Tarefas

Formato:
`- [ ] TNNN [P?] [TIPO] [US-NNN?] Ação com caminho — Refs: IDs — Depends: IDs|none`

Cada tarefa possui exatamente este checklist, atualizado durante a execução:

```markdown
  - [ ] **PREP**: Confirmar escopo, IDs, dependências e baseline.
  - [ ] **EXECUTE**: Produzir a entrega no caminho declarado.
  - [ ] **VERIFY**: Executar a verificação focal adequada.
  - [ ] **EVIDENCE**: Registrar comando, resultado e IDs nas seções 11–13.
  - [ ] **IMPROVE**: Registrar melhoria aplicada ou ausência justificada.
```

#### Fase 1 — RED TDD informado pelo BDD

- [x] T001 [TEST] [TDD] [US-001] Derivar RED de visibilidade computada em `tests/onboarding-configurator.test.js` — Refs: US-001, US-002, US-003, FR-001, FR-002, FR-003, FR-004, NFR-001, NFR-002, NFR-003, NFR-004, AC-001 — Depends: none
  - [x] **PREP**: Confirmados AC-001 e as duas variantes.
  - [x] **EXECUTE**: Caso Vitest com marcador SPECSFY criado sem `.feature`.
  - [x] **VERIFY**: RED `grid` versus `none` observado nas duas variantes.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/onboarding-configurator.test.js`, exit 1, 6 falhas esperadas.
  - [x] **IMPROVE**: Incluída medição computada ausente nos testes históricos.

- [x] T002 [TEST] [TDD] [US-002] Derivar RED de perfil, treino próprio, rascunho e preservação em `tests/onboarding-configurator.test.js` — Refs: US-001, US-002, US-003, FR-001, FR-002, FR-003, FR-004, NFR-001, NFR-002, NFR-003, NFR-004, AC-002, AC-003, AC-004 — Depends: none
  - [x] **PREP**: Confirmados AC-002 a AC-004 e snapshots protegidos.
  - [x] **EXECUTE**: Caso Vitest com marcadores SPECSFY criado.
  - [x] **VERIFY**: RED por controles e estado configurador ausentes nas duas variantes.
  - [x] **EVIDENCE**: Mesmo comando focal, exit 1, 6 falhas esperadas.
  - [x] **IMPROVE**: Cenário existente de Juarez é preservado no teste.

- [x] T003 [TEST] [TDD] [US-003] Derivar RED de compartilhamento isolado em `tests/onboarding-configurator.test.js` — Refs: US-001, US-002, US-003, FR-001, FR-002, FR-003, FR-004, NFR-001, NFR-002, NFR-003, NFR-004, AC-005, AC-006 — Depends: none
  - [x] **PREP**: Confirmados AC-005 e AC-006 sem envio automático.
  - [x] **EXECUTE**: Caso Vitest com marcador SPECSFY criado.
  - [x] **VERIFY**: RED por botão isolado inexistente nas duas variantes.
  - [x] **EVIDENCE**: Mesmo comando focal, exit 1, 6 falhas esperadas.
  - [x] **IMPROVE**: Teste exige resumo separado de perfil, treino e histórico.

#### Fase 2 — US-001 e US-002 — configuração local (P1)

**Objetivo**: corrigir overlays e configurar instalação nova sem copiar Juarez.
**Teste independente**: `npm run test:tdd -- tests/onboarding-configurator.test.js`.

- [x] T004 [CODE] [US-001] Implementar overlays e onboarding configurador em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-001, AC-002, AC-003, AC-004 — Depends: T001, T002, T003
  - [x] **PREP**: Confirmados REDs T001/T002 e dependências.
  - [x] **EXECUTE**: Corrigido fechamento computado e incluída configuração/rascunho local nas duas variantes.
  - [x] **VERIFY**: REDs de z-index, configuração sem treino, estado inicial, catálogo, identidade e visibilidade foram GREEN nas duas variantes.
  - [x] **EVIDENCE**: 2026-08-29 — novo RED de saudação imediata observou `Olá!` em vez de `Olá, Pai!` nas duas variantes; após `renderProfileSummary()` na conclusão, `npm run test:tdd -- tests/onboarding-configurator.test.js tests/onboarding-first-use.test.js tests/first-use-feedback.test.js --reporter=dot --testTimeout=10000` passou 37/37.
  - [x] **IMPROVE**: Tutorial de três passos supersedido por configurador direto; DEFAULT_STATE distribuído ficou vazio e acessos diretos a `WORKOUTS` foram isolados.
  <!-- specsfy:evidence {"task":"T004","refs":["US-001","US-002","FR-001","FR-002","FR-003","NFR-001","NFR-002","NFR-003","AC-001","AC-002","AC-003","AC-004"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/onboarding-configurator.test.js","tests/onboarding-first-use.test.js"],"commands":[{"run":"npm run test:tdd -- tests/onboarding-configurator.test.js tests/onboarding-first-use.test.js tests/first-use-feedback.test.js --reporter=dot --testTimeout=10000","exit":0}]} -->
**Checkpoint**: as duas variantes passam o focal configurador e o portal 390x835 confirma cliques reais.

#### Fase final — Qualidade

- [x] T005 [CODE] [US-003] Implementar compartilhamento manual isolado em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-003, FR-001, FR-004, NFR-001, NFR-004, AC-001, AC-005, AC-006 — Depends: T001, T002, T003
  - [x] **PREP**: Confirmado RED do botão isolado e paridade inicial.
  - [x] **EXECUTE**: Adicionado gerador manual somente das três respostas e fallback de download local.
  - [x] **VERIFY**: Focal de feedback passou; exclusão também produz `display:none` e botão permanece oculto sem resposta completa.
  - [x] **EVIDENCE**: Mesmo comando focal, 37/37 verdes; a regressão proporcional será refeita depois da interrupção de T006/T007.
  - [x] **IMPROVE**: Sem envio automático; o compartilhamento manual continua contendo somente as três respostas.
  <!-- specsfy:evidence {"task":"T005","refs":["US-003","FR-001","FR-004","NFR-001","NFR-004","AC-001","AC-005","AC-006"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/first-use-feedback.test.js","tests/onboarding-configurator.test.js"],"commands":[{"run":"npm run test:tdd -- tests/onboarding-configurator.test.js tests/onboarding-first-use.test.js tests/first-use-feedback.test.js --reporter=dot --testTimeout=10000","exit":0}]} -->

- [x] T006 [DOC] Reconciliar `.specsfy/DATABASE.md`, `docs/` e `.specsfy/PACKAGES.md` após T004/T005 — Refs: FR-002, FR-003, FR-004, NFR-003, NFR-004 — Depends: T004, T005
  - [x] **PREP**: Reaberto após a mudança tardia de isolamento e configurador direto.
  - [x] **EXECUTE**: `docs/` e `.specsfy/PACKAGES.md` reconstruídos localmente.
  - [x] **VERIFY**: `build_documentation.mjs --check` passou.
  - [x] **EVIDENCE**: 2026-08-29 — `node .agents\skills\specsfy-documentator\scripts\build_documentation.mjs --project C:\Users\Samsung\Documents\treino_v3` e o mesmo comando com `--check`, exit 0.
  - [x] **IMPROVE**: Reconstrução preservou conteúdo humano fora dos blocos gerados; sem rede ou publicação.

- [x] T007 [TEST] Executar portal real, regressão, rastreabilidade e paridade em `tests/onboarding-configurator.test.js`, `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: FR-001, FR-002, FR-003, FR-004, NFR-001, NFR-002, NFR-003, NFR-004, AC-001, AC-002, AC-003, AC-004, AC-005, AC-006 — Depends: T006
  - [x] **PREP**: Suites, checks e gate identificados; clique físico real é obrigatório e não será substituído por `element.click` ou `evaluate`.
  - [x] **EXECUTE**: Focais 37/37, regressão sem Partitura 142/142, documentação, `validate_spec`, `validate_tasks`, rastreabilidade, review, paridade e monitor foram reexecutados; portal foi reaberto em 390×835 e recebeu preenchimento/seleção reais.
  - [x] **VERIFY**: Retrospectiva física: antes da correção, clique real em `Pular` fechava visualmente (`hidden=true`, `display=none`) mas gravava `onboardingSeen=true`, `profile=Juarez Silva`, `sessions=15`, `imports=0`. Após a correção, Chromium 390×826 completou por cliques reais: nome Pai, objetivo Condicionamento, prévia Treino do Pai/Agachamento, confirmação, overlay `display:none`, saudação imediata `Olá, Pai!`, `seen/configured=true`, sessões=0, catálogo `import-treino-do-pai` e hero Treino do Pai. Treinos mostrou somente Treino do Pai/Agachamento, sem Superior A; Iniciar Treino abriu runner ativo com dia `import-treino-do-pai` e exercício Agachamento.
  - [x] **EVIDENCE**: 2026-08-29 — focais 37/37, exit 0; evidência independente do Procurador: suíte completa incluindo Partitura 155/155 em 19 arquivos, exit 0; `git diff --no-index` entre HTMLs exit 0; `git diff --check` exit 0; varredura dos HTMLs encontrou 0 dados pessoais (`Juarez Silva`, IDs/notas pessoais) e 0 controles legados do onboarding. `validate_spec` READY; rastreabilidade 17/17 OK; reviews PASSED; monitor CURRENT; documentação reconstruída e check exit 0.
  - [x] **IMPROVE**: RED de saudação imediata adicionado após evidência física; atualização local do cabeçalho passou a ocorrer na conclusão, sem reload.

### 15. Ordem de execução

- Caminho crítico: T001/T002/T003 → T004 → T005.
- Tarefas paralelas: nenhuma tarefa de edição foi paralelizada, pois os testes e os dois HTMLs são fontes compartilhadas.
- Estratégia de MVP: configurador direto, importação obrigatória de treino próprio e feedback manual local, sem conta, backend ou perfis múltiplos.

## Ato III — Entregar e validar

### 16. Dependências, riscos e suposições

#### Dependências

- Importador local existente para texto colado, TXT e PDF, e `localStorage` do navegador para rascunho, perfil, treino importado e feedback; não há dependência de rede, backend ou conta.

#### Riscos

- Texto, TXT ou PDF em formato inválido ou sem conteúdo utilizável → a prévia e a validação local impedem confirmação; o onboarding não conclui enquanto não houver treino próprio salvo.

#### Suposições

- Nenhuma suposição aberta além das decisões confirmadas nesta spec.

### 17. Decisões

- **DEC-001 — instalação pessoal configurada localmente**: o app atende uma pessoa por instalação/navegador; o onboarding só conclui após importar o treino próprio, e perfil, rascunho, treino e feedback permanecem na persistência local. A alternativa de perfis múltiplos, conta, backend ou compartilhamento automático foi descartada neste recorte para não copiar dados de Juarez nem ampliar a coleta.
- **DEC-002 — supersessão de onboarding**: a SPEC-0013 substitui, somente para instalação nova, o tutorial de três passos da SPEC-0011 por um configurador direto com nome/apelido opcional, objetivo, importação obrigatória do treino próprio e `Continuar depois`. A SPEC-0011 permanece histórico concluído e não é reescrita. Entrada humana literal: “Requisito confirmado anteriormente: onboarding abre direto como CONFIGURADOR, não como tutorial de 3 passos. Não preserve visíveis no primeiro uso Introdução 1 de 3, Próximo/Voltar, Pular ou Começar treino antigos só para satisfazer testes legados.”
- **DEC-003 — isolamento do artefato distribuído**: `DEFAULT_STATE` não contém perfil, sessões, notas ou treino pessoal; instalações legadas preservam seus dados por `localStorage`, e o backup histórico existente em `dados/` não foi modificado. Entrada humana literal: “Privacidade adicional: não basta loadState devolver vazio. O DEFAULT_STATE embutido nos HTMLs contém perfil, 15 sessões e notas pessoais do Juarez; qualquer pessoa que receber o HTML consegue ler isso no código-fonte, mesmo que a UI não mostre.”

### 18. Definition of Done

- [x] `Definition Gate` está `Passed`.
- [x] `Plan Gate` está `Passed`.
- [x] `Delivery Gate` está `Passed`.
- [x] Todos os cenários `AC` aplicáveis passam.
- [x] Todos os requisitos possuem evidência de verificação.
- [x] Todas as tarefas na seção 14 estão concluídas.
- [x] Testes e checks estáticos disponíveis passam.
