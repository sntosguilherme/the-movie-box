import assert from "node:assert/strict";
import { test } from "node:test";
import { AVLTree } from "../src/structures/avl-tree.js";

test("AVLTree - Inserção e busca exata por ano com múltiplos IDs", () => {
  const avl = new AVLTree();
  
  // Inserindo múltiplos IDs para o mesmo ano (deve encadear na lista)
  avl.insert(2001, 10);
  avl.insert(2001, 20);
  avl.insert(2001, 30);
  
  // Inserindo outros anos
  avl.insert(1999, 5);
  avl.insert(2005, 50);

  // Verificando retornos exatos
  assert.deepEqual(avl.getIdsByYear(2001), [10, 20, 30]);
  assert.deepEqual(avl.getIdsByYear(1999), [5]);
  assert.deepEqual(avl.getIdsByYear(2005), [50]);
  
  // Verificando ano sem filmes
  assert.deepEqual(avl.getIdsByYear(2010), []);
});

test("AVLTree - Busca por intervalo de anos (range search)", () => {
  const avl = new AVLTree();
  
  avl.insert(2000, 1);
  avl.insert(2005, 2);
  avl.insert(2005, 3);
  avl.insert(2010, 4);
  avl.insert(2015, 5);
  avl.insert(2020, 6);

  // Intervalo contendo múltiplos anos
  assert.deepEqual(avl.getIdsByYearRange(2005, 2015), [2, 3, 4, 5]);
  
  // Intervalo mais amplo do que os dados existentes
  assert.deepEqual(avl.getIdsByYearRange(1990, 2010), [1, 2, 3, 4]);
  
  // Intervalo sem nenhum filme cadastrado
  assert.deepEqual(avl.getIdsByYearRange(1980, 1999), []);
  
  // Intervalo de um ano apenas (comportamento de busca exata)
  assert.deepEqual(avl.getIdsByYearRange(2005, 2005), [2, 3]);
});

test("AVLTree - Listagem de anos em ordem crescente via gerador", () => {
  const avl = new AVLTree();
  const insertOrder = [2020, 1990, 2010, 2005, 1980, 2000];
  const expectedOrder = [1980, 1990, 2000, 2005, 2010, 2020];

  for (const year of insertOrder) {
    avl.insert(year, year % 100);
  }

  // Inserindo ID em ano já existente não deve duplicar o nó do ano na árvore
  avl.insert(2000, 999);

  // Consumindo o gerador
  const yearsArray = [...avl.years()];
  assert.deepEqual(yearsArray, expectedOrder);
});

test("AVLTree - Balanceamento implícito lida com inserção sequencial em pior caso", () => {
  const avl = new AVLTree();
  const years = Array.from({ length: 100 }, (_, i) => i + 1900);
  
  // Inserir elementos já ordenados causaria O(n) em uma BST normal.
  // A AVL deve fazer rotações à esquerda para manter a altura logarítmica.
  for (const year of years) {
    avl.insert(year, year);
  }

  // Se as rotações não quebrarem as ligações, a ordem in-order continuará perfeita
  assert.deepEqual([...avl.years()], years);
  
  // Validando acesso aos extremos da árvore
  assert.deepEqual(avl.getIdsByYear(1900), [1900]);
  assert.deepEqual(avl.getIdsByYear(1999), [1999]);
});