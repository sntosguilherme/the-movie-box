import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import MovieDetails from "@/components/MovieDetails";
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
        <div className="mx-auto w-full max-w-[1400px] space-y-10 px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pt-12">
          <BackButton />
          <MovieDetails movie={movie} />
        </div>
      </main>
    </>
  );
}
