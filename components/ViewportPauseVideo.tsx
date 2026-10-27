'use client';

import { useEffect, useRef } from 'react';

interface ViewportPauseVideoProps {
  label: string;
  poster?: string;
  src: string;
}

export function ViewportPauseVideo({ label, poster, src }: ViewportPauseVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
      }
    });

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <video ref={videoRef} aria-label={label} controls playsInline poster={poster} preload="metadata">
      <source src={src} type="video/mp4" />
      Your browser does not support HTML5 video playback.
    </video>
  );
}
