# Especificação integrada: Alarme com som, volume e suporte em primeiro plano

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0003 |
| Slug | 0003-alarme-volume-em-segundo-plano |
| Status | Complete |
| Effort | 5 |
| Effort updated at | 2026-08-28 |
| Effort rationale | Ajusta interface, síntese Web Audio, persistência local compatível e testes nos dois HTMLs, com limites explícitos de plataforma. |
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

O alerta de fim do descanso possui um único som e um volume que não volta selecionado após recarregar. A pessoa não consegue escolher entre três sons nem manter essa preferência no dispositivo. O pedido humano literal inclui tocar com o celular bloqueado ou em outro aplicativo, mas a PWA web atual não garante temporização ou áudio nesses estados.

#### Resultado desejado

Com a PWA ativa e visível, a pessoa escolhe Alto, Pulsado ou Duplo no painel existente “Configurações de Alerta”, ajusta o volume e tem ambas as preferências preservadas localmente. O próximo fim de descanso usa a nova escolha sem interromper a contagem em curso. Tela bloqueada e outro aplicativo em primeiro plano ficam explicitamente fora de suporte nesta entrega.

#### Métricas de sucesso

- Os cenários AC-001 a AC-003 passam em teste automatizado, cobrindo presets, ganho, persistência, defaults, contagem ativa e falha de áudio.
- Em viewport de 360 px ou maior, o campo de seleção tem fonte de no mínimo 16 px e alvo de toque de no mínimo 44 px.

### 2. Research e esclarecimentos

#### Researchs executados

- **R-001** [critical] O Service Worker atual limita-se a cache/fetch e não contém mecanismo de alarme em segundo plano. — Verdict: verified — Confidence: high — Evidence: research/contexto-local.md#service-worker-e-fronteira-de-plataforma — Budget: 0/1.
- **R-002** [high] As preferências de som e volume cabem no armazenamento local já documentado sem alterar sessões ou histórico. — Verdict: verified — Confidence: high — Evidence: research/contexto-local.md#persistência-local — Budget: 0/1.

#### Fontes e contexto consultados

- `specs/inbox/20260827-130600-alarme-volume-em-segundo-plano.md` — formulação humana literal.
- `specs/backlog/0002-alarme-volume-em-segundo-plano.md` — decisões confirmadas.
- `PROJECT.md`, `.specsfy/RULES.md`, `.specsfy/DATABASE.md`, `.specsfy/STACK.md`, `index.html`, `treino_hibrido_juarez_v3_standalone.html` e `sw.js`.

#### Documentação consultada

- Nenhuma documentação externa foi consultada nesta etapa; as referências externas do backlog permanecem somente como proveniência histórica.

#### Artefatos de pesquisa armazenados

- `specs/completed/0003-alarme-volume-em-segundo-plano/research/contexto-local.md`: observações locais de Service Worker e persistência, produzidas em 2026-08-28; sem licença externa aplicável; delimita a capacidade suportada e a compatibilidade local.

#### Dúvidas respondidas

- **Q**: A entrega deve garantir som após bloqueio ou troca de app? → **A**: Não. O suporte é somente com PWA ativa e visível.
- **Q**: Como escolher o som? → **A**: Seletor nativo no painel existente, acima do volume, com Alto, Pulsado e Duplo.
- **Q**: Quando a mudança vale? → **A**: Imediatamente para o próximo fim de descanso, sem mexer na contagem atual nem tocar automaticamente.
- **Q**: O que ocorre se Web Audio falhar? → **A**: O descanso termina visualmente, sem sucesso sonoro declarado, repetição ou mensagem persistente.

#### Dúvidas abertas

- Nenhuma lacuna aplicável. Uma capacidade fora do app exige novo pedido, decisão humana, spec e validação física.

### 3. Escopo e atores

#### Incluído

- Presets sintetizados e offline: `triple-high`/Alto, `pulse-high`/Pulsado e `double-rise`/Duplo.
- Seletor nativo no painel existente, acima do volume.
- Persistência local imediata de preset/volume; defaults Alto/0,9 para estado ausente ou inválido.
- Continuidade da contagem; conclusão visual quando Web Audio falhar.
- Fonte ≥16 px e alvo de toque ≥44 px em telas de 360 px ou maiores.

#### Fora de escopo

