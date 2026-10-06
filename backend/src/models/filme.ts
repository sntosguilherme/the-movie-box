/** Formato de um registro de data/movies.json. */
export type Filme = {
  id: number;
  title: string;
  overview: string;
  genres: string[];
  release_date: string;
  poster_url: string | null;
  /** Relevância do TMDB; sem limite superior, maior é mais relevante. */
  popularity: number;
  /** Nota média de 0 a 10; vale 0 quando `vote_count` é 0. */
  vote_average: number;
  vote_count: number;
};
