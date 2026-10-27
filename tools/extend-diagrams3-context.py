from __future__ import annotations

import json
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image
from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SOURCE_PDF = Path(r"F:\Thesis\开始设计\diagrams3.pdf")
OSM_SOURCE = ROOT / "tmp" / "p4-map" / "context.json"
TMP_DIR = ROOT / "tmp" / "pdfs" / "diagrams3"
SOURCE_RENDER = TMP_DIR / "source-visible-300.png"
SOURCE_TRANSPARENT = TMP_DIR / "source-visible-transparent.png"
OUTPUT_PDF = ROOT / "output" / "pdf" / "diagrams3-expanded-context.pdf"

# The original drawing is an intentionally abstracted site diagram rather than a
# cadastral survey. It is rotated 180 degrees from true north: Yongning Gate is
# shown on the left and the Xiangzi Temple Street blocks extend to the right.
BBOX = (108.9307, 34.2508, 108.9448, 34.2573)
FOCUS_POLYGON = [
    (108.9328, 34.2532),
    (108.9328, 34.25445),
    (108.9355, 34.25445),
    (108.9362, 34.25465),
    (108.9398, 34.25472),
    (108.94005, 34.25528),
    (108.94205, 34.25527),
    (108.9424, 34.2549),
    (108.94238, 34.25318),
]

BUILDING_GREY = HexColor("#C9C9C7")
ROAD_GREY = HexColor("#D0D0CD")
ROAD_DARK = HexColor("#C2C2BF")
WHITE = HexColor("#FFFFFF")


def load_ways() -> list[dict]:
    data = json.loads(OSM_SOURCE.read_text(encoding="utf-8"))
    nodes = {
        item["id"]: (item["lon"], item["lat"])
        for item in data["elements"]
        if item["type"] == "node"
    }
    ways = []
    for item in data["elements"]:
        if item["type"] != "way":
            continue
        points = [nodes[node_id] for node_id in item.get("nodes", []) if node_id in nodes]
        if len(points) >= 2:
            ways.append({"points": points, "tags": item.get("tags", {})})
    return ways


def in_bbox(point: tuple[float, float]) -> bool:
    lon, lat = point
    west, south, east, north = BBOX
    return west <= lon <= east and south <= lat <= north


def way_visible(points: list[tuple[float, float]]) -> bool:
    return any(in_bbox(point) for point in points)


def point_in_polygon(point: tuple[float, float], polygon: list[tuple[float, float]]) -> bool:
    x, y = point
    inside = False
    previous = polygon[-1]
    for current in polygon:
        x1, y1 = previous
        x2, y2 = current
        if (y1 > y) != (y2 > y):
            crossing = (x2 - x1) * (y - y1) / (y2 - y1) + x1
            if x < crossing:
                inside = not inside
        previous = current
    return inside


def project(lon: float, lat: float, page_w: float, page_h: float) -> tuple[float, float]:
    west, south, east, north = BBOX
    # Longitude and latitude are both inverted to reproduce the source's 180-degree
    # rotation: east is left, and north is down on the page.
    x = 58 + (east - lon) / (east - west) * (page_w - 116)
    y = 55 + (north - lat) / (north - south) * (page_h - 140)
    return x, y


def draw_polyline(c: canvas.Canvas, points, page_w, page_h, close=False, fill=False):
    projected = [project(lon, lat, page_w, page_h) for lon, lat in points]
    if len(projected) < 2:
        return
    path = c.beginPath()
    path.moveTo(*projected[0])
    for point in projected[1:]:
        path.lineTo(*point)
    if close:
        path.close()
    c.drawPath(path, stroke=not fill, fill=fill)


def building_is_allowed(points, page_w, page_h) -> bool:
    centre = (
        sum(point[0] for point in points) / len(points),
        sum(point[1] for point in points) / len(points),
    )
    # Existing coloured building-height analysis remains untouched.
    if point_in_polygon(centre, FOCUS_POLYGON):
        return False
    x, y = project(*centre, page_w, page_h)
    # Keep the source legend and labels clear.
    if x > page_w * 0.65 and y < page_h * 0.32:
        return False
    if x > page_w * 0.73 and page_h * 0.30 < y < page_h * 0.43:
        return False
    return True


def render_visible_source():
    subprocess.run(
        [
            "pdftoppm",
            "-png",
            "-singlefile",
            "-r",
            "300",
            str(SOURCE_PDF),
            str(SOURCE_RENDER.with_suffix("")),
        ],
        check=True,
    )
    image = Image.open(SOURCE_RENDER).convert("RGBA")
    pixels = np.asarray(image).copy()
    # Remove the paper white while retaining antialiased pale-grey linework.
    paper = np.all(pixels[:, :, :3] >= 250, axis=2)
    pixels[:, :, 3] = np.where(paper, 0, 255).astype(np.uint8)
    Image.fromarray(pixels, "RGBA").save(SOURCE_TRANSPARENT, optimize=True)


def make_composite(page_w: float, page_h: float):
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    render_visible_source()
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT_PDF), pagesize=(page_w, page_h), pageCompression=1)
    c.setFillColor(WHITE)
    c.rect(0, 0, page_w, page_h, stroke=0, fill=1)
    ways = load_ways()

    road_classes = [
        ({"motorway", "trunk", "primary"}, 1.15, ROAD_DARK),
        ({"secondary", "tertiary"}, 0.85, ROAD_DARK),
        ({"residential", "unclassified", "living_street"}, 0.55, ROAD_GREY),
        ({"service"}, 0.38, ROAD_GREY),
        ({"pedestrian", "footway", "path", "steps"}, 0.30, ROAD_GREY),
    ]

    # Draw the complete street grain first so buildings read as quiet solid blocks.
    for classes, width, colour in road_classes:
        c.setStrokeColor(colour)
        c.setLineWidth(width)
        c.setLineCap(1)
        c.setLineJoin(1)
        if "pedestrian" in classes:
            c.setDash(2.0, 2.2)
        else:
            c.setDash()
        for way in ways:
            if way["tags"].get("highway") in classes and way_visible(way["points"]):
                draw_polyline(c, way["points"], page_w, page_h)

    c.setDash()
    c.setFillColor(BUILDING_GREY)
    c.setStrokeColor(BUILDING_GREY)
    for way in ways:
        points = way["points"]
        if "building" not in way["tags"] or len(points) < 4 or not way_visible(points):
            continue
        if not building_is_allowed(points, page_w, page_h):
            continue
        draw_polyline(c, points, page_w, page_h, close=True, fill=True)

    # Quiet white knockouts protect the legend and the strongest existing labels.
    c.setFillColor(WHITE)
    c.rect(page_w * 0.64, 0, page_w * 0.36, page_h * 0.31, stroke=0, fill=1)
    c.drawImage(
        ImageReader(str(SOURCE_TRANSPARENT)),
        0,
        0,
        width=page_w,
        height=page_h,
        preserveAspectRatio=False,
        mask="auto",
    )
    c.showPage()
    c.save()


def build_pdf():
    reader = PdfReader(str(SOURCE_PDF))
    if len(reader.pages) != 1:
        raise ValueError("Expected the source to contain exactly one page")
    source_page = reader.pages[0]
    page_w = float(source_page.mediabox.width)
    page_h = float(source_page.mediabox.height)
    make_composite(page_w, page_h)
    print(OUTPUT_PDF)


if __name__ == "__main__":
    build_pdf()
