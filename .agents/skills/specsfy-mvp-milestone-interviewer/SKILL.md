---
name: specsfy-mvp-milestone-interviewer
description: Use para importar e explorar o MVP, criar a milestone 1.0, Inboxes e backlogs candidatos e orquestrar as skills necessárias para entrevistar cada backlog. Leia `BRAND.md` da raiz quando existir. Não use para criar código.
---

# Explorar o MVP em uma série de Inboxes

## Preparação obrigatória

Antes de executar esta skill, carregue obrigatoriamente `$specsfy-setup` na
raiz do projeto. Em handoff automático, carregue-o de novo antes desta etapa.
Reutilize a raiz confirmada na conversa e não prossiga se o setup apontar uma
pendência.

## Modo de interação

Modo de interação: `perguntas`.
Antes de formular qualquer pergunta, leia e aplique o
`Contrato de perguntas numeradas` de `.specsfy/Spec.md`.

Esta skill é a orquestradora da entrada do MVP. Ela importa `MVP.md` como a
milestone 1.0, transforma seus temas em Inboxes e cria um backlog candidato
para cada Inbox. Em seguida, carrega as skills responsáveis para entrevistar
cada backlog e somente avança quando cada etapa tiver resultado confirmado.

## Carregar o contexto disponível

1. Resolva a raiz do projeto consumidor antes de ler qualquer arquivo. Se ela
   for um submódulo Git, descubra o superprojeto com
   `git -C <raiz> rev-parse --show-superproject-working-tree`. A saída não
   vazia acrescenta somente essa raiz pai à busca. Não percorra outros pais.
2. Leia `MVP.md` se existir como arquivo regular na raiz do consumidor. Quando
   ele estiver ausente e a raiz for um submódulo, leia `MVP.md` no
   superprojeto. O arquivo local tem prioridade. Preserve a fonte consultada e
   use-a como contexto declarado, sem substituir o que a pessoa disser.
3. Antes da primeira pergunta, execute uma única vez o importador:

   ```bash
   node \
     .agents/skills/specsfy-mvp-milestone-interviewer/scripts/importar_mvp.mjs \
     --root <raiz>
   ```

   O importador cria `specs/milestones/M01.md` a partir de `MVP.md`, uma Inbox
   para cada tema encontrado e um backlog candidato para cada Inbox. Cada
   backlog preserva um bloco de registros do trecho importado, mantém
   `Status: Captured` e passa por refinamento antes de qualquer promoção. Se
   `M01.md` existir, não sobrescreva nenhum arquivo e informe a pessoa
   responsável.
4. Leia `BRAND.md` seguindo a mesma ordem: raiz do consumidor e, somente como
   fallback de submódulo, superprojeto. Use-o para manter linguagem, público,
   proposta e limites de marca coerentes durante as perguntas. Não copie seu
   conteúdo para as Inboxes.
5. Registre a origem de `MVP.md` e `BRAND.md` em cada Inbox criada pelo
   importador. Não crie, mova nem altere esses arquivos de contexto.
6. Leia `PROJECT.md`, Inboxes, backlog e specs existentes apenas se ajudarem a
   evitar repetição ou contradição. Eles continuam separados da formulação
   recebida nesta sessão.
7. Trate o JSON retornado pelo importador como a fila ordenada de Inboxes e
   backlogs da sessão. Não descarte, reagrupe ou pule um item dessa fila.

Antes da importação, faça a mesma triagem de dados sensíveis usada pela Inbox.
Se a fonte tiver credencial, token, chave privada ou dado pessoal sensível,
não gere a milestone nem reproduza o valor em mensagens.

## Preservar a sessão

1. Derive uma identificação estável no formato `DESC-AAAAMMDD-<slug>` a partir
   do primeiro tema recebido.
2. Depois de cada resposta da pessoa, capture o conteúdo semântico em outra
   Inbox com a mesma sessão e o próximo turno. Quando ela responder somente
   `1`, `2` ou `3`, substitua o número pelo texto integral da opção escolhida
   antes de montar `--input`, `--summary`, `--signals` e os demais campos. A
   entrada literal pode constar na rastreabilidade da interação, mas não pode
   ser usada como contexto da milestone. Nunca edite, reúna ou substitua uma
   captura anterior. Uma Inbox também registra cada hipótese de milestone
   apresentada para confirmação.
