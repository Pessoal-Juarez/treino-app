# Especificação integrada: Persistir manter tela ligada

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0010 |
| Slug | 0010-manter-tela-ligada |
| Status | Complete |
| Effort | 3 |
| Effort updated at | 2026-08-29 |
| Effort rationale | Persistência local e ciclo de vida Wake Lock em duas variantes. |
| Definition Gate | Passed |
| Plan Gate | Passed |
| Delivery Gate | Passed |
| Evidence Contract | 1 |
| Atualizada em | 2026-08-29 |

## Ato I — Definir
### 1. Problema e resultado
#### Problema
"O check box para ligar a opção de manter tela ligada no treino não está salvando, sempre que fechou e abro novamente ele está desmarcado."
#### Resultado desejado
Juarez escolhe a opção em Ajustes e, ao reabrir o aplicativo, vê a mesma escolha; durante treino, a preferência tenta manter a tela ativa quando o navegador suporta Wake Lock.
#### Métricas de sucesso
- A preferência restaura em ambas as variantes sem alterar sessões, perfil ou equipamento.
### 2. Research e esclarecimentos
#### Researchs executados
- **R-001**: `keepAwakeToggle` chama `toggleWakeLock(this.checked)`, mas não altera `state` nem chama `persist`; impacto: a escolha se perde na recarga.
#### Fontes e contexto consultados
- `index.html` e `treino_hibrido_juarez_v3_standalone.html`, funções `loadState`, `persist` e `toggleWakeLock`.
#### Documentação consultada
- Nenhuma fonte externa.
#### Artefatos de pesquisa armazenados
- Nenhum artefato externo.
#### Dúvidas respondidas
- **Q**: onde fica a escolha? → **A**: Ajustes, no checkbox existente "Manter Tela Ligada no Treino".
#### Dúvidas abertas
- Nenhuma.
### 3. Escopo e atores
#### Incluído
- Persistir/restaurar a preferência no estado local existente, sincronizar o checkbox e aplicar/remover Wake Lock sem quebrar navegadores sem suporte.
#### Fora de escopo
- Garantia de Wake Lock em sistema bloqueado, nova permissão, rede, perfil remoto ou mudança de layout.
#### Atores
- **Juarez**: controla a preferência no próprio dispositivo.
### 4. Princípios e restrições do projeto
- **PR-001**: a preferência é local, reversível e não altera histórico, perfil, equipamento ou séries.
- **PR-002**: paridade funcional entre os dois HTMLs e alvos/tokens existentes preservados.
### 5. Histórias de usuário
#### US-001 — Lembrar tela ligada (P1)
Como Juarez, quero que a opção de manter a tela ligada seja lembrada, para não ter de ativá-la a cada uso.
**Teste independente**: marcar, criar nova janela com o mesmo estado e conferir checkbox/restauração.
**Requisitos**: FR-001, FR-002, FR-003.
### 6. Cenários BDD de aceite
#### AC-001 — Persistir escolha
**Cobre**: US-001, FR-001, FR-002, FR-003, NFR-001
```gherkin
Scenario: marcar manter tela ligada
 Given Ajustes aberto com a opção desmarcada
 When Juarez marca a opção
 Then a preferência local é persistida e o Wake Lock é solicitado se disponível
```
#### AC-002 — Restaurar ao reabrir
**Cobre**: US-001, FR-001, FR-002, FR-003, NFR-001
```gherkin
Scenario: reabrir aplicativo
 Given a preferência local marcada
 When Juarez abre nova janela do aplicativo
 Then o checkbox aparece marcado sem alterar outros dados salvos
```
#### AC-003 — Sem suporte ou desmarcação
**Cobre**: US-001, FR-001, FR-002, FR-003, NFR-001
```gherkin
Scenario: navegador sem Wake Lock ou desmarcação
 Given navegador sem Wake Lock ou sentinela ativa
 When Juarez marca ou desmarca a opção
 Then a interface não falha e a preferência é guardada ou removida corretamente
```
### 7. Requisitos
#### Funcionais
- **FR-001**: marcar/desmarcar deve atualizar `state.keepAwakeEnabled` e persistir uma vez por ação.
- **FR-002**: `loadState` deve normalizar a preferência ausente como falsa e o início deve sincronizar o checkbox.
- **FR-003**: Wake Lock deve ser solicitado somente quando habilitado/suportado e liberado ao desabilitar, sem lançar erro ao usuário.
#### Não funcionais
- **NFR-001**: nenhuma outra chave/parte do estado é sobrescrita; ambos os HTMLs têm comportamento equivalente. **Verificação**: Vitest/JSDOM e comparação material.
#### Erros e casos-limite
- API indisponível/rejeitada → preferência permanece visível e persistida, sem exceção não tratada.

