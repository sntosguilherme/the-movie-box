
import type { Filme } from "../models/filme.js";
import { SplayTree } from "../structures/splay-tree.js";
import { AVLTree } from "../structures/avl-tree.js";

export class Catalog {
  readonly tree = new SplayTree();
  readonly avl = new AVLTree();

  constructor(movies: Iterable ) {
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

  resolveIds(ids: Iterable ): Filme[] {
    const movies: Filme[] = [];
    for (const id of ids) {
      const movie = this.tree.peekById(id);
      if (movie) movies.push(movie);
    }
    return movies;
  }

  /** 
   * CAMADA DE CONSULTA (Ano Exato): 
   * Encontra o ano na AVL, percorre a lista de IDs e busca os filmes completos na Splay Tree.
   */
  searchByExactYear(year: number, skip = 0, limit = 10): Filme[] { // Recebe parâmetros de limite
  const ids = this.avl.getIdsByYear(year);
  if (ids.length === 0) return []; 

  const paginatedIds = ids.slice(skip, skip + limit); // Corta a lista de IDs
  return this.resolveIds(paginatedIds); // Resolve apenas os 10 necessários
}

  /** 
   * CAMADA DE CONSULTA (Intervalo de Anos):
   * Encontra os anos na AVL, percorre os IDs e busca os filmes completos na Splay Tree.
   */
  searchByYearRange(startYear: number, endYear: number, skip = 0, limit = 10): Filme[] { // Recebe parâmetros
  const ids = this.avl.getIdsByYearRange(startYear, endYear);
  if (ids.length === 0) return [];

  const paginatedIds = ids.slice(skip, skip + limit); // Corta a lista
  return this.resolveIds(paginatedIds); // Resolve apenas o necessário
}
  /**
   * Lista os anos disponíveis em ordem.
   */
  listAvailableYears(): number[] {
    return [...this.avl.years()];
  }

  searchByTitle(query: string, skip = 0, limit = 10): Filme[] {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    if (!term) return [];
    
    const results: Filme[] = [];
    let matchCount = 0;

    for (const movie of this.tree.movies()) {
      if (movie.title.toLocaleLowerCase("pt-BR").includes(term)) {
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