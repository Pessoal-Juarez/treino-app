# Especificação integrada: Coleta de feedback local de primeiro uso

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0012 |
| Slug | 0012-coleta-feedback-local-primeiro-uso |
| Status | Complete |
| Effort | 5 |
| Effort updated at | 2026-08-29 |
| Effort rationale | Interface móvel, gatilho após sessão salva, persistência local segura e paridade entre duas variantes HTML, sem rede. |
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

Juarez precisa receber retorno estruturado do pai após seu primeiro uso completo, sem reabrir o onboarding concluído e sem conta, rede, telemetria ou envio externo.

#### Resultado desejado

Depois de salvar o primeiro treino completo, a pessoa responde ou pula três perguntas curtas. Juarez revisa localmente um único conjunto de respostas em Ajustes e pode apagá-lo sem afetar outros dados.

#### Métricas de sucesso

- Testes focais cobrem AC-001–AC-004 nas duas variantes HTML, com 100% verde.
- Inspeção estática encontra zero URL remota, `fetch`, login, telemetria, comentário livre ou nota numérica no recurso novo.
- Exclusão e recuperação preservam perfil, treinos, histórico e configurações nos testes.

### 2. Research e esclarecimentos

#### Researchs executados

- **R-001**: `codegraph explore` para localizar feedback e conclusão do treino → o binário retornou `unknown command explore`; sem inferir comportamento a partir disso.
- **R-002**: inspeção de `index.html` e da variante standalone → `saveActiveWorkoutSession()` é o salvamento de conclusão; `loadState()` e `persist()` usam `treino_hibrido_juarez_v5`; Ajustes e onboarding têm paridade. Impacto: gatilho pós-salvamento, estado canônico e UI espelhada.
- **R-003**: inspeção de `package.json` e testes → JSDOM e Vitest existem, com `test:tdd`; a escolha explícita do runner desta spec está pendente e não autoriza instalação.

#### Fontes e contexto consultados

- `specs/inbox/2026-08-29-130141-onboarding-para-primeiro-uso.md` — texto humano literal.
- `specs/backlog/0012-coleta-feedback-local-primeiro-uso.md` — brief e decisões.
- `specs/completed/0011-onboarding-primeiro-uso/spec.md` — onboarding preservado.
- `.specsfy/DATABASE.md`, `index.html`, `treino_hibrido_juarez_v3_standalone.html`, `package.json` e `tests/onboarding-first-use.test.js`.

#### Documentação consultada

- Nenhuma fonte externa.

#### Artefatos de pesquisa armazenados

- Nenhum artefato externo.

#### Dúvidas respondidas

- **Q**: O onboarding muda? → **A**: Não; feedback é fatia separada.
- **Q**: Quando e onde o feedback abre? → **A**: Após a primeira sessão salva ou manualmente em Ajustes depois de pular.
- **Q**: Que informação fica guardada? → **A**: Um conjunto local, não identificável, de três escolhas e estado do convite.

#### Dúvidas abertas

- Nenhuma lacuna aplicável para a definição inicial.

### 3. Escopo e atores

#### Incluído

- Convite único após salvar o primeiro treino completo, fora da sessão; pulo e reabertura manual em Ajustes.
- Três perguntas: facilidade para iniciar o treino, registrar séries e descanso, e entender o fluxo geral.
- Somente `Fácil`, `Mais ou menos` e `Difícil`; persistência, revisão e remoção de um único feedback completo.
- Recuperação segura de estado ausente, parcial ou inválido.

#### Fora de escopo

- Onboarding, login, conta, perfil, backend, telemetria, analytics, rede, envio externo, comentário livre, dado pessoal, nota numérica, histórico ou edição silenciosa.
- Qualquer alteração em perfil, treinos, histórico ou configurações por feedback.

#### Atores

- **Pessoa no primeiro uso local**: responde ou pula após usar o fluxo completo.
- **Juarez**: revisa ou apaga o feedback no mesmo aparelho.
- **Pessoa com acesso físico ao aparelho**: pode ver as respostas; limite aceito sem autenticação.

### 4. Princípios e restrições do projeto

- **PR-001**: recurso totalmente local, sem rede, telemetria, analytics, envio ou compartilhamento.
- **PR-002**: apenas três respostas completas e válidas podem ser apresentadas como feedback.
- **PR-003**: excluir feedback não altera perfil, treinos, histórico ou configurações.
- **PR-004**: variantes HTML mantêm paridade; novos controles usam toque mínimo de 44 px e texto de 16 px.

