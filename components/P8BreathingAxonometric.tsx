'use client';

import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { P8CirculationLayer } from '@/components/P8CirculationLayer';
import { P8ModeDistributionLayer } from '@/components/P8ModeDistributionLayer';
import { P8SegmentedHotspots } from '@/components/P8SegmentedHotspots';
import { P8SoundFieldLayer } from '@/components/P8SoundFieldLayer';

gsap.registerPlugin(useGSAP);

const layers = [
  {
    id: 'device-locations',
    label: 'AR Device Locations',
    description: 'Locates the proposed displays, headsets and interactive devices across the district.',
  },
  {
    id: 'visitor-bus-routes',
    label: 'Visitor Circulation + AR Bus Route',
    description: 'Outdoor and indoor routes connect key thresholds, while the AR bus runs counterclockwise between boarding and alighting points.',
  },
  {
    id: 'mode-distribution',
    label: 'AR Mode Distribution',
    description: 'Personal and shared AR modes occupy mobile and fixed spatial conditions across the district.',
  },
  {
    id: 'audio-fields',
    label: 'Schematic Public Sound-field Distribution',
    description: 'Maps soundfields from active nodes towards quiet-sensitive edges, excluding device-bound and vehicle-contained audio.',
  },
] as const;

export function P8BreathingAxonometric() {
  const figureRef = useRef<HTMLElement>(null);
  const autoplayRegionRef = useRef<HTMLDivElement>(null);
  const activeImageRef = useRef<HTMLImageElement>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndexRef = useRef(0);
  const autoplayTimerRef = useRef<number | null>(null);
  const manuallyControlledRef = useRef(false);
  const selectLayerRef = useRef<(nextIndex: number) => void>(() => undefined);
  const breathingTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const switchTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);

  const { contextSafe } = useGSAP(() => {
    const panels = panelRefs.current.filter((panel): panel is HTMLDivElement => Boolean(panel));
    const activeImage = activeImageRef.current;
    if (!activeImage || panels.length === 0) return;

    gsap.set(panels, { autoAlpha: 0, zIndex: 0 });
    gsap.set(panels[0], { autoAlpha: 1, zIndex: 1 });

    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(activeImage, { autoAlpha: 1 });
    });

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(activeImage, { autoAlpha: 0 });

      const breathingTimeline = gsap.timeline({ repeat: -1 });
      breathingTimeline
        .to(activeImage, { autoAlpha: 1, duration: 1.5, ease: 'sine.inOut' })
        .to(activeImage, { autoAlpha: 0, duration: 0.5, ease: 'sine.inOut' }, '+=1');
      breathingTimelineRef.current = breathingTimeline;

      return () => {
        breathingTimeline.kill();
        breathingTimelineRef.current = null;
      };
    });

    return () => {
      switchTimelineRef.current?.kill();
      media.revert();
    };
  }, { scope: figureRef });

  const selectLayer = contextSafe((nextIndex: number) => {
    const currentIndex = activeIndexRef.current;
    if (currentIndex === nextIndex) return;

    const currentPanel = panelRefs.current[currentIndex];
    const nextPanel = panelRefs.current[nextIndex];
    if (!currentPanel || !nextPanel) return;

    const panels = panelRefs.current.filter((panel): panel is HTMLDivElement => Boolean(panel));
    const inactivePanels = panels.filter((panel) => panel !== currentPanel && panel !== nextPanel);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (currentIndex === 0 && nextIndex !== 0) {
      breathingTimelineRef.current?.pause(0);
      if (activeImageRef.current) gsap.set(activeImageRef.current, { autoAlpha: 0 });
    }

    switchTimelineRef.current?.kill();
    gsap.set(inactivePanels, { autoAlpha: 0, zIndex: 0 });
    switchTimelineRef.current = gsap.timeline({ defaults: { overwrite: 'auto' } })
      .set(nextPanel, { autoAlpha: 0, zIndex: 2 })
      .to(currentPanel, { autoAlpha: 0, duration: reduceMotion ? 0 : 0.28, ease: 'power2.out' }, 0)
      .to(nextPanel, { autoAlpha: 1, duration: reduceMotion ? 0 : 0.48, ease: 'power2.inOut' }, reduceMotion ? 0 : 0.08)
      .set(currentPanel, { zIndex: 0 })
      .set(nextPanel, { zIndex: 1 });

    if (nextIndex === 0) breathingTimelineRef.current?.restart();

    activeIndexRef.current = nextIndex;
    setActiveLayerIndex(nextIndex);
  });
  selectLayerRef.current = selectLayer;

  useEffect(() => {
    const autoplayRegion = autoplayRegionRef.current;
    if (!autoplayRegion) return;

    const stopAutoplay = () => {
      if (autoplayTimerRef.current === null) return;
      window.clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    };

    const observer = new IntersectionObserver(([entry]) => {
      const rect = entry.boundingClientRect;
      const fullyVisible = entry.isIntersecting
        && rect.top >= 0
        && rect.left >= 0
        && rect.bottom <= window.innerHeight
        && rect.right <= window.innerWidth;

      stopAutoplay();

      if (!fullyVisible) {
        selectLayerRef.current(0);
        return;
      }

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (manuallyControlledRef.current || reduceMotion) return;

      autoplayTimerRef.current = window.setInterval(() => {
        selectLayerRef.current((activeIndexRef.current + 1) % layers.length);
      }, 3500);
    }, { threshold: [0, 1] });

    observer.observe(autoplayRegion);

    return () => {
      observer.disconnect();
      stopAutoplay();
    };
  }, []);

  const markManualSelection = () => {
    manuallyControlledRef.current = true;
    if (autoplayTimerRef.current === null) return;
    window.clearInterval(autoplayTimerRef.current);
    autoplayTimerRef.current = null;
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % layers.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + layers.length) % layers.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = layers.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    markManualSelection();
    tabRefs.current[nextIndex]?.focus();
    selectLayer(nextIndex);
  };

  return (
    <section className="sar-p8-visual-set" ref={figureRef}>
      <figure className="sar-p8-axonometric">
        <div className="sar-p8-autoplay-region" ref={autoplayRegionRef}>
          <div aria-label="P8 information layers" className="sar-p8-layer-tabs" role="tablist">
            {layers.map((layer, index) => (
              <button
                aria-controls={`p8-panel-${layer.id}`}
                aria-selected={activeLayerIndex === index}
                id={`p8-tab-${layer.id}`}
                key={layer.id}
                onClick={() => {
                  markManualSelection();
                  selectLayer(index);
                }}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                ref={(element) => { tabRefs.current[index] = element; }}
                role="tab"
                tabIndex={activeLayerIndex === index ? 0 : -1}
                type="button"
              >
                <span>0{index + 1}</span>
                <strong>{layer.label}</strong>
              </button>
            ))}
          </div>

          <div className="sar-p8-layer-stage">
            {layers.map((layer, index) => (
              <div
                aria-hidden={activeLayerIndex !== index}
                aria-labelledby={`p8-tab-${layer.id}`}
                className="sar-p8-layer-panel"
                id={`p8-panel-${layer.id}`}
                key={layer.id}
                ref={(element) => { panelRefs.current[index] = element; }}
                role="tabpanel"
              >
                {index === 0 ? (
                  <>
                    <img
                      alt="Grayscale orthographic axonometric of the Xiangzi Temple District with AR equipment inactive"
                      decoding="async"
                      height="745"
                      loading="lazy"
                      src="/images/projects/digi-tao/p8/p8-ar-black.jpg"
                      width="4096"
                    />
                    <img
                      aria-hidden="true"
                      className="sar-p8-axonometric-ar-on"
                      decoding="async"
                      height="745"
                      loading="lazy"
                      ref={activeImageRef}
                      src="/images/projects/digi-tao/p8/p8-ar-cyan.jpg"
                      width="4096"
                    />
                  </>
                ) : index === 1 ? (
                  <P8CirculationLayer active={activeLayerIndex === 1} />
                ) : index === 2 ? (
                  <P8ModeDistributionLayer active={activeLayerIndex === 2} />
                ) : index === 3 ? (
                  <P8SoundFieldLayer />
                ) : (
                  <img
                    alt={`Grayscale district axonometric reserved for the ${layer.label.toLowerCase()} layer`}
                    decoding="async"
                    height="745"
                    loading="lazy"
                    src="/images/projects/digi-tao/p8/p8-layer-base-white.jpg"
                    width="4096"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <figcaption aria-live="polite">
          <span>08-C / Black-and-white overview</span>
          <p><strong>{layers[activeLayerIndex].label}.</strong> {layers[activeLayerIndex].description}</p>
        </figcaption>
      </figure>

      <P8SegmentedHotspots />
    </section>
  );
}
