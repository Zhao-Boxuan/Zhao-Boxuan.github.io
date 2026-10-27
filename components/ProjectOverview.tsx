'use client';

import { Fragment, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Language } from '@/types/content';

const overviewMedia = [
  { src: '/media/project-overview/optimized/01.webp', type: 'image', alt: 'Selected work 01' },
  { src: '/media/project-overview/02_2.mp4', type: 'video', alt: 'Selected work 02' },
  { src: '/media/project-overview/optimized/04_2.webp', type: 'image', alt: 'Selected work 04' },
  { src: '/media/project-overview/optimized/17.webp', type: 'image', alt: 'Selected work 17' },
  { src: '/media/project-overview/optimized/03.webp', type: 'image', alt: 'Selected work 03' },
  { src: '/media/project-overview/optimized/05_3.webp', type: 'image', alt: 'Selected work 05' },
  { src: '/media/project-overview/optimized/10.webp', type: 'image', alt: 'Selected work 10' },
  { src: '/media/project-overview/optimized/11.webp', type: 'image', alt: 'Selected work 11' },
  { src: '/media/project-overview/07.mp4', type: 'video', alt: 'Selected work 07' },
  { src: '/media/project-overview/optimized/06.webp', type: 'image', alt: 'Selected work 06' },
  { src: '/media/project-overview/optimized/08_2.webp', type: 'image', alt: 'Selected work 08' },
  { src: '/media/project-overview/09.mp4', type: 'video', alt: 'Selected work 09' },
  { src: '/media/project-overview/optimized/16.webp', type: 'image', alt: 'Selected work 16' },
  { src: '/media/project-overview/optimized/12.webp', type: 'image', alt: 'Selected work 12' },
  { src: '/media/project-overview/optimized/13.webp', type: 'image', alt: 'Selected work 13' },
  { src: '/media/project-overview/optimized/14_3.webp', type: 'image', alt: 'Selected work 14' },
  { src: '/media/project-overview/15_2.mp4', type: 'video', alt: 'Selected work 15' },
  { src: '/media/project-overview/optimized/18.webp', type: 'image', alt: 'Selected work 18' },
] as const;

const overviewCategories = [
  {
    title: { en: 'Spatial Interfaces', zh: '空间界面' },
    body: {
      en: 'Physical-digital systems connecting spatial mapping, situated media and embodied interaction across real environments. The work moves between research, prototyping and on-site testing.',
      zh: '连接空间映射、在地媒介与具身交互的虚实系统。实践过程往返于研究、原型制作与现场测试之间。',
    },
  },
  {
    title: { en: 'Embodied Experience', zh: '具身体验' },
    body: {
      en: 'Narrative environments shaped through exhibition planning, responsive media and multi-sensory encounters. Each project studies how visitors read, move and participate.',
      zh: '通过展览策划、响应式媒介和多感官体验塑造叙事环境，研究访客如何阅读、移动并参与其中。',
    },
  },
  {
    title: { en: 'Computational Systems', zh: '计算系统' },
    body: {
      en: 'Experiments in game engines, structural mechanics and spatial computation. Geometry, simulation and interaction are developed as one connected working system.',
      zh: '围绕游戏引擎、结构力学与空间计算展开实验，将几何、模拟和交互发展为相互连接的工作系统。',
    },
  },
  {
    title: { en: 'Social Frameworks', zh: '社会框架' },
    body: {
      en: 'Research into shared environments, adaptive use and collective experience. Projects examine how spatial structures can support changing communities and forms of participation.',
      zh: '研究共享环境、适应性使用与集体体验，探索空间结构如何支持不断变化的社群与参与方式。',
    },
  },
] as const;

