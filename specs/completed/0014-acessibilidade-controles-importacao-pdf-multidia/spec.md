# Especificação integrada: Acessibilidade dos controles e importação local de PDF multi-dia

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0014 |
| Slug | 0014-acessibilidade-controles-importacao-pdf-multidia |
| Status | Complete |
| Effort | 3 |
| Effort updated at | 2026-08-29 |
| Effort rationale | Correção de acessibilidade observável e extensão retrocompatível do parser local multi-dia nos dois HTMLs. |
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

Os controles novos do configurador e do importador herdam texto claro sobre fundo claro pela regra global `button,input,select,textarea { color: inherit; }`, tornando nome, objetivo, opções, textarea e botões ilegíveis no Chromium móvel. O importador local de PDF extrai texto, mas só reconhece o exemplo artificial `Dia:`/`Exercício:` e cria um único dia com um exercício; por isso rejeita o plano real de cinco dias e 25 exercícios.

#### Resultado desejado

Pessoa em instalação nova ou existente lê e opera todos os controles do configurador/importador com contraste, foco, estado desabilitado, fonte mínima de 16 px e alvo de toque mínimo de 44 px. Um PDF/TXT/texto local com cabeçalhos Segunda-feira a Sexta-feira e tabela Exercício/Volume/Tempo/Instruções obtém prévia dos cinco dias e seus exercícios, e a confirmação importa o plano completo sem rede nem alteração dos dados já existentes.

#### Métricas de sucesso

- Vitest mede em ambos os HTMLs cores escuras sobre superfícies claras, foco/disabled explícitos, fonte de 16 px e alvo de 44 px nos controles afetados.
- A fixture textual representativa do PDF relatado gera prévia de cinco dias e 25 exercícios; preserva séries/repetições, duração com unidade e valor textual à direita de `x`, além das instruções quando presentes.
- A confirmação grava somente os cinco treinos importados e mantém byte a byte os valores locais protegidos; entrada não reconhecível explica o formato esperado e não persiste nada.

### 2. Research e esclarecimentos

#### Researchs executados

- **R-001**: Chromium 390x826 relatado pelo Procurador mostrou `rgb(243,247,250)` sobre `rgb(255,255,255)` no configurador e sobre `rgb(240,240,240)` nos botões do importador. Impacto: a regra global de herança exige estilo explícito comum aos controles novos.
- **R-002**: inspeção local de `openWorkoutImport` confirmou regex literal para `Dia:` e `Exercício:`, um único objeto `draft` e mensagem `Texto inválido`. Impacto: extrair plano multi-dia antes de criar a prévia e confirmar todos os dias atômica e localmente.
- **R-003**: o relato do arquivo `plano_treino_condicionamento.pdf` informa cinco cabeçalhos Segunda-feira–Sexta-feira, colunas Exercício/Volume/Tempo/Instruções e 25 exercícios. O adendo confirmou que `readWorkoutPdf` faz `items.map(str).join(' ')` por página: a saída real é texto achatado, com espaços duplos entre células e quebra somente entre páginas. O arquivo fora do workspace não foi lido; uma fixture sintética reproduz essa saída como aceite automatizado, sem dado real.
- **R-004**: novo aceite físico independente informou que o PDF real já gera cinco dias e 25 exercícios, mas `createImportedExercise` reduz `4 séries x 45 seg.` para `sets: 4`/`reps: "45"` e trata `4 séries x Máximo` como `sets: 1`/`reps: "4 séries x Máximo"`. Impacto: a correção deve preservar `45 seg.` e `Máximo` como a parte direita da medida, sem acessar o arquivo fora do workspace. O RED local reproduziu as duas falhas nas duas variantes (2 falhas esperadas, 13 baselines verdes).
- **R-005**: prova física independente posterior no portal Maestri `Meu Treino - Teste Final`, Chromium 390x818, confirmou por cliques reais a extração local de 3.230 caracteres do PDF selecionado, prévia de cinco dias/25 exercícios, confirmação sem sessões, fechamento computado do onboarding, cinco treinos importados e runner da sexta-feira. A inspeção confirmou `Corda Naval` e `Prancha Abdominal Isométrica` com `sets: 4`/`reps: "45 seg."`, e `Flexão de Braço` com `sets: 4`/`reps: "Máximo"`, com notas preservadas. Impacto: o aceite físico dos requisitos do importador e contraste está atendido; o arquivo real não foi copiado nem acessado nesta execução.
- **R-006**: evidência independente posterior do terminal `Codex - Procurador`, marcado como Maestro, executou `npm run test:tdd` no mesmo workspace após a correção e informou exit code 0, 20 arquivos/170 testes verdes em 26,32 s; `tests/partitura/procurador.test.js` passou 7/7 e `tests/partitura/dispatcher.test.js` passou 6/6. Impacto: remove a limitação de ambiente que o terminal não-Maestro não podia exercer.

#### Fontes e contexto consultados

- Pedido humano atual, SPEC-0013 concluída, `index.html`, `treino_hibrido_juarez_v3_standalone.html`, `tests/workout-import.test.js` e `tests/workout-import-pdf.test.js`.

#### Documentação consultada

- Nenhuma fonte externa; PDF.js já é distribuído localmente em `vendor/pdfjs-dist-5.4.54`.

#### Artefatos de pesquisa armazenados

- Nenhum artefato externo. A fixture de teste é evidência local derivada da estrutura declarada, não uma cópia do PDF da pessoa.

#### Pedido literal preservado

> Evidência 1 — contraste: no Chromium 390x826, data-onboarding-name tem color rgb(243,247,250) e background rgb(255,255,255); data-onboarding-goal igual; options também claras. No modal, textarea tem texto claro sobre branco e Ver prévia/Confirmar/Cancelar têm texto rgb(243,247,250) sobre rgb(240,240,240). Causa localizada: regra global button,input,select,textarea color:inherit e novos controles não recebem o padrão escuro de .form-row/.btn-timer-ctrl. Corrija todos os controles do configurador e importador, inclusive opções, foco, disabled e botões, mantendo fonte >=16px e toque >=44px.

