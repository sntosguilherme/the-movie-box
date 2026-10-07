import CatalogBrowser from "@/components/CatalogBrowser";
import { getCatalog, PAGE_SIZE, searchCatalog } from "@/lib/catalog";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const title = param(params.titulo);
  const ano = param(params.ano);
  const limite = param(params.limite);
  const year = /^\d{4}$/.test(ano) ? Number(ano) : null;
  const requestedLimit = /^\d+$/.test(limite) ? Number(limite) : PAGE_SIZE;
  const limit = Number.isSafeInteger(requestedLimit)
    ? Math.max(PAGE_SIZE, Math.ceil(requestedLimit / PAGE_SIZE) * PAGE_SIZE)
    : PAGE_SIZE;

  const years = (await getCatalog()).listAvailableYears().reverse();
  const { movies, hasMore } = await searchCatalog(title, year, limit);
  const returnParams = new URLSearchParams();
  if (title.trim()) returnParams.set("titulo", title);
  if (year !== null) returnParams.set("ano", String(year));
  if (limit > PAGE_SIZE) returnParams.set("limite", String(limit));
  const returnSearch = returnParams.toString();

  return (
    <CatalogBrowser
      years={years}
      title={title}
      year={year}
      nextLimit={limit + PAGE_SIZE}
      returnHref={returnSearch ? `/?${returnSearch}` : "/"}
      movies={movies}
      hasMore={hasMore}
    />
  );
}
