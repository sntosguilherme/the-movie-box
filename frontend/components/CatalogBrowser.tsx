"use client";

import { useRouter } from "next/navigation";
import { LoaderCircle, X } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState, useTransition } from "react";
import Header from "./Header";
import MovieGrid from "./MovieGrid";
import SearchBar from "./SearchBar";
import DecadeStory from "./DecadeStory";
import YearButtons, { decadeLabel, decadeOf } from "./YearButtons";
import type { Movie } from "./types";

export type CatalogBrowserProps = {
  years: readonly number[];
  title: string;
  year: number | null;
  decade: number | null;
  nextLimit: number;
  movies: readonly Movie[];
  hasMore: boolean;
};

const filterChip =
  "inline-flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] pl-3 pr-2 text-sm text-foreground transition-colors hover:border-accent/50 hover:bg-accent/10";

type Filters = {
  title: string;
  year: number | null;
  decade: number | null;
  limit?: number;
};

export default function CatalogBrowser({ years, title, year, decade, nextLimit, movies, hasMore }: CatalogBrowserProps) {
  const router = useRouter();
  const [query, setQuery] = useState(title);
  const [isPending, startTransition] = useTransition();
  // Transição separada para a rolagem infinita: carregar a próxima página não esmaece a grade.
  const [isLoadingMore, startLoadingMore] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasFilters = query.trim() !== "" || year !== null || decade !== null;
  const storyDecade = year === null ? decade : decadeOf(year);

  function navigate(next: Filters, start = startTransition) {
    const params = new URLSearchParams();
    if (next.title.trim()) params.set("titulo", next.title);
    if (next.year !== null) params.set("ano", String(next.year));
    else if (next.decade !== null) params.set("decada", String(next.decade));
    if (next.limit) params.set("limite", String(next.limit));
    const search = params.toString();
    start(() => router.replace(search ? `/?${search}` : "/", { scroll: false }));
  }

  const loadMore = useEffectEvent(() => navigate({ title: query, year, decade, limit: nextLimit }, startLoadingMore));

  // Recria o observador a cada página: se o sentinela continuar visível, a próxima já é pedida.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isPending || isLoadingMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    }, { rootMargin: "0px 0px 900px 0px" });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isPending, isLoadingMore, nextLimit]);

  function changeTitle(value: string) {
    setQuery(value);
    navigate({ title: value, year, decade });
  }

  function clearFilters() {
    setQuery("");
    navigate({ title: "", year: null, decade: null });
  }

  return (
    <>
      <Header search={<SearchBar value={query} onChange={changeTitle} />} isLoading={isPending || isLoadingMore} />
      <main className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(60rem_22rem_at_15%_-10%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%),radial-gradient(40rem_18rem_at_90%_0%,color-mix(in_oklab,var(--primary)_60%,transparent),transparent_70%)]"
        />
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-10">
          <section className="animate-fade-up pb-8 pt-10 sm:pt-14">
            <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
              Catálogo de <em className="text-accent">Filmes</em>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
              Busque pelo início do título e filtre pela década ou pelo ano de lançamento.
            </p>
          </section>

          <section aria-label="Filtro por década e ano" className="animate-fade-up rounded-2xl border border-white/[0.06] bg-surface/60 p-4 backdrop-blur-sm [animation-delay:80ms] sm:p-6">
            <YearButtons
              years={years}
              selectedYear={year}
              selectedDecade={decade}
              onSelectYear={(next) => navigate({ title: query, year: next, decade: null })}
              onSelectDecade={(next) => navigate({ title: query, year: null, decade: next })}
            />
          </section>

          {storyDecade !== null && (
            <div className="mt-6">
              <DecadeStory key={storyDecade} decade={storyDecade} />
            </div>
          )}

          <section aria-labelledby="catalog-results" aria-busy={isPending} className="mt-10 min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 id="catalog-results" className="font-display text-3xl sm:text-4xl">Filmes</h2>
                <p role="status" className="text-sm tabular-nums text-muted">
                  {movies.length === 0 ? "" : `Mostrando ${movies.length} ${movies.length === 1 ? "filme" : "filmes"}`}
                </p>
              </div>
              {hasFilters && (
                <div className="flex animate-fade-in flex-wrap items-center gap-2">
                  {query.trim() && (
                    <button type="button" onClick={() => changeTitle("")} className={filterChip} aria-label={`Remover busca por “${query.trim()}”`}>
                      <span className="max-w-48 truncate">“{query.trim()}”</span>
                      <X aria-hidden="true" className="h-3.5 w-3.5 text-muted" />
                    </button>
                  )}
                  {year !== null && (
                    <button type="button" onClick={() => navigate({ title: query, year: null, decade: null })} className={filterChip} aria-label={`Remover filtro do ano ${year}`}>
                      {year}
                      <X aria-hidden="true" className="h-3.5 w-3.5 text-muted" />
                    </button>
                  )}
                  {decade !== null && (
                    <button type="button" onClick={() => navigate({ title: query, year: null, decade: null })} className={filterChip} aria-label={`Remover filtro da década de ${decade}`}>
                      {decadeLabel(decade)}
                      <X aria-hidden="true" className="h-3.5 w-3.5 text-muted" />
                    </button>
                  )}
                  <button type="button" onClick={clearFilters} className="h-8 rounded-full px-3 text-sm font-medium text-muted transition-colors hover:text-accent">
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>

            <div className={`transition-opacity duration-300 ${isPending ? "opacity-50" : ""}`}>
              <MovieGrid
                movies={movies}
                emptyAction={
                  hasFilters && (
                    <button type="button" onClick={clearFilters} className="mt-2 h-10 rounded-full bg-accent px-5 text-sm font-semibold text-white transition-[background-color,translate] duration-300 hover:-translate-y-0.5 hover:bg-accent/90">
                      Limpar filtros
                    </button>
                  )
                }
              />
            </div>

            {hasMore ? (
              <div ref={sentinelRef} role="status" className="mt-14 flex h-12 items-center justify-center gap-2.5 text-sm text-muted">
                {isLoadingMore && (
                  <>
                    <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin text-accent" />
                    Carregando mais filmes…
                  </>
                )}
              </div>
            ) : (
              movies.length > 0 && (
                <p className="mt-16 flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted/70">
                  <span aria-hidden="true" className="h-px w-12 bg-gradient-to-r from-transparent to-border-strong" />
                  Fim da lista
                  <span aria-hidden="true" className="h-px w-12 bg-gradient-to-l from-transparent to-border-strong" />
                </p>
              )
            )}
          </section>
        </div>
      </main>
    </>
  );
}
