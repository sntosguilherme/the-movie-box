"""Limpa o catálogo e busca os pôsteres atuais, retomando pelo cache."""
import argparse
import ast
import json

import pandas as pd

from tmdb_posters import ROOT, atualizar_posters, carregar_cache


def extrair_generos(valor):
    try:
        objetos = ast.literal_eval(valor)
        if not isinstance(objetos, list):
            return []
        return sorted({g["name"].strip() for g in objetos
                       if isinstance(g, dict) and isinstance(g.get("name"), str) and g["name"].strip()})
    except (ValueError, SyntaxError, TypeError):
        return []


def limpar_catalogo(entrada):
    colunas = ["id", "title", "overview", "genres", "release_date"]
    df = pd.read_csv(entrada, usecols=colunas, dtype="string", low_memory=False)
    total = len(df)
    df["id"] = pd.to_numeric(df["id"], errors="coerce")
    df["release_date"] = pd.to_datetime(df["release_date"], format="%Y-%m-%d", errors="coerce")
    df = df.dropna(subset=colunas).copy()
    df = df[(df["id"] > 0) & (df["id"] % 1 == 0)].copy()
    for coluna in ("title", "overview"):
        df[coluna] = df[coluna].str.strip()
        df = df[df[coluna] != ""].copy()
    df["genres"] = df["genres"].apply(extrair_generos)
    df = df[df["genres"].apply(bool)].copy()
    df["id"] = df["id"].astype("int64")
    df = df.drop_duplicates(subset="id").copy()
    df["release_date"] = df["release_date"].dt.strftime("%Y-%m-%d")
    print(f"Limpeza: {total} registros originais; {len(df)} filmes válidos.", flush=True)
    return df


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--limite", type=int, help="Máximo de consultas nesta execução (padrão: todos).")
    parser.add_argument("--sem-api", action="store_true", help="Gera o catálogo usando somente o cache existente.")
    args = parser.parse_args()
    if args.limite is not None and args.limite < 1:
        parser.error("--limite deve ser positivo")
    df = limpar_catalogo(ROOT / "data/movies_metadata.csv")
    cache = carregar_cache()
    try:
        if not args.sem_api:
            cache = atualizar_posters(df["id"], limite=args.limite)
    except KeyboardInterrupt:
        print("Interrompido. Gerando o JSON com os pôsteres já salvos.")
    except (RuntimeError, ValueError) as erro:
        print(str(erro))
    finally:
        cache = carregar_cache()
    df["poster_url"] = df["id"].apply(lambda i: cache.get(str(i)))
    pendentes_path = ROOT / "data/processed/filmes_sem_poster.json"
    saida = ROOT / "data/processed/movies.json"
    saida.parent.mkdir(parents=True, exist_ok=True)
    # Mantém os IDs excluídos registrados para acompanhamento/reprocessamento.
    ausentes_path = saida.with_name("posters_ausentes.json")
    ausentes = set(json.loads(ausentes_path.read_text(encoding="utf-8"))) if ausentes_path.exists() else set()
    sem_poster = df[df["poster_url"].isna()][["id", "title"]].copy()
    sem_poster["status"] = sem_poster["id"].apply(lambda i: "sem_poster_confirmado" if str(i) in ausentes else "consulta_pendente")
    sem_poster.to_json(pendentes_path, orient="records", force_ascii=False, indent=2)
    catalogo = df.dropna(subset=["poster_url"])
    temporario = saida.with_suffix(".tmp")
    catalogo.to_json(temporario, orient="records", force_ascii=False, indent=2)
    temporario.replace(saida)
    print(f"Salvo: {saida} ({len(catalogo)} filmes com pôster).")
    print(f"Sem URL: {len(sem_poster)} filmes registrados em {pendentes_path.name}.")


if __name__ == "__main__":
    main()
