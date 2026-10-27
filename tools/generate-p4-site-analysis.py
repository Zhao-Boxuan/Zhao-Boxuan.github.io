from __future__ import annotations

import json
import math
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "tmp" / "p4-map" / "context.json"
OUT = ROOT / "public" / "images" / "projects" / "digi-tao" / "p4"

INK = "#171717"
MID = "#777774"
LIGHT = "#d8d8d4"
PALE = "#ecece8"
CORAL = "#f15f4a"
TEAL = "#55d7c4"
PAPER = "#f4f4f0"

SOUTH_WALL_BLOCK = [
    (108.93255, 34.25272),
    (108.94248, 34.25272),
    (108.94248, 34.25458),
    (108.94035, 34.25458),
    (108.93935, 34.25410),
    (108.93450, 34.25405),
    (108.93255, 34.25448),
]

W = 1200
H = 820


def fmt(value: float) -> str:
    return f"{value:.2f}".rstrip("0").rstrip(".")


def load_osm():
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    nodes = {
        element["id"]: (element["lon"], element["lat"])
        for element in data["elements"]
        if element["type"] == "node"
    }
    ways = []
    for element in data["elements"]:
        if element["type"] != "way":
            continue
        points = [nodes[node_id] for node_id in element.get("nodes", []) if node_id in nodes]
        if len(points) >= 2:
            ways.append({"id": element["id"], "points": points, "tags": element.get("tags", {})})
    return ways


WAYS = load_osm()


class Projector:
    def __init__(self, bbox, x, y, width, height):
        self.west, self.south, self.east, self.north = bbox
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.lat0 = (self.south + self.north) / 2
        self.cos_lat = math.cos(math.radians(self.lat0))
        world_w = (self.east - self.west) * self.cos_lat
        world_h = self.north - self.south
        self.scale = min(width / world_w, height / world_h)
        self.draw_w = world_w * self.scale
        self.draw_h = world_h * self.scale
        self.ox = x + (width - self.draw_w) / 2
        self.oy = y + (height - self.draw_h) / 2

    def __call__(self, lon, lat):
        px = self.ox + (lon - self.west) * self.cos_lat * self.scale
        py = self.oy + (self.north - lat) * self.scale
        return px, py

    def meters(self, distance):
        degrees = distance / 110_540
        return degrees * self.scale


def way_in_bbox(points, bbox):
    west, south, east, north = bbox
    return any(west <= lon <= east and south <= lat <= north for lon, lat in points)


def path(points, projector, close=False):
    projected = [projector(*point) for point in points]
    if not projected:
        return ""
    command = f"M{fmt(projected[0][0])},{fmt(projected[0][1])}"
    command += "".join(f"L{fmt(x)},{fmt(y)}" for x, y in projected[1:])
    if close:
        command += "Z"
    return command


def paths_for(tag, bbox, projector, min_points=2):
    commands = []
    for way in WAYS:
        if tag(way["tags"]) and len(way["points"]) >= min_points and way_in_bbox(way["points"], bbox):
            closed = len(way["points"]) > 2 and way["points"][0] == way["points"][-1]
            commands.append(path(way["points"], projector, closed))
    return "".join(commands)


def svg_text(x, y, text, size=16, fill=INK, weight=400, anchor="start", family="sans", letter=0, exact_size=False):
    if not exact_size:
        size = normalize_type_size(size)
    font = "'IBM Plex Sans',Arial,sans-serif"
    return (
        f'<text x="{fmt(x)}" y="{fmt(y)}" fill="{fill}" font-family="{font}" '
        f'font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" letter-spacing="{letter}">'
        f"{escape(text)}</text>"
    )


