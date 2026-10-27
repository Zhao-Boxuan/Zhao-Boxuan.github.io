import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const runtimeModules = process.env.CODEX_NODE_MODULES;
if (!runtimeModules) {
  throw new Error("CODEX_NODE_MODULES is required.");
}
const sharp = require(path.join(runtimeModules, "sharp"));

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const outputDir = path.join(projectRoot, "public", "images", "projects", "digi-tao", "p9");
const sideSource = "D:\\个人网站\\work sample\\AR眼镜_侧视图.png";
const monoSidePath = path.join(outputDir, "headset-side-view-mono.png");
const outputPath = path.join(outputDir, "headset-centre-of-mass-analysis.svg");

await fs.mkdir(outputDir, { recursive: true });

const resized = await sharp(sideSource)
  .resize({ width: 1600, withoutEnlargement: true })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < resized.data.length; i += 4) {
  const r = resized.data[i];
  const g = resized.data[i + 1];
  const b = resized.data[i + 2];
  const sourceAlpha = resized.data[i + 3] / 255;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const alpha = Math.max(0, Math.min(255, (252 - luma) * 4.1 * sourceAlpha));
  resized.data[i] = 73;
  resized.data[i + 1] = 74;
  resized.data[i + 2] = 72;
  resized.data[i + 3] = Math.round(alpha);
}

await sharp(resized.data, {
  raw: {
    width: resized.info.width,
    height: resized.info.height,
    channels: 4
  }
})
  .png({ compressionLevel: 9, palette: true })
  .toFile(monoSidePath);

const sideBase64 = (await fs.readFile(monoSidePath)).toString("base64");

const W = 3200;
const H = 1700;
const outerMargin = Math.round(120 * 0.57);
const contentRight = W - outerMargin;
const panelGap = 74;
const panelWidth = 972;
const imageWidth = panelWidth;
const imageHeight = 308;
const panelY = 310;
const imageY = 455;
const axisY = 705;
const sourceWidth = 6496;
const sourceHeight = 2174;
const sourceScale = Math.min(imageWidth / sourceWidth, imageHeight / sourceHeight);
const sourceInsetX = (imageWidth - sourceWidth * sourceScale) / 2;
const sourceInsetY = (imageHeight - sourceHeight * sourceScale) / 2;
const colors = {
  background: "#f7f7f5",
  ink: "#171817",
  muted: "#6f716e",
  line: "#b8b9b5",
  faint: "#dedfdb",
  optics: "#55519d",
  sensing: "#179c8b",
  compute: "#f79226",
  structure: "#8f908c",
  power: "#db2b35",
  com: "#087f84"
};

const panels = [
  {
    x: outerMargin,
    code: "A",
    title: "INTERNAL REAR POWER",
    subtitle: "Reference architecture · built-in battery retained as rear mass",
    mass: "500–620 g",
    massNote: "566 g published reference",
    com: "+0.02–0.06 L",
    moment: "0.02–0.07",
    comShift: 37,
    comRange: 44,
    computeShift: 0,
    powerOnHead: true,
    allocation: [22, 8, 21, 31, 18],
    takeaway1: "Rear power offsets the front optics,",
    takeaway2: "but the whole system mass remains on the head."
  },
  {
    x: outerMargin + panelWidth + panelGap,
    code: "B",
    title: "EXTERNAL POWER",
    subtitle: "Current proposal · battery removed from the head",
    mass: "330–430 g",
    massNote: "estimated design range",
    com: "+0.08–0.14 L",
    moment: "0.05–0.11",
    comShift: 101,
    comRange: 64,
    computeShift: 0,
    powerOnHead: false,
    allocation: [29, 10, 25, 33, 3],
    takeaway1: "Head-borne mass falls, while the estimated",
    takeaway2: "centre of mass becomes more anterior."
  },
  {
    x: outerMargin + (panelWidth + panelGap) * 2,
    code: "C",
    title: "REBALANCED EXTERNAL POWER",
    subtitle: "Sensitivity scenario · compute and support shifted posterior",
    mass: "340–440 g",
    massNote: "estimated design range",
    com: "+0.03–0.07 L",
    moment: "0.02–0.05",
    comShift: 46,
    comRange: 46,
    computeShift: 115,
    powerOnHead: false,
    allocation: [27, 9, 24, 37, 3],
    takeaway1: "A small posterior redistribution reduces the",
    takeaway2: "lever arm without returning the battery to the head."
  }
];

