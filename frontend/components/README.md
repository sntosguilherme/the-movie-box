# Componentes

## Contratos

Os componentes usam a paleta de `app/globals.css`. Importe cada componente pelo seu arquivo em `@/components/`.

| Componente | Props | Comportamento |
| --- | --- | --- |
| `Header` | Nenhuma | Identidade do projeto e navegação para `/`; aplicado no layout global. |
| `SearchBar` | `value: string`, `onChange(value)` | Campo controlado; digitar informa o novo título e limpar informa `""`, devolvendo o foco ao campo. |
| `YearButtons` | `years: readonly number[]`, `selectedYear: number \| null`, `onSelectYear(year)` | Recebe os anos únicos disponíveis na AVL, na ordem desejada. `null` representa todos os anos. A seleção tem indicação visual e `aria-pressed`. |
| `MovieCard` | `movie: Movie`, `onMovieAccess?(movie)` | Pôster, título, ano e link para `/filmes/[id]`. O callback informa a ativação do link. Pôster ausente ou com erro usa a imagem de cinema em `public/poster-placeholder.svg`, com texto alternativo acessível. |
| `MovieGrid` | `movies: readonly Movie[]`, `onMovieAccess?(movie)` | Grade responsiva, preservando a ordem recebida, com mensagem para resultados vazios. |
| `RecentMovies` | `movies: readonly Movie[]`, `onMovieAccess?(movie)` | Lista ordenada que preserva exatamente a ordem de acesso retornada pela skip list, com mensagem para histórico vazio. |

O tipo `Movie`, exportado de `types.ts`, contém `id: string | number`, `title: string`, `year: number` e `posterUrl?: string | null`. Adapte os registros do dataset para esse contrato na camada que consulta as estruturas. Os pôsteres usam `next/image` com `unoptimized`, permitindo URLs recebidas por props sem configurar um serviço de otimização.

Busca e seleção de ano são controladas pelo componente pai, que deve atualizar as props após cada evento. As listas não filtram, ordenam ou alteram os dados recebidos. `onMovieAccess` permite que o pai registre o acesso na skip list. Quando fornecer callbacks, componha os componentes dentro de um Client Component (`"use client"`).

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