def multiline(x, y, lines, size=16, fill=INK, weight=400, leading=1.25, anchor="start", family="sans"):
    size = normalize_type_size(size)
    font = "'IBM Plex Sans',Arial,sans-serif"
    spans = []
    for index, line in enumerate(lines):
        dy = 0 if index == 0 else size * leading
        spans.append(f'<tspan x="{fmt(x)}" dy="{fmt(dy)}">{escape(line)}</tspan>')
    return (
        f'<text x="{fmt(x)}" y="{fmt(y)}" fill="{fill}" font-family="{font}" font-size="{size}" '
        f'font-weight="{weight}" text-anchor="{anchor}">' + "".join(spans) + "</text>"
    )


def normalize_type_size(size):
    """Keep diagram typography to three legible tiers."""
    if size <= 11.5:
        return 18
    if size < 24:
        return 24
    return 38


def defs(extra=""):
    return f"""
    <defs>
      <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="3"/>
      </filter>
      {extra}
    </defs>
    """


def analysis_grid(x, y, width, height, columns=6, rows=4):
    pieces = []
    for column in range(columns + 1):
        px = x + width * column / columns
        pieces.append(f'<line x1="{fmt(px)}" y1="{fmt(y)}" x2="{fmt(px)}" y2="{fmt(y + height)}" stroke="{MID}" stroke-width="0.55" opacity="0.22"/>')
    for row in range(rows + 1):
        py = y + height * row / rows
        pieces.append(f'<line x1="{fmt(x)}" y1="{fmt(py)}" x2="{fmt(x + width)}" y2="{fmt(py)}" stroke="{MID}" stroke-width="0.55" opacity="0.22"/>')
    for column in range(columns + 1):
        px = x + width * column / columns
        for row in range(rows + 1):
            py = y + height * row / rows
            pieces.append(f'<path d="M{fmt(px - 7)} {fmt(py)}H{fmt(px + 7)}M{fmt(px)} {fmt(py - 7)}V{fmt(py + 7)}" stroke="{INK}" stroke-width="1.1"/>')
    return "".join(pieces)


def frame(code, title, subtitle, body, footer):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">
  <title id="title">{escape(title)}</title>
  <desc id="desc">{escape(subtitle)}</desc>
  {defs()}
  {svg_text(38, 32, code, 18, MID, 500, letter=1.2, exact_size=True)}
  {svg_text(38, 78, title, 27, INK, 500)}
  {svg_text(1162, 78, subtitle, 13, MID, 400, anchor='end', family='mono')}
  <line x1="38" y1="104" x2="1162" y2="104" stroke="{INK}" stroke-width="1"/>
  {body}
  <line x1="38" y1="772" x2="1162" y2="772" stroke="{INK}" stroke-width="0.7" opacity="0.55"/>
  {svg_text(38, 797, footer, 10.5, MID, 400, family='mono')}
