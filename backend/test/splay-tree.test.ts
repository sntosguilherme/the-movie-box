import assert from "node:assert/strict";
import { test } from "node:test";
import { Catalog } from "../src/catalog/catalog.ts";
import type { Filme } from "../src/models/filme.ts";
import { SplayTree } from "../src/structures/splay-tree.ts";

const movie = (id: number, title = `Filme ${id}`): Filme => ({
  id, title, overview: "", genres: [], release_date: "2000-01-01", poster_url: null,
  popularity: 0, vote_average: 0, vote_count: 0,
});

test("inserção, busca com splay, duplicata e remoção preservam o catálogo", () => {
  const tree = new SplayTree();
  for (const id of [50, 30, 70, 20, 40, 60, 80]) {
    assert.equal(tree.insert(movie(id)), true);
  }
  assert.equal(tree.insert(movie(40, "Duplicata")), false);
  assert.equal(tree.size, 7);
  assert.equal(tree.findById(20)?.title, "Filme 20");
  assert.equal(tree.rootId, 20);
  assert.equal(tree.findById(80)?.id, 80);
  assert.equal(tree.rootId, 80);
  assert.deepEqual([...tree.movies()].map(({ id }) => id), [20, 30, 40, 50, 60, 70, 80]);
  assert.equal(tree.remove(50)?.id, 50);
  assert.equal(tree.remove(20)?.id, 20);
  assert.equal(tree.remove(80)?.id, 80);
  assert.equal(tree.remove(999), undefined);
  assert.deepEqual([...tree.movies()].map(({ id }) => id), [30, 40, 60, 70]);
  assert.equal(tree.size, 4);
});

test("detalhes aumentam gradualmente as rotações; consultas não mudam a raiz", () => {
  const catalog = new Catalog(Array.from({ length: 16 }, (_, index) => {
    const id = 16 - index;
    return { ...movie(id), popularity: 17 - id };
  }));
  const tree = catalog.tree;
  assert.equal(tree.rootId, 1);
  const initialDepth = tree.depthOf(16)!;
  assert.ok(initialDepth > 3);
  assert.equal(tree.peekById(16)?.id, 16);
  assert.deepEqual(catalog.resolveIds([16, 3, 999]).map(({ id }) => id), [16, 3]);
  assert.equal(tree.rootId, 1);
  assert.equal(catalog.openDetails(16)?.id, 16);
  const firstDepth = tree.depthOf(16)!;
  assert.ok(firstDepth < initialDepth && firstDepth > 0);
  assert.equal(tree.getDetailOpenCount(16), 1);
  catalog.openDetails(16);
  assert.ok(tree.depthOf(16)! < firstDepth);
  catalog.openDetails(16);
  assert.ok(tree.depthOf(16)! <= 3);
  assert.notEqual(tree.rootId, 16);
  catalog.openDetails(16);
  assert.equal(tree.rootId, 16);
  assert.equal(tree.getDetailOpenCount(16), 4);
  assert.equal(tree.openDetails(999), undefined);
  assert.equal(tree.getDetailOpenCount(999), 0);
});

test("busca por título percorre sem splay e compara o início ignorando caixa e acentos", () => {
  const catalog = new Catalog([movie(3, "Ação Total"), movie(1, "Outro"), movie(2, "Mais AÇÃO"), movie(4, "  ACAO final")]
    .map((filme) => ({ ...filme, popularity: filme.id })));
  assert.deepEqual(catalog.searchByTitle(" ação ").map(({ id }) => id), [4, 3]);
  assert.deepEqual(catalog.searchByTitle("acao t").map(({ id }) => id), [3]);
  assert.deepEqual(catalog.searchByTitle("total"), []);
  assert.deepEqual(catalog.searchByTitle(" "), []);
  assert.equal(catalog.tree.rootId, 4);
});

test("remoção e buscas em sequência mantêm a ordem da árvore", () => {
  const tree = new SplayTree();
  const ids = Array.from({ length: 100 }, (_, i) => (i * 37) % 101);
  for (const id of ids) tree.insert(movie(id));
  for (const id of ids) assert.equal(tree.findById(id)?.id, id);
  for (const id of ids.filter((_, index) => index % 2 === 0)) tree.remove(id);
  const remaining = ids.filter((_, index) => index % 2 !== 0).sort((a, b) => a - b);
  assert.deepEqual([...tree.movies()].map(({ id }) => id), remaining);
  assert.equal(tree.size, remaining.length);
});