### 5. Histórias de usuário

#### US-001 — Responder feedback do primeiro uso (P1)

Como pessoa que terminou o primeiro treino completo, quero responder ou pular três perguntas curtas, para relatar se consegui usar o fluxo essencial sem interromper o treino.

**Por que P1**: produz o retorno de uso pretendido.
**Teste independente**: salvar a sessão inicial e comprovar convite, pulo e submissão local nas duas variantes.
**Requisitos**: FR-001, FR-002, NFR-001, NFR-002, NFR-003.

#### US-002 — Revisar e reiniciar feedback local (P2)

Como Juarez, quero ver ou apagar o único feedback local em Ajustes, para revisar a experiência e permitir nova resposta sem mexer nos demais dados.

**Por que P2**: torna o retorno útil sem conta nem histórico.
**Teste independente**: revisar respostas, apagar e comparar dados protegidos antes e depois.
**Requisitos**: FR-002, FR-003, NFR-001, NFR-002, NFR-003.

### 6. Cenários BDD de aceite

#### AC-001 — Convidar somente após conclusão salva

**Cobre**: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003

```gherkin
@US-001 @US-002 @FR-001 @FR-002 @FR-003 @NFR-001 @NFR-002 @NFR-003 @AC-001
Feature: feedback local de primeiro uso
  Scenario: primeira sessão salva oferece feedback fora do treino
    Given que não há convite de feedback registrado
    And que a pessoa concluiu seu primeiro treino completo
    When a sessão é salva no histórico
    Then o convite com três perguntas é aberto após o salvamento
    And nenhum convite é exibido durante a sessão
```

#### AC-002 — Salvar escolhas locais sem identificação

**Cobre**: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003

```gherkin
@US-001 @US-002 @FR-001 @FR-002 @FR-003 @NFR-001 @NFR-002 @NFR-003 @AC-002
Feature: feedback local de primeiro uso
  Scenario: pessoa conclui três respostas estruturadas
    Given que o formulário de feedback está aberto
    When escolhe Fácil, Mais ou menos ou Difícil para cada pergunta e conclui
    Then um único conjunto completo é salvo somente no aparelho
    And não contém identificação, comentário livre ou nota numérica
    And não realiza atividade de rede
```

#### AC-003 — Pular e retomar somente por Ajustes

**Cobre**: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003

```gherkin
@US-001 @US-002 @FR-001 @FR-002 @FR-003 @NFR-001 @NFR-002 @NFR-003 @AC-003
Feature: feedback local de primeiro uso
  Scenario: convite pulado pode ser retomado sem interromper treino
    Given que a pessoa pulou o convite após a primeira sessão salva
    When alguém seleciona Responder feedback em Ajustes
    Then o formulário abre somente por essa ação explícita
    And nenhuma resposta parcial é exibida ou salva
    And treino, histórico, perfil e configurações permanecem inalterados
```

#### AC-004 — Revisar, apagar e recuperar com segurança

**Cobre**: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003

```gherkin
@US-001 @US-002 @FR-001 @FR-002 @FR-003 @NFR-001 @NFR-002 @NFR-003 @AC-004
Feature: feedback local de primeiro uso
  Scenario: feedback único é revisado, apagado ou recuperado
    Given que existe conjunto completo, ausente ou inválido de feedback local
    When Juarez abre Ajustes e apaga o feedback atual ou inicia nova resposta
    Then somente um conjunto completo pode ser mostrado como resposta
    And conjunto ausente ou inválido é tratado como sem feedback
    And apagar ou recuperar nunca altera perfil, treinos, histórico ou configurações
```

### 7. Requisitos

#### Funcionais

- **FR-001**: Após salvar a primeira sessão completa, o sistema deve exibir uma única vez o convite, exclusivamente depois do salvamento e nunca durante a sessão.
- **FR-002**: O sistema deve permitir pular, abrir manualmente, responder e revisar um único feedback completo com as três escolhas definidas.
- **FR-003**: O sistema deve permitir que Juarez apague somente o feedback atual; estado ausente, parcial ou inválido não pode aparecer como resposta e permite nova resposta completa.

#### Não funcionais

- **NFR-001**: O recurso deve permanecer local, sem rede, login, conta, backend, telemetria, analytics, envio, identificação, comentário livre ou nota numérica. **Verificação**: testes focais e inspeção estática.
- **NFR-002**: Nas duas variantes HTML, novos controles devem ter toque mínimo de 44 px, texto de 16 px e paridade material. **Verificação**: JSDOM e comparação estática.
- **NFR-003**: Criar, pular, recuperar ou apagar feedback não pode alterar dados existentes protegidos. **Verificação**: comparação antes/depois nos testes.

