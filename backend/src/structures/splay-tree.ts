import type { Filme } from "../models/filme.ts";

export const SPLAY_PAGE_SIZE = 16;

class Node {
  left: Node | null = null;
  right: Node | null = null;
  parent: Node | null = null;
  detailOpens = 0;

  constructor(readonly movie: Filme) {}
}

export class SplayTree {
  private root: Node | null = null;
  private count = 0;
  private browsingOrder: Node[] | null = null;
  private readonly browsingPositions = new Map<number, number>();

  get size(): number {
    return this.count;
  }

  get rootId(): number | null {
    return this.root?.movie.id ?? null;
  }

  /** Profundidade atual, apenas para observar o efeito das rotações. */
  depthOf(id: number): number | undefined {
    const node = this.locate(id);
    if (!node) return undefined;
    let depth = 0;
    for (let parent = node.parent; parent; parent = parent.parent) depth++;
    return depth;
  }

  /** Insere por relevância crescente para deixar o mais popular na raiz. */
  insertInitial(movies: Iterable<Filme>): void {
    if (this.count !== 0) throw new Error("A carga inicial exige uma árvore vazia.");
    const ordered = Array.from(movies).sort(
      (a, b) => a.popularity - b.popularity || b.id - a.id,
    );
    const inserted: Node[] = [];
    for (const movie of ordered) {
      if (this.insert(movie)) inserted.push(this.root!);
    }
    this.browsingOrder = inserted.reverse();
    this.reindexBrowsingOrder(0);
  }

  insert(movie: Filme): boolean {
    if (!Number.isSafeInteger(movie.id)) {
      throw new TypeError("O ID do filme deve ser um inteiro seguro.");
    }

    if (!this.root) {
      this.root = new Node(movie);
      this.count++;
      this.browsingOrder = null;
      this.browsingPositions.clear();
      return true;
    }

    let current = this.root;
    while (true) {
      if (movie.id === current.movie.id) return false;
      const side = movie.id < current.movie.id ? "left" : "right";
      if (current[side]) {
        current = current[side];
      } else {
        const node = new Node(movie);
        node.parent = current;
        current[side] = node;
        this.count++;
        this.splay(node);
        this.browsingOrder = null;
        this.browsingPositions.clear();
        return true;
      }
    }
  }

  /** Consulta para listagens e para resolver IDs da AVL: não altera a árvore. */
  peekById(id: number): Filme | undefined {
    return this.locate(id)?.movie;
  }

  /** Busca explícita por ID com splay completo. */
  findById(id: number): Filme | undefined {
    const node = this.locate(id);
    if (!node) return undefined;
    this.splay(node);
    return node.movie;
  }

  /** Promove o filme na árvore e na ordem exibida, em faixas de 16. */
  openDetails(id: number): Filme | undefined {
    const node = this.locate(id);
    if (!node) return undefined;
    this.ensureBrowsingOrder();
    const currentIndex = this.browsingPositions.get(id)!;
    const targetIndex = currentIndex < SPLAY_PAGE_SIZE
      ? 0
      : node.detailOpens === 0 ? SPLAY_PAGE_SIZE : node.detailOpens === 1 ? 1 : 0;
    const targetDepth = targetIndex === SPLAY_PAGE_SIZE ? 4 : targetIndex === 1 ? 3 : 0;
    node.detailOpens++;

    if (targetDepth === 0) this.splay(node);
    else this.splayToDepth(node, targetDepth);
    if (currentIndex !== targetIndex) {
      this.browsingOrder!.splice(currentIndex, 1);
      this.browsingOrder!.splice(targetIndex, 0, node);
      this.reindexBrowsingOrder(Math.min(currentIndex, targetIndex));
    }
    return node.movie;
  }

  /** Posição zero-based na ordem exibida, sem rotações. */
  browsingPositionOf(id: number): number | undefined {
    this.ensureBrowsingOrder();
    return this.browsingPositions.get(id);
  }

  *moviesForBrowsing(): IterableIterator<Filme> {
    this.ensureBrowsingOrder();
    for (const node of this.browsingOrder!) yield node.movie;
  }

  getDetailOpenCount(id: number): number {
    return this.locate(id)?.detailOpens ?? 0;
  }

  remove(id: number): Filme | undefined {
    const node = this.locate(id);
    if (!node) return undefined;
    const browsingIndex = this.browsingPositions.get(id);
    this.splay(node);

    const left = node.left;
    const right = node.right;
    if (left) left.parent = null;
    if (right) right.parent = null;
    node.left = node.right = null;

    if (!left) {
      this.root = right;
    } else {
      this.root = left;
      let largest = left;
      while (largest.right) largest = largest.right;
      this.splay(largest);
      largest.right = right;
      if (right) right.parent = largest;
    }

    this.count--;
    if (browsingIndex !== undefined) {
      this.browsingOrder!.splice(browsingIndex, 1);
      this.browsingPositions.delete(id);
      this.reindexBrowsingOrder(browsingIndex);
    }
    return node.movie;
  }