> Evidência 2 — PDF: o usuário selecionou corretamente C:\\Users\\Samsung\\Downloads\\plano_treino_condicionamento.pdf; PDF.js extrai t&#111;do o texto, mas Ver prévia retorna Texto inválido. Causa localizada em openWorkoutImport: regex exige literalmente Dia: e Exercício: e monta só um dia/um exercício. O PDF real traz cinco cabeçalhos Segunda-feira a Sexta-feira e tabela Exercício / Volume / Tempo / Instruções, total 25 exercícios. O teste atual usa PDF artificial já no molde Dia:/Exercício:, então não representa uso real. Trate o arquivo real como aceite: a prévia deve reconhecer os cinco dias e exercícios, séries/repetições ou tempo e instruções quando disponíveis; confirmação deve importar o plano completo, continuar local/sem rede e sem corromper estado. Mensagem de erro deve explicar formato quando realmente não puder interpretar, não apenas Texto inválido.

> ADENDO CRÍTICO antes do GREEN: a fixture atual não reproduz a saída real do PDF. Eu extraí o arquivo do usuário com a mesma pdfjs-dist. readWorkoutPdf faz items.map(str).join espaço por página, então o texto real NÃO tem uma linha por célula nem pipes; quase toda página é uma única linha com espaços duplos, e só há quebra entre páginas. Começa assim: PLANO DE CONDICIONAMENTO FÍSICO SEMANAL  Rotina de segunda a sexta...  Segunda-feira: Foco Cardio e Pernas (Membros Inferiores)  Exercício   Volume / Tempo   Instruções / Dica  Esteira (Corrida Intervalada)   15 a 20 min   Alternar 1 min corrida rápida / 1 min caminhada  Agachamento Livre com Halter   4 séries x 12 rep.   Mantenha...; depois Terça-feira: Foco Superior..., Quarta-feira: Circuito..., quebra de página antes de Quinta-feira..., Sexta-feira: Treino Integrado.... Ajuste o teste RED para espelhar essa saída sem pipes/newlines por linha e use nomes/volumes reais representativos; senão corremos o risco de passar de novo com fixture artificial e o PDF do usuário continuar falhando. O aceite físico será contra o arquivo real, portanto não implemente só para a fixture atual.

> NOVA EVIDÊNCIA DO PDF REAL NO CHROMIUM — não conclua o gate ainda. O arquivo C:\Users\Samsung\Downloads\plano_treino_condicionamento.pdf extraiu 3230 caracteres, a prévia mostrou 5 dias/25 exercícios, a confirmação preservou sessões=0 e criou todos os dias. Porém a inspeção dos 25 objetos encontrou dois defeitos de volume: Corda Naval ou Polichinelos, origem 4 séries x 45 seg., virou sets=4/reps=45 e perdeu a unidade; Prancha Abdominal Isométrica teve a mesma perda. Flexão de Braço, origem 4 séries x Máximo, virou sets=1/reps=4 séries x Máximo, em vez de sets=4/reps=Máximo. Isso viola preservar séries/repetições ou tempo. Acrescente REDs com esses dois formatos exatamente como a extração real, ajuste createImportedExercise sem quebrar os 79 focais e me devolva GREEN/gates. Evidência positiva já confirmada no Chromium: inputs/select/options/modal todos color rgb(9,13,18), fundo rgb(243,247,250), 16px, 44px; PDF real gera labels Segunda a Sexta, perfil Teste PDF/Condicionamento, onboarding display none.

> Prova física independente concluída no Chromium real pelo portal Maestri. Há somente 1 portal conectado: 'Meu Treino - Teste Final', viewport 390x818. Fluxo físico: fill nome 'Teste PDF Final' -> select objetivo 'Condicionamento' -> click real em 'Importar meu treino' (modal abriu); arquivo real C:\Users\Samsung\Downloads\plano_treino_condicionamento.pdf, 5.879 bytes, foi entregue como File ao input porque o portal não possui comando de upload; o onchange real extraiu 3.230 caracteres; click real em 'Ver prévia' exibiu 'Prévia: 5 dias · 25 exercícios — Segunda-feira, Terça-feira, Quarta-feira, Quinta-feira, Sexta-feira'; click real em 'Confirmar' fechou o onboarding (hidden=true/display=none), salvou profile name/goal, onboardingSeen/configured true, sessions=0 e 5 treinos/25 exercícios. Dados reais inspecionados: Corda Naval sets=4 reps='45 seg.'; Prancha Abdominal Isométrica sets=4 reps='45 seg.'; Flexão de Braço sets=4 reps='Máximo', com notas preservadas. Click real em Treinos exibiu 5 sessões e visualmente 4×45 seg. e 4×Máximo; click real em Iniciar Treino de sexta abriu o runner com 5 exercícios. Screenshots reais confirmaram contraste; computed styles dos controles: texto rgb(9,13,18), fundo rgb(243,247,250), font-size 16px, min-height 44px. Atualize a SPEC-0014 com essa evidência, conclua o Delivery Gate se todos os critérios estiverem satisfeitos e reporte o resultado final. Não faça mudanças de produto adicionais.

> Complemento de evidência antes de decidir o gate: no terminal 'Codex - Procurador', que está marcado como maestro, executei agora npm run test:tdd no mesmo workspace após a correção. Resultado fresco com exit code 0: Test Files 20 passed (20), Tests 170 passed (170), duração 26.32s. A Partitura passou: procurador.test.js 7/7 e dispatcher.test.js 6/6. Portanto não existe mais limitação de suíte integral; substitua a evidência 159/163 do terminal não-Maestro pela evidência independente 170/170 do terminal Maestro, revalide e conclua o Delivery Gate se nenhum outro achado existir. Não altere produto.

#### Dúvidas respondidas

- **Q**: acessar o PDF real em Downloads? → **A**: não; o escopo local preserva dados reais fora do workspace e usa a estrutura relatada como fixture de aceite.
- **Q**: reabrir a SPEC-0013 concluída? → **A**: não; decisão anterior preserva specs concluídas e esta sucessora registra o comportamento alterado.

#### Dúvidas abertas

- Nenhuma.

### 3. Escopo e atores

#### Incluído

- Estilos explícitos e acessíveis para todos os controles do configurador e importador nos dois HTMLs.
- Parser local retrocompatível para `Dia:`/`Exercício:` e para tabelas multi-dia com cabeçalhos de dias da semana.
- Prévia, confirmação atômica, mensagens de formato e regressões automatizadas de contraste e importação.

