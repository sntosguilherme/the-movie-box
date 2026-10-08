"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./YearButtons.module.css";

export type YearButtonsProps = {
  years: readonly number[];
  selectedYear: number | null;
  selectedDecade: number | null;
  onSelectYear: (year: number | null) => void;
  onSelectDecade: (decade: number) => void;
};

export function decadeOf(year: number) {
  return Math.floor(year / 10) * 10;
}

export function decadeLabel(decade: number) {
  return `${decade}–${String(decade + 9).slice(-2)}`;
}

export default function YearButtons({ years, selectedYear, selectedDecade, onSelectYear, onSelectDecade }: YearButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const decades = new Map<number, number[]>();
  for (const year of [...new Set(years)].sort((a, b) => a - b)) {
    const decade = decadeOf(year);
    const group = decades.get(decade) ?? [];
    group.push(year);
    decades.set(decade, group);
  }
  const decadeKeys = [...decades.keys()];
  const openDecade = selectedYear === null ? selectedDecade : decadeOf(selectedYear);
  const openYears = openDecade === null ? undefined : decades.get(openDecade);
  const zoomed = openYears !== undefined;
  const points = openYears ?? decadeKeys;
  const decadeIndex = openDecade === null ? -1 : decadeKeys.indexOf(openDecade);
  const timelineId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const focusAfterZoom = useRef(false);
  const [zoomOrigin, setZoomOrigin] = useState("50%");

  // O foco só acompanha um zoom iniciado na linha, nunca uma busca ou paginação.
  useEffect(() => {
    const viewport = viewportRef.current;
    const point = viewport?.querySelector<HTMLButtonElement>("[aria-pressed='true']")
      ?? viewport?.querySelector<HTMLButtonElement>("[data-point]");
    if (!viewport || !point) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollTo({
      left: point.offsetLeft - (viewport.clientWidth - point.offsetWidth) / 2,
      behavior: reducedMotion ? "instant" : "smooth",
    });
    if (focusAfterZoom.current) {
      point.focus({ preventScroll: true });
      focusAfterZoom.current = false;
    }
  }, [openDecade, selectedYear]);

  function selectPoint(value: number, index: number) {
    if (zoomed) {
      onSelectYear(value);
    } else {
      setZoomOrigin(`${((index + 0.5) / points.length) * 100}%`);
      focusAfterZoom.current = true;
      onSelectDecade(value);
    }
  }

  function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
    const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-point]")];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = Math.min(index + 1, buttons.length - 1); break;
      case "ArrowLeft": next = Math.max(index - 1, 0); break;
      case "Home": next = 0; break;
      case "End": next = buttons.length - 1; break;
      default: return;
    }
    event.preventDefault();
    buttons[next].focus({ preventScroll: true });
    buttons[next].scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Navegação por lançamento</legend>
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={timelineId}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-surface-raised px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:border-white/15"
      >
        Linha do tempo do cinema
        <ChevronDown aria-hidden="true" className={`size-4 text-accent transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>
      {isExpanded && (
        <div id={timelineId} className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-controls={timelineId}
            aria-expanded={zoomed}
            aria-label={zoomed ? "Voltar às décadas e mostrar todos os anos" : "Mostrar todos os anos"}
            onClick={() => onSelectYear(null)}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm transition-colors ${zoomed ? "border-white/10 text-muted hover:border-accent/50 hover:text-foreground" : "border-accent/40 bg-accent/10 text-foreground"}`}
          >
            {zoomed && <ArrowLeft aria-hidden="true" className="size-4" />}
            {zoomed ? "Décadas" : "Todos os anos"}
          </button>
          <p role="status" className="text-sm text-foreground">
            {zoomed ? `Década de ${openDecade}` : "Explore as décadas"}
            {selectedYear !== null && <span className="text-accent"> / {selectedYear}</span>}
          </p>
        </div>
        {zoomed && (
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Década anterior" disabled={decadeIndex <= 0} onClick={() => onSelectDecade(decadeKeys[decadeIndex - 1])} className="flex size-10 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:text-accent disabled:cursor-default disabled:opacity-30">
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <button type="button" aria-label="Próxima década" disabled={decadeIndex < 0 || decadeIndex >= decadeKeys.length - 1} onClick={() => onSelectDecade(decadeKeys[decadeIndex + 1])} className="flex size-10 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:text-accent disabled:cursor-default disabled:opacity-30">
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-muted">{zoomed ? "Selecione um ano para explorar seus filmes." : "Selecione uma década para ampliar seus anos."}</p>
      <div ref={viewportRef} className={styles.viewport}>
        <div
          key={zoomed ? openDecade : "decades"}
          role="group"
          aria-label={zoomed ? `Anos da década de ${openDecade}` : "Décadas com filmes"}
          onKeyDown={moveFocus}
          className={`${styles.track} ${zoomed ? styles.zoomIn : styles.zoomOut}`}
          style={{ "--zoom-origin": zoomOrigin } as CSSProperties}
        >
          {points.map((value, index) => (
            <button
              key={value}
              type="button"
              data-point
              aria-label={zoomed ? `Ano ${value}` : `Década de ${value}`}
              aria-pressed={zoomed ? selectedYear === value : openDecade === value}
              aria-expanded={zoomed ? undefined : false}
              aria-controls={zoomed ? undefined : timelineId}
              onClick={() => selectPoint(value, index)}
              className={styles.point}
            >
              <span aria-hidden="true" className={styles.dot} />
              <span className={styles.label}>{value}</span>
              {!zoomed && <span className={styles.range}>{decadeLabel(value)}</span>}
            </button>
          ))}
        </div>
      </div>
      {points.length === 0 && <p className="py-4 text-sm text-muted">Nenhum ano disponível no catálogo.</p>}
        </div>
      )}
    </fieldset>
  );
}
