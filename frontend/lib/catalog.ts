import path from "node:path";
import type { Catalog } from "../../backend/src/catalog/catalog";
import { loadCatalog } from "../../backend/src/catalog/load-catalog";
import type { Filme } from "../../backend/src/models/filme";
import type { Movie } from "@/components/types";

// Uma única carga por processo do servidor; o navegador recebe só os filmes da tela.
let catalog: Promise<Catalog> | undefined;

export function getCatalog(): Promise<Catalog> {
  catalog ??= loadCatalog(path.join(process.cwd(), "..", "data", "movies.json"));
  return catalog;
}

export function toMovie(filme: Filme): Movie {
  return {
    id: filme.id,
    title: filme.title,
    year: Number(filme.release_date.slice(0, 4)),
    posterUrl: filme.poster_url,
    genres: filme.genres,
    overview: filme.overview,
  };
}
