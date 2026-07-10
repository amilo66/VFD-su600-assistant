from pathlib import Path
import subprocess

# ==========================
# CONFIGURACIÓN
# ==========================

BASE = Path(__file__).resolve().parent.parent

IMAGENES = Path("/home/milo/Cosas_a_Guardar/Dropbox/Mis cosas/MANUALES/PAGINAS_VARIADOR")
SALIDA = BASE / "output" / "pages"

SALIDA.mkdir(parents=True, exist_ok=True)

# ==========================
# OCR
# ==========================

for imagen in sorted(IMAGENES.glob("pagina-*.png")):

    numero = imagen.stem.split("-")[1]
    numero3 = f"{int(numero):03}"

    txt = SALIDA / f"{numero3}.txt"
    md = SALIDA / f"{numero3}.md"

    print(f"OCR página {numero3}...")

    try:
        subprocess.run(
            [
                "tesseract",
                str(imagen),
                str(txt.with_suffix("")),
                "-l",
                "eng",
            ],
            check=True,
        )
    except subprocess.CalledProcessError:
        print(f"Error en la página {numero3}")
        continue

    # Si el .md ya existe, no lo sobrescribimos
    if md.exists():
        continue

    texto = txt.read_text(encoding="utf-8", errors="ignore")

    md.write_text(
        f"""---
page: {int(numero)}
reviewed: false
source: tesseract
image: {imagen.name}
---

{texto}
""",
        encoding="utf-8",
    )

print("\nProceso terminado.")
