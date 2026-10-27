'use client';

import { useEffect, useRef } from 'react';

const OVERLAP_TARGETS = [
  'img',
  'video',
  'picture',
  'canvas:not(.site-cursor-canvas)',
  'svg',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'a',
  'button',
  'span',
  'strong',
  'em',
  'li',
  'dt',
  'dd',
  'figcaption',
  'label',
].join(',');

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let frameId = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerVisible = false;
    let pointerInP8Detail = false;
    let overlapTargets: Element[] = [];
    let navigation: Element | null = null;

    const collectTargets = () => {
      overlapTargets = Array.from(document.querySelectorAll(OVERLAP_TARGETS)).filter(
        (element) => !element.closest('.site-cursor'),
      );
      navigation = document.querySelector('.navbar, .detail-nav');
    };

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * pixelRatio);
      canvas.height = Math.round(window.innerHeight * pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const strokeLine = (x1: number, y1: number, x2: number, y2: number) => {
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    };

    const drawCursor = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      frameId = 0;
      if (!pointerVisible) return;

      if (pointerInP8Detail) {
        const lensX = pointerX - 1.65;
        const lensY = pointerY - 1.65;
        const lensRadius = 6.05;

        context.beginPath();
        context.arc(lensX, lensY, lensRadius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 255, 255, 0.4)';
        context.fill();

        const drawMagnifier = (strokeStyle: string, lineWidth: number) => {
          context.beginPath();
          context.arc(lensX, lensY, lensRadius, 0, Math.PI * 2);
          context.moveTo(pointerX + 2.75, pointerY + 2.75);
          context.lineTo(pointerX + 8.25, pointerY + 8.25);
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.lineWidth = lineWidth;
          context.strokeStyle = strokeStyle;
          context.stroke();
        };

        drawMagnifier('#fff', 2.75);
        return;
      }

      const navigationRect = navigation?.getBoundingClientRect();
      const navigationBottom = navigationRect
        ? Math.max(0, Math.min(window.innerHeight, navigationRect.bottom))
        : 0;
      const pointerInNavigation = Boolean(
        navigationRect &&
          pointerX >= navigationRect.left &&
          pointerX <= navigationRect.right &&
          pointerY >= navigationRect.top &&
          pointerY <= navigationRect.bottom,
      );

      context.lineCap = 'butt';
      if (!pointerInNavigation) {
        context.lineWidth = 0.9;
        context.strokeStyle = 'rgba(115, 115, 115, 0.7)';
        strokeLine(0, pointerY, window.innerWidth, pointerY);
        strokeLine(pointerX, navigationBottom, pointerX, window.innerHeight);

        context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        overlapTargets.forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (
            rect.width <= 0 ||
            rect.height <= 0 ||
            rect.right < 0 ||
            rect.left > window.innerWidth ||
            rect.bottom < navigationBottom ||
            rect.top > window.innerHeight
          ) return;

          if (pointerY >= Math.max(navigationBottom, rect.top) && pointerY <= rect.bottom) {
            strokeLine(Math.max(0, rect.left), pointerY, Math.min(window.innerWidth, rect.right), pointerY);
          }

          if (pointerX >= rect.left && pointerX <= rect.right) {
            strokeLine(
              pointerX,
              Math.max(navigationBottom, rect.top),
              pointerX,
              Math.min(window.innerHeight, rect.bottom),
            );
          }
        });
      }

      context.lineWidth = 4;
      context.strokeStyle = '#000';
      strokeLine(pointerX - 14, pointerY, pointerX + 14, pointerY);
      strokeLine(pointerX, pointerY - 14, pointerX, pointerY + 14);
    };

    const requestDraw = () => {
      if (!frameId) frameId = window.requestAnimationFrame(drawCursor);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      const pointerTarget = event.target instanceof Element ? event.target : null;
      pointerInP8Detail = Boolean(pointerTarget?.closest('.sar-p8-detail-stage'));
      canvas.dataset.hotspot = String(Boolean(pointerTarget?.closest('.sar-p8-detail-hotspot button')));
      pointerVisible = true;
      canvas.dataset.visible = 'true';
      requestDraw();
    };

    const hideCursor = () => {
      pointerVisible = false;
      canvas.dataset.visible = 'false';
      requestDraw();
    };

    const handleResize = () => {
      resizeCanvas();
      requestDraw();
    };

    collectTargets();
    resizeCanvas();

    const observer = new MutationObserver(collectTargets);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', requestDraw, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('blur', hideCursor);
    document.documentElement.addEventListener('mouseleave', hideCursor);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', requestDraw);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('blur', hideCursor);
      document.documentElement.removeEventListener('mouseleave', hideCursor);
    };
  }, []);

  return (
    <div className="site-cursor" aria-hidden="true">
      <canvas className="site-cursor-canvas" data-hotspot="false" data-visible="false" ref={canvasRef} />
    </div>
  );
}
