"use client";

import { useState } from "react";

export type YearButtonsProps = {
  years: readonly number[];
  selectedYear: number | null;
  onSelectYear: (year: number | null) => void;
  layout?: "row" | "column";
};

export default function YearButtons({
  years,
  selectedYear,
  onSelectYear,
  layout = "row",
}: YearButtonsProps) {
  const decades = new Map<number, number[]>();
  for (const year of years) {
    const decade = Math.floor(year / 10) * 10;
    const group = decades.get(decade) ?? [];
    group.push(year);
    decades.set(decade, group);
  }
  const initialDecade = selectedYear === null
    ? decades.keys().next().value
    : Math.floor(selectedYear / 10) * 10;
  const [expandedDecade, setExpandedDecade] = useState<number | undefined>(initialDecade);

  return (
    <fieldset className="min-w-0 space-y-3">
      <legend className="font-semibold">Ano de lançamento</legend>
      <div className={layout === "column" ? "flex flex-col gap-2" : "flex flex-wrap gap-2"}>
        <button
          type="button"
          aria-pressed={selectedYear === null}
          onClick={() => onSelectYear(null)}
          className={`${layout === "column" ? "w-full text-left" : ""} ${selectedYear === null ? "border-accent bg-primary-hover" : ""}`}
        >
          Todos os anos
        </button>
        {[...decades].map(([decade, decadeYears]) => (
          <details key={decade} open={decade === expandedDecade} className="min-w-0 rounded-lg border border-border bg-surface">
            <summary
              className="cursor-pointer px-3 py-2 font-semibold"
              onClick={(event) => {
                event.preventDefault();
                setExpandedDecade(decade === expandedDecade ? undefined : decade);
              }}
            >
              {decade}–{decade + 9}
            </summary>
            <div className={layout === "column" ? "flex flex-col gap-2 p-2 pt-0" : "flex flex-wrap gap-2 p-2 pt-0"}>
              {decadeYears.map((year) => (
                <button
                  key={year}
                  type="button"
                  aria-pressed={selectedYear === year}
                  onClick={() => onSelectYear(year)}
                  className={`${layout === "column" ? "w-full text-left" : ""} ${selectedYear === year ? "border-accent bg-primary-hover" : ""}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </details>
        ))}
      </div>
    </fieldset>
  );
}
