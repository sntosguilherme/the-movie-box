import { SelfOrganizingList } from "./self-organizing-list.ts";

// implementação do índice de anos com IDs em uma lista auto-organizável

// implementação do nó da AVL
class AVLNode {
  height = 1;
  left: AVLNode | null = null;
  right: AVLNode | null = null;
  readonly ids = new SelfOrganizingList<number>();

  constructor(public readonly year: number, id: number) {
    this.ids.add(id);
  }
}

// implementação da árvore AVL
export class AVLTree {
  private root: AVLNode | null = null;

  private getHeight(node: AVLNode | null): number {
    return node ? node.height : 0;
  }

  private getBalance(node: AVLNode | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  private rightRotate(y: AVLNode): AVLNode {
    const x = y.left!;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    return x;
  }

  private leftRotate(x: AVLNode): AVLNode {
    const y = x.right!;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    return y;
  }

  insert(year: number, id: number): void {
    this.root = this.insertNode(this.root, year, id);
  }

  private insertNode(node: AVLNode | null, year: number, id: number): AVLNode {
    if (!node) return new AVLNode(year, id);

    if (year < node.year) {
      node.left = this.insertNode(node.left, year, id);
    } else if (year > node.year) {
      node.right = this.insertNode(node.right, year, id);
    } else {
      // O ano já existe, apenas adicionamos o ID na lista encadeada
      node.ids.add(id);
      return node;
    }

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);

    if (balance > 1 && year < node.left!.year) return this.rightRotate(node);
    if (balance < -1 && year > node.right!.year) return this.leftRotate(node);
    if (balance > 1 && year > node.left!.year) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }
    if (balance < -1 && year < node.right!.year) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }

  /** Consulta de um ano exato, retornando array vazio caso não exista. */
  *getIdsByYear(year: number): IterableIterator<number> {
    let current = this.root;
    while (current) {
      if (year === current.year) {
        yield* current.ids;
        return;
      }
      current = year < current.year ? current.left : current.right;
    }
  }

  /** Move o ID acessado para o início da lista do ano informado. */
  moveIdToFront(year: number, id: number): boolean {
    let current = this.root;
    while (current) {
      if (year === current.year) return current.ids.find(id) !== undefined;
      current = year < current.year ? current.left : current.right;
    }
    return false;
  }

  /** Consulta de um intervalo de anos, percorrendo a árvore em ordem. */
  *getIdsByYearRange(startYear: number, endYear: number): IterableIterator<number> {
    yield* this.rangeSearch(this.root, startYear, endYear);
  }

  private *rangeSearch(node: AVLNode | null, start: number, end: number): IterableIterator<number> {
    if (!node) return;
    
    // Se o ano atual é maior que o início, pode haver nós válidos à esquerda
    if (start < node.year) {
      yield* this.rangeSearch(node.left, start, end);
    }
    
    // Se está dentro do intervalo, adiciona os IDs
    if (node.year >= start && node.year <= end) {
      yield* node.ids;
    }
    
    // Se o ano atual é menor que o fim, pode haver nós válidos à direita
    if (end > node.year) {
      yield* this.rangeSearch(node.right, start, end);
    }
  }

  /** Gerador para listar os anos da árvore em ordem crescente. */
  *years(): IterableIterator<number> {
    const stack: AVLNode[] = [];
    let current = this.root;
    
    while (current || stack.length > 0) {
      while (current) {
        stack.push(current);
        current = current.left;
      }
      current = stack.pop()!;
      yield current.year;
      current = current.right;
    }
  }
}
