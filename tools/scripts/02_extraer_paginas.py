from pathlib import Path
import json
import re

# ==========================================
# CONFIGURACIÓN
# ==========================================

BASE = Path(__file__).resolve().parent.parent

PAGES = BASE / "output" / "pages"
SALIDA = BASE / "output" / "db" / "manual_index.json"

# ==========================================
# GENERAR ÍNDICE
# ==========================================

manual = {
    "manual": "SU-600",
    "paginas": []
}

for txt in sorted(PAGES.glob("*.txt")):

    pagina = int(re.search(r"(\d+)", txt.stem).group(1))

    texto = txt.read_text(encoding="utf-8").strip()

    manual["paginas"].append({
        "pagina": pagina,
        "reviewed": True,
        "source": "ocr",
        "image": "",
        "texto": texto
    })

# ==========================================
# GUARDAR
# ==========================================

SALIDA.parent.mkdir(parents=True, exist_ok=True)

with open(SALIDA, "w", encoding="utf-8") as f:
    json.dump(manual, f, indent=4, ensure_ascii=False)

print(f"Índice generado correctamente:\n{SALIDA}")
print(f"Páginas indexadas: {len(manual['paginas'])}")
