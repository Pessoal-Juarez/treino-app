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
| Definition Gate | Passed |
| Plan Gate | Passed |
| Delivery Gate | Passed |
| Evidence Contract | 1 |
| Atualizada em | 2026-08-28 |

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

#### Artefatos de pesquisa armazenados

- `specs/completed/0001-redesign-ui-ux-typeform-timer/research/20260828-spec0001-mobile-ios-390x844-numeric-inputs.png`

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
- Exibição de unidade fixa `kg` exclusivamente ao lado dos campos de carga de cada série no modo Foco.

#### Fora de escopo

- Integração com smartwatches ou wearables proprietários.
- Banco de dados em nuvem multi-inquilino (mantém-se a arquitetura client-first offline com LocalStorage e Markdown).
- Alteração do prompt de peso corporal, do teclado, da validação de carga ou do formato persistido de sessões.

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
Como usuário, quero realizar o treino visualizando um exercício por vez, com indicação da última carga/reps registradas e a unidade `kg` fixa ao lado de cada carga, sem que a unidade faça parte do texto digitado.
- **Teste independente**: Iniciar o treino, verificar o exercício atual na tela cheia, digitar uma carga sem unidade, verificar `kg` fora do campo, recarregar uma carga legada terminada em `kg` e avançar para o próximo.
- **Requisitos**: FR-004, FR-005, FR-006, FR-013, NFR-004.

#### US-003 — Pular Exercício e Retomar Pendências (P1)
Como usuário, quero poder pular um exercício quando o aparelho estiver ocupado e ser alertado ao final do treino para realizar os exercícios pendentes antes de concluir.
- **Teste independente**: Pular o 2º exercício de um treino de 4 exercícios, completar os demais, verificar a tela de pendências e finalizar o exercício pulado.
- **Requisitos**: FR-007, FR-008.

#### US-004 — Timer de Descanso com Alarme Alto e Vibração (P1)
Como usuário, quero que o timer de descanso seja ativado na mesma tela do exercício e me avise com um alarme sonoro potente e vibração quando o tempo esgotar.
- **Teste independente**: Marcar uma série como concluída, observar o disparo do timer de descanso e verificar a emissão do som e vibração ao zerar o tempo.
- **Requisitos**: FR-009, FR-010, NFR-001.

#### US-005 — Exibição segura de dados locais (P1)
Como usuário, quero que meus dados persistidos sejam mostrados como texto, sem que conteúdo salvo possa ser interpretado como HTML ou script.
- **Teste independente**: Persistir texto com marcação HTML em histórico e perfil e confirmar que a interface o apresenta literalmente, sem criar elementos ou executar handlers.
- **Requisitos**: FR-014, NFR-005.

#### US-006 — Teclado numérico em entradas móveis (P1)
Como usuário, quero dicas de teclado adequadas nos campos numéricos e edição controlável das medidas, sem alterar contratos existentes.
- **Teste independente**: verificar inputmode, editor DOM, sequência, confirmação/cancelamento, persistência única e paridade.
- **Requisitos**: FR-015, FR-016, NFR-006.

### 6. Cenários BDD de aceite

#### AC-001 — Início imediato do treino do dia

**Cobre**: US-001, FR-001, FR-002, FR-003, NFR-002
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

**Cobre**: US-002, FR-004, FR-005, FR-006, NFR-002
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

**Cobre**: US-003, FR-007, FR-008
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

**Cobre**: US-004, FR-009, FR-010, NFR-001
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

#### AC-005 — Unidade visual fixa para carga por série

**Cobre**: US-002, FR-004, FR-005, FR-006, FR-013, NFR-002, NFR-004
`gherkin
@US-002 @FR-006 @FR-013 @NFR-002 @NFR-004 @AC-005
Feature: Carga por série com unidade visual fixa
  Scenario: Digitar e recuperar uma carga sem duplicar a unidade
    Given que o usuário está no Modo Foco em uma série com campo de carga
    When o usuário digita "32" no campo
    Then o value permanece "32"
    And o sufixo visual "kg" aparece fora do campo
    And o placeholder não contém "kg"
    When a carga legada exibida termina exatamente em " kg"
    Then a interface apresenta somente o valor sem esse único sufixo terminal
    And o sufixo visual "kg" continua visível
    And o peso corporal, o teclado, a validação e a persistência não são alterados
`

#### AC-006 — Home responsiva do treino programado

**Cobre**: US-001, FR-001, FR-002, FR-003, NFR-002

```gherkin
Scenario: Consultar a semana em tela móvel
  Given que a aplicação abre em largura móvel
  When o usuário consulta o calendário e as métricas
  Then vê o treino correspondente ao dia e pode selecionar outro treino
```

#### AC-007 — Início da ficha selecionada

**Cobre**: US-001, FR-001, FR-002, FR-003, NFR-002

```gherkin
Scenario: Iniciar a ficha mostrada no card
  Given que o card mostra uma ficha programada
  When o usuário inicia o treino
  Then o primeiro exercício da ficha é exibido em modo Foco
```

#### AC-009 — Registro por exercício no modo Foco

**Cobre**: US-002, FR-004, FR-005, FR-006, FR-013, NFR-002, NFR-004

```gherkin
Scenario: Registrar carga e repetições com referência
  Given que há histórico do exercício ativo
  When o usuário preenche uma série no modo Foco
  Then vê a referência anterior e pode concluir a série com carga e repetições
```

#### AC-010 — Compatibilidade visual da carga legada

**Cobre**: US-002, FR-004, FR-005, FR-006, FR-013, NFR-002, NFR-004

```gherkin
Scenario: Apresentar carga legada sem duplicar unidade
  Given que uma carga histórica termina em " kg"
  When ela é mostrada em um campo de série
  Then o campo exibe o valor normalizado uma vez e o sufixo externo kg
```

#### AC-013 — Pular aparelho durante a sessão

**Cobre**: US-003, FR-007, FR-008

```gherkin
Scenario: Adiar um aparelho ocupado
  Given que o exercício atual não pode ser usado
  When o usuário o pula
  Then o exercício fica pendente e o próximo é aberto
```

#### AC-014 — Resolver pendências antes de encerrar

**Cobre**: US-003, FR-007, FR-008

```gherkin
Scenario: Retomar exercício pulado
  Given que há exercício pendente ao final da sessão
  When o usuário escolhe retomá-lo
  Then a sessão abre o exercício pendente antes da conclusão
```

#### AC-016 — Descanso após série concluída

**Cobre**: US-004, FR-009, FR-010, NFR-001

```gherkin
Scenario: Controlar descanso integrado
  Given que uma série foi concluída
  When o descanso inicia
  Then o usuário pode ajustar, pausar ou pular a contagem na mesma tela
```

#### AC-017 — Aviso ao terminar o descanso

**Cobre**: US-004, FR-009, FR-010, NFR-001

```gherkin
Scenario: Concluir descanso
  Given que o cronômetro está em contagem regressiva
  When chega a zero
  Then o estado pronto é exibido e o alerta de áudio e vibração é acionado quando suportado
```

#### AC-019 — Visão geral da sessão

**Cobre**: US-003, FR-011

```gherkin
Scenario: Consultar status dos exercícios
  Given que uma sessão está ativa
  When o usuário abre a visão geral
  Then vê exercícios concluídos, pendentes e pulados
```

#### AC-020 — Navegar pela visão geral

**Cobre**: US-003, FR-011

```gherkin
Scenario: Abrir exercício pela visão geral
  Given que a visão geral lista a sessão
  When o usuário escolhe um exercício
  Then o modo Foco abre esse exercício
```

#### AC-021 — Atualização do status da visão geral

**Cobre**: US-003, FR-011

```gherkin
Scenario: Refletir série concluída
  Given que uma série é concluída
  When a visão geral é aberta
  Then seu status reflete o progresso atual
```

#### AC-022 — Histórico local offline

**Cobre**: FR-012, NFR-003

```gherkin
Scenario: Consultar histórico local
  Given que existem sessões salvas localmente
  When a aplicação está offline
  Then o histórico continua disponível
```

#### AC-023 — Exportar histórico local

**Cobre**: FR-012, NFR-003

```gherkin
Scenario: Baixar exportação Markdown
  Given que há sessões no histórico local
  When o usuário pede a exportação
  Then recebe um arquivo Markdown sem depender de servidor
```

#### AC-024 — Retomar PWA offline

**Cobre**: FR-012, NFR-003

```gherkin
Scenario: Reabrir a aplicação sem rede
  Given que o Service Worker está registrado
  When a aplicação é reaberta offline
  Then a interface e os dados locais permanecem acessíveis
```

#### AC-025 — Histórico persistido é texto seguro

**Cobre**: US-005, FR-014, NFR-005

```gherkin
Scenario: Renderizar nota malformada do histórico
  Given que uma sessão local contém uma nota com marcação HTML
  When o histórico é renderizado
  Then a marcação é exibida como texto
  And nenhum elemento ou handler injetado é criado
```

#### AC-026 — Perfil persistido é texto seguro

**Cobre**: US-005, FR-014, NFR-005

```gherkin
Scenario: Renderizar meta persistida do perfil
  Given que o perfil local contém uma meta com marcação HTML
  When o resumo de perfil é renderizado
  Then a meta é exibida como texto
  And nenhum elemento ou handler injetado é criado
```

#### AC-027 — Séries e identificadores persistidos são texto seguro

**Cobre**: US-005, FR-014, NFR-005

```gherkin
Scenario: Renderizar dados de exercício salvos
  Given que uma sessão local contém nome, carga ou identificador com caracteres de markup
  When o histórico é renderizado
  Then os dados são apresentados textualmente sem alterar a estrutura HTML
```

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
- **FR-013**: O sistema deve exibir `kg` como sufixo visual fixo e externo apenas nos campos de carga por série; o texto digitado e o placeholder não devem conter a unidade.
- **FR-014**: O sistema deve codificar como texto todos os dados persistidos antes de inseri-los nas renderizações HTML de histórico e perfil, inclusive valores usados em texto e atributos.
- **FR-015**: Campos textuais de carga e horas de sono declaram `inputmode="decimal"`, e repetições declaram `inputmode="numeric"`, sem alterar valores ou contratos persistidos.
- **FR-016**: Peso corporal e Cintura usam campos DOM textuais com `inputmode="decimal"`, rótulos associados e fluxo sequencial de confirmação/cancelamento com persistência única ao final.

#### Não funcionais

