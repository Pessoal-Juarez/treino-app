# Banco de dados e persistência

Mapa de persistência e armazenamento de dados do aplicativo Treino Híbrido.

## Fontes de dados

<!-- specsfy:database:start -->
| Fonte | Tecnologia | Configuração segura | Evidência |
| --- | --- | --- | --- |
| Armazenamento Principal | Navegador (LocalStorage) | Chaves isoladas por origem/domínio | index.html (localStorage) |
| Arquivos de Backup | Markdown (.md) | Arquivos locais na pasta dados/ | Pasta dados/ |

## Estruturas

| Estrutura | Tipo | Campos | Relações | Fonte |
| --- | --- | --- | --- | --- |
| Registro de Treino / Sessão | Objeto JSON no LocalStorage | data, tipoTreino, prontidao, duracaoMinutos, series (exercicio, serie, peso, reps, rpe), notas | Ligado ao histórico de sessões | index.html |
| Configurações do Timer | Objeto JSON no LocalStorage | tempoDescansoPadrao, somHabilitado, vibracaoHabilitada, volume | Usado pelo cronômetro flutuante | index.html |
| Configuração do equipamento por exercício | Objeto JSON no LocalStorage, chave `treino_hibrido_juarez_v5_equipment` | Mapa por ID de exercício com exatamente três pares `{ label, value }`; JSON inválido retorna defaults e não é interpolado em HTML | Não altera carga/repetições das séries; restaurado somente para o mesmo ID de exercício | index.html e treino_hibrido_juarez_v3_standalone.html |
<!-- specsfy:database:end -->

## Decisões, ownership e retenção

- **Ownership dos dados**: Pertence exclusivamente a Juarez (armazenamento local no dispositivo).
- **Backup**: O usuário pode exportar o histórico em Markdown a qualquer momento para backup e portabilidade.
- **Limpeza**: A limpeza de cache/dados do navegador zera o LocalStorage; a exportação periódica é recomendada antes de atualizações importantes.
