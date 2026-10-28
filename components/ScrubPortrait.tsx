'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Language } from '@/types/content';

const DEFAULT_PROGRESS = 4 / 6;
const INTERFACE_HEIGHT = 34;
const PIXEL_COUNT = 10;
const PIXEL_COLORS = ['#111213', '#686a6c', '#aeb0b0', '#efefec'];
const SCRUB_INTERVAL = 1000 / 30;
const GLITCH_INTERVAL = 1000 / 30;
const VIDEO_SOURCE = '/images/profile/zbx-turntable-continuous.mp4';

type GlitchBand = {
  alpha: number;
  contrast: number;
  height: number;
  shift: number;
  y: number;
};

gsap.registerPlugin(useGSAP);

export function ScrubPortrait({ language }: { language: Language }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const glitchCanvasRef = useRef<HTMLCanvasElement>(null);
  const pixelRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const durationRef = useRef(0);
  const progressRef = useRef(DEFAULT_PROGRESS);
  const targetProgressRef = useRef(DEFAULT_PROGRESS);
  const scrubFrameRef = useRef(0);
  const scrubTickRef = useRef(0);
  const seekPendingRef = useRef(false);
  const draggingPointerRef = useRef<number | null>(null);
  const glitchFrameRef = useRef(0);
  const glitchTickRef = useRef(0);
  const glitchBornRef = useRef(0);
  const glitchBandsRef = useRef<GlitchBand[]>([]);
  const interactedRef = useRef(false);
  const pointerInputRef = useRef(false);
  const visibleRef = useRef(true);
  const decodedFrameRef = useRef<number | null>(null);
  const [videoSource, setVideoSource] = useState<string>();
  const [videoReady, setVideoReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || typeof IntersectionObserver === 'undefined') {
      setVideoSource(VIDEO_SOURCE);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVideoSource(VIDEO_SOURCE);
        observer.disconnect();
      },
      { rootMargin: `${Math.round(window.innerHeight)}px 0px` },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const markInteraction = () => {
    if (interactedRef.current) return;
    interactedRef.current = true;
    setHasInteracted(true);
  };

  const drawGlitchFrame = (now: number) => {
    glitchFrameRef.current = 0;
    const canvas = glitchCanvasRef.current;
    const card = cardRef.current;
    const video = videoRef.current;
    if (!canvas || !card || !video || !visibleRef.current || document.hidden || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

    if (now - glitchTickRef.current < GLITCH_INTERVAL) {
      glitchFrameRef.current = window.requestAnimationFrame(drawGlitchFrame);
      return;
    }
    glitchTickRef.current = now;

    const context = canvas.getContext('2d');
    if (!context) return;
    const cardWidth = card.clientWidth;
    const cardHeight = card.clientHeight;
    const mediaHeight = Math.max(1, cardHeight - INTERFACE_HEIGHT);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const targetWidth = Math.max(1, Math.round(cardWidth * pixelRatio));
    const targetHeight = Math.max(1, Math.round(mediaHeight * pixelRatio));
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, cardWidth, mediaHeight);

    const age = now - glitchBornRef.current;
    const fade = Math.max(0, 1 - age / 190);
    if (fade <= 0 || video.videoWidth <= 0 || video.videoHeight <= 0) return;

    const sourceWidth = video.videoWidth;
    const sourceHeight = video.videoHeight;
    const coverScale = Math.max(cardWidth / sourceWidth, cardHeight / sourceHeight);
    const visibleSourceWidth = cardWidth / coverScale;
    const visibleSourceHeight = cardHeight / coverScale;
    const sourceX = (sourceWidth - visibleSourceWidth) * 0.5;
    const sourceY = (sourceHeight - visibleSourceHeight) * 0.24;

    glitchBandsRef.current.forEach((band, index) => {
      const clippedY = Math.max(0, Math.min(mediaHeight - band.height, band.y));
      const bandSourceY = sourceY + (clippedY / cardHeight) * visibleSourceHeight;
      const bandSourceHeight = Math.max(0.5, (band.height / cardHeight) * visibleSourceHeight);
      context.save();
      context.globalAlpha = band.alpha * fade;
      context.filter = `grayscale(1) contrast(${band.contrast})`;
      context.globalCompositeOperation = index === 0 ? 'source-over' : 'difference';
      context.drawImage(
        video,
        sourceX,
        bandSourceY,
        visibleSourceWidth,
        bandSourceHeight,
        band.shift,
        clippedY,
        cardWidth,
        band.height,
      );
      context.restore();
    });

    glitchFrameRef.current = window.requestAnimationFrame(drawGlitchFrame);
  };

  const requestGlitchFrame = () => {
    if (visibleRef.current && !document.hidden && !glitchFrameRef.current) glitchFrameRef.current = window.requestAnimationFrame(drawGlitchFrame);
  };

  const requestDecodedGlitchFrame = () => {
    const video = videoRef.current;
    if (!video) return;
    const videoWithFrameCallback = video as HTMLVideoElement & {
      requestVideoFrameCallback?: (callback: () => void) => number;
    };
    if (videoWithFrameCallback.requestVideoFrameCallback) {
      if (decodedFrameRef.current !== null) video.cancelVideoFrameCallback(decodedFrameRef.current);
      decodedFrameRef.current = videoWithFrameCallback.requestVideoFrameCallback(() => {
        decodedFrameRef.current = null;
        requestGlitchFrame();
      });
    } else {
      requestGlitchFrame();
    }
  };

  const scrubVideo = (now: number) => {
    scrubFrameRef.current = 0;
    const video = videoRef.current;
    const duration = durationRef.current;
    if (!video || !visibleRef.current || document.hidden || !Number.isFinite(duration) || duration <= 0) return;
    // Resume from seeked instead of polling a pending decode every frame.
    if (seekPendingRef.current || video.seeking) return;

    const elapsed = scrubTickRef.current ? now - scrubTickRef.current : SCRUB_INTERVAL;
    if (elapsed < SCRUB_INTERVAL) {
      scrubFrameRef.current = window.requestAnimationFrame(scrubVideo);
      return;
    }
    scrubTickRef.current = now;

    const distance = targetProgressRef.current - progressRef.current;
    if (Math.abs(distance) > 0.0005) {
      const smoothing = Math.abs(distance) > 0.18 ? 0.72 : 0.5;
      progressRef.current += distance * smoothing;
    } else {
      progressRef.current = targetProgressRef.current;
    }

    const targetTime = Math.min(duration, Math.max(0, progressRef.current * duration));
    const minimumSeekDistance = Math.max(1 / 45, duration / 360);
    if (!seekPendingRef.current && !video.seeking && Math.abs(video.currentTime - targetTime) >= minimumSeekDistance) {
      seekPendingRef.current = true;
      video.currentTime = targetTime;
    }

    if (
      !seekPendingRef.current && (
        Math.abs(targetProgressRef.current - progressRef.current) > 0.0005
        || Math.abs(video.currentTime - targetProgressRef.current * duration) >= minimumSeekDistance
      )
    ) {
      scrubFrameRef.current = window.requestAnimationFrame(scrubVideo);
    }
  };

  const requestScrub = () => {
    if (visibleRef.current && !document.hidden && !seekPendingRef.current && !scrubFrameRef.current) scrubFrameRef.current = window.requestAnimationFrame(scrubVideo);
  };

  const updatePixelGlitch = (pointerX: number, pointerY: number) => {
    const activePixels = pixelRefs.current.filter((pixel): pixel is HTMLSpanElement => pixel !== null);
    gsap.killTweensOf(activePixels);
    const visiblePixelCount = Math.random() < 0.25 ? 6 : 5;
    const visiblePixels = activePixels.slice(0, visiblePixelCount);
    gsap.set(activePixels.slice(visiblePixelCount), { autoAlpha: 0 });

    visiblePixels.forEach((pixel) => {
      const pixelSize = 5.46 + (Math.random() - 0.5) * 7.68;
      const heightRatio = Math.max(0.25, 0.9 + (Math.random() - 0.5) * 2.176);
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() < 0.4 ? 0.45 + Math.random() * 0.55 : Math.sqrt(Math.random());
      const anchorX = pointerX * 0.7 + Math.random() * 0.3;
      const anchorY = pointerY * 0.7 + Math.random() * 0.3;
      gsap.set(pixel, {
        autoAlpha: 0.16 + Math.random() * 0.34,
        backgroundColor: PIXEL_COLORS[Math.floor(Math.random() * PIXEL_COLORS.length)],
        height: pixelSize * heightRatio,
        left: `${anchorX * 100}%`,
        top: `${anchorY * 100}%`,
        width: pixelSize,
        x: Math.cos(angle) * 100.75 * radius,
        y: Math.sin(angle) * 74.75 * radius,
      });
    });

    gsap.to(visiblePixels, {
      autoAlpha: 0,
      delay: 0.025,
      duration: 0.16,
      ease: 'power2.out',
      overwrite: true,
      stagger: { amount: 0.055, from: 'random' },
    });
  };

  const triggerGlitch = (pointerX: number, pointerY: number, pointerDelta: number, bounds: DOMRect) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const now = performance.now();
    if (now - glitchBornRef.current < GLITCH_INTERVAL) return;

    const mediaHeight = Math.max(1, bounds.height - INTERFACE_HEIGHT);
    const centerY = pointerY * mediaHeight;
    const primaryShift = Math.max(-14, Math.min(14, pointerDelta * bounds.width * 0.7 + (Math.random() - 0.5) * 11));
    const secondaryShift = Math.max(-9, Math.min(9, -primaryShift * 0.5 + (Math.random() - 0.5) * 7));
    const topLineCount = Math.random() < 0.5 ? 1 : 2;
    const bottomLineCount = Math.random() < 0.5 ? 1 : 2;
    const fineLines: GlitchBand[] = [];

    for (let index = 0; index < topLineCount + bottomLineCount; index += 1) {
      const isTop = index < topLineCount;
      fineLines.push({
        alpha: 0.07 + Math.random() * 0.11,
        contrast: 1.72,
        height: 0.45 + Math.random() * 0.45,
        shift: (index % 2 === 0 ? 1 : -1) * (3 + Math.random() * 12),
        y: isTop ? mediaHeight * (0.02 + Math.random() * 0.13) : mediaHeight * (0.85 + Math.random() * 0.13),
      });
    }

    glitchBandsRef.current = [
      {
        alpha: 0.3 + Math.random() * 0.12,
        contrast: 1.62,
        height: 9 + Math.random() * 5,
        shift: primaryShift,
        y: centerY + (Math.random() - 0.5) * mediaHeight * 0.16,
      },
      {
        alpha: 0.08 + Math.random() * 0.06,
        contrast: 1.32,
        height: 2.5 + Math.random() * 1.5,
        shift: secondaryShift,
        y: centerY + (Math.random() - 0.5) * mediaHeight * 0.34,
      },
      ...fineLines,
    ];
    glitchBornRef.current = now;
    updatePixelGlitch(pointerX, pointerY);
    requestGlitchFrame();
  };

  const updateFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' && draggingPointerRef.current !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width <= 0) return;
    const pointerX = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const pointerY = Math.min(1, Math.max(0, (event.clientY - bounds.top) / Math.max(bounds.height, 1)));
    const pointerDelta = pointerX - targetProgressRef.current;
    pointerInputRef.current = true;
    targetProgressRef.current = pointerX;
    requestScrub();
    triggerGlitch(pointerX, pointerY, pointerDelta, bounds);
  };

  const initializeVideo = (video: HTMLVideoElement) => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    durationRef.current = video.duration;
    const initialProgress = pointerInputRef.current ? targetProgressRef.current : DEFAULT_PROGRESS;
    const initialTime = Math.min(video.duration, Math.max(0, initialProgress * video.duration));
    progressRef.current = initialProgress;
    seekPendingRef.current = Math.abs(video.currentTime - initialTime) > 0.001;
    if (seekPendingRef.current) video.currentTime = initialTime;
    else if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) handleVideoSeeked();
  };

  const handleVideoSeeked = () => {
    seekPendingRef.current = false;
    setVideoReady(true);
    if (!performance.getEntriesByName('portrait-frame-ready').length) performance.mark('portrait-frame-ready');
    requestDecodedGlitchFrame();
    requestScrub();
  };

  const { contextSafe } = useGSAP(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    const updateActivity = () => {
      if (visibleRef.current && !document.hidden) requestScrub();
      else {
        window.cancelAnimationFrame(scrubFrameRef.current);
        window.cancelAnimationFrame(glitchFrameRef.current);
        scrubFrameRef.current = 0;
        glitchFrameRef.current = 0;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      updateActivity();
    });
    if (card) observer.observe(card);
    document.addEventListener('visibilitychange', updateActivity);
    const handleMetadata = () => {
      if (video) initializeVideo(video);
    };
    video?.addEventListener('loadedmetadata', handleMetadata);
    if (video && video.readyState >= HTMLMediaElement.HAVE_METADATA) initializeVideo(video);

    return () => {
      video?.removeEventListener('loadedmetadata', handleMetadata);
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateActivity);
      if (video && decodedFrameRef.current !== null) video.cancelVideoFrameCallback?.(decodedFrameRef.current);
      if (scrubFrameRef.current) window.cancelAnimationFrame(scrubFrameRef.current);
      if (glitchFrameRef.current) window.cancelAnimationFrame(glitchFrameRef.current);
    };
  }, { scope: cardRef });

  const handlePointerEnter = contextSafe((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') updateFromPointer(event);
  });

  const handlePointerMove = contextSafe((event: React.PointerEvent<HTMLDivElement>) => {
    markInteraction();
    updateFromPointer(event);
  });

  const handlePointerDown = contextSafe((event: React.PointerEvent<HTMLDivElement>) => {
    markInteraction();
    if (event.pointerType !== 'mouse') {
      draggingPointerRef.current = event.pointerId;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    updateFromPointer(event);
  });

  const handlePointerEnd = contextSafe((event: React.PointerEvent<HTMLDivElement>) => {
    if (draggingPointerRef.current === event.pointerId) {
      draggingPointerRef.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }
  });

  const handlePointerLeave = contextSafe(() => {
    glitchBornRef.current = performance.now() - 145;
    requestGlitchFrame();
    const activePixels = pixelRefs.current.filter((pixel): pixel is HTMLSpanElement => pixel !== null);
    gsap.to(activePixels, { autoAlpha: 0, duration: 0.08, overwrite: true });
  });

  return (
    <div className={`portrait-interaction-shell${hasInteracted ? ' portrait-interaction-engaged' : ''}`}>
      <div className="portrait-interaction-hint">
        <p>
          <span className="portrait-hint-pointer">
            <span className="portrait-hint-line">
              {language === 'en' ? 'Move your cursor — see' : '移动鼠标——看看'}
            </span>
            <span className="portrait-hint-line">
              {language === 'en' ? 'another side of me.' : '我的另一面。'}
            </span>
          </span>
          <span className="portrait-hint-touch">
            <span className="portrait-hint-line">
              {language === 'en' ? 'Swipe horizontally — see' : '左右滑动——看看'}
            </span>
            <span className="portrait-hint-line">
              {language === 'en' ? 'another side of me.' : '我的另一面。'}
            </span>
          </span>
        </p>
        <svg aria-hidden="true" viewBox="0 0 88 56">
          <path d="M3 4 C28 6 55 14 69 36 M54 31 L69 36 L73 22" />
        </svg>
      </div>

      <div
        aria-label={language === 'en'
          ? 'Interactive portrait of Zhao Boxuan; move or swipe horizontally to change the viewing angle'
          : '赵博轩交互式人像；左右移动鼠标或滑动以改变观看角度'}
        className={`portrait-card${videoReady ? ' portrait-video-ready' : ''}`}
        data-motion="reveal"
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        ref={cardRef}
        role="img"
      >
        <div className="portrait-frame" aria-hidden="true" />
        <video
          aria-hidden="true"
          className="portrait-video"
          controls={false}
          muted
          onLoadedData={() => {
            if (!seekPendingRef.current && !videoRef.current?.seeking) handleVideoSeeked();
          }}
          onSeeked={handleVideoSeeked}
          playsInline
          poster="/images/profile/zbx-turntable-poster-3-5s.webp"
          preload={videoSource ? 'auto' : 'none'}
          ref={videoRef}
          src={videoSource}
          tabIndex={-1}
        />
        <canvas className="portrait-glitch-canvas" aria-hidden="true" ref={glitchCanvasRef} />
        <div className="portrait-glitch-pixels" aria-hidden="true">
          {Array.from({ length: PIXEL_COUNT }, (_, index) => (
            <span
              className="portrait-glitch-pixel"
              key={`glitch-pixel-${index}`}
              ref={(node) => {
                pixelRefs.current[index] = node;
              }}
            />
          ))}
        </div>
        <div className="portrait-film-grain" aria-hidden="true" />
        <div className="portrait-interface" aria-hidden="true">
          <span>VISUAL / MOTION STUDY</span>
          <span>MOVE POINTER ↔</span>
        </div>
      </div>
    </div>
  );
}
