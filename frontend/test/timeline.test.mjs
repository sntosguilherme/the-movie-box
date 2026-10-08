import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import Module from "node:module";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));

// Compila os componentes reais sem adicionar um segundo bundler ao projeto.
function loadComponent(name, imports = {}) {
  const filename = path.resolve(testDirectory, "../components", `${name}.tsx`);
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const loaded = new Module(filename);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = loaded.require.bind(loaded);
  loaded.require = (id) => {
    if (Object.hasOwn(imports, id)) return imports[id];
    if (id.endsWith(".module.css")) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
    return originalRequire(id);
  };
  loaded._compile(compiled, filename);
  return loaded.exports;
}

const timeline = loadComponent("YearButtons");
const defaults = {
  years: [2000, 1999, 1990, 1989, 1980],
  selectedYear: null,
  selectedDecade: null,
  onSelectYear() {},
  onSelectDecade() {},
};
const render = (props = {}) => renderToStaticMarkup(React.createElement(timeline.default, { ...defaults, ...props }));

test("limites 0 e 9 pertencem à mesma década; a década seguinte começa em 0", () => {
  assert.equal(timeline.decadeOf(1990), 1990);
  assert.equal(timeline.decadeOf(1999), 1990);
  assert.equal(timeline.decadeOf(2000), 2000);
  const html = render({ selectedDecade: 1990 });
  assert.match(html, /aria-label="Ano 1990"/);
  assert.match(html, /aria-label="Ano 1999"/);
  assert.doesNotMatch(html, /aria-label="Ano 2000"/);
});

test("visão geral ordena décadas e omite décadas vazias e anos duplicados", () => {
  const html = render({ years: [2000, 1989, 1980, 2000] });
  const labels = [...html.matchAll(/aria-label="Década de (\d+)"/g)].map((match) => Number(match[1]));
  assert.deepEqual(labels, [1980, 2000]);
  assert.doesNotMatch(html, /aria-label="Ano /);
});

test("ano de um link direto abre a década correta e identifica o ano ativo", () => {
  const html = render({ selectedYear: 1999 });
  assert.match(html, /Anos da década de 1990/);
  assert.match(html, /aria-label="Ano 1999" aria-pressed="true"/);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /Década de 1990/);
  assert.doesNotMatch(html, /aria-label="Década de 1980"/);
});

test("catálogo vazio não cria pontos e informa o estado vazio", () => {
  const html = render({ years: [] });
  assert.match(html, /Nenhum ano disponível/);
  assert.doesNotMatch(html, /data-point/);
});

// Exercita callbacks e integração com o router sem montar o Next.js inteiro.
const hooks = {
  ...React,
  useEffect() {},
  useId: () => "timeline-test",
  useRef: (value) => ({ current: value }),
  useState: (value) => [value, () => {}],
  useTransition: () => [false, (callback) => callback()],
  useEffectEvent: (callback) => callback,
};
function find(element, predicate) {
  if (!React.isValidElement(element)) return undefined;
  if (predicate(element)) return element;
  for (const child of React.Children.toArray(element.props.children)) {
    const found = find(child, predicate);
    if (found) return found;
  }
}
const interactive = loadComponent("YearButtons", { react: hooks }).default;

test("controle do dropdown comunica e alterna o estado de expansão", () => {
  let nextState;
  const Dropdown = loadComponent("YearButtons", {
    react: { ...hooks, useState: (value) => [value, (next) => { nextState = typeof next === "function" ? next(value) : next; }] },
  }).default;
  const control = find(Dropdown(defaults), (node) => node.props["aria-controls"] && node.props.children?.[0] === "Linha do tempo do cinema");
  assert.equal(control.props["aria-expanded"], true);
  control.props.onClick();
  assert.equal(nextState, false);
});

test("clicar na década amplia seus anos; escolher ano e voltar informa os filtros corretos", () => {
  const selections = [];
  const props = { ...defaults, onSelectDecade: (value) => selections.push(["decade", value]), onSelectYear: (value) => selections.push(["year", value]) };
  find(interactive(props), (node) => node.props["aria-label"] === "Década de 1990").props.onClick();
  const expanded = interactive({ ...props, selectedDecade: 1990 });
  find(expanded, (node) => node.props["aria-label"] === "Ano 1999").props.onClick();
  const selected = interactive({ ...props, selectedYear: 1999, selectedDecade: null });
  assert.equal(find(selected, (node) => node.props["aria-label"] === "Ano 1999").props["aria-pressed"], true);
  find(selected, (node) => node.props["aria-label"] === "Voltar às décadas e mostrar todos os anos").props.onClick();
  assert.deepEqual(selections, [["decade", 1990], ["year", 1999], ["year", null]]);
});

test("setas de décadas pulam décadas vazias e respeitam os extremos", () => {
  const selections = [];
  const props = { ...defaults, years: [1980, 2000], selectedDecade: 1980, onSelectDecade: (value) => selections.push(value) };
  const first = interactive(props);
  assert.equal(find(first, (node) => node.props["aria-label"] === "Década anterior").props.disabled, true);
  find(first, (node) => node.props["aria-label"] === "Próxima década").props.onClick();
  assert.deepEqual(selections, [2000]);
  const last = interactive({ ...props, selectedDecade: 2000 });
  assert.equal(find(last, (node) => node.props["aria-label"] === "Próxima década").props.disabled, true);
});

test("teclado percorre os pontos sem alterar o filtro antes da confirmação", () => {
  const focused = [];
  let prevented = 0;
  const buttons = defaults.years.map((year) => ({
    focus: () => focused.push(year), scrollIntoView() {},
  }));
  const previousDocument = globalThis.document;
  globalThis.document = { activeElement: buttons[2] };
  try {
    const track = find(interactive(defaults), (node) => node.props.role === "group");
    for (const key of ["ArrowRight", "ArrowLeft", "Home", "End", "Enter"]) {
      track.props.onKeyDown({ key, currentTarget: { querySelectorAll: () => buttons }, preventDefault: () => prevented++ });
    }
    assert.deepEqual(focused, [1989, 1999, 2000, 1980]);
    assert.equal(prevented, 4);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});

test("seleção atualiza URL preservando título e paginação mantém o ano ativo", () => {
  const urls = [];
  const Stub = () => null;
  const CatalogBrowser = loadComponent("CatalogBrowser", {
    react: hooks,
    "next/navigation": { useRouter: () => ({ replace: (url) => urls.push(url) }) },
    "./Header": Stub, "./MovieGrid": Stub, "./SearchBar": Stub, "./DecadeStory": Stub,
    "./YearButtons": { ...timeline, default: interactive, __esModule: true },
  }).default;
  const props = { years: defaults.years, title: "Star", year: null, decade: null, nextLimit: 32, movies: [], hasMore: true };
  const filters = (overrides = {}) => find(CatalogBrowser({ ...props, ...overrides }), (node) => node.type === interactive).props;
  filters().onSelectDecade(1990);
  assert.equal(urls.at(-1), "/?titulo=Star&decada=1990");
  filters({ decade: 1990 }).onSelectYear(1999);
  assert.equal(urls.at(-1), "/?titulo=Star&ano=1999");
  const paginated = filters({ year: 1999, nextLimit: 64 });
  const html = render(paginated);
  assert.match(html, /aria-label="Ano 1999" aria-pressed="true"/);
  paginated.onSelectYear(null);
  assert.equal(urls.at(-1), "/?titulo=Star");
});