  private ensureBrowsingOrder(): void {
    if (this.browsingOrder !== null) return;
    const nodes: Node[] = [];
    const stack: Node[] = [];
    let current = this.root;
    while (current || stack.length) {
      while (current) {
        stack.push(current);
        current = current.left;
      }
      current = stack.pop()!;
      nodes.push(current);
      current = current.right;
    }
    nodes.sort((a, b) => b.movie.popularity - a.movie.popularity || a.movie.id - b.movie.id);
    this.browsingOrder = nodes;
    this.reindexBrowsingOrder(0);
  }

  private reindexBrowsingOrder(start: number): void {
    if (this.browsingOrder === null) return;
    for (let index = start; index < this.browsingOrder.length; index++) {
      this.browsingPositions.set(this.browsingOrder[index].movie.id, index);
    }
  }

  /** Percurso em ordem crescente de ID, sem splay. */
  *movies(): IterableIterator<Filme> {
    const stack: Node[] = [];
    let current = this.root;
    while (current || stack.length) {
      while (current) {
        stack.push(current);
        current = current.left;
      }
      current = stack.pop()!;
      yield current.movie;
      current = current.right;
    }
  }

  /** Percurso em pré-ordem para exibir a raiz antes das subárvores. */
  *moviesPreOrder(): IterableIterator<Filme> {
    if (!this.root) return;
    const stack: Node[] = [this.root];
    while (stack.length) {
      const node = stack.pop()!;
      yield node.movie;
      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
    }
  }

  /** Percurso por níveis: raiz, filhos, netos e assim por diante. */
  *moviesLevelOrder(): IterableIterator<Filme> {
    if (!this.root) return;
    const queue: Node[] = [this.root];
    for (let index = 0; index < queue.length; index++) {
      const node = queue[index];
      yield node.movie;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  private locate(id: number): Node | null {
    let current = this.root;
    while (current) {
      if (id === current.movie.id) return current;
      current = id < current.movie.id ? current.left : current.right;
    }
    return null;
  }

  private rotateLeft(node: Node): void {
    const child = node.right!;
    node.right = child.left;
    if (child.left) child.left.parent = node;
    this.replaceInParent(node, child);
    child.left = node;
    node.parent = child;
  }

  private rotateRight(node: Node): void {
    const child = node.left!;
    node.left = child.right;
    if (child.right) child.right.parent = node;
    this.replaceInParent(node, child);
    child.right = node;
    node.parent = child;
  }

  private replaceInParent(node: Node, replacement: Node): void {
    replacement.parent = node.parent;
    if (!node.parent) this.root = replacement;
    else if (node.parent.left === node) node.parent.left = replacement;
    else node.parent.right = replacement;
  }

  private rotateUp(node: Node): void {
    const parent = node.parent!;
    if (parent.left === node) this.rotateRight(parent);
    else this.rotateLeft(parent);
  }

  private splay(node: Node, limit = Number.POSITIVE_INFINITY): void {
    let rotations = 0;
    while (node.parent && rotations < limit) {
      const parent = node.parent;
      const grandparent = parent.parent;
      if (!grandparent || rotations + 1 === limit) {
        this.rotateUp(node); // zig, ou última rotação permitida
        rotations++;
      } else if ((grandparent.left === parent) === (parent.left === node)) {
        this.rotateUp(parent); // zig-zig
        this.rotateUp(node);
        rotations += 2;
      } else {
        this.rotateUp(node); // zig-zag
        this.rotateUp(node);
        rotations += 2;
      }
    }
  }

  private splayToDepth(node: Node, targetDepth: number): void {
    while (node.parent && this.nodeDepth(node) > targetDepth) {
      const parent = node.parent;
      const grandparent = parent.parent;
      if (!grandparent || this.nodeDepth(node) === targetDepth + 1) {
        this.rotateUp(node);
      } else if ((grandparent.left === parent) === (parent.left === node)) {
        this.rotateUp(parent);
        this.rotateUp(node);
      } else {
        this.rotateUp(node);
        this.rotateUp(node);
      }
    }
  }

  private nodeDepth(node: Node): number {
    let depth = 0;
    for (let parent = node.parent; parent; parent = parent.parent) depth++;
    return depth;
  }
}
