class ListNode<T> {
  constructor(public readonly value: T, public next: ListNode<T> | null = null) {}
}

/** Lista encadeada auto-organizável com a heurística move-to-front. */
export class SelfOrganizingList<T> implements Iterable<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;

  add(value: T): void {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      return;
    }

    this.tail!.next = node;
    this.tail = node;
  }

  /** Busca um valor e, se encontrado, move seu nó para o início da lista. */
  find(value: T): T | undefined {
    let previous: ListNode<T> | null = null;
    let current = this.head;

    while (current) {
      if (current.value === value) {
        if (previous) {
          previous.next = current.next;
          if (current === this.tail) this.tail = previous;
          current.next = this.head;
          this.head = current;
        }
        return current.value;
      }
      previous = current;
      current = current.next;
    }

    return undefined;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
