# Especificação integrada: Três níveis de vibração

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0004 |
| Slug | 0004-tres-niveis-de-vibracao |
| Status | Complete |
| Effort | 4 |
| Effort updated at | 2026-08-28 |
| Effort rationale | Preferência local, API limitada e dois HTMLs sincronizados. |
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

A PWA tem chave binária e padrão tátil fixo; o pedido literal é `Ter a opção de escolher 3 níveis de Vibrar.`

#### Resultado desejado

A pessoa escolhe Curto, Padrão ou Longo no painel existente, a preferência local é restaurada após recarregar e o fim do descanso solicita apenas o padrão temporal correspondente quando suportado.

#### Métricas de sucesso

- Três IDs e fallback Padrão são observáveis em testes JSDOM.

### 2. Research e esclarecimentos

#### Researchs executados

- **R-001** [critical] Padrão temporal não é força física; API pode estar ausente, recusar e exigir página visível — Verdict: verified — Confidence: high — Evidence: research/vibration-api-sources.md — Budget: 2/2.

#### Fontes e contexto consultados

- Inbox, BACKLOG-0003, código atual, DATABASE, MDN e W3C.

#### Documentação consultada

- MDN Navigator.vibrate e W3C Vibration API, 2026-08-28.

#### Artefatos de pesquisa armazenados

 - `specs/completed/0004-tres-niveis-de-vibracao/research/vibration-api-sources.md`.

#### Dúvidas respondidas

- Persistir localmente; padrão Padrão; usar só no fim do descanso; seletor nativo abaixo da chave Vibração Tátil.

#### Dúvidas abertas

- Nenhuma lacuna aplicável.

### 3. Escopo e atores

#### Incluído

- Três padrões, seletor nativo, persistência local, fallback e falha silenciosa.

#### Fora de escopo

- Amplitude física, pulso de 60 ms da série, tela bloqueada/outro app, backend, wrapper nativo e teste automático.

#### Atores

- **Pessoa usuária**: escolhe a preferência no próprio dispositivo.
- **Navegador compatível**: pode aceitar ou recusar a solicitação tátil.

### 4. Princípios e restrições do projeto

- **PR-001**: Vanilla JS, offline e compatível com estado local legado.
- **PR-002**: os dois HTMLs permanecem funcionalmente sincronizados.
- **PR-003**: não declarar vibração observada em plataforma sem suporte.

### 5. Histórias de usuário

#### US-001 — Escolher alerta tátil (P1)

Como pessoa em treino, quero escolher Curto, Padrão ou Longo para o alerta de fim do descanso, para ajustar seu padrão temporal sem perder a escolha ao recarregar.

**Por que P1**: entrega o pedido literal.
**Teste independente**: mock de `navigator.vibrate` recebe o padrão salvo.
**Requisitos**: FR-001, FR-002, NFR-001.

### 6. Cenários BDD de aceite

#### AC-001 — Persistir Curto

**Cobre**: US-001, FR-001, FR-002, NFR-001

```gherkin
Scenario: Restaurar Curto
  Given que Curto foi escolhido e vibração está habilitada
  When a PWA recarrega e o descanso termina
  Then o seletor mostra Curto
  And navigator.vibrate recebe 120
```

#### AC-002 — Preservar alcance do padrão

**Cobre**: US-001, FR-001, FR-002, NFR-001

```gherkin
Scenario: Usar Padrão somente no descanso
  Given que Padrão está escolhido
  When uma série é concluída
  Then o pulso existente de 60 ms não muda
  When o descanso termina
  Then navigator.vibrate recebe [300,150,300,150,600]
```

#### AC-003 — Falhar sem interromper treino

**Cobre**: US-001, FR-001, FR-002, NFR-001

```gherkin
Scenario: API ausente ou recusada
  Given que navigator.vibrate não está disponível ou retorna false
  When o descanso termina
  Then a conclusão visual permanece
  And o aplicativo não afirma que houve vibração
```

### 7. Requisitos

#### Funcionais

