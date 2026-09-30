"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import MovieDetails from "@/components/MovieDetails";
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";
import YearButtons from "@/components/YearButtons";
import type { Movie } from "@/components/types";

const movies: readonly Movie[] = [
  { id: "demo-1", title: "Além do Horizonte", year: 2024, posterUrl: "/exemplo-poster.svg", genres: ["Aventura", "Drama"], overview: "Uma jornada inesperada leva antigos amigos a descobrir novos caminhos." },
  { id: "demo-2", title: "A Última Sessão", year: 2024, genres: ["Drama"], overview: "Um cinema de bairro reúne seus visitantes para uma noite inesquecível." },
  { id: "demo-3", title: "Noite de Estreia", year: 2021, posterUrl: "/exemplo-poster.svg" },
  { id: "demo-4", title: "Memórias de Verão", year: 2021 },
  { id: "demo-5", title: "O Caminho de Casa", year: 2019, posterUrl: "/exemplo-poster.svg" },
  { id: "demo-6", title: "Cinema de Bairro", year: 2019 },
];

const years = [2024, 2021, 2019] as const;

function normalizeTitle(value: string) {
  return value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export default function ExamplePage() {
  const [title, setTitle] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<string | number>(movies[0].id);
  const selectedMovie = movies.find((movie) => movie.id === selectedMovieId) ?? movies[0];
  const normalizedTitle = normalizeTitle(title);
  const filteredMovies = movies.filter(
    (movie) =>
      (selectedYear === null || movie.year === selectedYear) &&
      normalizeTitle(movie.title).startsWith(normalizedTitle),
  );

  function clearFilters() {
    setTitle("");
    setSelectedYear(null);
  }

  return (
    <>
      <Header search={<SearchBar value={title} onChange={setTitle} />} />
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Catálogo de exemplo</h1>
          <p className="text-muted">
            Experimente buscar pelo início do título e selecionar um ano. Os filmes desta página são fictícios.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[12rem_minmax(0,1fr)]">
          <aside aria-label="Filtro por ano" className="space-y-5 self-start rounded-lg border border-border bg-surface p-5">
            <YearButtons years={years} selectedYear={selectedYear} onSelectYear={setSelectedYear} layout="column" />
            <button type="button" onClick={clearFilters} disabled={!title && selectedYear === null} className="w-full">
              Limpar filtros
            </button>
          </aside>

          <section aria-labelledby="example-results" className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="example-results" className="text-xl font-bold">Filmes</h2>
              <p role="status" className="text-sm text-muted">
                {filteredMovies.length} {filteredMovies.length === 1 ? "filme encontrado" : "filmes encontrados"}
              </p>
            </div>
            <MovieGrid movies={filteredMovies} />
          </section>
        </div>

        <section aria-labelledby="example-details" className="space-y-6 border-t border-border pt-8">
          <div className="space-y-2">
            <h2 id="example-details" className="text-2xl font-bold">Prévia dos detalhes</h2>
            <p className="text-muted">Selecione um filme para testar os componentes de detalhes.</p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Selecionar filme para prévia">
            {movies.slice(0, 2).map((movie) => (
              <button
                key={movie.id}
                type="button"
                aria-pressed={selectedMovieId === movie.id}
                onClick={() => setSelectedMovieId(movie.id)}
                className={selectedMovieId === movie.id ? "border-accent" : ""}
              >
                {movie.title}
              </button>
            ))}
          </div>
          <BackButton />
          <MovieDetails movie={selectedMovie} />
        </section>
      </main>
    </>
  );
}