function text(x, y, value, className, anchor = "start") {
  const escapedValue = String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
  return "<text x=\"" + x + "\" y=\"" + y + "\" class=\"" + className + "\" text-anchor=\"" + anchor + "\">" + escapedValue + "</text>";
}

function line(x1, y1, x2, y2, className, extra = "") {
  return "<line x1=\"" + x1 + "\" y1=\"" + y1 + "\" x2=\"" + x2 + "\" y2=\"" + y2 + "\" class=\"" + className + "\" " + extra + "/>";
}

function rect(x, y, width, height, fill, opacity = 1, radius = 0) {
  return "<rect x=\"" + x + "\" y=\"" + y + "\" width=\"" + width + "\" height=\"" + height + "\" rx=\"" + radius + "\" fill=\"" + fill + "\" opacity=\"" + opacity + "\"/>";
}

function polygon(points, fill, fillOpacity = 0.2, stroke = fill, strokeOpacity = 0.92, strokeWidth = 3) {
  const pointString = points.map(([x, y]) => x + "," + y).join(" ");
  return "<polygon points=\"" + pointString + "\" fill=\"" + fill + "\" fill-opacity=\"" + fillOpacity + "\" stroke=\"" + stroke + "\" stroke-opacity=\"" + strokeOpacity + "\" stroke-width=\"" + strokeWidth + "\" stroke-linejoin=\"miter\"/>";
}

function sourcePolygon(panelX, points, fill, fillOpacity = 0.2, stroke = fill, strokeOpacity = 0.92, strokeWidth = 3) {
  return polygon(points.map(([sourceX, sourceY]) => [
    panelX + sourceInsetX + sourceX * sourceScale,
    imageY + sourceInsetY + sourceY * sourceScale
  ]), fill, fillOpacity, stroke, strokeOpacity, strokeWidth);
}

function sourceOutline(panelX, points, stroke, strokeWidth = 6) {
  const mapped = points.map(([sourceX, sourceY]) => [
    panelX + sourceInsetX + sourceX * sourceScale,
    imageY + sourceInsetY + sourceY * sourceScale
  ]);
  return polygon(mapped, "none", 0, stroke, 1, strokeWidth);
}

function allocationBar(panel) {
  const y = 1085;
  let x = panel.x;
  const output = [];
  const fills = [colors.optics, colors.sensing, colors.compute, colors.structure, colors.power];
  for (let i = 0; i < panel.allocation.length; i += 1) {
    const width = panelWidth * panel.allocation[i] / 100;
    output.push(rect(x, y, width, 28, fills[i], i === 3 ? 0.72 : 0.9));
    x += width;
  }
  return output.join("\n");
}

