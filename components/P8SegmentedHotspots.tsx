'use client';

import { type CSSProperties, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { p8NodeLayers, type P8ImageId, type P8NodeClassId } from '@/data/p8SegmentedNodePaths';

gsap.registerPlugin(useGSAP);

type NodeClass = { id: P8NodeClassId; title: string; eyebrow: string; description: string };
type ConnectorZone = 'top' | 'middle' | 'bottom' | 'tower';
type Hotspot = {
  id: string;
  nodeClassId: P8NodeClassId;
  imageId: P8ImageId;
  x: number;
  y: number;
  direction: 'left' | 'right';
  connectorZone?: ConnectorZone;
  connectorVerticalScale?: number;
  connectorFromCenter?: boolean;
};

const segmentedImages = [
  {
    id: 'yongning' as const,
    label: '08-D / Yongning Gate — Xiangzi Temple',
    alt: 'Complete orthographic scene detail from Yongning Gate to Xiangzi Temple',
    src: '/images/projects/digi-tao/p8/p8-detail-yongning-xiangzimiao.jpg',
    width: 3200,
    height: 1171,
  },
  {
    id: 'western' as const,
    label: '08-E / Xiangzimiao Street — Western Section',
    alt: 'Complete orthographic scene detail of the western section of Xiangzimiao Street',
    src: '/images/projects/digi-tao/p8/p8-detail-xiangzimiao-rear.jpg',
    width: 3200,
    height: 948,
  },
];

const nodeClasses: NodeClass[] = [
  {
    id: 'towers',
    title: 'City Wall Watchtowers',
    eyebrow: 'Heritage anchor',
    description: 'Small pavilions positioned along the wall include gate towers, corner towers, defensive towers and archery towers. They housed soldiers and supported surveillance, signalling and defensive fire.',
  },
  {
    id: 'wall-cinema',
    title: 'City Wall Cinema',
    eyebrow: 'Fixed personal AR',
    description: 'Stepped viewing terraces occupy two publicly accessible rooftops. At night they operate as a co-located personal AR cinema, supported by headset rental, light refreshments and managed entry points.',
  },
  {
    id: 'outdoor-ar-game',
    title: 'Outdoor AR Game',
    eyebrow: 'Mobile personal AR',
    description: 'Interactive installations across selected roof terraces and plazas launch a phone-based “Find the Mythical Beast” puzzle trail. Visitors follow location clues, unlock AR scenes and photograph virtual characters.',
  },
  {
    id: 'ar-canopy',
    title: 'AR Canopy',
    eyebrow: 'Shared visual layer',
    description: 'Fixed transparent AR screens span key pedestrian routes as a shared decorative layer. They introduce the district’s mythological theme without requiring visitors to wear headsets or use personal devices.',
  },
  {
    id: 'facade-ar-screens',
    title: 'Façade AR Screens',
    eyebrow: 'Shared urban interface',
    description: 'Transparent AR screens installed in shop windows use a consistent animation language to connect indoor activity with the wider district narrative, while providing customers with a more focused thematic view.',
  },
  {
    id: 'ar-bus',
    title: 'AR Bus',
    eyebrow: 'Mobile shared AR',
    description: 'An 8-seat AR minibus follows a dedicated circular route at approximately 15 km/h. Transparent window displays interpret nearby buildings and mythological stories while passengers move through the district.',
  },
  {
    id: 'indoor-ar-exhibition',
    title: 'Indoor AR Exhibition',
    eyebrow: 'Mobile personal AR',
    description: 'Developed from the existing art gallery, this indoor exhibition combines physical artefacts with digital interpretation of Daoist Eight Immortals culture. Headsets are issued and managed through an on-site rental service.',
  },
  {
    id: 'courtyard-ar-theatre',
    title: 'Courtyard Performance Space',
    eyebrow: 'Fixed shared AR',
    description: 'Located at the main entrance, the courtyard hosts mythological dance and theatre using fixed AR displays. Its radial layout and multiple entrances connect Xiangzi Temple with Yongning Gate.',
  },
  {
    id: 'xiangzi-temple',
    title: 'Xiangzi Temple',
    eyebrow: 'Cultural anchor',
    description: 'Xiangzi Temple is associated with Han Xiangzi’s path to immortality and gives the district its name. The active Daoist site now operates as a free public attraction and cultural anchor.',
  },
];

const nodeClassMap = new Map(nodeClasses.map((nodeClass) => [nodeClass.id, nodeClass]));

const busTransferNode: NodeClass = {
  id: 'ar-bus',
  title: 'AR Bus Station',
  eyebrow: 'Route operations',
  description: 'The station combines boarding, ticketing and vehicle parking near the main entrance, on the lower-footfall side. Adapted from a single-storey car park, it supports a closed route operated by one service provider.',
};

const hotspots: Hotspot[] = [
  { id: 'y-towers', nodeClassId: 'towers', imageId: 'yongning', x: 41.62, y: 86.45, direction: 'right', connectorZone: 'tower' },
  { id: 'y-wall-cinema', nodeClassId: 'wall-cinema', imageId: 'yongning', x: 27.61, y: 64.31, direction: 'right' },
  { id: 'y-outdoor-game', nodeClassId: 'outdoor-ar-game', imageId: 'yongning', x: 35.38, y: 59.54, direction: 'right' },
  { id: 'y-canopy-west', nodeClassId: 'ar-canopy', imageId: 'yongning', x: 17.65, y: 78.89, direction: 'right', connectorZone: 'bottom', connectorVerticalScale: 4, connectorFromCenter: true },
  { id: 'y-canopy-east', nodeClassId: 'ar-canopy', imageId: 'yongning', x: 65.87, y: 62.91, direction: 'right', connectorZone: 'bottom', connectorVerticalScale: 4, connectorFromCenter: true },
  { id: 'y-facade', nodeClassId: 'facade-ar-screens', imageId: 'yongning', x: 71.15, y: 72.03, direction: 'left', connectorZone: 'bottom', connectorVerticalScale: 3 },
  { id: 'y-bus-west', nodeClassId: 'ar-bus', imageId: 'yongning', x: 38.23, y: 37.7, direction: 'left', connectorZone: 'bottom' },
  { id: 'y-bus-east', nodeClassId: 'ar-bus', imageId: 'yongning', x: 85.49, y: 26.49, direction: 'left', connectorVerticalScale: 1.3 },
  { id: 'y-courtyard', nodeClassId: 'courtyard-ar-theatre', imageId: 'yongning', x: 78.09, y: 49.64, direction: 'left' },
  { id: 'y-temple', nodeClassId: 'xiangzi-temple', imageId: 'yongning', x: 53.4, y: 17.88, direction: 'right' },
  { id: 'w-indoor-exhibition', nodeClassId: 'indoor-ar-exhibition', imageId: 'western', x: 23.63, y: 54.01, direction: 'right' },
  { id: 'w-outdoor-game', nodeClassId: 'outdoor-ar-game', imageId: 'western', x: 38.07, y: 63.56, direction: 'right' },
  { id: 'w-canopy', nodeClassId: 'ar-canopy', imageId: 'western', x: 27.69, y: 73.7, direction: 'right', connectorZone: 'bottom', connectorVerticalScale: 4, connectorFromCenter: true },
  { id: 'w-bus', nodeClassId: 'ar-bus', imageId: 'western', x: 52.85, y: 75.9, direction: 'right' },
  { id: 'w-wall-cinema', nodeClassId: 'wall-cinema', imageId: 'western', x: 60.84, y: 59.66, direction: 'left' },
  { id: 'w-facade', nodeClassId: 'facade-ar-screens', imageId: 'western', x: 88.5, y: 66.31, direction: 'left', connectorZone: 'bottom', connectorVerticalScale: 3 },
];

function connectorZoneFor(y: number): ConnectorZone {
  if (y < 30) return 'top';
  if (y > 70) return 'bottom';
  return 'middle';
}

function connectorCardOffset(zone: ConnectorZone, verticalScale = 1, fromCenter = false) {
  if (zone === 'top') return 9 + (21 * verticalScale);
  if (zone === 'bottom') return -((fromCenter ? 0 : 9) + (21 * verticalScale));
  return 0;
}

function connectorPath(direction: Hotspot['direction'], zone: ConnectorZone, verticalScale = 1, fromCenter = false) {
  const centerY = 80;
  if (zone === 'tower') return 'M90 160 L90 0';
  if (zone === 'middle') {
    return direction === 'right'
      ? `M0 ${centerY} L180 ${centerY}`
      : `M180 ${centerY} L0 ${centerY}`;
  }

  const startsBelowHotspot = zone === 'top';
  const startY = fromCenter ? centerY : centerY + (startsBelowHotspot ? 9 : -9);
  const verticalLength = 21 * verticalScale;
  const endY = startY + (startsBelowHotspot ? verticalLength : -verticalLength);
  return direction === 'right'
    ? `M0 ${startY} L0 ${endY} L180 ${endY}`
    : `M180 ${startY} L180 ${endY} L0 ${endY}`;
}

export function P8SegmentedHotspots() {
  const groupRef = useRef<HTMLElement>(null);
  const idleAnimationsRef = useRef<gsap.core.Tween[]>([]);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const resetTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const outlinePulseRef = useRef<gsap.core.Tween | null>(null);
  const activeHotspotRef = useRef<string | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [viewedNodeClasses, setViewedNodeClasses] = useState<P8NodeClassId[]>([]);

  const { contextSafe } = useGSAP(() => {
    const root = groupRef.current;
    if (!root) return;
    const hotspotElements = root.querySelectorAll('[data-detail-hotspot]');
    const hotspotCores = root.querySelectorAll('.sar-p8-detail-hotspot-core');
    const hiddenLayers = root.querySelectorAll(
      '.sar-p8-detail-mono, [data-node-layer], [data-node-outline], .sar-p8-node-line, .sar-p8-node-card',
    );
    const connectorPaths = root.querySelectorAll('.sar-p8-node-line-path');
    gsap.set(hiddenLayers, { autoAlpha: 0 });
    connectorPaths.forEach((path) => {
      const connectorPath = path as SVGPathElement;
      const length = connectorPath.getTotalLength();
      gsap.set(connectorPath, { strokeDasharray: length, strokeDashoffset: length });
    });

    const media = gsap.matchMedia();
    media.add(
      { reduceMotion: '(prefers-reduced-motion: reduce)', allowMotion: '(prefers-reduced-motion: no-preference)' },
      (context) => {
        if (context.conditions?.reduceMotion) {
          gsap.set(hotspotElements, { autoAlpha: 1, y: 0 });
          gsap.set(hotspotCores, { opacity: 1, scale: 1 });
          return;
        }
        gsap.set(hotspotCores, { opacity: 1 });
        const elements = Array.from(hotspotElements);
        const cores = Array.from(hotspotCores);
        const idleAnimations = elements.flatMap((hotspot, index) => {
          const delay = (index % 8) * 0.11;
          return [
            gsap.to(hotspot, { y: -4.6, duration: 1.25, delay, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
            gsap.to(cores[index], { scale: 1.12, duration: 1.25, delay, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
          ];
        });
        idleAnimationsRef.current = idleAnimations;
        return () => {
          idleAnimations.forEach((animation) => animation.kill());
          idleAnimationsRef.current = [];
        };
      },
    );

    return () => {
      introTimelineRef.current?.kill();
      resetTimelineRef.current?.kill();
      outlinePulseRef.current?.kill();
      media.revert();
    };
  }, { scope: groupRef });

  const activateNode = contextSafe((hotspotId: string, nodeClassId: P8NodeClassId) => {
    const root = groupRef.current;
    if (!root || activeHotspotRef.current === hotspotId) return;
    const selectedHotspot = root.querySelector<HTMLElement>(`[data-detail-hotspot="${hotspotId}"]`);
    if (!selectedHotspot) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const allHotspots = Array.from(root.querySelectorAll<HTMLElement>('[data-detail-hotspot]'));
    const connectorHotspotIds = nodeClassId === 'ar-bus'
      ? [hotspotId === 'y-bus-east' ? 'y-bus-west' : hotspotId, 'y-bus-east']
      : [hotspotId];
    const connectorHotspots = connectorHotspotIds
      .map((id) => root.querySelector<HTMLElement>(`[data-detail-hotspot="${id}"]`))
      .filter((hotspot): hotspot is HTMLElement => hotspot !== null);
    const otherHotspots = allHotspots.filter((hotspot) => !connectorHotspots.includes(hotspot));
    const monochromeLayers = root.querySelectorAll('.sar-p8-detail-mono');
    const colorLayers = root.querySelectorAll(`[data-node-layer="${nodeClassId}"]`);
    const outlines = root.querySelectorAll(`[data-node-outline="${nodeClassId}"]`);
    const allEffectLayers = root.querySelectorAll(
      '.sar-p8-detail-mono, [data-node-layer], [data-node-outline], .sar-p8-node-line, .sar-p8-node-card',
    );
    const lines = connectorHotspots
      .map((hotspot) => hotspot.querySelector<SVGElement>('.sar-p8-node-line'))
      .filter((line): line is SVGElement => line !== null);
    const linePaths = connectorHotspots
      .map((hotspot) => hotspot.querySelector<SVGPathElement>('.sar-p8-node-line-path'))
      .filter((path): path is SVGPathElement => path !== null);
    const cards = connectorHotspots
      .map((hotspot) => hotspot.querySelector<HTMLElement>('.sar-p8-node-card'))
      .filter((card): card is HTMLElement => card !== null);
    if (lines.length !== connectorHotspots.length || linePaths.length !== connectorHotspots.length || cards.length !== connectorHotspots.length) return;

    setActiveHotspot(hotspotId);
    activeHotspotRef.current = hotspotId;
    idleAnimationsRef.current.forEach((animation) => animation.pause());
    resetTimelineRef.current?.kill();
    introTimelineRef.current?.kill();
    outlinePulseRef.current?.kill();
    gsap.set(allEffectLayers, { autoAlpha: 0 });
    gsap.set(allHotspots, { autoAlpha: 1 });

    const revealDuration = reduceMotion ? 0 : 1.5;
    const connectorDelay = reduceMotion ? 0 : 0.5;
    const lineDuration = reduceMotion ? 0 : 1;
    const cardLead = reduceMotion ? 0 : hotspotId === 'y-towers' ? 0.58 : 0.18;
    const cardRevealDuration = reduceMotion ? 0 : 0.2;
    linePaths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
    gsap.set(lines, { autoAlpha: 1 });

    introTimelineRef.current = gsap.timeline({ defaults: { overwrite: 'auto' } })
      .addLabel('focus', 0)
      .addLabel('connector', connectorDelay)
      .addLabel('card', connectorDelay + lineDuration - cardLead)
      .to(otherHotspots, { autoAlpha: 0, duration: reduceMotion ? 0 : 0.35, ease: 'power2.out' }, 'focus')
      .to(connectorHotspots, { autoAlpha: 1, duration: reduceMotion ? 0 : 0.2 }, 'focus')
      .to(monochromeLayers, { autoAlpha: 1, duration: revealDuration, ease: 'power2.inOut' }, 'focus')
      .to(colorLayers, { autoAlpha: 1, duration: revealDuration, ease: 'power2.inOut' }, 'focus')
      .to(outlines, { autoAlpha: 1, duration: revealDuration, ease: 'power2.inOut' }, 'focus')
      .to(linePaths, { strokeDashoffset: 0, duration: lineDuration, ease: 'none' }, 'connector')
      .to(cards, { autoAlpha: 1, duration: cardRevealDuration, ease: 'power1.out' }, 'card')
      .call(() => {
        setViewedNodeClasses((current) => current.includes(nodeClassId) ? current : [...current, nodeClassId]);
      }, [], `card+=${cardRevealDuration}`);

    if (!reduceMotion) {
      outlinePulseRef.current = gsap.fromTo(
        outlines,
        { opacity: 1 },
        { opacity: 0.6, duration: 1.25, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true },
      );
      introTimelineRef.current.call(() => outlinePulseRef.current?.restart(), [], revealDuration);
    }
  });

  const deactivateNode = contextSafe(() => {
    const root = groupRef.current;
    if (!root || !activeHotspotRef.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 0 : 0.5;
    const allHotspots = root.querySelectorAll('[data-detail-hotspot]');
    const effectLayers = root.querySelectorAll(
      '.sar-p8-detail-mono, [data-node-layer], [data-node-outline], .sar-p8-node-line, .sar-p8-node-card',
    );
    const connectorPaths = root.querySelectorAll<SVGPathElement>('.sar-p8-node-line-path');
    introTimelineRef.current?.kill();
    outlinePulseRef.current?.kill();
    resetTimelineRef.current?.kill();
    resetTimelineRef.current = gsap.timeline({
      onComplete: () => idleAnimationsRef.current.forEach((animation) => animation.resume()),
    })
      .to(effectLayers, { autoAlpha: 0, duration, ease: 'power2.out', overwrite: 'auto' }, 0)
      .to(allHotspots, { autoAlpha: 1, duration, ease: 'power2.out', overwrite: 'auto' }, 0)
      .call(() => {
        connectorPaths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });
      });
    activeHotspotRef.current = null;
    setActiveHotspot(null);
  });

  return (
    <section
      aria-labelledby="p8-complete-scenes"
      className="sar-p8-detail-gallery"
      data-hotspot-active={activeHotspot !== null}
      ref={groupRef}
    >
      <header>
        <strong id="p8-complete-scenes">Complete Design Detail Views</strong>
        <span aria-hidden="true" className="sar-p8-scroll-cue">
          {[0, 1, 2].map((index) => (
            <svg key={index} preserveAspectRatio="none" viewBox="0 0 20 6"><path d="M1 1 L10 5 L19 1" /></svg>
          ))}
        </span>
      </header>

      {segmentedImages.map((image) => (
        <figure key={image.id}>
          <figcaption><span>{image.label}</span></figcaption>
          <div className="sar-p8-detail-stage">
            <img alt={image.alt} className="sar-p8-detail-base" decoding="async" height={image.height} loading="lazy" src={image.src} width={image.width} />
            <img alt="" aria-hidden="true" className="sar-p8-detail-mono" decoding="async" height={image.height} loading="lazy" src={image.src} width={image.width} />

            {nodeClasses.map((nodeClass) => {
              const layer = p8NodeLayers[nodeClass.id][image.id];
              if (!layer) return null;
              const [, , viewBoxWidth, viewBoxHeight] = layer.viewBox.split(' ').map(Number);
              const clipId = `p8-clip-${image.id}-${nodeClass.id}`;
              const outlineMaskId = `p8-outline-mask-${image.id}-${nodeClass.id}`;
              return (
                <div key={`${image.id}-${nodeClass.id}`}>
                  <svg aria-hidden="true" className="sar-p8-node-color-layer" data-node-layer={nodeClass.id} preserveAspectRatio="none" viewBox={layer.viewBox}>
                    <defs><clipPath clipPathUnits="userSpaceOnUse" id={clipId}><path d={layer.clipPath} /></clipPath></defs>
                    <image clipPath={`url(#${clipId})`} height={viewBoxHeight} href={image.src} preserveAspectRatio="none" width={viewBoxWidth} />
                  </svg>
                  <svg aria-hidden="true" className="sar-p8-node-outline" data-node-outline={nodeClass.id} preserveAspectRatio="none" viewBox={layer.viewBox}>
                    <defs>
                      <mask id={outlineMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width={viewBoxWidth} height={viewBoxHeight}>
                        <rect fill="white" width={viewBoxWidth} height={viewBoxHeight} />
                        <path d={layer.clipPath} fill="black" />
                      </mask>
                    </defs>
                    <path className="sar-p8-node-outline-expansion" d={layer.clipPath} fill="none" mask={`url(#${outlineMaskId})`} />
                    <path className="sar-p8-node-outline-core" d={layer.outlinePath} fillRule="evenodd" />
                  </svg>
                </div>
              );
            })}

            {hotspots.filter((hotspot) => hotspot.imageId === image.id).map((hotspot) => {
              const nodeClass = nodeClassMap.get(hotspot.nodeClassId);
              if (!nodeClass) return null;
              const connectorZone = hotspot.connectorZone ?? connectorZoneFor(hotspot.y);
              const connectorVerticalScale = hotspot.connectorVerticalScale ?? 1;
              const connectorFromCenter = hotspot.connectorFromCenter ?? false;
              const cardOffsetY = hotspot.id === 'y-bus-east'
                ? 'calc(4.102cqw - 30px)'
                : `${connectorCardOffset(connectorZone, connectorVerticalScale, connectorFromCenter)}px`;
              const cardNodeClass = hotspot.id === 'y-bus-east' ? busTransferNode : nodeClass;
              const hotspotStyle = {
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                '--card-offset-y': cardOffsetY,
              } as CSSProperties;
              return (
                <div
                  className="sar-p8-detail-hotspot"
                  data-detail-hotspot={hotspot.id}
                  data-direction={hotspot.direction}
                  data-connector-zone={connectorZone}
                  data-hotspot-viewed={viewedNodeClasses.includes(hotspot.nodeClassId)}
                  data-node-class={hotspot.nodeClassId}
                  key={hotspot.id}
                  onPointerEnter={() => activateNode(hotspot.id, hotspot.nodeClassId)}
                  onPointerLeave={deactivateNode}
                  style={hotspotStyle}
                >
                  <button aria-label={`Explore ${nodeClass.title}`} aria-pressed={activeHotspot === hotspot.id} onBlur={deactivateNode} onFocus={() => activateNode(hotspot.id, hotspot.nodeClassId)} type="button">
                    <span aria-hidden="true" className="sar-p8-detail-hotspot-core" />
                    <span className="sar-p8-detail-hotspot-hint">Hover to explore</span>
                  </button>
                  <svg aria-hidden="true" className="sar-p8-node-line" preserveAspectRatio="none" viewBox="0 0 180 160">
                    <path className="sar-p8-node-line-path" d={connectorPath(hotspot.direction, connectorZone, connectorVerticalScale, connectorFromCenter)} />
                  </svg>
                  <aside aria-live="polite" className="sar-p8-node-card">
                    <span>{cardNodeClass.eyebrow}</span>
                    <strong>{cardNodeClass.title}</strong>
                    <p>{cardNodeClass.description}</p>
                  </aside>
                </div>
              );
            })}
          </div>
          {image.id === 'western' && <p className="sar-image-credit sar-p8-gallery-credit">Illustration by the author.</p>}
        </figure>
      ))}
    </section>
  );
}
