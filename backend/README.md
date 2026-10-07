# Estruturas de dados do catálogo

O catálogo usa três estruturas: uma Splay Tree para os filmes, uma AVL para
indexar os anos de lançamento e uma lista auto-organizável para guardar os IDs
dos filmes de cada ano.

O tipo `Filme` (`src/models/filme.ts`) segue o formato de `data/movies.json`
descrito no [README da raiz](../README.md#dataset): além dos dados de exibição,
cada filme traz `popularity` (relevância), `vote_average` (nota de 0 a 10) e
`vote_count`. As estruturas não dependem desses campos: a Splay Tree continua
ordenada pelo ID e a AVL pelo ano.

## Splay Tree adaptada

A Splay Tree adaptada guarda cada objeto `Filme` uma única vez, ordenado pelo
`id`. A busca explícita por ID usa o splay tradicional e move o nó até a raiz.
A abertura da página de detalhes aproxima o filme gradualmente: na primeira
abertura ele sobe até o nível 4, na segunda até o nível 2 e, na terceira, até
a raiz (nível 1). As rotações `zig`, `zig-zig` e `zig-zag` preservam a
propriedade de árvore binária de busca em todos os casos.

O custo amortizado clássico de `O(log n)` aplica-se ao splay completo. As
aberturas parciais são uma regra específica deste catálogo. O algoritmo calcula
a profundidade atual pelo encadeamento de pais após cada rotação e para ao atingir
a profundidade-alvo; portanto, o nó não precisa armazenar sua altura. A tela
inicial percorre a árvore por níveis: raiz, filhos, netos e assim por diante.

| Abertura dos detalhes | Alvo | Profundidade-alvo |
| ---: | --- | ---: |
| 1ª | nível 4 | 3 |
| 2ª | nível 2 | 1 |
| 3ª e posteriores | raiz (nível 1) | 0 |

| Método | Descrição |
| --- | --- |
| `insert(movie)` | Insere um filme pelo ID; retorna `false` se o ID já existir. |
| `findById(id)` | Encontra um filme e faz splay completo até a raiz. |
| `peekById(id)` | Encontra um filme sem alterar a árvore. |
| `openDetails(id)` | Registra a abertura dos detalhes e promove o filme para os níveis 4, 2 e 1 nas três primeiras aberturas, respectivamente. |
| `getDetailOpenCount(id)` | Retorna quantas vezes os detalhes do filme foram abertos. |
| `remove(id)` | Remove um filme da árvore e o retorna. |
| `depthOf(id)` | Retorna a profundidade atual de um filme. |
| `movies()` | Percorre os filmes em ordem crescente de ID. |
| `moviesPreOrder()` | Percorre raiz, subárvore esquerda e subárvore direita. |
| `moviesLevelOrder()` | Percorre por níveis: raiz, filhos, netos e assim por diante. |
| `size` | Informa o número de filmes armazenados. |
| `rootId` | Informa o ID do filme que está na raiz. |
| `locate(id)` *(interno)* | Localiza o nó de um ID sem fazer rotações. |
| `rotateLeft(node)` *(interno)* | Faz uma rotação simples à esquerda. |
| `rotateRight(node)` *(interno)* | Faz uma rotação simples à direita. |
| `replaceInParent(node, replacement)` *(interno)* | Substitui um nó pelo seu sucessor no pai ou na raiz. |
| `rotateUp(node)` *(interno)* | Sobe um nó uma posição por rotação. |
| `splay(node, limit)` *(interno)* | Executa o splay completo ou limitado por número de rotações. |
| `splayToDepth(node, targetDepth)` *(interno)* | Sobe um nó até a profundidade indicada. |
| `nodeDepth(node)` *(interno)* | Calcula a profundidade de um nó. |

## AVL Tree

A AVL usa o ano de lançamento como chave. Cada nó representa um ano e mantém
uma lista auto-organizável com os IDs dos filmes lançados nele. As rotações da AVL
mantêm a árvore balanceada após cada inserção.

| Método | Descrição |
| --- | --- |
| `insert(year, id)` | Insere o ID de um filme no ano informado e rebalanceia a árvore quando necessário. |
| `getIdsByYear(year)` | Itera os IDs associados a um ano diretamente pela lista auto-organizável. |
| `getIdsByYearRange(startYear, endYear)` | Itera os IDs de todos os anos dentro do intervalo, em ordem de ano. |
| `moveIdToFront(year, id)` | Move um ID acessado para o início da lista do ano, se ele existir. |
| `years()` | Gerador que percorre os anos cadastrados em ordem crescente. |
| `getHeight(node)` *(interno)* | Obtém a altura de um nó. |
| `getBalance(node)` *(interno)* | Calcula o fator de balanceamento de um nó. |
| `leftRotate(node)` *(interno)* | Faz uma rotação à esquerda para rebalancear a árvore. |
| `rightRotate(node)` *(interno)* | Faz uma rotação à direita para rebalancear a árvore. |
| `insertNode(node, year, id)` *(interno)* | Insere recursivamente e aplica os casos de balanceamento. |
| `rangeSearch(node, start, end, result)` *(interno)* | Percorre somente os ramos que podem conter anos no intervalo. |

## Lista auto-organizável de IDs

Cada nó da AVL possui uma `SelfOrganizingList` para guardar os IDs dos filmes
daquele ano, sem duplicar os objetos completos de filme. Ela usa a heurística
*move-to-front*: ao encontrar um ID, seu nó é removido da posição atual e passa
a ser a cabeça da lista. Isso favorece acessos repetidos ao mesmo filme.

Ao abrir os detalhes de um filme, o catálogo move seu ID para o início da lista
do ano correspondente. Assim, numa nova listagem filtrada por esse ano, o filme
aberto aparece antes dos demais.

| Método | Descrição |
| --- | --- |
| `add(id)` | Acrescenta um ID ao fim da lista. |
| `find(id)` | Encontra o ID e o move para o início da lista. |
| `[Symbol.iterator]()` | Percorre os IDs da lista, do primeiro ao último. |
