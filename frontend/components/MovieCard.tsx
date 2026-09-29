"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Movie } from "./types";

export type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const [failedPoster, setFailedPoster] = useState<string | null>(null);
  const posterUrl = movie.posterUrl?.trim();
  const showPoster = posterUrl && posterUrl !== failedPoster;

  return (
    <article className="h-full">
      <Link
        href={`/filmes/${encodeURIComponent(String(movie.id))}`}
        className="group block h-full overflow-hidden rounded-lg border border-border bg-surface hover:border-accent"
      >
        <div className="flex aspect-[2/3] items-center justify-center bg-background">
          {showPoster ? (
            <Image
              src={posterUrl}
              alt={`Pôster de ${movie.title}`}
              width={300}
              height={450}
              unoptimized
              onError={() => setFailedPoster(posterUrl)}
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src="/poster-placeholder.svg"
              alt={`Pôster indisponível para ${movie.title}`}
              width={300}
              height={450}
              unoptimized
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="break-words font-semibold text-foreground group-hover:underline">
            {movie.title}
          </h3>
          <p className="text-sm text-muted">{movie.year}</p>
          <span className="text-sm text-muted">Ver detalhes</span>
        </div>
      </Link>
    </article>
  );
}
