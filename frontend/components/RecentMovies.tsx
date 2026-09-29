import MovieCard from "./MovieCard";
import type { Movie, MovieAccessHandler } from "./types";

export type RecentMoviesProps = {
  movies: readonly Movie[];
  onMovieAccess?: MovieAccessHandler;
};

export default function RecentMovies({ movies, onMovieAccess }: RecentMoviesProps) {
  return (
    <section aria-label="Filmes acessados recentemente" className="space-y-4">
      <h2 className="text-xl font-bold">Acessados recentemente</h2>
      {movies.length === 0 ? (
        <p className="text-muted">Você ainda não acessou nenhum filme.</p>
      ) : (
        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <li key={movie.id} className="min-w-0">
              <MovieCard movie={movie} onMovieAccess={onMovieAccess} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