- Tela bloqueada, página oculta/congelada ou outro app em primeiro plano.
- Repetição automática, aviso persistente, modal ou reprodução automática extra.
- Vibração, backend, Web Push, wrapper nativo, permissões, envio de dados, T036/kg e qualquer outro pedido azul.

#### Atores

- **Pessoa usuária**: escolhe som e volume no próprio dispositivo durante a sessão.
- **Navegador/PWA**: persiste a preferência local e tenta a síntese quando o descanso termina; pode recusar ou suspender áudio.

### 4. Princípios e restrições do projeto

- **PR-001**: Manter HTML/CSS/JavaScript puro, offline e sem nova dependência.
- **PR-002**: Manter `index.html` e `treino_hibrido_juarez_v3_standalone.html` funcionalmente sincronizados.
- **PR-003**: Preservar estados locais antigos, sessões e histórico.
- **PR-004**: Não declarar ou sugerir suporte fora do primeiro plano.
- **PR-005**: Respeitar fonte ≥16 px e alvo de toque ≥44 px no mobile.

### 5. Histórias de usuário

#### US-001 — Personalizar alerta em primeiro plano (P1)

Como pessoa usuária, quero escolher um dos três sons e ajustar o volume do alarme, para reconhecer o fim do descanso sem perder a preferência após recarregar.

**Por que P1**: entrega o valor direto do pedido de forma local e offline.
**Teste independente**: JSDOM com Web Audio simulado exercita escolha, recarga, próximo alarme, contagem ativa e falha.
**Requisitos**: FR-001, FR-002, NFR-001.

### 6. Cenários BDD de aceite

#### AC-001 — Escolher e aplicar preset

**Cobre**: US-001, FR-001, FR-002, NFR-001

```gherkin
@US-001 @FR-001 @FR-002 @NFR-001 @AC-001
Feature: Preferências locais do alarme

  Scenario: Escolher Pulsado e volume 0,4
    Given a PWA ativa e visível em uma tela de 360 px ou maior
    And existe um descanso em curso
    When a pessoa escolhe Pulsado acima do volume e ajusta o volume para 0,4
    Then a escolha é guardada sem reiniciar ou interromper a contagem
    And o próximo fim de descanso usa pulse-high com ganho 0,4
    And a alteração não toca som automaticamente
```

#### AC-002 — Recarregar estado válido, antigo ou inválido

**Cobre**: US-001, FR-001, FR-002, NFR-001

```gherkin
@US-001 @FR-001 @FR-002 @NFR-001 @AC-002
Feature: Preferências locais do alarme

  Scenario: Abrir preferências persistidas ou sem dados válidos
    Given estado local com uma escolha válida, sem alerta ou com valores inválidos
    When a PWA carrega
    Then uma escolha válida reaparece no mesmo dispositivo
    And valores ausentes ou inválidos usam Alto e 0,9 sem modificar sessões ou histórico
    And o seletor mantém fonte de no mínimo 16 px e alvo de toque de no mínimo 44 px
```

#### AC-003 — Falhar áudio e respeitar a fronteira

**Cobre**: US-001, FR-001, FR-002, NFR-001

```gherkin
@US-001 @FR-001 @FR-002 @NFR-001 @AC-003
Feature: Preferências locais do alarme

  Scenario: AudioContext indisponível no fim do descanso
    Given uma PWA ativa e visível cujo AudioContext está indisponível, interrompido ou suspenso
    When o descanso termina
    Then o descanso mostra “PRONTO!” e “Descanso finalizado! Próxima série.”
    And não declara sucesso sonoro, repete áudio automaticamente ou cria aviso persistente
    And não declara suporte para tela bloqueada ou outro aplicativo
```

### 7. Requisitos

#### Funcionais

- **FR-001**: O sistema deve exibir exatamente Alto (`triple-high`), Pulsado (`pulse-high`) e Duplo (`double-rise`) em seletor nativo no painel existente, acima do volume, e persistir imediatamente uma preferência válida.
- **FR-002**: O sistema deve usar a preferência no próximo fim de descanso sem alterar contagem em curso; estado ausente ou inválido usa Alto/0,9, e falha de áudio conclui visualmente sem falso sucesso, repetição ou aviso persistente.

#### Não funcionais

- **NFR-001**: A feature deve permanecer offline, sem backend ou transmissão; os HTMLs devem permanecer sincronizados, com seletor de fonte ≥16 px e toque ≥44 px em tela ≥360 px. **Verificação**: Vitest/JSDOM, inspeção DOM/CSS e `git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html`.

