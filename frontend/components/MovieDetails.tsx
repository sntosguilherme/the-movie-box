import PosterImage from "./PosterImage";
import type { Movie } from "./types";

export type MovieDetailsProps = {
  movie: Movie;
};

export default function MovieDetails({ movie }: MovieDetailsProps) {
  return (
    <article className="grid gap-8 sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
      <PosterImage title={movie.title} posterUrl={movie.posterUrl} className="w-full max-w-sm rounded-lg border border-border" />
      <div className="min-w-0 space-y-5">
        <div>
          <h1 className="break-words text-3xl font-bold">{movie.title}</h1>
          <p className="mt-2 text-muted">{movie.year}</p>
        </div>
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
  );
}
