# Inbox: Redesign de UI UX estilo Typeform com timer e historico de carga

| Metadado | Valor |
| --- | --- |
| Status | Capturada |
| Capturada em | 2026-08-21T21:00:32Z |
| Slug | redesign-de-ui-ux-estilo-typeform-com-timer-e-historico-de-carga |
| Origem | Input do usuário |
| Processamento | Análise inicial sem perguntas |
| Sessão de descoberta | Captura avulsa. |
| Turno da conversa | Não se aplica. |
| Integridade do original | SHA-256 `8b91358c6eeb9ab8f72555eccb22985680e40723f8f6b5a92308e0ce25cffc32` |
| Backlog derivado | Nenhum |
| Spec derivada | Nenhuma |

## Texto original

Eu quero melhorar o I e o X dele porque está muito ruim. Eu vou colocar duas imagens aqui de referência. O foco do seu aplicativo é que eu quero saber a quanto tempo eu estou constante, quantas vezes eu fui na semana, poder clicar e já ir no treino da semana, baseado no meu dia atual. Ele já abra o primeiro exercício e, nesse exercício, já venha aonde eu colocar o peso e a repetição. Já venha a minha última vez que eu fiz o último peso e repetição, porque eu quero ter referência para fazer igual ou maior, se não me engano. Ele já está com essa funcionalidade para que você confira mais. O principal é a UI e UX. Eu também quero que ele fique como se fosse um TypeForm, cada exercício em uma tela, e aí eu vou sempre passando para o próximo. Nesse caso, a máquina estiver ocupada, eu possa pular e, quando eu acabar, voltar para o que eu ainda não fiz. Eu quero também que essa parte de cronômetro já fique nessa primeira tela do exercício, e aí fique lá o tempo de descanso. Tem um alarme quando acabar e ele vibre. Tem a opção de ele vibrar também. E o alarme, ele possa ser mais alto e tenha só mais alto mesmo. salvei as duas imagens na pasta C:\Users\Samsung\Documents\treino_v3\imagens

## Contexto consultado

Nenhuma fonte contextual consultada.

## Resumo processado

**Inferência:** Reformulação completa da experiência visual (UI dark/neon moderna) e de uso (UX estilo Typeform por exercício), com foco em constância semanal, abertura direta no exercício do dia, referência de última carga/reps, timer de descanso com som alto e vibração, e possibilidade de pular e retomar exercícios.

## Análise inicial

### Problema ou oportunidade

**Declaração ou inferência identificada:** A interface atual é básica e pouco fluida durante o treino real. O usuário precisa de navegação direta por exercício (um por tela), feedback claro de última carga usada, e timer de descanso audível/vibratório integrado.

### Pessoas afetadas ou beneficiadas

**Declaração ou inferência identificada:** Juarez (usuário praticante de treino híbrido).

### Resultado ou valor esperado

**Declaração ou inferência identificada:** Interface moderna e focada no treino físico, menor atrito para registrar cargas e séries, maior motivação visual com tracking de constância e agilidade na execução com timer e navegação por exercício.

### Sinais de escopo, regras ou solução

**Sinais extraídos, não decisões:** UI inspirada nas referências (fundo escuro #0c0c0c, acento verde-limão/neon, cards arredondados, barra de dias da semana no topo); tela de exercício estilo Typeform (um exercício por tela com navegação próximo/pular/voltar); timer de descanso e cronômetro total integrados na tela; Web Audio e navigator.vibrate para alertas de fim de descanso; exibição da carga e reps da sessão anterior como referência.

### Informações que talvez precisem ser guardadas

**Sinais para conversar depois, não confirmação:** Persistência das métricas de constância (dias treinados, streak), histórico detalhado de cada exercício (última carga e reps) e configurações do timer de descanso.

### Riscos e dependências

**Análise preliminar:** Compatibilidade da Vibration API no iOS Safari (onde vibração web não é suportada diretamente), necessidade de sintetizador Web Audio potente para garantir alarme alto em ambientes de academia.

## Possíveis direções futuras

**Hipóteses para backlog ou spec, não requisitos:** Promover para spec com specsfy-03-specify para detalhar componentes, fluxo de telas e regras de negócio da nova interface.

## Pontos a revisar no futuro

**A revisar:** Revisar as lacunas antes da promoção.

## Rastreabilidade

- Formulação original preservada integralmente nesta captura.
- Análises não substituem decisões do usuário.
- Backlogs e specs derivados devem referenciar este arquivo.

## Próximo passo

Manter em `specs/inbox/` ou refinar com `$specsfy-02-backlog`.
