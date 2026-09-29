"use client";

import { useState } from "react";
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";
import YearButtons from "@/components/YearButtons";
import type { Movie } from "@/components/types";

const movies: readonly Movie[] = [
  { id: "demo-1", title: "Além do Horizonte", year: 2024, posterUrl: "/exemplo-poster.svg" },
  { id: "demo-2", title: "A Última Sessão", year: 2024 },
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
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Catálogo de exemplo</h1>
        <p className="text-muted">
          Experimente buscar pelo início do título e selecionar um ano. Os filmes desta página são fictícios.
        </p>
      </div>

      <section aria-label="Filtros" className="space-y-6 rounded-lg border border-border bg-surface p-5">
        <SearchBar value={title} onChange={setTitle} />
        <YearButtons years={years} selectedYear={selectedYear} onSelectYear={setSelectedYear} />
        <button type="button" onClick={clearFilters} disabled={!title && selectedYear === null}>
          Limpar filtros
        </button>
      </section>

      <section aria-labelledby="example-results" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="example-results" className="text-xl font-bold">Filmes</h2>
          <p role="status" className="text-sm text-muted">
            {filteredMovies.length} {filteredMovies.length === 1 ? "filme encontrado" : "filmes encontrados"}
          </p>
        </div>
        <MovieGrid movies={filteredMovies} />
      </section>
    </main>
  );
}
