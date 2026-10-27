'use client';

type SoundSource = {
  anchor?: 'start' | 'middle' | 'end';
  kind: 'strong' | 'weak';
  label: string;
  labelX: number;
  labelY: number;
  spreadX: number;
  spreadY: number;
  weight: number;
  x: number;
  y: number;
};

type Point = [number, number];

const viewWidth = 2338.8;
const viewHeight = 425.28;
const personalColor = '#ef5f43';
const sharedColor = '#21c3a1';
const middleColor = '#e4d67c';

const soundSources: SoundSource[] = [
  { kind: 'strong', label: 'Xiangzi Temple entrance', labelX: 1871, labelY: 91, spreadX: 102, spreadY: 70, weight: 1.12, x: 1852.538, y: 72.702 },
  { kind: 'strong', label: 'Q-03 / AR bus station', labelX: 1976, labelY: 108, spreadX: 108, spreadY: 78, weight: 1.08, x: 1958, y: 104.872 },
  { anchor: 'end', kind: 'strong', label: 'Urban traffic', labelX: 2297, labelY: 30, spreadX: 72, spreadY: 84, weight: 1.02, x: 2314.921, y: 34.596 },
  { kind: 'strong', label: 'Q-01 / Performance stage', labelX: 2054, labelY: 230, spreadX: 146, spreadY: 104, weight: 1.22, x: 2034.772, y: 226.851 },
  { anchor: 'end', kind: 'strong', label: 'Urban traffic', labelX: 2297, labelY: 330, spreadX: 78, spreadY: 62, weight: 1.02, x: 2314.921, y: 334.468 },
  { kind: 'weak', label: 'Outdoor plaza', labelX: 229, labelY: 224, spreadX: 75, spreadY: 53, weight: 0.44, x: 210.773, y: 228.695 },
  { kind: 'weak', label: 'Outdoor plaza', labelX: 517, labelY: 299, spreadX: 82, spreadY: 55, weight: 0.44, x: 498.702, y: 303.192 },
  { kind: 'weak', label: 'Outdoor dining', labelX: 781, labelY: 348, spreadX: 78, spreadY: 51, weight: 0.48, x: 763.081, y: 330.475 },
  { kind: 'weak', label: 'Roof terrace', labelX: 1564, labelY: 262, spreadX: 92, spreadY: 62, weight: 0.5, x: 1545.611, y: 266.425 },
  { anchor: 'end', kind: 'weak', label: 'Xiangzi Temple interior', labelX: 1748, labelY: 68, spreadX: 79, spreadY: 54, weight: 0.42, x: 1766.619, y: 72.702 },
  { anchor: 'end', kind: 'weak', label: 'Outdoor dining', labelX: 2077, labelY: 350, spreadX: 86, spreadY: 52, weight: 0.46, x: 2095.23, y: 330.475 },
];

const secondaryFields = [
  { spreadX: 56, spreadY: 38, weight: 0.2, x: -58, y: 271 },
  { spreadX: 42, spreadY: 31, weight: 0.19, x: 332, y: 164 },
  { spreadX: 48, spreadY: 36, weight: 0.17, x: 612, y: 238 },
  { spreadX: 38, spreadY: 28, weight: 0.15, x: 925, y: 280 },
  { spreadX: 53, spreadY: 38, weight: 0.2, x: 1128, y: 115 },
  { spreadX: 44, spreadY: 33, weight: 0.12, x: 1328, y: 248 },
  { spreadX: 39, spreadY: 30, weight: 0.16, x: 1645, y: 379 },
  { spreadX: 44, spreadY: 34, weight: 0.18, x: 2192, y: 181 },
] as const;

const distanceToSegment = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSquared));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
};

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const amount = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return amount * amount * (3 - 2 * amount);
};

const softRectangle = (x: number, y: number, left: number, top: number, right: number, bottom: number, softness: number) => {
  const horizontal = Math.min(x - left, right - x);
  const vertical = Math.min(y - top, bottom - y);
  return smoothstep(-softness, softness, Math.min(horizontal, vertical));
};