function panelMarkup(panel) {
  const x = panel.x;
  const pivotX = x + imageWidth * 0.58;
  const comX = pivotX - panel.comShift;
  const comY = 615;
  const out = [];

  out.push(text(x, panelY + 18, panel.code, "panel-code"));
  out.push(text(x + 58, panelY + 18, panel.title, "panel-title"));
  out.push(text(x + 58, panelY + 58, panel.subtitle, "panel-subtitle"));

  out.push("<image href=\"data:image/png;base64," + sideBase64 + "\" x=\"" + x + "\" y=\"" + imageY + "\" width=\"" + imageWidth + "\" height=\"" + imageHeight + "\" preserveAspectRatio=\"xMidYMid meet\" opacity=\"0.72\"/>");

  const maskId = "device-silhouette-" + panel.code;
  const opticsRegion = [
    [470, 780], [480, 710], [490, 658], [505, 595], [520, 545],
    [540, 520], [560, 506], [600, 470], [650, 418], [700, 380],
    [720, 371], [900, 369], [1200, 369], [1500, 367], [1800, 364],
    [1810, 585], [1900, 605], [2100, 625], [2300, 645], [2500, 665],
    [2700, 685], [2900, 705], [3100, 725], [3250, 750], [3350, 790],
    [3420, 860], [3460, 940], [3470, 1010], [3450, 1070], [3420, 1093],
    [3400, 1097], [3300, 1115], [3200, 1134], [3100, 1154], [3000, 1175],
    [2900, 1195], [2800, 1216], [2700, 1237], [2600, 1258], [2500, 1281],
    [2400, 1305], [2300, 1330], [2200, 1354], [2100, 1379], [2000, 1402],
    [1900, 1428], [1800, 1457], [1700, 1485], [1600, 1511], [1500, 1540],
    [1400, 1570], [1300, 1601], [1200, 1631], [1100, 1658], [1000, 1679],
    [900, 1694], [800, 1702], [720, 1708], [650, 1709], [600, 1708],
    [560, 1705], [540, 1688], [520, 1660], [505, 1610], [490, 1556],
    [480, 1485], [470, 1398], [465, 1250], [465, 1050], [465, 850]
  ];
  const sensingRegion = [
    [2120, 420], [2160, 370], [2750, 370], [2780, 455], [2750, 550],
    [2510, 585], [2180, 575], [2120, 520]
  ];
  const lowerStructureRegion = [
    [2050, 1600], [2200, 1540], [2600, 1490], [3250, 1450], [3800, 1440],
    [3970, 1490], [4020, 1590], [4020, 1760], [3930, 1815], [3500, 1835],
    [2800, 1840], [2250, 1810], [2050, 1750]
  ];
  const upperStructureRegion = [
    [500, 545], [1690, 545], [1740, 565], [1700, 610], [540, 610], [480, 585]
  ];
  const powerRegion = [
    [4700, 487], [4750, 483], [4800, 498], [4900, 526], [5000, 555],
    [5100, 584], [5200, 613], [5300, 654], [5400, 680], [5500, 705],
    [5600, 731], [5700, 756], [5800, 782], [5900, 807], [6000, 833],
    [6100, 858], [6140, 868], [6160, 874], [6168, 885], [6166, 905],
    [6160, 922], [6150, 955], [6140, 962], [6100, 954], [6000, 929],
    [5900, 903], [5800, 878], [5700, 852], [5600, 827], [5500, 801],
    [5400, 776], [5300, 750], [5250, 737], [5200, 766], [5100, 746],
    [5000, 726], [4900, 706], [4800, 686], [4750, 675], [4700, 650]
  ];
  const computeRegion = panel.computeShift > 0 ? [
    [3420, 319], [3600, 320], [3740, 325], [3820, 330], [3970, 334],
    [4050, 340], [4120, 350], [4175, 360], [4210, 380], [4305, 400],
    [4400, 425], [4500, 435], [4560, 450], [4655, 475], [4700, 487],
    [4710, 520], [4710, 575], [4705, 625], [4695, 650], [4702, 675],
    [4707, 700], [4711, 725], [4713, 750], [4712, 800], [4704, 850],
    [4688, 900], [4670, 950], [4653, 1000], [4600, 1010], [4520, 1000],
    [4440, 960], [4360, 920], [4280, 880], [4200, 840], [4100, 800],
    [3980, 765], [3850, 740], [3700, 720], [3550, 700], [3420, 680]
  ] : [
    [2700, 319], [3000, 319], [3300, 319], [3500, 319], [3600, 320],
    [3740, 325], [3820, 330], [3970, 334], [4050, 340], [4120, 350],
    [4175, 360], [4210, 380], [4305, 400], [4400, 425], [4500, 435],
    [4560, 450], [4655, 475], [4700, 487], [4710, 520], [4710, 575],
    [4705, 625], [4695, 650], [4702, 675], [4707, 700], [4711, 725],
    [4713, 750], [4600, 750], [4500, 750], [4400, 745], [4300, 740],
    [4100, 735], [3900, 730], [3700, 720], [3500, 710], [3300, 700],
    [3100, 690], [2900, 675], [2700, 660]
  ];

  out.push("<mask id=\"" + maskId + "\" maskUnits=\"userSpaceOnUse\" x=\"" + x + "\" y=\"" + imageY + "\" width=\"" + imageWidth + "\" height=\"" + imageHeight + "\" style=\"mask-type:alpha\"><image href=\"data:image/png;base64," + sideBase64 + "\" x=\"" + x + "\" y=\"" + imageY + "\" width=\"" + imageWidth + "\" height=\"" + imageHeight + "\" preserveAspectRatio=\"xMidYMid meet\"/></mask>");
  out.push("<g mask=\"url(#" + maskId + ")\">");

  // Each region is traced from the product side-view itself. The external edges
  // follow the visor, upper housing, lower support and posterior arm; shared
  // boundaries mark the inferred module split rather than a generic envelope.
  out.push(sourcePolygon(x, opticsRegion, colors.optics, 0.22, colors.optics, 0, 0));
  out.push(sourcePolygon(x, sensingRegion, colors.sensing, 0.28, colors.sensing, 0, 0));
  out.push(sourcePolygon(x, computeRegion, colors.compute, 0.24, colors.compute, 0, 0));
  out.push(sourcePolygon(x, lowerStructureRegion, colors.structure, 0.2, colors.structure, 0, 0));
  out.push(sourcePolygon(x, upperStructureRegion, colors.structure, 0.2, colors.structure, 0, 0));

  if (panel.powerOnHead) {
    out.push(sourcePolygon(x, powerRegion, colors.power, 0.26, colors.power, 0, 0));
  }
  out.push("</g>");

  // Keep the boundaries independent from the raster silhouette mask so their
  // full vector stroke remains visible along every external and internal edge.
  out.push(sourceOutline(x, opticsRegion, colors.optics));
  out.push(sourceOutline(x, sensingRegion, colors.sensing));
  out.push(sourceOutline(x, computeRegion, colors.compute));
  out.push(sourceOutline(x, lowerStructureRegion, colors.structure));
  out.push(sourceOutline(x, upperStructureRegion, colors.structure));
  if (panel.powerOnHead) {
    out.push(sourceOutline(x, powerRegion, colors.power));
  }

  if (!panel.powerOnHead) {
    out.push(line(x + 790, 550, x + 840, 645, "cable"));
    out.push(polygon([
      [x + 774, 638], [x + 870, 638], [x + 888, 653], [x + 884, 700],
      [x + 781, 700], [x + 768, 683]
    ], colors.power, 0.22, colors.power, 0.96, 4.8));
    out.push(text(x + 832, 675, "OFF-HEAD", "battery-label", "middle"));
  }

  out.push(line(x + 10, axisY, x + imageWidth - 10, axisY, "axis"));
  out.push(text(x + 10, axisY + 42, "ANTERIOR +", "axis-label"));
  out.push(text(x + imageWidth - 10, axisY + 42, "POSTERIOR −", "axis-label", "end"));
  out.push(line(pivotX, axisY - 52, pivotX, axisY + 18, "origin-guide"));
  out.push("<circle cx=\"" + pivotX + "\" cy=\"" + axisY + "\" r=\"10\" fill=\"" + colors.background + "\" stroke=\"" + colors.ink + "\" stroke-width=\"4\"/>");
  out.push(text(pivotX + 18, axisY - 14, "O · ear-centre proxy", "origin-label"));

  out.push(polygon([
    [comX - panel.comRange, comY - 23], [comX + panel.comRange - 12, comY - 23],
    [comX + panel.comRange, comY - 10], [comX + panel.comRange, comY + 10],
    [comX + panel.comRange - 12, comY + 23], [comX - panel.comRange, comY + 23],
    [comX - panel.comRange - 10, comY]
  ], colors.com, 0.2, colors.com, 0.98, 3.6));
  out.push(polygon([
    [comX, comY - 9], [comX + 9, comY], [comX, comY + 9], [comX - 9, comY]
  ], colors.com, 1, colors.com, 1, 0));
  out.push(line(comX, comY + 36, comX, axisY, "com-guide"));
  out.push(line(comX, axisY - 15, pivotX, axisY - 15, "lever", "marker-end=\"url(#arrow)\""));
  out.push(text(comX, comY - 53, "ESTIMATED COM RANGE", "com-label", "middle"));
  out.push(text((comX + pivotX) / 2, axisY - 29, "horizontal lever arm", "lever-label", "middle"));

  out.push(text(x, 810, "ESTIMATED OUTPUT", "metric-kicker"));
  out.push(text(x, 862, "HEAD-BORNE MASS", "metric-label"));
  out.push(text(x + 280, 866, panel.mass, "metric-value"));
  out.push(text(x + 280, 898, panel.massNote, "metric-note"));
  out.push(line(x, 920, x + panelWidth, 920, "metric-rule"));
  out.push(text(x, 958, "xCOM / L", "metric-label"));
  out.push(text(x, 1004, panel.com, "metric-value"));
  out.push(text(x + 540, 958, "RELATIVE MOMENT M*", "metric-label"));
  out.push(text(x + panelWidth, 1004, panel.moment, "metric-value", "end"));

  out.push(text(x, 1052, "ILLUSTRATIVE MASS ALLOCATION · NOT MEASURED", "metric-kicker"));
  out.push(allocationBar(panel));
  out.push(text(x, 1172, panel.takeaway1, "takeaway"));
  out.push(text(x, 1210, panel.takeaway2, "takeaway"));

  return out.join("\n");
}