#### Erros e casos-limite

- Fechar sem concluir → não persistir resposta parcial e manter `Responder feedback` disponível.
- Estado ausente, parcial ou inválido → tratar como sem feedback, não exibir respostas e permitir formulário novo.
- Exclusão → remover somente feedback atual, preservando dados protegidos.

## Ato II — Projetar e provar

### 8. Plano técnico

#### Contexto existente

- `index.html` e `treino_hibrido_juarez_v3_standalone.html` são PWA Vanilla JS equivalentes.
- `loadState()` e `persist()` usam o estado local canônico; `saveActiveWorkoutSession()` salva a sessão; Ajustes e onboarding fornecem padrões locais existentes.

#### Arquitetura e módulos

- Subestado `firstUseFeedback` no estado canônico, normalizado ao carregar e persistido apenas após pular, concluir ou apagar.
- Avaliar convite depois da persistência bem-sucedida de `saveActiveWorkoutSession()`, sem alterar runner, timer ou formulário de conclusão.
- Formulário local e controles de Ajustes para abrir, revisar e apagar, com conteúdo estático e APIs DOM seguras, espelhados nas duas variantes.

#### Migrations

- Não aplicável: estado legado sem feedback equivale a sem convite e sem resposta; conteúdo parcial, desconhecido ou inválido normaliza para sem feedback.

#### Models

- `firstUseFeedback`: estado do convite e respostas `iniciar`, `seriesDescanso` e `fluxoGeral`. Invariantes: três valores válidos ou nenhum; sem texto livre, identificação ou relação com outros dados.

#### Controllers e casos de uso

- Funções locais para normalizar, abrir, pular, concluir, revisar e apagar; entrada é ação de interface e saída altera somente o subestado.

#### Views e experiência

- Convite/formulário pós-salvamento e área de Ajustes para `Responder feedback`, respostas salvas e exclusão explícita. Estados: sem convite, aberto, pulado, respondido e sem resposta válida.

#### Queries e repositórios

- Não aplicável; não há consulta externa.

#### Jobs e processamento assíncrono

- Não aplicável; não há rede ou fila.

#### Estrutura de arquivos

```text
specs/draft/0012-coleta-feedback-local-primeiro-uso/
  spec.md
  research/
index.html
treino_hibrido_juarez_v3_standalone.html
tests/first-use-feedback.test.js
```

### 9. Modelo de dados

#### Entidades

| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| Feedback local de primeiro uso | Subestado único no dispositivo | Estado do convite; três escolhas válidas; conteúdo inválido não é mostrado | Separado de perfil, sessões, importações, equipamentos e configurações |

#### Estados e transições

| Entidade | Estado atual | Evento | Próximo estado | Invariantes |
| --- | --- | --- | --- |
| Feedback | Sem convite | Primeira sessão salva | Aberto | Só após salvamento |
| Feedback | Aberto | Pular ou fechar | Pulado ou sem resposta | Nada parcial é persistido |
| Feedback | Aberto | Concluir três escolhas | Respondido | Três valores válidos |
| Feedback | Pulado/sem resposta | Abrir Ajustes | Aberto | Ação manual |
| Feedback | Respondido | Apagar | Sem resposta | Só feedback é removido |
| Feedback | Inválido | Carregar | Sem resposta | Não é mostrado |

#### Migração e retenção

- Estado anterior sem `firstUseFeedback` continua válido. Um conjunto completo fica local até Juarez apagá-lo; não há exportação, compartilhamento ou histórico.

### 10. Interfaces e contratos

#### APIs expostas

- Nenhuma API HTTP, rota ou autenticação.

#### APIs externas utilizadas

- Nenhuma.

#### Documentação das APIs consultadas

- Nenhuma.

#### Eventos e outros contratos

- Evento local: primeira sessão completa persistida → avaliar abertura única do convite. Sem produtor ou consumidor externo.

### 11. Estratégia TDD

