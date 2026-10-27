'use client';

import { createElement, useRef, type ElementType } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { readProjectReturnSlug } from '@/lib/projectReturn';

type GooeyTextRevealProps = {
  as: 'p' | 'h2' | 'h3';
  children: string;
  className?: string;
  duration?: number;
  restoreSmoothText?: boolean;
  trigger?: 'viewport' | 'manual';
  triggerStart?: string;
};

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger, SplitText);
CustomEase.create('gooeyTextOut', '0.25,1,0.5,1');

let revealId = 0;
export const GOOEY_TEXT_REVEAL_EVENT = 'gooey-text-reveal';

export function GooeyTextReveal({
  as,
  children,
  className,
  duration = 1.2,
  restoreSmoothText = false,
  trigger = 'viewport',
  triggerStart = 'top bottom',
}: GooeyTextRevealProps) {
  const textRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const element = textRef.current;
      if (!element) return;

      if (readProjectReturnSlug()) {
        gsap.set(element, { clearProps: 'filter,opacity,visibility' });
        return;
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(element, { autoAlpha: 1 });
        return;
      }

      const svgNamespace = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNamespace, 'svg');
      const defs = document.createElementNS(svgNamespace, 'defs');
      const instanceId = `gooey-text-${revealId++}`;
      const usesManualTrigger = trigger === 'manual'
        && window.matchMedia('(min-width: 900px)').matches;
      let manualTimeline: gsap.core.Timeline | null = null;
      let hasRevealed = false;

      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.classList.add('gooey-text-filter-defs');
      svg.appendChild(defs);
      document.documentElement.insertBefore(svg, document.body);

      const clearFilters = () => {
        defs.replaceChildren();
      };

      const revealManually = () => {
        if (hasRevealed) return;
        hasRevealed = true;
        manualTimeline?.play(0);
      };

      if (usesManualTrigger) {
        element.addEventListener(GOOEY_TEXT_REVEAL_EVENT, revealManually);
      }

      const split = SplitText.create(element, {
        aria: 'auto',
        autoSplit: true,
        linesClass: 'gooey-text-line',
        type: 'lines',
        onSplit(self) {
          clearFilters();

          const blurs = self.lines.map((lineElement, index) => {
            const line = lineElement as HTMLElement;
            const filterId = `${instanceId}-${index}`;
            const filter = document.createElementNS(svgNamespace, 'filter');
            const blur = document.createElementNS(svgNamespace, 'feGaussianBlur');
            const matrix = document.createElementNS(svgNamespace, 'feColorMatrix');

            filter.setAttribute('id', filterId);
            blur.setAttribute('in', 'SourceGraphic');
            blur.setAttribute('stdDeviation', '50');
            blur.setAttribute('result', 'blur');
            matrix.setAttribute('in', 'blur');
            matrix.setAttribute('mode', 'matrix');
            matrix.setAttribute(
              'values',
              '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8',
            );
            matrix.setAttribute('result', 'goo');
            filter.appendChild(blur);
            filter.appendChild(matrix);
            defs.appendChild(filter);

            line.style.filter = `url(#${filterId})`;
            line.style.willChange = 'filter';
            return blur;
          });

          gsap.set(element, { autoAlpha: 1 });

          const timeline = gsap.timeline({
            paused: usesManualTrigger,
            onComplete: restoreSmoothText
              ? () => {
                  self.revert();
                  clearFilters();
                }
              : undefined,
            scrollTrigger: !usesManualTrigger
              ? {
                  trigger: element,
                  start: triggerStart,
                  once: true,
                }
              : undefined,
          });

          if (usesManualTrigger) {
            manualTimeline = timeline;
          }

          blurs.forEach((blur, index) => {
            timeline.to(
              blur,
              {
                attr: { stdDeviation: 0 },
                delay: index === 0 ? 0.1 : 0,
                duration,
                ease: 'gooeyTextOut',
              },
              index * 0.1 * (duration / 1.2),
            );
          });

          return timeline;
        },
      });

      return () => {
        element.removeEventListener(GOOEY_TEXT_REVEAL_EVENT, revealManually);
        split.revert();
        clearFilters();
        svg.remove();
      };
    },
    {
      dependencies: [children, duration, restoreSmoothText, trigger, triggerStart],
      scope: textRef,
      revertOnUpdate: true,
    },
  );

  return createElement(as as ElementType, { className, ref: textRef }, children);
}
