import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import MovieDetails from "@/components/MovieDetails";
import { getCatalog, toMovie } from "@/lib/catalog";

type MoviePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MoviePage({ params, searchParams }: MoviePageProps) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const { voltar } = await searchParams;
  const returnHref = typeof voltar === "string" && (voltar === "/" || voltar.startsWith("/?"))
    ? voltar
    : "/";

  const catalog = await getCatalog();
  const filme = catalog.openDetails(Number(id));
  if (!filme) notFound();

  return (
    <>
      <Header />
      <main className="w-full space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <BackButton href={returnHref} />
        <MovieDetails movie={toMovie(filme)} />
      </main>
    </>
  );
}