const svg = [];
svg.push("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + W + "\" height=\"" + H + "\" viewBox=\"0 0 " + W + " " + H + "\">");
svg.push("<defs>");
svg.push("<marker id=\"arrow\" markerWidth=\"12\" markerHeight=\"12\" refX=\"10\" refY=\"6\" orient=\"auto\"><path d=\"M0,0 L12,6 L0,12 z\" fill=\"" + colors.com + "\"/></marker>");
svg.push("<style><![CDATA[");
svg.push("text{font-family:Arial,'Helvetica Neue','PingFang SC',sans-serif;fill:" + colors.ink + ";font-weight:400;}");
svg.push(".panel-code,.metric-kicker,.axis-label,.battery-label{font-family:'Courier New','Nimbus Mono PS',Consolas,monospace;letter-spacing:0.04em;}");
svg.push(".title{font-size:76px;font-weight:400;letter-spacing:-2.5px;}");
svg.push(".subtitle{font-size:30px;fill:" + colors.muted + ";}");
svg.push(".legend{font-size:24px;fill:" + colors.muted + ";}");
svg.push(".panel-code{font-size:30px;font-weight:500;fill:" + colors.com + ";}");
svg.push(".panel-title{font-size:34px;font-weight:500;letter-spacing:-0.02em;}");
svg.push(".panel-subtitle{font-size:23px;fill:" + colors.muted + ";}");
svg.push(".panel-separator{stroke:" + colors.line + ";stroke-width:2;}");
svg.push(".axis{stroke:" + colors.line + ";stroke-width:2;}");
svg.push(".axis-label{font-size:20px;fill:" + colors.muted + ";}");
svg.push(".origin-guide{stroke:" + colors.ink + ";stroke-width:2;stroke-dasharray:8 8;}");
svg.push(".origin-label{font-size:22px;fill:" + colors.muted + ";}");
svg.push(".com-guide{stroke:" + colors.com + ";stroke-width:2;stroke-dasharray:8 8;}");
svg.push(".lever{stroke:" + colors.com + ";stroke-width:4;}");
svg.push(".com-label{font-size:21px;font-weight:500;fill:" + colors.com + ";letter-spacing:0.04em;}");
svg.push(".lever-label{font-size:19px;fill:" + colors.com + ";}");
svg.push(".cable{stroke:" + colors.power + ";stroke-width:3;stroke-dasharray:9 8;}");
svg.push(".battery-label{font-size:16px;font-weight:500;fill:" + colors.power + ";}");
svg.push(".metric-kicker{font-size:20px;font-weight:500;fill:" + colors.muted + ";}");
svg.push(".metric-label{font-size:23px;fill:" + colors.muted + ";}");
svg.push(".metric-value{font-size:39px;font-weight:400;font-variant-numeric:tabular-nums;}");
svg.push(".metric-note{font-size:19px;fill:" + colors.muted + ";}");
svg.push(".metric-rule{stroke:" + colors.faint + ";stroke-width:2;}");
svg.push(".takeaway{font-size:26px;}");
svg.push(".bottom-heading{font-family:'Courier New','Nimbus Mono PS',Consolas,monospace;font-size:22px;font-weight:500;letter-spacing:0.04em;fill:" + colors.muted + ";}");
svg.push(".bottom-copy{font-size:25px;}");
svg.push(".formula{font-family:'Courier New','Nimbus Mono PS',Consolas,monospace;font-size:34px;font-variant-numeric:tabular-nums;}");
svg.push(".source{font-size:19px;fill:" + colors.muted + ";}");
svg.push("]]></style>");
svg.push("</defs>");
svg.push(rect(0, 0, W, H, colors.background));

