
import type { Filme } from "../models/filme.js";
import { SplayTree } from "../structures/splay-tree.js";
import { AVLTree } from "../structures/avl-tree.js";

export class Catalog {
  readonly tree = new SplayTree();
  readonly avl = new AVLTree();

  constructor(movies: Iterable) {
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

  resolveIds(ids: Iterable): Filme[] {
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
  searchByExactYear(year: number): Filme[] {
    const ids = this.avl.getIdsByYear(year);
    
    // Integra a consulta ao filtro e retorna array vazio para anos sem filmes
    if (ids.length === 0) return []; 
    
    return this.resolveIds(ids);
  }

  /** 
   * CAMADA DE CONSULTA (Intervalo de Anos):
   * Encontra os anos na AVL, percorre os IDs e busca os filmes completos na Splay Tree.
   */
  searchByYearRange(startYear: number, endYear: number): Filme[] {
    const ids = this.avl.getIdsByYearRange(startYear, endYear);
    
    if (ids.length === 0) return [];
    
    return this.resolveIds(ids);
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