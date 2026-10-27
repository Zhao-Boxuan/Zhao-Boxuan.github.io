'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type ModeId = 'personal-mobile' | 'shared-mobile' | 'personal-fixed' | 'shared-fixed';

type Point = {
  x: number;
  y: number;
};

const personalColor = '#ef5f43';
const sharedColor = '#21c3a1';

const modePoints: Record<ModeId, Point[]> = {
  'personal-mobile': [
    { x: 314.415, y: 261.435 },
    { x: 1530.835, y: 261.435 },
    { x: 1922.325, y: 261.435 },
    { x: 479.035, y: 300.665 },
    { x: 200.995, y: 226.365 },
    { x: 1850.635, y: 70.145 },
    { x: 2138.635, y: 158.415 },
  ],
  'shared-mobile': [
    { x: 513.825, y: 223.955 },
    { x: 984.44, y: 179.205 },
    { x: 1530.835, y: 177.675 },
    { x: 196.035, y: 342.825 },
    { x: 680.305, y: 342.825 },
    { x: 1459.345, y: 342.825 },
    { x: 1926.505, y: 342.825 },
    { x: 1983.455, y: 68.305 },
    { x: 2081.875, y: 65.925 },
    { x: 2185.735, y: 65.925 },
  ],
  'personal-fixed': [
    { x: 771.21, y: 281.72 },
    { x: 1435.99, y: 281.72 },
  ],
  'shared-fixed': [
    { x: 1976.76, y: 191.23 },
    { x: 1976.76, y: 238.08 },
    { x: 1710.21, y: 323.3 },
    { x: 1198.87, y: 323.3 },
    { x: 410.7, y: 323.3 },
    { x: 102.4, y: 323.3 },
    { x: 1865.31, y: 226.595 },
    { x: 2206.54, y: 226.595 },
    { x: 2090.38, y: 191.23 },
    { x: 2090.38, y: 238.08 },
  ],
};

const modeOrder: ModeId[] = [
  'personal-mobile',
  'shared-mobile',
  'personal-fixed',
  'shared-fixed',
];

const circleRadius = 11.865;
const squareSize = 22.98;
const symbolStrokeWidth = 4;
const sharedMobileRoute = 'M 2081.951 54.743 L 2081.951 51.78 C 2081.951 47.084 2078.144 43.276 2073.447 43.276 L 2012.098 43.276 C 2007.02 43.276 2002.207 45.546 1998.977 49.464 L 1959.719 97.069 C 1956.525 100.942 1952.136 103.646 1947.24 104.756 L 1700.127 160.811 C 1696.637 161.603 1693.101 162.173 1689.54 162.52 L 1521.817 178.819 C 1516.349 179.351 1510.859 179.617 1505.366 179.617 L 910.571 179.617 C 902.739 179.617 894.92 180.266 887.194 181.558 L 645.516 221.974 C 637.791 223.266 629.972 223.915 622.139 223.915 L 34.434 223.915 C 29.737 223.915 25.93 227.722 25.93 232.419 L 25.93 334.326 C 25.93 339.022 29.737 342.83 34.434 342.83 L 2177.234 342.83 C 2181.931 342.83 2185.738 339.022 2185.738 334.326 L 2185.738 73.745';

type ModeSymbolProps = {
  color: string;
  point: Point;
  shape: 'circle' | 'square';
};

function ModeSymbol({ color, point, shape }: ModeSymbolProps) {
  if (shape === 'circle') {
    return (
      <circle
        cx={point.x}
        cy={point.y}
        fill="#fff"
        r={circleRadius}
        stroke={color}
        strokeWidth={symbolStrokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    );
  }

  return (
    <rect
      fill="#fff"
      height={squareSize}
      stroke={color}
      strokeWidth={symbolStrokeWidth}
      vectorEffect="non-scaling-stroke"
      width={squareSize}
      x={point.x - squareSize / 2}
      y={point.y - squareSize / 2}
    />
  );
}

type P8ModeDistributionLayerProps = {
  active: boolean;
};

export function P8ModeDistributionLayer({ active }: P8ModeDistributionLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const modeGroups = modeOrder
      .map((mode) => layerRef.current?.querySelector<SVGGElement>(`[data-ar-mode="${mode}"]`))
      .filter((group): group is SVGGElement => Boolean(group));

    if (!active || modeGroups.length === 0) return;

    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(modeGroups, { autoAlpha: 1 });
    });

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(modeGroups, { autoAlpha: 0.3 });

      const timelines = modeGroups.map((group, index) => (
        gsap.timeline({ delay: index * 1.125, repeat: -1 })
          .to(group, { autoAlpha: 1, duration: 2.25, ease: 'sine.inOut' })
          .to(group, { autoAlpha: 1, duration: 0.75, ease: 'none' })
          .to(group, { autoAlpha: 0.3, duration: 1.5, ease: 'sine.inOut' })
      ));

      return () => timelines.forEach((timeline) => timeline.kill());
    });

    return () => media.revert();
  }, {
    dependencies: [active],
    revertOnUpdate: true,
    scope: layerRef,
  });

  return (
    <div className="sar-p8-mode-distribution-layer" ref={layerRef}>
      <img
        alt="Grayscale orthographic axonometric mapping personal and shared, mobile and fixed AR modes across the Xiangzi Temple District"
        decoding="async"
        height="745"
        loading="lazy"
        src="/images/projects/digi-tao/p8/p8-layer-base-white.jpg"
        width="4096"
      />

      <svg
        aria-hidden="true"
        className="sar-p8-mode-distribution-svg"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 2338.8 425.28"
      >
        <g className="sar-p8-mode-symbols" data-ar-mode="shared-mobile">
          <path
            className="sar-p8-shared-mobile-route"
            d={sharedMobileRoute}
            fill="none"
            stroke={sharedColor}
            strokeDasharray="10 6"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
          {modePoints['shared-mobile'].map((point, index) => (
            <ModeSymbol color={sharedColor} key={`shared-mobile-${index}`} point={point} shape="circle" />
          ))}
        </g>
        <g className="sar-p8-mode-symbols" data-ar-mode="personal-mobile">
          {modePoints['personal-mobile'].map((point, index) => (
            <ModeSymbol color={personalColor} key={`personal-mobile-${index}`} point={point} shape="circle" />
          ))}
        </g>
        <g className="sar-p8-mode-symbols" data-ar-mode="personal-fixed">
          {modePoints['personal-fixed'].map((point, index) => (
            <ModeSymbol color={personalColor} key={`personal-fixed-${index}`} point={point} shape="square" />
          ))}
        </g>
        <g className="sar-p8-mode-symbols" data-ar-mode="shared-fixed">
          {modePoints['shared-fixed'].map((point, index) => (
            <ModeSymbol color={sharedColor} key={`shared-fixed-${index}`} point={point} shape="square" />
          ))}
        </g>

        <g className="sar-p8-mode-legend">
          <ModeSymbol color={personalColor} point={{ x: 34, y: 34 }} shape="circle" />
          <text x="54" y="39">Personal - Mobile AR</text>

          <ModeSymbol color={personalColor} point={{ x: 324, y: 34 }} shape="square" />
          <text x="344" y="39">Personal - Fixed AR</text>

          <ModeSymbol color={sharedColor} point={{ x: 34, y: 66 }} shape="circle" />
          <text x="54" y="71">Shared - Mobile AR</text>

          <ModeSymbol color={sharedColor} point={{ x: 324, y: 66 }} shape="square" />
          <text x="344" y="71">Shared - Fixed AR</text>
        </g>
      </svg>
    </div>
  );
}