#### Fora de escopo

- Leitura do arquivo real fora do workspace, OCR, backend, rede, telemetria, conta, perfil múltiplo, alteração de dados existentes, deploy, produção, publicação ou ação remota.

#### Atores

- **Pessoa que configura ou importa**: lê os controles e importa o plano próprio localmente.
- **Pessoa em instalação existente**: conserva perfil, sessões, histórico, equipamentos e importações já guardados.
- **Procurador**: executa a verificação física independente final no Chromium móvel.

### 4. Princípios e restrições do projeto

- **PR-001**: contraste e foco dos controles novos não dependem de herança de cor global.
- **PR-002**: importação é local e confirma somente uma prévia válida, sem rede.
- **PR-003**: formato legado continua aceito; o formato multi-dia preserva dados disponíveis sem inventar valores.
- **PR-004**: os dois HTMLs são fontes compartilhadas e devem permanecer materialmente idênticos.
- **PR-005**: dados locais existentes não podem ser apagados nem alterados pela importação.

### 5. Histórias de usuário

#### US-001 — Ler e operar o configurador e importador (P1)

Como pessoa que configura o app ou importa um treino, quero controles com contraste, foco e tamanho adequados, para preencher e confirmar sem depender de tentativa e erro visual.

**Por que P1**: o fluxo de primeiro uso fica bloqueado quando texto e ações não são legíveis.
**Teste independente**: cada controle novo tem estilo computado legível, foco/disabled explícitos, fonte de 16 px e alvo de 44 px em ambas as variantes.
**Requisitos**: FR-001, NFR-001, NFR-002.

#### US-002 — Importar plano semanal próprio de PDF local (P1)

Como pessoa com um plano semanal exportado em PDF/TXT/texto, quero pré-visualizar e importar os cinco dias completos, para usar meu treino sem reescrever 25 exercícios.

**Por que P1**: a extração já funciona, mas o contrato atual descarta o conteúdo útil.
**Teste independente**: fixture representativa produz cinco treinos e 25 exercícios, com volume/tempo e instruções disponíveis.
**Requisitos**: FR-002, FR-003, NFR-003, NFR-004.

#### US-003 — Manter os dados locais seguros durante a importação (P1)

Como pessoa com dados já salvos, quero que prévia inválida ou confirmação de plano próprio não corrompam meu estado, para testar a importação com segurança.

**Por que P1**: compatibilidade local é limite explícito da entrega anterior.
**Teste independente**: snapshots protegidos ficam byte a byte iguais e falha de formato não persiste importação.
**Requisitos**: FR-003, NFR-003, NFR-004.

### 6. Cenários BDD de aceite

#### AC-001 — Controles legíveis e operáveis

**Cobre**: US-001, FR-001, NFR-001, NFR-002

```gherkin
@US-001 @FR-001 @NFR-001 @NFR-002 @AC-001
Feature: controles acessíveis do configurador e importador

  Scenario: pessoa abre configurador e importador
    Given um HTML local em viewport móvel
    When os controles de nome, objetivo, arquivo, textarea e ações são renderizados
    Then texto escuro contrasta com a superfície clara, foco e disabled são visíveis, fonte é ao menos 16 px e alvos são ao menos 44 px
```

#### AC-002 — Prévia do plano semanal multi-dia

**Cobre**: US-001, US-002, FR-001, FR-002, NFR-001, NFR-002, NFR-003, NFR-004

```gherkin
@US-002 @FR-002 @NFR-003 @NFR-004 @AC-002
Feature: prévia local de plano semanal

  Scenario: PDF textual traz cinco tabelas de dias
    Given texto local achatado por PDF.js, com espaços repetidos, quebras apenas entre páginas, Segunda-feira a Sexta-feira, 25 exercícios e colunas de volume, tempo e instruções
    When a pessoa seleciona Ver prévia
    Then a prévia informa cinco dias e 25 exercícios sem chamada de rede
```

#### AC-003 — Confirmação completa sem corrupção

**Cobre**: US-002, US-003, FR-002, FR-003, NFR-003, NFR-004

```gherkin
@US-002 @US-003 @FR-002 @FR-003 @NFR-003 @NFR-004 @AC-003
Feature: confirmação local e compatível

  Scenario: pessoa confirma prévia semanal válida
    Given estado local existente e uma prévia válida de cinco dias
    When confirma a importação
    Then os cinco treinos e 25 exercícios são gravados localmente sem mudar valores locais protegidos

  Scenario: texto sem dia e exercício reconhecíveis
    Given texto local sem formato de treino
    When seleciona Ver prévia
    Then recebe instrução de formato e nenhuma importação é persistida
```

#### AC-004 — Falha explicada não corrompe dados

**Cobre**: US-003, FR-003, NFR-003

```gherkin
@US-003 @FR-003 @NFR-003 @AC-004
Feature: rejeição local de formato não reconhecido

  Scenario: texto local não possui dia nem exercício
    Given estado local existente e texto que não representa um treino
    When a pessoa seleciona Ver prévia
    Then recebe instrução dos formatos aceitos e cada chave local existente permanece idêntica
```

#### AC-005 — Formato legado continua importável

**Cobre**: US-002, FR-002, FR-003, NFR-003

```gherkin
@US-002 @FR-002 @FR-003 @NFR-003 @AC-005
Feature: compatibilidade do importador local

  Scenario: texto legado usa Dia e Exercício
    Given texto local no formato Dia, Exercício, Séries e Reps
    When a pessoa seleciona Ver prévia e confirma
    Then um treino legado válido é importado sem depender de rede
```

#### AC-006 — Variantes permanecem equivalentes

**Cobre**: US-001, US-003, FR-001, FR-003, NFR-001, NFR-002, NFR-004

```gherkin
@US-001 @US-003 @FR-001 @FR-003 @NFR-001 @NFR-002 @NFR-004 @AC-006
Feature: paridade das variantes distribuídas

  Scenario: mesma jornada local nas duas variantes
    Given os dois HTMLs distribuídos localmente
    When configurador e importador são exercitados com prévia válida e inválida
    Then controles, mensagens e persistência protegida têm o mesmo comportamento e os arquivos não divergem materialmente
```

### 7. Requisitos

#### Funcionais