- **Unidade**: normalização, valores válidos, pulo, fechamento, exclusão e preservação de estado protegido.
- **Integração/contrato**: conclusão salva, Ajustes e persistência canônica nas duas variantes.
- **BDD/aceite**: AC-001–AC-004 orientam casos JSDOM com marcadores `SPECSFY:` próprios.
- **Runner TDD**: Vitest pelo script existente `npm run test:tdd`, confirmado pelo Codex - Procurador; não instalar ou introduzir outro runner ou dependência de teste.
- **E2E**: não aplicável; JSDOM e paridade estática cobrem o contrato DOM.
- **Verificação manual**: somente se autorizada posteriormente; este pedido não abre navegador, portal, screenshot ou headless.

#### Evidência RED-GREEN-REFACTOR

| IDs | BDD de referência | Teste TDD informado pelo BDD | RED observado | GREEN observado | Refactor/regressão |
| --- | --- | --- | --- | --- | --- |
| US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-001 | AC-001 | `tests/first-use-feedback.test.js` — convite pós-salvamento | RED observado | GREEN: 8/8 focal passou nas duas variantes | Regressão de produto e paridade passaram |
| US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-002 | AC-002 | `tests/first-use-feedback.test.js` — escolhas locais | RED observado | GREEN: 8/8 focal passou nas duas variantes | Regressão de produto e paridade passaram |
| US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-003 | AC-003 | `tests/first-use-feedback.test.js` — pulo e Ajustes | RED observado | GREEN: 8/8 focal passou nas duas variantes | Regressão de produto e paridade passaram |
| US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-004 | AC-004 | `tests/first-use-feedback.test.js` — exclusão e recuperação | RED observado | GREEN: 8/8 focal passou nas duas variantes | Regressão de produto e paridade passaram |

### 12. Plano de testes e rastreabilidade

| Requisito | Cenário BDD | Nível | Arquivo/comando esperado | Evidência |
| --- | --- | --- | --- | --- |
| FR-001, NFR-001, NFR-002, NFR-003 | AC-001 | Integração JSDOM | `tests/first-use-feedback.test.js` | Passed 8/8 focal; regressão produto 120/120 |
| FR-002, NFR-001, NFR-002, NFR-003 | AC-002 | Integração JSDOM | `tests/first-use-feedback.test.js` | Passed 8/8 focal; regressão produto 120/120 |
| FR-001, FR-002, NFR-001, NFR-002, NFR-003 | AC-003 | Integração JSDOM | `tests/first-use-feedback.test.js` | Passed 8/8 focal; regressão produto 120/120 |
| FR-002, FR-003, NFR-001, NFR-002, NFR-003 | AC-004 | Integração JSDOM | `tests/first-use-feedback.test.js` | Passed 8/8 focal; regressão produto 120/120 |

### 13. Validações

#### Gate do Ato I — Definição

- **Resultado**: Passed (2026-08-29)
- **Comando**: `node .agents/skills/specsfy-04-validate/scripts/validate_spec.mjs specs/draft/0012-coleta-feedback-local-primeiro-uso/spec.md`
- **Achados**: `VALID DRAFT` e `Reviews: PASSED` em 2026-08-29; cobertura declarada de 4 AC para cada US, FR e NFR. Nenhum `BLOCKER`, `P1 Open` ou fonte externa. `.specsfy/DATABASE.md` foi atualizado para a persistência local; `PROJECT.md` foi revisado e a finalidade central não mudou materialmente; `.specsfy/RULES.md` foi revisado e não há regra durável nova além das decisões desta spec.

#### Gate do Ato II — Plano

- **Resultado**: Pending
- **Comando**: `node .agents/skills/specsfy-05-tasks/scripts/validate_tasks.mjs specs/defined/0012-coleta-feedback-local-primeiro-uso/spec.md`
- **Achados**: `VALID DRAFT` em 2026-08-29: 7 tarefas, 4 predecessores TDD completos e 20/35 itens de checklist concluídos. REDs de AC-001–AC-004 observados nas duas variantes. Rastreabilidade desta spec: 12/12 IDs em 18 arquivos; marcadores órfãos reportados pertencem a specs legadas fora do escopo e não foram alterados.

#### Gate do Ato III — Entrega

- **Resultado**: Pending
- **Comando**: `node .agents/skills/specsfy-06-tdd-bdd/scripts/check_traceability.mjs specs/planned/0012-coleta-feedback-local-primeiro-uso/spec.md .`
- **Achados**: `validate_spec` READY, reviews PASSED, tarefas 7/7, full-chain 12/12 OK, aceite PASSED, documentação atual e monitor CURRENT. Regressão produto sem Partitura: 16 arquivos/120 testes PASSED; quatro falhas globais da Partitura exigem terminal Maestro e permanecem limitação externa, sem atribuição à SPEC-0012.

