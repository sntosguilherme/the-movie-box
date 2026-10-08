"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { rememberCatalogOrigin } from "./catalogOrigin";
import PosterImage, { CARD_POSTER_SIZES } from "./PosterImage";
import type { Movie } from "./types";

export type MovieCardProps = {
  movie: Movie;
  eager?: boolean;
};

export default function MovieCard({ movie, eager = false }: MovieCardProps) {
  const hasRating = (movie.voteCount ?? 0) > 0 && movie.voteAverage !== undefined;
  const genre = movie.genres?.[0];
  const href = `/filmes/${encodeURIComponent(String(movie.id))}`;

  return (
    <article className="h-full">
      <Link
        href={href}
        // A rota de detalhes reorganiza as estruturas; só deve ser carregada após o clique.
        prefetch={false}
        onClick={(event) => {
          // Cliques que abrem outra aba não têm o catálogo no histórico.
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          rememberCatalogOrigin(href);
        }}
        className="group block h-full rounded-xl focus-visible:outline-offset-4"
      >
        <div className="relative transition-[translate] duration-500 ease-smooth group-hover:-translate-y-1.5">
          <PosterImage
            title={movie.title}
            posterUrl={movie.posterUrl}
            sizes={CARD_POSTER_SIZES}
            eager={eager}
            transitionName={`poster-${movie.id}`}
            className="rounded-xl shadow-lg shadow-black/40 ring-1 ring-white/[0.06] transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-accent/15 group-hover:ring-white/15"
          />
          {hasRating && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold tabular-nums text-foreground ring-1 ring-white/10 backdrop-blur-md">
              <Star aria-hidden="true" className="h-3 w-3 fill-gold text-gold" />
              <span className="sr-only">Nota </span>
              {movie.voteAverage!.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1 px-0.5">
          <h3 className="line-clamp-2 text-[0.95rem] font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-accent">
            {movie.title}
          </h3>
          <p className="truncate text-sm text-muted">
            {movie.year}
            {genre && <span className="text-muted/70"> · {genre}</span>}
          </p>
        </div>
      </Link>
    </article>
  );
}
