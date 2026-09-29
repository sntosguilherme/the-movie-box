export type Movie = {
  id: string | number;
  title: string;
  year: number;
  posterUrl?: string | null;
};

export type MovieAccessHandler = (movie: Movie) => void;
