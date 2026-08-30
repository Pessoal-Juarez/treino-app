# Backlog: Temporizador de isometria por série

| Metainformação | Valor |
| --- | --- |
| ID | BACKLOG-0007 |
| Status | Ready for specification |
| Produto | Treino Híbrido — Juarez |
| Épico | Execução do treino |
| Funcionalidade | Temporizador de isometria por série |
| Tipo | Funcionalidade |
| Prioridade | Média |
| Milestones | |
| Criado em | 2026-08-29 |
| Spec promovida | Nenhuma |

## Ideia original

Os exercícios que tem isometria como a prancha precisa ter o botão de play e ajuste do tempo. Também quero ver o mockup antes de aplicar.

## Problema percebido

A prancha existe no runner como série de 40–60 s, mas não tem um temporizador próprio que guie a duração da série.

## Pessoa afetada ou beneficiada

Juarez durante a tela ativa de treino.

## Resultado ou valor esperado

A pessoa consegue ajustar e iniciar o tempo da série isométrica, mantendo o descanso, carga e repetições como fluxos separados.

## Contexto

Mockup iOS 390x844 aprovado pelo Codex - Procurador: cartão após Ver Execução Correta e antes de Última Carga Registrada; 45 s inicial, play/pausa e ajuste por série.

## Referências relacionadas

- `specs/inbox/2026-08-29-063456-play-e-ajuste-de-tempo-para-isometria.md` — origem literal.
- `specs/mockups/0007-isometria-prancha-mobile.html` — mockup iOS 390×844 aprovado.
- `specs/completed/0001-redesign-ui-ux-typeform-timer/spec.md` — spec relacionada: runner e temporizador de descanso existente.
- `index.html` e `treino_hibrido_juarez_v3_standalone.html` — referências técnicas: `ex-prancha` e o cartão de descanso atual.

## Comportamento esperado

Na tela ativa de uma isometria, o runner apresenta um cartão de tempo da série
logo após `Ver Execução Correta` e antes de `Última Carga Registrada`. Para a
prancha, ele começa em 45 segundos, permite ajuste explícito para a série e
oferece play/pausa. A contagem da série é independente do temporizador de
descanso existente.

## Regras de negócio

- Aplicar o cartão somente a exercícios marcados explicitamente como isometria;
  `ex-prancha` é o caso inicial confirmado.
- O ajuste altera somente a duração da série corrente no treino ativo; não
  substitui `reps`, carga, repetições, RIR ou descanso.
- Play/pausa controla somente a contagem de isometria. O temporizador de
  descanso conserva o fluxo atual e não deve iniciar, pausar ou ser reiniciado
  por esse controle.
- O fim da contagem torna a série pronta para confirmação pelo fluxo de séries
  já existente; não cria uma confirmação automática nova.

## Critérios de aceitação

- Dado que a pessoa está na prancha, quando abre o exercício ativo, então vê
  um cartão de isometria após o vídeo e antes do último registro.
- Dado o cartão de isometria, quando ajusta 45 segundos e inicia a série,
  então a contagem regressiva reflete o tempo escolhido e pode ser pausada.
- Dado uma isometria em execução ou concluída, quando observa os controles
  existentes, então as séries e o temporizador de descanso preservam seus
  comportamentos e não recebem novas colunas de carga/repetições.

## Qualidades e operação

- Segurança: o tempo é numérico e local; a UI não interpreta texto persistido
  como HTML.
- Privacidade: não há novo dado pessoal nem sincronização externa.
- Desempenho e volume: um único temporizador da série ativa, limpo ao trocar
  de exercício ou encerrar o treino.
- Acessibilidade: alvos de play e ajuste com pelo menos 44 px e rótulos
  acessíveis; contraste e tokens do app atual.
- Auditoria e observabilidade: cobertura de testes para início, pausa, ajuste,
  fim, isolamento e paridade dos dois HTMLs.

## Dependências

- Mockup aprovado pelo Codex - Procurador em 2026-08-29, opção 1.
- O modelo de exercício precisa de uma marca explícita de isometria, sem
  inferir apenas pelo texto de `reps`.

## Situações de erro

- Se a duração não for válida, o play não inicia e a interface mantém um valor
  seguro e visível.
- Ao trocar de exercício ou sair do treino, qualquer intervalo da isometria é
  interrompido para não produzir efeitos em outro exercício.

## Escopo

- Dentro: prancha e futuros exercícios explicitamente marcados como isometria;
  cartão, ajuste e play/pausa da duração de série; paridade dos HTMLs.
- Fora: alterar o temporizador de descanso, criar colunas nas séries, mudar
  carga/repetições, notificações externas, dados remotos ou deploy.

## Dúvidas, decisões e riscos

- **Decisão confirmada — Codex - Procurador, 2026-08-29:** aprovada a opção 1:
  cartão no local do mockup, 45 s inicial para prancha, ajuste explícito por
  série e play/pausa; o descanso permanece separado.
- **Risco:** os dois HTMLs devem continuar funcionalmente idênticos apenas no
  bloco material da feature, sem apagar diferenças preexistentes.

## Pronto para desenvolvimento

- [x] O problema e a pessoa beneficiada estão claros.
- [x] O evento inicial e o resultado esperado estão claros.
- [x] Permissões, regras e exceções relevantes estão claras.
- [x] O resultado pode ser verificado objetivamente.
- [x] Segurança, privacidade e desempenho foram avaliados conforme o risco.
- [x] Fora de escopo, dependências e decisões pendentes estão registrados.

## Próximo passo

Promover para `$specsfy-03-specify`.
