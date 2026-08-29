# Especificação integrada: Temporizador de isometria por série

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0007 |
| Slug | 0007-temporizador-isometria-por-serie |
| Status | Complete |
| Effort | 4 |
| Effort updated at | 2026-08-29 |
| Effort rationale | Dois HTMLs e timer concorrente. |
| Definition Gate | Passed |
| Plan Gate | Passed |
| Delivery Gate | Passed |
| Evidence Contract | 1 |
| Atualizada em | 2026-08-29 |

## Ato I — Definir
### 1. Problema e resultado
#### Problema
A prancha é uma série de 40–60 s, mas o runner só possui temporizador de descanso.
#### Resultado desejado
Em uma isometria, a pessoa ajusta, inicia e pausa o tempo da série, separado do descanso.
#### Métricas de sucesso
- Matriz Vitest cobre render, ajuste, play/pausa, limpeza e paridade.
- Portal iOS 390×844 confirma posição, tokens e alvos de 44 px.
### 2. Research e esclarecimentos
#### Researchs executados
- **R-001** [critical] Prancha e descanso existem separados? — **Verdict: verified** — **Confidence: high** — **Evidence: `index.html:956-990,1085-1091,2799-2938`** — **Budget: 0/0**. `ex-prancha` tem 2 séries de 40–60 s e descanso de 30 s; o timer atual é só de descanso.
- **R-002**: o mockup em `specs/mockups/0007-isometria-prancha-mobile.html` replica os tokens T036 em iOS 390×844.
#### Fontes e contexto consultados
- Inbox `2026-08-29-063456-play-e-ajuste-de-tempo-para-isometria.md`; backlog `0007-temporizador-isometria-por-serie.md`; os dois HTMLs; nenhuma fonte externa.
#### Documentação consultada
- `.specsfy/Spec.md`, `PROJECT.md`, `STACK.md`, `RULES.md`, `DATABASE.md` e `PACKAGES.md`.
#### Artefatos de pesquisa armazenados
- Nenhum externo; mockup local citado acima.
#### Dúvidas respondidas
- **Q**: referência? → **A**: Codex – Procurador aprovou opção 1 em 2026-08-29: cartão após vídeo/antes de último registro, 45 s, ajuste por série, play/pausa, descanso separado.
#### Dúvidas abertas
- Nenhuma.
### 3. Escopo e atores
#### Incluído
- Marcação explícita de isometria; prancha; cartão de tempo, ajuste e play/pausa nos dois HTMLs.
#### Fora de escopo
- Descanso, colunas de carga/repetições, dados remotos, deploy e produção.
#### Atores
- **Juarez**: executa a série no runner.
### 4. Princípios e restrições do projeto
- **PR-001**: paridade material; **PR-002**: estado efêmero, sem HTML de dados persistidos; **PR-003**: tokens T036 e alvos ≥44 px.
### 5. Histórias de usuário
#### US-001 — Cronometrar isometria (P1)
Como Juarez, quero ajustar e iniciar uma prancha, para completar a série com tempo visível e separado do descanso.
**Teste independente**: matriz JSDOM nos dois HTMLs. **Requisitos**: FR-001, NFR-001.
### 6. Cenários BDD de aceite
#### AC-001 — Cartão de prancha
**Cobre**: US-001, FR-001, NFR-001
```gherkin
Scenario: Exibir tempo de série
 Given que prancha é o exercício ativo
 When o runner renderiza
 Then o cartão fica após o vídeo e antes do último registro com ajuste e play
```
#### AC-002 — Ajuste e controle
**Cobre**: US-001, FR-001, NFR-001
```gherkin
Scenario: Iniciar duração ajustada
 Given prancha em 45 segundos
 When a pessoa ajusta, inicia e pausa
 Then a série usa o valor escolhido sem acionar descanso
```
#### AC-003 — Isolamento
**Cobre**: US-001, FR-001, NFR-001
```gherkin
Scenario: Limpar ao trocar de exercício
 Given uma isometria em andamento
 When a pessoa troca de exercício
 Then o intervalo é limpo, não há cartão no não-isométrico e séries não mudam
```
### 7. Requisitos
#### Funcionais
- **FR-001**: Identificar isometria e oferecer duração inicial de 45 s, ajuste por série e play/pausa no cartão aprovado.
#### Não funcionais
- **NFR-001**: Manter paridade material, tokens T036 e controles ≥44×44 px. **Verificação**: matriz JSDOM, diff material e portal iOS.
#### Erros e casos-limite
- Duração inválida não inicia; troca/saída limpa o intervalo.

