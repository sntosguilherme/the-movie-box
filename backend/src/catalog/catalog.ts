
import type { Filme } from "../models/filme.ts";
import { SplayTree } from "../structures/splay-tree.ts";
import { AVLTree } from "../structures/avl-tree.ts";

function normalizeTitle(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").trim().toLocaleLowerCase("pt-BR");
}

export class Catalog {
  readonly tree = new SplayTree();
  readonly avl = new AVLTree();

  constructor(movies: Iterable<Filme>) {
    // Constrói a AVL a partir do catálogo, conforme exigido.
    for (const movie of movies) {
      this.tree.insert(movie);
      
      if (movie.release_date) {
        const year = parseInt(movie.release_date.substring(0, 4), 10);
        if (!isNaN(year)) {
          this.avl.insert(year, movie.id);
        }
      }
    }
  }

  openDetails(id: number): Filme | undefined {
    return this.tree.openDetails(id);
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
    return this.resolveIds(this.avl.getIdsByYear(year), skip, limit);
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
   * cujos IDs estão naquele ano da AVL; sem ano, percorre a splay tree.
   */
  searchByTitle(query: string, year?: number, skip = 0, limit = 10): Filme[] {
    const term = normalizeTitle(query);
    if (!term) return [];

    const candidates = year === undefined ? this.tree.movies() : this.resolveIds(this.avl.getIdsByYear(year));
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
