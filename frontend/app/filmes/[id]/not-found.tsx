import { Clapperboard } from "lucide-react";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";

export default function MovieNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[70dvh] w-full max-w-[1400px] animate-fade-up flex-col items-center justify-center gap-6 px-4 text-center sm:px-6 lg:px-10">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-surface-raised ring-1 ring-border-strong">
          <Clapperboard aria-hidden="true" className="h-7 w-7 text-accent" strokeWidth={1.75} />
        </span>
        <div className="space-y-3">
          <h1 className="font-display text-5xl tracking-tight sm:text-6xl">Filme não encontrado</h1>
          <p className="text-muted">O ID informado não corresponde a nenhum filme do catálogo.</p>
        </div>
        <BackButton />
      </main>
    </>
  );
}
