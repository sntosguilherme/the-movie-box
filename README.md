# Catálogo de Filmes — ED II

Primeira nota da disciplina de Estruturas de Dados II, ministrada pelo professor Lincoln.

Aplicação local com Next.js, TypeScript e Tailwind CSS. O catálogo de 41.577 filmes é
mantido em memória por três estruturas implementadas no backend: uma Splay Tree com os
filmes (chave: ID), uma AVL com os anos de lançamento e, em cada ano, uma lista
auto-organizável com os IDs dos filmes.

## Funcionalidades

- Tela inicial com os filmes na ordem da Splay Tree, percorrida por níveis. A carga
  inicial insere os filmes do menos para o mais popular, então os mais populares
  aparecem primeiro.
- Busca pelo início do título, sem diferenciar acentos e maiúsculas.
- Filtro por década (intervalo de anos na AVL) ou por ano, com um painel sobre o
  cinema da década. Busca e filtros podem ser combinados.
- Rolagem infinita: novas páginas de 24 filmes são carregadas ao chegar ao fim da grade.
- Página de detalhes em `/filmes/[id]` com pôster, nota, sinopse, ficha técnica, elenco
  com fotos e título original. Cada abertura aproxima o filme da raiz da Splay Tree e
  move seu ID para o início da lista do ano, então filmes acessados passam a aparecer
  antes.
- Página `/exemplo` com filmes fictícios para testar os componentes sem o catálogo.

Os filtros ficam na URL (`?titulo=`, `?ano=`, `?decada=`), então uma busca pode ser
recarregada ou compartilhada.

## Executar

Com Node.js 20.9 ou superior e npm instalados:

```powershell
cd frontend
npm ci
npm run dev
```

Abra http://localhost:3000. O servidor carrega `data/movies.json` uma vez, na primeira
requisição.

## Build e verificações

Dentro de `frontend/`:

```powershell
npm run lint
npm run typecheck
npm run build
npm start
```

Execute o typecheck após a primeira execução de dev ou build, que gera os tipos do Next.js.

## Backend

O backend não tem servidor próprio: o Next.js importa os arquivos `.ts` de `backend/src/`
diretamente. Para rodar os testes e a CLI, dentro de `backend/`:

```powershell
npm ci
npm test
npm start
```

`npm test` compila e executa os testes das estruturas e do catálogo com o test runner do
Node. `npm start` abre uma CLI interativa com os 100 primeiros filmes do dataset, útil para
acompanhar as rotações da Splay Tree: `lista`, `titulo`, `consultar`, `abrir`, `buscar`,
`remover` e `raiz` mostram a profundidade do filme e a raiz antes e depois de cada operação.
Digite `ajuda` para ver todos os comandos.

Para entender a Splay Tree adaptada, a AVL e a lista auto-organizável de IDs, consulte o
[README do backend](backend/README.md). Ele descreve o funcionamento e todos os
métodos implementados nas estruturas. Os componentes da interface estão descritos no
[README dos componentes](frontend/components/README.md).

## Estrutura

- `frontend/`: aplicação Next.js e suas configurações.
- `frontend/app/`: rotas `/`, `/filmes/[id]` e `/exemplo`, layout e CSS global.
- `frontend/components/`: componentes reutilizáveis da interface.
- `frontend/lib/catalog.ts`: carrega o catálogo no servidor e converte os filmes para os componentes.
- `backend/src/`: carregamento do catálogo, consultas, CLI e implementações das estruturas de dados.
- `backend/test/`: testes das estruturas e do catálogo.
- `data/movies.json`: catálogo usado pelo backend (formato abaixo).
- `pre-processing/`: scripts Python de preparação do dataset.

## Dataset

`data/movies.json` é um array com 41.577 filmes, lançados de 1874 a 2017. Cada registro tem:

| Campo | Tipo | Conteúdo |
| --- | --- | --- |
| `id` | `number` | ID do TMDB, chave da Splay Tree |
| `title` | `string` | Título |
| `overview` | `string` | Sinopse |
| `genres` | `string[]` | Gêneros |
| `release_date` | `string` | Data `AAAA-MM-DD`; o ano é a chave da AVL |
| `poster_url` | `string \| null` | Pôster no TMDB |
| `popularity` | `number` | Relevância do TMDB, sem limite superior (maior é mais relevante) |
| `vote_average` | `number` | Nota média de 0 a 10 |
| `vote_count` | `number` | Quantidade de votos; com 0 votos, `vote_average` também é 0 |
| `cast` | `{ id, name, character, profile_url }[]` | Até seis atores, na ordem dos créditos; vazio em 4% dos filmes. `id` é o ID de pessoa no TMDB e `profile_url` a foto atual (ou `null`) |
| `directors` | `string[]` | Direção (até três nomes) |
| `writers` | `string[]` | Roteiro: funções `Screenplay` e `Writer` (até três nomes) |
| `composers` | `string[]` | Música: funções `Original Music Composer` e `Music` (até três nomes) |
| `tagline` | `string \| null` | Frase de divulgação; presente em 48% dos filmes |
| `runtime` | `number \| null` | Duração em minutos |
| `original_title` | `string` | Título no idioma original, como está no dataset (pode estar em outro alfabeto, como 千と千尋の神隠し) |
| `original_language` | `string` | Código ISO 639-1 do TMDB; `cn` é cantonês |

## Pré-processamento

Os dados vêm do [The Movies Dataset](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset)
do Kaggle. Os CSVs não ficam no repositório. Os scripts abaixo rodam na raiz do
repositório, nesta ordem. Só é preciso executá-los para gerar o catálogo de novo, o app
usa o `data/movies.json` já versionado.

### 1. Limpeza e pôsteres

`pre-processing.py` lê `data/movies_metadata.csv`, descarta filmes sem ID, título,
sinopse, gêneros ou data válidos e busca na API do TMDB a URL atual de cada pôster.
Precisa de `pandas`, `requests` e `python-dotenv`, e de um token de leitura da API do TMDB
(gratuito, em themoviedb.org → Configurações → API) na variável `TMDB_API_TOKEN`, que
também pode ficar em `pre-processing/.env`.

```powershell
python pre-processing/pre-processing.py
```

As URLs consultadas ficam em cache em `data/processed/`, então uma execução interrompida
continua de onde parou. `--limite N` limita as consultas da execução e `--sem-api` gera o
catálogo só com o cache. O resultado, apenas com os filmes que têm pôster, é salvo em
`data/processed/movies.json`; os scripts seguintes atualizam `data/movies.json`.

### 2. Popularidade e notas

`popularity`, `vote_average` e `vote_count` vêm do mesmo `movies_metadata.csv`,
associados pelo `id`. Todos os filmes do catálogo têm correspondência. Quando o
CSV repete um ID, vale a linha com mais votos.

```powershell
python pre-processing/add_ratings.py caminho/movies_metadata.csv
```

Este e os scripts seguintes só usam a biblioteca padrão, preservam a formatação do JSON e
podem ser executados de novo sobre um arquivo já atualizado.

### 3. Créditos

`cast`, `directors`, `writers` e `composers` vêm do `credits.csv` do mesmo dataset,
também associados pelo `id`. Quando o CSV repete um ID, vale a linha com mais créditos.

```powershell
python pre-processing/add_credits.py caminho/credits.csv
```

### 4. Fotos do elenco

As fotos do `credits.csv` (de 2017) quase todas deixaram de existir no CDN do TMDB, então
`profile_url` vem da API do TMDB, consultada uma vez no pré-processamento: o app não
precisa da API para exibir as fotos. O script precisa do token de leitura na variável
`TMDB_TOKEN`; no projeto ele fica em `frontend/.env`, ignorado pelo git. Rode depois de
`add_credits.py`:

```powershell
python pre-processing/add_cast_photos.py
```

As respostas da API ficam em `pre-processing/processed/`, então uma execução interrompida
continua de onde parou.

### 5. Detalhes

`tagline`, `runtime`, `original_title` e `original_language` vêm do mesmo
`movies_metadata.csv` usado por `add_ratings.py`, escolhendo a mesma linha quando o ID
se repete:

```powershell
python pre-processing/add_details.py caminho/movies_metadata.csv
```