#### Erros e casos-limite

- Preset desconhecido → Alto; volume ausente/não numérico/fora de faixa → 0,9; nenhum altera sessões ou histórico.
- AudioContext falho com PWA ativa/visível → conclusão visual normal, sem sucesso sonoro, repetição ou bloqueio.
- Tela bloqueada, página oculta/congelada ou outro app → fora de suporte, sem promessa de melhor esforço.

## Ato II — Projetar e provar

### 8. Plano técnico

#### Contexto existente

- PWA offline em HTML/CSS/JavaScript puro, LocalStorage, Web Audio e Service Worker de cache/fetch.
- Painel de configurações e volume já existem; Vitest/JSDOM já são o runner de testes Node.

#### Arquitetura e módulos

- Declarar os três presets localmente nos dois HTMLs; ID inválido resolve para `triple-high`.
- Estender o estado local com `alert.presetId` e `alert.volume`, normalizando estados antigos sem migrar sessões/histórico.
- Ligar seletor/volume à persistência imediata sem chamar áudio ou tocar no timer ativo.
- No fim do descanso, tentar a síntese escolhida e manter o fluxo visual se a tentativa falhar.

#### Migrations

- Não aplicável. Campo opcional e leitura defensiva; rollback ignora `alert` e usa defaults.

#### Models

- Não aplicável. Preferência local: `presetId` válido e `volume` de 0,1 a 1,0.

#### Controllers e casos de uso

- Handlers de seletor/volume normalizam e persistem preferências futuras.
- Handler de término de descanso protege a conclusão visual de erro/recusa de áudio.

#### Views e experiência

- Adicionar “Som do alarme” como seletor nativo no painel “Configurações de Alerta”, acima do volume; sem modal, loading ou reprodução automática extra.

#### Queries e repositórios

- Não aplicável: leitura/escrita apenas no LocalStorage existente.

#### Jobs e processamento assíncrono

- Não aplicável: não há push, Service Worker novo ou agendamento em segundo plano.

#### Estrutura de arquivos

```text
specs/draft/0003-alarme-volume-em-segundo-plano/spec.md
index.html
treino_hibrido_juarez_v3_standalone.html
tests/alarm-preferences.test.js
```

### 9. Modelo de dados

#### Entidades

| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| Preferências do alarme | Configuração do dispositivo | `presetId`: triple-high, pulse-high ou double-rise; `volume`: 0,1–1,0; defaults Alto/0,9 | Parte das configurações locais do timer; não altera sessões/histórico |

#### Estados e transições

| Entidade | Estado atual | Evento | Próximo estado | Invariantes |
| --- | --- | --- | --- | --- |
| Preferência | Ausente ou inválida | Carregar PWA | Alto/0,9 em memória | Sessões e histórico preservados |
| Preferência | Válida | Alterar som/volume | Válida e persistida | Timer ativo não muda e não há reprodução |
| Descanso | Em curso | Áudio falha no término | Finalizado visualmente | Sem sucesso sonoro ou repetição |

#### Migração e retenção

- Preferência permanece até nova mudança ou limpeza de dados do navegador; não há retenção remota ou migração destrutiva.

### 10. Interfaces e contratos

#### APIs expostas

- Nenhuma API HTTP. O contrato é o seletor local “Som do alarme” e o controle de volume.

#### APIs externas utilizadas

- Web Audio API local, sem rede, autenticação ou retry; erro preserva conclusão visual.
- LocalStorage API local; valor inválido usa defaults.

#### Documentação das APIs consultadas

- Nenhuma fonte externa consultada nesta etapa.

#### Eventos e outros contratos

- Alterar seletor/volume → normalizar e persistir imediatamente.
- Terminar descanso → ler preferência normalizada, tentar síntese e manter conclusão visual em falha.

### 11. Estratégia TDD

- **Unidade**: presets, ganho, defaults, persistência, continuidade do timer e fallback de áudio.
- **Integração/contrato**: JSDOM exercita o HTML e LocalStorage; diff confirma paridade.
- **BDD/aceite**: AC-001 a AC-003 orientam os testes sem arquivo `.feature`.
- **Runner TDD**: Vitest, já confirmado no projeto.
- **E2E**: Não aplicável; ciclo de vida fora do app está fora de suporte.
- **Verificação manual**: seletor visível no painel em mobile; não testar bloqueio/outro app como se fosse suporte.

