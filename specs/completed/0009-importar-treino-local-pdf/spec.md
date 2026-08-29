# Especificação integrada: Importar treino local por PDF
| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0009 |
| Slug | 0009-importar-treino-local-pdf |
| Status | Complete |
| Effort | 6 |
| Effort updated at | 2026-08-29 |
| Effort rationale | Parser local, segurança, paridade e regressão. |
| Definition Gate | Passed |
| Plan Gate | Passed |
| Delivery Gate | Passed |
| Evidence Contract | 1 |
| Atualizada em | 2026-08-29 |

## Ato I — Definir
### 1. Problema e resultado
#### Problema
TXT/texto não cobre a ficha disponível em PDF.
#### Resultado desejado
Juarez seleciona PDF textual local, revisa a prévia e confirma adição sem alterar plano existente, histórico, perfil ou equipamento.
#### Métricas de sucesso
- PDF válido usa a prévia existente e só grava após Confirmar.
### 2. Research e esclarecimentos
#### Researchs executados
- **R-001**: FileReader não extrai PDF confiavelmente; `pdfjs-dist@5.4.54` foi instalado localmente.
#### Fontes e contexto consultados
- SPEC-0008, dois HTMLs, package.json e node_modules locais.
#### Documentação consultada
- Metadados locais de pdfjs-dist 5.4.54.
#### Artefatos de pesquisa armazenados
- `research/2026-08-29-visual-ios-390x844.md` — inspeção móvel local do modal PDF.
#### Dúvidas respondidas
- **Q**: parser? → **A**: Juarez, opção 2, 2026-08-29: versão fixa local, sem CDN/upload/API paga/rede runtime.
#### Dúvidas abertas
- Nenhuma.
### 3. Escopo e atores
#### Incluído
- PDF textual local, extração pdfjs-dist, prévia/Cancelar/Confirmar da SPEC-0008 e persistência isolada aditiva.
#### Fora de escopo
- OCR, PDF escaneado, senha, upload, rede, substituição e edição.
#### Atores
- **Juarez**: importa no próprio dispositivo.
### 4. Princípios e restrições do projeto
- **PR-001**: processamento integral no navegador, bundle local sem CDN/rede runtime.
- **PR-002**: erro/JSON/markup não gravam nem criam HTML.
- **PR-003**: 16 px, ações 44 px, T036 e paridade.
### 5. Histórias de usuário
#### US-001 — Importar ficha PDF (P1)
Como Juarez, quero revisar uma ficha PDF local antes de adicioná-la, para não recriar o treino manualmente.
**Teste independente**: confirmar PDF válido e encontrá-lo após recarga. **Requisitos**: FR-001, FR-002, FR-003.
### 6. Cenários BDD de aceite
#### AC-001 — Prévia PDF
**Cobre**: US-001, FR-001, FR-002, FR-003, NFR-001
```gherkin
Scenario: PDF textual válido
 Given um PDF local com Dia e Exercício
 When Juarez o seleciona
 Then vê prévia sem escrita
```
#### AC-002 — Confirmação aditiva
**Cobre**: US-001, FR-001, FR-002, FR-003, NFR-001
```gherkin
Scenario: confirmar PDF revisado
 Given prévia PDF válida e dados existentes
 When Juarez confirma
 Then o treino persiste uma vez e restaura após recarga
```
#### AC-003 — Rejeição segura
**Cobre**: US-001, FR-001, FR-002, FR-003, NFR-001
```gherkin
Scenario: PDF inválido ou sem texto útil
 Given arquivo inválido, corrompido ou sem Dia e Exercício
 When Juarez o seleciona
 Then vê erro local sem persistência
```
### 7. Requisitos
#### Funcionais
- **FR-001**: aceitar PDF local e extrair texto via pdfjs-dist local antes da prévia.
- **FR-002**: confirmar reutiliza a chave isolada, união, deduplicação e restauração da SPEC-0008.
- **FR-003**: falha, PDF sem formato, duplicata e markup não mudam estado nem viram HTML.
#### Não funcionais
- **NFR-001**: sem CDN/rede runtime; 16 px, 44 px, 390×844 e paridade. **Verificação**: Vitest, diff e portal.
#### Erros e casos-limite
- PDF escaneado/sem texto/senha/corrompido → erro claro, zero escrita.

