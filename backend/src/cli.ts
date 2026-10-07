import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { loadCatalog } from "./catalog/load-catalog.ts";
import { CATALOG_PAGE_SIZE } from "./catalog/catalog.ts";
import type { Filme } from "./models/filme.ts";

const dataPath = fileURLToPath(new URL("../../../data/movies.json", import.meta.url));
let catalog = await loadCatalog(dataPath, 100);
const input = createInterface({ input: process.stdin, output: process.stdout, terminal: process.stdin.isTTY });

function label(movie: Filme): string {
  return `${movie.id} — ${movie.title} (${movie.release_date.slice(0, 4)})`;
}

function parseId(value: string | undefined): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : undefined;
}

function showRoot(): void {
  const id = catalog.tree.rootId;
  const movie = id === null ? undefined : catalog.tree.peekById(id);
  console.log(`Raiz: ${movie ? label(movie) : "árvore vazia"} | Filmes: ${catalog.tree.size}`);
}

function help(): void {
  console.log(`Comandos:
  lista [n]       Lista até n filmes por níveis (padrão: 10), sem splay
  titulo <texto>  Busca por título, sem splay
  consultar <id>  Consulta por ID, sem splay
  abrir <id>      Abre detalhes; promove o filme entre faixas de 16
  buscar <id>     Busca por ID e faz splay completo
  remover <id>    Remove um filme da árvore
  raiz            Mostra a raiz atual
  reiniciar       Recarrega os mesmos 100 filmes
  ajuda           Mostra esta ajuda
  sair            Encerra`);
}

function access(id: number, mode: "abrir" | "buscar"): void {
  const depthBefore = catalog.tree.depthOf(id);
  const rootBefore = catalog.tree.rootId;
  const movie = mode === "abrir" ? catalog.openDetails(id) : catalog.tree.findById(id);
  if (!movie) {
    console.log(`ID ${id} não encontrado.`);
    return;
  }
  console.log(label(movie));
  if (mode === "abrir") {
    const opens = catalog.tree.getDetailOpenCount(id);
    const position = [...catalog.moviesForBrowsing()].findIndex((item) => item.id === id) + 1;
    console.log(`Abertura ${opens}; posição no catálogo: ${position}; faixa: ${Math.ceil(position / CATALOG_PAGE_SIZE)}.`);
  }
  console.log(`Profundidade: ${depthBefore} → ${catalog.tree.depthOf(id)} | Raiz: ${rootBefore} → ${catalog.tree.rootId}`);
}

console.log(`Catálogo de teste: ${catalog.tree.size} primeiros filmes de data/movies.json.`);
help();
showRoot();
input.setPrompt("filmes> ");
if (process.stdin.isTTY) input.prompt();

for await (const line of input) {
  const [command = "", ...args] = line.trim().split(/\s+/);
  const argument = args.join(" ");
  const id = parseId(args[0]);

  switch (command.toLocaleLowerCase("pt-BR")) {
    case "lista": {
      const requested = args[0] === undefined ? 10 : Number(args[0]);
      if (!Number.isSafeInteger(requested) || requested < 1 || requested > 100) {
        console.log("Use lista com um número entre 1 e 100.");
        break;
      }
      let shown = 0;
      for (const movie of catalog.tree.moviesLevelOrder()) {
        console.log(label(movie));
        if (++shown >= requested) break;
      }
      showRoot();
      break;
    }
    case "titulo": {
      if (!argument) {
        console.log("Uso: titulo <texto>");
        break;
      }
      const results = catalog.searchByTitle(argument);
      console.log(`${results.length} resultado(s):`);
      for (const movie of results.slice(0, 20)) console.log(label(movie));
      if (results.length > 20) console.log("Mostrando os primeiros 20.");
      showRoot();
      break;
    }
    case "consultar":
      if (id === undefined) console.log("Uso: consultar <id>");
      else {
        const movie = catalog.tree.peekById(id);
        console.log(movie ? `${label(movie)} | Profundidade: ${catalog.tree.depthOf(id)}` : `ID ${id} não encontrado.`);
        showRoot();
      }
      break;
    case "abrir":
    case "buscar":
      if (id === undefined) console.log(`Uso: ${command} <id>`);
      else access(id, command === "abrir" ? "abrir" : "buscar");
      break;
    case "remover":
      if (id === undefined) console.log("Uso: remover <id>");
      else {
        const movie = catalog.tree.remove(id);
        console.log(movie ? `Removido: ${label(movie)}` : `ID ${id} não encontrado.`);
        showRoot();
      }
      break;
    case "raiz":
      showRoot();
      break;
    case "reiniciar":
      catalog = await loadCatalog(dataPath, 100);
      console.log("Catálogo recarregado; contagens de abertura zeradas.");
      showRoot();
      break;
    case "ajuda":
      help();
      break;
    case "sair":
    case "exit":
      input.close();
      break;
    case "":
      break;
    default:
      console.log("Comando desconhecido. Digite ajuda.");
  }
  if (command === "sair" || command === "exit") break;
  if (process.stdin.isTTY) input.prompt();
}
