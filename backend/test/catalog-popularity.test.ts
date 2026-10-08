import assert from "node:assert/strict";
import { test } from "node:test";
import { Catalog } from "../src/catalog/catalog.ts";
import type { Filme } from "../src/models/filme.ts";

const movie = (id: number, popularity: number): Filme => ({
  id,
  title: `Filme ${id}`,
  overview: "",
  genres: [],
  release_date: "2000-01-01",
  poster_url: null,
  popularity,
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

test("a carga inicial promove o filme mais popular à raiz", () => {
  const catalog = new Catalog([
    movie(20, 50),
    movie(10, 5),
    movie(30, 100),
  ]);

  assert.equal(catalog.tree.rootId, 30);
  assert.equal([...catalog.tree.moviesLevelOrder()][0].id, 30);
});
