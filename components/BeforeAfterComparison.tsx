'use client';

import { type CSSProperties, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type BeforeAfterComparisonProps = {
  afterAlt: string;
  afterSrc: string;
  beforeAlt: string;
  beforeSrc: string;
  showHint?: boolean;
  title: string;
};

export function BeforeAfterComparison({
  afterAlt,
  afterSrc,
  beforeAlt,
  beforeSrc,
  showHint = true,
  title,
}: BeforeAfterComparisonProps) {
  const rootRef = useRef<HTMLElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const hasInteractedRef = useRef(false);
  const lineRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { contextSafe } = useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(lineRef.current, { scaleY: 0 }, { scaleY: 1, duration: 0.55, ease: 'power2.out' });
    gsap.fromTo(handleRef.current, { autoAlpha: 0, scale: 0.78 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power2.out' });
    if (hintRef.current) {
      gsap.to(hintRef.current, { y: -4.6, duration: 1.25, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
  }, { scope: rootRef });

  const setHandleEmphasis = contextSafe((active: boolean) => {
    if (!handleRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.to(handleRef.current.querySelectorAll('i'), {
      scale: active ? 1.25 : 1,
      duration: 0.22,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  });

  const beginInteraction = contextSafe(() => {
    if (!showHint || hasInteractedRef.current) return;
    hasInteractedRef.current = true;
    setHasInteracted(true);
    gsap.killTweensOf(hintRef.current, 'y');
    gsap.to(hintRef.current, { autoAlpha: 0, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
  });

  const comparisonStyle = {
    '--comparison-position': `${position}%`,
  } as CSSProperties;

  return (
    <figure
      aria-label={`${title}: before and after comparison`}
      className="sar-before-after"
      ref={rootRef}
      style={comparisonStyle}
    >
      <img alt={afterAlt} className="sar-before-after-image sar-before-after-after" decoding="async" height="869" loading="lazy" src={afterSrc} width="1600" />
      <img alt={beforeAlt} className="sar-before-after-image sar-before-after-before" decoding="async" height="869" loading="lazy" src={beforeSrc} width="1600" />

      <span aria-hidden="true" className="sar-before-after-label sar-before-after-label-before">Before / Physical Space</span>
      <span aria-hidden="true" className="sar-before-after-label sar-before-after-label-after">After / AR View</span>
      {showHint ? <span aria-hidden="true" className="sar-before-after-hint" data-hidden={hasInteracted} ref={hintRef}>Drag to compare</span> : null}

      <input
        aria-label={`Reveal the physical-space and AR views of ${title}`}
        aria-valuetext={`${Math.round(position)} percent physical space, ${Math.round(100 - position)} percent AR view`}
        className="sar-before-after-range"
        max="100"
        min="0"
        onBlur={() => setHandleEmphasis(false)}
        onChange={(event) => setPosition(Number(event.currentTarget.value))}
        onFocus={() => setHandleEmphasis(true)}
        onKeyDown={(event) => {
          if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) beginInteraction();
        }}
        onPointerDown={beginInteraction}
        onPointerEnter={() => setHandleEmphasis(true)}
        onPointerLeave={() => setHandleEmphasis(false)}
        step="0.1"
        type="range"
        value={position}
      />

      <span aria-hidden="true" className="sar-before-after-line" ref={lineRef} />
      <span aria-hidden="true" className="sar-before-after-handle" ref={handleRef}>
        <i /><i />
      </span>
    </figure>
  );
}
