import CatalogBrowser from "@/components/CatalogBrowser";
import { getCatalog, getRecentlyOpenedMovies, PAGE_SIZE, searchCatalog } from "@/lib/catalog";

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
  const decada = param(params.decada);
  const limite = param(params.limite);
  const year = /^\d{4}$/.test(ano) ? Number(ano) : null;
  // O ano tem precedência: a década fica implícita nele.
  const decade = year === null && /^\d{3}0$/.test(decada) ? Number(decada) : null;
  const limit = /^\d+$/.test(limite)
    ? Math.max(PAGE_SIZE, Number(limite))
    : PAGE_SIZE;

  const [catalog, { movies, hasMore }, recentMovies] = await Promise.all([
    getCatalog(),
    searchCatalog(title, year, decade, limit),
    getRecentlyOpenedMovies(),
  ]);
  const years = catalog.listAvailableYears().reverse();

  return (
    <CatalogBrowser
      years={years}
      title={title}
      year={year}
      decade={decade}
      nextLimit={limit + PAGE_SIZE}
      movies={movies}
      hasMore={hasMore}
      recentMovies={recentMovies}
    />
  );
}
