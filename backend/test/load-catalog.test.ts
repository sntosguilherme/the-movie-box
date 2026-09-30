import assert from "node:assert/strict";
import { test } from "node:test";
import { Catalog } from "../src/catalog/catalog.ts";
import type { Filme } from "../src/models/filme.ts";

// Massa de dados simulada para os testes
const mockMovies: Filme[] = [
  { id: 101, title: "O Senhor dos Anéis", overview: "Um anel para todos governar.", genres: ["Fantasia"], release_date: "2001-12-19", poster_url: null },
  { id: 102, title: "Matrix", overview: "O que é a Matrix?", genres: ["Ficção Científica"], release_date: "1999-03-31", poster_url: null },
  { id: 103, title: "O Senhor dos Anéis: As Duas Torres", overview: "A batalha continua.", genres: ["Fantasia"], release_date: "2002-12-18", poster_url: null },
  { id: 104, title: "Matrix Reloaded", overview: "Neo retorna.", genres: ["Ficção Científica"], release_date: "2003-05-15", poster_url: null },
  { id: 105, title: "O Retorno do Rei", overview: "O fim da jornada.", genres: ["Fantasia"], release_date: "2003-12-17", poster_url: null },
];

test("Requisito: Inserir cada objeto Filme uma única vez na Splay Tree", () => {
  // Passamos objetos duplicados de propósito
  const duplicateData = [...mockMovies, mockMovies[0], mockMovies[1]];
  const catalog = new Catalog(duplicateData);

  // A Splay Tree deve ignorar inserções com IDs repetidos
  assert.equal(catalog.tree.size, 5);
  
  // O objeto completo deve estar disponível na Splay Tree
  const filme = catalog.tree.findById(101);
  assert.equal(filme?.title, "O Senhor dos Anéis");
  assert.deepEqual(filme?.genres, ["Fantasia"]);
});

test("Requisito: Construir AVL com os anos e IDs sem copiar objetos completos", () => {
  const catalog = new Catalog(mockMovies);

  // Verifica se a AVL agrupou os IDs corretamente por ano
  assert.deepEqual([...catalog.avl.getIdsByYear(2003)].sort(), [104, 105]);
  assert.deepEqual([...catalog.avl.getIdsByYear(1999)], [102]);
  
  // Os nós da AVL devem conter apenas números (IDs)
  const ids2003 = [...catalog.avl.getIdsByYear(2003)];
  assert.equal(typeof ids2003[0], "number");
});

test("Requisito: Tratamento de IDs inexistentes", () => {
  const catalog = new Catalog(mockMovies);

  // Busca de detalhes (Splay adaptativo) com ID que não existe
  const inexistenteDetail = catalog.openDetails(9999);
  assert.equal(inexistenteDetail, undefined);

  // Resolução de IDs da AVL com IDs que não existem
  const resolved = catalog.resolveIds([101, 8888, 102]);
  
  // Deve retornar apenas os 2 que existem, sem estourar erros
  assert.equal(resolved.length, 2);
  assert.equal(resolved[0].id, 101);
  assert.equal(resolved[1].id, 102);
});

test("Requisito: Evitar enviar o catálogo inteiro ao navegador (Paginação por Ano)", () => {
  // Gerando 50 filmes para o mesmo ano
  const bulkMovies = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1, title: `Filme ${i + 1}`, overview: "", genres: [], release_date: "2020-01-01", poster_url: null
  }));
  const catalog = new Catalog(bulkMovies);

  // Testando limites
  const page1 = catalog.searchByExactYear(2020, 0, 10);
  assert.equal(page1.length, 10); // Em vez de 50, retorna só os 10 da primeira página
  assert.equal(page1[0].id, 1);
  assert.equal(page1[9].id, 10);

  // Testando saltos (skip)
  const page3 = catalog.searchByExactYear(2020, 20, 15);
  assert.equal(page3.length, 15);
  assert.equal(page3[0].id, 21);
});

test("Requisito: Travessia do catálogo para busca pelo título (com Paginação e Ignore Case)", () => {
  const catalog = new Catalog(mockMovies);

  // Busca pelo início do título, ignorando maiúsculas, acentos e espaços externos
  const resultadosSenhor = catalog.searchByTitle(" o sEnHor dos ANEIS ");
  assert.equal(resultadosSenhor.length, 2);
  
  // Confirma se retornou os filmes certos
  const titulos = resultadosSenhor.map(f => f.title);
  assert.ok(titulos.includes("O Senhor dos Anéis"));
  assert.ok(titulos.includes("O Senhor dos Anéis: As Duas Torres"));

  // Trechos no meio do título não são encontrados
  assert.equal(catalog.searchByTitle("senhor").length, 0);

  // Busca paginada por um prefixo comum ("o")
  // 3 filmes começam com "O". Vamos pedir apenas 2 pulando o 1º.
  const resultadosO = catalog.searchByTitle("o", undefined, 1, 2);
  assert.equal(resultadosO.length, 2);
});
