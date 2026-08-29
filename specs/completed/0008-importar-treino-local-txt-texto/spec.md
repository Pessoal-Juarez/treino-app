# Especificação integrada: Importar treino local por TXT ou texto colado

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0008 |
| Slug | 0008-importar-treino-local-txt-texto |
| Status | Complete |
| Effort | 6 |
| Effort updated at | 2026-08-29 |
| Effort rationale | Fluxo local novo, parsing, prévia, persistência isolada e paridade HTML. |
| Definition Gate | Passed |
| Plan Gate | Passed |
| Delivery Gate | Passed |
| Evidence Contract | 1 |
| Atualizada em | 2026-08-29 |

## Ato I — Definir
### 1. Problema e resultado
#### Problema
Não há local para trazer, revisar e adicionar novo treino sem risco aos dados atuais.
#### Resultado desejado
Juarez cola texto ou seleciona TXT, vê prévia e confirma explicitamente a adição; nada é escrito antes disso.
#### Métricas de sucesso
- Prévia/cancelar não gravam; confirmar grava somente os dias válidos uma vez.

### 2. Research e esclarecimentos
#### Researchs executados
- **R-001**: `WORKOUTS` é plano em memória; perfil/sessões e equipamento usam LocalStorage separado. Impacto: importação tem chave própria.
- **R-002**: Ajustes já reúne exportação, modais, tokens T036 e controles 44 px nos dois HTMLs equivalentes.
#### Fontes e contexto consultados
- `index.html`, `treino_hibrido_juarez_v3_standalone.html`, `.specsfy/DATABASE.md`, Inbox e Backlog-0008.
#### Documentação consultada
- Nenhuma fonte externa.
#### Artefatos de pesquisa armazenados
- `research/2026-08-29-visual-ios-390x844.md` — validação local do fluxo em iOS 390×844.
#### Dúvidas respondidas
- **Q**: formato e aplicação? → **A**: Codex - Procurador, Pergunta 1, 2026-08-29: adicionar TXT/texto colado; PDF é fatia posterior com parser local validado.
#### Dúvidas abertas
- Nenhuma aplicável.

### 3. Escopo e atores
#### Incluído
- Entrada em Ajustes para TXT/texto, parsing, prévia, cancelar, confirmar, persistência isolada e união ao plano para exibir/iniciar.
#### Fora de escopo
- PDF, rede/API paga/upload, substituição/edição/remoção de importados e mudança de histórico/perfil/equipamento.
#### Atores
- **Juarez**: importa e confirma somente no próprio dispositivo.

### 4. Princípios e restrições do projeto
- **PR-001**: processamento/retenção locais, sem rede.
- **PR-002**: tokens T036, fonte 16 px, alvos 44 px e DOM seguro.
- **PR-003**: dados existentes e paridade dos HTMLs preservados.

### 5. Histórias de usuário
#### US-001 — Adicionar treino revisado (P1)
Como Juarez, quero importar TXT ou texto colado e revisar a prévia antes de confirmar, para acrescentar treino sem perder dados.
**Teste independente**: confirmar um dia válido e encontrá-lo após recarregar. **Requisitos**: FR-001, FR-002, FR-003.

### 6. Cenários BDD de aceite
#### AC-001 — Prévia local
**Cobre**: US-001, FR-001, FR-002, FR-003, NFR-001
```gherkin
Scenario: pré-visualizar texto válido
  Given um plano existente e texto válido
  When Juarez solicita prévia
  Then vê dias e exercícios sem gravação
```
#### AC-002 — Confirmação aditiva
**Cobre**: US-001, FR-001, FR-002, FR-003, NFR-001
```gherkin
Scenario: confirmar adição
  Given prévia válida e dados existentes
  When Juarez confirma
  Then novos dias persistem uma vez e dados existentes não mudam
```
#### AC-003 — Cancelar ou rejeitar
**Cobre**: US-001, FR-001, FR-002, FR-003, NFR-001
```gherkin
Scenario: cancelar ou rejeitar texto inválido
  Given texto inválido ou prévia aberta
  When Juarez solicita prévia ou cancela
  Then recebe erro claro ou retorna sem gravação
```

### 7. Requisitos
#### Funcionais
- **FR-001**: aceitar texto colado e `.txt` local, interpretar dias/exercícios e mostrar prévia antes de escrita.
- **FR-002**: confirmar adiciona treinos válidos em chave isolada, restaura após recarga e os exibe junto ao plano atual.
- **FR-003**: cancelar, inválido, JSON inválido ou duplicata não mudam dados; conteúdo é texto, nunca HTML.
#### Não funcionais
- **NFR-001**: tokens T036, entradas 16 px, alvos 44 px e zero rede. **Verificação**: Vitest, DOM, paridade e portal iOS 390x844.
#### Erros e casos-limite
- Extensão não TXT, vazio, inválido ou duplicata → erro local e zero persistência.