svg.push(text(outerMargin, 124, "Centre of Mass under Three Layout Scenarios", "title"));
svg.push(text(outerMargin, 180, "Neutral posture · side-view estimate · head-borne and body-borne mass reported separately", "subtitle"));

const topLegendX = 2480;
svg.push(rect(topLegendX, 55, 20, 20, colors.ink));
svg.push(text(topLegendX + 35, 73, "published whole-device specification", "legend"));
svg.push(line(topLegendX, 107, topLegendX + 22, 107, "origin-guide"));
svg.push(text(topLegendX + 35, 116, "position inferred from 09-B / 09-C", "legend"));
svg.push(polygon([
  [topLegendX, 146], [topLegendX + 27, 146], [topLegendX + 36, 157],
  [topLegendX + 27, 168], [topLegendX, 168], [topLegendX - 7, 157]
], colors.com, 0.2, colors.com, 0.98, 2));
svg.push(text(topLegendX + 48, 165, "estimated range / derived result", "legend"));

svg.push(line(panels[0].x + panelWidth + panelGap / 2, 295, panels[0].x + panelWidth + panelGap / 2, 1285, "panel-separator"));
svg.push(line(panels[1].x + panelWidth + panelGap / 2, 295, panels[1].x + panelWidth + panelGap / 2, 1285, "panel-separator"));
for (const panel of panels) {
  svg.push(panelMarkup(panel));
}

