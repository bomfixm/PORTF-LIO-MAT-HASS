"""Gera a narração do vídeo com voz de IA masculina (edge-tts, pt-BR-AntonioNeural).

Cada fala vira um arquivo próprio; a duração real de cada um decide o início da
seguinte (sem sobrepor) e vai para tempos.json, lido pelo diretor (legendas e
eventos na tela) e pela mixagem.

Uso: python voz/gerar_voz.py
"""
import asyncio
import json
import subprocess
from pathlib import Path

import edge_tts

AQUI = Path(__file__).parent
VOZ = "pt-BR-AntonioNeural"

# (id, texto falado, legenda na tela, início desejado em s, velocidade, tom)
# "Decalq" é escrito como se fala ("Decalque") só no texto falado.
FALAS = [
    ("f01", "Essa ideia fugiu do template.", "Essa ideia fugiu do template.", 0.70, "+4%", "-2Hz"),
    ("f02", "Cortaram a personalidade.", "Cortaram a personalidade.", 3.15, "+6%", "-2Hz"),
    ("f03", "Trocaram a cor.", "Trocaram a cor.", 4.70, "+6%", "-2Hz"),
    ("f04", "Disseram que tava pronto.", "Disseram que tava pronto.", 5.80, "+4%", "-3Hz"),
    ("f05", "A gente abriu espaço.", "A gente abriu espaço.", 8.45, "+4%", "-1Hz"),
    ("f06", "Desenhou.", "Desenhou.", 10.30, "+0%", "-1Hz"),
    ("f07", "Escreveu código.", "Escreveu código.", 11.70, "+2%", "-1Hz"),
    ("f08", "E colocou pra funcionar.", "E colocou pra funcionar.", 13.20, "+4%", "-1Hz"),
    ("f09", "Os envolvidos?", "Os envolvidos?", 19.30, "+0%", "-3Hz"),
    ("f10", "Mateus.", "Mateus.", 20.75, "+0%", "-2Hz"),
    ("f11", "Guilherme.", "Guilherme.", 21.85, "+0%", "-2Hz"),
    ("f12", "A dupla por trás da Web Decalque.", "A dupla por trás da WEB DECALQ.", 23.15, "+4%", "-2Hz"),
    ("f13", "Sua ideia também tá apertada?", "Sua ideia também tá apertada?", 27.45, "+2%", "-1Hz"),
    ("f14", "Descola do igual.", "Descola do igual.", 29.80, "+0%", "-2Hz"),
    ("f15", "Cola na Decalque.", "Cola na Decalq.", 31.00, "+0%", "-2Hz"),
]
FOLGA = 0.15  # mínimo entre o fim de uma fala e o começo da próxima


def aparar(mp3: Path, wav: Path):
    """Corta o silêncio que o edge-tts põe antes e depois da fala (deixa ~40 ms)."""
    corte = "silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.04"
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(mp3), "-af",
         f"{corte},areverse,{corte},areverse,aresample=48000", "-ac", "1", str(wav)],
        check=True,
    )


def duracao(arq: Path) -> float:
    saida = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(arq)],
        capture_output=True, text=True, check=True,
    )
    return float(saida.stdout.strip())


async def gerar():
    tempos = []
    fim_anterior = 0.0
    for ident, falado, legenda, inicio, velocidade, tom in FALAS:
        bruto = AQUI / "bruto" / f"{ident}.mp3"
        bruto.parent.mkdir(exist_ok=True)
        await edge_tts.Communicate(falado, VOZ, rate=velocidade, pitch=tom).save(str(bruto))
        arq = AQUI / f"{ident}.wav"
        aparar(bruto, arq)
        dur = duracao(arq)
        comeco = max(inicio, fim_anterior + FOLGA)
        tempos.append({"id": ident, "legenda": legenda, "inicio": round(comeco, 3), "duracao": round(dur, 3), "arquivo": arq.name})
        fim_anterior = comeco + dur
        print(f"{ident}  {comeco:6.2f}s  +{dur:5.2f}s  {legenda}")
    (AQUI / "tempos.json").write_text(json.dumps({"voz": VOZ, "falas": tempos}, ensure_ascii=False, indent=2), encoding="utf-8")
    print("tempos.json gravado; última fala termina em", round(fim_anterior, 2), "s")


asyncio.run(gerar())