</svg>"""


def map_layers(bbox, projector, context=False):
    buildings = paths_for(lambda t: "building" in t, bbox, projector, 3)
    primary = paths_for(lambda t: t.get("highway") in {"primary", "secondary", "tertiary", "trunk"}, bbox, projector)
    local = paths_for(lambda t: t.get("highway") in {"residential", "unclassified", "service", "living_street"}, bbox, projector)
    pedestrian = paths_for(lambda t: t.get("highway") in {"footway", "pedestrian", "path", "steps"}, bbox, projector)
    water = paths_for(lambda t: "waterway" in t or t.get("natural") == "water", bbox, projector)
    building_opacity = 0.74 if context else 0.88
    return f"""
      <path d="{buildings}" fill="{PALE}" fill-opacity="{building_opacity}" stroke="{MID}" stroke-width="0.34" stroke-opacity="0.44" fill-rule="evenodd"/>
      <path d="{local}" fill="none" stroke="{MID}" stroke-width="0.62" opacity="0.46"/>
      <path d="{pedestrian}" fill="none" stroke="{MID}" stroke-width="0.42" stroke-dasharray="3 5" opacity="0.48"/>
      <path d="{primary}" fill="none" stroke="{INK}" stroke-width="1.05" opacity="0.62"/>
      <path d="{water}" fill="none" stroke="{INK}" stroke-width="1.3" opacity="0.3"/>
    """


def point_in_polygon(point, polygon):
    x, y = point
    inside = False
    previous = polygon[-1]
    for current in polygon:
        x1, y1 = previous
        x2, y2 = current
        if (y1 > y) != (y2 > y):
            crossing_x = (x2 - x1) * (y - y1) / (y2 - y1) + x1
            if x < crossing_x:
                inside = not inside
        previous = current
    return inside


def highlighted_buildings(projector):
    commands = []
    for way in WAYS:
        if "building" not in way["tags"] or len(way["points"]) < 3:
            continue
        centre = (
            sum(point[0] for point in way["points"]) / len(way["points"]),
            sum(point[1] for point in way["points"]) / len(way["points"]),
        )
        if point_in_polygon(centre, SOUTH_WALL_BLOCK):
            commands.append(path(way["points"], projector, close=True))
    return (
        f'<path d="{"".join(commands)}" fill="{INK}" fill-opacity="0.78" '
        f'stroke="{INK}" stroke-width="1.15" stroke-linejoin="miter" fill-rule="evenodd"/>'
    )


def panel_context():
    bbox = (108.9165, 34.246, 108.9665, 34.273)
    p = Projector(bbox, 38, 124, 1124, 622)
    layers = map_layers(bbox, p, context=True)

    wall = [
        (108.9191, 34.2707), (108.9615, 34.2707), (108.9621, 34.2530),
        (108.9436, 34.25255), (108.9423, 34.25186), (108.9410, 34.25255),
        (108.9190, 34.25275), (108.9191, 34.2707),
    ]
    research = [
        (108.9328, 34.2532), (108.9328, 34.25445), (108.9355, 34.25445),
        (108.9362, 34.25465), (108.9398, 34.25472), (108.94005, 34.25528),
        (108.94205, 34.25527), (108.9424, 34.2549), (108.94238, 34.25318),
    ]
    temple = p(108.9395811, 34.2542480)
    gate = p(108.9423179, 34.2531039)
    wall_path = path(wall, p, close=True)
    research_path = path(research, p, close=True)

    bar_x, bar_y = p(108.9215, 34.2480)
    bar_1km = (1_000 / (111_320 * p.cos_lat)) * p.cos_lat * p.scale
    radius_500 = p.meters(500)
    city_label = p(108.925, 34.268)
    study_label = p(108.933, 34.2482)
    body = f"""
      <clipPath id="plot"><rect x="38" y="124" width="1124" height="622"/></clipPath>
      <g clip-path="url(#plot)">
        {analysis_grid(38, 124, 1124, 622, 6, 4)}
        {layers}
        <path d="{wall_path}" fill="none" stroke="{INK}" stroke-width="3.2" stroke-linejoin="miter"/>
        <path d="{research_path}" fill="{TEAL}" fill-opacity="0.11" stroke="{TEAL}" stroke-width="2.4" stroke-dasharray="7 6"/>
        <circle cx="{fmt(temple[0])}" cy="{fmt(temple[1])}" r="{fmt(radius_500)}" fill="none" stroke="{TEAL}" stroke-width="1.25" stroke-dasharray="5 6" opacity="0.72"/>
        <circle cx="{fmt(gate[0])}" cy="{fmt(gate[1])}" r="9" fill="{CORAL}" stroke="{PAPER}" stroke-width="3"/>
        <circle cx="{fmt(temple[0])}" cy="{fmt(temple[1])}" r="7" fill="{TEAL}" stroke="{INK}" stroke-width="1.2"/>
      </g>
      <line x1="{fmt(city_label[0])}" y1="{fmt(city_label[1] + 12)}" x2="{fmt(p(108.925, 34.2707)[0])}" y2="{fmt(p(108.925, 34.2707)[1])}" stroke="{INK}" stroke-width="1"/>
      {svg_text(city_label[0], city_label[1], 'HISTORIC CITY BOUNDARY', 13, INK, 600, letter=.8)}
      {svg_text(city_label[0], city_label[1] + 29, '13.74 km wall circuit', 12, MID, 400)}
      {svg_text(study_label[0], study_label[1], 'SOUTH-WALL STUDY AREA', 13, TEAL, 600, letter=.6)}
      {svg_text(gate[0] + 18, gate[1] + 8, 'Yongning Gate', 13, CORAL, 600)}
      {svg_text(temple[0] - 14, temple[1] - 17, 'Xiangzi Temple', 13, TEAL, 600, anchor='end')}
      <line x1="{fmt(bar_x)}" y1="{fmt(bar_y)}" x2="{fmt(bar_x + bar_1km)}" y2="{fmt(bar_y)}" stroke="{INK}" stroke-width="2.4"/>
      <line x1="{fmt(bar_x)}" y1="{fmt(bar_y - 5)}" x2="{fmt(bar_x)}" y2="{fmt(bar_y + 5)}" stroke="{INK}"/>
      <line x1="{fmt(bar_x + bar_1km)}" y1="{fmt(bar_y - 5)}" x2="{fmt(bar_x + bar_1km)}" y2="{fmt(bar_y + 5)}" stroke="{INK}"/>
      {svg_text(bar_x + bar_1km / 2, bar_y - 11, '1 km', 10, MID, 500, anchor='middle')}
      <circle cx="1127" cy="150" r="22" fill="none" stroke="{INK}" stroke-width="1"/>
      <path d="M1127 164V136M1127 136l-6 10M1127 136l6 10" fill="none" stroke="{INK}" stroke-width="1.2"/>
      {svg_text(1127, 187, 'N', 10, INK, 600, anchor='middle')}
    """
    return frame(
        "P4 / 01",
        "Historic City Context",
        "Wall · gate · temple · research area",
        body,
        "OSM contributors · Wall outline: author source map · Research area approximate",
    )


def panel_constraint():
    bbox = (108.9315, 34.25135, 108.9442, 34.2572)
    p = Projector(bbox, 38, 124, 1124, 622)
    layers = map_layers(bbox, p)
    wall_lat = 34.25262
    wall_y = p(108.936, wall_lat)[1]
    band20 = p.meters(20)
    band100 = p.meters(100)
    gate = p(108.9423179, 34.2531039)
    temple = p(108.9395811, 34.2542480)
    circle100 = p.meters(100)
    research = [
        (108.9328, 34.2532), (108.9328, 34.25445), (108.9355, 34.25445),
        (108.9362, 34.25465), (108.9398, 34.25472), (108.94005, 34.25528),
        (108.94205, 34.25527), (108.9424, 34.2549), (108.94238, 34.25318),
    ]
    research_path = path(research, p, close=True)
    dim_x = 72
    body = f"""
      <clipPath id="plot"><rect x="38" y="124" width="1124" height="622"/></clipPath>
      <g clip-path="url(#plot)">
        {analysis_grid(38, 124, 1124, 622, 6, 4)}
        <rect x="38" y="{fmt(wall_y - band100)}" width="1124" height="{fmt(band100 - band20)}" fill="{CORAL}" fill-opacity="0.08"/>
        <rect x="38" y="{fmt(wall_y - band20)}" width="1124" height="{fmt(band20)}" fill="{CORAL}" fill-opacity="0.18"/>
        {layers}
        <line x1="38" y1="{fmt(wall_y - band100)}" x2="1162" y2="{fmt(wall_y - band100)}" stroke="{CORAL}" stroke-width="1.1" stroke-dasharray="6 5"/>
        <line x1="38" y1="{fmt(wall_y - band20)}" x2="1162" y2="{fmt(wall_y - band20)}" stroke="{CORAL}" stroke-width="1.1"/>
        <path d="{research_path}" fill="{TEAL}" fill-opacity="0.09" stroke="{TEAL}" stroke-width="2.2" stroke-dasharray="7 6"/>
        <line x1="38" y1="{fmt(wall_y)}" x2="1162" y2="{fmt(wall_y)}" stroke="{INK}" stroke-width="5"/>
        <circle cx="{fmt(gate[0])}" cy="{fmt(gate[1])}" r="{fmt(circle100)}" fill="none" stroke="{CORAL}" stroke-width="1.4" stroke-dasharray="6 5"/>
        <circle cx="{fmt(gate[0])}" cy="{fmt(gate[1])}" r="8" fill="{CORAL}"/>
        <circle cx="{fmt(temple[0])}" cy="{fmt(temple[1])}" r="7" fill="{TEAL}" stroke="{INK}" stroke-width="1"/>
      </g>
      <line x1="{dim_x}" y1="{fmt(wall_y)}" x2="{dim_x}" y2="{fmt(wall_y - band100)}" stroke="{INK}" stroke-width="1"/>
      <path d="M{dim_x} {fmt(wall_y)}l-6 -11h12zM{dim_x} {fmt(wall_y - band100)}l-6 11h12z" fill="{INK}"/>
      <line x1="{dim_x - 10}" y1="{fmt(wall_y - band20)}" x2="{dim_x + 10}" y2="{fmt(wall_y - band20)}" stroke="{INK}" stroke-width="1"/>
      <line x1="52" y1="158" x2="86" y2="158" stroke="{MID}" stroke-width="1" stroke-dasharray="6 5"/>
      {svg_text(98, 164, '>100 m · stepped transition', 18, MID, 500, exact_size=True)}
      <line x1="52" y1="190" x2="86" y2="190" stroke="{CORAL}" stroke-width="1.2"/>
      {svg_text(98, 196, '20–100 m · max. 9 m', 18, CORAL, 600, exact_size=True)}
      <line x1="52" y1="222" x2="86" y2="222" stroke="{INK}" stroke-width="4"/>
      {svg_text(98, 228, '0–20 m · clear / green', 18, INK, 600, exact_size=True)}
      {svg_text(1088, wall_y + 31, 'CITY WALL', 11, INK, 600, anchor='end', letter=.7)}
      {svg_text(gate[0] - 14, gate[1] - circle100 - 13, '100 m gate radius', 11, CORAL, 600, anchor='end')}
      {svg_text(temple[0] - 13, temple[1] - 16, 'Xiangzi Temple', 12, TEAL, 600, anchor='end')}
    """
    return frame(
        "P4 / 02",
        "Protection Constraint",
        "Regulation translated into spatial bands",
        body,
        "Rule: 0–20 m clearance · ≤100 m max. 9 m · >100 m stepped transition",
    )


def panel_site():
    bbox = (108.9320, 34.2521, 108.9430, 34.2560)
    p = Projector(bbox, 38, 124, 1124, 622)
    layers = map_layers(bbox, p)
    research = [
        (108.9328, 34.2532), (108.9328, 34.25445), (108.9355, 34.25445),
        (108.9362, 34.25465), (108.9398, 34.25472), (108.94005, 34.25528),
        (108.94205, 34.25527), (108.9424, 34.2549), (108.94238, 34.25318),
    ]
    research_path = path(research, p, close=True)
    temple_way = next((way for way in WAYS if way["id"] == 258742297), None)
    temple_path = path(temple_way["points"], p, True) if temple_way else ""
    gate = p(108.9423179, 34.2531039)
    temple = p(108.9395811, 34.2542480)
    wall_y = p(108.936, 34.25262)[1]
    anchor_a = p(108.9340, 34.2539)
    anchor_b = p(108.9380, 34.25415)
    anchor_c = p(108.94115, 34.25415)
    bar_x, bar_y = p(108.9331, 34.25255)
    bar_100m = p.meters(100)
    research_anchor = p(108.9340, 34.2544)
    body = f"""
      <clipPath id="plot"><rect x="38" y="124" width="1124" height="622"/></clipPath>
      <g clip-path="url(#plot)">
        {analysis_grid(38, 124, 1124, 622, 6, 4)}
        {layers}
        <path d="{research_path}" fill="{TEAL}" fill-opacity="0.08" stroke="{TEAL}" stroke-width="2.6" stroke-dasharray="7 6"/>
        <path d="{temple_path}" fill="{TEAL}" fill-opacity="0.84" stroke="{INK}" stroke-width="1"/>
        <line x1="38" y1="{fmt(wall_y)}" x2="1162" y2="{fmt(wall_y)}" stroke="{INK}" stroke-width="5"/>
        <circle cx="{fmt(gate[0])}" cy="{fmt(gate[1])}" r="9" fill="{CORAL}"/>
        <path d="M{fmt(anchor_a[0])},{fmt(anchor_a[1])} C{fmt(anchor_b[0])},{fmt(anchor_a[1]-46)} {fmt(anchor_b[0])},{fmt(anchor_c[1]+46)} {fmt(anchor_c[0])},{fmt(anchor_c[1])}" fill="none" stroke="{CORAL}" stroke-width="1.6" stroke-dasharray="6 5"/>
        <rect x="{fmt(anchor_a[0]-5)}" y="{fmt(anchor_a[1]-5)}" width="10" height="10" fill="{INK}"/>
        <rect x="{fmt(anchor_b[0]-5)}" y="{fmt(anchor_b[1]-5)}" width="10" height="10" fill="{INK}"/>
        <rect x="{fmt(anchor_c[0]-5)}" y="{fmt(anchor_c[1]-5)}" width="10" height="10" fill="{INK}"/>
      </g>
      <line x1="{fmt(research_anchor[0])}" y1="194" x2="{fmt(research_anchor[0])}" y2="{fmt(research_anchor[1])}" stroke="{TEAL}" stroke-width="1"/>
      {svg_text(research_anchor[0], 153, 'APPROXIMATE RESEARCH EXTENT', 12, TEAL, 600, anchor='middle', letter=.6)}
      {svg_text(research_anchor[0], 185, 'Interpretive—not cadastral', 12, MID, 400, anchor='middle')}
      <line x1="52" y1="650" x2="178" y2="650" stroke="{INK}" stroke-width="1"/>
      {svg_text(52, 680, 'WALL · TEMPLE · STREET', 12, INK, 600, letter=.6)}
      {svg_text(52, 713, 'Three anchors structure the elongated site', 12, MID, 400)}
      {svg_text(temple[0], temple[1] - 24, 'Xiangzi Temple', 13, TEAL, 600, anchor='middle')}
      {svg_text(gate[0] - 24, gate[1] - 30, 'Yongning Gate', 13, CORAL, 600, anchor='end')}
      {svg_text(1090, wall_y + 34, 'SOUTH WALL', 10.5, INK, 600, anchor='end', letter=.8)}
      <line x1="{fmt(bar_x)}" y1="{fmt(bar_y)}" x2="{fmt(bar_x + bar_100m)}" y2="{fmt(bar_y)}" stroke="{INK}" stroke-width="2"/>
      {svg_text(bar_x + bar_100m / 2, bar_y - 10, '100 m', 10, MID, 500, anchor='middle')}
    """
    return frame(
        "P4 / 03",
        "Site Relationship",
        "Wall edge · temple anchor · street continuity",
        body,
        "OSM contributors · Approximate study extent: field and design drawings",
    )


def building_group(x, ground, width, floors, fill=LIGHT, stroke=INK, opacity=1, floor_h=20):
    height = floors * floor_h
    parts = [f'<rect x="{x}" y="{ground-height}" width="{width}" height="{height}" fill="{fill}" fill-opacity="{opacity}" stroke="{stroke}" stroke-width="1.2"/>']
    for floor in range(1, floors):
        y = ground - floor * floor_h
        parts.append(f'<line x1="{x}" y1="{y}" x2="{x+width}" y2="{y}" stroke="{stroke}" stroke-width="0.8" opacity="0.65"/>')
    for col in range(1, max(2, int(width / 48))):
        cx = x + col * width / max(2, int(width / 48))
        parts.append(f'<line x1="{cx}" y1="{ground-height+12}" x2="{cx}" y2="{ground-12}" stroke="{stroke}" stroke-width="0.6" opacity="0.42"/>')
    return "".join(parts)


def panel_section():
    ground = 606
    scale = 7.0
    wall_outer = 118
    wall_inner = wall_outer + 17 * scale
    wall_top_left = wall_outer + 2 * scale
    wall_top_right = wall_top_left + 13 * scale
    wall_top = ground - 12 * scale
    wall_body_top = wall_top + 8
    x20 = wall_inner + 20 * scale
    x100 = wall_inner + 100 * scale
    limit_y = ground - 9 * scale
    body = f"""
      {analysis_grid(38, 124, 1124, 622, 6, 4)}
      <line x1="38" y1="{ground}" x2="1162" y2="{ground}" stroke="{INK}" stroke-width="1.5"/>
      <path d="M{wall_outer} {ground}L{wall_inner} {ground}L{wall_top_right} {wall_body_top}L{wall_top_left} {wall_body_top}Z" fill="{INK}" fill-opacity="0.84" stroke="{INK}" stroke-width="1.2"/>
      <path d="M{wall_top_left} {wall_body_top}V{wall_top}H{wall_top_left+10}V{wall_top+5}H{wall_top_left+24}V{wall_top}H{wall_top_left+38}V{wall_top+5}H{wall_top_left+52}V{wall_top}H{wall_top_right}V{wall_body_top}" fill="none" stroke="{INK}" stroke-width="2"/>
      <rect x="{wall_inner}" y="{ground-8}" width="{x20-wall_inner}" height="8" fill="{CORAL}" fill-opacity="0.16"/>
      <path d="M{wall_inner+28} {ground}q18 -22 36 0q18 -28 36 0" fill="none" stroke="{CORAL}" stroke-width="1.5"/>
      <rect x="{x20}" y="{limit_y}" width="{x100-x20}" height="{ground-limit_y}" fill="{CORAL}" fill-opacity="0.055"/>
      <line x1="{x20}" y1="{limit_y}" x2="{x100}" y2="{limit_y}" stroke="{CORAL}" stroke-width="1.2" stroke-dasharray="6 5"/>
      {building_group(x20+18, ground, 82, 2, PALE, INK, .92, 21)}
      {building_group(x20+128, ground, 96, 3, PALE, INK, .92, 20)}
      {building_group(x20+254, ground, 88, 4, 'none', CORAL, 1, 21)}
      {building_group(x20+375, ground, 104, 3, PALE, INK, .92, 20)}
      {building_group(x20+512, ground, 90, 2, PALE, INK, .92, 21)}
      {building_group(x100+32, ground, 78, 2, PALE, INK, .88, 22)}
      {building_group(x100+132, ground, 86, 3, PALE, INK, .88, 21)}
      <path d="M{x100+10} {limit_y+2}H{x100+62}V{limit_y-22}H{x100+116}V{limit_y-46}H1150V{limit_y-74}" fill="none" stroke="{CORAL}" stroke-width="1.2"/>
      <path d="M{x20+5} {ground-22}C{x20+190} {ground-42} {x20+390} {ground-37} {x100-12} {ground-54}" fill="none" stroke="{TEAL}" stroke-width="4"/>
      <circle cx="{x20+142}" cy="{ground-36}" r="6" fill="{TEAL}"/><circle cx="{x20+338}" cy="{ground-39}" r="6" fill="{TEAL}"/><circle cx="{x100-24}" cy="{ground-53}" r="6" fill="{TEAL}"/>
      <line x1="{x20+338}" y1="438" x2="{x20+338}" y2="{ground-46}" stroke="{TEAL}" stroke-width="1"/>
      {svg_text(x20+338, 425, 'LOW-INTERVENTION DIGITAL LAYER', 18, TEAL, 600, anchor='middle', letter=.5, exact_size=True)}
      <line x1="{wall_inner}" y1="680" x2="{x20}" y2="680" stroke="{INK}" stroke-width="1"/>
      <path d="M{wall_inner} 680l10 -5v10zM{x20} 680l-10 -5v10z" fill="{INK}"/>
      {svg_text((wall_inner+x20)/2, 712, '0–20 m', 11, INK, 600, anchor='middle')}
      <line x1="{x20}" y1="680" x2="{x100}" y2="680" stroke="{INK}" stroke-width="1"/>
      <path d="M{x20} 680l10 -5v10zM{x100} 680l-10 -5v10z" fill="{INK}"/>
      {svg_text((x20+x100)/2, 712, '20–100 m', 11, INK, 600, anchor='middle')}
      <line x1="{x100-14}" y1="{limit_y}" x2="{x100-14}" y2="{ground}" stroke="{CORAL}" stroke-width="1"/>
      <path d="M{x100-14} {limit_y}l-5 10h10zM{x100-14} {ground}l-5 -10h10z" fill="{CORAL}"/>
      {svg_text(x100-28, (limit_y+ground)/2+8, '9 m', 11, CORAL, 600, anchor='end')}
      <line x1="{wall_outer-15}" y1="{wall_top}" x2="{wall_outer-15}" y2="{ground}" stroke="{INK}" stroke-width="1"/>
      <path d="M{wall_outer-15} {wall_top}l-5 10h10zM{wall_outer-15} {ground}l-5 -10h10z" fill="{INK}"/>
      {svg_text(wall_outer-26, (wall_top+ground)/2+7, '12 m', 11, INK, 600, anchor='end')}
      {svg_text((wall_outer+wall_inner)/2, wall_top-33, 'CITY WALL', 18, INK, 600, anchor='middle', letter=.65, exact_size=True)}
      {svg_text((wall_outer+wall_inner)/2, wall_top-10, '12 m high · 13 m top · 17 m base', 18, MID, 400, anchor='middle', exact_size=True)}
      {svg_text((wall_inner+x20)/2, ground-44, 'CLEAR / GREEN', 11, CORAL, 600, anchor='middle')}
      {svg_text((x20+x100)/2, limit_y-20, '9 m CONTROLLED ENVELOPE', 18, CORAL, 600, anchor='middle', letter=.45, exact_size=True)}
      {svg_text(x100+112, limit_y-94, 'STEPPED TRANSITION', 11, CORAL, 600, anchor='middle', letter=.45)}
      <line x1="{x20+298}" y1="204" x2="{x20+298}" y2="{ground-88}" stroke="{INK}" stroke-width="1"/>
      {svg_text(x20+298, 158, 'EXISTING 3–4 STOREYS', 12, INK, 600, anchor='middle', letter=.5)}
      {svg_text(x20+298, 190, 'may exceed a 9 m replacement envelope', 12, MID, 400, anchor='middle')}
    """
    return frame(
        "P4 / 04",
        "Control Section",
        "From legal distance to design implication",
        body,
        "Schematic section · Regulation distances / heights · Existing floors: field observation",
    )


def composite():
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2440 1680" role="img" aria-labelledby="title desc">
  <title id="title">P4 Xiangzi Temple District site analysis</title>
  <desc id="desc">Four diagrams showing historic city context, protection constraints, site relationships and the height-control section.</desc>
  <image href="p4-01-historic-city-context.svg" x="0" y="0" width="1200" height="820"/>
  <image href="p4-02-protection-constraint.svg" x="1240" y="0" width="1200" height="820"/>
  <image href="p4-03-site-relationship.svg" x="0" y="860" width="1200" height="820"/>
  <image href="p4-04-control-section.svg" x="1240" y="860" width="1200" height="820"/>
</svg>"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    assets = {
        "p4-01-historic-city-context.svg": panel_context(),
        "p4-02-protection-constraint.svg": panel_constraint(),
        "p4-03-site-relationship.svg": panel_site(),
        "p4-04-control-section.svg": panel_section(),
        "p4-site-analysis.svg": composite(),
    }
    for name, content in assets.items():
        (OUT / name).write_text(content, encoding="utf-8")
        print(f"wrote {name} ({len(content):,} chars)")


if __name__ == "__main__":
    main()