- **FR-001**: Oferecer Curto (`120`), Padrão (`[300,150,300,150,600]`) e Longo (`[300,150,300,150,300,150,600]`) no seletor nativo abaixo de Vibração Tátil.
- **FR-002**: Persistir somente o ID selecionado, restaurar Padrão para estado ausente/inválido e usar o padrão apenas no fim do descanso sob a chave geral existente.

#### Não funcionais

- **NFR-001**: Campo móvel tem fonte de 16 px e alvo de 44 px; API ausente, retorno false ou página inelegível não interrompe timer, histórico ou conclusão visual. **Verificação**: JSDOM e paridade HTML.

#### Erros e casos-limite

- Chave desligada não chama API; ID inválido usa Padrão; recusa/ausência não produz alegação tátil.

## Ato II — Projetar e provar

### 8. Plano técnico

#### Contexto existente

- `state.alertPreferences`/`persist()` já guardam som e volume; o fim do descanso hoje usa padrão fixo.

#### Arquitetura e módulos

- `vibrationLevelId` normalizado junto à preferência de alerta, mapa local de padrões e chamada opcional com retorno booleano.

#### Migrations

- Não aplicável: estado antigo recebe Padrão sem apagar histórico.

#### Models

- Preferência local `vibrationLevelId`: short, standard ou long.

#### Controllers e casos de uso

- Mudança do seletor persiste imediatamente; conclusão do descanso lê o ID normalizado.

#### Views e experiência

- Seletor nativo abaixo de Vibração Tátil, sem modal nem vibração de teste.

#### Queries e repositórios

- Não aplicável.

#### Jobs e processamento assíncrono

- Não aplicável.

#### Estrutura de arquivos

```text
specs/completed/0004-tres-niveis-de-vibracao/spec.md
specs/completed/0004-tres-niveis-de-vibracao/research/vibration-api-sources.md
index.html
treino_hibrido_juarez_v3_standalone.html
tests/vibration-levels.test.js
```

### 9. Modelo de dados

#### Entidades

| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| Preferência de alerta local | vibrationLevelId | três IDs; inválido é standard | pertence ao estado local |

#### Estados e transições

| Entidade | Estado atual | Evento | Próximo estado | Invariantes |
| --- | --- | --- | --- | --- |
| Nível tátil | qualquer | escolha válida | ID escolhido | fallback standard |

#### Migração e retenção

- Dados locais são removidos somente ao limpar o armazenamento do navegador.

### 10. Interfaces e contratos

#### APIs expostas

- Handlers locais de sincronização/atualização do seletor; sem rede.

#### APIs externas utilizadas

- `navigator.vibrate(pattern)`, opcional e sem retry.

#### Documentação das APIs consultadas

- `specs/completed/0004-tres-niveis-de-vibracao/research/vibration-api-sources.md`.

#### Eventos e outros contratos

- Alterar seletor persiste; terminar descanso solicita padrão sob chave geral.

### 11. Estratégia TDD

- **Unidade**: normalização, persistência, padrões e API ausente/false.
- **Integração/contrato**: JSDOM dos HTMLs e diff de paridade.
- **BDD/aceite**: AC-001 a AC-003, sem `.feature`.
- **Runner TDD**: Vitest existente (`npm run test:tdd`).
- **E2E**: não aplicável; percepção física não é garantia web.
- **Verificação manual**: seletor em viewport móvel elegível, sem alegar percepção física.

#### Evidência RED-GREEN-REFACTOR

| IDs | BDD de referência | Teste TDD informado pelo BDD | RED observado | GREEN observado | Refactor/regressão |
| --- | --- | --- | --- | --- | --- |
| US-001, FR-001, FR-002, NFR-001, AC-001 | AC-001 | `tests/vibration-levels.test.js`: Curto | 2026-08-28: seletor `#vibrationLevel` ausente | 2026-08-28: 3/3 Vitest GREEN, Curto persiste em `alertPreferences` | Paridade HTML e inspeção iOS 390×844 concluídas |
| US-001, FR-001, FR-002, NFR-001, AC-002 | AC-002 | `tests/vibration-levels.test.js`: Padrão/60 ms | 2026-08-28: `getVibrationPattern` ausente | 2026-08-28: Padrão e pulso de série de 60 ms GREEN | Sem refactor adicional necessário |
| US-001, FR-001, FR-002, NFR-001, AC-003 | AC-003 | `tests/vibration-levels.test.js`: API ausente/false | 2026-08-28: `requestRestVibration` ausente | 2026-08-28: API ausente preserva `PRONTO!` em GREEN | Sem alegação de percepção física |

