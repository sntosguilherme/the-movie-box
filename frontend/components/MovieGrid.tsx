import MovieCard from "./MovieCard";
import type { Movie, MovieAccessHandler } from "./types";

export type MovieGridProps = {
  movies: readonly Movie[];
  onMovieAccess?: MovieAccessHandler;
};

export default function MovieGrid({ movies, onMovieAccess }: MovieGridProps) {
  if (movies.length === 0) {
    return <p role="status" className="text-muted">Nenhum filme encontrado.</p>;
  }

  return (
    <ul
      aria-label="Filmes do catálogo"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {movies.map((movie) => (
        <li key={movie.id} className="min-w-0">
          <MovieCard movie={movie} onMovieAccess={onMovieAccess} />
        </li>
      ))}
    </ul>
  );
}
