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

## Autonomia e decisões delegadas

- A delegação de decisões de preferência ao Orquestrador só pode ocorrer quando o especialista registrar identificador, opções, recomendação, base, efeito, reversibilidade, classe e classificador; o Orquestrador apenas executa e registra a escolha, e o Prisma a audita nos gates e, se surgir após o Definition Gate, antes de produzir efeito. Use `AUTO_CONFIRMADA` para precedente explícito de baixo risco, `AUTO_PROVISORIA` para escolha segura e reversível ainda sem precedente, e `SEM_BASE` após uma única devolução ao especialista, sempre escolhendo o menor experimento reversível, encerrando o ciclo e exibindo-o no resumo final. Use obrigatoriamente `HUMANA_ANTES` para ação destrutiva ou irreversível, dados reais ou migração arriscada sem backup verificado e rollback registrado, gasto, credencial, privacidade, segurança, publicação, produção, efeito externo, mudança material de propósito ou escopo, conflito com texto ou decisão humana ou rollback não confiável. O limite de devoluções e o silêncio nunca convertem risco duro em autorização. O Orquestrador não audita nem valida a própria escolha. Aprovação final sem exercício observável não transforma sozinha uma decisão provisória em precedente confirmado; decisão não exercitada permanece provisória, e feedback contrário deve entrar por `specsfy-update-spec` e atualizar a preferência canônica.

- Cada ação visível na nota rosa deve conter uma única decisão em português cotidiano, usar até seis linhas no resumo principal na ordem `O que preciso de você`, `Minha recomendação`, `Responda` e `Por quê`, apresentar a recomendação primeiro, pedir somente `Aprovo` quando concordar for suficiente e mostrar no máximo três alternativas materiais. IDs, hashes, gates, locks, caminhos e demais detalhes técnicos ficam em `Specsfy - Operação` e na fonte normativa. Quando uma skill abrir entrevista interativa, preserve separadamente o Contrato de perguntas numeradas. A simplificação nunca remove ou enfraquece `HUMANA_ANTES` nem outra condição de segurança.

## Fila e concorrência da Partitura

- O Despachante executa passagens curtas e idempotentes, independentes da ocupação do Orquestrador, e não entrevista, implementa, audita nem decide produto. Item dependente da pessoa preserva o texto azul, recebe `AGUARDANDO_HUMANO` e vínculo rosa, e não impede que o próximo item independente seja atribuído no mesmo ciclo; ação rosa concluída promove o item a `PRONTO_PRIORITARIO` para atribuição em até uma passagem. Reutilize primeiro terminal adequado ocioso; mantenha no máximo dois fluxos, um terminal temporário vivo e Prisma singleton. Antes de qualquer escrita, o Ramo deve obter lock técnico atômico por tarefa, spec, `NNNN`, worktree e arquivos; a nota amarela apenas projeta esse estado. Após reinício, conserve lock de dono vivo, libere somente órfão com worktree comprovadamente limpa e preserve órfão divergente como `ADIADA_CONFLITO` com ação rosa. Radar é somente leitura; Farol e Prisma são escritores.
- Pedido azul cru sem `spec`, `NNNN` ou arquivos é um intake acionável, não uma dependência. O Despachante deriva uma identidade estável do texto preservado, projeta um único caminho em `specs/inbox/` e solicita ao Ramo o lock prospectivo `INTAKE:<queue_id>` antes de atribuir a captura. O recebedor executa `specsfy-setup` e `specsfy-01-inbox`; qualquer promoção posterior exige novo lock para os caminhos e o `NNNN` materializados pelo framework.
- Intake cru e captura retomada pertencem ao Orquestrador ativo ou a um único temporário com o mesmo papel, nunca ao Farol. Captura já existente recebe `INTAKE_CAPTURADA`, liberação confirmada do lock anterior e `INTAKE_CONTINUACAO`; o inbox literal não é reescrito, e nenhuma promoção ou outra escrita ocorre antes de novo lock do Ramo para os caminhos reais.
- A rotina só pode registrar `COMPLETED/delivered:true` quando o transcript muda e comprova tanto o prompt quanto atividade real do Despachante. Exit zero com tela inicial ou resposta inalterada é `NOT_READY/delivered:false` e permanece para nova tentativa; nunca conte `Fired` isoladamente como trabalho executado.
- `BUSY_SKIPPED` só é válido quando o último indicador vivo `Working/Exploring` do Despachante ocorre depois da última conclusão do próprio transcript. Estado histórico ou aninhado de outro terminal não caracteriza ocupação e não pode bloquear a passagem.
- `AGUARDANDO_HUMANO` sem agente produzindo efeito não conta, consome ou ocupa vaga do teto de dois fluxos ativos. Depois do checkpoint e da liberação segura aplicável, o Despachante continua pelo próximo item independente; locks, worktrees, arquivos, `NNNN`, Prisma singleton e o limite de um temporário permanecem conflitos próprios e não são contornados.
- Mensagens estruturadas entre terminais devem usar JSON compacto em uma única linha, com caminhos relativos e barras `/`. Envelope truncado ou incompleto resulta em `NOT_READY/ENVELOPE_INCOMPLETO`, sem lock ou efeito; preserve `queue_id`, `task_id`, owner, caminho prospectivo e `NNNN`, e reenvie o mesmo envelope completo somente em uma passagem posterior.