## Ato II — Projetar e provar
### 8. Plano técnico
- Adicionar `keepAwakeEnabled` ao estado normalizado, criar `updateKeepAwakePreference`, sincronizar o checkbox no bootstrap e reutilizar `toggleWakeLock` como efeito seguro nos dois HTMLs.
### 9. Modelo de dados
| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| Estado local | `treino_hibrido_juarez_v5` | `keepAwakeEnabled:boolean`, ausente equivale a `false` | preserva sessões/perfil |
### 10. Interfaces e contratos
- Checkbox `#keepAwakeToggle` mantém sua posição e passa a chamar handler de preferência; nenhuma API externa é usada.
### 11. Estratégia TDD
- Vitest/JSDOM em `tests/keep-awake-preference.test.js`, com três marcadores próprios; RED anterior ao código.
| IDs | RED | GREEN | Regressão |
| --- | --- | --- | --- |
| AC-001 | 2026-08-29 — `npm run test:tdd -- tests/keep-awake-preference.test.js --reporter=verbose --testTimeout=5000` (exit 1): `index.html` e `treino_hibrido_juarez_v3_standalone.html` excederam a espera pela gravação canônica; o handler atual só chama Wake Lock. | 2026-08-29 — mesmo comando (exit 0): 7/7; `change` do `#keepAwakeToggle` grava apenas `keepAwakeEnabled` no objeto canônico e preserva sessão, perfil, preferências, equipamento e importações. | `npm run test:tdd -- tests/keep-awake-preference.test.js tests/alarm-preferences.test.js tests/legacy-behaviors.test.js --reporter=verbose --testTimeout=5000` (exit 0, 28/28) |
| AC-002 | 2026-08-29 — mesmo RED (exit 1): ambas as variantes excederam a espera pela persistência antes de recriar a janela; portanto não há restauração observável. | 2026-08-29 — mesmo comando focal (exit 0): 7/7; nova JSDOM com o JSON transferido restaura `checked=true` e, após desmarcar, `checked=false`. | `npm run test:tdd -- tests/keep-awake-preference.test.js tests/alarm-preferences.test.js tests/legacy-behaviors.test.js --reporter=verbose --testTimeout=5000` (exit 0, 28/28) |
| AC-003 | 2026-08-29 — mesmo RED (exit 1): ambas as variantes tentaram ler estado canônico nulo após Wake Lock ausente; a preferência não é gravada. | 2026-08-29 — mesmo comando focal (exit 0): 7/7; Wake Lock ausente/rejeitada preserva a preferência e desmarcar libera uma sentinela presente. | `npm run test:tdd -- tests/keep-awake-preference.test.js tests/alarm-preferences.test.js tests/legacy-behaviors.test.js --reporter=verbose --testTimeout=5000` (exit 0, 28/28) |
### 12. Plano de testes e rastreabilidade
| Requisito | Cenário BDD | Nível | Arquivo/comando esperado | Evidência |
| --- | --- | --- | --- | --- |
| FR-001, FR-003 | AC-001 | JSDOM | tests/keep-awake-preference.test.js | Passed — focal 7/7 em ambas as variantes. |
| FR-001, FR-002 | AC-002 | JSDOM | tests/keep-awake-preference.test.js | Passed — restauração marcada/desmarcada em nova JSDOM. |
| FR-001, FR-003, NFR-001 | AC-003 | JSDOM | tests/keep-awake-preference.test.js | Passed — capability ausente/rejeitada, liberação e paridade material. |
### 13. Validações
- Definition Passed em 2026-08-29: `validate_spec.mjs --allow-draft` retornou `VALID DRAFT`; revisão semântica confirmou uma preferência local única, três ACs e limites de Wake Lock. RED dos predecessores T001–T003 em 2026-08-29: `npm run test:tdd -- tests/keep-awake-preference.test.js --reporter=verbose --testTimeout=5000` retornou exit 1, com 6 falhas comportamentais esperadas em duas variantes e 1 checagem de paridade do bloco anterior aprovada. Plan Passed em 2026-08-29: `validate_tasks.mjs specs/defined/0010-manter-tela-ligada/spec.md` retornou `READY` (5 tarefas, 3 TDD concluídas, 15/25 checklists, 8/8 IDs). T004 GREEN em 2026-08-29: focal 7/7 e regressão relacionada 28/28, ambas exit 0; documentação reconstruída e `build_documentation.mjs --check` exit 0. Ajuste visual posterior teve RED de 44 px nas duas variantes e GREEN focal 7/7. T005/Delivery Passed em 2026-08-29: regressão serializada de produto 14 arquivos/105 testes exit 0; rastreabilidade 8/8, QA, spec, tarefas e reviews aprovados; paridade material coberta pelo focal e a evidência iOS está em `research/`. Limitação de infraestrutura: `monitor_context.mjs --check` falha em `spawnSync("git")` antes de avaliar pendências; a equivalência direta `git diff --check`, `git status --short`, documentação `--check` e validadores da spec passaram, sem PENDING de produto.
### 14. Tarefas
- [x] T001 [TEST] [TDD] [US-001] RED de marcação em `tests/keep-awake-preference.test.js` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-001 — Depends: none
  - [x] **PREP**: Confirmado AC-001 e que `#keepAwakeToggle` chamava somente `toggleWakeLock`.
  - [x] **EXECUTE**: Materializado o caso que marca o checkbox real e dispara `change` em ambas as variantes.
  - [x] **VERIFY**: Observado RED: espera pela escrita em `treino_hibrido_juarez_v5` excedida nos dois HTMLs.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/keep-awake-preference.test.js --reporter=verbose --testTimeout=5000` — exit 1, 6 falhas e 1 aprovação.
  - [x] **IMPROVE**: O oráculo verifica o campo `keepAwakeEnabled` na fonte canônica e a ausência de chave paralela.
- [x] T002 [TEST] [TDD] [US-001] RED de restauração em `tests/keep-awake-preference.test.js` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-002 — Depends: none
  - [x] **PREP**: Confirmado AC-002 e a necessidade de transferir o valor bruto do LocalStorage para uma nova JSDOM.
  - [x] **EXECUTE**: Materializado o ciclo marcar, recriar, desmarcar e recriar em ambas as variantes.
  - [x] **VERIFY**: Observado RED: ambas excederam a espera pela persistência antes da primeira recriação.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/keep-awake-preference.test.js --reporter=verbose --testTimeout=5000` — exit 1, falhas de AC-002 em `index.html` e standalone.
  - [x] **IMPROVE**: O teste usa transferência explícita do JSON canônico, sem simular uma chave nova.