### 12. Plano de testes e rastreabilidade

| Requisito | Cenário BDD | Nível | Arquivo/comando esperado | Evidência |
| --- | --- | --- | --- | --- |
| FR-001 | AC-001, AC-002, AC-003 | Unidade/JSDOM | `tests/vibration-levels.test.js` | T004 GREEN 3/3 e evidência estrita PASSED |
| FR-002 | AC-001, AC-002, AC-003 | Unidade/JSDOM | `tests/vibration-levels.test.js` | T005: DATABASE documenta `vibrationLevelId`; GREEN 3/3 |
| NFR-001 | AC-001, AC-002, AC-003 | Unidade/inspeção | Vitest e diff HTML | T004: paridade/iOS; T005: documentação e monitor CURRENT |

### 13. Validações

#### Gate do Ato I — Definição

- **Resultado**: Passed (2026-08-28)
- **Comando**: `node .agents/skills/specsfy-04-validate/scripts/validate_spec.mjs specs/completed/0004-tres-niveis-de-vibracao/spec.md` e `review_findings.mjs`.
- **Achados**: estrutura da especificação concluída e reviews PASSED; cobertura de 1 US, 2 FR, 1 NFR e 3 AC confirmada por `validate_spec` e `review_findings`.

#### Gate do Ato II — Plano

- **Resultado**: Passed (2026-08-28)
- **Comando**: `node .agents/skills/specsfy-05-tasks/scripts/validate_tasks.mjs specs/defined/0004-tres-niveis-de-vibracao/spec.md --allow-draft`.
- **Achados**: 6 tarefas, 3 predecessoras TDD concluídas com RED, 30 checklists e cobertura dos 7 IDs.

#### Gate do Ato III — Entrega

- **Resultado**: Passed (2026-08-28)
- **Comando**: `npm run test:tdd -- --reporter=verbose` no terminal Maestro; validadores locais Specsfy, aceite, rastreabilidade isolada, documentação e monitor.
- **Achados**: o Maestro executou após a reconciliação do contrato de alarme e do enforcement com exit 0, 9/9 arquivos e 46/46 testes PASSED, incluindo Partitura, vibração 3/3, alarme 3/3, Kg, calendário/legado, segurança, verificador Windows e o teste de isolamento de trace. `validate_spec`, `review_findings`, `validate_tasks`, `verify_acceptance`, `verify_evidence` T004/T005, `verify_repo --boundary local`, rastreabilidade isolada 7/7 e `build_documentation --check` passaram; monitor permanece CURRENT. A evidência iOS 390×844 de T004 foi obtida em coleta única com portal e servidor temporários; a captura foi preservada no arquivo canônico e o rollback (encerramento do portal/PID) foi concluído.

### 14. Tarefas

#### Fase 1 — RED TDD

- [x] T001 [TEST] [TDD] [US-001] Derivar AC-001 em `tests/vibration-levels.test.js` — Refs: US-001, FR-001, FR-002, NFR-001, AC-001 — Depends: none
  - [x] **PREP**: Confirmar defaults e LocalStorage nos dois HTMLs.
  - [x] **EXECUTE**: Criar caso JSDOM com marcador próprio para Curto e recarga.
  - [x] **VERIFY**: Observar RED pela ausência de seletor/persistência.
  - [x] **EVIDENCE**: Registrar comando e causa do RED na seção 11.
  - [x] **IMPROVE**: Confirmar que o teste não solicita vibração física.

- [x] T002 [TEST] [TDD] [US-001] Derivar AC-002 em `tests/vibration-levels.test.js` — Refs: US-001, FR-001, FR-002, NFR-001, AC-002 — Depends: none
  - [x] **PREP**: Caracterizar pulso de série de 60 ms e padrão atual do descanso.
  - [x] **EXECUTE**: Criar caso JSDOM para Padrão no descanso e série intocada.
  - [x] **VERIFY**: Observar RED pela ausência de escolha normalizada.
  - [x] **EVIDENCE**: Registrar comando e causa do RED na seção 11.
  - [x] **IMPROVE**: Confirmar que não amplia o escopo de série.