const fieldValue = (x: number, y: number) => {
  const warpedX = x + 10 * Math.sin(y * 0.038) + 4 * Math.sin(x * 0.019 + y * 0.021);
  const warpedY = y + 7 * Math.sin(x * 0.013) + 3 * Math.cos(x * 0.027 - y * 0.019);
  let value = soundSources.reduce((sum, source) => {
    const dx = (warpedX - source.x) / source.spreadX;
    const dy = (warpedY - source.y) / source.spreadY;
    return sum + source.weight * Math.exp(-0.5 * (dx * dx + dy * dy));
  }, 0);

  value += secondaryFields.reduce((sum, source) => {
    const dx = (warpedX - source.x) / source.spreadX;
    const dy = (warpedY - source.y) / source.spreadY;
    return sum + source.weight * Math.exp(-0.5 * (dx * dx + dy * dy));
  }, 0);

  const leftQuietBlock = softRectangle(x, y, -30, -24, 858, 181, 24);
  const centralQuietBlock = softRectangle(x, y, 926, -24, 1650, 157, 22);
  const quietAttenuation = Math.max(
    leftQuietBlock * 0.6,
    centralQuietBlock * 0.53,
  );
  value *= 1 - quietAttenuation;

  const streetStrength = 0.2 + 0.42 * Math.pow(Math.max(0, x) / viewWidth, 1.25);
  value += streetStrength * Math.exp(-0.5 * Math.pow((warpedY - 334) / 25, 2));

  const templeStreetDistance = Math.min(
    distanceToSegment(warpedX, warpedY, 1635, 113, 1370, 143),
    distanceToSegment(warpedX, warpedY, 1370, 143, 1100, 164),
    distanceToSegment(warpedX, warpedY, 1100, 164, 820, 178),
  );
  const templeStreetDecay = 0.13 + 0.34 * smoothstep(780, 1660, x);
  const templeStreetEnvelope = smoothstep(760, 860, x) * (1 - smoothstep(1610, 1705, x));
  value += templeStreetEnvelope * templeStreetDecay * Math.exp(-0.5 * Math.pow(templeStreetDistance / 17, 2));

  const branchDistance = distanceToSegment(warpedX, warpedY, 1775, 329, 1845, 145);
  value += 0.38 * Math.exp(-0.5 * Math.pow(branchDistance / 31, 2));

  const courtyardDx = (x - 1990) / 205;
  const courtyardDy = (y - 205) / 124;
  value += 0.36 * Math.exp(-0.5 * (courtyardDx * courtyardDx + courtyardDy * courtyardDy));

  // A compact core gives the performance stage its own local acoustic peak.
  // Because it is part of the same scalar field, the extra inner contours
  // follow the surrounding trend and can never cross the main contour set.
  const performanceCoreDx = (warpedX - 2050) / 46;
  const performanceCoreDy = (warpedY - 236.4) / 33;
  value += 0.24 * Math.exp(-0.5 * (performanceCoreDx * performanceCoreDx + performanceCoreDy * performanceCoreDy));

  const irregularity = 1
    + 0.045 * Math.sin(x * 0.018 + y * 0.031)
    + 0.035 * Math.sin(x * 0.009 - y * 0.043)
    + 0.02 * Math.cos(x * 0.027 + y * 0.014);

  return Math.max(0, value * irregularity);
};

const gridColumns = 330;
const gridRows = 60;
const cellWidth = viewWidth / gridColumns;
const cellHeight = viewHeight / gridRows;
const rawFieldGrid = Array.from({ length: gridRows + 1 }, (_, row) => (
  Array.from({ length: gridColumns + 1 }, (_, column) => fieldValue(column * cellWidth, row * cellHeight))
));
const fieldPeak = Math.max(...rawFieldGrid.flat());
const compressedPeak = 1 - Math.exp(-fieldPeak * 1.05);
const fieldGrid = rawFieldGrid.map((row) => row.map((value) => (
  (1 - Math.exp(-value * 1.05)) / compressedPeak
)));

