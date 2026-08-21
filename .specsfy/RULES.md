# Regras do sistema

Estas regras complementam as instruções dos agentes sem substituir specs ou
critérios de aceite.

## Arquitetura

1. **Client-first / Zero-build**: Manter o projeto navegável e executável sem ferramentas de build obrigatórias, preservando a portabilidade do HTML/JS.
2. **Offline por padrão**: Todas as funcionalidades principais (registro de treinos, timer, histórico e exportação) devem operar 100% offline.
3. **Persistência explícita**: Mudanças em estrutura de dados no localStorage devem manter compatibilidade retroativa para não corromper históricos existentes do usuário.

## Código e qualidade

1. **Vanilla JS e CSS limpo**: Evitar adicionar bibliotecas pesadas de terceiros; utilizar APIs nativas da Web (Web Audio, Notification API, LocalStorage).
2. **Responsividade Mobile-first**: Todo componente de UI deve ser utilizável confortavelmente com uma só mão em telas a partir de 360px de largura.

## Testes e Validação

1. **Validação visual e funcional**: Testar sempre a persistência no localStorage, o fluxo do timer de descanso e a exportação correta dos arquivos Markdown.
2. **Sincronia Standalone**: Qualquer alteração estrutural no index.html deve ser refletida no 	reino_hibrido_juarez_v3_standalone.html.

## Segurança e privacidade

1. **Dados 100% Locais**: Nenhum dado pessoal ou histórico de treino deve ser enviado para servidores externos sem autorização expressa do usuário.
