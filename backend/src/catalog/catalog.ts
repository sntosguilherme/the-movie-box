import type { Filme } from "../models/filme.js";
import { SplayTree } from "../structures/splay-tree.js";

export class Catalog {
  readonly tree = new SplayTree();

  constructor(movies: Iterable<Filme>) {
    for (const movie of movies) this.tree.insert(movie);
  }

  /** Usado pela página de detalhes; registra a abertura e faz splay parcial. */
  openDetails(id: number): Filme | undefined {
    return this.tree.openDetails(id);
  }

  /** Usado por consultas e pelos IDs retornados pela AVL; não faz splay. */
  resolveIds(ids: Iterable<number>): Filme[] {
    const movies: Filme[] = [];
    for (const id of ids) {
      const movie = this.tree.peekById(id);
      if (movie) movies.push(movie);
    }
    return movies;
  }

  searchByTitle(query: string): Filme[] {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    if (!term) return [];
    const results: Filme[] = [];
    for (const movie of this.tree.movies()) {
      if (movie.title.toLocaleLowerCase("pt-BR").includes(term)) {
        results.push(movie);
      }
    }
    return results;
  }
}