const interpolateEdge = (a: Point, b: Point, valueA: number, valueB: number, level: number): Point => {
  const denominator = valueB - valueA;
  const ratio = denominator === 0 ? 0.5 : Math.max(0, Math.min(1, (level - valueA) / denominator));
  return [a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio];
};

const contourPath = (level: number) => {
  const segments: Array<[Point, Point]> = [];

  for (let row = 0; row < gridRows; row += 1) {
    for (let column = 0; column < gridColumns; column += 1) {
      const x = column * cellWidth;
      const y = row * cellHeight;
      const corners: Point[] = [
        [x, y],
        [x + cellWidth, y],
        [x + cellWidth, y + cellHeight],
        [x, y + cellHeight],
      ];
      const values = [
        fieldGrid[row][column],
        fieldGrid[row][column + 1],
        fieldGrid[row + 1][column + 1],
        fieldGrid[row + 1][column],
      ];
      const index = (values[0] >= level ? 1 : 0)
        | (values[1] >= level ? 2 : 0)
        | (values[2] >= level ? 4 : 0)
        | (values[3] >= level ? 8 : 0);

      if (index === 0 || index === 15) continue;

      const edges: Point[] = [
        interpolateEdge(corners[0], corners[1], values[0], values[1], level),
        interpolateEdge(corners[1], corners[2], values[1], values[2], level),
        interpolateEdge(corners[3], corners[2], values[3], values[2], level),
        interpolateEdge(corners[0], corners[3], values[0], values[3], level),
      ];
      const centerHigh = (values[0] + values[1] + values[2] + values[3]) / 4 >= level;
      const segmentCases: Record<number, Array<[number, number]>> = {
        1: [[3, 0]],
        2: [[0, 1]],
        3: [[3, 1]],
        4: [[1, 2]],
        5: centerHigh ? [[0, 1], [2, 3]] : [[3, 0], [1, 2]],
        6: [[0, 2]],
        7: [[3, 2]],
        8: [[2, 3]],
        9: [[0, 2]],
        10: centerHigh ? [[3, 0], [1, 2]] : [[0, 1], [2, 3]],
        11: [[1, 2]],
        12: [[3, 1]],
        13: [[0, 1]],
        14: [[3, 0]],
      };

      segmentCases[index]?.forEach(([start, end]) => {
        segments.push([edges[start], edges[end]]);
      });
    }
  }

  const pointKey = (point: Point) => `${point[0].toFixed(2)},${point[1].toFixed(2)}`;
  const adjacency = new Map<string, Array<{ end: 0 | 1; index: number }>>();

  segments.forEach((segment, index) => {
    segment.forEach((point, end) => {
      const key = pointKey(point);
      const matches = adjacency.get(key) ?? [];
      matches.push({ end: end as 0 | 1, index });
      adjacency.set(key, matches);
    });
  });

  const visited = new Set<number>();
  const polylines: Point[][] = [];

  const extend = (points: Point[], atStart: boolean) => {
    while (true) {
      const current = atStart ? points[0] : points[points.length - 1];
      const next = adjacency.get(pointKey(current))?.find(({ index }) => !visited.has(index));
      if (!next) break;
      visited.add(next.index);
      const segment = segments[next.index];
      const other = segment[next.end === 0 ? 1 : 0];
      if (atStart) points.unshift(other);
      else points.push(other);
    }
  };

  segments.forEach((segment, index) => {
    if (visited.has(index)) return;
    visited.add(index);
    const points: Point[] = [segment[0], segment[1]];
    extend(points, false);
    extend(points, true);
    polylines.push(points);
  });

  return polylines.map((points) => (
    `M ${points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')}`
  )).join(' ');
};

const hexToRgb = (hex: string) => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
] as const;

const mixColor = (start: string, end: string, amount: number) => {
  const from = hexToRgb(start);
  const to = hexToRgb(end);
  const mixed = from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
  return `rgb(${mixed.join(', ')})`;
};

const contourColor = (amount: number) => (
  amount < 0.45
    ? mixColor(sharedColor, middleColor, amount / 0.45)
    : mixColor(middleColor, personalColor, Math.pow((amount - 0.45) / 0.55, 0.82))
);