#### Evidência RED-GREEN-REFACTOR

| IDs | BDD de referência | Teste TDD informado pelo BDD | RED observado | GREEN observado | Refactor/regressão |
| --- | --- | --- | --- | --- | --- |
| US-001, FR-001, FR-002, NFR-001, AC-001 | AC-001 | `tests/alarm-preferences.test.js`: escolha e próximo alarme | 2026-08-28 — `npm run test:tdd -- tests/alarm-preferences.test.js --reporter=verbose`: seletor `#alarmSoundPreset` ausente (TypeError ao definir `pulse-high`) | 2026-08-28 — mesmo comando: Passed 1/1 | Paridade e evidência visual pendentes |
| US-001, FR-001, FR-002, NFR-001, AC-002 | AC-002 | `tests/alarm-preferences.test.js`: reload, inválidos e mobile | 2026-08-28 — mesmo comando: seletor ausente (TypeError ao ler default `triple-high`) | 2026-08-28 — mesmo comando: Passed 1/1 | Inspeção visual móvel pendente |
| US-001, FR-001, FR-002, NFR-001, AC-003 | AC-003 | `tests/alarm-preferences.test.js`: áudio falho e fronteira | 2026-08-28 — mesmo comando: `playHighVolumeAlarm()` retorna `undefined`, não `false`, sob AudioContext indisponível | 2026-08-28 — mesmo comando: Passed 1/1 | Sem falso sucesso visual pendente de aceite |

**Evidência posterior de T004 (2026-08-28).** O comando focal ampliado `npm run test:tdd -- tests/alarm-preferences.test.js tests/kg-suffix.test.js tests/legacy-behaviors.test.js tests/security-output-escaping.test.js tests/verify-evidence-windows.test.js --reporter=dot` passou 29/29. `git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html` não produziu diferenças funcionais. A inspeção móvel autorizada ocorreu somente depois de confirmar `http://127.0.0.1:41748/index.html`, UA iPhone iOS e `innerWidth=390`/`innerHeight=844`; no painel existente, o select nativo de 302×44 exibiu Alto/Pulsado/Duplo e Pulsado selecionado, com o volume abaixo. A captura canônica é `research/20260828-t036-mobile-ios-390x844-alert-settings.png`. Não foi acionado teste de som, vibração, tela bloqueada ou outro app.

### 12. Plano de testes e rastreabilidade

| Requisito | Cenário BDD | Nível | Arquivo/comando esperado | Evidência |
| --- | --- | --- | --- | --- |
| FR-001 | AC-001, AC-002, AC-003 | Unidade/JSDOM | `tests/alarm-preferences.test.js` | Passed — GREEN focal 3/3 e suíte focal cumulativa 29/29 em 2026-08-28; evidência visual móvel canônica registrada |
| FR-002 | AC-001, AC-002, AC-003 | Unidade/JSDOM | `tests/alarm-preferences.test.js` | Passed — GREEN focal 3/3 e suíte focal cumulativa 29/29 em 2026-08-28; evidência visual móvel canônica registrada |
| NFR-001 | AC-001, AC-002, AC-003 | Unidade/inspeção | Vitest, diff de paridade e portal iOS 390×844 | Passed — HTMLs sincronizados; select 302×44 e volume observado no portal elegível |

### 13. Validações

#### Gate do Ato I — Definição

- **Resultado**: READY (2026-08-28)
- **Comando**: `node .agents/skills/specsfy-04-validate/scripts/validate_spec.mjs specs/draft/0003-alarme-volume-em-segundo-plano/spec.md`
- **Achados**: Nenhum BLOCKER. Cobertura: US-001, FR-001, FR-002 e NFR-001 possuem AC-001, AC-002 e AC-003; research local e review de findings aprovados.

#### Gate do Ato II — Plano

- **Resultado**: PASSED (2026-08-28)
- **Comando**: `node .agents/skills/specsfy-05-tasks/scripts/validate_tasks.mjs specs/defined/0003-alarme-volume-em-segundo-plano/spec.md --allow-draft` e validação estrita subsequente.
- **Achados**: 6 tarefas (3 concluídas de RED), 4 TDD, 1 CODE, 30 itens de checklist e cobertura dos 7 IDs obrigatórios. Os três predecessores de T004 possuem RED reproduzível; nenhum HTML foi alterado.

#### Gate do Ato III — Entrega

