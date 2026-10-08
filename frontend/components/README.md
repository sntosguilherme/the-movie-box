# Componentes

## Detalhes do filme

`BackButton` liga ao catálogo em `/`. `MovieDetails` recebe `movie: Movie` e exibe título, ano, nota, popularidade, gêneros, sinopse, duração, tagline, título original (`OriginalTitle`), ficha técnica (direção, roteiro e música, quando houver), `PosterImage` e o elenco em `CastList`; clicar no pôster abre um `<dialog>` com a versão ampliada. `PosterImage` recebe `title`, `posterUrl?`, `sizes`, `placeholderSizes?`, `eager?`, `transitionName?` e `className?`, mantém proporção 2:3, mostra um fundo sólido pulsante até a imagem carregar e um cartão com o título quando o pôster está ausente ou falha. `transitionName` liga o pôster da grade ao da página de detalhes por um `<ViewTransition>` do React. O tipo `Movie` também aceita `genres?: readonly string[]`, `overview?: string | null`, `popularity?: number`, `voteAverage?: number`, `voteCount?: number`, `cast?: readonly CastMember[]` (`{ name, character, photoUrl? }`) `directors?`, `writers?` e `composers?: readonly string[]`, `tagline?: string | null`, `runtime?: number | null`, `originalTitle?: string` e `originalLanguage?: string`.

Para testar, execute `npm run dev` em `frontend/` e abra `/exemplo`. A seção "Prévia dos detalhes" oferece um filme com pôster e outro sem pôster.

## Contratos

Os componentes usam a paleta de `app/globals.css`. Importe cada componente pelo seu arquivo em `@/components/`.

| Componente | Props | Comportamento |
| --- | --- | --- |
| `Header` | `search?: ReactNode`, `isLoading?: boolean` | Cabeçalho fixo com a identidade do projeto, link para `/` e botão `Recentes` que abre `/recentes`; quando recebe a busca, exibe o campo à direita. `isLoading` mostra uma barra de progresso na borda inferior. |
| `SearchBar` | `value: string`, `onChange(value)` | Campo controlado; digitar informa o novo título e o botão × informa `""`, devolvendo o foco ao campo. |
| `YearButtons` | `years: readonly number[]`, `selectedYear: number \| null`, `selectedDecade: number \| null`, `onSelectYear(year)`, `onSelectDecade(decade)` | Linha cronológica única, com pontos nas décadas disponíveis na AVL. Clicar numa década informa `onSelectDecade` e amplia a linha para seus anos; clicar num ano informa `onSelectYear`. A década aberta vem da seleção ou do ano na URL. O botão Décadas volta à visão geral e chama `onSelectYear(null)`; as setas passam às décadas vizinhas. A linha rola em telas pequenas e aceita Tab, Enter, Espaço, setas, Home e End. Exporta também `decadeOf(year)` e `decadeLabel(decade)`. |
| `DecadeStory` | `decade: number` | Painel com o contexto do cinema na década: título, resumo e três marcos. Os textos ficam em `decades.ts` (`DECADE_STORIES`), indexados pelo primeiro ano da década. |
| `CastList` | `cast: readonly CastMember[]` | Elenco em cartões com foto (pelo loader do TMDB), nome e personagem; sem foto, ou se ela falhar, mostra as iniciais. |
| `Footer` | — | Rodapé com a atribuição ao TMDB exigida pelos termos de uso da API. |
| `OriginalTitle` | `title: string`, `language: string`, `verticalClassName?: string` | Título original na fonte da sua escrita (Noto Serif JP, SC, TC, KR, Display, Devanagari, Thai, Hebrew ou Naskh Arabic), pedida ao Google Fonts só com os glifos do título (`text=`). Títulos CJK curtos ficam na vertical em telas largas; títulos em alfabeto latino aparecem em itálico. `isVerticalTitle` indica quando a versão vertical será usada. |
| `MovieCard` | `movie: Movie`, `eager?: boolean` | Pôster com nota, título, ano, primeiro gênero e link para `/filmes/[id]`. `eager` carrega o pôster com prioridade (usado na primeira linha da grade). |
| `MovieGrid` | `movies: readonly Movie[]`, `emptyAction?: ReactNode` | Grade responsiva, preservando a ordem recebida; os cards entram em sequência. O estado vazio exibe `emptyAction` abaixo da mensagem. |

O tipo `Movie`, exportado de `types.ts`, contém `id: string | number`, `title: string`, `year: number` e `posterUrl?: string | null`, além dos campos opcionais de detalhes, relevância e nota citados acima. Adapte os registros do dataset para esse contrato na camada que consulta as estruturas; `toMovie` em `lib/catalog.ts` converte `popularity`, `vote_average` e `vote_count` para `popularity`, `voteAverage` e `voteCount`. Os pôsteres do TMDB usam `next/image` com um loader próprio: o CDN do TMDB já publica cada imagem em larguras fixas (`w92` a `w780` e `original`), então o `srcset` aponta direto para o tamanho adequado, sem passar pelo otimizador do Next. As larguras do `srcset` estão em `images` no `next.config.ts`. Outras URLs são exibidas sem otimização.

Busca e seleção de ano são controladas pelo componente pai, que deve atualizar as props após cada evento. A grade preserva a ordem dos filmes recebidos e não faz consultas às estruturas. A camada de consulta combina a busca por título na splay tree com os IDs do ano ou da década selecionada na AVL (`searchByTitle` aceita um ano ou um intervalo `{ start, end }`). O componente que mantém o estado dos filtros deve ser um Client Component (`"use client"`).

Para experimentar os componentes sem carregar o catálogo, execute `npm run dev` em `frontend/` e abra `http://localhost:3000/exemplo`. A busca fica no cabeçalho e os anos aparecem acima da grade. A página usa filmes fictícios para testar a busca pelo início do título, os filtros combinados, a grade vazia e pôsteres disponíveis ou ausentes. Os links dos cards abrem a rota de detalhes ainda provisória.

```tsx
"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import YearButtons from "@/components/YearButtons";

export default function CatalogFilters({ years }: { years: readonly number[] }) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [decade, setDecade] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <SearchBar value={title} onChange={setTitle} />
      <YearButtons
        years={years}
        selectedYear={year}
        selectedDecade={decade}
        onSelectYear={(next) => { setYear(next); setDecade(null); }}
        onSelectDecade={(next) => { setYear(null); setDecade(next); }}
      />
    </div>
  );
}
```