const legendY = 1260;
let legendX = outerMargin;
const legendItems = [
  [colors.optics, "optics + display"],
  [colors.sensing, "sensing"],
  [colors.compute, "compute + thermal"],
  [colors.structure, "structure + fit + audio"],
  [colors.power, "power / connector"]
];
for (const item of legendItems) {
  svg.push(rect(legendX, legendY, 24, 24, item[0], item[0] === colors.structure ? 0.72 : 0.9));
  svg.push(text(legendX + 38, legendY + 21, item[1], "legend"));
  legendX += item[1].length * 14 + 92;
}

svg.push(line(outerMargin, 1328, contentRight, 1328, "panel-separator"));
svg.push(text(outerMargin, 1380, "HOW TO READ", "bottom-heading"));
svg.push(text(outerMargin, 1425, "Known: published total masses and system architecture.", "bottom-copy"));
svg.push(text(outerMargin, 1468, "Inferred: module positions from 09-B and 09-C.", "bottom-copy"));
svg.push(text(outerMargin, 1511, "Estimated: module mass ranges, COM envelope and M*.", "bottom-copy"));

svg.push(text(1190, 1380, "CALCULATION", "bottom-heading"));
svg.push(text(1190, 1433, "rCOM = Σ(mi ri) / Σmi", "formula"));
svg.push(text(1190, 1490, "M* = (mhead / 566 g) × |xCOM| / L", "formula"));
svg.push(text(1190, 1535, "Dimensionless comparison; not a measured neck torque.", "source"));

svg.push(text(2200, 1380, "DESIGN IMPLICATION", "bottom-heading"));
svg.push(text(2200, 1425, "External power reduces head-borne mass but also", "bottom-copy"));
svg.push(text(2200, 1468, "removes rear counterweight. Posterior redistribution", "bottom-copy"));
svg.push(text(2200, 1511, "is required to reduce both mass and static moment.", "bottom-copy"));

svg.push(text(outerMargin, 1605, "Indicative design estimate, not a measured ergonomic result. Module-level masses are not publicly disclosed; values are shown as ranges. Body-worn power is excluded from head-borne COM.", "source"));
svg.push(text(outerMargin, 1642, "Reference anchors: Microsoft HoloLens 2 hardware; Magic Leap 2 Operations Manual; Apple Vision Pro Tech Specs; Chihara & Seo (2018); Astrologo et al. (2024).", "source"));
svg.push("</svg>");

await fs.writeFile(outputPath, svg.join("\n"), "utf8");

await fs.unlink(monoSidePath);

console.log(JSON.stringify({
  output: outputPath,
  width: W,
  height: H
}, null, 2));
