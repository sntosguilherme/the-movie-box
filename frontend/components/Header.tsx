import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="rounded font-bold text-foreground">
          Catálogo de Filmes <span className="text-muted">· ED II</span>
        </Link>
        <nav aria-label="Navegação principal">
          <Link href="/" className="rounded text-muted hover:text-foreground">
            Página inicial
          </Link>
        </nav>
      </div>
    </header>
  );
}