## Ato II — Projetar e provar
### 8. Plano técnico
- Dois HTMLs: cartão em Ajustes, modal DOM, parser de linhas, normalização, chave `treino_hibrido_juarez_v5_imported_workouts` e união segura com `WORKOUTS`.
- Não há API, job, banco remoto ou migração; JSON inválido retorna coleção vazia.
### 9. Modelo de dados
| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| Treino importado | chave local única | label, foco, duração, exercícios normalizados; só existe após confirmar | separado de histórico, perfil e equipamento |
#### Estados e transições
| Estado | Evento | Próximo | Invariante |
| --- | --- | --- | --- |
| entrada | prévia válida | revisável | sem escrita |
| revisável | confirmar | persistido | aditivo, uma escrita |
### 10. Interfaces e contratos
- Nenhuma API externa; formato textual documentado no modal; PDF não é aceito nesta fatia.
### 11. Estratégia TDD
- Vitest/JSDOM em `tests/workout-import.test.js`, nos dois HTMLs: AC-001 prévia, AC-002 persistência/isolamento, AC-003 cancelar/erro/segurança.
| IDs | RED | GREEN | Regressão |
| --- | --- | --- | --- |
| AC-001 | `npm run test:tdd -- tests/workout-import.test.js` exit 1: UI/funções ausentes nos dois HTMLs | mesmo comando, 18/18 exit 0 em 2026-08-29 | suíte local sem Partitura pendente |
| AC-002 | mesmo RED inicial; persistência e união ainda inexistentes | 18/18: confirmação aditiva, duplicata e restauração em nova JSDOM | suíte local sem Partitura pendente |
| AC-003 | RED inicial; em ciclo posterior 16/18 com dois casos de markup criando `<img>` no plano | 18/18: PDF rejeitado, cancelar/erro sem gravação e markup via `textContent` | suíte local sem Partitura pendente |
### 12. Plano de testes e rastreabilidade
| Requisito | Cenário | Nível | Arquivo | Evidência |
| --- | --- | --- | --- | --- |
| FR-001, NFR-001 | AC-001 | Integração JSDOM | `tests/workout-import.test.js` | Passed — matriz nos dois HTMLs: 18/18 exit 0 em 2026-08-29; cobre FileReader local/TXT, prévia sem escrita, fonte 16 px e alvos 44 px. |
| FR-001, FR-002, FR-003 | AC-002 | Integração JSDOM | `tests/workout-import.test.js` | Passed — confirmação aditiva, isolamento das chaves existentes, deduplicação e restauração após nova JSDOM, todos verdes nos dois HTMLs. |
| FR-001, FR-003, NFR-001 | AC-003 | Integração JSDOM | `tests/workout-import.test.js` | Passed — PDF e texto inválido rejeitados sem gravação; markup importado não cria `img`, `svg` ou `script`. |
### 13. Validações
- Definition Passed em 2026-08-29: validação estrutural `VALID DRAFT`; revisão semântica independente `Reviews: PASSED`; US-001, FR-001–FR-003 e NFR-001 possuem AC-001–AC-003 distintos. Comando: `node .agents/skills/specsfy-04-validate/scripts/validate_spec.mjs specs/draft/0008-importar-treino-local-txt-texto/spec.md --allow-draft` (exit 0).
- Plan Passed em 2026-08-29: `validate_tasks.mjs` confirmou predecessores TDD e tarefas READY antes da promoção canônica.
- Delivery Passed em 2026-08-29: focal GREEN 18/18, regressão local 12 arquivos/87 testes exit 0 (Partitura dependente de Maestro excluída), paridade byte a byte, `git diff --check`, rastreabilidade 8/8, QA Passed, evidence strict Passed, reviews Passed, monitor CURRENT, documentação `build_documentation.mjs --check` exit 0 e portal iOS 390×844 em `research/2026-08-29-visual-ios-390x844.md`.
### 14. Tarefas
- [x] T001 [TEST] [TDD] [US-001] RED de prévia em `tests/workout-import.test.js` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-001 — Depends: none
  - [x] **PREP**: Confirmar BDD.
  - [x] **EXECUTE**: Escrever teste.
  - [x] **VERIFY**: RED 6 falhas: UI/funções ausentes nos dois HTMLs.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/workout-import.test.js` exit 1.
  - [x] **IMPROVE**: Casos exercem DOM real.
- [x] T002 [TEST] [TDD] [US-001] RED de confirmação em `tests/workout-import.test.js` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-002 — Depends: none
  - [x] **PREP**: Confirmar isolamento.
  - [x] **EXECUTE**: Escrever teste.
  - [x] **VERIFY**: RED por `openWorkoutImport` ausente.
  - [x] **EVIDENCE**: focal exit 1.
  - [x] **IMPROVE**: Confirmação é aditiva.
- [x] T003 [TEST] [TDD] [US-001] RED de cancelar/erro em `tests/workout-import.test.js` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-003 — Depends: none
  - [x] **PREP**: Confirmar segurança.
  - [x] **EXECUTE**: Escrever teste.
  - [x] **VERIFY**: RED por função ausente.
  - [x] **EVIDENCE**: focal exit 1.
  - [x] **IMPROVE**: Entrada hostil permanece texto.
- [x] T004 [CODE] [US-001] Implementar em `index.html`, `treino_hibrido_juarez_v3_standalone.html` e `tests/workout-import.test.js` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-001, AC-002, AC-003 — Depends: T001, T002, T003
  - [x] **PREP**: Confirmados RED inicial de interface/funções ausentes e RED posterior de markup no plano (16/18, dois casos falhos).
  - [x] **EXECUTE**: Modal DOM em Ajustes, FileReader local TXT, prévia, confirmação aditiva, chave isolada, `getAvailableWorkouts()` e plano seguro implementados nos dois HTMLs.
  - [x] **VERIFY**: Focal 18/18 GREEN e `git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html` exit 0.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/workout-import.test.js --reporter=verbose --testTimeout=5000` exit 0; documentação local `--check` exit 0.
  - [x] **IMPROVE**: `renderFullPlan()` foi refatorado para criar cada cartão pelo DOM e `textContent`; RULES revisado, sem regra durável nova.