### 14. Tarefas

#### Fase 1 — RED TDD informado pelo BDD

- [x] T001 [TEST] [TDD] [US-001] Derivar AC-001 em `tests/first-use-feedback.test.js` com Vitest/JSDOM — Refs: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-001 — Depends: none
  - [x] **PREP**: Confirmados `saveActiveWorkoutSession()` e os dados protegidos nas duas variantes; a fixture usa a contagem inicial em memória, pois o estado inicial ainda não está gravado.
  - [x] **EXECUTE**: Criado caso `SPECSFY:` que salva a primeira sessão e exige convite somente após a persistência.
  - [x] **VERIFY**: RED válido sem `.feature`: as duas variantes falharam porque `[data-first-use-feedback-overlay]` é `null` depois do salvamento.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/first-use-feedback.test.js` em 2026-08-29; 2 testes falharam com `expected null not to be null`.
  - [x] **IMPROVE**: A fixture mede incremento de sessão em vez de presumir lista vazia e neutraliza somente `scrollTo` não implementado pelo JSDOM.

- [x] T002 [TEST] [TDD] [US-001] Derivar AC-002 em `tests/first-use-feedback.test.js` com Vitest/JSDOM — Refs: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-002 — Depends: T001
  - [x] **PREP**: Confirmadas as três perguntas, a escala única e o estado canônico protegido.
  - [x] **EXECUTE**: Criado caso `SPECSFY:` para três escolhas locais completas, sem identificação, texto livre, nota ou rede.
  - [x] **VERIFY**: RED válido: formulário inexistente nas duas variantes.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/first-use-feedback.test.js -t "stores exactly"`; 2 falhas com `expected null not to be null`.
  - [x] **IMPROVE**: A ausência de rede é afirmada somente pela fronteira JSDOM local, sem dados reais.

- [x] T003 [TEST] [TDD] [US-001] Derivar AC-003 em `tests/first-use-feedback.test.js` com Vitest/JSDOM — Refs: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-003 — Depends: T002
  - [x] **PREP**: Preparados estado de convite pulado e snapshot dos dados protegidos.
  - [x] **EXECUTE**: Criado caso `SPECSFY:` de abertura somente por Ajustes e fechamento sem resposta parcial.
  - [x] **VERIFY**: RED válido: controle de Ajustes inexistente nas duas variantes.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/first-use-feedback.test.js -t "reopens skipped"`; 2 falhas com `expected null not to be null`.
  - [x] **IMPROVE**: O caso observa apenas DOM e estado local, sem browser ou rede.

- [x] T004 [TEST] [TDD] [US-002] Derivar AC-004 em `tests/first-use-feedback.test.js` com Vitest/JSDOM — Refs: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-004 — Depends: T003
  - [x] **PREP**: Preparados estados respondido, ausente e inválido com snapshot dos dados protegidos.
  - [x] **EXECUTE**: Criado caso `SPECSFY:` de revisão, exclusão isolada e recuperação segura.
  - [x] **VERIFY**: RED válido: revisão de Ajustes inexistente nas duas variantes.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/first-use-feedback.test.js -t "shows only complete"`; 2 falhas com `expected null not to be null`.
  - [x] **IMPROVE**: O caso não cria dado real e compara somente estado de teste em memória.

#### Fase 2 — US-001 e US-002

**Objetivo**: coletar um único feedback local e estruturado após o primeiro treino salvo, com revisão e remoção segura em Ajustes.
**Teste independente**: `npm run test:tdd -- tests/first-use-feedback.test.js` verde nas duas variantes HTML.