- **FR-001**: configurador e importador aplicam estilo explícito a inputs, select, options, textarea e botões, incluindo foco e disabled, sem texto claro sobre superfície clara.
- **FR-002**: a prévia aceita o formato legado e um plano semanal local com cabeçalhos Segunda-feira–Sexta-feira e tabela Exercício/Volume/Tempo/Instruções, inclusive quando PDF.js achatou as células em texto corrido com espaços repetidos e quebras somente entre páginas, representando todos os dias e exercícios encontrados; para medidas `N séries x valor`, preserva `N` em `sets` e preserva o valor à direita, incluindo unidade de tempo (`45 seg.`) ou palavra (`Máximo`).
- **FR-003**: a confirmação grava todos os dias da prévia de uma vez, preserva dados locais existentes e explica o formato aceito quando nenhum plano puder ser reconhecido.

#### Não funcionais

- **NFR-001**: cada controle afetado usa fonte de no mínimo 16 px e alvo de toque de no mínimo 44 px. **Verificação**: DOM/Vitest nas duas variantes.
- **NFR-002**: foco e disabled são distinguíveis e o contraste é explícito, sem depender de `color: inherit`. **Verificação**: DOM/Vitest nas duas variantes.
- **NFR-003**: importação é local, sem rede, e preserva valores protegidos byte a byte. **Verificação**: Vitest com snapshots de localStorage.
- **NFR-004**: `index.html` e `treino_hibrido_juarez_v3_standalone.html` permanecem materialmente idênticos. **Verificação**: `git diff --no-index` e testes de paridade.

#### Erros e casos-limite

- PDF sem camada textual, inacessível ou criptografado → mantém mensagem local específica já existente e não grava nada.
- Texto sem dia e exercício reconhecíveis → explica que o formato precisa de `Dia:`/`Exercício:` ou cabeçalho de dia com tabela Exercício/Volume/Tempo/Instruções; não grava nada.
- Volume ausente, tempo isolado ou instrução ausente → preserva o que existir e usa marcador neutro, sem inventar dados.
- Medida `N séries x duração` ou `N séries x palavra` → guarda `N` em `sets` e a duração com unidade ou palavra inteira em `reps`; não reduz a duração a número nem converte `Máximo` em marcador neutro.

## Ato II — Projetar e provar

### 8. Plano técnico

#### Contexto existente

- Aplicação PWA Vanilla JavaScript distribuída em dois HTMLs equivalentes; estado e importações ficam em `localStorage`; Vitest/JSDOM roda por `npm run test:tdd`; PDF.js é local.

#### Arquitetura e módulos

- Um seletor CSS comum aos controles novos define superfície clara, texto escuro, borda, foco, disabled, fonte e altura. `openWorkoutImport` chama parser local que retorna lista de treinos do formato legado ou semanal, inclusive texto achatado por página por `readWorkoutPdf`; a prévia mantém essa lista e a confirmação a persiste atômica e aditivamente.

#### Migrations

- Não aplicável: a chave de importações continua um array; entradas legadas de um dia são aceitas e entradas existentes não são reescritas.

#### Models

- `ImportedWorkout`: `id`, `label`, `focus`, `duration`, `warmup`, `exercises[]`. Exercício guarda `name`, `sets`, `reps`, `rest`, `rir`, `notes` e `video`; volume/tempo/instrução são normalizados somente quando presentes. Caminhos: os dois HTMLs.

#### Controllers e casos de uso

- `parseImportedWorkoutPlan(text)` valida e normaliza texto local; `openWorkoutImport` apresenta prévia e confirma a lista completa. Não há autorização remota, I/O além do arquivo escolhido e `localStorage`.

#### Views e experiência

- Configurador usa classe acessível para nome e objetivo; modal usa a mesma classe para arquivo, textarea e ações. Estados padrão, foco e disabled continuam legíveis; mensagens descrevem os dois formatos aceitos.

#### Queries e repositórios

- Não aplicável: não há banco, API ou consulta remota.

#### Jobs e processamento assíncrono

- Não aplicável: PDF.js local já existente só lê o arquivo escolhido pela pessoa.

#### Estrutura de arquivos

```text
index.html
treino_hibrido_juarez_v3_standalone.html
tests/workout-import-accessibility-multiday.test.js
tests/workout-import-pdf.test.js
specs/draft/0014-acessibilidade-controles-importacao-pdf-multidia/spec.md
docs/
```

### 9. Modelo de dados

#### Entidades

| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| Prévia de importação | somente memória do modal | lista não vazia de treinos válidos; não persiste antes da confirmação | contém exercícios |
| Treino importado | `import-<dia-normalizado>` | um por dia; não duplica o mesmo ID | possui exercícios |
| Exercício importado | ID local único | nome obrigatório; volume/tempo/instrução opcionais | pertence a treino importado |

#### Estados e transições

| Entidade | Estado atual | Evento | Próximo estado | Invariantes |
| --- | --- | --- | --- | --- |
| Texto local | bruto | Ver prévia | prévia válida ou erro explicado | não persiste |
| Prévia | válida | Confirmar | todos os dias adicionados | uma gravação local, sem tocar estado protegido |
| Prévia | ausente/inválida | Confirmar | inalterada | não grava nada |

#### Migração e retenção

- Entradas já importadas permanecem na mesma chave. Não há retenção, sync ou migração destrutiva.

### 10. Interfaces e contratos

#### APIs expostas

- Nenhuma API de rede. O parser é contrato local interno, exercitado pelo fluxo real do modal.

#### APIs externas utilizadas

- Nenhuma nova. PDF.js local existente lê somente o arquivo selecionado pela pessoa.

#### Documentação das APIs consultadas

- Nenhuma nova; nenhuma navegação externa é necessária.

#### Eventos e outros contratos

- `data-import-preview` produz lista em memória; `data-import-confirm` persiste a lista completa; erros não escrevem `IMPORTED_WORKOUTS_KEY`.

### 11. Estratégia TDD

