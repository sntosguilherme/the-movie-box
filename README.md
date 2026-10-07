# Catálogo de Filmes — ED II

Primeira nota da disciplina de Estruturas de Dados II, minstrada pelo professor Lincoln.

Aplicação local com Next.js, TypeScript e Tailwind CSS.

## Executar

Com Node.js 20.9 ou superior e npm instalados:

```powershell
cd frontend
npm ci
npm run dev
```

Abra http://localhost:3000.

## Build e verificações

```powershell
npm run lint
npm run typecheck
npm run build
npm start
```

Execute o typecheck após a primeira execução de dev ou build, que gera os tipos do Next.js.

## Estrutura

- `frontend/`: aplicação Next.js e suas configurações.
- `frontend/app/`: rotas `/` e `/filmes/[id]`, layout e CSS global.
- `frontend/components/`: componentes reutilizáveis da interface.
- `backend/src/`: carregamento do catálogo, consultas e implementações das estruturas de dados.
- `data/movies.json`: catálogo usado pelo backend (formato abaixo).
- `pre-processing/`: scripts Python de preparação do dataset.

Execute os comandos acima dentro de `frontend/`.

Para entender a Splay Tree adaptada, a AVL e a lista encadeada de IDs, consulte o
[README do backend](backend/README.md). Ele descreve o funcionamento e todos os
métodos implementados nas estruturas.

## Dataset

`data/movies.json` é um array com 41.583 filmes. Cada registro tem:

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

`popularity`, `vote_average` e `vote_count` vêm do `movies_metadata.csv` do
[The Movies Dataset](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset),
associados pelo `id`. Todos os filmes do catálogo têm correspondência. Quando o
CSV repete um ID, vale a linha com mais votos. Para refazer a junção, baixe o CSV
e execute na raiz do repositório:

```powershell
python pre-processing/add_ratings.py caminho/movies_metadata.csv
```

O script só usa a biblioteca padrão, preserva a formatação do JSON e pode ser
executado de novo sobre um arquivo já atualizado.

`cast`, `directors`, `writers` e `composers` vêm do `credits.csv` do mesmo dataset,
também associados pelo `id`; quando o CSV repete um ID, vale a linha com mais créditos.
Para refazer a junção:

```powershell
python pre-processing/add_credits.py caminho/credits.csv
```

As fotos do `credits.csv` (de 2017) quase todas deixaram de existir no CDN do TMDB, então
`profile_url` vem da API do TMDB, consultada uma vez no pré-processamento: o app não
precisa da API para exibir as fotos. O script precisa de um token de leitura da API
(gratuito, em themoviedb.org → Configurações → API) na variável `TMDB_TOKEN`; no projeto
ele fica em `frontend/.env`, ignorado pelo git. Rode depois de `add_credits.py`:

```powershell
python pre-processing/add_cast_photos.py
```

As respostas da API ficam em `pre-processing/processed/`, então uma execução interrompida
continua de onde parou.

`tagline`, `runtime`, `original_title` e `original_language` vêm do mesmo
`movies_metadata.csv` usado por `add_ratings.py`, escolhendo a mesma linha quando o ID
se repete:

```powershell
python pre-processing/add_details.py caminho/movies_metadata.csv
```
