"use client";

import Link from "next/link";
import PosterImage from "./PosterImage";
import type { Movie } from "./types";

export type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="h-full">
      <Link
        href={`/filmes/${encodeURIComponent(String(movie.id))}`}
        prefetch={false}
        className="group block h-full overflow-hidden rounded-lg border border-border bg-surface hover:border-accent"
      >
        <PosterImage title={movie.title} posterUrl={movie.posterUrl} />
        <div className="space-y-2 p-4">
          <h3 className="break-words font-semibold text-foreground group-hover:underline">
            {movie.title}
          </h3>
          <p className="text-sm text-muted">{movie.year}</p>
          <div className="space-y-1 text-sm text-muted">
            {movie.voteCount === 0 ? (
              <p>Sem avaliações</p>
            ) : typeof movie.voteAverage === "number" ? (
              <p>Nota: {movie.voteAverage.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}/10</p>
            ) : null}
          </div>
          <span className="text-sm text-muted">Ver detalhes</span>
        </div>
      </Link>
    </article>
  );
}
