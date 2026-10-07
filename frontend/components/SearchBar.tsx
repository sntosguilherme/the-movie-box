"use client";

import { Search, X } from "lucide-react";
import { useId, useRef } from "react";

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function clearSearch() {
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div role="search" className="group/search relative">
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
    </div>
  );
}
