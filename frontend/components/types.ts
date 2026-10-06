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
};