- **Resultado**: Passed (2026-08-28)
- **Comandos verdes**: `npm run test:tdd -- tests/alarm-preferences.test.js --reporter=verbose` (3/3), `git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html`, documentador build/check e monitor (CURRENT).
- **Regressão observada**: `npm run test:tdd -- --reporter=dot` resultou 22 passed e 9 falhas preexistentes: três de Kg ausentes nesta worktree, duas de calendário/legado e quatro de papéis Maestri que exigem terminal Maestro. Não atribuídas à T004.
- **Rastreabilidade/aceite**: `validate_tasks --allow-draft` READY; `check_traceability --full-chain` GAPS somente pela evidence ainda aberta; `verify_acceptance` FAILED porque AC-001–AC-003 ainda não têm resultado de aceite.
- **Bloqueio material de evidência**: tentativa 10.1 não interagiu com T036 Mobile Evidence Replacement após precheck retornar 1440×900/UA Windows. Tentativa 11.1 criou somente o portal temporário SPEC-0003 Alarm Mobile Evidence e servidor local PID 19512; URL estava correta, mas `info/evaluate` retornaram 390×835 e UA Windows. Pelo limite autorizado, não houve clique, resize adicional, screenshot ou prova parcial. Portal fechado e PID encerrado; `maestri list` confirmou apenas o portal T036 remanescente.
- **Reconciliação de baseline (13.5, 2026-08-28)**: sob autorização explícita, a main materializou exclusivamente a entrega já aprovada da SPEC-0001 da worktree `task/t020-kg-suffix`: sufixo Kg, AC-007 de calendário e FIND-SEC-001, incluindo seus dois testes de segurança/evidência Windows. Não alterou Partitura, requisitos ou o comportamento da SPEC-0003. A suíte focal cumulativa passou 29/29; a regressão integral deve ser executada e devolvida pelo terminal Maestro antes de qualquer Delivery Gate Passed.
- **Evidência móvel concluída (13.1, 2026-08-28)**: novo portal temporário serviu `http://127.0.0.1:41748/index.html` no PID 29700. Após carga estável, UA iOS e resize único, `info/evaluate` confirmaram URL exata, UA iPhone e 390×844. Só então o painel Configurações foi aberto e o select Pulsado escolhido; a captura está em `research/20260828-t036-mobile-ios-390x844-alert-settings.png` (153112 bytes). Portal e PID foram encerrados; `maestri list` confirmou que só T036 preexistente permaneceu. Esta prova não declara suporte a bloqueio, página oculta ou outro app.
- **Fechamento final (2026-08-28)**: prova independente do terminal Maestro registrou 7/7 arquivos e 42/42 testes PASSED, com Partitura, alarme, Kg, legado, segurança e verificador Windows. Os validadores canônicos passaram; `check_traceability` isolado da SPEC retornou 7/7/OK e o monitor final retornou CURRENT. `RULES.md` foi revisado; não há nova regra durável decorrente desta entrega. Delivery Gate calculado como Passed sem staging, commit, publicação ou expansão para vibração/segundo plano.

### 14. Tarefas

#### Fase 1 — RED TDD informado pelo BDD

- [x] T001 [TEST] [TDD] [US-001] Derivar o RED para escolha imediata e próximo alarme em `tests/alarm-preferences.test.js` — Refs: US-001, FR-001, FR-002, NFR-001, AC-001 — Depends: none
  - [x] **PREP**: Ler AC-001 e confirmar o baseline dos dois HTMLs e do Vitest.
  - [x] **EXECUTE**: Criar caso JSDOM com marcador SPECSFY para seletor, persistência imediata, descanso ativo inalterado e uso posterior de Pulsado/0,4, sem produção.
  - [x] **VERIFY**: Executar o caso focal e observar RED pela ausência do comportamento.
  - [x] **EVIDENCE**: Registrar comando, saída RED e IDs rastreáveis na seção 11.
  - [x] **IMPROVE**: Confirmar que não cria `.feature` nem toca áudio real.

