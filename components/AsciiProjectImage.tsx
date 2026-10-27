'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
  const [ready, setReady] = useState(false);

  const drawAscii = useCallback(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!frame || !image || !canvas || !image.complete || !image.naturalWidth) return;

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
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;

    if (imageRatio > frameRatio) {
      sourceWidth = image.naturalHeight * frameRatio;
      sourceX = (image.naturalWidth - sourceWidth) / 2;
    } else {
      sourceHeight = image.naturalWidth / frameRatio;
      sourceY = (image.naturalHeight - sourceHeight) / 2;
    }

    samplerContext.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      columns,
      rows,
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
        const glyphWidth = Math.max(context.measureText(glyph).width, 0.1);
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
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(drawAscii);
  }, [drawAscii]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const observer = new ResizeObserver(scheduleDraw);
    observer.observe(frame);
    return () => {
      observer.disconnect();
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [scheduleDraw]);

  return (
    <div className={`project-ascii-image ${ready ? 'is-ready' : ''}`} ref={frameRef}>
      <img ref={imageRef} src={src} alt={alt} loading="lazy" onLoad={scheduleDraw} />
      <canvas className="project-ascii-layer" ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
