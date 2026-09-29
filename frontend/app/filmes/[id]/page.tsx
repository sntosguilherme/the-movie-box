import Link from "next/link";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/" className="underline">Voltar ao catálogo</Link>
      <h1 className="mt-6 text-3xl font-bold">Filme {id}</h1>
      <p className="mt-4">Os detalhes do filme serão exibidos aqui.</p>
    </main>
  );
}