## Ato II — Projetar e provar
### 8. Plano técnico
- Input PDF lê ArrayBuffer; pdfjs-dist local concatena texto de páginas e encaminha ao parser textual seguro existente nos dois HTMLs.
### 9. Modelo de dados
| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| PDF transitório | arquivo local | texto só em memória; treino somente após confirmar | chave importada existente |
### 10. Interfaces e contratos
- `accept` inclui `.pdf,application/pdf`; nenhuma API externa ou worker CDN.
### 11. Estratégia TDD
- Vitest/JSDOM em `tests/workout-import-pdf.test.js`, RED antes da produção.
| IDs | RED | GREEN | Regressão |
| --- | --- | --- | --- |
| AC-001 | 2026-08-29: input/artefato local ausente em ambas as variantes | GREEN: seleção PDF textual concatena páginas em ordem e preenche a prévia | `npm run test:tdd -- tests/workout-import-pdf.test.js tests/workout-import.test.js --reporter=dot --testTimeout=5000` exit 0, 29/29 |
| AC-002 | 2026-08-29: leitura/fluxo de confirmação ausentes em ambas as variantes | GREEN: PDF confirmado grava só a chave isolada e preserva quatro valores protegidos byte a byte | mesmo comando, exit 0, 29/29 |
| AC-003 | 2026-08-29: mensagem local e rejeição ausentes em ambas as variantes | GREEN: PDF criptografado, ilegível ou sem camada textual informa erro local e não grava | mesmo comando, exit 0, 29/29 |
### 12. Plano de testes e rastreabilidade
| Requisito | Cenário BDD | Nível | Arquivo/comando esperado | Evidência |
| --- | --- | --- | --- | --- |
| FR-001, NFR-001 | AC-001 | JSDOM | tests/workout-import-pdf.test.js | Passed — GREEN 2026-08-29, PDF textual local/páginas em ordem, artefato relativo e sem CDN |
| FR-001, FR-002 | AC-002 | JSDOM | tests/workout-import-pdf.test.js | Passed — GREEN 2026-08-29, confirmação aditiva e quatro valores protegidos inalterados |
| FR-001, FR-003, NFR-001 | AC-003 | JSDOM | tests/workout-import-pdf.test.js | Passed — GREEN 2026-08-29, erro local e zero persistência |
### 13. Validações
- Definition Passed em 2026-08-29: validate_spec draft VALID e reviews Passed; contrato PDF local, limites e três ACs distintos cobrem US/FR/NFR.
- Plan Passed em 2026-08-29: T001–T003 possuem RED ético 6/6 contra as duas variantes e dependem somente do código T004.
- RED em 2026-08-29: `npm run test:tdd -- tests/workout-import-pdf.test.js --reporter=dot --testTimeout=5000` exit 1, 6 falhas nos dois HTMLs: input PDF, função de leitura e erro local ausentes; nenhuma produção foi alterada.
- RED fortalecido em 2026-08-29: o mesmo comando, após matriz comportamental, exit 1, 8 falhas: seletor PDF, extração, confirmação isolada, erro local e artefato relativo ausentes nas duas variantes; nenhuma produção foi alterada antes dessa execução.
- GREEN T004 em 2026-08-29: `npm run test:tdd -- tests/workout-import-pdf.test.js tests/workout-import.test.js --reporter=dot --testTimeout=5000` exit 0, 2 arquivos/29 testes. Avisos não-falhantes do JSDOM: `Window.scrollTo` não implementado em dois testes TXT preexistentes.
- Paridade material: o teste `PDF import block stays functionally identical in both HTML variants` compara literalmente o bloco entre `IMPORTED_WORKOUTS_KEY` e `/* SERVICE WORKER */` e passou no GREEN.
- Artefatos locais: `vendor/pdfjs-dist-5.4.54/pdf.min.mjs`, `pdf.worker.min.mjs` e `LICENSE`, originados de `pdfjs-dist@5.4.54`; `README.md` registra origem, versão e licença. Ambos os HTMLs usam somente caminho relativo. A variante standalone mantém os artefatos irmãos no workspace; o portal `file:` carregou `getLocalPdfJs()` e retornou `version: 5.4.54`, sem depender de `node_modules`, CDN ou URL remota em runtime.
- Visual iOS em 2026-08-29: portal local em 390×844 confirmou um seletor único, textarea 16 px e ações Ver prévia/Confirmar/Cancelar em 302×44 px. Snapshot/DOM salvo em `research/2026-08-29-visual-ios-390x844.md`; captura PNG indisponível porque a janela do portal estava minimizada.
- Regressão de produto em 2026-08-29: 13 arquivos não-Partitura serializados com `--maxWorkers=1 --fileParallelism=false --testTimeout=15000`, exit 0. A execução global paralela falhou somente por testes Partitura sem terminal Maestro e timeouts de concorrência de testes preexistentes; não foi atribuída à SPEC-0009.
- Limitação de ferramenta: `monitor_context.mjs --check` falha antes de avaliar o projeto porque seu processo-filho `git` recebe `spawnSync` sem `stderr` neste terminal Windows. `git status --short` foi executado diretamente e confirmou worktree preexistente ampla; a limitação fica registrada para T005, sem mudar o estado do produto.
- Validação final focal em 2026-08-29: `validate_spec` READY; `validate_tasks` READY; `check_traceability --full-chain --allow-orphans` OK (marcadores externos preservados); `verify_acceptance` PASSED; `verify_evidence --task T004` strict PASSED; `review_findings` PASSED; `build_documentation --check` exit 0.
- Delivery Passed em 2026-08-29: T001–T005, requisitos, três ACs, segurança local, paridade, documentação e visual focal possuem evidência. `verify_repo` global permanece FAILED exclusivamente por pesquisas ausentes em três specs completadas preexistentes; a checagem focal desta SPEC passou e essa limitação global não foi ocultada.
### 14. Tarefas
- [x] T001 [TEST] [TDD] [US-001] RED PDF válido em tests/workout-import-pdf.test.js — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-001 — Depends: none
  - [x] **PREP**: AC-001 confirmado.
  - [x] **EXECUTE**: Caso materializado.
  - [x] **VERIFY**: RED 6 falhas.
  - [x] **EVIDENCE**: comando registrado na seção 13.
  - [x] **IMPROVE**: oráculo comportamental.