- **Unidade/DOM**: Vitest/JSDOM instancia cada HTML e inspeciona controles reais e o fluxo real do modal.
- **Integração/contrato**: fixture multi-dia percorre prévia e confirmação, verifica localStorage protegido e os dois formatos aceitos.
- **BDD/aceite**: AC-001–AC-006 orientam testes com marcadores `SPECSFY: SPEC-0014`.
- **Runner TDD**: Vitest pelo script existente `npm run test:tdd`.
- **E2E**: não abrir portal nesta execução; o Procurador executará a verificação física independente após os checks locais.
- **Verificação manual**: Chromium móvel 390x826 deve confirmar contraste visual e importação PDF real; é evidência externa pendente, não substituída por JSDOM.

#### Evidência RED-GREEN-REFACTOR

| IDs | BDD de referência | Teste TDD informado pelo BDD | RED observado | GREEN observado | Refactor/regressão |
| --- | --- | --- | --- | --- |
| FR-001, NFR-001, NFR-002, AC-001 | AC-001 | `tests/workout-import-accessibility-multiday.test.js` | 2026-08-29 — `var(--text)` e ausência da classe/estado explícito observados antes da correção. | Passed — 4 controles/foco/disabled verdes nas duas variantes. | `setup-import-control` comum; focais e produto sem Partitura verdes. |
| FR-002, NFR-003, AC-002 | AC-002 | `tests/workout-import-accessibility-multiday.test.js` | 2026-08-29 — saída achatada por página, sem pipes nem linha por célula, retornou `Texto inválido`; RED posterior reproduziu perda de `seg.` e `Máximo` nas duas variantes. | Passed — prévia local do fluxo real reconhece o texto achatado e a nova fixture preserva `45 seg.` e `Máximo`. | O formato legado permanece verde como baseline. |
| FR-003, NFR-003, NFR-004, AC-003 | AC-003 | `tests/workout-import-accessibility-multiday.test.js` | 2026-08-29 — confirmação não gravava importação após prévia semanal inválida; RED posterior observou objetos importados com volume incompleto. | Passed — confirmação persiste os objetos com `sets: 4` e `reps: "45 seg."`/`"Máximo"`; snapshots protegidos seguem iguais. | Paridade será registrada na rodada final local. |
| FR-003, NFR-003, AC-004 | AC-004 | `tests/workout-import-accessibility-multiday.test.js` | 2026-08-29 — mensagem genérica `Texto inválido` não explicava formato. | Passed — erro diz formato inválido e apresenta os dois formatos locais. | Não persiste importação inválida. |
| FR-002, FR-003, NFR-003, AC-005 | AC-005 | `tests/workout-import-accessibility-multiday.test.js` | 2026-08-29 — baseline válido Dia/Exercício nas duas variantes. | Passed — ID histórico e importação do formato legado preservados. | Focais importador/PDF verdes. |
| FR-001, FR-003, NFR-001, NFR-002, NFR-004, AC-006 | AC-006 | `tests/workout-import-accessibility-multiday.test.js` | 2026-08-29 — mesmos REDs observados em ambas as variantes. | Passed — mesmo comportamento nas duas variantes e diff completo exit 0. | 16/16 IDs rastreáveis; marcadores de outras specs ignorados. |

### 12. Plano de testes e rastreabilidade

| Requisito | Cenário BDD | Nível | Arquivo/comando esperado | Evidência |
| --- | --- | --- | --- | --- |
| FR-001, NFR-001–002 | AC-001 | DOM | `tests/workout-import-accessibility-multiday.test.js` | Passed — estilos computados e regra de foco/disabled explícita em ambas. |
| FR-002, NFR-003 | AC-002 | DOM/localStorage | `tests/workout-import-accessibility-multiday.test.js` | Passed — fixture achatada inclui e preserva `4 séries x 45 seg.` e `4 séries x Máximo` em ambas as variantes. |
| FR-003, NFR-003–004 | AC-003 | DOM/localStorage/paridade | `tests/workout-import-accessibility-multiday.test.js`; `git diff --no-index` | Passed localmente — confirmação preserva as duas medidas e chaves; paridade foi reexecutada nesta rodada. |
| FR-003, NFR-003 | AC-004 | DOM/localStorage | `tests/workout-import-accessibility-multiday.test.js` | Passed — erro explicado sem persistência. |
| FR-002–003, NFR-003 | AC-005 | DOM/localStorage | `tests/workout-import-accessibility-multiday.test.js` | Passed — formato Dia/Exercício e ID histórico preservados. |
| FR-001, FR-003, NFR-001–002, NFR-004 | AC-006 | DOM/paridade | `tests/workout-import-accessibility-multiday.test.js`; `git diff --no-index` | Passed — duas variantes e bloco completo equivalentes. |

### 13. Validações

#### Gate do Ato I — Definição

- **Resultado**: Passed
- **Comando**: `node .agents/skills/specsfy-04-validate/scripts/validate_spec.mjs specs/draft/0014-acessibilidade-controles-importacao-pdf-multidia/spec.md --allow-draft`
- **Evidência**: 2026-08-29 — `validate_spec --allow-draft` retornou `VALID DRAFT`; `review_findings` retornou `Reviews: PASSED`. Seis AC distintos cobrem cada US, FR e NFR ao menos três vezes; não há decisão aberta.
- **Achados**: nenhum BLOCKER, WARNING ou finding especializado aberto.

#### Gate do Ato II — Plano

- **Resultado**: Passed
- **Comando**: `node .agents/skills/specsfy-05-tasks/scripts/validate_tasks.mjs specs/in-progress/0014-acessibilidade-controles-importacao-pdf-multidia/spec.md --allow-draft`
- **Evidência**: 2026-08-29 — replanejamento pontual acrescentou T011–T013 sem alterar o escopo: `validate_tasks --allow-draft` retornou `VALID DRAFT` com 13 tarefas, 8 predecessores TDD concluídos, 65 itens de checklist, 60 concluídos e 16/16 IDs cobertos. T011 observou RED nas duas variantes para `45 seg.` e `Máximo` antes de T012; a validação estrita final retornou `READY`.
- **Achados**: nenhum bloqueio de plano; as 13 tarefas estão concluídas e a implantação segue em `Implementing` somente até a resolução da limitação externa de Partitura.

#### Gate do Ato III — Entrega