- [x] T003 [TEST] [TDD] [US-001] RED de API ausente/desmarcação em `tests/keep-awake-preference.test.js` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-003 — Depends: none
  - [x] **PREP**: Confirmado AC-003 para Wake Lock ausente e `request()` rejeitada.
  - [x] **EXECUTE**: Materializados os dois modos de capability e a expectativa de UI íntegra com preferência gravada.
  - [x] **VERIFY**: Observado RED: o estado canônico permaneceu nulo nas duas variantes, comprovando ausência da gravação.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/keep-awake-preference.test.js --reporter=verbose --testTimeout=5000` — exit 1, 6 falhas comportamentais.
  - [x] **IMPROVE**: A espera é por condição de estado, sem atraso fixo; a checagem de paridade do bloco antigo permaneceu verde.
- [x] T004 [CODE] [US-001] Implementar preferência em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-001, AC-002, AC-003 — Depends: T001, T002, T003
  - [x] **PREP**: Confirmados os REDs T001–T003 e a paridade do contrato material nas duas variantes.
  - [x] **EXECUTE**: Implementados normalização booleana no estado canônico, handler `updateKeepAwakePreference` e sincronização de `#keepAwakeToggle`, preservando `toggleWakeLock` como efeito seguro.
  - [x] **VERIFY**: Focal 7/7 e regressão relacionada 28/28, ambos exit 0, cobriram gravação, restauração, desmarcação/liberação, falha segura e paridade; RED visual posterior e GREEN 7/7 elevaram o alvo a 44 px.
  - [x] **EVIDENCE**: Comandos e arquivos constam no comentário `specsfy:evidence`; documentação reconstruída e `--check` retornou exit 0.
  - [x] **IMPROVE**: Nenhuma abstração adicional foi necessária; o booleano é normalizado em um único ponto, o efeito Wake Lock segue separado e o próprio controle agora expõe alvo mínimo de 44 px.
  <!-- specsfy:evidence {"task":"T004","refs":["US-001","FR-001","FR-002","FR-003","NFR-001","AC-001","AC-002","AC-003"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/keep-awake-preference.test.js"],"commands":[{"run":"npm run test:tdd -- tests/keep-awake-preference.test.js --reporter=verbose --testTimeout=5000","exit":0},{"run":"npm run test:tdd -- tests/keep-awake-preference.test.js tests/alarm-preferences.test.js tests/legacy-behaviors.test.js --reporter=verbose --testTimeout=5000","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0},{"run":"git diff --check","exit":0}]} -->