3. Informe `--sources` em toda chamada: liste o caminho de `MVP.md` e
   `BRAND.md` consultados, inclusive quando vierem do superprojeto, ou indique
   que estavam ausentes.
4. Aplique a triagem de dados sensíveis do `$specsfy-01-inbox` antes de cada
   escrita. Se ela impedir a captura, interrompa a conversa até receber texto
   seguro para registrar.
5. Escreva em Português do Brasil a análise, a síntese, os metadados e qualquer
   milestone gerada. Se a fonte ou a resposta literal estiver em outro idioma,
   preserve-a apenas como citação e registre sua interpretação em Português do
   Brasil.

Use o script da Inbox com os campos da captura e acrescente a sessão:

```bash
node .agents/skills/specsfy-01-inbox/scripts/capturar_inbox.mjs \
  --input "<texto integral da pessoa>" \
  --title "<tema da descoberta>" \
  --session "DESC-AAAAMMDD-<slug>" \
  --turn "<número sequencial>" \
  --sources "<situação de MVP.md e BRAND.md>" \
  [campos de análise da Inbox] [--root <raiz>]
```

## Orquestrar as skills da descoberta

Para cada item da fila retornada pelo importador, execute esta sequência sem
pular responsabilidades:

1. Anuncie `Transição automática: $specsfy-mvp-milestone-interviewer para
   $specsfy-02-backlog; motivo: entrevistar o backlog derivado da Inbox;
   resultado esperado: backlog refinado com respostas confirmadas` e carregue
   `$specsfy-02-backlog` para o caminho do backlog candidato.
2. Leia primeiro os registros do MVP que acompanham esse backlog e use-os para
   preencher respostas já declaradas. Faça entrevista adaptativa somente para
   lacunas, ambiguidades ou contradições restantes. Preserve uma pergunta por
   rodada, resolva escolhas numéricas no texto da opção e respeite o limite de
   oito perguntas por área.
3. Se a Inbox ou a entrevista indicar informação a guardar ausente ou ambígua,
   anuncie a transição para `$specsfy-data-discovery`, conclua a entrevista de
   dados e retome o backlog com `.specsfy/DATABASE.md` como contexto.
4. Após cada backlog, retome esta skill, registre a situação do item na síntese
   da sessão e prossiga para o próximo backlog da fila. Não promova um backlog
   sem as respostas necessárias nem o deixe sem entrevista.
5. Quando a fila terminar, execute `specsfy milestones sync --project <raiz>` e
   carregue `$specsfy-milestone-governor` para conferir vínculos e progresso de
   `M01`. Só então carregue `$specsfy-03-specify` para os backlogs que a pessoa
   tenha autorizado promover.

## Conduzir uma conversa adaptativa

1. Comece por finalidade, pessoa atendida e problema observável.
2. Releia todas as Inboxes da sessão depois de cada captura. Mostre uma síntese
   curta que separe formulação recebida e hipótese da conversa.
3. Monte a rodada conforme o contrato central: uma pergunta numerada, opções
   específicas, `Escrever outra resposta` e `Avançar`.
4. Explore apenas o necessário para entender jornada, dados indispensáveis,
   papéis, regras, integrações, limites, demonstração e validação. Para cada
   informação a guardar não clara, carregue `$specsfy-data-discovery` e conclua
   essa descoberta antes de tratar o próximo ponto. Não aplique formulário
   fixo nem repita uma resposta já preservada.
5. Quando a pessoa encerrar ou adiar uma área, capture a formulação dela e
   indique a Inbox correspondente na síntese. Não preencha lacunas por conta
   própria.

## Encerrar e tratar depois

Ao encerrar, informe a identificação da sessão, `M01`, a lista ordenada de
Inboxes, todos os backlogs entrevistados, as respostas confirmadas e os pontos
abertos. Backlog só entra em `$specsfy-03-specify` quando a pessoa autorizar a
promoção depois da entrevista.

## Limites

- Não invente respostas, objetivo, condição de saída, fora de escopo ou
  vínculos de uma milestone.
- Não sobrescreva a milestone 1.0, Inboxes ou backlogs existentes.
- Não pule a entrevista de nenhum backlog gerado pelo importador.
- Não promova backlog para spec sem autorização explícita.
- Não trate Inbox como fonte normativa.
- Não use o entrevistador de roadmap para ampliar o MVP sem confirmação.
