# Especificação integrada: Descanso da última série ao avançar

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0005 |
| Slug | 0005-descanso-ultima-serie-ao-avancar |
| Status | Complete |
| Effort | 1 |
| Effort updated at | 2026-08-28 |
| Effort rationale | Estimativa inicial; revisar durante a descoberta. |
| ClickUp Task | |
| Milestones | |
| Definition Gate | Passed |
| Plan Gate | Passed |
| Delivery Gate | Passed |
| Evidence Contract | 1 |
| Atualizada em | 2026-08-28 |

## Ato I — Definir

### 1. Problema e resultado

#### Problema

Ao avançar após concluir a última série, o descanso já iniciado é perdido quando o próximo exercício é renderizado.

#### Resultado desejado

O mesmo descanso em curso permanece visível e operável no cartão do próximo exercício, sem reinício ou duplicação.

#### Métricas de sucesso

- Em sessão ativa, preservar 100% do restante e do estado do descanso elegível durante avanços até sua conclusão.

### 2. Research e esclarecimentos

#### Researchs executados

- **R-001** [critical] O estado de descanso de sessão deve ser preservado sem reinício entre exercícios — Verdict: verified — Confidence: high — Evidence: research/20260828-spec0005-mobile-ios-390x844-rest-carryover.png — Budget: 1/1
- Para claim material, use: `**R-001** [critical] claim — Verdict: verified|refuted|unverifiable — Confidence: high|medium|low — Evidence: research/caminho#locator — Budget: usado/limite`. IDs são únicos, `usado ≤ limite` e a âncora deve existir.

#### Fontes e contexto consultados

- Código dos dois HTMLs, backlog e decisões do Procurador.

#### Documentação consultada

- Vanilla JS/PWA local, contexto do repositório em 2026-08-28.

#### Artefatos de pesquisa armazenados

- `specs/completed/0005-descanso-ultima-serie-ao-avancar/research/20260828-spec0005-mobile-ios-390x844-rest-carryover.png` — captura móvel canônica auditada (390×844).
- Toda fonte externa efetivamente consultada deve ter uma evidência local em `research/`; registre aqui o caminho e mantenha conclusões normativas no `spec.md`.

#### Dúvidas respondidas

- **Q**: Descanso pausado antes do avanço é elegível? → **A**: Sim; transportar estado pausado, restante, duração de origem e controles. Retomar continua o restante original.

#### Dúvidas abertas

- Nenhuma lacuna de comportamento confirmada; detalhes técnicos serão definidos no planejamento.

### 3. Escopo e atores

#### Incluído

- Transportar descanso ativo entre telas de exercícios, mantendo contador, estado e controles até concluir/encerrar.

#### Fora de escopo

- Não persistir após recarga/reabertura; não criar descanso ao avançar sem descanso elegível; não alterar alertas existentes.

#### Atores

- **Usuário do treino**: avança entre exercícios e controla o descanso transportado.

### 4. Princípios e restrições do projeto

- **PR-001**: Preservar paridade entre index.html e treino_hibrido_juarez_v3_standalone.html..

### 5. Histórias de usuário

#### US-001 — Transportar descanso em curso (P1)

Como usuário do treino, quero avançar para o próximo exercício sem perder um descanso já em curso, para procurar o próximo aparelho enquanto o tempo continua contando.

**Por que P1**: evita perda de tempo e preserva a continuidade do treino.
**Teste independente**: concluir uma série, avançar e observar o mesmo contador e controles no próximo exercício.
**Requisitos**: FR-001

### 6. Cenários BDD de aceite

#### AC-001 — Transportar descanso ativo

**Cobre**: US-001, FR-001, NFR-001

```gherkin
@US-001 @FR-001 @NFR-001 @AC-001
Feature: Transporte do descanso em curso

  Scenario: transporte para próximo exercício
    Given um descanso ativo iniciado pela última série e outro exercício disponível
    When o usuário avança
    Then o cartão do próximo exercício exibe o mesmo contador, estado e controles sem reiniciar
```

