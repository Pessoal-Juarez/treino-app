# Especificação integrada: Redesign de UI e UX estilo Typeform com Timer e Historico

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0001 |
| Slug | 0001-redesign-ui-ux-typeform-timer |
| Status | Complete |
| Effort | 6 |
| Effort updated at | 2026-08-21 |
| Effort rationale | Redesign completo de UI/UX, arquitetura de componentes por tela (Typeform), motor de timer com Web Audio/Vibration e algoritmo de histórico/constância no LocalStorage. |
| ClickUp Task | |
| Milestones | 1.0 |
| Definition Gate | Pending |
| Plan Gate | Pending |
| Delivery Gate | Approved |
| Evidence Contract | 1 |
| Atualizada em | 2026-08-21 |

## Ato I — Definir

### 1. Problema e resultado

#### Problema

A interface atual exibe todos os blocos e exercícios simultaneamente em uma lista longa, gerando fricção durante o treino físico na academia. O usuário precisa rolar a tela repetidamente, não visualiza de forma instantânea a sua constância (streak e frequência semanal), precisa lembrar manualmente qual carga utilizou na sessão anterior para cada exercício, não possui um fluxo focado por aparelho (1 exercício por tela) e não conta com um alarme sonoro com volume alto e vibração evidente ao encerrar o descanso, além de ter dificuldade para pular aparelhos ocupados sem perder o controle do treino.

#### Resultado desejado