const contourLevelMin = 0.055;
const contourLevelMax = 0.9995;
// Explicit density bands keep the low cyan field calm and readable, then
// progressively add detail toward the peaks. The orange-red band deliberately
// contains most levels, so contour density communicates sound intensity too.
const makeContourBand = (start: number, end: number, count: number, peakBias = 1) => (
  Array.from({ length: count }, (_, index) => {
    const progress = index / Math.max(1, count - 1);
    const distributedProgress = 1 - Math.pow(1 - progress, peakBias);
    return start + (end - start) * distributedProgress;
  })
);
const contourLevels = [
  ...makeContourBand(contourLevelMin, 0.37, 7),
  ...makeContourBand(0.395, 0.67, 14, 1.25),
  ...makeContourBand(0.685, contourLevelMax, 42, 2.6),
];
const contours = contourLevels.map((level, index) => ({
  color: contourColor(Math.pow((level - contourLevelMin) / (contourLevelMax - contourLevelMin), 0.78)),
  d: contourPath(level),
  level,
}));

// Interleave one extra scalar-field level between the existing low/mid levels.
// These paths are revealed only around the three western peaks, so density is
// roughly doubled at each summit and fades back to the base set at the edges.
const westernPeakContourLevels = contourLevels
  .slice(0, -1)
  .map((level, index) => (level + contourLevels[index + 1]) / 2)
  .filter((level) => level <= 0.67);
const westernPeakContours = westernPeakContourLevels.map((level) => ({
  color: contourColor(Math.pow((level - contourLevelMin) / (contourLevelMax - contourLevelMin), 0.78)),
  d: contourPath(level),
  level,
}));

const leftmostPeakValues = fieldGrid
  .slice(Math.floor(130 / cellHeight), Math.ceil(335 / cellHeight) + 1)
  .flatMap((row) => row.slice(Math.floor(70 / cellWidth), Math.ceil(365 / cellWidth) + 1));
const leftmostPeakLevel = Math.max(...leftmostPeakValues);
const leftmostVisibleLevels = [...contourLevels, ...westernPeakContourLevels]
  .filter((level) => level < leftmostPeakLevel);
const leftmostHighestVisibleLevel = Math.max(...leftmostVisibleLevels);
const leftmostInnerContourLevels = Array.from({ length: 3 }, (_, index) => (
  leftmostHighestVisibleLevel
  + (leftmostPeakLevel - leftmostHighestVisibleLevel) * ((index + 1) / 4)
));
const leftmostInnerContours = leftmostInnerContourLevels.map((level) => ({
  color: contourColor(Math.pow((level - contourLevelMin) / (contourLevelMax - contourLevelMin), 0.78)),
  d: contourPath(level),
  level,
}));