export function ProjectOverview({ language }: { language: Language }) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const marquee = marqueeRef.current;
    const track = trackRef.current;
    const cursor = cursorRef.current;
    if (!marquee || !track || !cursor) return;

    const figures = Array.from(track.querySelectorAll<HTMLElement>('.project-overview-image'));
    const mediaElements = figures.map((figure) => (
      figure.querySelector<HTMLImageElement | HTMLVideoElement>('.project-overview-image-source')
    ));
    if (figures.length === 0 || mediaElements.some((media) => !media)) return;

    const cursorHome = cursor.parentNode;
    const cursorNextSibling = cursor.nextSibling;
    document.body.appendChild(cursor);

    const resolvedMedia = mediaElements as Array<HTMLImageElement | HTMLVideoElement>;
    const fillSegments = Array.from(cursor.querySelectorAll<HTMLElement>('.cursor-fill-segment'));
    const invertSegments = Array.from(cursor.querySelectorAll<HTMLElement>('.cursor-invert-segment'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let activeIndex = 0;
    let activeMove: gsap.core.Timeline | null = null;
    let hold: gsap.core.Tween | null = null;
    let hovered = false;
    const interactionPauseSources = new Set<'horizontal-wheel' | 'mouse-drag' | 'touch-swipe'>();
    let horizontalWheelResumeTimer = 0;
    let mouseDragPointerId: number | null = null;
    let mouseDragStart: { x: number; y: number } | null = null;
    let mouseDragActive = false;
    let touchStart: { x: number; y: number } | null = null;
    let touchSwipeActive = false;
    let inView = false;
    let covered = false;
    let transitionActive = document.documentElement.classList.contains('project-transition-active');
    let resizeFrame = 0;
    let cursorFrame = 0;
    let pointer: { x: number; y: number } | null = null;
    let disposed = false;
    let ready = false;
    let stageWidth = 0;
    let stageHeight = 0;
    let mobile = false;
    let imageWidths: number[] = [];
    const rendered = figures.map(() => ({ x: 0, fraction: 0, alpha: 0 }));
    const setFigureX = figures.map((figure) => gsap.quickSetter(figure, 'x', 'px'));
    const setMediaX = resolvedMedia.map((media) => gsap.quickSetter(media, 'x', 'px'));
    // quickSetter handles single CSS properties; autoAlpha needs the full CSSPlugin tween path.
    const setOpacity = figures.map((figure) => gsap.quickSetter(figure, 'opacity'));
    const setVisibility = figures.map((figure) => gsap.quickSetter(figure, 'visibility'));
    const videos = resolvedMedia.flatMap((media, index) => (
      media instanceof HTMLVideoElement ? [{ media, index }] : []
    ));
    const playingVideos = new Set<HTMLVideoElement>();
    let playbackIndices = new Set<number>();
    const setCursorX = gsap.quickSetter(cursor, 'x', 'px');
    const setCursorY = gsap.quickSetter(cursor, 'y', 'px');

    const relativeIndex = (index: number, active: number) => {
      let relative = (index - active + figures.length) % figures.length;
      if (relative >= figures.length - 2) relative -= figures.length;
      return relative;
    };

    const measureLayout = () => {
      stageWidth = marquee.clientWidth;
      stageHeight = marquee.clientHeight;
      mobile = window.innerWidth <= 899;
      imageWidths = resolvedMedia.map((media) => {
        const intrinsicWidth = media instanceof HTMLVideoElement ? media.videoWidth : media.naturalWidth;
        const intrinsicHeight = media instanceof HTMLVideoElement ? media.videoHeight : media.naturalHeight;
        const ratio = intrinsicWidth > 0 && intrinsicHeight > 0
          ? intrinsicWidth / intrinsicHeight
          : 16 / 9;
        return stageHeight * ratio;
      });
      figures.forEach((figure, index) => {
        gsap.set(figure, { width: imageWidths[index] });
      });
    };

    const layoutFor = (active: number) => {
      const gap = Math.max(7, Math.min(stageWidth * 0.0056, 11.2));
      const leftSlots = mobile ? [-1] : [-2, -1];
      const rightProfile = mobile ? [1, 0] : [1, 0.56, 0.32, 0.18, 0];
      const fractions = new Map<number, number>([[0, 1]]);
      const positions = new Map<number, number>();

      let fullX = 0;
      leftSlots.forEach((slot) => {
        const occupant = (active + slot + figures.length) % figures.length;
        const fraction = 0.05;
        positions.set(slot, fullX);
        fractions.set(slot, fraction);
        fullX += imageWidths[occupant] * fraction + gap;
      });
      positions.set(0, fullX);

      const rightStart = fullX + imageWidths[active];
      const availableRightWidth = Math.max(0, stageWidth - rightStart - gap * rightProfile.length);
      const leftmostOccupant = (active - leftSlots.length + figures.length) % figures.length;
      const narrowWidth = imageWidths[leftmostOccupant] * 0.05;
      const rightOccupants = rightProfile.map((_, index) => (active + index + 1) % figures.length);
      const visibleWidths = rightOccupants.map((occupant) => Math.min(narrowWidth, imageWidths[occupant]));
      let remainingWidth = Math.max(
        0,
        availableRightWidth - visibleWidths.reduce((total, width) => total + width, 0),
      );
      let flexibleSlots = rightProfile
        .map((weight, index) => ({ index, weight }))
        .filter(({ index, weight }) => (
          weight > 0 && visibleWidths[index] < imageWidths[rightOccupants[index]]
        ));

      while (remainingWidth > 0.01 && flexibleSlots.length > 0) {
        const weightTotal = flexibleSlots.reduce((total, slot) => total + slot.weight, 0);
        const roundWidth = remainingWidth;
        let distributedWidth = 0;

        flexibleSlots.forEach(({ index, weight }) => {
          const capacity = imageWidths[rightOccupants[index]] - visibleWidths[index];
          const requestedWidth = roundWidth * weight / weightTotal;
          const addedWidth = Math.min(capacity, requestedWidth);
          visibleWidths[index] += addedWidth;
          distributedWidth += addedWidth;
        });

        if (distributedWidth <= 0.01) break;
        remainingWidth -= distributedWidth;
        flexibleSlots = flexibleSlots.filter(({ index }) => (
          imageWidths[rightOccupants[index]] - visibleWidths[index] > 0.01
        ));
      }
      let nextX = rightStart + gap;

      rightProfile.forEach((_, index) => {
        const slot = index + 1;
        const occupant = rightOccupants[index];
        const visibleWidth = visibleWidths[index];
        const fraction = Math.min(1, visibleWidth / imageWidths[occupant]);
        positions.set(slot, nextX);
        fractions.set(slot, fraction);
        nextX += visibleWidth + gap;
      });

      if (rightProfile.length > 0) {
        const lastSlot = rightProfile.length;
        const lastOccupant = (active + lastSlot) % figures.length;
        const lastX = positions.get(lastSlot) ?? stageWidth;
        const exactLastFraction = Math.max(0, (stageWidth - lastX) / imageWidths[lastOccupant]);
        fractions.set(lastSlot, Math.min(1, exactLastFraction));
      }

      return figures.map((_, index) => {
        const relative = relativeIndex(index, active);
        const fraction = fractions.get(relative);
        const visible = fraction !== undefined;
        const x = visible
          ? positions.get(relative) ?? stageWidth
          : relative < 0
            ? -imageWidths[index] * 0.12
            : stageWidth + imageWidths[index] * 0.08;
        return {
          alpha: visible ? 1 : 0,
          fraction: fraction ?? 0.01,
          width: imageWidths[index],
          x,
        };
      });
    };

    // A fixed-width overflow window and its media move in opposite directions.
    // Their sum keeps the image at x, revealing exactly fraction * width without scaling.
    const renderFigure = (index: number) => {
      const state = rendered[index];
      const offset = imageWidths[index] * (1 - state.fraction);
      setFigureX[index](state.x - offset);
      setMediaX[index](offset);
      setOpacity[index](state.alpha);
      setVisibility[index](state.alpha > 0 ? 'visible' : 'hidden');
    };

    const syncPlayback = () => {
      const visible = ready && inView && !covered && !transitionActive && !document.hidden;
      const shouldPause = interactionPauseSources.size > 0 || !visible;
      activeMove?.paused(shouldPause);
      hold?.paused(shouldPause);
      videos.forEach(({ media, index }) => {
        const shouldPlay = visible && !reduceMotion && playbackIndices.has(index);
        if (shouldPlay && !playingVideos.has(media)) {
          playingVideos.add(media);
          void media.play().then(() => {
            if (disposed || !playingVideos.has(media)) media.pause();
          }).catch(() => playingVideos.delete(media));
        } else if (!shouldPlay) {
          playingVideos.delete(media);
          media.pause();
        }
      });
    };

    const pauseForInteraction = (source: 'horizontal-wheel' | 'mouse-drag' | 'touch-swipe') => {
      if (interactionPauseSources.has(source)) return;
      interactionPauseSources.add(source);
      syncPlayback();
    };

    const resumeAfterInteraction = (source: 'horizontal-wheel' | 'mouse-drag' | 'touch-swipe') => {
      if (!interactionPauseSources.delete(source)) return;
      syncPlayback();
    };

    const queueNext = () => {
      hold?.kill();
      hold = gsap.delayedCall(1.5, advance);
      syncPlayback();
    };

    const clearAnimationHints = () => {
      figures.forEach((figure) => figure.classList.remove('is-animating'));
    };

    const applyLayout = (active: number, animate: boolean) => {
      const states = layoutFor(active);

      if (!animate || reduceMotion) {
        clearAnimationHints();
        figures.forEach((_, index) => {
          Object.assign(rendered[index], states[index]);
          renderFigure(index);
        });
        playbackIndices = new Set(states.flatMap((state, index) => state.alpha ? [index] : []));
        syncPlayback();
        return;
      }

      activeMove?.kill();
      clearAnimationHints();
      const departingIndex = (activeIndex - (mobile ? 1 : 2) + figures.length) % figures.length;
      const currentStates = layoutFor(activeIndex);
      const departingWidth = currentStates[departingIndex].width * 0.05;
      const movingIndices = figures
        .map((_, index) => index)
        .filter((index) => (
          currentStates[index].alpha > 0
          || states[index].alpha > 0
          || index === departingIndex
        ));
      const movingSet = new Set(movingIndices);

      figures.forEach((figure, index) => {
        if (movingSet.has(index)) {
          figure.classList.add('is-animating');
          return;
        }
        Object.assign(rendered[index], states[index]);
        renderFigure(index);
      });
      playbackIndices = movingSet;

      activeMove = gsap.timeline({
        defaults: { duration: 1, ease: 'power3.inOut' },
        onComplete: () => {
          Object.assign(rendered[departingIndex], states[departingIndex]);
          renderFigure(departingIndex);
          clearAnimationHints();
          activeIndex = active;
          activeMove = null;
          playbackIndices = new Set(states.flatMap((state, index) => state.alpha ? [index] : []));
          queueNext();
        },
      });
      movingIndices.forEach((index) => {
        const isDeparting = index === departingIndex;
        activeMove?.to(rendered[index], {
          alpha: isDeparting ? 1 : states[index].alpha,
          fraction: isDeparting ? currentStates[index].fraction : states[index].fraction,
          x: isDeparting ? -departingWidth - 12 : states[index].x,
          onUpdate: () => renderFigure(index),
        }, 0);
      });
      syncPlayback();
    };

    function advance() {
      if (disposed || reduceMotion) return;
      applyLayout((activeIndex + 1) % figures.length, true);
    }

    const refreshLayout = () => {
      if (!ready) return;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        activeMove?.kill();
        activeMove = null;
        clearAnimationHints();
        hold?.kill();
        hold = null;
        measureLayout();
        applyLayout(activeIndex, false);
        if (!reduceMotion) queueNext();
      });
    };

    const deactivateCursor = () => {
      if (!hovered) return;
      hovered = false;
      cursor.dataset.active = 'false';
      document.body.classList.remove('project-overview-image-cursor-active');
      syncPlayback();
    };

    const setCursorSegment = (
      segment: HTMLElement | undefined,
      left: number,
      top: number,
      width: number,
      height: number,
    ) => {
      if (!segment) return;

      if (width <= 0 || height <= 0) {
        segment.style.visibility = 'hidden';
        return;
      }

      segment.style.visibility = 'visible';
      segment.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      segment.style.width = `${width}px`;
      segment.style.height = `${height}px`;
    };

    const hideUnusedSegments = (segments: HTMLElement[], used: number) => {
      for (let index = used; index < segments.length; index += 1) {
        segments[index].style.visibility = 'hidden';
      }
    };

    const updateCursor = () => {
      cursorFrame = 0;
      if (!pointer || !ready || !hasFinePointer) return;
      // One geometry read per frame; the image bounds come from animation state.
      const marqueeBounds = marquee.getBoundingClientRect();
      const bounds = rendered.map((state, index) => ({
        left: Math.max(marqueeBounds.left, marqueeBounds.left + state.x),
        right: Math.min(marqueeBounds.right, marqueeBounds.left + state.x + imageWidths[index] * state.fraction),
        visible: state.alpha > 0.001,
      }));
      const overImage = pointer.y >= marqueeBounds.top && pointer.y <= marqueeBounds.bottom
        && bounds.some((bound) => bound.visible && pointer!.x >= bound.left && pointer!.x < bound.right);
      const target = document.elementFromPoint(pointer.x, pointer.y);
      if (!overImage || !target || !marquee.contains(target) || covered) {
        deactivateCursor();
        return;
      }

      if (!hovered) {
        hovered = true;
        cursor.dataset.active = 'true';
        document.body.classList.add('project-overview-image-cursor-active');
        syncPlayback();
      }

      const size = 65;
      const left = pointer.x - size / 2;
      const top = pointer.y - size / 2;
      const imageTop = Math.max(0, Math.min(size, marqueeBounds.top - top));
      const imageBottom = Math.max(0, Math.min(size, marqueeBounds.bottom - top));
      const imageHeight = Math.max(0, imageBottom - imageTop);

      const imageIntervals = bounds
        .filter((bounds) => bounds.visible && bounds.right > left && bounds.left < left + size)
        .map((bounds) => ({
          left: Math.max(0, bounds.left - left),
          right: Math.min(size, bounds.right - left),
        }))
        .filter((interval) => interval.right > interval.left)
        .sort((a, b) => a.left - b.left)
        .reduce<Array<{ left: number; right: number }>>((merged, interval) => {
          const previous = merged[merged.length - 1];
          if (previous && interval.left <= previous.right) {
            previous.right = Math.max(previous.right, interval.right);
          } else {
            merged.push({ ...interval });
          }
          return merged;
        }, []);

      let fillCount = 0;
      let invertCount = 0;
      let gapStart = 0;

      setCursorSegment(fillSegments[fillCount], 0, 0, size, imageTop);
      if (imageTop > 0) fillCount += 1;
      setCursorSegment(fillSegments[fillCount], 0, imageBottom, size, size - imageBottom);
      if (imageBottom < size) fillCount += 1;

      imageIntervals.forEach((interval) => {
        setCursorSegment(fillSegments[fillCount], gapStart, imageTop, interval.left - gapStart, imageHeight);
        if (interval.left > gapStart) fillCount += 1;
        setCursorSegment(
          invertSegments[invertCount],
          interval.left,
          imageTop,
          interval.right - interval.left,
          imageHeight,
        );
        invertCount += 1;
        gapStart = interval.right;
      });

      setCursorSegment(fillSegments[fillCount], gapStart, imageTop, size - gapStart, imageHeight);
      if (gapStart < size) fillCount += 1;
      hideUnusedSegments(fillSegments, fillCount);
      hideUnusedSegments(invertSegments, invertCount);

      setCursorX(left);
      setCursorY(top);
    };

    const scheduleCursor = () => {
      if (pointer && !cursorFrame) cursorFrame = requestAnimationFrame(updateCursor);
    };
    const moveCursor = (event: PointerEvent) => {
      if (!hasFinePointer) return;
      pointer = { x: event.clientX, y: event.clientY };
      scheduleCursor();
    };
    const beginMouseDrag = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      mouseDragPointerId = event.pointerId;
      mouseDragStart = { x: event.clientX, y: event.clientY };
      mouseDragActive = false;
    };
    const trackMouseDrag = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.pointerId !== mouseDragPointerId || !mouseDragStart) return;
      const distance = Math.hypot(
        event.clientX - mouseDragStart.x,
        event.clientY - mouseDragStart.y,
      );
      if (!mouseDragActive && distance >= 6) {
        mouseDragActive = true;
        pauseForInteraction('mouse-drag');
      }
    };
    const endMouseDrag = (event: PointerEvent) => {
      if (event.pointerId !== mouseDragPointerId) return;
      mouseDragPointerId = null;
      mouseDragStart = null;
      if (!mouseDragActive) return;
      mouseDragActive = false;
      resumeAfterInteraction('mouse-drag');
    };
    const beginTouchSwipe = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStart = { x: touch.clientX, y: touch.clientY };
      touchSwipeActive = false;
    };
    const trackTouchSwipe = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || !touchStart) return;
      const distance = Math.hypot(touch.clientX - touchStart.x, touch.clientY - touchStart.y);
      if (!touchSwipeActive && distance >= 6) {
        touchSwipeActive = true;
        pauseForInteraction('touch-swipe');
      }
    };
    const endTouchSwipe = () => {
      touchStart = null;
      if (!touchSwipeActive) return;
      touchSwipeActive = false;
      resumeAfterInteraction('touch-swipe');
    };
    const handleHorizontalTrackpad = (event: WheelEvent) => {
      const horizontalMotion = Math.abs(event.deltaX);
      const verticalMotion = Math.abs(event.deltaY);
      const isHorizontalTrackpadGesture = event.deltaMode === 0
        && horizontalMotion > 2
        && horizontalMotion > verticalMotion;
      if (!isHorizontalTrackpadGesture) return;

      pauseForInteraction('horizontal-wheel');
      window.clearTimeout(horizontalWheelResumeTimer);
      horizontalWheelResumeTimer = window.setTimeout(() => {
        resumeAfterInteraction('horizontal-wheel');
      }, 180);
    };
    const leaveCursor = () => {
      pointer = null;
      cancelAnimationFrame(cursorFrame);
      cursorFrame = 0;
      deactivateCursor();
    };
    const visibilityChanged = () => {
      if (document.hidden) leaveCursor();
      syncPlayback();
    };
    const transitionStateChanged = (event: Event) => {
      transitionActive = (event as CustomEvent<boolean>).detail;
      if (transitionActive) leaveCursor();
      syncPlayback();
    };
    const coverageChanged = (event: Event) => {
      covered = (event as CustomEvent<boolean>).detail;
      if (covered) leaveCursor();
      syncPlayback();
    };

    const resizeObserver = new ResizeObserver(refreshLayout);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) leaveCursor();
      syncPlayback();
    }, { threshold: 0.01 });

    marquee.addEventListener('pointerdown', beginMouseDrag);
    marquee.addEventListener('pointermove', trackMouseDrag);
    marquee.addEventListener('pointermove', moveCursor);
    marquee.addEventListener('pointerleave', leaveCursor);
    marquee.addEventListener('touchstart', beginTouchSwipe, { passive: true });
    marquee.addEventListener('touchmove', trackTouchSwipe, { passive: true });
    marquee.addEventListener('touchend', endTouchSwipe, { passive: true });
    marquee.addEventListener('touchcancel', endTouchSwipe, { passive: true });
    marquee.addEventListener('wheel', handleHorizontalTrackpad, { passive: true });
    marquee.addEventListener('gallery-coverage-change', coverageChanged);
    window.addEventListener('pointerup', endMouseDrag);
    window.addEventListener('pointercancel', endMouseDrag);
    window.addEventListener('scroll', scheduleCursor, { passive: true });
    document.addEventListener('visibilitychange', visibilityChanged);
    window.addEventListener('project-transition-state', transitionStateChanged);
    resizeObserver.observe(marquee);
    intersectionObserver.observe(marquee);

    const mediaWaitCleanups: Array<() => void> = [];
    const waitForMedia = (media: HTMLImageElement | HTMLVideoElement) => {
      if (media instanceof HTMLImageElement) {
        return media.decode().catch(() => undefined);
      }

      if (media.readyState >= HTMLMediaElement.HAVE_METADATA && media.videoWidth > 0) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const timeout = window.setTimeout(() => finish(), 5000);
        const finish = () => {
          window.clearTimeout(timeout);
          media.removeEventListener('loadedmetadata', finish);
          media.removeEventListener('error', finish);
          resolve();
        };
        media.addEventListener('loadedmetadata', finish, { once: true });
        media.addEventListener('error', finish, { once: true });
        mediaWaitCleanups.push(finish);
      });
    };
    // If metadata arrives after the bounded startup wait, correct the aspect ratio once.
    videos.forEach(({ media }) => media.addEventListener('loadedmetadata', refreshLayout));

    const startWhenMediaAreReady = async () => {
      await Promise.all(
        resolvedMedia.map(waitForMedia),
      );

      if (disposed) return;
      ready = true;
      measureLayout();
      applyLayout(activeIndex, false);
      if (!reduceMotion) queueNext();
    };

    void startWhenMediaAreReady();

    return () => {
      disposed = true;
      cancelAnimationFrame(resizeFrame);
      cancelAnimationFrame(cursorFrame);
      activeMove?.kill();
      hold?.kill();
      clearAnimationHints();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.clearTimeout(horizontalWheelResumeTimer);
      interactionPauseSources.clear();
      marquee.removeEventListener('pointerdown', beginMouseDrag);
      marquee.removeEventListener('pointermove', trackMouseDrag);
      marquee.removeEventListener('pointermove', moveCursor);
      marquee.removeEventListener('pointerleave', leaveCursor);
      marquee.removeEventListener('touchstart', beginTouchSwipe);
      marquee.removeEventListener('touchmove', trackTouchSwipe);
      marquee.removeEventListener('touchend', endTouchSwipe);
      marquee.removeEventListener('touchcancel', endTouchSwipe);
      marquee.removeEventListener('wheel', handleHorizontalTrackpad);
      marquee.removeEventListener('gallery-coverage-change', coverageChanged);
      window.removeEventListener('pointerup', endMouseDrag);
      window.removeEventListener('pointercancel', endMouseDrag);
      window.removeEventListener('scroll', scheduleCursor);
      document.removeEventListener('visibilitychange', visibilityChanged);
      window.removeEventListener('project-transition-state', transitionStateChanged);
      mediaWaitCleanups.forEach((finish) => finish());
      playingVideos.clear();
      videos.forEach(({ media }) => {
        media.pause();
        media.removeEventListener('loadedmetadata', refreshLayout);
      });
      gsap.set([...figures, ...resolvedMedia], { clearProps: 'transform,opacity,visibility,width' });
      document.body.classList.remove('project-overview-image-cursor-active');
      if (cursorHome) cursorHome.insertBefore(cursor, cursorNextSibling);
    };
  }, { scope: marqueeRef });

  const statementLines = language === 'en'
    ? [
        'My works cover four categories, including physical space installations, XR',
        'development, immersive exhibition planning, game development, structural',
        'mechanics simulation, and spatial computation.',
      ]
    : ['我的实践涵盖四个类别，包括实体空间装置、XR 开发、沉浸式展览策划、游戏开发、结构力学模拟与空间计算。'];
  const statementLabel = statementLines.join(' ');

  return (
    <section className="project-overview" aria-labelledby="project-overview-statement">
      <div className="page-shell project-overview-intro">
        <p id="project-overview-statement" aria-label={statementLabel}>
          <span aria-hidden="true">
            {statementLines.map((line, lineIndex) => (
              <Fragment key={`${language}-${lineIndex}`}>
                {Array.from(line).map((character, characterIndex) => (
                  <span
                    className="project-overview-scrub-char"
                    key={`${lineIndex}-${character}-${characterIndex}`}
                  >
                    {character}
                  </span>
                ))}
                {lineIndex < statementLines.length - 1 ? (
                  <>
                    <span className="project-overview-scrub-char"> </span>
                    <br className="project-overview-desktop-break" />
                  </>
                ) : null}
              </Fragment>
            ))}
          </span>
        </p>
      </div>

      <div
        aria-label={language === 'en' ? 'Selected project covers' : '精选项目封面'}
        className="project-overview-marquee"
        ref={marqueeRef}
      >
        <div className="project-overview-track" ref={trackRef}>
          {overviewMedia.map((media, mediaIndex) => (
            <figure className="project-overview-image" key={media.src}>
              {media.type === 'video' ? (
                <video
                  aria-label={media.alt}
                  className="project-overview-image-source"
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  src={media.src}
                />
              ) : (
                <img
                  alt={media.alt}
                  className="project-overview-image-source"
                  decoding="async"
                  fetchPriority={mediaIndex < 3 ? 'high' : 'auto'}
                  loading="eager"
                  src={media.src}
                />
              )}
            </figure>
          ))}
        </div>
      </div>
      <div className="project-overview-hover-cursor" data-active="false" ref={cursorRef} aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <i className="cursor-fill-segment" key={`fill-${index}`} />
        ))}
        {Array.from({ length: 10 }, (_, index) => (
          <i className="cursor-invert-segment" key={`invert-${index}`} />
        ))}
          <span>
            <b>{language === 'en' ? 'SCROLL ↓' : '下滑 ↓'}</b>
            <b>{language === 'en' ? 'VIEW DETAILS' : '查看详情'}</b>
          </span>
      </div>

      <div className="page-shell project-overview-categories">
        <div className="project-overview-category-grid">
          {overviewCategories.map((category) => (
            <article className="project-overview-category" key={category.title.en}>
              <h3>{category.title[language]}</h3>
              <p>{category.body[language]}</p>
            </article>
          ))}
        </div>
        <footer className="project-overview-footer" aria-hidden="true">
          <span>ARCHIVE / 04 DIRECTORIES</span>
          <span className="project-overview-review">
            {language === 'en' ? 'SCROLL TO REVIEW' : '滚动浏览'}
            <i />
          </span>
        </footer>
      </div>
    </section>
  );
}
