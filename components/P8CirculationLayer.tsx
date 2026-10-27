'use client';

import { type CSSProperties, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import circulationVectors from '@/data/p8-circulation-vectors.json';

gsap.registerPlugin(useGSAP);

type VectorPath = {
  d: string;
  paint: 'stroke' | 'fill' | 'both';
  width: number;
  dash: number[];
  bbox: [number, number, number, number];
  start: [number, number] | null;
  end: [number, number] | null;
  commands: number;
};

type CirculationData = {
  viewBox: [number, number, number, number];
  bus: VectorPath[];
  people: VectorPath[];
};

const data = circulationVectors as unknown as CirculationData;
const routeOrigin: [number, number] = [2326.291, 349.149];
const peopleColor = '#ef5f43';
const busColor = '#21c3a1';
const flowStartDelay = 0.46;
const peopleFlowPeriod = 404;
const peopleSoftLength = 112;
const peopleCoreLength = 44;
const busFlowPeriod = 432;
const busFlowDuration = 3;
const busSoftLength = 186;
const busCoreLength = 72;
const flowGradientOpacities = [0.1, 0.11, 0.12, 0.14, 0.16, 0.2, 0.26, 0.36, 0.72] as const;
const emphasizedEndpoints = [
  { x: 2081.95, y: 65.745, color: busColor, key: 'bus-boarding' },
  { x: 2185.739, y: 65.745, color: busColor, key: 'bus-alighting' },
  { x: 2326.292, y: 349.149, color: peopleColor, key: 'people-origin' },
] as const;

const distanceToOrigin = (point: [number, number] | null) => {
  if (!point) return Number.POSITIVE_INFINITY;
  return Math.hypot(point[0] - routeOrigin[0], point[1] - routeOrigin[1]);
};

const isOutdoorFlowPath = (path: VectorPath) => {
  if (path.paint === 'fill' || path.dash.length > 0) return false;
  const width = path.bbox[2] - path.bbox[0];
  const height = path.bbox[3] - path.bbox[1];
  return Math.max(width, height) > 45;
};

const styleFor = (path: VectorPath, color: string, strokeWidth = path.width) => ({
  fill: path.paint === 'fill' || path.paint === 'both' ? color : 'none',
  stroke: path.paint === 'stroke' || path.paint === 'both' ? color : 'none',
  strokeDasharray: path.dash.length > 0 ? path.dash.join(' ') : undefined,
  strokeWidth,
});

const gradientLayers = (outerLength: number, coreLength: number) => (
  flowGradientOpacities.map((opacity, index) => ({
    length: outerLength - ((outerLength - coreLength) * index) / (flowGradientOpacities.length - 1),
    opacity,
  }))
);

type P8CirculationLayerProps = {
  active: boolean;
};

export function P8CirculationLayer({ active }: P8CirculationLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const outdoorFlows = data.people.filter(isOutdoorFlowPath);
  const busRoute = data.bus[0];

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (!active) return;

      const flowHighlights = gsap.utils.toArray<SVGGElement>('[data-flow-highlight]');

      flowHighlights.forEach((group) => {
        const direction = group.dataset.direction === 'reverse' ? 1 : -1;
        const phase = Number(group.dataset.phase ?? 0);
        const period = Number(group.dataset.period ?? 404);
        const duration = Number(group.dataset.duration ?? 8.2);
        gsap.fromTo(group, { '--flow-offset': `${phase}px` }, {
          '--flow-offset': `${phase + direction * period}px`,
          delay: flowStartDelay,
          duration,
          ease: 'none',
          repeat: -1,
        });
      });

      gsap.fromTo('.sar-p8-endpoint-halo', {
        attr: { r: 12.58 },
        opacity: 0.24,
      }, {
        attr: { r: 17.34 },
        delay: flowStartDelay,
        duration: 2.4,
        ease: 'sine.inOut',
        opacity: 0.68,
        repeat: -1,
        stagger: 0.28,
        yoyo: true,
      });
    });

    return () => media.revert();
  }, {
    dependencies: [active],
    revertOnUpdate: true,
    scope: layerRef,
  });

  return (
    <div className="sar-p8-circulation-layer" ref={layerRef}>
      <img
        alt="Grayscale orthographic axonometric showing visitor circulation and the AR bus route across the Xiangzi Temple District"
        decoding="async"
        height="745"
        loading="lazy"
        src="/images/projects/digi-tao/p8/p8-layer-base-white.jpg"
        width="4096"
      />

      <svg
        aria-hidden="true"
        className="sar-p8-circulation-svg"
        preserveAspectRatio="xMidYMid meet"
        viewBox={data.viewBox.join(' ')}
      >
        <defs>
          <filter id="p8-endpoint-glow" height="300%" width="300%" x="-100%" y="-100%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
          {outdoorFlows.map((path, index) => (
            <mask
              height={data.viewBox[3]}
              id={`p8-people-flow-mask-${index}`}
              key={`people-flow-mask-${index}`}
              maskContentUnits="userSpaceOnUse"
              maskUnits="userSpaceOnUse"
              width={data.viewBox[2]}
              x={data.viewBox[0]}
              y={data.viewBox[1]}
            >
              <path
                d={path.d}
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </mask>
          ))}
          <mask
            height={data.viewBox[3]}
            id="p8-bus-flow-mask"
            maskContentUnits="userSpaceOnUse"
            maskUnits="userSpaceOnUse"
            width={data.viewBox[2]}
            x={data.viewBox[0]}
            y={data.viewBox[1]}
          >
            <path
              d={busRoute.d}
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </mask>
        </defs>

        <g className="sar-p8-endpoint-pulses">
          {emphasizedEndpoints.map((endpoint) => (
            <circle
              className="sar-p8-endpoint-halo"
              cx={endpoint.x}
              cy={endpoint.y}
              filter="url(#p8-endpoint-glow)"
              key={`${endpoint.key}-pulse`}
              r="12.58"
            />
          ))}
        </g>

        <g className="sar-p8-people-routes">
          {data.people.map((path, index) => (
            <path
              d={path.d}
              key={`people-${index}`}
              style={styleFor(path, peopleColor, 1.5)}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        <g className="sar-p8-bus-route">
          {data.bus.map((path, index) => (
            <path
              d={path.d}
              key={`bus-${index}`}
              style={styleFor(path, busColor)}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        <g className="sar-p8-people-motion">
          {outdoorFlows.map((path, index) => {
            const reverse = distanceToOrigin(path.end) < distanceToOrigin(path.start);
            const direction = reverse ? 1 : -1;
            const nearDistance = Math.min(distanceToOrigin(path.start), distanceToOrigin(path.end));
            const phase = direction * (nearDistance % 404);
            return (
              <g
                data-direction={reverse ? 'reverse' : 'forward'}
                data-duration="8.2"
                data-flow-highlight
                data-phase={phase}
                data-period={peopleFlowPeriod}
                key={`people-gradient-${index}`}
                mask={`url(#p8-people-flow-mask-${index})`}
                style={{ '--flow-offset': `${phase}px` } as CSSProperties}
              >
                {gradientLayers(peopleSoftLength, peopleCoreLength).map(({ length, opacity }, layerIndex) => (
                  <path
                    className="sar-p8-flow-gradient"
                    d={path.d}
                    key={`people-gradient-${index}-${layerIndex}`}
                    style={{
                      opacity,
                      strokeDasharray: `${length} ${peopleFlowPeriod - length}`,
                      strokeDashoffset: `calc(var(--flow-offset) + ${direction * (peopleSoftLength - length) / 2}px)`,
                    }}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
            );
          })}
        </g>

        <g className="sar-p8-bus-motion">
          <g
            data-direction="forward"
            data-duration={busFlowDuration}
            data-flow-highlight
            data-phase="0"
            data-period={busFlowPeriod}
            mask="url(#p8-bus-flow-mask)"
            style={{ '--flow-offset': '0px' } as CSSProperties}
          >
            {gradientLayers(busSoftLength, busCoreLength).map(({ length, opacity }, layerIndex) => (
              <path
                className="sar-p8-flow-gradient"
                d={busRoute.d}
                key={`bus-gradient-${layerIndex}`}
                style={{
                  opacity,
                  strokeDasharray: `${length} ${busFlowPeriod - length}`,
                  strokeDashoffset: `calc(var(--flow-offset) - ${(busSoftLength - length) / 2}px)`,
                }}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        </g>

        <g className="sar-p8-circulation-legend">
          <g>
            <line className="sar-p8-legend-bus" x1="34" x2="92" y1="34" y2="34" />
            <text x="108" y="39">AR Bus Route</text>
          </g>
          <g>
            <line className="sar-p8-legend-outdoor" x1="34" x2="92" y1="60" y2="60" />
            <text x="108" y="65">Outdoor Pedestrian Route</text>
          </g>
          <g>
            <line className="sar-p8-legend-indoor" x1="34" x2="92" y1="86" y2="86" />
            <text x="108" y="91">Indoor Pedestrian Route</text>
          </g>
        </g>

        <g className="sar-p8-bus-stop-labels">
          <text className="sar-p8-label-boarding" x="2077.6" y="88">Boarding Point</text>
          <text className="sar-p8-label-alighting" x="2200" y="65.745">Alighting Point</text>
          <text className="sar-p8-label-visitor-entrance" x="2246.5" y="326">Main Visitor Entrance</text>
        </g>

        <g className="sar-p8-emphasized-endpoints">
          {emphasizedEndpoints.map((endpoint) => (
            <circle
              className="sar-p8-endpoint-core"
              cx={endpoint.x}
              cy={endpoint.y}
              fill={endpoint.color}
              key={endpoint.key}
              r="8"
              stroke={endpoint.color}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