<!-- specsfy:evidence {"task":"T004","refs":["US-001","FR-001","FR-002","FR-003","NFR-001","AC-001","AC-002","AC-003"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/workout-import.test.js"],"commands":[{"run":"npm run test:tdd -- tests/workout-import.test.js --reporter=verbose --testTimeout=5000","exit":0},{"run":"git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0}]} -->
- [x] T005 [TEST] Regressão e gates em `tests/workout-import.test.js` e `spec.md` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-001, AC-002, AC-003 — Depends: T004
  - [x] **PREP**: Identificados focal, regressão sem Partitura, paridade, diff, aceite, rastreabilidade, evidência estrita, revisão, documentação, monitor e portal iOS.
  - [x] **EXECUTE**: Executados os checks finais e a prova visual em `research/2026-08-29-visual-ios-390x844.md`.
  - [x] **VERIFY**: Focal 18/18 e regressão 12 arquivos/87 testes, todos exit 0; paridade e `git diff --check` passaram.
  - [x] **EVIDENCE**: `check_traceability` 8/8, QA Passed, evidence strict Passed, reviews Passed e documentação `--check` exit 0.
  - [x] **IMPROVE**: Substituída espera fixa de 10 ms do FileReader por espera condicional; sem outra melhoria necessária.
<!-- specsfy:evidence {"task":"T005","refs":["US-001","FR-001","FR-002","FR-003","NFR-001","AC-001","AC-002","AC-003"],"files":["tests/workout-import.test.js","specs/in-progress/0008-importar-treino-local-txt-texto/spec.md","specs/in-progress/0008-importar-treino-local-txt-texto/research/2026-08-29-visual-ios-390x844.md"],"commands":[{"run":"npm run test:tdd -- tests --exclude tests/partitura/** --reporter=dot --testTimeout=5000","exit":0},{"run":"node .agents/skills/specsfy-06-tdd-bdd/scripts/check_traceability.mjs specs/in-progress/0008-importar-treino-local-txt-texto/spec.md tests --full-chain --allow-orphans","exit":0},{"run":"node .agents/skills/specsfy-06-tdd-bdd/scripts/verify_acceptance.mjs specs/in-progress/0008-importar-treino-local-txt-texto/spec.md .","exit":0},{"run":"node .agents/skills/specsfy-07-implement/scripts/verify_evidence.mjs specs/in-progress/0008-importar-treino-local-txt-texto/spec.md . --task T004","exit":0}]} -->
### 15. Ordem de execução
- T001/T002/T003 → T004 → T005; MVP: texto colado e TXT, PDF separado.

## Ato III — Entregar e validar
### 16. Dependências, riscos e suposições
- FileReader/LocalStorage; texto hostil/ambíguo, colisão e JSON inválido são rejeitados sem escrita; formato textual será documentado no modal.
### 17. Decisões
- **DEC-001**: adicionar, não substituir — Codex - Procurador, Pergunta 1, 2026-08-29.
- **DEC-002**: TXT/texto agora; PDF após parser local validado.
### 18. Definition of Done
- [x] Gates Passed, ACs/tarefas/rastreabilidade/evidências completos, testes disponíveis verdes.
