import MovieCard from "./MovieCard";
import type { Movie } from "./types";

export type MovieGridProps = {
  movies: readonly Movie[];
};

export default function MovieGrid({ movies }: MovieGridProps) {
  if (movies.length === 0) {
    return <p role="status" className="text-muted">Nenhum filme encontrado.</p>;
  }

  return (
    <ul
      aria-label="Filmes do catálogo"
      className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))] gap-6"
    >
      {movies.map((movie) => (
        <li key={movie.id} className="min-w-0">
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  );
}
