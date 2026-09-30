import assert from "node:assert/strict";
import { test } from "node:test";
import { Catalog } from "../src/catalog/catalog.js";
import type { Filme } from "../src/models/filme.js";

// Helper para criar filmes de teste facilmente
const mockMovie = (id: number, title: string, year: string): Filme => ({
  id,
  title,
  overview: "Sinopse de teste",
  genres: ["Ação"],
  release_date: `${year}-05-10`, // Simulando o formato de data real
  poster_url: null,
});

test("Integração - Busca por ano exato retorna filmes completos da Splay Tree", () => {
  const catalog = new Catalog([
    mockMovie(1, "Filme A", "2000"),
    mockMovie(2, "Filme B", "2000"),
    mockMovie(3, "Filme C", "2005")
  ]);

  // Busca de ano com múltiplos filmes
  const filmes2000 = catalog.searchByExactYear(2000);
  assert.equal(filmes2000.length, 2);
  
  // Verifica se o objeto retornado é o filme completo (resolvido na Splay Tree) e não apenas o ID
  assert.equal(filmes2000[0].title, "Filme A");
  assert.equal(filmes2000[0].release_date, "2000-05-10");
  assert.equal(filmes2000[1].title, "Filme B");

  // Busca de ano com apenas um filme
  const filmes2005 = catalog.searchByExactYear(2005);
  assert.equal(filmes2005.length, 1);
  assert.equal(filmes2005[0].id, 3);

  // Busca de ano inexistente (deve retornar array vazio, sem quebrar)
  const filmesVazio = catalog.searchByExactYear(1999);
  assert.deepEqual(filmesVazio, []);
});

test("Integração - Busca por intervalo de anos retorna filmes completos", () => {
  const catalog = new Catalog([
    mockMovie(10, "Filme 2010", "2010"),
    mockMovie(15, "Filme 2015", "2015"),
    mockMovie(20, "Filme 2020", "2020")
  ]);

  // Intervalo exato contendo dois anos
  const range1 = catalog.searchByYearRange(2010, 2015);
  assert.equal(range1.length, 2);
  
  // Extraímos os IDs retornados e ordenamos para garantir a validação
  const idsRange1 = range1.map(f => f.id).sort((a, b) => a - b);
  assert.deepEqual(idsRange1, [10, 15]);
  assert.equal(range1[0].overview, "Sinopse de teste"); // Confirma que é o objeto completo

  // Intervalo mais amplo contendo todos os filmes
  const range2 = catalog.searchByYearRange(2000, 2030);
  assert.equal(range2.length, 3);

  // Intervalo sem filmes (deve retornar array vazio, sem quebrar)
  const range3 = catalog.searchByYearRange(1990, 1999);
  assert.deepEqual(range3, []);
});

test("Integração - Lista de anos disponíveis ignora duplicatas e retorna ordenada", () => {
  const catalog = new Catalog([
    mockMovie(5, "Filme E", "2020"),
    mockMovie(1, "Filme A", "1995"),
    mockMovie(3, "Filme C", "2010"),
    mockMovie(4, "Filme D", "1995") // Dois filmes no mesmo ano
  ]);

  const years = catalog.listAvailableYears();
  
  // A AVL deve retornar os anos ordenados e o ano 1995 deve aparecer apenas uma vez
  assert.deepEqual(years, [1995, 2010, 2020]);
});

test("Integração - IDs órfãos (inconsistência) são tratados graciosamente", () => {
  const catalog = new Catalog([]);
  
  // Forçando uma inconsistência manual apenas para teste:
  // Inserimos um ID na AVL que não existe na Splay Tree.
  catalog.avl.insert(2023, 999); 

  const filmes2023 = catalog.searchByExactYear(2023);
  
  // O catalog.resolveIds deve pular o ID 999 porque tree.peekById(999) retornará undefined.
  // O resultado deve ser um array vazio, sem estourar erro de "Cannot read properties of undefined".
  assert.deepEqual(filmes2023, []);
});

test("Integração - Busca por título com ano selecionado compara apenas os filmes daquele ano", () => {
  const catalog = new Catalog([
    mockMovie(1, "Matrix", "1999"),
    mockMovie(2, "Matrix Reloaded", "2003"),
    mockMovie(3, "Matrix Revolutions", "2003"),
    mockMovie(4, "Procurando Nemo", "2003")
  ]);

  const ids = (movies: Filme[]) => movies.map(f => f.id).sort((a, b) => a - b);
  assert.deepEqual(ids(catalog.searchByTitle("matrix", 2003)), [2, 3]);
  assert.deepEqual(ids(catalog.searchByTitle("matrix", 1999)), [1]);
  assert.deepEqual(catalog.searchByTitle("matrix", 1980), []);
  assert.deepEqual(ids(catalog.searchByTitle("matrix")), [1, 2, 3]);
});