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

  return (
    <>
      <Header />
      <main className="w-full space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <BackButton />
        <MovieDetails movie={toMovie(filme)} />
      </main>
    </>
  );
}
