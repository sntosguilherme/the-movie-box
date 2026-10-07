"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import MovieDetails from "@/components/MovieDetails";
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";
import YearButtons, { decadeOf } from "@/components/YearButtons";
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
  const [selectedDecade, setSelectedDecade] = useState<number | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<string | number>(movies[0].id);
  const selectedMovie = movies.find((movie) => movie.id === selectedMovieId) ?? movies[0];
  const normalizedTitle = normalizeTitle(title);
  const filteredMovies = movies.filter(
    (movie) =>
      (selectedYear === null || movie.year === selectedYear) &&
      (selectedDecade === null || decadeOf(movie.year) === selectedDecade) &&
      normalizeTitle(movie.title).startsWith(normalizedTitle),
  );

  function selectYear(year: number | null) {
    setSelectedYear(year);
    setSelectedDecade(null);
  }

  function selectDecade(decade: number) {
    setSelectedYear(null);
    setSelectedDecade(decade);
  }

  function clearFilters() {
    setTitle("");
    selectYear(null);
  }

  return (
    <>
      <Header search={<SearchBar value={title} onChange={setTitle} />} />
      <main className="mx-auto w-full max-w-[1400px] space-y-12 px-4 pb-24 pt-14 sm:px-6 lg:px-10">
        <div className="space-y-4">
          <h1 className="font-display text-5xl tracking-tight sm:text-6xl">Catálogo de exemplo</h1>
          <p className="max-w-xl text-muted">
            Experimente buscar pelo início do título e selecionar um ano. Os filmes desta página são fictícios.
          </p>
        </div>

        <section aria-label="Filtro por ano" className="space-y-4 rounded-2xl border border-white/[0.06] bg-surface/60 p-4 sm:p-6">
          <YearButtons
            years={years}
            selectedYear={selectedYear}
            selectedDecade={selectedDecade}
            onSelectYear={selectYear}
            onSelectDecade={selectDecade}
          />
          <button
            type="button"
            onClick={clearFilters}
            disabled={!title && selectedYear === null && selectedDecade === null}
            className="h-9 rounded-full px-3 text-sm font-medium text-muted transition-colors hover:text-accent disabled:opacity-40"
          >
            Limpar filtros
          </button>
        </section>

        <section aria-labelledby="example-results" className="min-w-0 space-y-6">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 id="example-results" className="font-display text-3xl sm:text-4xl">Filmes</h2>
            <p role="status" className="text-sm text-muted">
              {filteredMovies.length} {filteredMovies.length === 1 ? "filme encontrado" : "filmes encontrados"}
            </p>
          </div>
          <MovieGrid movies={filteredMovies} />
        </section>

        <section aria-labelledby="example-details" className="space-y-8 border-t border-white/[0.06] pt-12">
          <div className="space-y-2">
            <h2 id="example-details" className="font-display text-3xl sm:text-4xl">Prévia dos detalhes</h2>
            <p className="text-muted">Selecione um filme para testar os componentes de detalhes.</p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Selecionar filme para prévia">
            {movies.slice(0, 2).map((movie) => (
              <button
                key={movie.id}
                type="button"
                aria-pressed={selectedMovieId === movie.id}
                onClick={() => setSelectedMovieId(movie.id)}
                className={`h-9 rounded-full border px-4 text-sm font-medium transition-colors ${
                  selectedMovieId === movie.id
                    ? "border-accent/70 bg-accent/15 text-foreground"
                    : "border-white/[0.08] bg-white/[0.03] text-muted hover:text-foreground"
                }`}
              >
                {movie.title}
              </button>
            ))}
          </div>
          <BackButton />
          {/* Prefixo no id: o mesmo filme está na grade acima, e o nome da transição do pôster precisa ser único. */}
          <MovieDetails key={selectedMovie.id} movie={{ ...selectedMovie, id: `previa-${selectedMovie.id}` }} />
        </section>
      </main>
    </>
  );
}
