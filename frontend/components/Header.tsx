"use client";

import Link from "next/link";
import { Film, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

export type HeaderProps = {
  search?: ReactNode;
};

export default function Header({ search }: HeaderProps) {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const searchId = useId();
  const searchRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.querySelector("input")?.focus();
  }, [isSearchOpen]);

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-3 rounded font-bold text-foreground">
          <Film aria-hidden="true" className="h-6 w-6 shrink-0 text-accent" />
          <span>Catálogo de Filmes <span className="text-muted">· ED II</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <nav aria-label="Navegação principal">
            <Link href="/" className="rounded text-muted hover:text-foreground">
              Página inicial
            </Link>
          </nav>
          {search && (
            <button
              ref={toggleRef}
              type="button"
              aria-label={isSearchOpen ? "Fechar busca por título" : "Abrir busca por título"}
              aria-expanded={isSearchOpen}
              aria-controls={searchId}
              onClick={() => setSearchOpen((open) => !open)}
              className="inline-flex items-center justify-center p-2.5"
            >
              {isSearchOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Search aria-hidden="true" className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>
      {search && (
        <div
          id={searchId}
          ref={searchRef}
          hidden={!isSearchOpen}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setSearchOpen(false);
              toggleRef.current?.focus();
            }
          }}
          className="mx-auto max-w-5xl px-6 pb-5"
        >
          {search}
        </div>
      )}
    </header>
  );
}
