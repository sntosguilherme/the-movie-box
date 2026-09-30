import BackButton from "@/components/BackButton";
import Header from "@/components/Header";

export default function MovieNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl space-y-6 px-6 py-16">
        <h1 className="text-3xl font-bold">Filme não encontrado</h1>
        <p className="text-muted">O ID informado não corresponde a nenhum filme do catálogo.</p>
        <BackButton />
      </main>
    </>
  );
}