- [x] T002 [TEST] [TDD] [US-001] RED confirmação PDF em tests/workout-import-pdf.test.js — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-002 — Depends: none
  - [x] **PREP**: AC-002 confirmado.
  - [x] **EXECUTE**: Caso materializado.
  - [x] **VERIFY**: RED 6 falhas.
  - [x] **EVIDENCE**: comando registrado na seção 13.
  - [x] **IMPROVE**: isolamento coberto.
- [x] T003 [TEST] [TDD] [US-001] RED erro PDF em tests/workout-import-pdf.test.js — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-003 — Depends: none
  - [x] **PREP**: AC-003 confirmado.
  - [x] **EXECUTE**: Caso materializado.
  - [x] **VERIFY**: RED 6 falhas.
  - [x] **EVIDENCE**: comando registrado na seção 13.
  - [x] **IMPROVE**: zero escrita coberta.
- [x] T004 [CODE] [US-001] Integrar PDF local em `index.html`, `treino_hibrido_juarez_v3_standalone.html`, `vendor/pdfjs-dist-5.4.54/` e `tests/workout-import-pdf.test.js` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-001, AC-002, AC-003 — Depends: T001, T002, T003
  - [x] **PREP**: RED fortalecido de 8 falhas registrado na seção 13.
  - [x] **EXECUTE**: Integração mínima local nos dois HTMLs, com parser/worker/license fixos em `vendor/pdfjs-dist-5.4.54/`.
  - [x] **VERIFY**: Focal PDF + regressão TXT/texto 2 arquivos/29 testes exit 0; paridade material coberta por teste.
  - [x] **EVIDENCE**: GREEN, aviso JSDOM e arquivos registrados na seção 13.
  - [x] **IMPROVE**: Fluxo TXT/PDF único, leitura por função nomeada e erro local claro; nenhuma refatoração adicional necessária com a suíte verde.
<!-- specsfy:evidence {"task":"T004","refs":["US-001","FR-001","FR-002","FR-003","NFR-001","AC-001","AC-002","AC-003"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/workout-import-pdf.test.js","tests/workout-import.test.js","vendor/pdfjs-dist-5.4.54/pdf.min.mjs","vendor/pdfjs-dist-5.4.54/pdf.worker.min.mjs","vendor/pdfjs-dist-5.4.54/LICENSE","vendor/pdfjs-dist-5.4.54/README.md"],"commands":[{"run":"npm run test:tdd -- tests/workout-import-pdf.test.js tests/workout-import.test.js --reporter=dot --testTimeout=5000","exit":0}]} -->
- [x] T005 [TEST] Regressão e gates em `tests/workout-import-pdf.test.js` e `spec.md` — Refs: US-001, FR-001, FR-002, FR-003, NFR-001, AC-001, AC-002, AC-003 — Depends: T004
  - [x] **PREP**: Suites focais, regressão de produto, acceptance, traceability, evidence, docs, monitor e revisão identificados.
  - [x] **EXECUTE**: Focal PDF/TXT 29/29, regressão produto serializada 13 arquivos exit 0, validadores e visual executados.
  - [x] **VERIFY**: Cadeia focal completa sem gap; falhas globais preexistentes de Partitura/pesquisa separadas na seção 13.
  - [x] **EVIDENCE**: Comandos, saídas, portal iOS, artefatos e limitação do monitor registrados na seção 13.
  - [x] **IMPROVE**: Execução serializada distinguiu os timeouts de paralelismo do comportamento do produto; nenhuma mudança adicional necessária.
### 15. Ordem de execução
- T001/T002/T003 → T004 → T005.

## Ato III — Entregar e validar
### 16. Dependências, riscos e suposições
- pdfjs-dist 5.4.54; PDFs sem camada textual são rejeitados, sem OCR.
### 17. Decisões
- **DEC-001**: pdfjs-dist local fixo sem CDN/rede — Juarez, opção 2, 2026-08-29.
### 18. Definition of Done
- [x] Gates focais, tarefas, ACs, evidências, visual e paridade completos.
