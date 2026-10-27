from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "images" / "projects" / "truth-incubator"


ASSETS = [
    ("public/images/projects/truth-incubator/cover.jpg", "hero-interface.webp", 2800, 84),
    ("tmp/pdfs/truth-incubator-report/p2-top.png", "research/production-model.webp", 2400, 86),
    ("tmp/pdfs/truth-incubator-report/p2-middle.png", "research/content-farm-functions.webp", 2400, 86),
    ("tmp/pdfs/truth-incubator-report/p3-taxonomy.png", "research/editing-taxonomy.webp", 2400, 88),
    ("tmp/pdfs/truth-incubator-report/p3-cases.png", "research/case-matrix.webp", 1600, 88),
    ("tmp/pdfs/truth-incubator-report/p3-plan.png", "spatial/content-farm-plan.webp", 1400, 88),
    ("tmp/pdfs/truth-incubator-report/p3-storyboard.png", "spatial/storyboard.webp", 2000, 88),
    ("tmp/pdfs/truth-incubator-report/page-4.png", "spatial/film-contact-sheet.webp", 1800, 86),
    ("public/images/projects/truth-incubator/detail-01.jpg", "spatial/three-acts.webp", 1600, 86),
    ("public/images/projects/truth-incubator/detail-02.jpg", "spatial/final-sequence.webp", 1600, 86),
]


def prepare(source_name: str, output_name: str, max_width: int, quality: int) -> None:
    source = ROOT / source_name
    destination = OUTPUT / output_name
    destination.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as image:
        image = image.convert("RGB")
        if image.width > max_width:
            height = round(image.height * max_width / image.width)
            image = image.resize((max_width, height), Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=quality, method=6)
        print(f"{destination.relative_to(ROOT)}\t{image.width}x{image.height}\t{destination.stat().st_size}")


if __name__ == "__main__":
    for asset in ASSETS:
        prepare(*asset)
