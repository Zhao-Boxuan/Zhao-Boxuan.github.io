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
      if (video) {
        if (poster) video.poster = poster;
        video.src = src;
      }
      return;
    }

    const prepare = () => {
      if (poster && !video.poster) video.poster = poster;
      video.preload = 'metadata';
      if (!video.getAttribute('src')) video.src = src;
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.documentElement.classList.contains('project-transition-active')) prepare();
      else {
        video.pause();
        video.preload = 'none';
      }
    }, { rootMargin: '500px 0px' });
    // Actual visibility controls playback independently of the preparation window.
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    const resumePreparation = () => {
      const box = video.getBoundingClientRect();
      if (box.top < innerHeight + 500 && box.bottom > -500) prepare();
    };
    const transitionChanged = (event: Event) => {
      if ((event as CustomEvent<boolean>).detail) {
        video.pause();
        video.preload = 'none';
      } else resumePreparation();
    };

    observer.observe(video);
    visibilityObserver.observe(video);
    video.addEventListener('pointerenter', prepare);
    video.addEventListener('focusin', prepare);
    window.addEventListener('project-transition-state', transitionChanged);

    return () => {
      observer.disconnect();
      visibilityObserver.disconnect();
      video.removeEventListener('pointerenter', prepare);
      video.removeEventListener('focusin', prepare);
      window.removeEventListener('project-transition-state', transitionChanged);
      video.pause();
    };
  }, [poster, src]);

  return (
    <video ref={videoRef} aria-label={label} controls playsInline preload="none">
      Your browser does not support HTML5 video playback.
    </video>
  );
}