- [x] T002 [TEST] [TDD] [US-001] Derivar o RED para restauração e ergonomia móvel em `tests/alarm-preferences.test.js` — Refs: US-001, FR-001, FR-002, NFR-001, AC-002 — Depends: none
  - [x] **PREP**: Ler AC-002 e identificar os defaults normativos e os dois documentos espelho.
  - [x] **EXECUTE**: Criar caso JSDOM com marcador SPECSFY para reload, valores ausentes/inválidos, Alto como default e propriedades mínimas do seletor móvel.
  - [x] **VERIFY**: Executar o caso focal e observar RED pela ausência dos defaults e do controle.
  - [x] **EVIDENCE**: Registrar comando, saída RED e IDs rastreáveis na seção 11.
  - [x] **IMPROVE**: Confirmar que não amplia o escopo para modal ou reprodução automática.

- [x] T003 [TEST] [TDD] [US-001] Derivar o RED para falha de áudio sem bloquear o descanso em `tests/alarm-preferences.test.js` — Refs: US-001, FR-001, FR-002, NFR-001, AC-003 — Depends: none
  - [x] **PREP**: Ler AC-003 e localizar a conclusão visual atual do descanso.
  - [x] **EXECUTE**: Criar caso JSDOM com marcador SPECSFY que simula AudioContext indisponível/suspenso e exige PRONTO, mensagem de próxima série e ausência de repetição.
  - [x] **VERIFY**: Executar o caso focal e observar RED pela ausência do fallback observável.
  - [x] **EVIDENCE**: Registrar comando, saída RED e IDs rastreáveis na seção 11.
  - [x] **IMPROVE**: Confirmar que não declara sucesso sonoro, segundo plano ou tela bloqueada.

#### Fase 2 — Implementação da fatia vertical

