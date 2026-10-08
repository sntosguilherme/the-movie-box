import path from "node:path";
import type { Catalog } from "../../backend/src/catalog/catalog";
import { loadCatalog } from "../../backend/src/catalog/load-catalog";
import type { Filme } from "../../backend/src/models/filme";
import type { Movie } from "@/components/types";

// Uma única carga por processo do servidor; o navegador recebe só os filmes da tela.
let catalog: Promise<Catalog> | undefined;

export function getCatalog(): Promise<Catalog> {
  catalog ??= loadCatalog(
    path.join(process.cwd(), "..", "data", "movies.json"),
  );
  return catalog;
}

export const PAGE_SIZE = 24;

/** Sem título, lista pelo ano ou década da AVL ou percorre a splay tree;
 * um item extra indica se há mais resultados. */
export async function searchCatalog(
  title: string,
  year: number | null,
  decade: number | null,
  limit: number,
) {
  const catalog = await getCatalog();
  const range = decade === null ? undefined : { start: decade, end: decade + 9 };
  let found: Filme[];
  if (title.trim()) {
    found = catalog.searchByTitle(title, year ?? range, 0, limit + 1);
  } else if (year !== null) {
    found = catalog.searchByExactYear(year).slice(0, limit + 1);
  } else if (range) {
    found = catalog.searchByYearRange(range.start, range.end, 0, limit + 1);
  } else {
    found = [];
    for (const filme of catalog.tree.moviesLevelOrder()) {
      if (found.length > limit) break;
      found.push(filme);
    }
  }
  return {
    movies: found.slice(0, limit).map(toMovie),
    hasMore: found.length > limit,
  };
}

export function toMovie(filme: Filme): Movie {
  return {
    id: filme.id,
    title: filme.title,
    year: Number(filme.release_date.slice(0, 4)),
    posterUrl: filme.poster_url,
    genres: filme.genres,
    overview: filme.overview,
    popularity: filme.popularity,
    voteAverage: filme.vote_average,
    voteCount: filme.vote_count,
    cast: filme.cast.map((ator) => ({ name: ator.name, character: ator.character, photoUrl: ator.profile_url })),
    directors: filme.directors,
    writers: filme.writers,
    composers: filme.composers,
    tagline: filme.tagline,
    runtime: filme.runtime,
    originalTitle: filme.original_title,
    originalLanguage: filme.original_language,
  };
}
