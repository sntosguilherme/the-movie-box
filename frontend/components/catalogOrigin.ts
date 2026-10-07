import { useSyncExternalStore } from "react";

const KEY = "catalogo:origem";

type CatalogOrigin = {
  /** Página de detalhes aberta a partir do catálogo. */
  path: string;
  /** Endereço do catálogo (com busca e filtros) de onde ela foi aberta. */
  from: string;
};

/** Registra que `path` foi aberto a partir do catálogo atual, nesta aba. */
export function rememberCatalogOrigin(path: string) {
  try {
    const origin: CatalogOrigin = { path, from: location.pathname + location.search };
    sessionStorage.setItem(KEY, JSON.stringify(origin));
  } catch {
    // Sem sessionStorage, o botão de voltar só leva ao início do catálogo.
  }
}

function readSnapshot() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

// O valor só muda por cliques nesta aba, antes de sair do catálogo; não há o que observar.
const subscribe = () => () => {};

/** Endereço do catálogo de onde `path` foi aberto nesta aba, ou `null`. No servidor é sempre `null`. */
export function useCatalogOrigin(path: string): string | null {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => null);
  if (!snapshot) return null;
  try {
    const origin = JSON.parse(snapshot) as CatalogOrigin;
    return origin.path === path ? origin.from : null;
  } catch {
    return null;
  }
}
