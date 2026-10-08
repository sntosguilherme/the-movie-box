import { connection } from "next/server";
import { Clock3 } from "lucide-react";
import Header from "@/components/Header";
import MovieGrid from "@/components/MovieGrid";
import { getRecentlyOpenedMovies } from "@/lib/catalog";

export default async function RecentMoviesPage() {
  // A lista MTF muda a cada detalhe aberto, então precisa ser lida na requisição atual.
  await connection();
  const movies = await getRecentlyOpenedMovies();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-10 sm:px-6 sm:pt-14 lg:px-10">
        <section className="mb-10 animate-fade-up">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <Clock3 aria-hidden="true" className="size-3.5" />
            Lista Move-to-Front
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">Filmes recentes</h1>
          <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">Os filmes que você abriu aparecem aqui, com o último acesso primeiro.</p>
        </section>
        {movies.length > 0 ? (
          <MovieGrid movies={movies} />
        ) : (
          <section role="status" className="flex animate-fade-up flex-col items-center gap-4 rounded-2xl border border-dashed border-border-strong px-6 py-20 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-surface-raised ring-1 ring-border-strong">
              <Clock3 aria-hidden="true" className="size-6 text-accent" strokeWidth={1.75} />
            </span>
            <div className="space-y-1">
              <h2 className="font-display text-3xl">Nenhum filme recente</h2>
              <p className="text-sm text-muted">Abra os detalhes de um filme para ele aparecer nesta lista.</p>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
