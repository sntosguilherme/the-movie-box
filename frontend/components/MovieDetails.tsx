"use client";

import { Flame, Maximize2, Star, X } from "lucide-react";
import { useRef, useState } from "react";
import CastList from "./CastList";
import OriginalTitle, { isVerticalTitle } from "./OriginalTitle";
import PosterImage, { CARD_POSTER_SIZES } from "./PosterImage";
import type { Movie } from "./types";

export type MovieDetailsProps = {
  movie: Movie;
};

const DETAILS_POSTER_SIZES = "(min-width: 768px) 320px, 70vw";

function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}min`;
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // O pôster ampliado só é montado com o diálogo aberto: fechado, ele não baixa nada.
  const [isPosterOpen, setPosterOpen] = useState(false);
  const hasRating = (movie.voteCount ?? 0) > 0 && movie.voteAverage !== undefined;
  const overview = movie.overview?.trim();
  const crew = [
    { role: "Direção", names: movie.directors },
    { role: "Roteiro", names: movie.writers },
    { role: "Música", names: movie.composers },
  ].filter((credit) => credit.names && credit.names.length > 0);
  const originalTitle = movie.originalTitle?.trim();
  const showOriginal = originalTitle && originalTitle !== movie.title.trim() ? originalTitle : undefined;
  const verticalOriginal = showOriginal !== undefined && isVerticalTitle(showOriginal, movie.originalLanguage ?? "");
  const tagline = movie.tagline?.trim().replace(/^["“'”]+|["”'“]+$/g, "");

  return (
    <>
      <article className="grid items-start gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <button
          type="button"
          onClick={() => {
            setPosterOpen(true);
            dialogRef.current?.showModal();
          }}
          className="group relative mx-auto w-full max-w-[20rem] rounded-2xl md:mx-0"
          aria-label={`Ampliar pôster de ${movie.title}`}
        >
          <PosterImage
            title={movie.title}
            posterUrl={movie.posterUrl}
            sizes={DETAILS_POSTER_SIZES}
            placeholderSizes={CARD_POSTER_SIZES}
            eager
            transitionName={`poster-${movie.id}`}
            className="rounded-2xl shadow-2xl shadow-black/70 ring-1 ring-white/10"
          />
          <span className="absolute inset-x-3 bottom-3 inline-flex translate-y-2 items-center justify-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm font-semibold opacity-0 ring-1 ring-white/15 backdrop-blur-md transition-[opacity,translate] duration-300 ease-smooth group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <Maximize2 aria-hidden="true" className="h-4 w-4" />
            Ampliar pôster
          </span>
        </button>

        <div className={`relative min-w-0 space-y-8 ${verticalOriginal ? "lg:pr-36" : ""}`}>
          <div className="space-y-4">
            <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.2em] text-accent [animation-delay:60ms]">
              {movie.year}
              {movie.runtime ? <span className="text-muted"> · {formatRuntime(movie.runtime)}</span> : null}
            </p>
            <h1 className="animate-fade-up break-words font-display text-5xl leading-[0.95] tracking-tight [animation-delay:60ms] sm:text-6xl lg:text-7xl">
              {movie.title}
            </h1>
            {showOriginal && (
              <OriginalTitle
                title={showOriginal}
                language={movie.originalLanguage ?? ""}
                verticalClassName="absolute right-0 top-0 !mt-0"
              />
            )}
            {tagline && (
              <p lang="en" className="max-w-2xl animate-fade-up font-display text-2xl italic leading-snug text-foreground/75 [animation-delay:150ms] sm:text-[1.7rem]">
                “{tagline}”
              </p>
            )}
          </div>

          {(hasRating || movie.popularity !== undefined) && (
            <dl className="flex animate-fade-up flex-wrap gap-3 [animation-delay:120ms]">
              {hasRating && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
                  <Star aria-hidden="true" className="h-6 w-6 fill-gold text-gold" />
                  <div>
                    <dt className="text-xs text-muted">Nota · {movie.voteCount!.toLocaleString("pt-BR")} votos</dt>
                    <dd className="mt-1 text-xl font-bold tabular-nums leading-none">
                      {movie.voteAverage!.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      <span className="text-sm font-medium text-muted">/10</span>
                    </dd>
                  </div>
                </div>
              )}
              {movie.popularity !== undefined && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
                  <Flame aria-hidden="true" className="h-6 w-6 text-accent" />
                  <div>
                    <dt className="text-xs text-muted">Popularidade</dt>
                    <dd className="mt-1 text-xl font-bold tabular-nums leading-none">
                      {movie.popularity.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          )}

          {movie.genres && movie.genres.length > 0 && (
            <ul aria-label="Gêneros" className="flex animate-fade-up flex-wrap gap-2 [animation-delay:180ms]">
              {movie.genres.map((genre) => (
                <li key={genre} className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-foreground/90">
                  {genre}
                </li>
              ))}
            </ul>
          )}

          <section aria-labelledby="synopsis-title" className="animate-fade-up space-y-3 [animation-delay:240ms]">
            <h2 id="synopsis-title" className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Sinopse</h2>
            <p lang={overview ? "en" : undefined} className="max-w-prose hyphens-auto whitespace-pre-line text-justify text-lg leading-relaxed text-foreground/85">
              {overview || "Sinopse indisponível."}
            </p>
          </section>

          {crew.length > 0 && (
            <section aria-labelledby="crew-title" className="animate-fade-up space-y-3 [animation-delay:300ms]">
              <h2 id="crew-title" className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Ficha técnica</h2>
              <dl className="grid max-w-prose gap-x-8 gap-y-4 border-t border-white/[0.06] pt-4 sm:grid-cols-3">
                {crew.map((credit) => (
                  <div key={credit.role}>
                    <dt className="text-sm text-muted">{credit.role}</dt>
                    <dd className="mt-1 font-medium leading-snug text-foreground/90">{credit.names!.join(", ")}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </article>

      {movie.cast && movie.cast.length > 0 && (
        <section aria-labelledby="cast-title" className="mt-16 space-y-6 border-t border-white/[0.06] pt-10">
          <h2 id="cast-title" className="font-display text-3xl sm:text-4xl">Elenco principal</h2>
          <CastList cast={movie.cast} />
        </section>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`Pôster ampliado de ${movie.title}`}
        onClose={() => setPosterOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 text-foreground backdrop:bg-black/80 backdrop:backdrop-blur-md open:animate-pop-in open:backdrop:animate-fade-in"
      >
        <div className="relative w-[min(92vw,calc(88dvh*2/3),40rem)]">
          {isPosterOpen && (
            <PosterImage
              title={movie.title}
              posterUrl={movie.posterUrl}
              sizes="(min-width: 768px) 640px, 92vw"
              placeholderSizes={DETAILS_POSTER_SIZES}
              className="rounded-2xl shadow-2xl shadow-black ring-1 ring-white/10"
            />
          )}
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Fechar"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-foreground ring-1 ring-white/15 backdrop-blur-md transition-[background-color,scale] duration-300 hover:scale-105 hover:bg-black/80"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </dialog>
    </>
  );
}