## Ato II — Projetar e provar
### 8. Plano técnico
- Modelo: `isometric` e `isometricSeconds` na prancha; estado transitório separado de `runnerRest*`.
- View: cartão por DOM após vídeo/antes do record; ajuste, iniciar, pausar, tick e limpeza ao navegar/sair.
- Arquivos: `index.html`, `treino_hibrido_juarez_v3_standalone.html`, `tests/isometric-timer.test.js`.
- Migrations, APIs, jobs e repositórios: não aplicáveis.
### 9. Modelo de dados
| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| Exercício | `id` | `isometric`, `isometricSeconds` | ativo |
| Timer | exercício ativo | restante, rodando, intervalo único; efêmero | não afeta descanso |
### 10. Interfaces e contratos
- APIs e eventos externos: nenhum.
### 11. Estratégia TDD
- Vitest/JSDOM: AC-001 render; AC-002 ajuste/play/pausa; AC-003 limpeza/paridade, cada um com `SPECSFY:` próprio.
| IDs | BDD | Teste | RED | GREEN | Refactor |
| --- | --- | --- | --- | --- | --- |
| US-001, FR-001, NFR-001, AC-001 | AC-001 | cartão | 2026-08-29: 6 falhas por cartão ausente | 2026-08-29: 6/6 focal verde | Paridade e regressão 69/69 |
| US-001, FR-001, NFR-001, AC-002 | AC-002 | controle | 2026-08-29: controle ausente | 2026-08-29: ajuste 45→50, tick 49 e pausa verde | Descanso inalterado no teste |
| US-001, FR-001, NFR-001, AC-003 | AC-003 | isolamento | 2026-08-29: cartão ausente | 2026-08-29: troca oculta cartão verde | Paridade e regressão 69/69 |
### 12. Plano de testes e rastreabilidade
| Requisito | Cenário BDD | Nível | Arquivo/comando | Evidência |
| --- | --- | --- | --- | --- |
| FR-001, NFR-001 | AC-001 | Integração JSDOM | `tests/isometric-timer.test.js` | Passed — focal 6/6 nas duas variantes; cartão após vídeo. |
| FR-001, NFR-001 | AC-002 | Integração JSDOM | `tests/isometric-timer.test.js` | Passed — ajuste 45→50, tick para 49, pausa e descanso inalterado. |
| FR-001, NFR-001 | AC-003 | Integração JSDOM | `tests/isometric-timer.test.js` | Passed — troca oculta o cartão; regressão 69/69 e paridade aprovadas. |
### 13. Validações
- Definition: Passed em 2026-08-29 — `validate_spec.mjs specs/draft/0007-temporizador-isometria-por-serie/spec.md --allow-draft` retornou `VALID DRAFT`; revisão PROD/ARCH/SEC não encontrou P1 aberto. Cobertura: US-001, FR-001 e NFR-001 possuem AC-001 a AC-003.
- Plan: Passed em 2026-08-29 — `validate_tasks.mjs specs/defined/0007-temporizador-isometria-por-serie/spec.md --allow-draft` retornou `VALID DRAFT` com 5/5 tarefas e 25/25 checklists.
- Delivery: Passed em 2026-08-29 — focal 6/6; regressão local 69/69; aceite Passed; full-chain 6/6 OK; evidence strict Passed; reviews Passed; docs check e monitor CURRENT; paridade, diff e portal iOS 390×844 aprovados.
### 14. Tarefas
- [x] T001 [TEST] [TDD] [US-001] AC-001 em `tests/isometric-timer.test.js` — Refs: US-001, FR-001, NFR-001, AC-001 — Depends: none
  - [x] **PREP**: BDD de posição e tokens confirmado.
  - [x] **EXECUTE**: Caso `SPECSFY:` criado sem produção.
  - [x] **VERIFY**: RED real por cartão ausente observado.
  - [x] **EVIDENCE**: Focal inicial exit 1; GREEN focal exit 0.
  - [x] **IMPROVE**: Matriz cobre ambas variantes.