#### AC-002 — Transportar múltiplas navegações

**Cobre**: US-001, FR-001, NFR-001

```gherkin
@US-001 @FR-001 @NFR-001 @AC-002
Feature: Transporte contínuo

  Scenario: transporte contínuo
    Given o descanso transportado ainda está ativo
    When o usuário avança novamente
    Then o mesmo descanso acompanha a nova tela sem duplicação
```

#### AC-003 — Não criar descanso sem elegibilidade

**Cobre**: US-001, FR-001, NFR-001

```gherkin
@US-001 @FR-001 @NFR-001 @AC-003
Feature: Limite de sessão

  Scenario: ausência de descanso elegível
    Given não existe descanso elegível em curso ou o usuário recarregou a página
    When o usuário avança
    Then nenhum descanso novo é criado nem restaurado pelo transporte
```

### 7. Requisitos

#### Funcionais

- **FR-001**: Ao avançar com outro exercício disponível, transportar o descanso ativo da última série preservando fim, total, restante, duração de origem, estado e controles.

#### Não funcionais

- **NFR-001**: Não reiniciar, duplicar ou persistir o descanso transportado; manter alertas existentes e comportamento atual de Concluir Treino. **Verificação**: testes de transição, múltiplos avanços e recarga.

#### Erros e casos-limite

- Sem outro exercício, ou em Concluir Treino → preservar o modal atual e não criar, reiniciar, transportar nem apresentar descanso novo.

## Ato II — Projetar e provar

### 8. Plano técnico

#### Contexto existente

- Vanilla JS/PWA offline; lógica compartilhada nos dois HTMLs.

#### Arquitetura e módulos

- Reutilizar o estado em memória do timer e o cartão de descanso existente nos dois HTMLs.

#### Migrations

- Não aplicável: sem persistência nova ou migration.

#### Models

- Estado transitório do timer; invariantes de restante e duração de origem; dois HTMLs em paridade.

#### Controllers e casos de uso

- Handlers de avanço e controles existentes; entrada é ação do usuário; saída é o mesmo cartão de descanso.

#### Views e experiência

- Cartão de descanso integrado na tela do próximo exercício; controles atuais preservados.

#### Queries e repositórios

- Não aplicável.

#### Jobs e processamento assíncrono

- Não aplicável.

#### Estrutura de arquivos

```text
specs/completed/0005-descanso-ultima-serie-ao-avancar/
  spec.md
  research/
src/
tests/
```

### 9. Modelo de dados

#### Entidades

| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| Estado de sessão | memória | instante final, total, restante, duração, pausado | 1 |

#### Estados e transições

| Entidade | Estado atual | Evento | Próximo estado | Invariantes |
| --- | --- | --- | --- | --- |
| Timer | ativo/pausado | avanço | ativo/pausado | preservar estado |

#### Migração e retenção

- Não aplicável.

### 10. Interfaces e contratos

#### APIs expostas

- Evento local de avanço; sem API externa ou autenticação.

#### APIs externas utilizadas

- Nenhuma API externa.

#### Documentação das APIs consultadas

- Código e backlog local consultados em 2026-08-28.

#### Eventos e outros contratos

- Não aplicável.

### 11. Estratégia TDD

- **Unidade**: Regras de transporte e controles do descanso.
- **Integração/contrato**: Fronteiras entre telas do exercício na mesma sessão.
- **BDD/aceite**: Cenários AC-001 a AC-003 desta spec.
- **Runner TDD**: Node: Vitest via npm run test:tdd; PHP não aplicável.
- **E2E**: Jornada de avanço com descanso ativo.
- **Verificação manual**: Inspeção manual móvel apenas para confirmar o cartão integrado.

#### Evidência RED-GREEN-REFACTOR

