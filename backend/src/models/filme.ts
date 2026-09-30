/** Formato de um registro de data/movies.json. */
export type Filme = {
  id: number;
  title: string;
  overview: string;
  genres: string[];
  release_date: string;
  poster_url: string | null;
};