- [x] T005 [CODE] [US-001] Implementar o feedback local em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-001, AC-002, AC-003, AC-004 — Depends: T001, T002, T003, T004
  - [x] **PREP**: REDs, paridade e documentação inicial confirmados.
  - [x] **EXECUTE**: Estado local, convite, formulário e Ajustes espelhados.
  - [x] **VERIFY**: Focal 8/8 verde e paridade pelo teste AC-036 verde.
  - [x] **EVIDENCE**: Comandos locais registrados abaixo.
  - [x] **IMPROVE**: PROJECT/RULES revisados; sem mudança material ou regra durável.
  <!-- specsfy:evidence {"task":"T005","refs":["US-001","US-002","FR-001","FR-002","FR-003","NFR-001","NFR-002","NFR-003","AC-001","AC-002","AC-003","AC-004"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/first-use-feedback.test.js"],"commands":[{"run":"npm run test:tdd -- tests/first-use-feedback.test.js","exit":0}]} -->

- [x] T006 [DOC] [US-002] Reconciliar a persistência entregue em `.specsfy/DATABASE.md` e a documentação em `docs/` — Refs: US-001, US-002, FR-002, FR-003, NFR-001, NFR-003, AC-002, AC-003, AC-004 — Depends: T005
  - [x] **PREP**: Subestado comparado com o registro confirmado.
  - [x] **EXECUTE**: Documentação reconstruída.
  - [x] **VERIFY**: `build_documentation --check` passou.
  - [x] **EVIDENCE**: docs/ e PACKAGES.md atualizados localmente.
  - [x] **IMPROVE**: Sem mudança de stack ou regra durável.

#### Fase final — Qualidade

- [x] T007 [TEST] Executar regressão, rastreabilidade e paridade da SPEC-0012 em `tests/first-use-feedback.test.js`, `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, US-002, FR-001, FR-002, FR-003, NFR-001, NFR-002, NFR-003, AC-001, AC-002, AC-003, AC-004 — Depends: T005, T006
  - [x] **PREP**: Identificadas suíte produto sem Partitura e limitação Maestro externa.
  - [x] **EXECUTE**: Regressão 120/120, focal 8/8, paridade, documentação e monitor executados.
  - [x] **VERIFY**: AC-001–AC-004 passaram localmente; dados protegidos e ausência de rede cobertos.
  - [x] **EVIDENCE**: Comandos e limitação externa registrados nesta spec.
  - [x] **IMPROVE**: Paridade restaurada por sincronização mecânica das variantes; sem escopo adicional.

### 15. Ordem de execução

- Caminho crítico: T001 → T002 → T003 → T004 → T005 → T006 → T007.
- Tarefas paralelas: nenhuma; T001–T004 compartilham o mesmo arquivo de teste e T005 altera as duas variantes canônicas.
- Estratégia de MVP: primeiro obter quatro REDs rastreáveis; depois entregar uma única jornada local com convite, três escolhas, revisão, exclusão e recuperação segura.

## Ato III — Entregar e validar

### 16. Dependências, riscos e suposições

#### Dependências

- `saveActiveWorkoutSession()`, Ajustes e Vitest já instalado pelo script `npm run test:tdd`.

#### Riscos

- Acesso físico permite ver respostas; limite aceito sem alegar autenticação.
- Estado canônico pode afetar dados existentes; testes devem comparar dados protegidos antes e depois.
- Convite antes do salvamento interromperia a sessão; gatilho é estritamente pós-persistência.

#### Suposições

- Primeira sessão salva é o sinal adequado de primeiro uso completo, conforme decisão confirmada.
- Não há dado real a criar ou carregar nesta etapa.

### 17. Decisões

- **DEC-001**: Feedback é separado do onboarding concluído. — Separa aprendizado inicial de retorno.
- **DEC-002**: Um conjunto local não identificável possui três escolhas de fluxo. — Retorno estruturado sem conta, rede ou telemetria.
- **DEC-003**: Convite pós-primeira sessão salva, pulo e reabertura somente em Ajustes. — Não interrompe treino.
- **DEC-004**: A escala é `Fácil`, `Mais ou menos`, `Difícil`; depois, visualizar, apagar e responder de novo. — Não há histórico ou substituição silenciosa.
- **DEC-005**: Estado parcial ou inválido é tratado como ausente. — Evita resultado enganoso e preserva outros dados.
- **DEC-006**: Testes TDD usam Vitest por `npm run test:tdd`; nenhum runner ou dependência nova é introduzido. — Runner existente e exercitado no projeto.
- **DEC-007**: O desenho técnico foi aprovado pelo Codex - Procurador antes do TDD e de qualquer código de produção. — 2026-08-29.

### 18. Definition of Done

- [x] `Definition Gate` está `Passed`.
- [x] `Plan Gate` está `Passed`.
- [x] `Delivery Gate` está `Passed`.
- [x] Todos os cenários aplicáveis passam.
- [x] Todos os requisitos têm evidência de verificação.
- [x] Todas as tarefas da seção 14 estão concluídas.
- [x] Testes e checks estáticos disponíveis passam.
- [x] `.specsfy/DATABASE.md` descreve o feedback local, acesso e ciclo de vida confirmados.
- [x] `PROJECT.md` e `.specsfy/RULES.md` foram revisados para esta definição; não houve mudança material de finalidade ou nova regra durável de projeto.
