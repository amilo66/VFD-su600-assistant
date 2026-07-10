from pathlib import Path
import fitz

# Rutas
BASE = Path(__file__).resolve().parent.parent
PDF = BASE / "input" / "VARIADOR DE FRECUENCIA SU-600.pdf"
SALIDA = BASE / "output" / "pages"

SALIDA.mkdir(parents=True, exist_ok=True)

print(f"Leyendo: {PDF}")

doc = fitz.open(PDF)

print(f"Páginas encontradas: {len(doc)}")

for numero, pagina in enumerate(doc, start=1):

    texto = pagina.get_text("text").strip()

    archivo = SALIDA / f"{numero:03}.md"

    with open(archivo, "w", encoding="utf-8") as f:

        f.write("---\n")
        f.write(f"page: {numero}\n")
        f.write("reviewed: false\n")
        f.write("source: pdf\n")
        f.write("---\n\n")

        if texto:
            f.write(texto)
        else:
            f.write("<!-- Página sin texto. Requiere OCR -->\n")

    print(f"Página {numero:03} -> {archivo.name}")

doc.close()

print("\nExtracción terminada.")