| IDs | BDD de referência | Teste TDD informado pelo BDD | RED observado | GREEN observado | Refactor/regressão |
| --- | --- | --- | --- | --- | --- |
| US-001, FR-001, NFR-001, AC-001 | AC-001 | caso transporte ativo em tests/rest-timer-navigation.test.js | RED: esperado 01:18, recebido 01:30 | — | RED registrado |
| US-001, FR-001, NFR-001, AC-002 | AC-002 | caso múltiplos avanços em tests/rest-timer-navigation.test.js | RED: esperado 01:30, recebido 01:15 | — | RED registrado |
| US-001, FR-001, NFR-001, AC-003 | AC-003 | caso limites em tests/rest-timer-navigation.test.js | — | Caracterização Passed | Limites atuais confirmados |

### 12. Plano de testes e rastreabilidade

| Requisito | Cenário BDD | Nível | Arquivo/comando esperado | Evidência |
| --- | --- | --- | --- | --- |
| FR-001 | AC-001 | Unidade | tests/rest-timer-navigation.test.js | RED exit 1; GREEN Passed 7/7; Maestro Passed 53/53 |
| FR-001 | AC-002 | Unidade | tests/rest-timer-navigation.test.js | RED exit 1; GREEN Passed 7/7; Maestro Passed 53/53 |
| FR-001 | AC-003 | Unidade | tests/rest-timer-navigation.test.js | Caracterização exit 0; GREEN Passed 7/7; Maestro Passed 53/53; visual 390×844 Passed |
| NFR-001 | AC-001 | Unidade | npm run test:tdd -- tests/rest-timer-navigation.test.js | RED exit 1; GREEN Passed 7/7; Maestro Passed 53/53 |
| NFR-001 | AC-002 | Unidade | npm run test:tdd -- tests/rest-timer-navigation.test.js | RED exit 1; GREEN Passed 7/7; Maestro Passed 53/53 |
| NFR-001 | AC-003 | Unidade | npm run test:tdd -- tests/rest-timer-navigation.test.js -t não.transporta | Caracterização exit 0; GREEN Passed 7/7; Maestro Passed 53/53; visual 390×844 Passed |

Resultados de aceite confirmados aditivamente: AC-001 Passed pelo focal GREEN 7/7 e pela suíte Maestro 53/53; AC-002 Passed pelas mesmas execuções, preservando o descanso em duas navegações; AC-003 Passed pela caracterização focal exit 0, pela suíte Maestro 53/53 e pela captura móvel auditada em 390×844 (Exercício 3 de 6, meta Descanso 75s, cartão Descanso em andamento com controles). O texto humano dos cenários permanece inalterado.

### 13. Validações

#### Gate do Ato I — Definição

- **Resultado**: Passed
- **Comando**: `node .agents/skills/specsfy-04-validate/scripts/validate_spec.mjs specs/planned/0005-descanso-ultima-serie-ao-avancar/spec.md`
- **Achados**: validate_spec estrito READY no caminho defined.
- Findings especializados, quando aplicáveis, seguem `FIND-PROD|ARCH|SEC-NNN`,
  severidade `P1|P2|P3`, estado `Open|Resolved|Accepted`, refs e evidência.

#### Gate do Ato II — Plano

- **Resultado**: Passed (2026-08-28)
- **Comando**: `node .agents/skills/specsfy-05-tasks/scripts/validate_tasks.mjs specs/planned/0005-descanso-ultima-serie-ao-avancar/spec.md`
- **Achados**: validate_spec READY; validate_tasks VALID DRAFT; rastreabilidade full-chain com --allow-orphans OK (6/6 IDs); focal RED honesto 1 passed/2 failed; monitor CURRENT.

#### Gate do Ato III — Entrega

