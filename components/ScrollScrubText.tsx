'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type ScrollScrubTextProps = {
  children: string;
  className?: string;
};

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ScrollScrubText({ children, className }: ScrollScrubTextProps) {
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const text = textRef.current;
      const track = text?.closest<HTMLElement>('.about-intro-scroll');
      if (!text || !track) return;

      const composition = track.querySelector<HTMLElement>('.about-grid');
      const characters = text.querySelectorAll<HTMLElement>('.scroll-scrub-char');
      if (!composition) return;

      const page = track.closest<HTMLElement>('.site-main');
      const backgroundLayers = page
        ? gsap.utils.toArray<HTMLElement>(
            '.line-network-home, .continuous-orbit-layer, .about-orbit-copy',
            page,
          )
        : [];
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(characters, { opacity: 1 });
      });

      media.add('(min-width: 701px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(characters, { opacity: 0.22 });

        const getPinOffset = () => {
          const navHeight = Number.parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
          ) || 66;

          return navHeight + 32;
        };

        let backgroundIsFixed = false;

        const clearFixedBackgroundStyles = () => {
          const owner = page?.dataset.backgroundLockOwner;
          if (owner && owner !== 'about') {
            backgroundIsFixed = false;
            return;
          }

          backgroundLayers.forEach((layer) => {
            layer.style.removeProperty('position');
            layer.style.removeProperty('top');
            layer.style.removeProperty('right');
            layer.style.removeProperty('bottom');
            layer.style.removeProperty('left');
            layer.style.removeProperty('width');
            layer.style.removeProperty('height');
            layer.style.removeProperty('transform');
          });

          if (page?.dataset.backgroundLockOwner === 'about') {
            delete page.dataset.backgroundLockOwner;
          }
          backgroundIsFixed = false;
        };

        const fixBackgroundAtCurrentViewportPosition = () => {
          if (
            backgroundIsFixed
            || backgroundLayers.length === 0
            || (page?.dataset.backgroundLockOwner && page.dataset.backgroundLockOwner !== 'about')
          ) return;

          const rects = backgroundLayers.map((layer) => layer.getBoundingClientRect());

          backgroundLayers.forEach((layer, index) => {
            const rect = rects[index];
            layer.style.position = 'fixed';
            layer.style.top = `${rect.top}px`;
            layer.style.right = 'auto';
            layer.style.bottom = 'auto';
            layer.style.left = `${rect.left}px`;
            layer.style.width = `${rect.width}px`;
            layer.style.height = `${rect.height}px`;
            layer.style.transform = 'none';
          });

          if (page) page.dataset.backgroundLockOwner = 'about';
          backgroundIsFixed = true;
        };

        const enterBackgroundLock = () => {
          fixBackgroundAtCurrentViewportPosition();
          page?.style.setProperty('--background-lock-about', '0px');
        };

        const leaveBackgroundLock = (offset: number) => {
          page?.style.setProperty('--background-lock-about', `${Math.max(0, offset)}px`);
          clearFixedBackgroundStyles();
        };

        const syncBackgroundLock = (self: ScrollTrigger) => {
          const travel = Math.max(0, self.end - self.start);

          if (self.isActive) {
            const currentOffset = gsap.utils.clamp(0, travel, self.scroll() - self.start);

            // Rebuild the fixed snapshot on refresh without moving it on screen.
            page?.style.setProperty('--background-lock-about', `${currentOffset}px`);
            if (backgroundIsFixed) clearFixedBackgroundStyles();
            fixBackgroundAtCurrentViewportPosition();
            page?.style.setProperty('--background-lock-about', '0px');
            return;
          }

          leaveBackgroundLock(self.scroll() >= self.end ? travel : 0);
        };

        gsap.timeline({
          scrollTrigger: {
            trigger: track,
            start: () => `top top+=${getPinOffset()}`,
            end: () => `+=${window.innerHeight * 2.35}`,
            pin: composition,
            pinSpacing: true,
            scrub: true,
            invalidateOnRefresh: true,
            onEnter: enterBackgroundLock,
            onEnterBack: enterBackgroundLock,
            onLeave: (self) => leaveBackgroundLock(self.end - self.start),
            onLeaveBack: () => leaveBackgroundLock(0),
            onRefresh: syncBackgroundLock,
          },
        }).to(characters, {
          ease: 'none',
          opacity: 1,
          stagger: 0.05,
        });

        return () => {
          clearFixedBackgroundStyles();
          page?.style.removeProperty('--background-lock-about');
        };
      });

      media.add('(max-width: 700px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(characters, { opacity: 0.22 });

        gsap.timeline({
          scrollTrigger: {
            trigger: text,
            start: 'top 84%',
            end: 'bottom 28%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }).to(characters, {
          ease: 'none',
          opacity: 1,
          stagger: 0.05,
        });
      });

      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        window.cancelAnimationFrame(refreshFrame);
        media.revert();
      };
    },
    { dependencies: [children], revertOnUpdate: true, scope: textRef },
  );

  return (
    <p ref={textRef} className={className} aria-label={children}>
      <span aria-hidden="true">
        {Array.from(children).map((character, index) => (
          <span className="scroll-scrub-char" key={`${character}-${index}`}>
            {character}
          </span>
        ))}
      </span>
    </p>
  );
}