- [x] T005 [TEST] Regressão, visual e gates em `tests/keep-awake-preference.test.js` e `spec.md` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-001, AC-002, AC-003 — Depends: T004
  - [x] **PREP**: Identificados runner serializado sem Partitura, validações Specsfy, paridade material, evidência iOS e critérios de staging seletivo.
  - [x] **EXECUTE**: Executados regressão de produto, focal, rastreabilidade, aceite, evidência strict, revisões, validações, documentação e checagem de diff.
  - [x] **VERIFY**: Produto passou 14 arquivos/105 testes; rastreabilidade 8/8, QA, spec, tarefas e reviews passaram; visual real confirmou restauração, 44×44 e ausência de overflow.
  - [x] **EVIDENCE**: Resultados, captura PNG 390×844 e limitações de infraestrutura estão registrados nesta spec e em `research/`.
  - [x] **IMPROVE**: A validação visual encontrou `width:auto`; foi corrigido por RED→GREEN antes do Delivery Gate, sem nova chave ou escopo adicional.
  <!-- specsfy:evidence {"task":"T005","refs":["US-001","FR-001","FR-002","FR-003","NFR-001","AC-001","AC-002","AC-003"],"files":["tests/keep-awake-preference.test.js","specs/in-progress/0010-manter-tela-ligada/spec.md","specs/in-progress/0010-manter-tela-ligada/research/2026-08-29-ios-390x844-keep-awake.md","specs/in-progress/0010-manter-tela-ligada/research/2026-08-29-ios-390x844-keep-awake.png"],"commands":[{"run":"npm run test:tdd -- tests --exclude tests/partitura/** --reporter=dot --testTimeout=10000 --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":0},{"run":"node .agents/skills/specsfy-06-tdd-bdd/scripts/check_traceability.mjs specs/in-progress/0010-manter-tela-ligada/spec.md tests --full-chain --allow-orphans","exit":0},{"run":"node .agents/skills/specsfy-06-tdd-bdd/scripts/verify_acceptance.mjs specs/in-progress/0010-manter-tela-ligada/spec.md .","exit":0},{"run":"node .agents/skills/specsfy-04-validate/scripts/review_findings.mjs specs/in-progress/0010-manter-tela-ligada/spec.md --root .","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0},{"run":"git diff --check","exit":0}]} -->
### 15. Ordem de execução
- T001/T002/T003 → T004 → T005.

## Ato III — Entregar e validar
### 16. Dependências, riscos e suposições
- Wake Lock é capability opcional do navegador; desmarcar sempre libera uma sentinela existente.
### 17. Decisões
- **DEC-001**: usar o estado local existente em vez de chave nova — preserva compatibilidade e evita dados paralelos.
### 18. Definition of Done
- [x] Gates, tarefas, três ACs, paridade, visual e commit local seletivo comprovados.