- **Resultado**: Passed
- **Comando**: focais Vitest, regressão `npm run test:tdd`, `verify_acceptance`, `validate_spec`, `validate_tasks`, `check_traceability`, `review_findings`, documentação, paridade, `git diff --check` e monitor.
- **Evidência local**: 2026-08-29 — novo RED 2 falhas/13 baselines e GREEN 15/15 no importador; focais 81/81; produto sem Partitura 157/157 em 18 arquivos; `validate_spec` READY; `validate_tasks` READY; aceite QA PASSED; full-chain 16/16; review PASSED; `verify_evidence T012` PASSED; `git diff --no-index` e `git diff --check` exit 0 (somente avisos CRLF); documentação e monitor CURRENT. A execução integral independente e fresca no terminal Maestro retornou exit 0, 20/20 arquivos e 170/170 testes, incluindo Partitura 7/7 e 6/6.
- **Evidência física independente**: 2026-08-29 — Chromium real 390x818 no único portal `Meu Treino - Teste Final`: cliques reais percorreram configurador, importador, prévia 5 dias/25 exercícios, confirmação, Treinos e runner. Onboarding fechou com `hidden=true`/`display=none`; perfil e objetivo foram salvos, sessões ficaram 0, e `45 seg.`/`Máximo`, notas, contraste 16 px/44 px e as cinco sessões foram confirmados.
- **Limitações externas**: nenhuma aberta: a prova física requerida foi recebida e a suíte integral foi exercida independentemente no terminal Maestro.
- **Achados**: nenhum achado de produto, evidência ou gate aberto. Delivery Gate passou com a evidência física independente, a suíte integral Maestro e os checks locais frescos.

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

- [x] T001 [TEST] [TDD] [US-001] Criar RED de contraste, foco, disabled, fonte e toque em `tests/workout-import-accessibility-multiday.test.js` — Refs: US-001, FR-001, NFR-001, NFR-002, AC-001 — Depends: none
  - [x] **PREP**: Reprodução confirmada nos dois HTMLs e regra global causadora identificada.
  - [x] **EXECUTE**: Controles reais do configurador e modal foram cobertos sem mock de estilo.
  - [x] **VERIFY**: RED observou `var(--text)` e ausência do estado explícito em ambas as variantes.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/workout-import-accessibility-multiday.test.js`, exit 1, 10 falhas esperadas e 3 baselines verdes.
  - [x] **IMPROVE**: A classe acessível será requisito observável; removê-la mantém o teste sensível.

- [x] T002 [TEST] [TDD] [US-001] Criar RED multi-dia achatado por PDF.js em `tests/workout-import-accessibility-multiday.test.js` — Refs: US-001, US-002, FR-001, FR-002, NFR-001, NFR-002, NFR-003, NFR-004, AC-002 — Depends: none
  - [x] **PREP**: Fixture agora espelha espaços repetidos entre células e quebra apenas entre páginas, sem pipes nem uma linha por célula.
  - [x] **EXECUTE**: Botão real de prévia foi exercitado nos dois HTMLs com nomes e volumes representativos do plano real.
  - [x] **VERIFY**: RED observou `Texto inválido` para cinco dias/25 exercícios na saída achatada.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/workout-import-accessibility-multiday.test.js`, exit 1; 10 falhas esperadas e 3 baselines verdes.
  - [x] **IMPROVE**: Caso legado permanece verde; a implementação não poderá depender da fixture anterior.

- [x] T003 [TEST] [TDD] [US-002] Criar RED de confirmação completa e erro explicado em `tests/workout-import-accessibility-multiday.test.js` — Refs: US-002, US-003, FR-002, FR-003, NFR-003, NFR-004, AC-003 — Depends: none
  - [x] **PREP**: Snapshots de chaves protegidas e contrato de não persistência foram preparados.
  - [x] **EXECUTE**: Confirmação real e entrada malformada foram cobertas nos dois HTMLs.
  - [x] **VERIFY**: RED observou ausência de importação após a prévia semanal inválida.
  - [x] **EVIDENCE**: Mesmo comando focal, exit 1; duas falhas por `null` em vez de cinco treinos.
  - [x] **IMPROVE**: Paridade comportamental continua coberta por T006 e diff final.

- [x] T004 [TEST] [TDD] [US-003] Criar RED de erro de formato sem escrita em `tests/workout-import-accessibility-multiday.test.js` — Refs: US-003, FR-003, NFR-003, AC-004 — Depends: none
  - [x] **PREP**: Texto sem dia/exercício e snapshots protegidos foram fixados.
  - [x] **EXECUTE**: Botão real de prévia foi exercitado nos dois HTMLs.
  - [x] **VERIFY**: RED observou mensagem genérica `Texto inválido`, sem orientação de formato.
  - [x] **EVIDENCE**: Mesmo comando focal, exit 1; importações e chaves protegidas permaneceram ausentes/iguais.
  - [x] **IMPROVE**: Teste não mocka localStorage nem parser.

- [x] T005 [TEST] [TDD] [US-002] Caracterizar compatibilidade do formato Dia/Exercício em `tests/workout-import-accessibility-multiday.test.js` — Refs: US-002, FR-002, FR-003, NFR-003, AC-005 — Depends: none
  - [x] **PREP**: Exemplo legado foi separado da fixture semanal.
  - [x] **EXECUTE**: Prévia e confirmação reais foram exercitadas nos dois HTMLs.
  - [x] **VERIFY**: Baseline verde nas duas variantes; não havia RED legítimo para comportamento já suportado.
  - [x] **EVIDENCE**: Mesmo comando focal, duas aprovações do contrato Dia/Exercício antes de qualquer código novo.
  - [x] **IMPROVE**: Compatibilidade será parte da regressão da implementação.

- [x] T006 [TEST] [TDD] [US-001] Criar RED de paridade comportamental em `tests/workout-import-accessibility-multiday.test.js` — Refs: US-001, US-003, FR-001, FR-003, NFR-001, NFR-002, NFR-004, AC-006 — Depends: none
  - [x] **PREP**: Mesmos controles e fluxos válidos/inválidos foram definidos para ambas as variantes.
  - [x] **EXECUTE**: Resultados observáveis foram comparados sem depender apenas de texto-fonte.
  - [x] **VERIFY**: Os mesmos 10 REDs foram observados nas duas variantes; bloco alvo igual é baseline verde.
  - [x] **EVIDENCE**: Mesmo comando focal, exit 1, mais teste de bloco compartilhado verde.
  - [x] **IMPROVE**: Diff textual continuará obrigatório no gate final.

