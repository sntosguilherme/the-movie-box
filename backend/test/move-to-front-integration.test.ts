import assert from "node:assert/strict";
import { test } from "node:test";
import { Catalog } from "../src/catalog/catalog.ts";
import type { Filme } from "../src/models/filme.ts";

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

test("abrir detalhes promove o filme na lista do ano", () => {
  const catalog = new Catalog([movie(1), movie(2), movie(3)]);

  assert.deepEqual(catalog.searchByExactYear(2000).map(({ id }) => id), [1, 2, 3]);
  assert.equal(catalog.openDetails(3)?.id, 3);
  assert.deepEqual(catalog.searchByExactYear(2000).map(({ id }) => id), [3, 1, 2]);
});

test("abrir detalhes alimenta a lista MTF global de recentes", () => {
  const catalog = new Catalog([movie(1), movie(2), movie(3)]);

  assert.deepEqual(catalog.recentlyOpened(), []);
  catalog.openDetails(1);
  catalog.openDetails(3);
  catalog.openDetails(1);

  assert.deepEqual(catalog.recentlyOpened().map(({ id }) => id), [1, 3]);
  catalog.openDetails(999);
  assert.deepEqual(catalog.recentlyOpened().map(({ id }) => id), [1, 3]);
});
