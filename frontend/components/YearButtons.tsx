"use client";

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
  const options = [null, ...years];

  return (
    <fieldset className="min-w-0 space-y-3">
      <legend className="font-semibold">Ano de lançamento</legend>
      <div className={layout === "column" ? "flex flex-col gap-2" : "flex flex-wrap gap-2"}>
        {options.map((year) => (
          <button
            key={year ?? "all"}
            type="button"
            aria-pressed={selectedYear === year}
            onClick={() => onSelectYear(year)}
            className={
              `${layout === "column" ? "w-full text-left" : ""} ${
                selectedYear === year
                  ? "border-accent bg-primary-hover text-foreground"
                  : "border-border bg-primary text-foreground hover:bg-primary-hover"
              }`
            }
          >
            {year ?? "Todos os anos"}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