- **Resultado**: Passed (2026-08-28)
- **Comando**: `node .agents/skills/specsfy-06-tdd-bdd/scripts/check_traceability.mjs specs/review/0005-descanso-ultima-serie-ao-avancar/spec.md .`
- **Achados**: validate_spec READY; validate_tasks READY; review PASSED; acceptance PASSED; trace full-chain OK; evidências T004/T005/T006 PASSED; verify_repo PASSED; documentação compatível; monitor CURRENT; paridade e diff check sem erros. Suíte Maestro registrada: 10/10 arquivos, 53/53 testes, 0 falhas. Captura móvel auditada em 390×844.

### 14. Tarefas

- [x] T001 [TEST] [TDD] [US-001] Derivar AC-001 em tests/rest-timer-navigation.test.js — Refs: US-001, FR-001, NFR-001, AC-001 — Depends: none
  - [x] **PREP**: confirmar estado ativo/pausado e proveniência.
  - [x] **EXECUTE**: escrever teste Vitest sem produção.
  - [x] **VERIFY**: observar RED reproduzível.
  - [x] **EVIDENCE**: focal exit 1; AC-001 RED esperado 01:18, recebido 01:30.
  - [x] **IMPROVE**: revisar isolamento.
<!-- specsfy:evidence {"task":"T001","refs":["US-001","FR-001","NFR-001","AC-001"],"files":["tests/rest-timer-navigation.test.js"],"commands":[{"run":"npm run test:tdd -- tests/rest-timer-navigation.test.js --reporter=verbose","exit":1}]} -->
- [x] T002 [TEST] [TDD] [US-001] Derivar AC-002 em tests/rest-timer-navigation.test.js — Refs: US-001, FR-001, NFR-001, AC-002 — Depends: T001
  - [x] **PREP**: confirmar múltiplos avanços.
  - [x] **EXECUTE**: escrever teste Vitest sem produção.
  - [x] **VERIFY**: observar RED reproduzível.
  - [x] **EVIDENCE**: focal exit 1; AC-002 RED esperado 01:30, recebido 01:15.
  - [x] **IMPROVE**: revisar invariantes.
<!-- specsfy:evidence {"task":"T002","refs":["US-001","FR-001","NFR-001","AC-002"],"files":["tests/rest-timer-navigation.test.js"],"commands":[{"run":"npm run test:tdd -- tests/rest-timer-navigation.test.js --reporter=verbose","exit":1}]} -->
- [x] T003 [TEST] [TDD] [US-001] Derivar AC-003 em tests/rest-timer-navigation.test.js — Refs: US-001, FR-001, NFR-001, AC-003 — Depends: T002
  - [x] **PREP**: confirmar ausência de elegibilidade/recarga.
  - [x] **EXECUTE**: escrever teste Vitest sem produção.
  - [x] **VERIFY**: caracterização verde dos limites atuais.
  - [x] **EVIDENCE**: filtro AC-003 exit 0.
  - [x] **IMPROVE**: revisar limites.
<!-- specsfy:evidence {"task":"T003","refs":["US-001","FR-001","NFR-001","AC-003"],"files":["tests/rest-timer-navigation.test.js"],"commands":[{"run":"npm run test:tdd -- tests/rest-timer-navigation.test.js -t não.transporta --reporter=verbose","exit":0}]} -->
- [x] T004 [CODE] [US-001] Implementar em index.html e treino_hibrido_juarez_v3_standalone.html mantendo paridade — Refs: US-001, FR-001, NFR-001, AC-001, AC-002, AC-003 — Depends: T001, T002, T003
  - [x] **PREP**: confirmar REDs e paridade.
  - [x] **EXECUTE**: transportar somente descanso originado na última série calculada do exercício, preservando deadline, restante e estado nos dois HTMLs.
  - [x] **VERIFY**: focal 7/7 GREEN, paridade integral e diff check sem erros.
  - [x] **EVIDENCE**: registrar GREEN e arquivos.
  - [x] **IMPROVE**: evitar reinício/duplicação; controles pausado/retomar preservados. O RED adicional teve 4 falhas esperadas e 3 casos anteriores verdes antes da correção. Não houve nova regra durável nem persistência nova; RULES/DATABASE não requerem alteração.
