import type { Filme } from "../models/filme.js";

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

  insert(movie: Filme): boolean {
    if (!Number.isSafeInteger(movie.id)) {
      throw new TypeError("O ID do filme deve ser um inteiro seguro.");
    }

    if (!this.root) {
      this.root = new Node(movie);
      this.count++;
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

  /** A abertura dos detalhes é o acesso adaptativo que reorganiza a árvore. */
  openDetails(id: number): Filme | undefined {
    const node = this.locate(id);
    if (!node) return undefined;
    node.detailOpens++;

    // Para a abertura i, são permitidas no máximo 2*i rotações:
    // 2 na primeira, 4 na segunda, 6 na terceira, etc. Assim, acessos
    // repetidos acabam levando o nó à raiz sem exigir a subida completa
    // logo na primeira abertura de um nó profundo.
    const limit = 2 * node.detailOpens;
    this.splay(node, limit);
    return node.movie;
  }

  getDetailOpenCount(id: number): number {
    return this.locate(id)?.detailOpens ?? 0;
  }

  remove(id: number): Filme | undefined {
    const node = this.locate(id);
    if (!node) return undefined;
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
    return node.movie;
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
}
