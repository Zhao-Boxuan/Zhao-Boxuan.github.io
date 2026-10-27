'use client';

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

type TextTypeProps<T extends ElementType = 'span'> = {
  as?: T;
  className?: string;
  cursorCharacter?: ReactNode;
  cursorClassName?: string;
  initialDelay?: number;
  showCursor?: boolean;
  startOnVisible?: boolean;
  text: string;
  typingSpeed?: number;
  visibleOffset?: number;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function TextType<T extends ElementType = 'span'>({
  as,
  className = '',
  cursorCharacter = '|',
  cursorClassName = '',
  initialDelay = 0,
  showCursor = true,
  startOnVisible = false,
  text,
  typingSpeed = 50,
  visibleOffset = 20,
  ...props
}: TextTypeProps<T>) {
  const Component = (as ?? 'span') as ElementType;
  const characters = useMemo(() => Array.from(text), [text]);
  const [displayedText, setDisplayedText] = useState('');
  const [hasStarted, setHasStarted] = useState(!startOnVisible);
  const containerRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    setDisplayedText('');
    setHasStarted(!startOnVisible);

    const container = containerRef.current;
    if (!startOnVisible || !container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setHasStarted(true);
        observer.disconnect();
      },
      {
        rootMargin: `0px 0px -${Math.max(0, visibleOffset)}px 0px`,
        threshold: 0,
      },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [startOnVisible, text, visibleOffset]);

  useEffect(() => {
    if (!hasStarted) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedText(text);
      return;
    }

    let characterIndex = 0;
    let timeoutId: number;

    const typeNextCharacter = () => {
      characterIndex += 1;
      setDisplayedText(characters.slice(0, characterIndex).join(''));

      if (characterIndex < characters.length) {
        timeoutId = window.setTimeout(typeNextCharacter, typingSpeed);
      }
    };

    timeoutId = window.setTimeout(typeNextCharacter, initialDelay + typingSpeed);
    return () => window.clearTimeout(timeoutId);
  }, [characters, hasStarted, initialDelay, text, typingSpeed]);

  useGSAP(
    () => {
      const cursor = cursorRef.current;
      if (!cursor || !showCursor) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(cursor, { opacity: 1 });
        return;
      }

      gsap.fromTo(
        cursor,
        { opacity: 1 },
        {
          duration: 0.5,
          ease: 'power2.inOut',
          opacity: 0,
          repeat: -1,
          yoyo: true,
        },
      );
    },
    { dependencies: [hasStarted, showCursor], revertOnUpdate: true, scope: containerRef },
  );

  const componentProps = props as ComponentPropsWithoutRef<ElementType>;

  return (
    <Component
      {...componentProps}
      aria-label={text}
      className={`text-type ${className}`.trim()}
      ref={containerRef}
    >
      <span aria-hidden="true" className="text-type__sizer">{text}</span>
      <span aria-hidden="true" className="text-type__animated">
        <span className="text-type__content">{displayedText}</span>
        {showCursor && hasStarted ? (
          <span className={`text-type__cursor ${cursorClassName}`.trim()} ref={cursorRef}>
            {cursorCharacter}
          </span>
        ) : null}
      </span>
    </Component>
  );
}
