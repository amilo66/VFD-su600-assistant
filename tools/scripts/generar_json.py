from pathlib import Path
import json
import re

BASE = Path(__file__).resolve().parent.parent

PAGINAS = BASE / "output" / "pages"
SALIDA = BASE.parent / "data" / "su600" / "parametros"

SALIDA.mkdir(parents=True, exist_ok=True)

print("Buscando parámetros...")

patron = re.compile(r"(F\d\.\d{2})")

grupos = {}

for archivo in sorted(PAGINAS.glob("*.txt")):

    texto = archivo.read_text(encoding="utf-8", errors="ignore")

    for linea in texto.splitlines():

        m = patron.search(linea)

        if not m:
            continue

        codigo = m.group(1)

        grupo = codigo.split(".")[0]

        grupos.setdefault(grupo, [])

        grupos[grupo].append({
            "codigo": codigo,
            "texto": linea.strip()
        })

for grupo, datos in grupos.items():

    with open(SALIDA / f"{grupo}.json", "w", encoding="utf-8") as f:

        json.dump(
            datos,
            f,
            indent=4,
            ensure_ascii=False
        )

print()

print("Grupos encontrados:")

for g in sorted(grupos):
    print(g, "-", len(grupos[g]), "parámetros")

print()

print("Proceso terminado.")