#### Fase 2 — Implementação mínima

- [x] T007 [CODE] [US-001] Aplicar estilos acessíveis a configurador e importador em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-001, FR-001, NFR-001, NFR-002, NFR-004, AC-001, AC-006 — Depends: T001, T002, T006
  - [x] **PREP**: RED confirmado nas duas variantes; `setup-import-control` é o seletor compartilhado mínimo.
  - [x] **EXECUTE**: Classe comum aplicada a inputs, select/options, textarea e botões do configurador/importador, com foco e disabled explícitos.
  - [x] **VERIFY**: Focal passou nas duas variantes: 4 testes verdes, 9 filtros ignorados, exit 0.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/workout-import-accessibility-multiday.test.js -t "renders every|gives importer"` exit 0; documentação reconstruída e `build_documentation --check` exit 0. `PROJECT.md` não muda: a correção de contraste não altera história, finalidade, capacidade ou limite; nenhuma regra nova em `.specsfy/RULES.md` foi confirmada.
  - [x] **IMPROVE**: Nenhuma refatoração fora do seletor compartilhado foi necessária.
  <!-- specsfy:evidence {"task":"T007","refs":["US-001","FR-001","NFR-001","NFR-002","NFR-004","AC-001","AC-006"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/workout-import-accessibility-multiday.test.js"],"commands":[{"run":"npm run test:tdd -- tests/workout-import-accessibility-multiday.test.js -t renders every|gives importer","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0}]} -->

- [x] T008 [CODE] [US-002] Implementar parser e confirmação local multi-dia em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-002, US-003, FR-002, FR-003, NFR-003, NFR-004, AC-002, AC-003, AC-004, AC-005, AC-006 — Depends: T002, T003, T004, T005, T006
  - [x] **PREP**: RED achatado por PDF.js, compatibilidade Dia/Exercício e snapshots protegidos confirmados.
  - [x] **EXECUTE**: Parser local reconhece Dia/Exercício e blocos Segunda–Sexta achatados por PDF.js; confirmação adiciona a lista completa em uma única gravação.
  - [x] **VERIFY**: Focais de importador/PDF, configurador, onboarding e feedback passaram: 79/79 em 6 arquivos, exit 0.
  - [x] **EVIDENCE**: Novo RED achatado agora gera 5 dias/25 exercícios, preserva volume/tempo/instruções e snapshots protegidos; mensagem inválida explica os formatos; documentação e check passaram. `PROJECT.md` não muda porque é correção do contrato local já descrito; nenhuma regra nova foi confirmada.
  - [x] **IMPROVE**: Parser continua local, sem dependência nova; o ID histórico do formato Dia/Exercício foi preservado.
  <!-- specsfy:evidence {"task":"T008","refs":["US-002","US-003","FR-002","FR-003","NFR-003","NFR-004","AC-002","AC-003","AC-004","AC-005","AC-006"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/workout-import-accessibility-multiday.test.js"],"commands":[{"run":"npm run test:tdd -- tests/workout-import-accessibility-multiday.test.js tests/workout-import.test.js tests/workout-import-pdf.test.js tests/onboarding-configurator.test.js tests/onboarding-first-use.test.js tests/first-use-feedback.test.js","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0}]} -->

#### Fase final — Qualidade e gates

- [x] T009 [DOC] Atualizar documentação/contextos e evidências da SPEC-0014 — Refs: FR-001, FR-002, FR-003, NFR-001–004, AC-001–006 — Depends: T007, T008
  - [x] **PREP**: Monitor executado após cada código; documentação técnica e persistência local foram identificadas como contexto impactado, sem schema novo.
  - [x] **EXECUTE**: `docs/` e `.specsfy/PACKAGES.md` foram reconstruídos pelo documentador, sem alterar histórico humano.
  - [x] **VERIFY**: `build_documentation --check` e `monitor_context --check --acknowledge-project-no-change` retornaram exit 0 e `CURRENT`.
  - [x] **EVIDENCE**: Comandos locais: `node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project .`, o mesmo com `--check`, e monitor; todos exit 0.
  - [x] **IMPROVE**: Nenhuma mudança de stack, banco, PROJECT.md ou regra durável foi confirmada; a justificativa foi registrada nas evidências T007/T008.

- [x] T010 [TEST] Executar aceite local, regressão, rastreabilidade, paridade e preparar verificação física independente em `tests/workout-import-accessibility-multiday.test.js` e `spec.md` — Refs: FR-001, FR-002, FR-003, NFR-001–004, AC-001–006 — Depends: T009
  - [x] **PREP**: Comandos locais, paridade do bloco alvo e contrato de evidência física independente foram confirmados; nenhum portal será aberto.
  - [x] **EXECUTE**: Regressão do produto sem Partitura, aceite, rastreabilidade, revisão, validações, documentação, monitor e paridade foram executados localmente.
  - [x] **VERIFY**: Nenhuma falha local da SPEC-0014; Delivery não foi declarado Passed por faltar Chromium físico e por a Partitura exigir Maestro externo.
  - [x] **EVIDENCE**: Produto 155/155 em 18 arquivos sem Partitura; QA PASSED; rastreabilidade 16/16; revisão PASSED; `git diff --no-index` e `git diff --check` exit 0; monitor CURRENT. Execução integral: 157/161, com 4 testes e 1 suite externos da Partitura indisponíveis por terminal não-Maestro.
  - [x] **IMPROVE**: Portal não foi aberto, conforme escopo; o Procurador deve validar contraste e importar o PDF real em Chromium 390x826 antes do Delivery Gate.

- [x] T011 [TEST] [TDD] Reproduzir os volumes achatados `4 séries x 45 seg.` e `4 séries x Máximo` pelo fluxo real do modal em `tests/workout-import-accessibility-multiday.test.js` — Refs: US-002, US-003, FR-002, FR-003, NFR-003, NFR-004, AC-002, AC-003, AC-006 — Depends: T008
  - [x] **PREP**: Fixture local curta preserva a forma da extração PDF.js: uma única linha, espaços repetidos entre células, sem pipes nem dado real.
  - [x] **EXECUTE**: Prévia e confirmação reais do modal foram exercitadas nas duas variantes para Corda Naval ou Polichinelos, Prancha Abdominal Isométrica e Flexão de Braço.
  - [x] **VERIFY**: RED ético observou exatamente `45` sem `seg.` e `1`/`4 séries x Máximo` nos objetos importados; 2 falhas esperadas, 13 baselines verdes, exit 1.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/workout-import-accessibility-multiday.test.js`, 2026-08-29, exit 1, falhas em ambas as variantes.
  - [x] **IMPROVE**: O teste verifica objeto persistido após confirmação, não chama o parser diretamente e não acessa o PDF em Downloads.

