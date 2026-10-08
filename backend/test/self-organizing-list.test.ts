import assert from "node:assert/strict";
import { test } from "node:test";
import { SelfOrganizingList } from "../src/structures/self-organizing-list.ts";

test("SelfOrganizingList - find aplica move-to-front", () => {
  const list = new SelfOrganizingList<number>();
  list.add(10);
  list.add(20);
  list.add(30);

  assert.equal(list.find(30), 30);
  assert.deepEqual([...list], [30, 10, 20]);

  assert.equal(list.find(20), 20);
  assert.deepEqual([...list], [20, 30, 10]);
});

test("SelfOrganizingList - busca ausente não reorganiza a lista", () => {
  const list = new SelfOrganizingList<number>();
  list.add(10);
  list.add(20);

  assert.equal(list.find(99), undefined);
  assert.deepEqual([...list], [10, 20]);
});
