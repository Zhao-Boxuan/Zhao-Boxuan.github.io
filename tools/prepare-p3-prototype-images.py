from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"D:\个人网站\work sample")
OUTPUT = ROOT / "public" / "images" / "projects" / "digi-tao" / "p3"

ASSETS = [
    ("Remote Chatroom.jpg", "remote-chatroom.webp", 1400, 84),
    ("Shared Cinema.jpg", "shared-cinema.webp", 1400, 84),
    ("Meditation  Prayer Space.jpg", "meditation-prayer-space.webp", 1400, 84),
    ("Simulated Home Improvement.jpg", "simulated-home-improvement.webp", 1400, 84),
    ("Augmented Public Space Co-habitation.jpg", "augmented-public-space.webp", 1600, 86),
]


def resize_to_limit(image: Image.Image, limit: int) -> Image.Image:
    if max(image.size) <= limit:
        return image.copy()
    ratio = limit / max(image.size)
    size = (round(image.width * ratio), round(image.height * ratio))
    return image.resize(size, Image.Resampling.LANCZOS)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for source_name, output_name, limit, quality in ASSETS:
        with Image.open(SOURCE / source_name) as source:
            image = resize_to_limit(source, limit)
            if "A" not in image.getbands():
                image = image.convert("RGB")
            destination = OUTPUT / output_name
            image.save(destination, "WEBP", quality=quality, method=6, exact=True)
            print(f"{output_name}: {source.size} -> {image.size}, {destination.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