const supplementalContourPageWidth = 2105.031;
const supplementalContourPageHeight = 384;
const supplementalContourPaths = [
  {
    color: '#c98938',
    d: 'M 0 0 C -8.269 1.736 -14.188 -2.383 -15.728 -7.095 C -17.242 -11.728 -18.002 -14.712 -2.323 -24.874 C 13.357 -35.037 25.061 -32.123 27.868 -29.413 C 30.675 -26.703 28.939 -15.196 21.003 -9.292 C 13.066 -3.388 7.84 -1.645 0 0 Z',
    x: 176.8344,
    y: 197.3168,
  },
  {
    color: '#d66b3e',
    d: 'M 0 0 C -5.285 1.109 -10.162 1.116 -12.335 -3.407 C -14.195 -7.276 -13.6 -8.659 -3.579 -15.155 C 6.442 -21.65 14.411 -22.475 17.49 -19.399 C 20.113 -16.779 16.402 -8.969 11.329 -5.195 C 6.257 -1.422 5.011 -1.052 0 0 Z',
    x: 183.6349,
    y: 189.6068,
  },
  {
    color: '#d75b42',
    d: 'M 0 0 C -2.746 0.576 -5.28 0.58 -6.409 -1.77 C -7.375 -3.78 -7.066 -4.499 -1.859 -7.873 C 3.347 -11.248 7.487 -11.677 9.087 -10.079 C 10.449 -8.717 8.521 -4.66 5.886 -2.699 C 3.251 -0.739 2.603 -0.546 0 0 Z',
    x: 188.3657,
    y: 182.9241,
  },
  {
    color: '#d2b238',
    d: 'M 0 0 C -9.259 1.611 -20.936 0.361 -24.894 -7.66 C -28.235 -14.431 -25.674 -18.505 -8.234 -29.809 C 9.206 -41.112 26.992 -38.544 29.872 -35.298 C 34.404 -30.191 32.617 -21.766 25.489 -13.85 C 20.626 -8.45 12.841 -2.234 0 0 Z',
    x: 176.8723,
    y: 200.7766,
  },
  {
    color: '#e7474b',
    d: 'M 0 0 C -4.334 -5.394 -1.174 -10.66 2.273 -15.351 C 5.72 -20.043 19.53 -28.986 27.645 -27.511 C 33.964 -26.362 35.479 -23.463 36.182 -19.245 C 36.629 -16.564 35.464 -9.351 23.526 -1.281 C 12.433 6.217 3.747 4.664 0 0 Z',
    x: 1812.5358,
    y: 192,
  },
  {
    color: '#e7474b',
    d: 'M 0 0 C -2.933 -3.651 -0.795 -7.216 1.538 -10.391 C 3.872 -13.567 13.22 -19.621 18.713 -18.622 C 22.991 -17.845 24.016 -15.882 24.492 -13.027 C 24.795 -11.212 24.006 -6.33 15.925 -0.867 C 8.416 4.209 2.536 3.157 0 0 Z',
    x: 1819.7676,
    y: 187.0165,
  },
  {
    color: '#8fa982',
    d: 'M 0 0 C -25.553 0.54 -46.045 -1.28 -47.377 -4.771 C -48.708 -8.263 -27.813 -11.056 -0.363 -11.288 C 27.088 -11.521 57.754 -8.726 58.431 -6.284 C 59.455 -2.59 25.19 -0.532 0 0 Z',
    x: 1050.8413,
    y: 247.6318,
  },
  {
    color: '#b4b97c',
    d: 'M 0 0 C -12.845 0.248 -23.147 -0.587 -23.816 -2.189 C -24.485 -3.79 -13.981 -5.071 -0.182 -5.178 C 13.617 -5.285 29.033 -4.002 29.373 -2.883 C 29.888 -1.188 12.663 -0.244 0 0 Z',
    x: 1051.2506,
    y: 244.5982,
  },
] as const;

const areaNotes = [
  { anchor: 'middle' as const, text: 'Quiet residential boundary', x: 420, y: 112 },
  { anchor: 'middle' as const, text: 'Quiet residential boundary', x: 1235, y: 112 },
  { anchor: 'middle' as const, text: 'Low-noise exhibition use', x: 618, y: 274 },
  { anchor: 'middle' as const, text: 'Active pedestrian sound corridor', x: 1110, y: 367 },
  { anchor: 'middle' as const, text: 'Entry plaza / concentrated public sound', x: 1990, y: 176 },
  { anchor: 'middle' as const, text: 'City wall / weak acoustic boundary', x: 1170, y: 414 },
];