- [x] T003 [TEST] [TDD] [US-001] Derivar AC-003 em `tests/vibration-levels.test.js` — Refs: US-001, FR-001, FR-002, NFR-001, AC-003 — Depends: none
  - [x] **PREP**: Localizar a conclusão visual do descanso.
  - [x] **EXECUTE**: Simular API ausente e retorno false no caso JSDOM.
  - [x] **VERIFY**: Observar RED pela ausência do fallback seguro.
  - [x] **EVIDENCE**: Registrar comando e causa do RED na seção 11.
  - [x] **IMPROVE**: Confirmar ausência de promessa tátil.

#### Fase 2 — Implementação

- [x] T004 [CODE] [US-001] Implementar níveis em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, FR-001, FR-002, NFR-001, AC-001, AC-002, AC-003 — Depends: T001, T002, T003
  - [x] **PREP**: Confirmar três REDs e reconstruir docs antes de alterar HTML.
  - [x] **EXECUTE**: Adicionar seletor, normalização, persistência e chamada segura apenas no descanso.
  - [x] **VERIFY**: Executar testes focais, paridade e inspeção móvel elegível.
  - [x] **EVIDENCE**: Anexar comandos, saída e screenshot à seção 11.
  - [x] **IMPROVE**: Nenhuma duplicação adicional é necessária; o pulso de série continua 60 ms e a API ausente/recusada retorna false sem interromper o aviso visual. PROJECT.md não teve impacto material e RULES.md não exige regra durável nova.
<!-- specsfy:evidence {"task":"T004","refs":["US-001","FR-001","FR-002","NFR-001","AC-001","AC-002","AC-003"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/vibration-levels.test.js","specs/completed/0004-tres-niveis-de-vibracao/research/20260828-spec0004-mobile-ios-390x844-vibration-level.png"],"commands":[{"run":"npm run test:tdd -- tests/vibration-levels.test.js --reporter=verbose","exit":0},{"run":"git diff --check -- index.html treino_hibrido_juarez_v3_standalone.html","exit":0},{"run":"git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0},{"run":"node .agents/skills/specsfy-setup/scripts/monitor_context.mjs --project . --check","exit":0},{"run":"maestri portal info/evaluate (http://127.0.0.1:41747/, UA iOS, 390x844) e screenshot","exit":0}]} -->
- Screenshot canônica T004: `specs/completed/0004-tres-niveis-de-vibracao/research/20260828-spec0004-mobile-ios-390x844-vibration-level.png` (portal confirmado com URL, UA iOS e viewport 390×844 antes da captura).

#### Fase 3 — Dados, documentação e regressão

- [x] T005 [DOC] [US-001] Reconciliar `.specsfy/DATABASE.md`, `.specsfy/PACKAGES.md` e `docs/` — Refs: FR-002, NFR-001, AC-001, AC-003 — Depends: T004
  - [x] **PREP**: Conferir a preferência efetivamente implementada.
  - [x] **EXECUTE**: Atualizar dados de forma aditiva e executar documentador.
  - [x] **VERIFY**: Confirmar limites de plataforma e persistência local.
  - [x] **EVIDENCE**: Registrar arquivos e validações documentais.
  - [x] **IMPROVE**: Conteúdo humano foi preservado; PROJECT.md não teve impacto material e RULES.md não exige regra durável nova.
<!-- specsfy:evidence {"task":"T005","refs":["FR-002","NFR-001","AC-001","AC-003"],"files":[".specsfy/DATABASE.md",".specsfy/PACKAGES.md","docs/README.md","tests/vibration-levels.test.js","specs/completed/0004-tres-niveis-de-vibracao/research/20260828-spec0004-mobile-ios-390x844-vibration-level.png"],"commands":[{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project .","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0},{"run":"npm run test:tdd -- tests/vibration-levels.test.js --reporter=verbose","exit":0},{"run":"node .agents/skills/specsfy-setup/scripts/monitor_context.mjs --project . --check","exit":0}]} -->

