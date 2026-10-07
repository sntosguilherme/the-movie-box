"use client";

import { useEffect, useRef } from "react";

export type YearButtonsProps = {
  years: readonly number[];
  selectedYear: number | null;
  selectedDecade: number | null;
  onSelectYear: (year: number | null) => void;
  onSelectDecade: (decade: number) => void;
};

const chip =
  "inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-sm font-medium tabular-nums transition-[background-color,border-color,color,box-shadow] duration-300 ease-smooth";
const idleChip = "border-white/[0.08] bg-white/[0.03] text-muted hover:border-white/20 hover:bg-white/[0.07] hover:text-foreground";
const activeChip = "border-accent/70 bg-accent/15 text-foreground shadow-[0_0_24px_-6px] shadow-accent/60";
const openChip = "border-white/25 bg-white/10 text-foreground";

export function decadeOf(year: number) {
  return Math.floor(year / 10) * 10;
}

export function decadeLabel(decade: number) {
  return `${decade}–${String(decade + 9).slice(-2)}`;
}

export default function YearButtons({ years, selectedYear, selectedDecade, onSelectYear, onSelectDecade }: YearButtonsProps) {
  const decades = new Map<number, number[]>();
  for (const year of years) {
    const group = decades.get(decadeOf(year)) ?? [];
    group.push(year);
    decades.set(decadeOf(year), group);
  }
  const openDecade = selectedYear === null ? selectedDecade : decadeOf(selectedYear);
  const openYears = openDecade === null ? undefined : decades.get(openDecade);
  const decadeRowRef = useRef<HTMLDivElement>(null);

  // No celular a linha de décadas rola na horizontal; centraliza a década aberta.
  useEffect(() => {
    const row = decadeRowRef.current;
    const chip = row?.querySelector<HTMLElement>("[data-open]");
    if (row && chip) row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
  }, [openDecade]);

  return (
    <fieldset className="min-w-0 space-y-3">
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Década e ano de lançamento</legend>
      <div ref={decadeRowRef} className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          aria-pressed={openDecade === null}
          onClick={() => onSelectYear(null)}
          className={`${chip} ${openDecade === null ? activeChip : idleChip}`}
        >
          Todos os anos
        </button>
        {[...decades.keys()].map((decade) => (
          <button
            key={decade}
            type="button"
            aria-pressed={selectedDecade === decade}
            aria-label={`Década de ${decade}`}
            data-open={openDecade === decade || undefined}
            onClick={() => onSelectDecade(decade)}
            className={`${chip} ${selectedDecade === decade ? activeChip : openDecade === decade ? openChip : idleChip}`}
          >
            {decadeLabel(decade)}
          </button>
        ))}
      </div>
      {openYears && (
        <div
          key={openDecade}
          role="group"
          aria-label={`Anos da década de ${openDecade}`}
          className="-mx-4 flex animate-fade-up gap-2 overflow-x-auto px-4 pb-1 [animation-duration:400ms] scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {openYears.map((year) => (
            <button
              key={year}
              type="button"
              aria-pressed={selectedYear === year}
              onClick={() => onSelectYear(year)}
              className={`${chip} px-3.5 ${selectedYear === year ? activeChip : idleChip}`}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </fieldset>
  );
}
