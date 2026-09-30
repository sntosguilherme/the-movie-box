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
  const limit = /^\d+$/.test(limite)
    ? Math.max(PAGE_SIZE, Number(limite))
    : PAGE_SIZE;

  const years = (await getCatalog()).listAvailableYears().reverse();
  const { movies, hasMore } = await searchCatalog(title, year, limit);

  return (
    <CatalogBrowser
      years={years}
      title={title}
      year={year}
      nextLimit={limit + PAGE_SIZE}
      movies={movies}
      hasMore={hasMore}
    />
  );
}