export function P8SoundFieldLayer() {
  return (
    <div className="sar-p8-sound-field-layer">
      <img
        alt="Grayscale district axonometric overlaid with a contour map of public sound intensity"
        decoding="async"
        height="745"
        loading="lazy"
        src="/images/projects/digi-tao/p8/p8-layer-base-white.jpg"
        width="4096"
      />

      <svg
        aria-hidden="true"
        className="sar-p8-sound-field-svg"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      >
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="p8-sound-level-gradient"
            x1="510"
            x2="690"
            y1="32"
            y2="32"
          >
            <stop offset="0" stopColor={personalColor} />
            <stop offset="0.5" stopColor={middleColor} />
            <stop offset="1" stopColor={sharedColor} />
          </linearGradient>
          <radialGradient id="p8-western-peak-contour-fade">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.48" stopColor="#fff" />
            <stop offset="0.76" stopColor="#777" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask
            id="p8-western-peak-contour-mask"
            maskContentUnits="userSpaceOnUse"
            maskUnits="userSpaceOnUse"
            style={{ maskType: 'luminance' }}
            x="0"
            y="0"
            width={viewWidth}
            height={viewHeight}
          >
            <rect fill="#000" height={viewHeight} width={viewWidth} x="0" y="0" />
            <ellipse cx="210.773" cy="228.695" fill="url(#p8-western-peak-contour-fade)" rx="170" ry="104" />
            <ellipse cx="498.702" cy="303.192" fill="url(#p8-western-peak-contour-fade)" rx="166" ry="96" />
            <ellipse cx="763.081" cy="330.475" fill="url(#p8-western-peak-contour-fade)" rx="158" ry="88" />
          </mask>
          <mask
            id="p8-leftmost-inner-contour-mask"
            maskContentUnits="userSpaceOnUse"
            maskUnits="userSpaceOnUse"
            style={{ maskType: 'luminance' }}
            x="0"
            y="0"
            width={viewWidth}
            height={viewHeight}
          >
            <rect fill="#000" height={viewHeight} width={viewWidth} x="0" y="0" />
            <ellipse cx="210.773" cy="228.695" fill="url(#p8-western-peak-contour-fade)" rx="112" ry="74" />
          </mask>
        </defs>

        <g className="sar-p8-sound-contours">
          {contours.map((contour) => (
            <path
              d={contour.d}
              key={contour.level}
              stroke={contour.color}
              style={{ opacity: 0.56 + contour.level * 0.38 }}
            />
          ))}
          <g mask="url(#p8-western-peak-contour-mask)">
            {westernPeakContours.map((contour) => (
              <path
                d={contour.d}
                key={`western-peak-${contour.level}`}
                stroke={contour.color}
                style={{ opacity: 0.56 + contour.level * 0.38 }}
              />
            ))}
          </g>
          <g mask="url(#p8-leftmost-inner-contour-mask)">
            {leftmostInnerContours.map((contour) => (
              <path
                d={contour.d}
                key={`leftmost-inner-peak-${contour.level}`}
                stroke={contour.color}
                style={{ opacity: 0.56 + contour.level * 0.38 }}
              />
            ))}
          </g>
          <g
            className="sar-p8-sound-contour-supplements"
            transform={`translate(0 ${viewHeight}) scale(${viewWidth / supplementalContourPageWidth} ${-viewHeight / supplementalContourPageHeight})`}
          >
            {supplementalContourPaths.map((contour, index) => (
              <path
                d={contour.d}
                key={`supplemental-contour-${index}`}
                stroke={contour.color}
                style={{ opacity: 0.94 }}
                transform={`translate(${contour.x} ${contour.y})`}
              />
            ))}
          </g>
        </g>

        <g className="sar-p8-sound-sources">
          {soundSources.map((source) => (
            <g className={`sar-p8-sound-source sar-p8-sound-source--${source.kind}`} key={`${source.kind}-${source.x}-${source.y}`}>
              <circle cx={source.x} cy={source.y} r="9.25" />
              <text textAnchor={source.anchor ?? 'start'} x={source.labelX} y={source.labelY}>{source.label}</text>
            </g>
          ))}
        </g>

        <g className="sar-p8-sound-area-notes">
          {areaNotes.map((note) => (
            <text key={`${note.text}-${note.x}-${note.y}`} textAnchor={note.anchor} x={note.x} y={note.y}>{note.text}</text>
          ))}
        </g>

        <g className="sar-p8-sound-legend">
          <circle className="sar-p8-sound-legend-strong" cx="34" cy="32" r="9.25" />
          <text x="52" y="37">Strong sound source</text>
          <circle className="sar-p8-sound-legend-weak" cx="272" cy="32" r="9.25" />
          <text x="290" y="37">Weak sound source</text>
          <line className="sar-p8-sound-legend-gradient" x1="510" x2="690" y1="32" y2="32" />
          <text x="708" y="37">Public sound level / high to low</text>
        </g>
      </svg>
    </div>
  );
}
