<!-- nexus:start -->
## Nexus Studio

This project is tracked by Nexus Studio. Its state lives in `.nexus/`:
`board.yaml` is the board, `issues/` the cards, `specs/<ISSUE>/` their specs,
`features/<KEY>/` a feature's planning docs, and `method/` the workflows and
agents you follow. Read `.nexus/method/NEXUS-PATHS.md` for the path contract.

**The board has one writer, the app.** Never edit `board.yaml`. Record work by
updating the spec's tasks and appending a comment to the issue.

**What a person wrote is not yours to rewrite.** An issue's description and its
acceptance criteria, and anything a person wrote in a spec, are the INPUT to
your work. Do not reword, reorder, shorten, tidy or remove them. If something
there is wrong or missing, say so in your comment and ADD alongside it. Append
your comment; never replace the comments already on the issue.

**Use the code index before searching by hand.** This project is indexed by
codegraph: run `codegraph explore "<symbols or question>"` to get the relevant
source and its call paths in one call, instead of grepping and reading files.

**Use memory.** Check what the project already remembers before asking the
person to repeat context, and record decisions worth keeping.
<!-- nexus:end -->

<!-- contorno-perguntas-codex:start -->
## Contorno local para perguntas do Codex

Este projeto possui um contorno local para o erro do Bash protegido do Codex no
Windows. Quando uma instrução mandar abrir uma pergunta pelo Nexus Studio:

1. Mostre primeiro o menu escrito completo, com uma decisão por pergunta e
   rótulos descritivos, nunca apenas letras.
2. Tente o comando Bash solicitado pelo turno.
3. Se o Bash falhar antes de iniciar o Nexus Studio com `Win32 error 5`, use o
   script `ferramentas-nexus/perguntar-pessoa.ps1` diretamente pelo PowerShell.
4. Passe ao script exatamente o mesmo JSON que seria enviado ao parâmetro
   `--ask`:

   ```powershell
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\ferramentas-nexus\perguntar-pessoa.ps1" -PerguntaJson '<json>'
   ```

5. Mantenha essa execução viva até chegar a resposta. Se a ferramenta devolver
   um identificador de sessão, continue consultando a mesma sessão; não inicie
   outro comando e não trate uma mensagem de espera como resposta.

O script repete internamente a mesma pergunta enquanto a janela estiver na tela.
Ele não escolhe pela pessoa e informa um erro claro se o ticket tiver expirado.
<!-- contorno-perguntas-codex:end -->

<!-- specsfy:framework:start -->
## Framework Specsfy

Leia e siga integralmente `.specsfy/Spec.md` antes de trabalhar com
backlogs, refinamentos do backlog, especificações, tarefas, testes ou implementação. Esse
arquivo contém o fluxo, os caminhos canônicos e os gates do framework.

- Preserve as instruções próprias deste projeto.
- O diretório do projeto é o caminho informado durante `$specsfy-setup`. Use-o
  em toda leitura e escrita posterior. Se ele estiver dentro de um Hub, não
  promova o trabalho para a raiz Git nem crie contexto, specs ou código fora
  desse caminho.
- Leia `PROJECT.md`, `.specsfy/STACK.md`, `.specsfy/RULES.md`,
  `.specsfy/DATABASE.md` e `.specsfy/PACKAGES.md` como contexto persistente
  antes de planejar mudanças.
- Quando `.specsfy/SPECKIT.md` existir, leia
  `.specify/memory/constitution.md` e cada fonte do GitHub Spec Kit listada na
  projeção. Preserve `.specify/` e os artefatos já existentes em `specs/`; o
  Specsfy não os migra nem os substitui.
- Antes de iniciar qualquer skill do framework, execute obrigatoriamente
  `$specsfy-setup` para verificar e reconciliar o contexto e os blocos
  reservados. A própria `$specsfy-setup` não se chama recursivamente. Em uma
  transição automática, execute-a de novo com a mesma raiz já confirmada antes
  de carregar a skill de destino. Execute `$specsfy-documentator` quando
  `PACKAGES.md` estiver ausente ou desatualizado.
- Execute o monitor de contexto no início, após cada tarefa e antes de concluir
  a entrega; resolva todo resultado `PENDING`.
- Use as skills `specsfy-aux-*` para manter stack, regras e banco sem apagar
  conteúdo humano.
- Execute `$specsfy-documentator` depois de cada implementação para reconstruir
  a documentação técnica completa em `docs/` e o registro de dependências em
  `.specsfy/PACKAGES.md`.
- Use `specs/inbox/` para capturas imediatas ainda não refinadas.
- Use `specs/backlog/` para itens refináveis ainda não promovidos.
- Use `specs/<estado>/<NNNN>-<slug>/spec.md` como fonte normativa de cada
  fatia, em uma única pasta de estado.
- Não crie `plan.md`, `tasks.md`, `research.md` ou outra fonte normativa
  paralela.
<!-- specsfy:framework:end -->
