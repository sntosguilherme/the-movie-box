"""Consulta de pôsteres com cache persistente e falhas recuperáveis."""
import json
import os
import time
from pathlib import Path
from tempfile import NamedTemporaryFile

import requests
from dotenv import load_dotenv

PROCESSING_DIR = Path(__file__).resolve().parent
ROOT = PROCESSING_DIR.parent
CACHE_PATH = ROOT / "data/processed/poster_urls_cache.json"


def carregar_cache():
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    return {}


def salvar_cache(cache):
    salvar_json_atomico(CACHE_PATH, cache)


def salvar_json_atomico(destino, dados):
    """Salva JSON sem corromper o destino e tolera bloqueios breves do Windows."""
    destino.parent.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile(
        mode="w", encoding="utf-8", suffix=".tmp", prefix=f"{destino.stem}-",
        dir=destino.parent, delete=False,
    ) as arquivo:
        json.dump(dados, arquivo, ensure_ascii=False, indent=2)
        temporario = Path(arquivo.name)

    try:
        for tentativa in range(5):
            try:
                os.replace(temporario, destino)
                return
            except PermissionError:
                if tentativa == 4:
                    raise RuntimeError(
                        f"Não foi possível atualizar {destino.name}. "
                        "Feche o arquivo no editor e não execute o notebook e o script ao mesmo tempo."
                    ) from None
                time.sleep(tentativa + 1)
    finally:
        temporario.unlink(missing_ok=True)


def criar_sessao():
    load_dotenv(PROCESSING_DIR / ".env", override=True)
    token = os.getenv("TMDB_API_TOKEN", "").strip()
    if not token:
        raise ValueError("Defina TMDB_API_TOKEN em data-processing/.env.")
    sessao = requests.Session()
    sessao.headers.update({"Authorization": f"Bearer {token}"})
    return sessao


def buscar_poster_principal(tmdb_id, sessao=None, tentativas=2):
    """Timeout/conexão falha: levanta erro para permitir tentar de novo depois."""
    sessao = sessao or criar_sessao()
    for tentativa in range(tentativas):
        try:
            resposta = sessao.get(
                f"https://api.themoviedb.org/3/movie/{int(tmdb_id)}",
                timeout=(5, 15),
            )
            if resposta.status_code == 404:
                return None
            resposta.raise_for_status()
            caminho = resposta.json().get("poster_path")
            return f"https://image.tmdb.org/t/p/w500{caminho}" if caminho else None
        except requests.RequestException as erro:
            status = erro.response.status_code if erro.response is not None else None
            if status in (401, 403):
                raise RuntimeError("TMDB recusou o token. Confira o .env e recarregue a célula.") from None
            if status is not None and status < 500 and status != 429:
                raise
            if tentativa + 1 == tentativas:
                raise
            time.sleep(2 * (tentativa + 1))


def atualizar_posters(ids, limite=100):
    """Processa no máximo limite IDs pendentes. Reexecute para continuar."""
    cache = carregar_cache()
    ausentes_path = CACHE_PATH.with_name("posters_ausentes.json")
    ausentes = set(json.loads(ausentes_path.read_text(encoding="utf-8"))) if ausentes_path.exists() else set()
    # Valores nulos antigos podem ter vindo de timeouts; tente-os novamente.
    pendentes = [int(i) for i in dict.fromkeys(ids) if not cache.get(str(int(i))) and str(int(i)) not in ausentes][:limite]
    if not pendentes:
        print("Nenhum ID pendente neste lote.")
        return cache
    falhas = 0
    with criar_sessao() as sessao:
        for indice, tmdb_id in enumerate(pendentes, 1):
            try:
                url = buscar_poster_principal(tmdb_id, sessao)
                cache[str(tmdb_id)] = url
                salvar_cache(cache)
                if url is None:
                    ausentes.add(str(tmdb_id))
                    salvar_json_atomico(ausentes_path, sorted(ausentes))
                falhas = 0
                print(f"{indice}/{len(pendentes)} — ID {tmdb_id}: {'salvo' if url else 'sem pôster'}")
            except requests.RequestException as erro:
                falhas += 1
                print(f"ID {tmdb_id}: {type(erro).__name__}; poderá tentar novamente.")
                if falhas >= 3:
                    print("Três falhas consecutivas. Lote interrompido; progresso preservado.")
                    break
            time.sleep(0.15)
    return cache