- [x] T012 [CODE] Corrigir `createImportedExercise` em `index.html` e `treino_hibrido_juarez_v3_standalone.html` para preservar unidade ou valor textual após `N séries x` — Refs: US-002, US-003, FR-002, FR-003, NFR-003, NFR-004, AC-002, AC-003, AC-005, AC-006 — Depends: T011
  - [x] **PREP**: RED T011 e baselines de formato legado estavam disponíveis.
  - [x] **EXECUTE**: `seriesWithValue` separa o número de séries do valor inteiro à direita; repetição numérica continua numérica, enquanto `45 seg.` e `Máximo` são preservados sem alterar persistência, IDs ou fonte local.
  - [x] **VERIFY**: Novo RED ficou verde nas duas variantes; focais ficaram 81/81 e regressão proporcional ficou 157/157 em 18 arquivos, exit 0.
  - [x] **EVIDENCE**: `npm run test:tdd -- tests/workout-import-accessibility-multiday.test.js` — 15/15, exit 0; focais dos seis arquivos — 81/81, exit 0; regressão sem Partitura — 157/157, exit 0; documentação reconstruída e check/monitor exit 0.
  - [x] **IMPROVE**: Mudança ficou restrita ao parser compartilhado, nos dois HTMLs, sem dependência nova.
  <!-- specsfy:evidence {"task":"T012","refs":["US-002","US-003","FR-002","FR-003","NFR-003","NFR-004","AC-002","AC-003","AC-005","AC-006"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/workout-import-accessibility-multiday.test.js"],"commands":[{"run":"npm run test:tdd -- tests/workout-import-accessibility-multiday.test.js","exit":0},{"run":"npm run test:tdd -- tests/workout-import-accessibility-multiday.test.js tests/workout-import.test.js tests/workout-import-pdf.test.js tests/onboarding-configurator.test.js tests/onboarding-first-use.test.js tests/first-use-feedback.test.js","exit":0}]} -->

- [x] T013 [DOC] Revalidar documentação, aceite local, rastreabilidade, paridade, monitor e gates sem concluir Delivery em `spec.md` — Refs: FR-001, FR-002, FR-003, NFR-001–004, AC-001–006 — Depends: T012
  - [x] **PREP**: Evidências anteriores de T009/T010 permanecem históricas; AC-002/AC-003 foram colocados em revalidação pelo RED T011.
  - [x] **EXECUTE**: Documentação foi reconstruída; validações, aceite, rastreabilidade, revisão, evidência estrita T012 e paridade foram executados localmente.
  - [x] **VERIFY**: Aceite QA, full-chain, revisão, validações, paridade, documentação e monitor passaram; a prova física independente posterior confirmou todos os fluxos e medidas. A suíte integral independente do terminal Maestro também passou 170/170.
  - [x] **EVIDENCE**: `verify_acceptance` → QA PASSED; `check_traceability --full-chain --allow-orphans` → 16/16; `review_findings` → PASSED; validadores estritos → READY; `git diff --no-index`/`git diff --check` → exit 0; documentação/monitor → CURRENT. `Codex - Procurador` Maestro executou `npm run test:tdd` com exit 0, 20/20 arquivos, 170/170 testes, incluindo Partitura 7/7 e 6/6.
  - [x] **IMPROVE**: Não foi necessário tocar `board.yaml`, instalação global, portal, rede ou dados reais; a fixture curta evita duplicar o PDF real.

### 15. Ordem de execução

- Caminho crítico: T001–T006 → T007/T008 → T009 → T010 → T011 → T012 → T013.
- Tarefas paralelas: nenhuma edição paralela; os dois HTMLs e suites são fontes compartilhadas.
- Estratégia de MVP: contraste explícito e parser local de cinco dias, mantendo formato legado e persistência atual.

## Ato III — Entregar e validar

### 16. Dependências, riscos e suposições

#### Dependências

- PDF.js local existente para extrair camada textual; `localStorage` para confirmação e preservação de dados.

#### Riscos

- Extração de tabela PDF pode variar por origem → parser aceita formato legado e cabeçalhos/tabelas relatados, explica o formato esperado e nunca persiste prévia inválida.
- Ajuste visual em uma variante divergir → focais exercitam ambas e paridade textual é obrigatória.

#### Suposições

- Não há suposição aberta: cinco dias, colunas e limite de 25 exercícios são evidência declarada; o arquivo real não é copiado nem acessado.

### 17. Decisões

- **DEC-001**: criar SPEC-0014 sucessora sem reabrir SPEC-0013 — a mudança altera UI e contrato de importação, enquanto decisão anterior preserva a entrega concluída como histórico.
- **DEC-002**: aceitar formato legado e tabela multi-dia local — preserva compatibilidade e resolve formato relatado sem OCR, backend ou serviço novo.
- **DEC-003**: Delivery Gate exige prova física independente do Procurador — JSDOM não substitui contraste e interação no Chromium móvel; a prova recebida confirmou o fluxo completo e os volumes corrigidos, sem que esta execução abrisse portal.
- **DEC-004**: para `N séries x valor`, `sets` recebe `N`; `reps` recebe o valor inteiro à direita quando ele contiver duração/unidade ou texto, preservando `45 seg.` e `Máximo` localmente.

### 18. Definition of Done

- [x] `Definition Gate` está `Passed`.
- [x] `Plan Gate` foi revalidado após T011.
- [x] `Delivery Gate` está `Passed` após evidência física independente e suíte integral Maestro.
- [x] Todos os cenários `AC` aplicáveis passam localmente.
- [x] Todos os requisitos possuem evidência de verificação.
- [x] Todas as tarefas na seção 14 estão concluídas.
- [x] Testes, documentação, checks estáticos, paridade e monitor disponíveis passam.
