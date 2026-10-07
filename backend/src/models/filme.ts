export type Ator = {
  /** ID de pessoa no TMDB. */
  id: number;
  name: string;
  character: string;
  /** Foto atual no TMDB (ver pre-processing/add_cast_photos.py). */
  profile_url: string | null;
};

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
  /** Até seis atores, na ordem dos créditos. */
  cast: Ator[];
  /** Até três nomes por função. */
  directors: string[];
  writers: string[];
  composers: string[];
  tagline: string | null;
  /** Duração em minutos. */
  runtime: number | null;
  /** Título no idioma original, como está no dataset (pode estar em outro alfabeto). */
  original_title: string;
  /** Código ISO 639-1 do TMDB; "cn" é cantonês. */
  original_language: string;
};
