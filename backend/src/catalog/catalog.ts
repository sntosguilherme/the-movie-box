
import type { Filme } from "../models/filme.ts";
import { SplayTree } from "../structures/splay-tree.ts";
import { AVLTree } from "../structures/avl-tree.ts";

export const CATALOG_PAGE_SIZE = 16;

function normalizeTitle(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").trim().toLocaleLowerCase("pt-BR");
}

export class Catalog {
  readonly tree = new SplayTree();
  readonly avl = new AVLTree();
  private readonly browsingOrder: Filme[];
  private readonly browsingPositions = new Map<number, number>();

  constructor(movies: Iterable<Filme>) {
    const inputMovies = Array.from(movies);
    const moviesByPopularity = [...inputMovies].sort(
      (a, b) => a.popularity - b.popularity || b.id - a.id,
    );

    const inserted: Filme[] = [];
    for (const movie of moviesByPopularity) {
      if (this.tree.insert(movie)) inserted.push(movie);
    }
    this.browsingOrder = inserted.reverse();
    this.browsingOrder.forEach((movie, index) => this.browsingPositions.set(movie.id, index));

    // Mantém a ordem original dos IDs dentro de cada ano na AVL.
    for (const movie of inputMovies) {
      if (movie.release_date) {
        const year = parseInt(movie.release_date.substring(0, 4), 10);
        if (!isNaN(year)) {
          this.avl.insert(year, movie.id);
        }
      }
    }
  }

  openDetails(id: number): Filme | undefined {
    const currentIndex = this.browsingPositions.get(id);
    if (currentIndex === undefined) return undefined;

    const opens = this.tree.getDetailOpenCount(id);
    const targetIndex = currentIndex < CATALOG_PAGE_SIZE
      ? 0
      : opens === 0 ? CATALOG_PAGE_SIZE : opens === 1 ? 1 : 0;
    const targetDepth = targetIndex === CATALOG_PAGE_SIZE ? 4 : targetIndex === 1 ? 3 : 0;
    const movie = this.tree.openDetails(id, targetDepth);
    if (!movie) return undefined;

    if (currentIndex !== targetIndex) {
      this.browsingOrder.splice(currentIndex, 1);
      this.browsingOrder.splice(targetIndex, 0, movie);
      for (let index = Math.min(currentIndex, targetIndex); index <= Math.max(currentIndex, targetIndex); index++) {
        this.browsingPositions.set(this.browsingOrder[index].id, index);
      }
    }
    return movie;
  }

  /** Ordem inicial por relevância, com promoções em faixas de 16 após aberturas. */
  *moviesForBrowsing(): IterableIterator<Filme> {
    yield* this.browsingOrder;
  }

  private rankMovies(movies: Iterable<Filme>): Filme[] {
    return Array.from(movies).sort(
      (a, b) => this.browsingPositions.get(a.id)! - this.browsingPositions.get(b.id)!,
    );
  }

  resolveIds(ids: Iterable<number>, skip = 0, limit = Infinity): Filme[] {
    const movies: Filme[] = [];
    let index = 0;
    for (const id of ids) {
      if (index++ < skip) continue;
      const movie = this.tree.peekById(id);
      if (movie) movies.push(movie);
      if (movies.length >= limit) break;
    }
    return movies;
  }

  /** 
   * CAMADA DE CONSULTA (Ano Exato): 
   * Encontra o ano na AVL, percorre a lista de IDs e busca os filmes completos na Splay Tree.
   */
  searchByExactYear(year: number, skip = 0, limit = Infinity): Filme[] {
    return this.rankMovies(this.resolveIds(this.avl.getIdsByYear(year)))
      .slice(skip, skip + limit);
  }

  /** 
   * CAMADA DE CONSULTA (Intervalo de Anos):
   * Encontra os anos na AVL, percorre os IDs e busca os filmes completos na Splay Tree.
   */
  searchByYearRange(startYear: number, endYear: number, skip = 0, limit = Infinity): Filme[] {
    return this.resolveIds(this.avl.getIdsByYearRange(startYear, endYear), skip, limit);
  }

  /**
   * Lista os anos disponíveis em ordem.
   */
  listAvailableYears(): number[] {
    return [...this.avl.years()];
  }

  /**
   * Busca pelo início do título. Com ano selecionado, compara apenas os filmes
   * cujos IDs estão naquele ano da AVL; sem ano, percorre o ranking do catálogo.
   */
  searchByTitle(query: string, year?: number, skip = 0, limit = 10): Filme[] {
    const term = normalizeTitle(query);
    if (!term) return [];

    const candidates = year === undefined ? this.moviesForBrowsing() : this.searchByExactYear(year);
    const results: Filme[] = [];
    let matchCount = 0;

    for (const movie of candidates) {
      if (normalizeTitle(movie.title).startsWith(term)) {
        if (matchCount >= skip && results.length < limit) {
          results.push(movie);
        }
        matchCount++;
        if (results.length >= limit) break;
      }
    }
    return results;
  }
}
