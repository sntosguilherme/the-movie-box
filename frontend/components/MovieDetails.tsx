"use client";

import { X } from "lucide-react";
import PosterImage from "./PosterImage";
import type { Movie } from "./types";
import { useEffect, useState } from "react";

export type MovieDetailsProps = {
  movie: Movie;
};

export default function MovieDetails({ movie }: MovieDetailsProps) {
  const [isPosterOpen, setPosterOpen] = useState(false);

  useEffect(() => {
    if (!isPosterOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPosterOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isPosterOpen]);

  return (
    <>
      <article className="grid gap-8 sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        <button
          type="button"
          onClick={() => setPosterOpen(true)}
          className="group relative h-fit w-full max-w-sm overflow-hidden rounded-lg border border-border bg-transparent p-0"
          aria-label={`Ampliar pôster de ${movie.title}`}
        >
          <PosterImage title={movie.title} posterUrl={movie.posterUrl} className="w-full" />
          <span className="absolute inset-x-0 bottom-0 bg-background/85 px-3 py-2 text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            Ampliar pôster
          </span>
        </button>
        <div className="min-w-0 space-y-5">
        <div>
          <h1 className="break-words text-3xl font-bold">{movie.title}</h1>
          <p className="mt-2 text-muted">{movie.year}</p>
        </div>
        <dl className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
          {typeof movie.voteAverage === "number" && (
            <div>
              <dt className="text-muted">Nota</dt>
              <dd className="font-semibold">
                {movie.voteCount === 0
                  ? "Sem avaliações"
                  : `${movie.voteAverage.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}/10`}
              </dd>
              {typeof movie.voteCount === "number" && movie.voteCount > 0 && (
                <dd className="text-muted">{movie.voteCount.toLocaleString("pt-BR")} votos</dd>
              )}
            </div>
          )}
          {typeof movie.popularity === "number" && (
            <div>
              <dt className="text-muted">Popularidade (TMDB)</dt>
              <dd className="font-semibold">
                {movie.popularity.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
              </dd>
            </div>
          )}
        </dl>
        {movie.genres && movie.genres.length > 0 && (
          <div aria-label="Gêneros" className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span key={genre} className="rounded-full border border-border bg-surface px-3 py-1 text-sm">
                {genre}
              </span>
            ))}
          </div>
        )}
        <section aria-labelledby="synopsis-title" className="space-y-2">
          <h2 id="synopsis-title" className="text-xl font-semibold">Sinopse</h2>
          <p className="whitespace-pre-line text-muted">{movie.overview?.trim() || "Sinopse indisponível."}</p>
        </section>
        </div>
      </article>
      {isPosterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Pôster ampliado de ${movie.title}`}
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPosterOpen(false);
          }}
        >
          <div className="relative max-h-full w-full max-w-2xl">
            <button
              type="button"
              onClick={() => setPosterOpen(false)}
              className="absolute right-2 top-2 z-10 inline-flex items-center gap-2"
            >
              <X aria-hidden="true" className="h-5 w-5" /> Fechar
            </button>
            <PosterImage title={movie.title} posterUrl={movie.posterUrl} className="max-h-[90vh] rounded-lg border border-border" />
          </div>
        </div>
      )}
    </>
  );
}
