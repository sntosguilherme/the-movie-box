import Header from "@/components/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-bold">Catálogo de Filmes</h1>
        <p className="mt-4 text-muted">Explore filmes por título e ano de lançamento.</p>
      </main>
    </>
  );
}
