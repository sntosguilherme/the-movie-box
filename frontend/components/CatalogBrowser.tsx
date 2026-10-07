"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Header from "./Header";
import MovieGrid from "./MovieGrid";
import SearchBar from "./SearchBar";
import YearButtons from "./YearButtons";
import type { Movie } from "./types";

export type CatalogBrowserProps = {
  years: readonly number[];
  title: string;
  year: number | null;
  nextLimit: number;
  returnHref: string;
  movies: readonly Movie[];
  hasMore: boolean;
};

export default function CatalogBrowser({ years, title, year, nextLimit, returnHref, movies, hasMore }: CatalogBrowserProps) {
  const router = useRouter();
  const [query, setQuery] = useState(title);
  const [isPending, startTransition] = useTransition();

  function navigate(nextTitle: string, nextYear: number | null, nextLimit?: number) {
    const params = new URLSearchParams();
    if (nextTitle.trim()) params.set("titulo", nextTitle);
    if (nextYear !== null) params.set("ano", String(nextYear));
    if (nextLimit) params.set("limite", String(nextLimit));
    const search = params.toString();
    startTransition(() => router.replace(search ? `/?${search}` : "/", { scroll: false }));
  }

  function changeTitle(value: string) {
    setQuery(value);
    navigate(value, year);
  }

  function clearFilters() {
    setQuery("");
    navigate("", null);
  }

  return (
    <>
      <Header search={<SearchBar value={query} onChange={changeTitle} />} />
      <main className="w-full space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Catálogo de Filmes</h1>
          <p className="text-muted">Busque pelo início do título e filtre pelo ano de lançamento.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-[15rem_minmax(0,1fr)]">
          <aside aria-label="Filtro por ano" className="space-y-5 self-start rounded-lg border border-border bg-surface p-5">
            <button type="button" onClick={clearFilters} disabled={!query.trim() && year === null} className="w-full">
              Limpar filtros
            </button>
            <div>
              <YearButtons years={years} selectedYear={year} onSelectYear={(next) => navigate(query, next)} layout="column" />
            </div>
          </aside>

          <section aria-labelledby="catalog-results" aria-busy={isPending} className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="catalog-results" className="text-xl font-bold">Filmes</h2>
              <p role="status" className="text-sm text-muted">
                {movies.length === 0 ? "" : `Mostrando ${movies.length} ${movies.length === 1 ? "filme" : "filmes"}`}
              </p>
            </div>
            <div className={isPending ? "opacity-60" : undefined}>
              <MovieGrid movies={movies} returnHref={returnHref} />
            </div>
            {hasMore && (
              <button type="button" onClick={() => navigate(query, year, nextLimit)} disabled={isPending} className="w-full">
                Carregar mais
              </button>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
