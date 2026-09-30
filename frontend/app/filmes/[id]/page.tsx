import Link from "next/link";
import Header from "@/components/Header";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/"
          className="inline-flex rounded-lg border border-border bg-primary px-4 py-2.5 font-semibold text-foreground hover:bg-primary-hover"
        >
          Voltar ao catálogo
        </Link>
        <h1 className="mt-6 text-3xl font-bold">Filme {id}</h1>
        <p className="mt-4 text-muted">Os detalhes do filme serão exibidos aqui.</p>
      </main>
    </>
  );
}
