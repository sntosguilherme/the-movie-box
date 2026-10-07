import Link from "next/link";
import { Film } from "lucide-react";
import type { ReactNode } from "react";

export type HeaderProps = {
  search?: ReactNode;
  isLoading?: boolean;
};

export default function Header({ search, isLoading = false }: HeaderProps) {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/75 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-4 px-4 sm:gap-8 sm:px-6 lg:px-10">
        <Link href="/" className="group inline-flex shrink-0 items-center gap-3 rounded-lg" aria-label="Catálogo de Filmes — página inicial">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-primary shadow-lg shadow-accent/20 ring-1 ring-white/15 transition-transform duration-500 ease-smooth group-hover:-rotate-6 group-hover:scale-105">
            <Film aria-hidden="true" className="h-[1.1rem] w-[1.1rem] text-white" strokeWidth={2} />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-[0.95rem] font-bold tracking-tight">Catálogo de Filmes</span>
            <span className="block text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">Estrutura de Dados II</span>
          </span>
        </Link>
        {search && <div className="ml-auto w-full max-w-md">{search}</div>}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden">
        {isLoading && <div className="h-full w-2/5 animate-progress bg-gradient-to-r from-transparent via-accent to-transparent" />}
      </div>
    </header>
  );
}
