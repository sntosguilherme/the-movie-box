import assert from "node:assert/strict";
import { test } from "node:test";
import type { Filme } from "../src/models/filme.ts";
import { SplayTree } from "../src/structures/splay-tree.ts";

const movie = (id: number): Filme => ({
  id,
  title: `Filme ${id}`,
  overview: "",
  genres: [],
  release_date: "2000-01-01",
  poster_url: null,
  popularity: 0,
  vote_average: 0,
  vote_count: 0,
  cast: [],
  directors: [],
  writers: [],
  composers: [],
  tagline: null,
  runtime: null,
  original_title: "",
  original_language: "pt",
});

test("openDetails aproxima o filme por níveis", () => {
  const tree = new SplayTree();
  for (const id of [8, 7, 6, 5, 4, 3, 2, 1]) tree.insert(movie(id));

  tree.openDetails(8);
  assert.equal(tree.depthOf(8), 3); // nível 4

  tree.openDetails(8);
  assert.equal(tree.depthOf(8), 1); // nível 2

  tree.openDetails(8);
  assert.equal(tree.depthOf(8), 0); // raiz, nível 1
});
