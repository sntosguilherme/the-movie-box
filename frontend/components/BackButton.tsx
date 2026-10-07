"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCatalogOrigin } from "./catalogOrigin";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const catalogHref = useCatalogOrigin(pathname);

  function refreshedCatalogHref(href: string): string {
    const url = new URL(href, window.location.origin);
    url.searchParams.set("reordenado", String(Date.now()));
    return `${url.pathname}${url.search}`;
  }

  return (
    <Link
      href={catalogHref ?? "/"}
      prefetch={false}
      onClick={(event) => {
        // Veio do catálogo nesta aba: voltar no histórico mantém busca, filtros, filmes carregados e rolagem.
        if (catalogHref === null || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        router.replace(refreshedCatalogHref(catalogHref));
      }}
      className="group inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/30 pl-3.5 pr-5 text-sm font-semibold text-foreground backdrop-blur-md transition-[background-color,border-color] duration-300 hover:border-white/20 hover:bg-white/10"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:-translate-x-1" />
      Voltar ao catálogo
    </Link>
  );
}
