'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const sitePhotos = [
  { alt: 'Elevated view of a corner of Xi’an City Wall, its moat and the surrounding urban fabric', src: '/images/projects/digi-tao/p4/site-photos/01.webp?v=20261015-4' },
  { alt: 'City wall and contemporary building frontage along Nanguangji Street', src: '/images/projects/digi-tao/p4/site-photos/02.webp?v=20261015-4' },
  { alt: 'Street approach to Yongning Gate and the city wall', src: '/images/projects/digi-tao/p4/site-photos/03.webp?v=20261015-3' },
  { alt: 'Narrow street between the city wall and commercial frontage', src: '/images/projects/digi-tao/p4/site-photos/04.webp?v=20261015-3' },
  { alt: 'Traditional and contemporary facades beside the city wall', src: '/images/projects/digi-tao/p4/site-photos/05.webp?v=20261015-3' },
  { alt: 'Wenchang Gate and its city wall tower', src: '/images/projects/digi-tao/p4/site-photos/06.webp?v=20261015-3' },
  { alt: 'Low-rise roofs and a cyclist beside the city wall', src: '/images/projects/digi-tao/p4/site-photos/07.webp?v=20261015-3' },
  { alt: 'View from the city wall across Xiangzi Temple District', src: '/images/projects/digi-tao/p4/site-photos/08.webp?v=20261015-3' },
  { alt: 'City wall conservation plaque and historic masonry', src: '/images/projects/digi-tao/p4/site-photos/09.webp?v=20261015-3' },
  { alt: 'Ground-floor storefronts along the district street', src: '/images/projects/digi-tao/p4/site-photos/10.webp?v=20261015-3' },
  { alt: 'Entrance courtyard of Xiangzi Temple', src: '/images/projects/digi-tao/p4/site-photos/11.webp?v=20261015-3' },
  { alt: 'Main courtyard of Xiangzi Temple', src: '/images/projects/digi-tao/p4/site-photos/12.webp?v=20261015-3' },
];

export function SitePhotoCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canMoveBack, setCanMoveBack] = useState(false);
  const [canMoveForward, setCanMoveForward] = useState(true);

  const updateControls = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    setCanMoveBack(viewport.scrollLeft > 2);
    setCanMoveForward(viewport.scrollLeft < maximum - 2);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const frame = window.requestAnimationFrame(updateControls);
    const observer = new ResizeObserver(updateControls);
    observer.observe(viewport);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [updateControls]);

  const moveByOnePhoto = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const photos = viewport.querySelectorAll<HTMLElement>('.sar-site-carousel-item');
    const step = photos.length > 1
      ? photos[1].offsetLeft - photos[0].offsetLeft
      : viewport.clientWidth;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    viewport.scrollBy({
      behavior: reducedMotion ? 'auto' : 'smooth',
      left: direction * step,
    });
  };

  return (
    <figure className="sar-site-carousel">
      <div className="sar-site-carousel-shell">
        <div
          aria-label="Existing conditions field photographs"
          className="sar-site-carousel-viewport"
          onScroll={updateControls}
          ref={viewportRef}
          tabIndex={0}
        >
          <div className="sar-site-carousel-track">
            {sitePhotos.map((photo, index) => (
              <div className="sar-site-carousel-item" key={photo.src}>
                <img
                  alt={photo.alt}
                  decoding="async"
                  height="960"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  src={photo.src}
                  width="1440"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          aria-label="Show previous site photograph"
          className="sar-site-carousel-control sar-site-carousel-control-back"
          disabled={!canMoveBack}
          onClick={() => moveByOnePhoto(-1)}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 18 32">
            <path d="M14 3 4 16l10 13" />
          </svg>
        </button>
        <button
          aria-label="Show next site photograph"
          className="sar-site-carousel-control sar-site-carousel-control-forward"
          disabled={!canMoveForward}
          onClick={() => moveByOnePhoto(1)}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 18 32">
            <path d="m4 3 10 13L4 29" />
          </svg>
        </button>
      </div>
      <figcaption>
        <span>04-E / Existing Conditions Photo Set</span>
        <p>
          Field photographs move from the city wall and surrounding streets towards Xiangzi Temple.
          <small className="sar-site-photo-credit">
            Sources: P01 — <a href="https://www.chinajourneyguide.com/xian-city-wall/">China Journey Guide</a>; P11 — <a href="http://mt.sohu.com/travel/d20171215/210720312_440940.shtml">Sohu Travel</a>; P12 — <a href="https://mbd.baidu.com/newspage/data/dtlandingsuper?nid=dt_4535787251465044686">Baidu News</a>. All other photographs by the author.
          </small>
        </p>
      </figcaption>
    </figure>
  );
}
