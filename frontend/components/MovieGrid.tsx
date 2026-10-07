import { Clapperboard } from "lucide-react";
import type { ReactNode } from "react";
import MovieCard from "./MovieCard";
import type { Movie } from "./types";

export type MovieGridProps = {
  movies: readonly Movie[];
  /** Conteúdo extra do estado vazio, como um botão para limpar os filtros. */
  emptyAction?: ReactNode;
};

const EAGER_POSTERS = 6;
const BATCH = 24;

export default function MovieGrid({ movies, emptyAction }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div role="status" className="flex animate-fade-up flex-col items-center gap-4 rounded-2xl border border-dashed border-border-strong px-6 py-20 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-raised ring-1 ring-border-strong">
          <Clapperboard aria-hidden="true" className="h-6 w-6 text-accent" strokeWidth={1.75} />
        </span>
        <div className="space-y-1">
          <p className="font-display text-3xl">Nenhum filme encontrado</p>
          <p className="text-sm text-muted">Tente outro título ou escolha outro ano.</p>
        </div>
        {emptyAction}
      </div>
    );
  }

  return (
    <ul
      aria-label="Filmes do catálogo"
      className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] gap-x-4 gap-y-8 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:gap-x-6 sm:gap-y-10"
    >
      {movies.map((movie, index) => (
        <li
          key={movie.id}
          // O atraso recomeça a cada lote carregado, para que "Carregar mais" também entre em sequência.
          style={{ animationDelay: `${Math.min(index % BATCH, 12) * 35}ms` }}
          className="min-w-0 animate-fade-up"
        >
          <MovieCard movie={movie} eager={index < EAGER_POSTERS} />
        </li>
      ))}
    </ul>
  );
}