- [x] T002 [TEST] [TDD] [US-001] AC-002 em `tests/isometric-timer.test.js` — Refs: US-001, FR-001, NFR-001, AC-002 — Depends: none
  - [x] **PREP**: Regra 45 s, ajuste, pausa e descanso separado confirmada.
  - [x] **EXECUTE**: Caso comportamental `SPECSFY:` criado.
  - [x] **VERIFY**: RED de controle ausente e GREEN de 45→50→49/pausa observados.
  - [x] **EVIDENCE**: Focal exit 0 após implementação.
  - [x] **IMPROVE**: Regressão não alterou descanso.
- [x] T003 [TEST] [TDD] [US-001] AC-003 em `tests/isometric-timer.test.js` — Refs: US-001, FR-001, NFR-001, AC-003 — Depends: none
  - [x] **PREP**: Isolamento na troca confirmado.
  - [x] **EXECUTE**: Caso `SPECSFY:` criado.
  - [x] **VERIFY**: RED por cartão ausente e GREEN de ocultação observados.
  - [x] **EVIDENCE**: Focal exit 0 nas duas variantes.
  - [x] **IMPROVE**: Paridade integral confirmada.
- [x] T004 [CODE] [US-001] Implementar timer em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, FR-001, NFR-001, AC-001, AC-002, AC-003 — Depends: T001, T002, T003
  - [x] **PREP**: REDs e documentator executados.
  - [x] **EXECUTE**: Marca, cartão, ajuste, play/pausa, tick e limpeza implementados.
  - [x] **VERIFY**: Focal 6/6 e regressão 69/69 verdes.
  - [x] **EVIDENCE**: Paridade e diff aprovados.
  - [x] **IMPROVE**: Alvos corrigidos para 44 px.
  <!-- specsfy:evidence {"task":"T004","refs":["US-001","FR-001","NFR-001","AC-001","AC-002","AC-003"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/isometric-timer.test.js"],"commands":[{"run":"npm run test:tdd -- tests/isometric-timer.test.js --reporter=dot --testTimeout=10000 --hookTimeout=5000","exit":0},{"run":"npm run test:tdd -- --exclude tests/partitura/** --reporter=dot --testTimeout=10000 --hookTimeout=5000","exit":0},{"run":"git diff --check","exit":0},{"run":"git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html","exit":0}]} -->
- [x] T005 [TEST] Qualidade e Delivery em `spec.md` — Refs: US-001, FR-001, NFR-001, AC-001, AC-002, AC-003 — Depends: T004
  - [x] **PREP**: Focal, regressão, validators, monitor e portal identificados.
  - [x] **EXECUTE**: Docs, checks e portal iOS 390×844 executados.
  - [x] **VERIFY**: Aceite e rastreabilidade executados.
  - [x] **EVIDENCE**: Screenshot `maestri-portal-32cc2f10-2470-49e5-a3aa-d691be100857.png` e riscos registrados.
  - [x] **IMPROVE**: Sem mudança de stack ou banco; RULES foi revisado pelo monitor.
### 15. Ordem de execução
- Caminho crítico: T001/T002/T003 → T004 → T005.
- Tarefas paralelas: T001, T002 e T003 podem ser escritas juntas, mas compartilham o mesmo arquivo e serão executadas de forma serial.
- Estratégia de MVP: cartão de prancha com 45 s, ajuste e play/pausa, isolado do descanso.

## Ato III — Entregar e validar
### 16. Dependências, riscos e suposições
- Dependência: mockup aprovado pelo Codex – Procurador.
- Risco: dois timers concorrentes; mitigação: estado separado e testes de não interferência.
- Suposição aprovada: ajuste efêmero e 45 s inicial.
### 17. Decisões
- **DEC-001**: cartão próprio após vídeo, 45 s, ajuste por série e play/pausa; descanso separado — Codex – Procurador, 2026-08-29.
### 18. Definition of Done
- [x] Definition, Plan e Delivery Gates Passed.
- [x] ACs, requisitos, tarefas, testes e checks possuem evidência.
