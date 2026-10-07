import path from "node:path";
import type { Catalog } from "../../backend/src/catalog/catalog";
import { SPLAY_PAGE_SIZE } from "../../backend/src/structures/splay-tree";
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

export const PAGE_SIZE = SPLAY_PAGE_SIZE;

/** Retorna os primeiros `limit` filmes e um item extra para "Carregar mais". */
export async function searchCatalog(
  title: string,
  year: number | null,
  limit: number,
) {
  const catalog = await getCatalog();
  let found: Filme[];
  if (title.trim()) {
    found = catalog.searchByTitle(title, year ?? undefined, 0, limit + 1);
  } else if (year !== null) {
    found = catalog.searchByExactYear(year, 0, limit + 1);
  } else {
    found = [];
    for (const filme of catalog.moviesForBrowsing()) {
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
  };
}
