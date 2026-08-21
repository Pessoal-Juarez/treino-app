---
key: epic-1
title: Train with trustworthy workout memory
column: tests
origin: full
feature: quero-uma-revisao-na-ui-e-ux-do-app-e-ta
labels: [feature, workout-memory]
specs: [1-1-confirm-and-undo-performed-sets, 1-2-find-the-real-last-execution, 1-3-prefill-editable-last-execution-values, 1-4-show-progression-guidance-without-inventing-numbers, 1-5-remind-me-to-export-fragile-local-history, 1-6-validate-a-full-week-of-trustworthy-workout-memory, 1-7-save-only-confirmed-sets]
context: Juarez can open any exercise with reliable last-execution context, confirm only what he actually performs, preserve automatic rest, receive safe progression guidance, and protect the resulting local history. This issue owns Phase 1 and its mandatory five-day release gate.
criteria:
  - id: c1
    text: Every EPIC-1 story spec is implemented in order and its acceptance criteria pass.
  - id: c2
    text: FR1 through FR18 are delivered without breaking legacy records, offline use, timers, History, or exports.
  - id: c3
    text: The full-week validation spec records 100 percent usable-history prefill coverage and zero unconfirmed saved sets, lost values, checkmark-rest regressions, or false progression positives before EPIC-2 starts.
artifacts:
  - name: "EPIC-1 — Memória de carga: o que muda na tela"
    rel: ".nexus/assets/epic-1-memoria-de-carga.html"
    producedBy: planning
links:
  epics: ".nexus/features/quero-uma-revisao-na-ui-e-ux-do-app-e-ta/epics.md"
  readiness: ".nexus/features/quero-uma-revisao-na-ui-e-ux-do-app-e-ta/implementation-readiness-report.md"
