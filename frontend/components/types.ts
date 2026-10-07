export type CastMember = {
  name: string;
  character: string;
  photoUrl?: string | null;
};

export type Movie = {
  id: string | number;
  title: string;
  year: number;
  posterUrl?: string | null;
  genres?: readonly string[];
  overview?: string | null;
  popularity?: number;
  voteAverage?: number;
  voteCount?: number;
  cast?: readonly CastMember[];
  directors?: readonly string[];
  writers?: readonly string[];
  composers?: readonly string[];
  tagline?: string | null;
  /** Duração em minutos. */
  runtime?: number | null;
  originalTitle?: string;
  originalLanguage?: string;
};