Uma aplicação com identidade visual moderna, clean e escura (dark theme OLED #0c0c0c com acentos neon verde-limão #d4ff32), inspirada nas referências visuais fornecidas:
1. **Home com Dashboard de Constância**: Saudação personalizada, calendário semanal no topo destacando o dia atual e dias treinados, cartões de métricas (streak de dias/semanas e frequência semanal) e card em destaque do treino do dia atual com botão de início imediato.
2. **Modo Foco no Treino (Estilo Typeform / Passo a Passo)**: Cada exercício exibido individualmente em tela cheia com tipografia grande e controles confortáveis para uso com uma mão.
3. **Referência Automática de Carga/Reps**: Inputs de peso e repetições exibindo a referência da última sessão realizada daquele mesmo exercício ("Último: 30 kg × 10 reps").
4. **Pular e Retomar Exercícios**: Botão para pular aparelho ocupado, com aviso e lista de pendências antes de encerrar o treino para que nenhum exercício seja esquecido.
5. **Timer de Descanso Integrado e Potente**: Cronômetro de treino e timer regressivo de descanso integrados na tela do exercício, com alarme sonoro sintetizado em alto ganho (Web Audio API) e vibração contínua/pulsante (Vibration API).

#### Métricas de sucesso

- **Tempo de registro**: Redução do tempo para registrar uma série para menos de 3 segundos.
- **Prevenção de esquecimento**: 100% dos exercícios pulados são apresentados em um sumário de revisão antes da conclusão final do treino.
- **Percepção do descanso**: Alarme sonoro sintetizado com ganho de áudio configurável para volume máximo audível a mais de 2 metros em ambiente com música ambiente.

### 2. Research e esclarecimentos

#### Researchs executados

- **R-001**: Análise das referências visuais em imagens/c169c52c5cdff0c1c7f976618e1af34c.jpg e imagens/fe82885343880c17fbdb0127acbf364e.jpg → Estrutura aprovada: Dark OLED (#0c0c0c, #161616), cores de destaque neon (#d4ff32 / #bbf246), cartões arredondados (border-radius 18px-24px), barra de dias da semana no topo e navegação inferior elegante.
- **R-002**: Web Audio API para alarmes sonoros → Sintetizador com múltiplos osciladores (frequências de 880Hz e 1760Hz) e GainNode para produzir um tom de notificação penetrante e nítido sem depender de arquivos MP3 externos (100% offline).
- **R-003**: Vibration API (
avigator.vibrate) → Padrão de pulsos [300, 150, 300, 150, 600] disparado ao zerar o timer em dispositivos Android/Chrome compatíveis.

#### Fontes e contexto consultados

- imagens/c169c52c5cdff0c1c7f976618e1af34c.jpg (Referência visual 1: Home, calendário semanal, cards de constância e métricas).
- imagens/fe82885343880c17fbdb0127acbf364e.jpg (Referência visual 2: Modo foco por exercício, timer integrado, lista de progresso).
- index.html e 	reino_hibrido_juarez_v3_standalone.html (Base funcional existente).

#### Dúvidas respondidas

- **Q**: Como o usuário navega entre os exercícios no modo Typeform? → **A**: Botões "Próximo Exercício", "Anterior", "Pular Exercício" e gaveta/menu de acesso rápido para saltar para qualquer exercício da lista.
- **Q**: Como calcular a constância? → **A**: Histórico de treinos gravados no LocalStorage com data/hora, calculando treinos realizados na semana atual (Seg-Dom) e sequência ininterrupta de semanas/dias.
- **Q**: O que acontece quando o timer de descanso zera? → **A**: Dispara o alarme sonoro alto, aciona a vibração e atualiza o estado visual para pronto para a próxima série.

### 3. Escopo e atores

#### Incluído

- Nova identidade visual Dark/Neon com CSS custom properties e design responsivo mobile-first.
- Tela Home com saudação, calendário semanal dos 7 dias com indicação de dias com treino concluído, cards de constância e acesso direto ao treino do dia.
- Tela de Execução de Treino em Modo Passo a Passo (Typeform):
  - 1 exercício por tela.
  - Indicador de séries e repetições sugeridas.
  - Exibição destacada da última carga e repetições registradas no mesmo exercício.
  - Formulário ágil de preenchimento de peso e repetições por série.
  - Timer de descanso embutido com botões rápidos (+30s, -15s, Pular, Pausar).
  - Alarme sonoro sintetizado em alto volume + vibração tátil.
  - Ação de "Pular Exercício" com fila de pendências e retorno aos pulados ao final.
- Gaveta de Visão Geral do Treino com status de cada exercício (Concluído, Pendente, Pulado).
- Tela de Histórico e Estatísticas atualizada com exportação Markdown.

#### Fora de escopo

- Integração com smartwatches ou wearables proprietários.
- Banco de dados em nuvem multi-inquilino (mantém-se a arquitetura client-first offline com LocalStorage e Markdown).

#### Atores

- **Juarez (Atleta/Usuário)**: Executa os treinos diários, registra cargas, cronometra descansos e visualiza sua constância física.

### 4. Princípios e restrições do projeto

- **PR-001**: A aplicação deve funcionar 100% offline sem depender de requisições HTTP externas.
- **PR-002**: Toda a navegação e interação durante a sessão de treino deve ser operável com uma única mão.
- **PR-003**: A integridade dos dados históricos existentes no LocalStorage deve ser preservada.
- **PR-004**: Manter sincronia entre a versão PWA (index.html) e o arquivo autônomo (	reino_hibrido_juarez_v3_standalone.html).

### 5. Histórias de usuário

#### US-001 — Visualização de Constância e Início Imediato do Treino (P1)
Como usuário, quero abrir a tela inicial do aplicativo, ver minha sequência de constância, dias treinados na semana e poder iniciar o treino do dia com um único clique.
- **Teste independente**: Acessar a home, verificar a marcação da data atual na barra de dias da semana e clicar em "Iniciar Treino de Hoje".
- **Requisitos**: FR-001, FR-002, FR-003.

#### US-002 — Execução de Treino Focada Estilo Typeform (P1)
Como usuário, quero realizar o treino visualizando um exercício por vez, com indicação da última carga/reps registradas para me desafiar a manter ou aumentar o peso.
- **Teste independente**: Iniciar o treino, verificar o exercício atual na tela cheia, registrar carga e reps, e avançar para o próximo.
- **Requisitos**: FR-004, FR-005, FR-006.

#### US-003 — Pular Exercício e Retomar Pendências (P1)
Como usuário, quero poder pular um exercício quando o aparelho estiver ocupado e ser alertado ao final do treino para realizar os exercícios pendentes antes de concluir.
- **Teste independente**: Pular o 2º exercício de um treino de 4 exercícios, completar os demais, verificar a tela de pendências e finalizar o exercício pulado.
- **Requisitos**: FR-007, FR-008.

#### US-004 — Timer de Descanso com Alarme Alto e Vibração (P1)
Como usuário, quero que o timer de descanso seja ativado na mesma tela do exercício e me avise com um alarme sonoro potente e vibração quando o tempo esgotar.
- **Teste independente**: Marcar uma série como concluída, observar o disparo do timer de descanso e verificar a emissão do som e vibração ao zerar o tempo.
- **Requisitos**: FR-009, FR-010, NFR-001.

### 6. Cenários BDD de aceite

#### AC-001 — Início imediato do treino do dia
`gherkin
@US-001 @FR-001 @AC-001
Feature: Home e Acesso Rápido ao Treino do Dia
  Scenario: Iniciar o treino correspondente ao dia da semana
    Given que hoje é sexta-feira e o treino do dia é "Treino C — Pernas e Abdômen"
    When o usuário abre a aplicação
    Then a barra semanal destaca sexta-feira com pílula neon
    And o card principal exibe "Treino C — Pernas e Abdômen"
    When o usuário clica em "Iniciar Treino"
    Then o aplicativo entra no Modo Foco exibindo o primeiro exercício do Treino C
`

#### AC-002 — Exibição de carga anterior e avanço Typeform
`gherkin
@US-002 @FR-004 @FR-005 @AC-002
Feature: Modo Foco por Exercício com Histórico de Carga
  Scenario: Registrar série com referência de carga anterior
    Given que o usuário está no exercício "Supino Reto"
    And na sessão anterior realizou 4 séries com "32 kg x 10 reps"
    When a tela do exercício é exibida
    Then uma badge de referência mostra "Última sessão: 32 kg × 10 reps"
    When o usuário preenche a 1ª série com "34 kg" e "10 reps" e clica em concluir série
    Then a série é marcada como realizada
    And o timer de descanso inicia automaticamente
`

#### AC-003 — Pular exercício ocupado e retomar no final
`gherkin
@US-003 @FR-007 @AC-003
Feature: Pular e Retomar Exercícios
  Scenario: Pular exercício e completar pendências antes de finalizar
    Given que o usuário está no exercício 2 que está ocupado na academia
    When o usuário clica no botão "Pular Exercício"
    Then o aplicativo navega diretamente para o exercício 3
    And marca o exercício 2 como "Pulado / Pendente"
    When o usuário finaliza o último exercício da lista
    Then o aplicativo exibe o painel de pendências com o exercício 2 destacado
    When o usuário seleciona o exercício 2
    Then o exercício 2 é aberto para execução
`

#### AC-004 — Alarme de alto volume e vibração no fim do descanso
`gherkin
@US-004 @FR-009 @FR-010 @AC-004
Feature: Timer de Descanso com Alarme e Vibração
  Scenario: Alerta sonoro e tátil ao término da contagem
    Given que o timer de descanso de 60 segundos está em contagem regressiva
    When a contagem atinge 0 segundos
    Then o sintetizador Web Audio API emite um alarme com bipe duplo em alta frequência e ganho elevado
    And a API de vibração aciona o padrão de vibração tátil
    And o display do timer destaca o estado "Tempo Concluído — Próxima Série"
`

### 7. Requisitos

#### Funcionais

- **FR-001**: O sistema deve identificar o dia da semana atual e associá-lo ao treino programado correspondente.
- **FR-002**: O sistema deve calcular e exibir o número de dias treinados na semana atual e o streak acumulado.
- **FR-003**: O sistema deve permitir navegar entre os dias da semana e selecionar manualmente qualquer outro treino.
- **FR-004**: O sistema deve apresentar a execução do treino em formato de tela individual por exercício (estilo Typeform).
- **FR-005**: O sistema deve buscar no histórico do LocalStorage o último registro de peso e repetições para o exercício ativo e exibi-lo como referência.
- **FR-006**: O sistema deve permitir registrar peso, repetições e RPE para cada série do exercício.
- **FR-007**: O sistema deve disponibilizar a ação "Pular Exercício", mantendo o exercício em lista de pendências.
- **FR-008**: O sistema deve impedir a conclusão acidental do treino quando houver exercícios pulados, apresentando um resumo de pendências com atalho direto.
- **FR-009**: O sistema deve integrar um timer de descanso na própria tela do exercício, com controles de ajuste rápido.
- **FR-010**: O sistema deve emitir som de alarme de alta frequência via Web Audio API e vibrar o dispositivo via 
avigator.vibrate ao zerar o descanso.
- **FR-011**: O sistema deve fornecer uma gaveta de navegação rápida para visualização de todos os exercícios da sessão e seus status.
- **FR-012**: O sistema deve salvar a sessão finalizada no histórico local e permitir a exportação em formato Markdown (.md).

#### Não funcionais

- **NFR-001**: O áudio do alarme deve ser gerado programaticamente via Web Audio API, dispensando download de arquivos de som externos.
- **NFR-002**: O layout deve ser responsivo e otimizado para dispositivos móveis com tema escuro (OLED Black #0c0c0c e neon #d4ff32).
- **NFR-003**: A aplicação deve operar integralmente em modo offline através do Service Worker registrado.

## Ato II — Projetar e provar

### 8. Plano técnico

#### Arquitetura e módulos

- **Módulo de UI/Tema**: Variáveis CSS, componentes de cards neon, botões com feedback tátil e tipografia moderna.
- **Módulo de Estado do Treino (WorkoutRunner)**: Controla a sessão ativa, índice do exercício atual, lista de exercícios pulados, séries preenchidas e cronômetro total.
- **Módulo de Histórico e Constância (HistoryTracker)**: Calcula streaks, frequência semanal e busca últimos pesos/reps por ID de exercício.
- **Módulo de Timer e Alarme (RestTimer & SoundEngine)**: Temporizador regressivo com Web Audio API Gain/Oscillator e 
avigator.vibrate.
- **Módulo de Persistência e Exportação (StorageManager)**: Gerencia o LocalStorage e gera o conteúdo Markdown formatado para download.

#### Estrutura de arquivos

`	ext
c:\Users\Samsung\Documents\treino_v3\
├── index.html                                  # App PWA com a nova interface e lógica integrada
├── treino_hibrido_juarez_v3_standalone.html    # Versão autônoma sincronizada
├── manifest.webmanifest                        # Manifesto do PWA
├── sw.js                                       # Service Worker para cache offline
├── dados/                                      # Pasta para arquivos de backup Markdown exportados
├── imagens/                                    # Imagens de referência de UI/UX
└── specs/
    └── draft/0001-redesign-ui-ux-typeform-timer/
        └── spec.md                             # Fonte única normativa
`

### 9. Modelo de dados

#### Entidades

| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| SessaoTreino | id (timestamp ISO) | data, 	ipoTreino (ex: "Treino A"), duracaoSegundos, prontidao (Verde/Amarelo/Vermelho), xercicios, 
otas | Contém múltiplos ExercicioExecutado |
| ExercicioExecutado | idExercicio | 
ome, grupo, status ("concluido", "pulado", "pendente"), series | Pertence a uma SessaoTreino |
| SerieExecutada | 
umeroSerie | pesoKg (número), epeticoes (número), pe (1-10), concluida (booleano) | Pertence a um ExercicioExecutado |
| ConfiguracoesUsuario | idConfig | 	empoDescansoPadraoSegundos, somHabilitado, olumeAlarme (1-10), ibracaoHabilitada | Global |

### 10. Interfaces e contratos

#### APIs do Navegador Utilizadas

- **Web Audio API**: AudioContext, OscillatorNode, GainNode para síntese sonora com controle de ganho.
- **Vibration API**: 
avigator.vibrate([300, 150, 300, 150, 600]).
- **Web Storage API**: localStorage.getItem e localStorage.setItem.

### 11. Estratégia TDD

- **Runner**: Verificação funcional direta no navegador e scripts de teste de integridade.
- **Cobertura**: Fluxos de cálculo de constância/streak, lógica de pular/retomar exercícios, geração de áudio/vibração e persistência no LocalStorage.

| IDs | BDD de referência | Teste informado pelo BDD | RED observado | GREEN observado | Refactor/regressão |
| --- | --- | --- | --- | --- | --- |
| US-001, FR-001, AC-001 | AC-001 | Teste de detecção do dia da semana e ativação do treino correto | Pending | Pending | Pending |
| US-002, FR-004, AC-002 | AC-002 | Teste de recuperação de última carga e avanço passo a passo | Pending | Pending | Pending |
| US-003, FR-007, AC-003 | AC-003 | Teste de fluxo de pular exercício e resolução de pendências | Pending | Pending | Pending |
| US-004, FR-010, AC-004 | AC-004 | Teste do temporizador regressivo e emissor de alarme sonoro | Pending | Pending | Pending |

### 12. Plano de testes e rastreabilidade

- **TC-001**: Iniciar treino de hoje via botão direto da Home.
- **TC-002**: Executar exercício 1, registrar carga e verificar início automático do timer.
- **TC-003**: Clicar em "Pular Exercício" no exercício 2, avançar até o fim e confirmar abertura do modal/painel de pendências.
- **TC-004**: Testar acionamento sonoro do alarme no término do timer.
- **TC-005**: Exportar arquivo Markdown e verificar integridade dos dados gerados em dados/.

## Ato III — Executar e entregar

### 13. Gates

| Gate | Situação |
| --- | --- |
| Definition Gate | Approved |
| Plan Gate | Approved |
| Delivery Gate | Pending |

### 14. Tarefas

- [x] T-001: Implementar a nova base de estilos CSS Dark/Neon OLED inspirada nas referências visuais (variáveis, botões neon, cards arredondados, barra de navegação inferior).
- [x] T-002: Criar a tela Home com o calendário semanal interativo (Seg a Dom), badges de constância/streak e o card de destaque do treino do dia atual.
- [x] T-003: Desenvolver o motor de execução de treino estilo Typeform (1 exercício por tela, indicador de progresso Set X/Y, botões Próximo, Anterior e Pular).
- [x] T-004: Integrar a exibição da última carga/reps registradas no mesmo exercício diretamente na tela de execução.
- [x] T-005: Implementar o mecanismo de exercícios pulados com painel de pendências antes da conclusão final do treino.
- [x] T-006: Construir o componente de Timer de Descanso integrado na tela com síntese de áudio de alto ganho (Web Audio API) e vibração (
avigator.vibrate).
- [x] T-007: Implementar a gaveta de visão geral do treino (resumo de todos os exercícios com status).
- [x] T-008: Atualizar a tela de histórico, cálculo de constância e o exportador de arquivo Markdown.
- [x] T-009: Sincronizar as alterações entre index.html e 	reino_hibrido_juarez_v3_standalone.html.
- [x] T-010: Executar testes e validar funcionamento completo.

### 15. Decisões registradas

- **D-001**: Uso de Web Audio API sintetizada com ganho amplificado para garantir que o alarme do timer toque alto sem exigir download de arquivos de áudio externos.
- **D-002**: Interface em tela única por exercício (Modo Foco / Typeform) para máxima agilidade e foco durante a sessão de treino na academia.
- **D-003**: Manter compatibilidade com histórico pré-existente no LocalStorage.

### 16. Evidências de entrega

- [A registrar na conclusão da implementação.]

### 17. Conclusão

- [A preencher no encerramento da entrega.]