- [x] T006 [TEST] [US-001] Executar regressão e Delivery Gate em `tests/vibration-levels.test.js` e `spec.md` — Refs: US-001, FR-001, FR-002, NFR-001, AC-001, AC-002, AC-003 — Depends: T004, T005
  - [x] **PREP**: Reunir IDs, requisitos e critérios de aceite.
  - [x] **EXECUTE**: Rodar Vitest, validadores, monitor e prova visual permitida.
  - [x] **VERIFY**: Confirmar checks verdes e ausência de PENDING.
  - [x] **EVIDENCE**: Calcular gate somente com prova reproduzível.
  - [x] **IMPROVE**: A única regressão real foi o contrato legado de alarme, reconciliado sem alterar produto; a rastreabilidade usou cópia temporária removida. PROJECT.md não teve impacto material e RULES.md não exige regra durável nova.
<!-- specsfy:evidence {"task":"T006","refs":["US-001","FR-001","FR-002","NFR-001","AC-001","AC-002","AC-003"],"files":["specs/review/0004-tres-niveis-de-vibracao/spec.md","tests/vibration-levels.test.js","tests/alarm-preferences.test.js","tests/verify-repo-trace-isolation.test.js"],"commands":[{"run":"npm run test:tdd -- --reporter=verbose (terminal Maestro)","exit":0},{"run":"node .agents/skills/specsfy-04-validate/scripts/verify_repo.mjs . --boundary local --timeout-seconds 300 --max-output-bytes 65536","exit":0},{"run":"node .agents/skills/specsfy-04-validate/scripts/validate_spec.mjs specs/review/0004-tres-niveis-de-vibracao/spec.md","exit":0},{"run":"node .agents/skills/specsfy-04-validate/scripts/review_findings.mjs specs/review/0004-tres-niveis-de-vibracao/spec.md --root .","exit":0},{"run":"node .agents/skills/specsfy-05-tasks/scripts/validate_tasks.mjs specs/review/0004-tres-niveis-de-vibracao/spec.md","exit":0},{"run":"node .agents/skills/specsfy-06-tdd-bdd/scripts/verify_acceptance.mjs specs/review/0004-tres-niveis-de-vibracao/spec.md .","exit":0},{"run":"node .agents/skills/specsfy-06-tdd-bdd/scripts/check_traceability.mjs specs/review/0004-tres-niveis-de-vibracao/spec.md <temporary-vibration-test-copy> --full-chain","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0},{"run":"node .agents/skills/specsfy-setup/scripts/monitor_context.mjs --project . --check","exit":0}]} -->

### 15. Ordem de execução

- Caminho crítico: T001/T002/T003 → T004 → T005 → T006.
- T001–T003 compartilham arquivo de teste e não são paralelas; T005 depende da implementação persistente.
- Menor fatia demonstrável: selecionar Padrão/Curto/Longo, recarregar e solicitar o padrão apenas ao terminar descanso em navegador compatível.

## Ato III — Entregar e validar

### 16. Dependências, riscos e suposições

#### Dependências

- LocalStorage, Web Vibration API opcional e os dois HTMLs.

#### Riscos

- API recusar/não suportar → preservar sinais visual/sonoro e não prometer retorno tátil.

#### Suposições

- Curto/Padrão/Longo descrevem duração e cadência, nunca potência.

### 17. Decisões

- **DEC-001**: padrões temporais com Padrão como fallback.
- **DEC-002**: persistência local junto à preferência de alerta.
- **DEC-003**: apenas fim do descanso; pulso de série intocado.
- **DEC-004**: seletor nativo abaixo de Vibração Tátil.

### 18. Definition of Done

- [x] `Definition Gate` está `Passed`.
- [x] `Plan Gate` está `Passed`.
- [x] `Delivery Gate` está `Passed`.
- [x] Todos os cenários `AC` aplicáveis passam.
- [x] Todos os requisitos possuem evidência de verificação.
- [x] Todas as tarefas na seção 14 estão concluídas.
- [x] Testes e checks estáticos disponíveis passam.
