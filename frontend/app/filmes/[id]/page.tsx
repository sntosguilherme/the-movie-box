import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import MovieDetails from "@/components/MovieDetails";
import PosterImage, { CARD_POSTER_SIZES } from "@/components/PosterImage";
import { getCatalog, toMovie } from "@/lib/catalog";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const catalog = await getCatalog();
  const filme = catalog.openDetails(Number(id));
  if (!filme) notFound();
  const movie = toMovie(filme);

  return (
    <>
      <Header />
      <main className="relative isolate overflow-hidden">
        {movie.posterUrl && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] animate-fade-in overflow-hidden [animation-duration:1200ms]">
            <PosterImage
              title={movie.title}
              posterUrl={movie.posterUrl}
              sizes={CARD_POSTER_SIZES}
              eager
              className="!absolute inset-0 !aspect-auto scale-125 opacity-40 blur-3xl saturate-150"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          </div>
        )}
        <div className="mx-auto w-full max-w-[1400px] space-y-10 px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pt-12">
          <BackButton />
          <MovieDetails movie={movie} />
        </div>
      </main>
    </>
  );
}
