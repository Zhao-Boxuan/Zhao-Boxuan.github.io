'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { readProjectReturnSlug } from '@/lib/projectReturn';

type ScrollTransitionsProps = {
  variant: 'home' | 'detail';
};

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ScrollTransitions({ variant }: ScrollTransitionsProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = anchorRef.current?.parentElement;
      if (!root) return;
      if (variant === 'home' && readProjectReturnSlug()) return;

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const batchTriggers: ScrollTrigger[] = [];
        const imageListeners: HTMLImageElement[] = [];
        let disposed = false;
        let refreshQueued = false;
        let refreshTimer: number | undefined;

        const flushRefresh = () => {
          refreshTimer = undefined;
          if (disposed || !refreshQueued) return;

          if (ScrollTrigger.isScrolling()) {
            refreshTimer = window.setTimeout(flushRefresh, 220);
            return;
          }

          refreshQueued = false;
          ScrollTrigger.refresh();
        };

        const scheduleRefresh = () => {
          if (disposed) return;
          refreshQueued = true;
          if (refreshTimer !== undefined) window.clearTimeout(refreshTimer);
          refreshTimer = window.setTimeout(flushRefresh, 220);
        };

        const postponeRefreshWhileScrolling = () => {
          if (!refreshQueued || disposed) return;
          if (refreshTimer !== undefined) window.clearTimeout(refreshTimer);
          refreshTimer = window.setTimeout(flushRefresh, 220);
        };

        window.addEventListener('scroll', postponeRefreshWhileScrolling, { passive: true });

        const find = (selector: string) =>
          Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
            (element) =>
              !element.closest('.hero, .projects-folder-sequence, .section-heading, .portrait-card'),
          );

        const revealEach = (
          targets: HTMLElement[],
          fromVars: gsap.TweenVars,
          toVars: gsap.TweenVars,
          start = 'top 88%',
        ) => {
          targets.forEach((target) => {
            gsap.fromTo(target, fromVars, {
              ...toVars,
              clearProps: 'transform,opacity,visibility,clipPath,willChange',
              overwrite: 'auto',
              scrollTrigger: {
                trigger: target,
                start,
                once: true,
              },
            });
          });
        };

        const revealBatch = (
          targets: HTMLElement[],
          fromVars: gsap.TweenVars,
          toVars: gsap.TweenVars,
          stagger = 0.08,
        ) => {
          if (targets.length === 0) return;
          gsap.set(targets, { ...fromVars, willChange: 'transform, opacity, clip-path' });
          batchTriggers.push(
            ...ScrollTrigger.batch(targets, {
              batchMax: 4,
              interval: 0.08,
              onEnter: (batch) => {
                gsap.to(batch, {
                  ...toVars,
                  clearProps: 'transform,opacity,visibility,clipPath,willChange',
                  overwrite: 'auto',
                  stagger,
                });
              },
              once: true,
              start: 'top 88%',
            }),
          );
        };

        const labelFrom = { autoAlpha: 0, x: -14, willChange: 'transform, opacity' };
        const labelTo = { autoAlpha: 1, duration: 0.56, ease: 'power2.out', x: 0 };
        const headingFrom = {
          autoAlpha: 0,
          clipPath: 'inset(0 100% 0 0)',
          x: 12,
          willChange: 'transform, opacity, clip-path',
        };
        const headingTo = {
          autoAlpha: 1,
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.88,
          ease: 'power3.out',
          x: 0,
        };
        const bodyFrom = { autoAlpha: 0, y: 18, willChange: 'transform, opacity' };
        const bodyTo = { autoAlpha: 1, duration: 0.72, ease: 'power2.out', y: 0 };
        const cardFrom = { autoAlpha: 0, x: -22, y: 8 };
        const cardTo = { autoAlpha: 1, duration: 0.76, ease: 'power3.out', x: 0, y: 0 };
        const mediaFrom = {
          autoAlpha: 0,
          clipPath: 'inset(0 0 100% 0)',
          scale: 1.012,
          willChange: 'transform, opacity, clip-path',
        };
        const mediaTo = {
          autoAlpha: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.92,
          ease: 'power3.out',
          scale: 1,
        };

        if (variant === 'home') {
          revealEach(find('.about-copy > .contact-meta, .about-copy > .tag-list'), bodyFrom, bodyTo);
          revealBatch(find('.experience-list .experience-row'), cardFrom, cardTo, 0.1);
          revealBatch(find('.strength-grid .strength-card'), cardFrom, cardTo, 0.09);
          revealEach(find('.contact-top'), labelFrom, labelTo);
          revealEach(find('.contact-main > .eyebrow'), labelFrom, labelTo);
          revealEach(find('.contact-email, .site-footer'), bodyFrom, bodyTo);

          const blueprint = root.querySelector<HTMLElement>('.contact-blueprint');
          if (blueprint) {
            const axisX = blueprint.querySelector<HTMLElement>('.contact-axis-x');
            const axisY = blueprint.querySelector<HTMLElement>('.contact-axis-y');
            const geometry = Array.from(
              blueprint.querySelectorAll<HTMLElement>('.contact-ring, .contact-rect, .contact-guide-node, .contact-guide-label'),
            );
            const lineTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: blueprint,
                start: 'top 78%',
                once: true,
              },
            });

            if (axisX) {
              lineTimeline.fromTo(
                axisX,
                { scaleX: 0, transformOrigin: 'left center' },
                { clearProps: 'transform,willChange', duration: 0.74, ease: 'power2.out', scaleX: 1 },
              );
            }
            if (axisY) {
              lineTimeline.fromTo(
                axisY,
                { scaleY: 0, transformOrigin: 'center top' },
                { clearProps: 'transform,willChange', duration: 0.68, ease: 'power2.out', scaleY: 1 },
                '<0.08',
              );
            }
            if (geometry.length > 0) {
              lineTimeline.fromTo(
                geometry,
                { autoAlpha: 0 },
                { autoAlpha: 1, clearProps: 'opacity,visibility', duration: 0.42, stagger: 0.055 },
                '-=0.3',
              );
            }
          }
        } else {
          revealEach(find('.detail-classification, .hj-hero-meta'), labelFrom, labelTo, 'top 92%');
          revealEach(find('.detail-hero > h1, .hj-hero-title'), headingFrom, headingTo, 'top 90%');
          revealEach(find('.detail-summary, .hj-hero-deck'), bodyFrom, bodyTo, 'top 90%');
          revealEach(find('.detail-media > img, .detail-media > .detail-placeholder, .hj-hero-figure > img'), mediaFrom, mediaTo, 'top 86%');
          revealEach(find('.detail-media > span, .hj-hero-figure > figcaption'), labelFrom, labelTo);
      revealBatch(find('.detail-content > div, .detail-content > aside, .hj-introduction-grid > *, .hj-facts > *, .hj-narrative > *, .hj-author-intro, .hj-project-data > div, .hj-reflection-copy'), cardFrom, cardTo, 0.12);
          revealEach(find('.detail-section-heading, .hj-section-heading'), headingFrom, headingTo, 'top 84%');
          revealBatch(find('.detail-research-grid article'), cardFrom, cardTo, 0.1);
          revealBatch(find('.detail-gallery-grid figure, .hj-sheet-list figure'), mediaFrom, mediaTo, 0.08);
          revealEach(find('.detail-next'), bodyFrom, bodyTo, 'top 90%');
        }

        find('img[loading="lazy"]').forEach((image) => {
          if (!(image instanceof HTMLImageElement) || image.complete) return;
          image.addEventListener('load', scheduleRefresh, { once: true });
          imageListeners.push(image);
        });

        const refreshFrame = window.requestAnimationFrame(scheduleRefresh);
        void document.fonts?.ready.then(scheduleRefresh);

        return () => {
          disposed = true;
          window.cancelAnimationFrame(refreshFrame);
          if (refreshTimer !== undefined) window.clearTimeout(refreshTimer);
          window.removeEventListener('scroll', postponeRefreshWhileScrolling);
          imageListeners.forEach((image) => image.removeEventListener('load', scheduleRefresh));
          batchTriggers.forEach((trigger) => trigger.kill());
        };
      });

      return () => media.revert();
    },
    { dependencies: [variant], scope: anchorRef, revertOnUpdate: true },
  );

  return <span className="scroll-transitions-anchor" ref={anchorRef} aria-hidden="true" />;
}