comments:
  - who: "agent:sm"
    at: 2026-08-20T15:05:17.8122666-03:00
    text: Sprint Planning created this issue from the approved reconciled epic. Spec 1.1 owns pre-change touch-and-scroll baseline capture; Spec 1.6 owns the Phase 1 full-week gate identified by the readiness assessment.
  - who: "agent:sm"
    at: 2026-08-20T15:24:38.0984337-03:00
    text: "Planning validation passed for all six declared specs: Nexus parsing, frontmatter/body mirroring, acceptance-criterion task coverage, issue/spec membership, and epic/story parity all have zero defects. This is the only epic currently released to begin implementation."
  - who: "agent:sm"
    at: 2026-08-20T15:47:56.3500716-03:00
    text: The person approved splitting the former six-task Spec 1.1 to satisfy the three-task context budget. The ordered result is Spec 1.1 for baseline plus confirm/undo behavior, then Spec 1.7 for confirmed-only final persistence and legacy-safe History/exports; Story 1.2 now depends on 1.7.
  - who: "agent:dev"
    at: 2026-08-20T16:26:26.1658337-03:00
    text: Spec 1-1-confirm-and-undo-performed-sets ready for review.
  - who: "agent:dev"
    at: 2026-08-20T16:53:25.0000000-03:00
    text: "Senior review applied on Spec 1-1-confirm-and-undo-performed-sets, in TDD, one finding at a time. I2: the checkmark now carries a stable aria-label 'Serie <n> de <exercise> concluida', so the accessible name no longer depends on the check and undo glyphs and aria-pressed alone reports the state. I3: the confirmed row no longer dims; it gains an accent inset edge marker, an accent set number, a stronger green background and a solid accent undo button, keeping load, repetitions and RIR at full contrast, and the marker uses an inset shadow so confirming never reflows the row or moves the tap targets. I4: the CDP runner now captures and asserts data-confirmed, aria-pressed, aria-label, computed row opacity, computed background and the first-cell box shadow; replayed against the untouched index.html of 4ed60ec it fails at data-confirmed with actual undefined, so the post-change evidence is now discriminating, and the 6-tap / 2,832-CSS-px path was reproduced on headless Chrome 151.0.7922.138. I5: the undo case starts a real 90-second rest and proves the interval survives, the display stays 1:30, the status stays 'Descanso iniciado: 90s.' and the persisted rest state stays live. Correction to the review on I5: the old case did catch a direct stopTimer() call; what it could not catch was a cancellation bypassing stopTimer, which the new case kills. Suite 12/12, git diff --check clean, standalone parity exit 0 at sha256 9b354ac9, service-worker cache now treino-juarez-v5. Finding I1 is NOT resolved: board.yaml still lists the deleted 1-1-confirm-only-performed-sets and lacks 1-7-save-only-confirmed-sets. The board has one writer, so it was left untouched and needs reconciliation through Nexus Studio before merge."
  - who: "agent:pm"
    at: 2026-08-20T18:05:35-03:00
    text: "Completei o PRD da feature em prd.md, retomando do passo 8 (onde ele havia parado) até o passo 12. Escrevi as duas seções que faltavam e que o relatório de prontidão apontou como ausentes: Requisitos Funcionais (30, em 7 áreas de capacidade) e Requisitos Não Funcionais (15, em 6 categorias). Juarez escolheu, entre três alternativas, adotar a numeração do registro reconciliado de epics.md em vez do rascunho solto _fr.md, que usava FR1 a FR49 e conflitava com as seis specs já liberadas. Com isso, FR1 through FR18 no critério c2 desta issue passa a significar a mesma coisa no PRD, no epics.md, no relatório de prontidão e nas specs. Acrescentei também uma tabela de rastreabilidade ligando cada uma das cinco jornadas do usuário aos requisitos que ela exige. Descartei escalabilidade, integração e conformidade regulatória como categorias de NFR, com o motivo escrito no documento, e deixei os AR1 a AR13 fora do PRD por serem instruções de como construir e não de quão bem funcionar; eles seguem canônicos no epics.md."
  - who: "agent:pm"
    at: 2026-08-20T18:06:10-03:00
    text: "DUAS COISAS QUE PROPONHO E NÃO EXECUTEI, porque o texto é do autor e não meu para reescrever. Primeira: a seção Escopo do produto do PRD diz que renomear um exercício de verdade apaga a memória dele e não menciona apelido nenhum, mas o FR3 aprova quatro apelidos antigos que passam justamente a NÃO apagar a memória; o mapa de apelidos foi decidido depois que aquela prosa foi escrita. Registrei a diferença ao lado, na seção de rastreabilidade, sem tocar no original, e fechar isso de vez exige alterar aquela prosa de propósito. Segunda: as regras de segurança do sw.js, dos dois HTML idênticos e do campo do checkmark sem migração aparecem repetidas quatro, três e quatro vezes no PRD; o passo de polimento pede consolidar e eu recusei, porque quem lê este documento depois carrega uma seção por vez, e uma regra escrita uma vez só é uma regra que alguém vai ler no lugar errado do arquivo. Se preferir consolidar, é uma decisão a tomar de propósito."
  - who: "agent:pm"
    at: 2026-08-20T18:06:45-03:00
    text: "Desenhei um mock estático das telas da Fase 1, listado em artifacts. Ele mostra a tela Registrar com cinco casos lado a lado: histórico aproveitável com a primeira série já confirmada, aviso de progressão, série extra sem correspondente marcada como primeira execução, exercício sem histórico nenhum (o caso vazio), e exercício de repetição não numérica onde o aviso de progressão não aparece, em silêncio. Mostra também a tela do Histórico no instante seguinte a salvar, com o lembrete de exportação. As cores são os tokens reais do :root de index.html; nada foi inventado. O mock faz quatro perguntas de desenho, escritas no rodapé dele: se a etiqueta de última execução distingue bem um valor recuperado de um digitado, se o aviso de primeira execução deve ser bloco ou etiqueta, se o aviso de progressão fica melhor acima da tabela ou ao lado do título, e se o lembrete de exportação incomoda."
  - who: "agent:pm"
    at: 2026-08-20T18:07:20-03:00
    text: "ROTA: gravei routeTo specs. Esta issue não precisa do caminho mais longo, porque as seis specs já existem, passaram na validação de planejamento e o relatório de prontidão diz que este é o único epic liberado para começar. Juarez optou por não rodar a checagem de prontidão de novo agora, e vale lembrar que o relatório atual descreve um PRD que já mudou. AVISO OPERACIONAL: durante esta sessão o prd.md foi revertido uma vez por algo fora deste workflow, e a seção de Requisitos Funcionais recém-gravada se perdeu; reconstitui e reconferi o arquivo, que terminou com 8 seções, 30 FR e 15 NFR. Se houver dois escritores nesse arquivo, isso pode se repetir."
  - who: "agent:pm"
    at: 2026-08-20T18:33:50-03:00
    text: "Juarez escolheu, entre três alternativas, fechar as pendências desta issue sem reabrir o PRD, que já estava completo com 591 linhas, 8 seções, 30 FR e 15 NFR. Não toquei em prd.md. Gravei routeTo specs e routeWhy no frontmatter: um comentário anterior dizia ter gravado essa rota, mas as duas linhas não estavam no arquivo, e agora estão. Levei a Juarez as quatro perguntas de desenho que o mock da Fase 1 deixou em aberto e ele respondeu manter em todas as quatro: a pílula de última execução fica como está, sem marca adicional dentro de cada campo; o aviso de primeira execução mantém os dois pesos, bloco quando o exercício não tem histórico nenhum e etiqueta na linha quando falta só aquela série; o aviso de progressão fica acima da tabela, porque empurrar as séries para baixo custa menos que o aviso passar batido; e o lembrete de exportação fica no mesmo gatilho e com o mesmo peso. Registrei as quatro respostas dentro do próprio mock, ao lado de cada pergunta, sem apagar as perguntas, para que o desenho continue dizendo o que foi considerado e não só o que foi decidido. DUAS COISAS QUE CONTINUAM EM ABERTO, e que não executei porque Juarez escolheu não reabrir o PRD nesta rodada: a divergência entre a prosa do Escopo, que diz que renomear um exercício apaga a memória dele, e o FR3, que aprova quatro apelidos que justamente não apagam; e a repetição proposital das regras do sw.js, dos dois HTML idênticos e do campo do checkmark em várias seções do PRD. As duas seguem propostas em palavras pelo PM anterior e nenhuma foi aplicada ao texto. AVISO: durante esta rodada a lista specs desta issue mudou sozinha entre a minha leitura e a minha gravação. A spec 1-1-confirm-only-performed-sets virou 1-1-confirm-and-undo-performed-sets mais a nova 1-7-save-only-confirmed-sets, e havia outro agente escrevendo nestes arquivos ao mesmo tempo. Minha edição preservou a lista nova, mas o aviso do PM anterior sobre dois escritores no mesmo arquivo se confirmou."
  - who: "agent:pm"
    at: 2026-08-21T10:58:19-03:00
    text: "Rodei o workflow create-prd para esta issue e parei no passo 1, na detecção de estado, porque o próprio estado já respondia o que a rodada faria. O prd.md desta feature já estava completo, com step-12-complete no stepsCompleted, 591 linhas, 8 seções, 30 FR e 15 NFR. O routeTo specs e o routeWhy já estavam gravados neste frontmatter. As 7 specs de epic-1 já existiam em .nexus/specs/epic-1/ e já haviam passado na validação de planejamento. O mock estático da Fase 1 já estava desenhado, listado em artifacts e com as quatro perguntas de desenho já respondidas dentro dele. Ou seja: não havia PRD para criar, rota para decidir nem tela para desenhar, e fazer qualquer um dos três seria refazer trabalho já feito. Levei os três caminhos possíveis a Juarez, encerrar sem tocar no PRD, reabrir o documento de propósito para tratar as pendências, ou refazer do zero, e ele escolheu encerrar sem tocar no PRD. Não alterei nenhum arquivo além deste comentário. CONTINUAM EM ABERTO as duas coisas que o PM anterior propôs em palavras e não aplicou: a divergência entre a prosa do Escopo do produto, que diz que renomear um exercício apaga a memória dele, e o FR3, que aprova quatro apelidos antigos que justamente não apagam, decididos depois daquela prosa; e a repetição proposital das regras do sw.js, dos dois HTML idênticos e do campo do checkmark em várias seções do PRD. AVISO: o implementation-readiness-report.md descreve um PRD anterior às últimas mudanças e está desatualizado. Rodar a checagem de prontidão de novo é decisão de Juarez, que já optou por não rodá-la na rodada anterior."
---

## Context

Juarez can open any exercise with reliable last-execution context, confirm only what he actually performs, preserve automatic rest, receive safe progression guidance, and protect the resulting local history. This issue owns Phase 1 and its mandatory five-day release gate.
## Acceptance Criteria

1. Every EPIC-1 story spec is implemented in order and its acceptance criteria pass.
2. FR1 through FR18 are delivered without breaking legacy records, offline use, timers, History, or exports.
3. The full-week validation spec records 100 percent usable-history prefill coverage and zero unconfirmed saved sets, lost values, checkmark-rest regressions, or false progression positives before EPIC-2 starts.
