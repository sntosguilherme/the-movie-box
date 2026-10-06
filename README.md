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
