"use client";

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
    <div role="search" className="space-y-2">
      <label htmlFor={inputId} className="block font-semibold">
        Buscar por título
      </label>
      <div className="flex flex-wrap gap-3">
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          name="title"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Digite o título do filme"
          className="min-w-0 flex-1 basis-48"
        />
        <button type="button" onClick={clearSearch} disabled={value.length === 0}>
          Limpar pesquisa
        </button>
      </div>
    </div>
  );
}