- **NFR-001**: O áudio do alarme deve ser gerado programaticamente via Web Audio API, dispensando download de arquivos de som externos.
- **NFR-002**: O layout deve ser responsivo e otimizado para dispositivos móveis com tema escuro (OLED Black #0c0c0c e neon #d4ff32).
- **NFR-003**: A aplicação deve operar integralmente em modo offline através do Service Worker registrado.
- **NFR-004**: A apresentação deve remover no máximo um sufixo terminal ` kg` de um valor legado apenas para exibição, sem alterar a persistência, a validação, o teclado ou o peso corporal.
- **NFR-005**: Nenhum dado proveniente do estado persistido pode criar markup, handler ou script quando a interface local o renderiza.
- **NFR-006**: A dica `inputmode` não adiciona `type=number`, `pattern`, `min`, `step` ou novas regras de validação/conversão; os dois HTMLs permanecem em paridade e acessíveis.

## Ato II — Projetar e provar

### 8. Plano técnico

#### Arquitetura e módulos

- **Módulo de UI/Tema**: Variáveis CSS, componentes de cards neon, botões com feedback tátil e tipografia moderna.
- **Módulo de Estado do Treino (WorkoutRunner)**: Controla a sessão ativa, índice do exercício atual, lista de exercícios pulados, séries preenchidas e cronômetro total.
- **Módulo de Histórico e Constância (HistoryTracker)**: Calcula streaks, frequência semanal e busca últimos pesos/reps por ID de exercício.
- **Módulo de Timer e Alarme (RestTimer & SoundEngine)**: Temporizador regressivo com Web Audio API Gain/Oscillator e 
avigator.vibrate.
- **Módulo de Persistência e Exportação (StorageManager)**: Gerencia o LocalStorage e gera o conteúdo Markdown formatado para download.
- **Componente de carga por série**: mantém o `input` com o valor cru e posiciona o sufixo visual `kg` fora dele; a normalização de apresentação remove no máximo um ` kg` terminal de valores legados, sem gravar a normalização.
- **Renderização segura de estado local**: histórico e perfil devem criar texto via nós DOM/`textContent` ou aplicar escaping contextual antes de qualquer HTML/atributo; a correção é limitada a saídas persistidas.
- **Evidência portátil**: o verificador de evidência deve comparar caminhos por `relative`/normalização de separadores no Windows, sem enfraquecer a contenção dentro da raiz.

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

#### AC-028 — Carga bruta ou legada com teclado decimal
**Cobre**: US-006, FR-015, NFR-006
```gherkin
Given uma carga textual bruta ou legada
When recebe foco
Then declara inputmode="decimal" sem alterar valor ou persistência
```
#### AC-029 — Repetições livres com teclado numérico
**Cobre**: US-006, FR-015, NFR-006
```gherkin
Given repetições textuais livres
When recebem foco
Then declaram inputmode="numeric" sem restringir entrada
```
#### AC-030 — Sono livre com teclado decimal
**Cobre**: US-006, FR-015, NFR-006
```gherkin
Given horas de sono textuais decimais
When recebem foco
Then declaram inputmode="decimal" sem conversão ou validação nova
```
#### AC-031 — Editor DOM acessível
**Cobre**: US-006, FR-016, NFR-006
```gherkin
Given o editor de medidas aberto
When Peso e Cintura são mostrados
Then são campos textuais com rótulos associados, inputmode="decimal", fonte >=16px, alvo >=44px e foco inicial
```
#### AC-032 — Confirmação sequencial de medidas
**Cobre**: US-006, FR-016, NFR-006
```gherkin
Given Peso e Cintura preenchidos
When confirmados
Then a ordem é Peso→Cintura, aplica Number(texto) e faz um único persist/render ao final
```
#### AC-033 — Cancelamento de Peso
**Cobre**: US-006, FR-016, NFR-006
```gherkin
Given Peso antes de Cintura
When Peso é cancelado
Then preserva o valor e continua para Cintura
```
#### AC-034 — Cancelamento de Cintura
**Cobre**: US-006, FR-016, NFR-006
```gherkin
Given Cintura após Peso
When Cintura é cancelada
Then preserva o valor e conclui com um único persist/render
```
#### AC-035 — Vazio e inválido
**Cobre**: US-006, FR-016, NFR-006
```gherkin
Given qualquer medida textual
When vazio ou inválido é confirmado
Then vazio vira 0 e inválido vira NaN em memória/null no JSON, sem regra nova
```
#### AC-036 — Paridade integral
**Cobre**: US-006, FR-016, NFR-006
```gherkin
Given os dois HTMLs
When campos, rótulos, foco, ações e persist/render são comparados
Then o contrato permanece equivalente
```

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
- **Contrato de carga por série**: entrada e placeholder não incluem unidade; `kg` é apresentado fora do `input`. Apenas na projeção visual de valor legado, remover um único ` kg` terminal. O prompt de peso corporal e as regras de teclado/validação/persistência permanecem inalterados.

### 11. Estratégia TDD

- **Runner**: Vitest 3.2.7, escolhido pela pessoa em 2026-08-26 e materializado em `package.json` por `test:tdd`; JSDOM é o boundary de DOM real instalado para este teste.
- **Cobertura**: Fluxos de cálculo de constância/streak, lógica de pular/retomar exercícios, geração de áudio/vibração e persistência no LocalStorage.

| IDs | BDD de referência | Teste informado pelo BDD | RED observado | GREEN observado | Refactor/regressão |
| --- | --- | --- | --- | --- | --- |
| US-001, FR-001, AC-001 | AC-001 | Teste de detecção do dia da semana e ativação do treino correto | Pending | Pending | Pending |
| US-002, FR-004, AC-002 | AC-002 | Teste de recuperação de última carga e avanço passo a passo | Pending | Pending | Pending |
| US-003, FR-007, AC-003 | AC-003 | Teste de fluxo de pular exercício e resolução de pendências | Pending | Pending | Pending |
| US-004, FR-010, AC-004 | AC-004 | Teste do temporizador regressivo e emissor de alarme sonoro | Pending | Pending | Pending |
| US-002, FR-006, FR-013, NFR-004, AC-005 | AC-005 | `tests/kg-suffix.test.js`: sufixo externo, placeholder sem unidade, remoção de exatamente um terminal ` kg` e caracterização de invariantes | RED válido: `vitest.cmd run tests/kg-suffix.test.js --no-cache --pool=forks --poolOptions.forks.singleFork --reporter=verbose` (exit 1); três falhas de comportamento e uma caracterização verde | GREEN: os quatro casos focais passaram após T020 (exit 0) | Nenhuma melhoria adicional: uma expressão local na projeção preserva o handler e evita ampliar o estado |
| US-001, FR-001, FR-002, FR-003, NFR-002, AC-007 | AC-007 | `tests/legacy-behaviors.test.js`: selecionar uma ficha no calendário e iniciar pelo card | RED válido: a ficha selecionada `Leg press` inicia `Barra fixa ou barra assistida` (exit 1) | Pending — depende da tarefa CODE T026 | Pending — regressão focal e completa previstas em T027 |

### 12. Plano de testes e rastreabilidade

- **TC-001**: Iniciar treino de hoje via botão direto da Home.
- **TC-002**: Executar exercício 1, registrar carga e verificar início automático do timer.
- **TC-003**: Clicar em "Pular Exercício" no exercício 2, avançar até o fim e confirmar abertura do modal/painel de pendências.
- **TC-004**: Testar acionamento sonoro do alarme no término do timer.
- **TC-005**: Exportar arquivo Markdown e verificar integridade dos dados gerados em dados/.
- **TC-006**: Digitar `32` na carga por série e verificar value `32`, placeholder sem unidade e sufixo visual `kg` externo.
- **TC-007**: Exibir `32 kg` legado e verificar a projeção `32` com um único sufixo externo `kg`; verificar que `32 kg kg` perde somente o sufixo terminal definido.
- **TC-008**: Verificar que o prompt de peso corporal, `inputmode`, validação e payload persistido permanecem inalterados.
- **TC-009**: AC-028 — carga bruta/legada e `inputmode="decimal"`.
- **TC-010**: AC-029 — repetições livres e `inputmode="numeric"`.
- **TC-011**: AC-030 — sono livre/decimal e `inputmode="decimal"`.
- **TC-012**: AC-031 — editor DOM de medidas, rótulos, foco e acessibilidade.
- **TC-013**: AC-032 — sequência Peso→Cintura, `Number(texto)` e persist/render único.
- **TC-014**: AC-033/AC-034 — cancelamento independente preserva valores e ordem.
- **TC-015**: AC-035 — vazio=0 e inválido NaN/null conforme caracterização.
- **TC-016**: AC-036 — paridade integral dos dois HTMLs.
- **TC-017**: regressão conjunta AC-028–AC-036 com Vitest/JSDOM.

| Requisito | Critérios | Nível | Comando | Evidência |
| --- | --- | --- | --- | --- |
| D-004 / T020 | AC-005 | Vitest/JSDOM focal no HTML real | `node node_modules/vitest/vitest.mjs run tests/kg-suffix.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism` | Passed — 4/4: sufixo externo, placeholder sem unidade, remoção de um único ` kg` terminal e caracterização de invariantes. |
| D-005 / T026 | AC-007 | Vitest/JSDOM focal e portal Desktop na origem temporária do worktree | `node node_modules/vitest/vitest.mjs run tests/legacy-behaviors.test.js --testNamePattern="starts the workout selected from the calendar" --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism` | Passed — 1/1 focal; no Desktop 1440, selecionar terça-feira e iniciar abriu `Leg press 45° ou hack squat`. |
| D-006 / T032 | AC-025, AC-026, AC-027 | Vitest/JSDOM de saída persistida no HTML real | `vitest.cmd run tests/security-output-escaping.test.js --no-cache --pool=forks --poolOptions.forks.singleFork --reporter=verbose` | Passed — 3/3: notas, meta do perfil e valores de exercício persistidos permanecem texto e não criam elementos HTML. |
| D-007 / T044 | AC-028, AC-029, AC-030 | Vitest focal de inputmode no HTML real | `node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism` | Passed — os três inputmode corretos, sem type=number, pattern, min ou step. |
| D-008 / T045/T048 | AC-031, AC-032, AC-033, AC-034, AC-035, AC-036 | Editor DOM, semântica e paridade | `node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism` | Passed — editor e semântica completos; paridade integral; captura móvel durável referenciada em research. |
| T035 | AC-001, AC-002, AC-003, AC-004, AC-006, AC-009, AC-010, AC-013, AC-014, AC-016, AC-017, AC-019, AC-020, AC-021, AC-022, AC-023, AC-024 | Vitest/JSDOM de cenários legados no HTML real | `vitest.cmd run tests/legacy-behaviors.test.js --no-cache --pool=forks --poolOptions.forks.singleFork --reporter=verbose` | Passed — 19/19; os 17 critérios residuais foram diretamente exercitados, sem falha funcional observada. |

## Ato III — Executar e entregar

### 13. Gates

| Gate | Situação |
| --- | --- |
| Definition Gate | Passed — auditoria substituta independente do teclado (2026-08-28). |
| Plan Gate | Passed — T038–T043 TDD concluídas e plano validado. |
| Delivery Gate | Passed — T048 e validações finais concluídas; checkpoint anterior Delivery Passed preservado como histórico. |

### 13. Validações

#### Gate do Ato I — Definição

- **Resultado**: Passed — auditoria substituta do teclado em 2026-08-28; o Passed de 2026-08-26 permanece histórico.
- **Evidência**: auditoria independente substituta de 2026-08-28 e `validate_spec` estrito retornaram `READY` para US-006, FR-015, FR-016, NFR-006 e AC-028–AC-036; a validação antiga de AC-006–AC-024 permanece apenas histórica.
- **Limite preservado**: Vitest foi decidido pela pessoa em 2026-08-26 e é o runner Node materializado; a decisão não altera a definição já aprovada.

#### Gate do Ato II — Plano

- **Resultado**: Passed — T038–T047 concluídas, regressão ampla verde (11/11 arquivos, 62/62 testes); aprovação histórica de T029–T037 preservada.

#### Gate do Ato III — Entrega

- **Resultado**: Passed — aceite, evidência móvel e validadores finais verdes; o checkpoint anterior de Delivery Passed permanece preservado como histórico.

#### Achados da revisão

- **FIND-SEC-001** [P1] [Resolved] Dados persistidos de histórico eram interpolados em `innerHTML` sem escaping — Refs: FR-014, NFR-005, AC-025, AC-026, AC-027 — Evidence: tests/security-output-escaping.test.js — Effect: marcação persistida deixou de criar elementos no histórico e no perfil; os três REDs estão verdes. — Suggestion: manter a construção por nós DOM e `textContent` para valores persistidos.

### 14. Tarefas

#### Registro histórico preservado

Os itens `T-001` a `T-014` abaixo são a linha do tempo encontrada no repositório. Eles não obedecem ao formato canônico `TNNN`, não possuem predecessores TDD nem evidência executável; são preservados como histórico e não declaram retroativamente RED ou GREEN.

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
- [ ] T-011 [TEST]: Após decisão humana do runner Node, materializar testes derivados de TC-006 a TC-008 com marcadores `SPECSFY:` e registrar RED válido.
- [ ] T-012 [CODE]: Nos dois HTMLs sincronizados, renderizar sufixo visual fixo `kg` apenas nos campos de carga por série, preservando value, placeholder, handler e persistência.
- [ ] T-013 [CODE]: Aplicar somente na exibição a remoção de um ` kg` terminal de carga legada, sem tocar no peso corporal, teclado ou validação.
- [ ] T-014 [VERIFY]: Executar testes, checar paridade dos dois HTMLs e validar os critérios de aceite de AC-005.

#### Fase de interface — RED TDD informado pelo BDD

- [x] T001 [TEST] [TDD] [US-001] Derivar AC-001 no HTML real em `tests/home-workout.test.mjs` — Refs: US-001, FR-001, FR-002, FR-003, NFR-002, AC-001 — Depends: none
  - [x] **PREP**: Ler AC-001 e confirmar dia e ficha no DOM real.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T002 [TEST] [TDD] [US-002] Derivar AC-002 no HTML real em `tests/runner-history.test.mjs` — Refs: US-002, FR-004, FR-005, FR-006, NFR-002, AC-002 — Depends: none
  - [x] **PREP**: Ler AC-002 e preparar histórico local isolado.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T003 [TEST] [TDD] [US-003] Derivar AC-003 no HTML real em `tests/runner-skips.test.mjs` — Refs: US-003, FR-007, FR-008, AC-003 — Depends: none
  - [x] **PREP**: Ler AC-003 e confirmar estado de exercício pulado.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T004 [TEST] [TDD] [US-004] Derivar AC-004 no HTML real em `tests/rest-timer.test.mjs` — Refs: US-004, FR-009, FR-010, NFR-001, AC-004 — Depends: none
  - [x] **PREP**: Ler AC-004 e delimitar adaptadores de áudio e vibração.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T005 [TEST] [TDD] [US-002] Derivar AC-005 em `tests/kg-suffix.test.js` — Refs: US-002, FR-004, FR-005, FR-006, FR-013, NFR-002, NFR-004, AC-005 — Depends: none
  - [x] **PREP**: Ler AC-005, TC-006 a TC-008 e confirmar Vitest no `package.json`.
  - [x] **EXECUTE**: Escrever três REDs comportamentais e uma caracterização verde no HTML real.
  - [x] **VERIFY**: Observar sufixo externo ausente, placeholder com unidade e legado sem normalização; confirmar invariantes verdes.
  - [x] **EVIDENCE**: Registrar `npm run test:tdd -- --reporter=verbose tests/kg-suffix.test.js`, saída 1, e TC-006 a TC-008.
  - [x] **IMPROVE**: Aplicar `window.close()` após cada caso para encerrar o interval real; nenhuma produção mudou.
  <!-- specsfy:evidence {"task":"T005","refs":["US-002","FR-004","FR-005","FR-006","FR-013","NFR-002","NFR-004","AC-005"],"files":["tests/kg-suffix.test.js"],"commands":[{"run":"npm run test:tdd -- --reporter=verbose tests/kg-suffix.test.js","exit":1}]} -->
- [x] T006 [TEST] [TDD] [US-001] Derivar AC-006 no HTML real em `tests/home-workout.test.mjs` — Refs: US-001, FR-001, FR-002, FR-003, NFR-002, AC-006 — Depends: none
  - [x] **PREP**: Ler AC-006 e delimitar a Home responsiva.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T007 [TEST] [TDD] [US-001] Derivar AC-007 no HTML real em `tests/home-workout.test.mjs` — Refs: US-001, FR-001, FR-002, FR-003, NFR-002, AC-007 — Depends: none
  - [x] **PREP**: Ler AC-007 e confirmar a ficha selecionada.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T008 [TEST] [TDD] [US-002] Derivar AC-009 no HTML real em `tests/runner-history.test.mjs` — Refs: US-002, FR-004, FR-005, FR-006, FR-013, NFR-002, NFR-004, AC-009 — Depends: none
  - [x] **PREP**: Ler AC-009 e confirmar campos por série do runner.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T009 [TEST] [TDD] [US-002] Derivar AC-010 no HTML real em `tests/runner-history.test.mjs` — Refs: US-002, FR-004, FR-005, FR-006, FR-013, NFR-002, NFR-004, AC-010 — Depends: none
  - [x] **PREP**: Ler AC-010 e preparar valor legado conhecido em LocalStorage.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T010 [TEST] [TDD] [US-003] Derivar AC-013 no HTML real em `tests/runner-skips.test.mjs` — Refs: US-003, FR-007, FR-008, AC-013 — Depends: none
  - [x] **PREP**: Ler AC-013 e selecionar exercício pendente.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T011 [TEST] [TDD] [US-003] Derivar AC-014 no HTML real em `tests/runner-skips.test.mjs` — Refs: US-003, FR-007, FR-008, AC-014 — Depends: none
  - [x] **PREP**: Ler AC-014 e preparar pendência antes do encerramento.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T012 [TEST] [TDD] [US-004] Derivar AC-016 no HTML real em `tests/rest-timer.test.mjs` — Refs: US-004, FR-009, FR-010, NFR-001, AC-016 — Depends: none
  - [x] **PREP**: Ler AC-016 e controlar relógio apenas no boundary do timer.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T013 [TEST] [TDD] [US-004] Derivar AC-017 no HTML real em `tests/rest-timer.test.mjs` — Refs: US-004, FR-009, FR-010, NFR-001, AC-017 — Depends: none
  - [x] **PREP**: Ler AC-017 e delimitar transição do descanso concluído.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T014 [TEST] [TDD] [US-003] Derivar AC-019 no HTML real em `tests/overview.test.mjs` — Refs: US-003, FR-011, AC-019 — Depends: none
  - [x] **PREP**: Ler AC-019 e preparar status distintos no runner.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T015 [TEST] [TDD] [US-003] Derivar AC-020 no HTML real em `tests/overview.test.mjs` — Refs: US-003, FR-011, AC-020 — Depends: none
  - [x] **PREP**: Ler AC-020 e preparar a gaveta de visão geral.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T016 [TEST] [TDD] [US-003] Derivar AC-021 no HTML real em `tests/overview.test.mjs` — Refs: US-003, FR-011, AC-021 — Depends: none
  - [x] **PREP**: Ler AC-021 e alterar série pelo controle real do runner.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T017 [TEST] [TDD] Derivar AC-022 no HTML real em `tests/history-offline.test.mjs` — Refs: FR-012, NFR-003, AC-022 — Depends: none
  - [x] **PREP**: Ler AC-022 e preparar LocalStorage vazio em origem descartável.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T018 [TEST] [TDD] Derivar AC-023 no HTML real em `tests/history-offline.test.mjs` — Refs: FR-012, NFR-003, AC-023 — Depends: none
  - [x] **PREP**: Ler AC-023 e preparar sessão local sem dados pessoais reais.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.
- [x] T019 [TEST] [TDD] Derivar AC-024 no HTML real em `tests/history-offline.test.mjs` — Refs: FR-012, NFR-003, AC-024 — Depends: none
  - [x] **PREP**: Ler AC-024 e limitar teste ao contrato de retomada offline.
  - [x] **EXECUTE**: Escrever caso Vitest com marcador próprio `SPECSFY:`.
  - [x] **VERIFY**: Observar RED ou caracterização da lacuna confirmada.
  - [x] **EVIDENCE**: Registrar comando, saída e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar se o boundary DOM foi suficiente.

<!-- specsfy:evidence {"task":"T001","refs":["US-001","FR-001","FR-002","FR-003","NFR-002","AC-001"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T002","refs":["US-002","FR-004","FR-005","FR-006","NFR-002","AC-002"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T003","refs":["US-003","FR-007","FR-008","AC-003"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T004","refs":["US-004","FR-009","FR-010","NFR-001","AC-004"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T006","refs":["US-001","FR-001","FR-002","FR-003","NFR-002","AC-006"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T007","refs":["US-001","FR-001","FR-002","FR-003","NFR-002","AC-007"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":1}]} -->
<!-- specsfy:evidence {"task":"T008","refs":["US-002","FR-004","FR-005","FR-006","FR-013","NFR-002","NFR-004","AC-009"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T009","refs":["US-002","FR-004","FR-005","FR-006","FR-013","NFR-002","NFR-004","AC-010"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":1}]} -->
<!-- specsfy:evidence {"task":"T010","refs":["US-003","FR-007","FR-008","AC-013"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T011","refs":["US-003","FR-007","FR-008","AC-014"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T012","refs":["US-004","FR-009","FR-010","NFR-001","AC-016"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T013","refs":["US-004","FR-009","FR-010","NFR-001","AC-017"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T014","refs":["US-003","FR-011","AC-019"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T015","refs":["US-003","FR-011","AC-020"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T016","refs":["US-003","FR-011","AC-021"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T017","refs":["FR-012","NFR-003","AC-022"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T018","refs":["FR-012","NFR-003","AC-023"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->
<!-- specsfy:evidence {"task":"T019","refs":["FR-012","NFR-003","AC-024"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"npm run test:tdd -- tests/legacy-behaviors.test.js","exit":0}]} -->

#### Fase final — implementação autorizável somente para kg

- [x] T020 [CODE] [US-002] Alterar `index.html` e `treino_hibrido_juarez_v3_standalone.html` para AC-005: sufixo externo, placeholder sem unidade e projeção de um ` kg` terminal — Refs: US-002, FR-006, FR-013, NFR-004, AC-005 — Depends: T023, T024, T025
  - [x] **PREP**: Confirmar os três REDs de AC-005 e a paridade inicial dos HTMLs.
  - [x] **EXECUTE**: Aplicar a menor mudança nos dois HTMLs, sem tocar peso corporal, teclado, validação ou persistência.
  - [x] **VERIFY**: Executar a suíte focal até GREEN e comparar os dois HTMLs.
  - [x] **EVIDENCE**: `verify_evidence.mjs specs/planned/0001-redesign-ui-ux-typeform-timer/spec.md . --task T020` retornou `PASSED (strict)` com a raiz do worktree explícita; Vitest focal passou 4/4. A vinculação material e a aceitação da entrega permanecem pendentes da revalidação independente do pacote ampliado.
  - [x] **IMPROVE**: Nenhuma melhoria adicional: a projeção local preserva o estado e evita duplicação de fluxo.
- [x] T021 [TEST] [US-002] Executar regressão focal e full-chain em `tests/kg-suffix.test.js` após T020 — Refs: US-002, FR-006, FR-013, NFR-004, AC-005 — Depends: T020
  - [x] **PREP**: Confirmar T020 como a única mudança de produção autorizada.
  - [x] **EXECUTE**: Executar Vitest focal, regressão e rastreabilidade full-chain.
  - [x] **VERIFY**: Confirmar os três GREENs e invariantes caracterizados.
  - [x] **EVIDENCE**: Registrar comandos, saídas e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar melhoria aplicada ou justificar ausência.
- [x] T022 [DOC] [US-002] Reconstruir `docs/` e `.specsfy/PACKAGES.md` após T020 — Refs: US-002, FR-006, FR-013, NFR-004, AC-005 — Depends: T020
  - [x] **PREP**: Confirmar o escopo de AC-005 e o manifest atual.
  - [x] **EXECUTE**: Executar documentator e monitor sem mudar regras ou banco.
  - [x] **VERIFY**: Confirmar `--check` e monitor `CURRENT`.
  - [x] **EVIDENCE**: Registrar comandos, saídas e IDs nas seções 11–13.
  - [x] **IMPROVE**: Registrar melhoria aplicada ou justificar ausência.

- [x] T023 [TEST] [TDD] [US-002] Registrar RED do sufixo externo em `tests/kg-suffix.test.js` — Refs: US-002, FR-006, FR-013, NFR-004, AC-005 — Depends: none
  - [x] **PREP**: Confirmar AC-005 e o campo de carga do runner.
  - [x] **EXECUTE**: Executar caso do sufixo externo no HTML real.
  - [x] **VERIFY**: Observar ausência de `.series-load-suffix` como RED comportamental.
  - [x] **EVIDENCE**: Registrar Vitest focal com saída 1.
  - [x] **IMPROVE**: Usar `window.close()` para limpar timer real.
- [x] T024 [TEST] [TDD] [US-002] Registrar RED do placeholder sem unidade em `tests/kg-suffix.test.js` — Refs: US-002, FR-006, FR-013, NFR-004, AC-005 — Depends: none
  - [x] **PREP**: Confirmar AC-005 e placeholder atual.
  - [x] **EXECUTE**: Executar caso de placeholder no HTML real.
  - [x] **VERIFY**: Observar `Ex: 32 kg` recebido como RED comportamental.
  - [x] **EVIDENCE**: Registrar Vitest focal com saída 1.
  - [x] **IMPROVE**: Usar `window.close()` para limpar timer real.
- [x] T025 [TEST] [TDD] [US-002] Registrar RED da projeção legada em `tests/kg-suffix.test.js` — Refs: US-002, FR-006, FR-013, NFR-004, AC-005 — Depends: none
  - [x] **PREP**: Injetar `12 kg kg` no LocalStorage isolado.
  - [x] **EXECUTE**: Executar caso de remoção de exatamente um terminal no HTML real.
  - [x] **VERIFY**: Observar `12 kg kg` recebido como RED comportamental.
  - [x] **EVIDENCE**: Registrar Vitest focal com saída 1.
  - [x] **IMPROVE**: Usar `window.close()` para limpar timer real.
<!-- specsfy:evidence {"task":"T023","refs":["US-002","FR-006","FR-013","NFR-004","AC-005"],"files":["tests/kg-suffix.test.js"],"commands":[{"run":"npm run test:tdd -- tests/kg-suffix.test.js","exit":1}]} -->
<!-- specsfy:evidence {"task":"T024","refs":["US-002","FR-006","FR-013","NFR-004","AC-005"],"files":["tests/kg-suffix.test.js"],"commands":[{"run":"npm run test:tdd -- tests/kg-suffix.test.js","exit":1}]} -->
<!-- specsfy:evidence {"task":"T025","refs":["US-002","FR-006","FR-013","NFR-004","AC-005"],"files":["tests/kg-suffix.test.js"],"commands":[{"run":"npm run test:tdd -- tests/kg-suffix.test.js","exit":1}]} -->
<!-- specsfy:evidence {"task":"T020","refs":["US-002","FR-006","FR-013","NFR-004","AC-005"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/kg-suffix.test.js"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/kg-suffix.test.js --reporter=dot --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":0},{"run":"git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html","exit":0},{"run":"node .agents/skills/specsfy-07-implement/scripts/verify_evidence.mjs specs/in-progress/0001-redesign-ui-ux-typeform-timer/spec.md . --task T020","exit":0}]} -->

#### Fase adicional autorizada — corrigir AC-007

- [x] T026 [CODE] [US-001] Corrigir `index.html` e `treino_hibrido_juarez_v3_standalone.html` para iniciar o treino com a ficha selecionada no calendário e no card — Refs: US-001, FR-001, FR-002, FR-003, NFR-002, AC-007 — Depends: T001, T006, T007
  - [x] **PREP**: RED T007 reproduzido no HTML real; os HTMLs possuíam SHA-256 idêntico antes da alteração.
  - [x] **EXECUTE**: `selectedHomeWorkoutKey` é definido pelo calendário e preferido por `startTodayWorkout`, sem alterar outros fluxos.
  - [x] **VERIFY**: Caso focal AC-007 GREEN e a seleção de terça-feira abriu Leg press no portal Desktop da origem temporária. A interação física Mobile precisa ser repetida quando o portal renderizar.
  - [x] **EVIDENCE**: Produção e GREEN registrados abaixo, mas `validate_tasks.mjs` e `verify_evidence.mjs --task T026` retornaram exit 1 no Windows ao rejeitar os arquivos materiais existentes por normalização de separadores. Não declarar a tarefa formalmente concluída.
  - [x] **IMPROVE**: Nenhuma melhoria adicional: uma única chave de seleção evita duplicar a resolução de dia ou ampliar o estado persistido.
- [x] T027 [TEST] [US-001] Executar `tests/legacy-behaviors.test.js`, regressão focal e suíte Vitest completa após T026 — Refs: US-001, FR-001, FR-002, FR-003, NFR-002, AC-007 — Depends: T026
  - [x] **PREP**: GREEN focal de AC-007 e escopo limitado a T026 confirmados; resultado real preservado, mas estado formal reaberto enquanto T026 está aberta.
  - [x] **EXECUTE**: Foco AC-007, `tests/kg-suffix.test.js`, suíte Vitest e `check_traceability --full-chain` já executados com sucesso; reaberto somente por dependência de T026.
  - [x] **VERIFY**: Suíte completa 22/22, sem falha fora da tarefa aprovada; prova preservada na seção de evidências.
  - [x] **EVIDENCE**: Saídas e limite material de validação registrados abaixo; conclusão formal bloqueada pela dependência T026.
  - [x] **IMPROVE**: Nenhum refactor de teste necessário; o oráculo RED original foi preservado.
- [x] T028 [DOC] [US-001] Reconstruir `docs/` e `.specsfy/PACKAGES.md` após T026 — Refs: US-001, FR-001, FR-002, FR-003, NFR-002, AC-007 — Depends: T026
  - [x] **PREP**: Manifest e fontes T026 confirmados, sem alteração de dependências; estado formal reaberto enquanto T026 está aberta.
  - [x] **EXECUTE**: Setup local, documentator e `--check` já executados com sucesso; reaberto somente por dependência de T026.
  - [x] **VERIFY**: Documentação compatível e monitor `CURRENT`; prova preservada na seção de evidências.
  - [x] **EVIDENCE**: Comandos, paridade e validação por portal registrados abaixo; conclusão formal bloqueada pela dependência T026.
  - [x] **IMPROVE**: Nenhuma mudança documental manual necessária; a projeção reconstruída já representa o sistema.

#### Evidências T026–T028 (2026-08-26)

- RED preservado: `vitest.cmd run tests/legacy-behaviors.test.js -t "starts the workout selected from the calendar" --no-cache --pool=forks --poolOptions.forks.singleFork --reporter=verbose` retornou exit 1 com `Barra fixa ou barra assistida` em vez de `Leg press`.
- GREEN focal: o mesmo comando retornou exit 0 após T026; `tests/kg-suffix.test.js` retornou 4/4 verdes e a suíte completa retornou 23/23 verdes.
- Caracterização explícita do fallback: sem chamar `onCalendarDayClick`, o novo caso fixa terça-feira (`2026-08-25`) na janela JSDOM, chama `startTodayWorkout` e recebeu `Leg press` imediatamente (exit 0, 1/1). Trata-se de comportamento preexistente, sem RED fabricado nem produção alterada.
- Rastreabilidade: `check_traceability.mjs ... --full-chain` retornou 40/40 IDs e `RESULTADO: OK`.
- Documentação: `setup_context.mjs`, `build_documentation.mjs`, `build_documentation.mjs --check` e `monitor_context.mjs --check` retornaram exit 0/CURRENT.
- Paridade: `git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html` retornou exit 0; ambos possuem SHA-256 atual `EBACCDA436B8055C90081193FDC3E1A0AC4B763D3528DEC1743D21901266899D` após T026. O SHA `A830B92801D176999CBC9DFC31A7DC5FDCE8EFD9AE14E5800620ABD23F84F2ED` é somente o baseline pré-T026.
- Portais: Desktop 1440×900 e Mobile 390×844/iOS selecionaram terça-feira e abriram `Leg press 45° ou hack squat`; `scrollWidth` foi igual ao viewport e logs não tiveram erro. Screenshots foram tentados, mas indisponíveis porque as janelas estavam minimizadas; snapshots/DOM foram coletados.
- Gate material: `validate_tasks.mjs` e `verify_evidence.mjs ... --task T026` retornaram exit 1 no Windows, rejeitando `index.html`, `treino_hibrido_juarez_v3_standalone.html` e `tests/legacy-behaviors.test.js` como inexistentes/inseguros apesar de existirem. A limitação governada permanece sem alteração de `.agents`; T026 fica formalmente aberta somente em **EVIDENCE**.
- Documentação: o primeiro `build_documentation.mjs --check` retornou exit 1 com `Documentação desatualizada: docs/application.md` após o novo teste. No fechamento local autorizado, `build_documentation.mjs --project .` e a repetição com `--check` retornaram exit 0; a projeção de `docs/` e `.specsfy/PACKAGES.md` foi atualizada, sem produção alterada.

<!-- specsfy:evidence {"task":"T026","refs":["US-001","FR-001","FR-002","FR-003","NFR-002","AC-007"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/legacy-behaviors.test.js","docs/application.md",".specsfy/PACKAGES.md"],"commands":[{"run":"vitest.cmd run tests/legacy-behaviors.test.js -t starts-the-workout-selected-from-the-calendar --no-cache --pool=forks --poolOptions.forks.singleFork --reporter=verbose","exit":0},{"run":"vitest.cmd run tests/legacy-behaviors.test.js -t falls-back-to-the-current-programmed-workout-when-no-calendar-workout-is-selected --no-cache --pool=forks --poolOptions.forks.singleFork --reporter=verbose","exit":0},{"run":"vitest.cmd run --no-cache --pool=forks --poolOptions.forks.singleFork --reporter=verbose","exit":0},{"run":"build_documentation.mjs --project .","exit":0},{"run":"build_documentation.mjs --project . --check","exit":0},{"run":"git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html","exit":0},{"run":"monitor_context.mjs --project . --check","exit":0}]} -->

#### Fase de segurança, ferramenta e aceite autorizada

- [x] T029 [TEST] [TDD] [US-005] Registrar REDs de saída persistida sem escaping em `tests/security-output-escaping.test.js` — Refs: US-005, FR-014, NFR-005, AC-025 — Depends: none
  - [x] **PREP**: Injetar estado local descartável com markup em histórico.
  - [x] **EXECUTE**: Renderizar o HTML real em JSDOM e exigir texto seguro, sem elemento injetado.
  - [x] **VERIFY**: RED: `HTMLImageElement` injetado no histórico.
  - [x] **EVIDENCE**: Vitest focal exit 1 registrado abaixo.
  - [x] **IMPROVE**: Limitar o teste à superfície de saída persistida.
- [x] T030 [TEST] [TDD] [US-005] Registrar RED de perfil persistido sem escaping em `tests/security-output-escaping.test.js` — Refs: US-005, FR-014, NFR-005, AC-026 — Depends: none
  - [x] **PREP**: Injetar meta de perfil com markup em origem JSDOM descartável.
  - [x] **EXECUTE**: Exigir saída textual no resumo de perfil do HTML real.
  - [x] **VERIFY**: RED: `SVGSVGElement` injetado no perfil.
  - [x] **EVIDENCE**: Vitest focal exit 1 registrado abaixo.
  - [x] **IMPROVE**: Não alterar semântica de peso corporal ou perfil.
- [x] T031 [TEST] [TDD] [US-005] Registrar RED de séries/identificadores persistidos sem escaping em `tests/security-output-escaping.test.js` — Refs: US-005, FR-014, NFR-005, AC-027 — Depends: none
  - [x] **PREP**: Preparar sessão descartável com dados de exercício contendo markup.
  - [x] **EXECUTE**: Exigir estrutura HTML intacta e conteúdo textual no histórico real.
  - [x] **VERIFY**: RED: elemento `<b>` injetado pela série persistida.
  - [x] **EVIDENCE**: Vitest focal exit 1 registrado abaixo.
  - [x] **IMPROVE**: Cobrir somente dados persistidos, não regras do treino.
- [x] T032 [CODE] [US-005] Corrigir `index.html` e `treino_hibrido_juarez_v3_standalone.html` para saída segura de dados persistidos — Refs: US-005, FR-014, NFR-005, AC-025, AC-026, AC-027 — Depends: T029, T030, T031
  - [x] **PREP**: Confirmados os três REDs de segurança em JSDOM e a paridade inicial dos HTMLs; causa raiz: valores persistidos entram em `innerHTML` no histórico e no perfil.
  - [x] **EXECUTE**: Substituídas as interpolações persistidas por nós DOM com `textContent`; o botão de exclusão agora recebe listener, sem texto persistido em atributo/JavaScript.
  - [x] **VERIFY**: `tests/security-output-escaping.test.js` GREEN 3/3; fluxos existentes e paridade foram preservados.
  - [x] **EVIDENCE**: Comandos, paridade, monitor e documentação estão registrados no comentário T032.
  - [x] **IMPROVE**: Nenhuma ampliação: somente a superfície de dados persistidos coberta pelos REDs foi alterada.
- [x] T033 [TEST] [TDD] Registrar RED de portabilidade em `tests/verify-evidence-windows.test.js` para `verify_evidence.mjs` — Refs: FR-014, NFR-005, AC-025 — Depends: none
  - [x] **PREP**: Criar fixture temporária com tarefa CODE concluída, arquivo existente e raiz Windows.
  - [x] **EXECUTE**: Exigir que o verificador aceite caminhos seguros dentro da raiz.
  - [x] **VERIFY**: RED: arquivo `artifact.txt` seguro foi rejeitado por normalização Windows.
  - [x] **EVIDENCE**: Vitest focal exit 1 sem alterar `.agents`.
  - [x] **IMPROVE**: Fixture temporária é removida após cada teste.
- [x] T034 [OPS] Corrigir `.agents/skills/specsfy-07-implement/scripts/verify_evidence.mjs` para normalização segura de caminhos Windows — Refs: FR-014, NFR-005, AC-025 — Depends: T033
  - [x] **PREP**: Confirmado RED T033: prefixo com `/` após `resolve()` rejeita arquivo seguro em raiz Windows; a correção preservará a rejeição de caminhos fora da raiz.
  - [x] **EXECUTE**: A contenção passou a usar `relative(root, candidate)` e `isAbsolute`, preservando a rejeição de traversal e removendo a dependência de separador.
  - [x] **VERIFY**: T033 GREEN 1/1 para arquivo seguro em raiz Windows; verificação estrita material será executada novamente no fechamento.
  - [x] **EVIDENCE**: Comandos e arquivo de ferramenta alterado estão registrados no comentário T034.
  - [x] **IMPROVE**: Nenhuma regra de aceite ou produção foi alterada; a validação continua exigindo arquivo existente e dentro da raiz.
- [x] T035 [TEST] Executar varredura de evidências dos 17 ACs residuais em `tests/legacy-behaviors.test.js` — Refs: AC-001, AC-002, AC-003, AC-004, AC-006, AC-009, AC-010, AC-013, AC-014, AC-016, AC-017, AC-019, AC-020, AC-021, AC-022, AC-023, AC-024 — Depends: T032, T034
  - [x] **PREP**: Confirmado que a autorização cobre testes/evidências, não novas correções comportamentais.
  - [x] **EXECUTE**: Cenários existentes executados; apenas resultados diretamente provados foram adicionados à matriz de aceite.
  - [x] **VERIFY**: Os 17 ACs residuais passaram nos 19 casos legados; nenhuma falha funcional fora de T032/T034 foi observada.
  - [x] **EVIDENCE**: `verify_acceptance.mjs` retornou `QA: PASSED`; os 17 critérios residuais constam explicitamente na matriz.
  - [x] **IMPROVE**: Nenhum teste novo foi necessário; nenhuma correção de comportamento foi realizada.
- [x] T036 [TEST] Validar Desktop/Mobile e screenshots em `tests/legacy-behaviors.test.js` e portais Preview — Refs: AC-005, AC-007 — Depends: T032, T034
  - [x] **PREP**: Servidor HTTP temporário 41742 iniciou na worktree; URLs, viewports e UAs dos portais foram registrados.
  - [x] **EXECUTE**: Em Desktop 1440×900 e Mobile 390×844/iOS, o clique físico em terça-feira e em iniciar abriu `Leg press 45° ou hack squat`; carga exibiu placeholder `Ex: 32` no Mobile.
  - [x] **VERIFY**: DOM confirmou runner ativo; `scrollWidth` foi 1440/1440 no Desktop e 390/390 no Mobile, sem logs de erro. URLs/viewports/UAs foram restaurados e somente PID 6804 foi encerrado.
  - [x] **EVIDENCE**: Snapshots e DOM foram coletados. Screenshots Desktop/Mobile continuam pendentes de janelas visíveis: ambos falharam com `screenshot timed out — the page is not rendering (its window may be minimized)`.
  - Registro 2026-08-27: após a confirmação humana de que os dois portais estavam restaurados, foi iniciado somente o servidor HTTP local oculto `python -m http.server 41743 --bind 127.0.0.1` (PID 41764; `GET /index.html` = 200), com Desktop em `1440×900` e Mobile/iOS apontado à origem da worktree. A calibração Mobile exigida para `390×844` foi tentada três vezes e retornou exatamente `390×835`, `390×845` e `390×852`; por não haver viewport alvo, o fluxo e os screenshots não foram coletados nem declarados como prova. URLs, UAs e viewports originais foram restaurados (Desktop `http://127.0.0.1:41740/index.html`, `1440×900`, desktop; Mobile `http://localhost:41740/index.html`, `390×835`, iOS) e somente o PID 41764 foi encerrado. T036 permanece aberta exclusivamente em **EVIDENCE**.
  - Registro de auditoria 2026-08-27 — `DEC-T036-MOBILE-VIEWPORT-001`: Prisma aprovou **um único** diagnóstico transitório, classificado `AUTO_PROVISORIA / SEM_BASE` (não cria precedente), pois a causa dos retornos `390×835`, `390×845` e `390×852` ainda não possui base observável. Escopo estrito: no Preview Mobile, medir e devolver somente URL, UA, `innerWidth`, `innerHeight` e a resposta do comando de resize solicitado, sem interação do fluxo, screenshot, snapshot adicional, alteração de comportamento, staging, commit, remoto ou servidor persistente. O efeito permitido é exclusivamente telemetria; AC-005 e AC-007 não recebem nova prova e T036 não fecha. Segurança e reversibilidade: restaurar URL, UA e viewport originais e encerrar somente o servidor temporário criado, informando os valores antes/depois e a confirmação de encerramento. Compatibilidade auditada: D-006 continua a exigir validação física e screenshots Desktop/Mobile; RULES preserva mobile-first, dados locais e paridade, sem mudança de aplicação ou persistência. Nova tentativa da mesma pergunta é vedada; qualquer necessidade de captura fora de `390×844` retorna ao Orquestrador para decisão humana.
  - Resultado auditado 2026-08-27 — Cadencia executou a única medição autorizada: antes, `http://localhost:41740/index.html`, UA iOS, `390×835`; o único resize `390×844` respondeu `viewport: 390×844`, com `innerWidth=390` e `innerHeight=844`; depois, URL/UA foram preservadas e o Mobile foi restaurado para `390×835`. Nenhum servidor/PID foi criado, nenhum arquivo foi alterado e o monitor retornou `CURRENT`. A causa da divergência anterior **não foi explicada**: ela não se reproduziu nessa única medição. Este resultado não é screenshot, não prova AC-005/AC-007 e não fecha T036.
  - **AÇÃO ROSA T036-HUMANA-VISIBILIDADE-001 [HUMANA_ANTES]**: a pessoa deve deixar visíveis e não minimizadas as janelas `Preview Desktop` e `Preview Mobile` durante a coleta. Critério de saída: os portais permitem screenshot no Desktop `1440×900` e no Mobile/iOS exatamente `390×844`; Cadencia poderá então coletar somente as provas previstas por D-006/T036. Até essa ação humana, não repetir resize, não capturar em viewport divergente e não avançar Delivery/Ramo.
  - Confirmação humana 2026-08-27 — `T036-HUMANA-VISIBILIDADE-001` está **[x]**: a pessoa anexou imagem com `Preview Desktop` e `Preview Mobile` simultaneamente visíveis/não minimizados e declarou que estavam abertos e funcionais. A confirmação satisfaz somente a condição de visibilidade; não altera D-006, AC-005, AC-007, T036 ou os gates.
  - Retomada factual 2026-08-27 — Cadencia iniciou servidor temporário `python -m http.server 41744 --bind 127.0.0.1` (PID `5224`; `GET /index.html` = 200) e fez uma única solicitação Mobile `390×844/iOS`; o retorno observado foi `390×835`. Por não haver viewport alvo, não executou fluxo, logs ou screenshots, restaurou Desktop `41740/1440×900` e Mobile `localhost:41740/390×835/iOS`, encerrou somente PID `5224`, não alterou arquivos e obteve monitor `CURRENT`. A divergência entre metadado do canvas (`41743`) e runtime do portal (`41740`) também foi observada. A evidência não comprova que a origem seja altura CSS: apenas mostra resposta inconsistente do backend de portal/resize.
  - Auditoria Prisma 2026-08-27 — fallback do envelope `DEC-T036-MOBILE-VIEWPORT-001`, opção 3, **Passed como AUTO_CONFIRMADA**: preservar T036 em **EVIDENCE** e Delivery Gate **In Progress**, sem nova tentativa, não muda produto, critérios, dados, segurança ou aceites e não requer rollback além de manter os portais restaurados. A classe mais restritiva `HUMANA_ANTES` prevalece para qualquer efeito posterior que aceite viewport efetivo diferente ou crie/use portal alternativo.
  - **DEC-T036-MOBILE-EVIDENCE-002 [HUMANA_ANTES]** — Pergunta: como obter a prova Mobile exigida por D-006/T036 quando o backend de resize não estabiliza `390×844/iOS`? Opção 1: aceitar uma dimensão efetiva diferente como evidência; efeito: muda o critério material de prova; rollback: revogar a autorização e manter T036 aberta. Opção 2: autorizar criar ou usar portal Mobile alternativo explicitamente configurado em `390×844/iOS`; efeito: adiciona recurso externo de prova; rollback: encerrar/remover apenas o recurso autorizado e restaurar os portais atuais. Opção 3: preservar T036/Delivery In Progress sem nova tentativa; efeito: nenhum; rollback: não aplicável; classe `AUTO_CONFIRMADA`. Classificador: há duas alternativas materialmente distintas para o aceite, nenhuma decidida por texto humano. Base: D-006/T036, AC-005, AC-007, RULES mobile-first, confirmação humana de visibilidade e retornos contraditórios `390×844`/`390×835`. Recomendação: não aplicável — Prisma audita e não formula preferência; o estado seguro atual é opção 3 até decisão humana. Momento do efeito: somente após escolha humana, atualização/auditoria da spec e nova autorização limitada.
  - Resposta humana literal 2026-08-27 — `1`. Opção resolvida confirmada: **“Autorizar criar ou usar um portal Mobile alternativo configurado explicitamente em 390×844/iOS, restrito à prova T036; rollback: remover somente o portal alternativo autorizado e restaurar os portais atuais.”**
  - Auditoria Prisma 2026-08-27 — `DEC-T036-MOBILE-EVIDENCE-002` **Passed**. Autor da recomendação: Cadencia. Classificador/classe de decisão: `HUMANA_ANTES`; classificação semântica da atualização: registro operacional/editorial, pois não muda D-006, T036, AC-005, AC-007, produto, dados, critério `390×844/iOS` ou estratégia de teste já aprovada. Gates preservados: Definition `Passed`, Plan `Passed`, Delivery `In Progress`. Base: portais existentes retornaram altura inconsistente, e a opção humana preserva a prova exata. Efeito autorizado após este gate: criar ou usar **no máximo um** portal Mobile alternativo, temporário e limitado à T036; validar URL da worktree, UA iOS e `innerWidth=390`/`innerHeight=844` antes de qualquer clique. Divergência encerra a tentativa sem prova; somente com valores exatos são permitidos fluxo e screenshot. Rollback: restaurar os portais existentes, remover somente o alternativo criado e encerrar somente servidor/PID criado. Auditor: Prisma. Resultado: autorização limitada emitida para Cadencia; sem produção, staging, commit, remoto, publicação, limpeza ou Ramo.
  - Retorno Cadencia 2026-08-27 — único portal alternativo `T036 Mobile Evidence` solicitado para `http://127.0.0.1:41745/index.html` com `390×844`; servidor temporário `41745`/PID `28748` respondeu `GET /index.html=200`. Antes de clique, fluxo, logs ou screenshot, `maestri portal ua/info/evaluate` retornaram literalmente `Error: portal not loaded — reload it in the canvas first`; URL/UA/`innerWidth`/`innerHeight` do runtime não puderam ser obtidos. O portal alternativo foi removido, o PID foi encerrado, previews existentes não foram alterados, nenhum arquivo foi alterado por Cadencia e o monitor final foi `CURRENT`.
  - Auditoria Prisma 2026-08-27 — `DEC-T036-MOBILE-EVIDENCE-002` resultado de execução: **sem prova material; rollback aderente ao escopo informado**. `maestri list` mantém apenas `Preview Desktop` e `Preview Mobile`, compatível com a remoção do alternativo. O erro de carregamento impede confirmar os pré-requisitos e não permite inferir falha do aplicativo ou de CSS. A autorização de **no máximo um** portal foi consumida; T036 permanece exclusivamente em **EVIDENCE**, Delivery Gate permanece **In Progress**, e não há autorização para novo portal, clique, resize ou screenshot. Qualquer novo recurso externo exige decisão humana e auditoria prévia distintas.
  - Resposta humana literal 2026-08-27 — **“Autorizar um segundo e último portal 390×844/iOS — recomendado. Quando ele aparecer, você precisará recarregá-lo no canvas e confirmar portal alternativo recarregado”**. A fala humana termina em `recarregado`; não inclui limites, rollback ou critérios técnicos posteriores.
  - **DEC-T036-PORTAL-LOAD-003 [HUMANA_ANTES]** — Estado: **Passed**. Autor da recomendação: Cadencia. Classificador: `HUMANA_ANTES`. Base: D-006/T036, AC-005, AC-007, RULES mobile-first e falha literal `portal not loaded` do primeiro alternativo. Opção humana escolhida: criar no máximo o segundo e último portal temporário `390×844/iOS` e mantê-lo aberto. Os limites de nenhuma pré-checagem/interação até confirmação humana posterior, validação exata posterior, rollback e preservação dos previews são condições operacionais deste envelope, não transcrição da fala humana. Efeito autorizado: Cadencia cria somente esse portal e devolve o estado, sem pré-checagem ou interação. Rollback: remover somente o novo portal e encerrar somente servidor/PID criados, preservando `Preview Desktop` e `Preview Mobile`. Momento posterior: depois de a pessoa recarregar o portal no canvas e confirmar sua prontidão, uma nova autorização limitada poderá permitir somente a validação prévia. Auditor: Prisma. Evidência mecânica aceita: setup executado; monitor `CURRENT`; `validate_spec` `READY`; `validate_tasks` `READY` (37 total, 30 completas, 162/185 checklists, 46/46 IDs); `review_findings` `PASSED`; Git `2.53.0` comprovado; `analyze_change` limitado apenas pelo falso negativo conhecido de Git. Classificação semântica: operacional/editorial, pois não muda D-006, T036, AC-005, AC-007, produto, dados, critério `390×844/iOS` ou estratégia de teste; Definition/Plan permanecem Passed e Delivery permanece In Progress.
  - **AÇÃO ROSA T036-PORTAL-RELOAD-004 [HUMANA_ANTES]**: após Cadencia criar o segundo e último portal, a pessoa deve recarregá-lo no canvas e confirmar exatamente **“portal alternativo recarregado”**. Até essa confirmação, não executar clique, resize, screenshot, fluxo ou pré-checagem. Forma de confirmação: resposta humana literal na nota/decisão; rollback mantém somente a remoção do novo portal e o encerramento dos recursos por ele criados.
  - Registro 2026-08-28 — com autorização explícita do Codex - Procurador para um único portal substituto, foi criado `T036 Mobile Evidence Replacement` em `http://127.0.0.1:41746` para a worktree `task/t020-kg-suffix`; após a confirmação humana literal “portal alternativo recarregado”, a pré-checagem limitada configurou UA iOS e confirmou a origem. A telemetria real foi `innerWidth=390`, `innerHeight=835` e `url=http://127.0.0.1:41746/`; portanto não atende ao critério normativo `390×844/iOS`. Pelo encaminhamento humano resolvido da opção 1, não houve clique, fluxo, logs nem screenshot em viewport divergente. T036 permanece aberta somente em **EVIDENCE** e o Delivery Gate permanece **In Progress**; implementação, testes e evidências já aprovados foram preservados.
  - Revisão explícita 2026-08-28 — a decisão anterior de preservar o bloqueio foi revisada porque a leitura integral desta fonte normativa revelou o precedente material em que `maestri portal resize 390 844` retornou `innerWidth=390` e `innerHeight=844`. O Codex - Procurador autorizou exatamente uma tentativa de resize no portal existente, sem criar portal novo nem mudar requisitos. A única tentativa retornou `viewport: 390x844`; `info` e `evaluate` confirmaram `url=http://127.0.0.1:41746/`, UA iOS e `innerWidth=390`/`innerHeight=844`. Foram então coletadas as provas materiais: `research/t036-mobile-390x844-ios.png` no modo Foco Mobile, e, reutilizando o mesmo portal sem criar recurso novo, `research/t036-desktop-1440x900.png` em Desktop `1440x900`. Nos dois fluxos, o modo Foco exibiu `Hack squat ou leg press`, campos `Carga (kg)` com placeholder `Ex: 32`, `scrollWidth` igual à largura da viewport e logs sem erro. A nova evidência material está anexada sem alterar a implementação, os critérios, os demais gates ou as restrições de D-006.
  - [x] **IMPROVE**: Nenhuma alteração de produção foi feita para acomodar automação.
- [x] T037 [DOC] Reconstruir `docs/` e `.specsfy/PACKAGES.md` após T032/T034 — Refs: US-005, FR-014, NFR-005, AC-025, AC-026, AC-027 — Depends: T032, T034
  - [x] **PREP**: Confirmadas fontes T032/T034 e manifest sem dependência nova.
  - [x] **EXECUTE**: Executados setup local, documentator e `--check`.
  - [x] **VERIFY**: Documentação compatível e monitor `CURRENT`.
  - [x] **EVIDENCE**: Saídas e arquivos atualizados estão registrados no comentário T037.
  - [x] **IMPROVE**: Nenhuma fonte normativa paralela foi criada.

<!-- specsfy:evidence {"task":"T029","refs":["US-005","FR-014","NFR-005","AC-025"],"files":["tests/security-output-escaping.test.js"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/security-output-escaping.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":1}]} -->
<!-- specsfy:evidence {"task":"T030","refs":["US-005","FR-014","NFR-005","AC-026"],"files":["tests/security-output-escaping.test.js"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/security-output-escaping.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":1}]} -->
<!-- specsfy:evidence {"task":"T031","refs":["US-005","FR-014","NFR-005","AC-027"],"files":["tests/security-output-escaping.test.js"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/security-output-escaping.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":1}]} -->
<!-- specsfy:evidence {"task":"T033","refs":["FR-014","NFR-005","AC-025"],"files":["tests/verify-evidence-windows.test.js"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/verify-evidence-windows.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":1}]} -->
<!-- specsfy:evidence {"task":"T032","refs":["US-005","FR-014","NFR-005","AC-025","AC-026","AC-027"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/security-output-escaping.test.js"],"commands":[{"run":"vitest.cmd run tests/security-output-escaping.test.js --no-cache --pool=forks --poolOptions.forks.singleFork --reporter=verbose","exit":0},{"run":"git diff --no-index -- index.html treino_hibrido_juarez_v3_standalone.html","exit":0},{"run":"monitor_context.mjs --project . --check","exit":0}]} -->
<!-- specsfy:evidence {"task":"T034","refs":["FR-014","NFR-005","AC-025"],"files":[".agents/skills/specsfy-07-implement/scripts/verify_evidence.mjs","tests/verify-evidence-windows.test.js"],"commands":[{"run":"vitest.cmd run tests/verify-evidence-windows.test.js --no-cache --pool=forks --poolOptions.forks.singleFork --reporter=verbose","exit":0}]} -->
<!-- specsfy:evidence {"task":"T037","refs":["US-005","FR-014","NFR-005","AC-025","AC-026","AC-027"],"files":["docs/application.md","docs/testing.md",".specsfy/PACKAGES.md"],"commands":[{"run":"build_documentation.mjs --project .","exit":0},{"run":"build_documentation.mjs --project . --check","exit":0},{"run":"monitor_context.mjs --project . --check","exit":0}]} -->
<!-- specsfy:evidence {"task":"T035","refs":["AC-001","AC-002","AC-003","AC-004","AC-006","AC-009","AC-010","AC-013","AC-014","AC-016","AC-017","AC-019","AC-020","AC-021","AC-022","AC-023","AC-024"],"files":["tests/legacy-behaviors.test.js"],"commands":[{"run":"vitest.cmd run tests/legacy-behaviors.test.js --no-cache --pool=forks --poolOptions.forks.singleFork --reporter=verbose","exit":0},{"run":"verify_acceptance.mjs specs/in-progress/0001-redesign-ui-ux-typeform-timer/spec.md .","exit":0}]} -->
<!-- specsfy:evidence {"task":"T036","refs":["AC-005","AC-007"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html"],"commands":[{"run":"Preview Desktop (1440x900): clicar terça e iniciar; DOM=Leg press 45° ou hack squat; scrollWidth=1440; logs sem erro","exit":0},{"run":"Preview Mobile (390x844/iOS): clicar terça e iniciar; DOM=Leg press 45° ou hack squat; placeholder=Ex: 32; scrollWidth=390; logs sem erro","exit":0}]} -->

- [x] T038 [TEST] [TDD] [US-006] RED carga AC-028/TC-009 em tests/numeric-inputs.test.js — Refs: US-006, FR-015, NFR-006, AC-028, TC-009 — Depends: none
  - [x] **PREP**: Preparar o arquivo focal com nove casos para os critérios novos.
  - [x] **EXECUTE**: Executar externamente o focal; resultado observado: exit 1, 8 failed e 1 passed.
  - [x] **VERIFY**: RED material observado: AC-028–AC-035 falharam por ausência de comportamento; AC-036 paridade passou.
  - [x] **EVIDENCE**: `node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism` — exit 1, 1 arquivo, 9 testes, 8 failed, 1 passed; duração 3.86s. `node --check` exit 0; monitor CURRENT; diff check exit 0.
  - [x] **IMPROVE**: RED fortalecido concluído; tarefas posteriores de planejamento permanecem pendentes.
<!-- specsfy:evidence {"task":"T038","refs":["US-006","FR-015","NFR-006","AC-028","TC-009"],"files":["tests/numeric-inputs.test.js"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":1}]} -->
<!-- CHECKPOINT 2026-08-28: T038–T043 TDD concluídas com execução focal compartilhada; T044 é a próxima tarefa, não iniciada. Plan/Delivery permanecem Pending. -->

- [x] T039 [TEST] [TDD] [US-006] RED repetições AC-029/TC-010 em `tests/numeric-inputs.test.js` — Refs: US-006, FR-015, NFR-006, AC-029, TC-010 — Depends: T038
  - [x] **PREP**: Caso existente no teste focal.
  - [x] **EXECUTE**: Mesmo comando externo de T038, exit 1.
  - [x] **VERIFY**: inputMode numeric ausente.
  - [x] **EVIDENCE**: Evidência compartilhada com T038.
  - [x] **IMPROVE**: Manter RED até implementação.
<!-- specsfy:evidence {"task":"T039","refs":["US-006","FR-015","NFR-006","AC-029","TC-010"],"files":["tests/numeric-inputs.test.js"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":1}]} -->
- [x] T040 [TEST] [TDD] [US-006] RED sono AC-030/TC-011 em `tests/numeric-inputs.test.js` — Refs: US-006, FR-015, NFR-006, AC-030, TC-011 — Depends: T038
  - [x] **PREP**: Caso existente no teste focal.
  - [x] **EXECUTE**: Mesmo comando externo de T038, exit 1.
  - [x] **VERIFY**: inputMode decimal ausente.
  - [x] **EVIDENCE**: Evidência compartilhada com T038.
  - [x] **IMPROVE**: Manter RED até implementação.
<!-- specsfy:evidence {"task":"T040","refs":["US-006","FR-015","NFR-006","AC-030","TC-011"],"files":["tests/numeric-inputs.test.js"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":1}]} -->
- [x] T041 [TEST] [TDD] [US-006] RED editor AC-031/TC-012 em `tests/numeric-inputs.test.js` — Refs: US-006, FR-016, NFR-006, AC-031, TC-012 — Depends: T038
  - [x] **PREP**: Caso existente no teste focal.
  - [x] **EXECUTE**: Mesmo comando externo de T038, exit 1.
  - [x] **VERIFY**: Editor DOM ausente.
  - [x] **EVIDENCE**: Evidência compartilhada com T038.
  - [x] **IMPROVE**: Manter RED até implementação.
<!-- specsfy:evidence {"task":"T041","refs":["US-006","FR-016","NFR-006","AC-031","TC-012"],"files":["tests/numeric-inputs.test.js"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":1}]} -->
- [x] T042 [TEST] [TDD] [US-006] RED confirmação AC-032/TC-013 em `tests/numeric-inputs.test.js` — Refs: US-006, FR-016, NFR-006, AC-032, TC-013 — Depends: T038
  - [x] **PREP**: Caso existente no teste focal.
  - [x] **EXECUTE**: Mesmo comando externo de T038, exit 1.
  - [x] **VERIFY**: Controles sequenciais ausentes.
  - [x] **EVIDENCE**: Evidência compartilhada com T038.
  - [x] **IMPROVE**: Manter RED até implementação.
<!-- specsfy:evidence {"task":"T042","refs":["US-006","FR-016","NFR-006","AC-032","TC-013"],"files":["tests/numeric-inputs.test.js"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":1}]} -->
- [x] T043 [TEST] [TDD] [US-006] RED cancelamentos/bordas AC-033–AC-036 em `tests/numeric-inputs.test.js` — Refs: US-006, FR-016, NFR-006, AC-033, AC-034, AC-035, AC-036, TC-014, TC-015, TC-016, TC-017 — Depends: T038
  - [x] **PREP**: Casos existentes no teste focal.
  - [x] **EXECUTE**: Mesmo comando externo de T038, exit 1.
  - [x] **VERIFY**: AC-033–AC-035 RED; AC-036 caracterização verde.
  - [x] **EVIDENCE**: Evidência compartilhada com T038.
  - [x] **IMPROVE**: Manter cobertura até implementação.
<!-- specsfy:evidence {"task":"T043","refs":["US-006","FR-016","NFR-006","AC-033","AC-034","AC-035","AC-036","TC-014","TC-015","TC-016","TC-017"],"files":["tests/numeric-inputs.test.js"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":1}]} -->
- [x] T044 [CODE] [US-006] inputmode em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-006, FR-015, NFR-006, AC-028, AC-029, AC-030, TC-009, TC-010, TC-011 — Depends: T038, T039, T040
  - [x] **PREP**: Escopo restrito aos três atributos inputmode.
  - [x] **EXECUTE**: Implementação idêntica nos dois HTMLs concluída.
  - [x] **VERIFY**: Focal AC-028/029/030 passou; paridade passou.
  - [x] **EVIDENCE**: Vitest focal exit 0 (1 arquivo, 3 passed, 6 skipped); suíte integral permanece 5 failed/4 passed por T045. Documentador build e check exit 0.
  - [x] **IMPROVE**: Nenhuma alteração adicional; T045 permanece pendente.
<!-- specsfy:evidence {"task":"T044","refs":["US-006","FR-015","NFR-006","AC-028","AC-029","AC-030"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","docs/",".specsfy/PACKAGES.md"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism --testNamePattern=\"AC-028|AC-029|AC-030\"","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project .","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0},{"run":"git diff --no-index --exit-code index.html treino_hibrido_juarez_v3_standalone.html","exit":0}]} -->
- [x] T045 [CODE] [US-006] editor DOM sequencial em `index.html` e `treino_hibrido_juarez_v3_standalone.html` — Refs: US-006, FR-016, NFR-006, AC-031, AC-032, AC-033, AC-034, AC-035, AC-036, TC-012, TC-013, TC-014, TC-015, TC-016, TC-017 — Depends: T041, T042, T043
  - [x] **PREP**: Planejar fluxo caracterizado.
  - [x] **EXECUTE**: Implementar editor.
  - [x] **VERIFY**: Vitest focal GREEN 9/9.
  - [x] **EVIDENCE**: `node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism` — exit 0; 1 arquivo passed; 9 testes passed; 0 failed. Documentador build/check exit 0; paridade exit 0; diff check exit 0.
  - [x] **IMPROVE**: Correção de atualização imediata em memória preservando persist/render únicos.
<!-- specsfy:evidence {"task":"T045","refs":["US-006","FR-016","NFR-006","AC-031","AC-032","AC-033","AC-034","AC-035","AC-036"],"files":["index.html","treino_hibrido_juarez_v3_standalone.html","tests/numeric-inputs.test.js","docs/",".specsfy/PACKAGES.md"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project .","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0},{"run":"git diff --no-index --exit-code index.html treino_hibrido_juarez_v3_standalone.html","exit":0}]} -->
- [x] T046 [TEST] [US-006] GREEN focal, regressão e paridade em `tests/numeric-inputs.test.js`, `tests/kg-suffix.test.js` e `package.json` — Refs: US-006, FR-015, FR-016, NFR-006 — Depends: T044, T045
  - [x] **PREP**: Preparar suíte focal e ampla sem alterar package.json.
  - [x] **EXECUTE**: Executar provas externas reconciliadas.
  - [x] **VERIFY**: Confirmar invariantes e paridade integral.
  - [x] **EVIDENCE**: `node node_modules/vitest/vitest.mjs run tests/kg-suffix.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism` — exit 0; 1 arquivo; 4/4 testes passed. `npm run test:tdd -- --reporter=verbose` — exit 0; 11/11 arquivos; 62/62 testes passed; 0 failed. Focal numeric anterior: exit 0, 9/9.
  - [x] **IMPROVE**: Nenhuma alteração em package.json; divergências legadas reconciliadas.
<!-- specsfy:evidence {"task":"T046","refs":["US-006","FR-015","FR-016","NFR-006"],"files":["tests/numeric-inputs.test.js","tests/kg-suffix.test.js","package.json","index.html","treino_hibrido_juarez_v3_standalone.html"],"commands":[{"run":"node node_modules/vitest/vitest.mjs run tests/kg-suffix.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":0},{"run":"npm run test:tdd -- --reporter=verbose","exit":0},{"run":"node node_modules/vitest/vitest.mjs run tests/numeric-inputs.test.js --reporter=verbose --pool=forks --poolOptions.forks.singleFork --no-file-parallelism","exit":0},{"run":"git diff --no-index --exit-code index.html treino_hibrido_juarez_v3_standalone.html","exit":0},{"run":"git diff --check","exit":0}]} -->
- [x] T047 [DOC] documentação em `docs/` e `.specsfy/PACKAGES.md` — Refs: US-006, FR-015, FR-016 — Depends: T044, T045
  - [x] **PREP**: Preparar documentador.
  - [x] **EXECUTE**: Build/check executados.
  - [x] **VERIFY**: Documentação reconstruída sem alterar contrato.
  - [x] **EVIDENCE**: `node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project .` exit 0; `--check` exit 0.
  - [x] **IMPROVE**: Nenhum drift adicional.
<!-- specsfy:evidence {"task":"T047","refs":["US-006","FR-015","FR-016"],"files":["docs/",".specsfy/PACKAGES.md"],"commands":[{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project .","exit":0},{"run":"node .agents/skills/specsfy-documentator/scripts/build_documentation.mjs --project . --check","exit":0}]} -->
- [x] T048 [TEST] aceite, rastreabilidade e evidência móvel em `tests/numeric-inputs.test.js` e `specs/completed/0001-redesign-ui-ux-typeform-timer/research/20260828-spec0001-mobile-ios-390x844-numeric-inputs.png` — Refs: US-006, FR-015, FR-016, NFR-006 — Depends: T046, T047
  - [x] **PREP**: Pré-checagens externas confirmadas em URL, UA iOS e viewport 390x844.
  - [x] **EXECUTE**: Fluxo real exercitado e captura única produzida.
  - [x] **VERIFY**: Aceite, rastreabilidade, regressão e paridade verdes.
  - [x] **EVIDENCE**: verify_repo externo exit 0; monitor externo exit 0 CURRENT; suíte Maestro exit 0 (11/11 arquivos, 62/62 testes); captura SHA256 9BEBCA0C972C282AE3D08E02455B3061B9019BEE2E8742E5F29A5C6B14FB8698; RULES revisto, nenhuma regra durável nova além de D-007/D-008.
  - [x] **IMPROVE**: Rollback concluído; sem alegar garantia de teclado físico.
<!-- specsfy:evidence {"task":"T048","refs":["US-006","FR-015","FR-016","NFR-006"],"files":["tests/numeric-inputs.test.js","specs/completed/0001-redesign-ui-ux-typeform-timer/research/20260828-spec0001-mobile-ios-390x844-numeric-inputs.png"],"commands":[{"run":"npm run test:tdd -- --reporter=verbose","exit":0},{"run":"node .agents/skills/specsfy-07-implement/scripts/verify_evidence.mjs specs/completed/0001-redesign-ui-ux-typeform-timer/spec.md . --task T048","exit":0}]} -->
### 15. Ordem de execução

- Ordem atual: T038–T040 → T044; T041–T043 → T045; T044/T045 → T046 e T047 → T048.

- Caminho crítico: T029–T031 (REDs de segurança) → T032 (CODE de saída segura) e T033 (RED de ferramenta) → T034 (correção portátil do verificador) → T035 (17 ACs residuais) + T036 (portais) + T037 (documentação) → validação independente de Delivery. T020–T028 permanecem evidência histórica e regressão obrigatória.
- Tarefas paralelas: T001–T004 e T006–T019 podem ser preparadas em paralelo porque usam arquivos de teste e cenários distintos; não podem ser dadas como concluídas sem RED ou caracterização e evidência próprias.
- Estratégia de MVP: por decisão humana explícita de 2026-08-26, a entrega passa a incluir AC-005 e a correção já normativa de AC-007; os demais ACs legados mantêm tarefas explícitas para que a rastreabilidade integral não seja declarada sem prova.

### 16. Dependências, riscos e suposições

- Dependência resolvida: Vitest é o runner Node escolhido pela pessoa em 2026-08-26 e está materializado com JSDOM no `package.json`/lock.
- Risco: alterar o value ou normalizar antes da persistência quebraria a compatibilidade definida em D-004.
- Suposição confirmada: os dois HTMLs devem continuar sincronizados.

### 17. Decisões

- **D-001**: Uso de Web Audio API sintetizada com ganho amplificado para garantir que o alarme do timer toque alto sem exigir download de arquivos de áudio externos.
- **D-002**: Interface em tela única por exercício (Modo Foco / Typeform) para máxima agilidade e foco durante a sessão de treino na academia.
- **D-003**: Manter compatibilidade com histórico pré-existente no LocalStorage.
- **D-004**: Em 2026-08-26, a pessoa aprovou: "sufixo visual fixo kg apenas nas cargas por série; placeholder sem kg; preservar handler/persistência; remover apenas um kg terminal ao exibir legado; não alterar peso corporal nem teclado/validação." Impacta US-002, FR-006, FR-013, NFR-002, NFR-004, AC-005 e as tarefas canônicas T020–T025; reabriu os Atos I–III.
- **D-005**: Em 2026-08-26, a pessoa autorizou incorporar nesta entrega a correção de AC-007. AC-007, US-001, FR-001 a FR-003 e NFR-002 já são normativos; a decisão é mudança de plano, preserva o Definition Gate e exige T026 (CODE), RED/GREEN e validação próprios antes de nova entrega.
- **D-006**: Em 2026-08-26, a pessoa autorizou literalmente todas as quatro pendências rosas, seguindo a recomendação/opção 1: corrigir output encoding/escaping das renderizações persistidas com testes; aplicar a correção mínima autorizada do `verify_evidence` no Windows; realizar a varredura dos 17 ACs residuais apenas como testes/evidências, sem novas correções de comportamento; e realizar validação física/screenshots Desktop e Mobile. A segurança reabre o Ato I; ferramenta, varredura e portais reabrem o Ato II. Impacta US-005, FR-014, NFR-005, AC-025 a AC-027 e T029–T037.
- **D-007**: Mudança tardia do teclado, exclusiva para `inputmode` em campos já textuais: decimal em carga/sono e numeric em repetições. Supera D-004 somente nessa fronteira; preserva validação, handlers, conversões, formatos e persistência.
- **D-008**: Mudança tardia dos prompts, exclusiva para fluxo DOM sequencial de Peso/Cintura. Supera D-004 somente nessa fronteira; preserva validação, handlers, conversões, formatos e persistência.
- **DEC-T036-MOBILE-VIEWPORT-001 (auditoria Prisma, 2026-08-27)**: Identificador conferido. Opção única registrada e escolhida pelo Orquestrador, a partir da recomendação de Cadencia: experimento mínimo e reversível para aferir URL/UA/`innerWidth`/`innerHeight` e resposta ao resize no Mobile. Classificador: causa da divergência de viewport não comprovada; classe original `SEM_BASE`, reclassificada independentemente como `AUTO_PROVISORIA / SEM_BASE`. Base: três retornos incompatíveis com `390×844` e D-006/T036; a ausência de captura não autoriza inferir conformidade. Efeito: somente telemetria transitória; nenhuma mudança de app, persistência, segurança, critério, gate ou evidência de aceite. Reversibilidade/rollback: restaurar URL, UA e viewport e encerrar somente servidor temporário criado. Decisão escolhida: aprovada uma única execução; sem screenshot em viewport divergente, sem novo ciclo, staging, commit, remoto ou Ramo. Resultado pendente do diagnóstico; D-006, AC-005, AC-007 e T036 permanecem inalterados.
- **DEC-T036-MOBILE-VIEWPORT-001 (resultado auditado, 2026-08-27)**: a única execução retornou exatamente `390×844`, após estado inicial `390×835`, e foi restaurada a `390×835` com URL/UA originais; não houve servidor, arquivo alterado nem falha de monitor (`CURRENT`). Isso demonstra somente que o portal aceitou uma vez o comando, não a causa dos três retornos prévios e não uma prova de interface. A classe `AUTO_PROVISORIA / SEM_BASE` não gera precedente. O próximo estado é `HUMANA_ANTES` exclusivamente para visibilidade das janelas, conforme `T036-HUMANA-VISIBILIDADE-001`; Delivery permanece In Progress.
- **DEC-T036-MOBILE-VIEWPORT-001 (retomada auditada, 2026-08-27)**: a confirmação humana de visibilidade foi recebida e registrada sem reescrever a declaração. A nova tentativa limitada retornou `390×835` para solicitação `390×844/iOS`, sem fluxo, logs ou screenshot; restauração, encerramento de PID e monitor foram comprovados. Atribuir a causa à altura CSS seria inferência sem base; o fato auditado é inconsistência do backend do portal/resize. O fallback de opção 3 — preservar T036/Delivery — é `AUTO_CONFIRMADA` e Passed. O efeito posterior requer `DEC-T036-MOBILE-EVIDENCE-002 [HUMANA_ANTES]`.
- **DEC-T036-MOBILE-EVIDENCE-002 (decisão humana e auditoria Prisma, 2026-08-27)**: resposta humana literal preservada: `1`; opção resolvida: “Autorizar criar ou usar um portal Mobile alternativo configurado explicitamente em 390×844/iOS, restrito à prova T036; rollback: remover somente o portal alternativo autorizado e restaurar os portais atuais.” Estado: `Passed` para autorização limitada. Autor da recomendação: Cadencia. Classificador: `HUMANA_ANTES`. Base: D-006/T036, AC-005, AC-007, RULES mobile-first e inconsistência observada no portal existente. Efeito: no máximo um portal alternativo temporário, somente T036, condicionado a URL da worktree, UA iOS e `390×844` confirmados antes do clique. Rollback: restaurar portais existentes, remover só o alternativo autorizado e encerrar só servidor/PID criado. Auditor: Prisma. Classificação de impacto: operacional/editorial; nenhum gate é reaberto e T036/Delivery permanecem pendentes. Resultado: Prisma→Cadencia autorizado sob escopo estrito.
- **DEC-T036-MOBILE-EVIDENCE-002 (resultado Cadencia auditado, 2026-08-27)**: o único portal autorizado foi criado e removido sem gerar prova: o runtime retornou literalmente `Error: portal not loaded — reload it in the canvas first` antes dos pré-requisitos. Servidor/PID foram encerrados, previews existentes preservados, nenhum arquivo Cadencia alterado e monitor `CURRENT`. Resultado: autorização consumida sem evidência; o erro é da camada de carregamento do portal e não prova defeito do aplicativo. T036/Delivery seguem pendentes; um novo recurso exige decisão `HUMANA_ANTES` e auditoria novas.
- **DEC-T036-PORTAL-LOAD-003 (resposta humana e auditoria Prisma, 2026-08-27)**: texto humano literal corrigido por proveniência: “Autorizar um segundo e último portal 390×844/iOS — recomendado. Quando ele aparecer, você precisará recarregá-lo no canvas e confirmar portal alternativo recarregado”. A fala termina em `recarregado`; requisitos técnicos, rollback e confirmação posterior pertencem ao envelope operacional, não à fala. Estado: `HUMANA_ANTES` resolvida pela pessoa; resultado da auditoria: `Passed`, com evidências mecânicas aceitas. Autor da recomendação: Cadencia. Base: falha de carregamento do único alternativo anterior, D-006/T036, AC-005, AC-007 e RULES mobile-first. Efeito autorizado: no máximo um segundo e último portal temporário `390×844/iOS`, mantido aberto; antes de confirmação humana posterior não há clique, resize, screenshot, fluxo ou pré-checagem. Rollback: remover somente esse portal e encerrar somente servidor/PID criados, preservando previews existentes. Classificação: operacional/editorial; Definition/Plan permanecem Passed e Delivery permanece In Progress.

### 18. Definition of Done

- [x] Definition Gate atual: mudança de teclado D-007/D-008 validada com US-006, FR-015, FR-016, NFR-006 e AC-028–AC-036.
- [x] Runner Node decidido pela pessoa; Vitest/JSDOM e RED executável de TC-006 a TC-008 foram registrados.
- [x] Plan Gate atual: T038–T043 TDD concluídas e plano aprovado; Plan Passed anterior preservado como histórico.
- [x] T020/T036 e o Delivery Passed anterior permanecem concluídos como histórico.
- [x] Delivery Gate atual: QA/aceite, evidência móvel e validações finais Passed; Delivery Passed.

### 19. Evidências de entrega

- **E-001 (preservada)**: Os HTMLs `index.html` e `treino_hibrido_juarez_v3_standalone.html` eram idênticos na descoberta Farol de 2026-08-26.
- **E-002 (confirmada)**: A pessoa escolheu Vitest em 2026-08-26; JSDOM está instalado e os REDs executáveis de TC-006 a TC-008 foram registrados. T020 tornou os quatro casos focais verdes.
- **E-003 (confirmada)**: Evidências históricas T020/T026/T032–T037 e screenshots foram confirmadas/restauradas; somente a evidência do teclado novo permanece pendente.
- **E-004 (confirmada)**: Decisão humana literal de 2026-08-26 autorizou incluir AC-007 nesta entrega; o RED T007 preexistente passa a ser predecessor obrigatório de T026.

### 20. Conclusão

- **Mudança tardia (2026-08-26)**: Pedido literal preservado: "sufixo visual fixo kg apenas nas cargas por série; placeholder sem kg; preservar handler/persistência; remover apenas um kg terminal ao exibir legado; não alterar peso corporal nem teclado/validação."
- **Classificação**: D-006 e a entrega anterior permanecem históricas; D-007/D-008 constituem a reabertura atual de teclado e prompts. Evidências antigas não comprovam o comportamento novo.
- **Estado atual**: Complete; Definition, Plan e Delivery Gates Passed; T048 concluída com evidência móvel durável.
