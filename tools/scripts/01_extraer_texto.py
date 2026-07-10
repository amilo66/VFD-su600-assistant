from pathlib import Path
import subprocess

BASE = Path(__file__).resolve().parent.parent

PDF = BASE / "input" / "VARIADOR DE FRECUENCIA SU-600.pdf"
SALIDA = BASE / "output" / "text" / "manual.txt"

SALIDA.parent.mkdir(parents=True, exist_ok=True)

print("Extrayendo texto del PDF...")

subprocess.run(
    [
        "pdftotext",
        str(PDF),
        str(SALIDA)
    ],
    check=True
)

print(f"Texto guardado en:\n{SALIDA}")
