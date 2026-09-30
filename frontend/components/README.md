# Componentes

## Detalhes do filme

`BackButton` liga ao catálogo em `/`. `MovieDetails` recebe `movie: Movie` e exibe título, ano, gêneros, sinopse e `PosterImage`. `PosterImage` recebe `title`, `posterUrl?` e `className?`, mantém proporção 2:3 e usa `/poster-placeholder.svg` quando o pôster está ausente ou falha. O tipo `Movie` também aceita `genres?: readonly string[]` e `overview?: string | null`.

Para testar, execute `npm run dev` em `frontend/` e abra `/exemplo`. A seção "Prévia dos detalhes" oferece um filme com pôster e outro sem pôster.

## Contratos

Os componentes usam a paleta de `app/globals.css`. Importe cada componente pelo seu arquivo em `@/components/`.

| Componente | Props | Comportamento |
| --- | --- | --- |
| `Header` | `search?: ReactNode` | Identidade do projeto e navegação para `/`; quando recebe a busca, mostra uma lupa que abre o campo no cabeçalho e pode ser fechada com o botão ou Escape. |
| `SearchBar` | `value: string`, `onChange(value)` | Campo controlado; digitar informa o novo título e limpar informa `""`, devolvendo o foco ao campo. |
| `YearButtons` | `years: readonly number[]`, `selectedYear: number \| null`, `onSelectYear(year)`, `layout?: "row" \| "column"` | Recebe os anos únicos disponíveis na AVL, na ordem desejada. `null` representa todos os anos. A seleção tem indicação visual e `aria-pressed`; `layout="column"` dispõe os anos na lateral. |
| `MovieCard` | `movie: Movie` | Pôster, título, ano e link para `/filmes/[id]`. Pôster ausente ou com erro usa a imagem de cinema em `public/poster-placeholder.svg`, com texto alternativo acessível. |
| `MovieGrid` | `movies: readonly Movie[]` | Grade responsiva, preservando a ordem recebida, com mensagem para resultados vazios. |

O tipo `Movie`, exportado de `types.ts`, contém `id: string | number`, `title: string`, `year: number` e `posterUrl?: string | null`. Adapte os registros do dataset para esse contrato na camada que consulta as estruturas. Os pôsteres usam `next/image` com `unoptimized`, permitindo URLs recebidas por props sem configurar um serviço de otimização.

Busca e seleção de ano são controladas pelo componente pai, que deve atualizar as props após cada evento. A grade preserva a ordem dos filmes recebidos e não faz consultas às estruturas. A camada de consulta combina a busca por título na splay tree com os IDs do ano selecionado na AVL. O componente que mantém o estado dos filtros deve ser um Client Component (`"use client"`).

Para experimentar os componentes sem carregar o catálogo, execute `npm run dev` em `frontend/` e abra `http://localhost:3000/exemplo`. A lupa abre a busca no cabeçalho e os anos aparecem na lateral. A página usa filmes fictícios para testar a busca pelo início do título, os filtros combinados, a grade vazia e pôsteres disponíveis ou ausentes. Os links dos cards abrem a rota de detalhes ainda provisória.

```tsx
"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import YearButtons from "@/components/YearButtons";

export default function CatalogFilters({ years }: { years: readonly number[] }) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <SearchBar value={title} onChange={setTitle} />
      <YearButtons years={years} selectedYear={year} onSelectYear={setYear} />
    </div>
  );
}
```
