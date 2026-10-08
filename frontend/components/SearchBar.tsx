"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState, type FocusEvent } from "react";
import { rememberCatalogOrigin } from "./catalogOrigin";
import type { Movie } from "./types";

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  recentMovies?: readonly Movie[];
};

export default function SearchBar({ value, onChange, recentMovies = [] }: SearchBarProps) {
  const inputId = useId();
  const recentId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showRecent, setShowRecent] = useState(false);

  function clearSearch() {
    onChange("");
    inputRef.current?.focus();
  }

  function hideRecentWhenLeaving(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setShowRecent(false);
  }

  return (
    <div role="search" className="group/search relative" onBlur={hideRecentWhenLeaving}>
      <label htmlFor={inputId} className="sr-only">
        Buscar por título
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition-colors group-focus-within/search:text-accent"
      />
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        name="title"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setShowRecent(true)}
        placeholder="Buscar pelo início do título…"
        autoComplete="off"
        className="h-10 w-full rounded-full border border-white/[0.08] bg-white/[0.04] pl-10 pr-10 text-sm text-foreground placeholder:text-muted/80 transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/15 focus:border-accent/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px] focus:shadow-accent/15 focus:outline-none"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Limpar pesquisa"
          className="absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 animate-pop-in place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-foreground"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
      {showRecent && recentMovies.length > 0 && (
        <section id={recentId} aria-label="Filmes acessados recentemente" className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-white/10 bg-surface-raised shadow-xl shadow-black/40">
          <p className="border-b border-white/[0.06] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">Recentes</p>
          <ul>
            {recentMovies.slice(0, 5).map((movie) => {
              const href = `/filmes/${encodeURIComponent(String(movie.id))}`;
              return (
                <li key={movie.id}>
                  <Link href={href} prefetch={false} onClick={() => rememberCatalogOrigin(href)} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm transition-colors hover:bg-white/[0.06]">
                    <span className="min-w-0 truncate font-medium text-foreground">{movie.title}</span>
                    <span className="shrink-0 tabular-nums text-muted">{movie.year}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
