'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PREPARE_PROJECT_COVER_EVENT, prepareCoverImage, projectCoverImage, rememberProjectCover } from '@/lib/projectImages';

type AsciiProjectImageProps = {
  alt: string;
  src: string;
};

const GLYPHS = '.:-=+*#%@';
const REFERENCE_MONO_STACK = '"Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "IBM Plex Mono", Consolas, monospace';

export function AsciiProjectImage({ alt, src }: AsciiProjectImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const nearViewportRef = useRef(false);
  const preparedRef = useRef(false);
  const cover = projectCoverImage(src);
  const [ready, setReady] = useState(false);

  const drawAscii = useCallback(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if ((!nearViewportRef.current && !preparedRef.current) || !frame || !image || !canvas || !image.complete || !image.naturalWidth) return;

    const rect = frame.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const baseColumns = Math.max(56, Math.min(156, Math.round(rect.width / 6.35)));
    const baseCellWidth = rect.width / baseColumns;
    const requestedGlyphWidth = (baseCellWidth + 0.5) * 1.25 * 0.65;
    const columns = Math.max(44, Math.floor(rect.width / requestedGlyphWidth));
    const rows = Math.max(36, Math.round(baseColumns * (rect.height / rect.width) * 0.86));
    const sampler = document.createElement('canvas');
    sampler.width = columns;
    sampler.height = rows;
    const samplerContext = sampler.getContext('2d', { willReadFrequently: true });
    const context = canvas.getContext('2d');
    if (!samplerContext || !context) return;

    const imageRatio = image.naturalWidth / image.naturalHeight;
    const frameRatio = rect.width / rect.height;
    let drawWidth = columns;
    let drawHeight = rows;

    if (imageRatio > frameRatio) {
      drawWidth *= imageRatio / frameRatio;
    } else {
      drawHeight *= frameRatio / imageRatio;
    }

    // srcset density-corrects naturalWidth/Height. Draw the entire source and
    // crop at the destination, matching centered object-fit: cover without
    // treating those CSS dimensions as source-pixel coordinates.
    samplerContext.drawImage(
      image,
      (columns - drawWidth) / 2,
      (rows - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );

    const pixels = samplerContext.getImageData(0, 0, columns, rows).data;
    const luminances = new Float32Array(columns * rows);
    for (let index = 0; index < luminances.length; index += 1) {
      const pixelIndex = index * 4;
      luminances[index] = (
        pixels[pixelIndex] * 0.2126 +
        pixels[pixelIndex + 1] * 0.7152 +
        pixels[pixelIndex + 2] * 0.0722
      ) / 255;
    }
    const sortedLuminances = Array.from(luminances).sort((a, b) => a - b);
    const blackLimit = sortedLuminances[Math.floor(sortedLuminances.length * 0.5)];
    const darkGrayLimit = sortedLuminances[Math.floor(sortedLuminances.length * 0.75)];

    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, rect.width, rect.height);

    const horizontalAdvance = rect.width / columns;
    const cellHeight = rect.height / rows;
    context.font = `350 ${Math.max(7.5, cellHeight * 1.125)}px ${REFERENCE_MONO_STACK}`;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    const glyphWidths = new Map(Array.from(GLYPHS, (glyph) => [glyph, Math.max(context.measureText(glyph).width, 0.1)]));

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const luminance = luminances[row * columns + column];
        const density = 1 - luminance;
        const glyphIndex = Math.min(GLYPHS.length - 1, Math.floor(density * GLYPHS.length));
        const glyph = GLYPHS[glyphIndex];
        context.fillStyle = luminance <= blackLimit
          ? '#333333'
          : luminance <= darkGrayLimit
            ? '#666666'
            : '#b3b4b3';
        const glyphWidth = glyphWidths.get(glyph)!;
        context.save();
        context.translate(column * horizontalAdvance, row * cellHeight + cellHeight / 2);
        context.scale(horizontalAdvance / glyphWidth, 1);
        context.fillText(glyph, 0, 0);
        context.restore();
      }
    }

    setReady(true);
  }, []);

  const scheduleDraw = useCallback(() => {
    if (!nearViewportRef.current && !preparedRef.current) return;
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(drawAscii);
  }, [drawAscii]);

  useEffect(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    if (!frame || !image) return undefined;
    const prepare = () => { preparedRef.current = true; scheduleDraw(); };
    const resize = () => {
      if (preparedRef.current) prepareCoverImage(image, image.fetchPriority as 'high' | 'auto' | 'low');
      scheduleDraw();
    };
    image.addEventListener(PREPARE_PROJECT_COVER_EVENT, prepare);
    if (image.getAttribute('src')) prepare();
    const observer = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      nearViewportRef.current = entry.isIntersecting;
      if (entry.isIntersecting) {
        prepareCoverImage(image, image.fetchPriority === 'high' ? 'high' : 'auto');
        scheduleDraw();
      }
    }, { rootMargin: '600px 0px' });
    observer.observe(frame);
    visibilityObserver.observe(frame);
    return () => {
      observer.disconnect();
      visibilityObserver.disconnect();
      image.removeEventListener(PREPARE_PROJECT_COVER_EVENT, prepare);
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [scheduleDraw, src]);

  return (
    <div className={`project-ascii-image ${ready ? 'is-ready' : ''}`} ref={frameRef}>
      <img ref={imageRef} data-src={cover?.src ?? src} data-srcset={cover?.srcSet} alt={alt} decoding="async"
        onLoad={() => {
          if (cover) rememberProjectCover(cover.slug, imageRef.current!);
          scheduleDraw();
        }} />
      <canvas className="project-ascii-layer" ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
