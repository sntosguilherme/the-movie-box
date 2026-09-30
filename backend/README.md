# Estruturas de dados do catálogo

O catálogo usa três estruturas: uma Splay Tree para os filmes, uma AVL para
indexar os anos de lançamento e uma lista encadeada para guardar os IDs dos
filmes de cada ano.

## Splay Tree adaptada

A Splay Tree adaptada guarda cada objeto `Filme` uma única vez, ordenado pelo
`id`. A busca explícita por ID usa o splay tradicional e move o nó até a raiz.
Já a abertura da página de detalhes usa splay parcial nas três primeiras vezes,
para aproximar o filme gradualmente; somente a quarta abertura faz o splay
completo. As rotações `zig`, `zig-zig` e `zig-zag` preservam a propriedade de
árvore binária de busca em todos os casos.

O custo amortizado clássico de `O(log n)` aplica-se ao splay completo. As
aberturas com splay parcial são uma regra específica deste catálogo e têm custo
limitado pela quantidade de rotações definida para cada abertura. A tela inicial
percorre a árvore por níveis: raiz, filhos, netos e assim por diante.

| Método | Descrição |
| --- | --- |
| `insert(movie)` | Insere um filme pelo ID; retorna `false` se o ID já existir. |
| `findById(id)` | Encontra um filme e faz splay completo até a raiz. |
| `peekById(id)` | Encontra um filme sem alterar a árvore. |
| `openDetails(id)` | Registra a abertura dos detalhes e reorganiza a árvore: 4 rotações na primeira abertura, 8 na segunda, até o nível 3 na terceira e splay completo na quarta. |
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
uma lista encadeada com os IDs dos filmes lançados nele. As rotações da AVL
mantêm a árvore balanceada após cada inserção.

| Método | Descrição |
| --- | --- |
| `insert(year, id)` | Insere o ID de um filme no ano informado e rebalanceia a árvore quando necessário. |
| `getIdsByYear(year)` | Itera os IDs associados a um ano diretamente pela lista encadeada. |
| `getIdsByYearRange(startYear, endYear)` | Itera os IDs de todos os anos dentro do intervalo, em ordem de ano. |
| `years()` | Gerador que percorre os anos cadastrados em ordem crescente. |
| `getHeight(node)` *(interno)* | Obtém a altura de um nó. |
| `getBalance(node)` *(interno)* | Calcula o fator de balanceamento de um nó. |
| `leftRotate(node)` *(interno)* | Faz uma rotação à esquerda para rebalancear a árvore. |
| `rightRotate(node)` *(interno)* | Faz uma rotação à direita para rebalancear a árvore. |
| `insertNode(node, year, id)` *(interno)* | Insere recursivamente e aplica os casos de balanceamento. |
| `rangeSearch(node, start, end, result)` *(interno)* | Percorre somente os ramos que podem conter anos no intervalo. |

## Lista encadeada de IDs

Cada nó da AVL possui uma lista encadeada interna para guardar os IDs dos
filmes daquele ano, sem duplicar os objetos completos de filme. As consultas
percorrem essa lista diretamente; ela não é transformada em array.

| Método | Descrição |
| --- | --- |
| `add(id)` | Acrescenta um ID ao fim da lista. |
| `[Symbol.iterator]()` | Percorre os IDs da lista encadeada, do primeiro ao último. |
