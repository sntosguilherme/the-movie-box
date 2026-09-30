import assert from "node:assert/strict";
import { test } from "node:test";
import { Catalog } from "../src/catalog/catalog.ts";
import type { Filme } from "../src/models/filme.ts";
import { SplayTree } from "../src/structures/splay-tree.ts";

const movie = (id: number, title = `Filme ${id}`): Filme => ({
  id, title, overview: "", genres: [], release_date: "2000-01-01", poster_url: null,
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
  const catalog = new Catalog([8, 7, 6, 5, 4, 3, 2, 1].map((id) => movie(id)));
  const tree = catalog.tree;
  assert.equal(tree.rootId, 1);
  assert.equal(tree.peekById(8)?.id, 8);
  assert.deepEqual(catalog.resolveIds([8, 3, 999]).map(({ id }) => id), [8, 3]);
  assert.equal(tree.rootId, 1);
  assert.equal(catalog.openDetails(8)?.id, 8);
  assert.equal(tree.rootId, 1);
  assert.equal(tree.getDetailOpenCount(8), 1);
  catalog.openDetails(8); // limite de 8 rotações
  catalog.openDetails(8); // sobe até o nível 3 na terceira abertura
  assert.ok((tree.depthOf(8) ?? Infinity) <= 3);
  catalog.openDetails(8); // splay completo a partir da quarta abertura
  assert.equal(tree.rootId, 8);
  assert.equal(tree.getDetailOpenCount(8), 4);
  assert.equal(tree.openDetails(999), undefined);
  assert.equal(tree.getDetailOpenCount(999), 0);
});

test("busca por título percorre sem splay e compara o início ignorando caixa e acentos", () => {
  const catalog = new Catalog([movie(3, "Ação Total"), movie(1, "Outro"), movie(2, "Mais AÇÃO"), movie(4, "  ACAO final")]);
  assert.deepEqual(catalog.searchByTitle(" ação ").map(({ id }) => id), [3, 4]);
  assert.deepEqual(catalog.searchByTitle("acao t").map(({ id }) => id), [3]);
  assert.deepEqual(catalog.searchByTitle("total"), []);
  assert.deepEqual(catalog.searchByTitle(" "), []);
  assert.equal(catalog.tree.rootId, 4);
});

test("terceira abertura leva um filme profundo ao nível 3 e a quarta à raiz", () => {
  const tree = new SplayTree();
  for (let id = 30; id >= 1; id--) tree.insert(movie(id));
  assert.equal(tree.depthOf(30), 29);
  tree.openDetails(30);
  assert.equal(tree.depthOf(30), 25);
  tree.openDetails(30);
  assert.equal(tree.depthOf(30), 17);
  tree.openDetails(30);
  assert.equal(tree.depthOf(30), 3);
  tree.openDetails(30);
  assert.equal(tree.rootId, 30);
  assert.equal(tree.getDetailOpenCount(30), 4);
});

test("pré-ordem lista raiz, lado esquerdo e lado direito", () => {
  const tree = new SplayTree();
  for (const id of [2, 1, 3]) tree.insert(movie(id));
  tree.findById(2);
  assert.deepEqual([...tree.moviesPreOrder()].map(({ id }) => id), [2, 1, 3]);
  tree.openDetails(1);
  assert.equal([...tree.moviesPreOrder()][0].id, tree.rootId);
});

test("percurso por níveis mostra a raiz e depois cada camada", () => {
  const tree = new SplayTree();
  for (const id of [2, 1, 3, 0, 4]) tree.insert(movie(id));
  tree.findById(2);
  assert.deepEqual([...tree.moviesLevelOrder()].map(({ id }) => id), [2, 1, 3, 0, 4]);
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
