# Stack do sistema

Documente tecnologias estruturais e a evidência executável que confirma cada
uma. Preserve decisões humanas nas seções livres deste arquivo.

## Inventário detectado

<!-- specsfy:stack:start -->
| Camada | Tecnologia | Evidência |
| --- | --- | --- |
| Interface / Aplicação | HTML5 + CSS3 + Vanilla JavaScript | index.html, 	reino_hibrido_juarez_v3_standalone.html |
| PWA / Offline | Service Worker + Web Manifest | sw.js, manifest.webmanifest |
| Armazenamento Local | LocalStorage API | index.html (chaves de treino e histórico) |
| Exportação de Dados | Markdown (.md) | Diretório dados/ |
<!-- specsfy:stack:end -->

## Decisões e observações do projeto

- **Zero dependências externas / Bundler-free**: O código roda diretamente no navegador sem necessidade de build (
pm build, webpack, ite).
- **Compatibilidade móvel prioritária**: Layout responsivo com controles e fontes projetados para toque e visualização rápida em smartphone durante o treino.
- **Modo Standalone**: Arquivo 	reino_hibrido_juarez_v3_standalone.html mantém a experiência em arquivo único para abertura direta sem servidor HTTP.