- [x] T004 [CODE] [US-001] Implementar preferências de alerta nos dois HTMLs distribuídos — Arquivos: `index.html`, `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, FR-001, FR-002, NFR-001, AC-001, AC-002, AC-003 — Depends: T001, T002, T003
  - [x] **PREP**: Confirmar os três REDs e reconstruir a documentação com specsfy-documentator antes da alteração.
  - [x] **EXECUTE**: Alterar somente os dois HTMLs para seletor nativo Alto/Pulsado/Duplo acima do volume, defaults, persistência local, aplicação no próximo descanso e fallback visual sem repetição.
  - [x] **VERIFY**: Executar os testes TDD, conferir paridade textual dos HTMLs e inspecionar seletor/volume em viewport móvel elegível.
  - [x] **EVIDENCE**: Anexar comandos, saídas, comparação de paridade e screenshot observável à seção 11.
  - [x] **IMPROVE**: Confirmar que não há duplicação incidental a remover sem modificar o pedido literal, vibração ou garantias de segundo plano.

<!-- specsfy:evidence {"task":"T004","refs":["US-001","FR-001","FR-002","NFR-001","AC-001","AC-002","AC-003"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/alarm-preferences.test.js"],"commands":[{"run":"npm run test:tdd -- tests/alarm-preferences.test.js tests/kg-suffix.test.js tests/legacy-behaviors.test.js tests/security-output-escaping.test.js tests/verify-evidence-windows.test.js --reporter=dot","exit":0},{"run":"git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html","exit":0},{"run":"maestri portal info/evaluate (URL 127.0.0.1:41748, UA iOS, 390x844) e screenshot","exit":0}]} -->

#### Fase 3 — Documentação e regressão

- [x] T005 [DOC] [US-001] Atualizar inventário de persistência e documentação técnica após a implementação — Arquivos: `.specsfy/DATABASE.md`, `.specsfy/PACKAGES.md`, `docs/` — Refs: FR-001, FR-002, NFR-001 — Depends: T004
  - [x] **PREP**: Confirmar os valores efetivamente implementados e a fonte normativa única.
  - [x] **EXECUTE**: Executar specsfy-documentator e atualizar DATABASE de forma aditiva apenas se a implementação divergir do registro já confirmado.
  - [x] **VERIFY**: Conferir que documentação descreve preset/volume locais, defaults e limite de plataforma sem prometer execução bloqueada/em outro app.
  - [x] **EVIDENCE**: Registrar os arquivos regenerados e a validação documental na seção 11.
  - [x] **IMPROVE**: Preservar integralmente conteúdo humano e remover somente inconsistências geradas.

#### Evidência T005

- `.specsfy/DATABASE.md` passou a documentar aditivamente `alertPreferences (presetId, volume)` no objeto local do timer e o limite de PWA ativa/visível.
- `node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project .` e o mesmo comando com `--check` concluíram com exit 0 em 2026-08-28; os artefatos `docs/` e `.specsfy/PACKAGES.md` foram reconstruídos.
- Nenhum conteúdo humano foi removido e nenhum texto promete tela bloqueada, página oculta ou outro app.

- [x] T006 [TEST] [US-001] Executar regressão, rastreabilidade e gates de entrega em `tests/alarm-preferences.test.js` e `specs/defined/0003-alarme-volume-em-segundo-plano/spec.md` — Refs: US-001, FR-001, FR-002, NFR-001, AC-001, AC-002, AC-003 — Depends: T004, T005
  - [x] **PREP**: Reunir IDs T001–T005, requisitos e critérios de aceite cobertos.
  - [x] **EXECUTE**: Rodar suite Vitest, validadores da spec, monitor de contexto e evidência visual permitida pelo portal elegível.
  - [x] **VERIFY**: Confirmar todos os comandos verdes, cobertura de requisitos e ausência de PENDING no monitor.
  - [x] **EVIDENCE**: Preencher a seção 11 e calcular o Delivery Gate somente com prova reproduzível.
  - [x] **IMPROVE**: Registrar o isolamento da rastreabilidade global e manter a cadeia específica sem alterar outra spec.

#### Evidência T006

- Regressão integral declarada pelo terminal Maestro `reino_v3`: 7/7 arquivos e 42/42 testes **PASSED**, incluindo Partitura, alarme, Kg, legado, segurança e verificador Windows. Esta é a prova que sucedeu a reconciliação 13.5.
- `verify_evidence.mjs --task T004`, `validate_spec.mjs`, `validate_tasks.mjs`, `review_findings.mjs` e `verify_acceptance.mjs` passaram em 2026-08-28.
- A varredura global de `check_traceability.mjs` achou somente marcadores órfãos de outras specs já existentes. Reexecutado sobre cópia temporária exclusiva de `tests/alarm-preferences.test.js`, retornou 7/7 IDs e `RESULTADO: OK`; o diretório temporário foi removido.
- Setup e monitor de contexto foram executados no início do fechamento; a execução final do monitor abaixo é o critério para calcular o gate.

### 15. Ordem de execução

Fluxo crítico: T001, T002 e T003 → T004 → T005 → T006. Os três REDs compartilham `tests/alarm-preferences.test.js`; por isso não são paralelos. A menor fatia demonstrável é T001–T004: o seletor e o volume persistem imediatamente, não reiniciam o descanso e a próxima conclusão usa a nova preferência. T005 e T006 fecham documentação, evidência e Delivery Gate. Nenhuma tarefa autoriza garantia de áudio em tela bloqueada ou outro app, nem o item separado de vibração.

## Ato III — Entregar e validar

### 16. Dependências, riscos e suposições

#### Dependências

- BACKLOG-0002, Inbox de origem, registro “Preferências do alarme” em `.specsfy/DATABASE.md`, Web Audio/LocalStorage e Vitest/JSDOM existentes.

#### Riscos

- Navegador recusar/suspender áudio → manter conclusão visual sem falso sucesso.
- Estado inválido → Alto/0,9 sem alterar histórico.
- HTMLs divergirem → diff e testes de paridade.
- Escopo derivar para segundo plano → manter fora de suporte.

#### Suposições

- Alto preserva o padrão atual; Pulsado usa três pulsos de 950 Hz; Duplo usa pares ascendentes de 880 e 1320 Hz.
- O painel existente continua sendo o local de configuração.

### 17. Decisões

- **DEC-001**: Presets Alto, Pulsado e Duplo, todos sintetizados/offline.
- **DEC-002**: Persistir `presetId` e `volume`; defaults Alto/0,9 preservam compatibilidade.
- **DEC-003**: Suporte somente com PWA ativa e visível; bloqueio/outro app são fora de suporte.
- **DEC-004**: Seletor nativo acima do volume, fonte ≥16 px e toque ≥44 px.
- **DEC-005**: Aplicar e guardar imediatamente, somente para o próximo alarme.
- **DEC-006**: Falha de áudio mantém conclusão visual sem falso sucesso, repetição ou aviso persistente.

### 18. Definition of Done

- [x] `Definition Gate` está `Passed`.
- [x] `Plan Gate` está `Passed`.
- [x] `Delivery Gate` está `Passed`.
- [x] AC-001 a AC-003 passam.
- [x] Todos os requisitos possuem evidência.
- [x] Todas as tarefas da seção 14 estão concluídas.
- [x] HTMLs sincronizados e checks disponíveis passam.