<!-- specsfy:evidence {"task":"T004","refs":["US-001","FR-001","NFR-001","AC-001","AC-002","AC-003"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/rest-timer-navigation.test.js"],"commands":[{"run":"npm run test:tdd -- tests/rest-timer-navigation.test.js --reporter=verbose","exit":0},{"run":"git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html","exit":0},{"run":"git diff --check","exit":0},{"run":"node .agents/skills/specsfy-setup/scripts/monitor_context.mjs --project . --check","exit":0}]} -->
- [x] T005 [DOC] Reconstruir docs/ e .specsfy/PACKAGES.md — Refs: US-001, FR-001, NFR-001 — Depends: T004
  - [x] **PREP**: identificar documentação.
  - [x] **EXECUTE**: executar documentador.
  - [x] **VERIFY**: confirmar --check.
  - [x] **EVIDENCE**: build_documentation e --check exit 0.
  - [x] **IMPROVE**: manter inventário; nenhuma alteração em RULES/DATABASE.
<!-- specsfy:evidence {"task":"T005","refs":["US-001","FR-001","NFR-001"],"files":["docs/README.md",".specsfy/PACKAGES.md"],"commands":[{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project .","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0}]} -->
- [x] T006 [TEST] Regressão, aceite, rastreabilidade full-chain, evidências, paridade, visual móvel e monitor em tests/rest-timer-navigation.test.js e research/20260828-spec0005-mobile-ios-390x844-rest-carryover.png — Refs: US-001, FR-001, NFR-001, AC-001, AC-002, AC-003 — Depends: T005
  - [x] **PREP**: reunir validadores.
  - [x] **EXECUTE**: executar suite Maestro 10/10 arquivos, 53/53 testes.
  - [x] **VERIFY**: aceite, review, rastreabilidade, evidências, paridade e monitor verdes.
  - [x] **EVIDENCE**: screenshot móvel canônica preservada após URL/UA iOS/390×844 exatos; portal/PID encerrados.
  - [x] **IMPROVE**: preservar limites de sessão e ausência de segundo plano.
<!-- specsfy:evidence {"task":"T006","refs":["US-001","FR-001","NFR-001","AC-001","AC-002","AC-003"],"files":["specs/completed/0005-descanso-ultima-serie-ao-avancar/spec.md","tests/rest-timer-navigation.test.js","specs/completed/0005-descanso-ultima-serie-ao-avancar/research/20260828-spec0005-mobile-ios-390x844-rest-carryover.png"],"commands":[{"run":"npm run test:tdd -- --reporter=verbose","exit":0},{"run":"node .agents/skills/specsfy-04-validate/scripts/verify_repo.mjs . --boundary local","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0},{"run":"node .agents/skills/specsfy-setup/scripts/monitor_context.mjs --project . --check","exit":0}]} -->

### 15. Ordem de execução

- T001 → T002 → T003 → T004 → T005 → T006.
- Tarefas paralelas: Nenhuma.
- Estratégia de MVP: transporte do descanso na sessão.



## Ato III — Entregar e validar

### 16. Dependências, riscos e suposições

#### Dependências

- Nenhuma dependência externa.

#### Riscos

- Perda/duplicação do timer → testes de transição e invariantes.

#### Suposições

- Estado de descanso permanece em memória durante a sessão.

### 17. Decisões

- **DEC-001**: Transportar estado único do descanso — preserva continuidade sem persistência nova.

### 18. Definition of Done

- [x] `Definition Gate` está `Passed`.
- [x] `Plan Gate` está `Passed`.
- [x] `Delivery Gate` está `Passed`.
- [x] Todos os cenários `AC` aplicáveis passam.
- [x] Todos os requisitos possuem evidência de verificação.
- [x] Todas as tarefas na seção 14 estão concluídas.
- [x] Testes e checks estáticos disponíveis passam.
