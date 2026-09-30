import { readFile } from "node:fs/promises";
import type { Filme } from "../models/filme.ts";
import { Catalog } from "./catalog.ts";

/** Carrega o JSON completo ou uma amostra inicial para a CLI. */
export async function loadCatalog(filePath: string, limit?: number): Promise<Catalog> {
  if (limit !== undefined && (!Number.isSafeInteger(limit) || limit < 1)) {
    throw new RangeError("O limite deve ser um inteiro positivo.");
  }
  const data: unknown = JSON.parse(await readFile(filePath, "utf8"));
  if (!Array.isArray(data)) throw new TypeError("O catálogo deve ser um array de filmes.");
  return new Catalog((data as Filme[]).slice(0, limit));
}
