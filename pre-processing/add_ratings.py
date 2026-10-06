"""Adiciona popularity, vote_average e vote_count a data/movies.json.

Fonte: movies_metadata.csv de https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset
Uso: python pre-processing/add_ratings.py caminho/movies_metadata.csv [data/movies.json]
"""

import csv
import json
import sys
from pathlib import Path


def load_metrics(csv_path: Path) -> dict[int, dict]:
    metrics: dict[int, dict] = {}
    with csv_path.open(encoding="utf-8", newline="") as file:
        for row in csv.DictReader(file):
            # Algumas linhas do CSV quebram no meio do overview: colunas deslocadas ou vazias.
            if not row["id"].isdigit() or not all(row[k] for k in ("popularity", "vote_average", "vote_count")):
                continue
            entry = {
                "popularity": float(row["popularity"]),
                "vote_average": float(row["vote_average"]),
                "vote_count": int(float(row["vote_count"])),
            }
            # IDs repetidos são capturas diferentes do mesmo filme; fica a com mais votos.
            current = metrics.get(int(row["id"]))
            key = (entry["vote_count"], entry["popularity"])
            if current is None or key > (current["vote_count"], current["popularity"]):
                metrics[int(row["id"])] = entry
    return metrics


def main() -> None:
    if len(sys.argv) not in (2, 3):
        sys.exit(__doc__)
    csv_path = Path(sys.argv[1])
    json_path = Path(sys.argv[2] if len(sys.argv) == 3 else "data/movies.json")

    metrics = load_metrics(csv_path)
    movies = json.loads(json_path.read_text(encoding="utf-8"))
    missing = [movie["id"] for movie in movies if movie["id"] not in metrics]
    if missing:
        sys.exit(f"{len(missing)} filmes sem correspondência no CSV: {missing[:10]}")
    for movie in movies:
        movie.update(metrics[movie["id"]])

    # Mesmo formato do arquivo original (sem espaços após ':' e com '\/'), para o diff mostrar só os campos novos.
    text = json.dumps(movies, indent=2, separators=(",", ":"), ensure_ascii=False)
    json_path.write_text(text.replace("/", "\\/"), encoding="utf-8")
    print(f"{len(movies)} filmes atualizados em {json_path}")


if __name__ == "__main__":
    main()
