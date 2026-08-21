# Projeto Treino Híbrido — Juarez

## História e motivação

O projeto nasceu da necessidade de Juarez acompanhar e registrar de forma prática, rápida e independente de conexão de internet os seus treinos híbridos (musculação, condicionamento/aeróbio e mobilidade), com controle de cargas, séries, prontidão diária e cronômetro de descanso integrado.

## Finalidade

Fornecer uma aplicação web leve e Progressive Web App (PWA) para acompanhamento diário dos treinos, com interface otimizada para uso em smartphones durante as sessões de treino, registro de histórico e exportação dos dados.

## Pessoas e contexto de uso

- **Juarez (Usuário final)**: Utiliza a aplicação durante o treino na academia ou em casa para verificar a ficha do dia, marcar séries realizadas, ajustar cargas, cronometrar o tempo de descanso e registrar sua prontidão física/mental.

## Capacidades principais

1. **Visualização da Ficha do Dia / Plano Semanal**: Apresentação dos exercícios divididos por blocos e dias (Treino A, B, C, aeróbio, etc.), com instruções e links demonstrativos.
2. **Registro de Séries e Cargas**: Formulário e tabela interativa para marcar séries concluídas, peso/carga utilizada, repetições e notas.
3. **Avaliação de Prontidão (Readiness)**: Semáforo (Verde, Amarelo, Vermelho) para ajuste de intensidade baseado no estado físico do dia.
4. **Cronômetro e Timer de Descanso**: Temporizador flutuante para contagem de descanso entre séries e cronômetro total da sessão.
5. **Histórico e Exportação**: Armazenamento local das sessões anteriores e geração de arquivo Markdown (.md) para backup em dados/.
6. **Suporte Offline / PWA**: Funcionamento completo sem conexão através de Service Worker e manifesto PWA.

## Limites

- O sistema não possui backend multiusuário centralizado em nuvem; a persistência é local no dispositivo do usuário.
- Não realiza processamento de vídeo em tempo real ou análise por visão computacional.

## Contexto técnico

- **Frontend / PWA**: HTML5, CSS3 moderno, Vanilla JavaScript puro (sem dependência de bundler ou frameworks pesados).
- **Persistência**: localStorage no navegador + exportação em Markdown.
- **Offline / PWA**: Service Worker (sw.js) e Web App Manifest (manifest.webmanifest).
