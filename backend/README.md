# Backend do catálogo

Biblioteca TypeScript para Node.js. O catálogo completo fica em uma splay tree
ordenada pelo ID; não existe `Map` com cópias dos filmes.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `src/models/filme.ts` | Tipo do registro do JSON |
| `src/structures/splay-tree.ts` | Nós, rotações e operações da árvore |
| `src/catalog/catalog.ts` | Consultas usadas pela aplicação |
| `src/catalog/load-catalog.ts` | Leitura do JSON e criação do catálogo |
| `src/cli.ts` | Interface de teste com 100 filmes |
| `test/` | Testes da árvore e das consultas |

`dist/` é gerado pela compilação e ignorado pelo Git.

```powershell
cd backend
npm ci
npm test
```

## CLI para experimentar a árvore

```powershell
cd backend
npm ci
npm start
```

A CLI carrega os **100 primeiros filmes** de `data/movies.json` em uma árvore
nova. Digite `lista 10` para ver IDs disponíveis, `consultar 862` para ler sem
reorganizar, `abrir 862` repetidamente para observar o splay parcial e
`buscar 862` para fazer splay completo. Os comandos mostram a raiz e a
profundidade antes e depois do acesso. `titulo toy` percorre o catálogo sem
splay, `remover 862` testa a remoção, `reiniciar` restaura os 100 filmes e
`ajuda` lista todos os comandos. As alterações da CLI ficam só na memória.

`loadCatalog(caminhoDoJson)` lê `data/movies.json` e devolve um `Catalog`.
`catalog.openDetails(id)` registra a abertura e pode reorganizar a árvore.
`catalog.resolveIds(ids)` resolve os IDs produzidos pela futura AVL sem splay.
`catalog.searchByTitle(termo)` percorre a árvore sem splay. A árvore também
oferece `insert`, `findById` (splay completo), `peekById` (sem splay),
`remove` e `movies()` (percurso ordenado).

Cada nó guarda o filme completo uma vez e uma contagem de aberturas. Na abertura
número `i`, o limite de rotações é `2*i` (2, 4, 6, 8, ...). Uma rotação final
isolada sempre move o filme um nível acima. A regra está documentada junto da
implementação.

Inserção, busca e remoção custam `O(h)` na altura atual da árvore. Splay
completo tem custo amortizado `O(log n)`; o splay parcial limita o trabalho
por abertura. O percurso e a busca por título custam `O(n)`.

Esta issue entrega a biblioteca do backend. As rotas da interface ainda estão
em construção; a página de detalhes deve chamar `openDetails`, enquanto a
listagem por ano deve passar os IDs da AVL a `resolveIds`.
