import Link from "next/link";
import { Clock3, Film } from "lucide-react";
import type { ReactNode } from "react";

export type HeaderProps = {
  search?: ReactNode;
  isLoading?: boolean;
};

export default function Header({ search, isLoading = false }: HeaderProps) {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="sticky top-0 z-40 border-b border-white/[0.06] bg-background"
    >
      <div className="mx-auto grid h-20 w-full max-w-[1400px] grid-cols-[1fr_auto] items-center gap-4 px-4 sm:h-24 sm:grid-cols-[1fr_minmax(18rem,32rem)_1fr] sm:px-6 lg:px-10">
        <Link href="/" className="group inline-flex shrink-0 items-center gap-3 rounded-lg" aria-label="THE MOVIE BOX. — página inicial">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent ring-1 ring-white/15 transition-transform duration-500 ease-smooth group-hover:-rotate-6 group-hover:scale-105">
            <Film aria-hidden="true" className="h-[1.1rem] w-[1.1rem] text-white" strokeWidth={2} />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-[0.95rem] font-bold tracking-tight">THE MOVIE BOX.</span>
            <span className="block text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">Estrutura de Dados II</span>
          </span>
        </Link>
        {search && <div className="col-span-2 row-start-2 w-full sm:col-span-1 sm:col-start-2 sm:row-start-1">{search}</div>}
        <Link href="/recentes" className="col-start-2 row-start-1 inline-flex shrink-0 justify-self-end items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm font-semibold text-muted transition-colors hover:border-accent/50 hover:text-foreground sm:col-start-3" aria-label="Ver filmes acessados recentemente">
          <Clock3 aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Recentes</span>
        </Link>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden">
        {isLoading && <div className="h-full w-2/5 animate-progress bg-accent" />}
      </div>
    </header>
  );
}
