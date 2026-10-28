'use client';

import type { ComponentProps, FocusEvent, MouseEvent, PointerEvent, ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { beginProjectReturn, finishProjectReturn, PROJECT_RETURN_READY_EVENT, readProjectReturnSlug } from '@/lib/projectReturn';
import { prepareProjectCover, waitForImage, warmStoredProjectCover } from '@/lib/projectImages';

type NavigationAction = 'push' | 'back';

interface TransitionOptions {
  action?: NavigationAction;
  beforeNavigate?: () => void;
  scroll?: boolean;
  returnProjectSlug?: string;
}

interface ProjectTransitionContextValue {
  transitionTo: (href: string, options?: TransitionOptions) => void;
  prefetch: (href: string) => void;
}

const ProjectTransitionContext = createContext<ProjectTransitionContextValue | null>(null);
const PROJECT_PATH_PREFIX = '/projects/';
const TRANSITION_CIRCLE_LENGTH = 2 * Math.PI * 47;

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  return normalized || '/';
}

function isPortfolioRoute(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  return normalizedPathname === '/' || normalizedPathname.startsWith(PROJECT_PATH_PREFIX);
}

function projectSlugFromPath(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  if (!normalizedPathname.startsWith(PROJECT_PATH_PREFIX)) return null;
  return normalizedPathname.slice(PROJECT_PATH_PREFIX.length).split('/')[0] || null;
}

function getPathname(href: string) {
  if (typeof window === 'undefined') return normalizePathname(href.split(/[?#]/)[0] || '/');
  return normalizePathname(new URL(href, window.location.origin).pathname);
}

export function useProjectTransition() {
  const context = useContext(ProjectTransitionContext);
  if (!context) throw new Error('useProjectTransition must be used inside ProjectTransitionProvider.');
  return context;
}

export function ProjectTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const solidRevealRef = useRef<SVGCircleElement>(null);
  const dashedRevealRef = useRef<SVGCircleElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  const notePrimaryRef = useRef<HTMLSpanElement>(null);
  const noteSecondaryRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const activeRef = useRef(false);
  const completingRef = useRef(false);
  const minimumReachedRef = useRef(false);
  const routeReadyRef = useRef(false);
  const expectedPathRef = useRef<string | null>(null);
  const currentPathRef = useRef(normalizePathname(pathname));
  const transitionSequenceRef = useRef(0);
  const progressRef = useRef({ value: 0 });
  const lastPercentageRef = useRef(-1);
  const completeTransitionRef = useRef<() => void>(() => undefined);
  const tryCompleteRef = useRef<() => void>(() => undefined);
  const returnSlugRef = useRef<string | null>(null);
  const readinessRef = useRef<AbortController | null>(null);
  const prefetchedRef = useRef(new Set<string>());

  const prefetch = useCallback((href: string) => {
    if (activeRef.current || prefetchedRef.current.has(href)) return;
    prefetchedRef.current.add(href);
    router.prefetch(href);
  }, [router]);

  const setPercentage = useCallback(() => {
    const percentage = percentageRef.current;
    if (!percentage) return;
    const value = Math.round(progressRef.current.value);
    if (value === lastPercentageRef.current) return;
    lastPercentageRef.current = value;
    percentage.textContent = `${value}%`;
    percentage.parentElement?.setAttribute('aria-valuenow', String(value));
  }, []);

  const waitForDestination = useCallback(async (destinationPath: string, sequence: number) => {
    readinessRef.current?.abort();
    const controller = new AbortController();
    readinessRef.current = controller;
    const returnSlug = destinationPath === '/' ? returnSlugRef.current : null;
    const nextFrame = () => new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });

    await nextFrame();
    await nextFrame();

    if (destinationPath === '/' && document.documentElement.classList.contains('project-return-pending')) {
      await new Promise<void>(resolve => {
        const finish = () => {
          window.removeEventListener(PROJECT_RETURN_READY_EVENT, finish);
          controller.signal.removeEventListener('abort', finish);
          resolve();
        };
        window.addEventListener(PROJECT_RETURN_READY_EVENT, finish, { once: true });
        controller.signal.addEventListener('abort', finish, { once: true });
        if (controller.signal.aborted || !document.documentElement.classList.contains('project-return-pending')) finish();
      });
    }

    if (controller.signal.aborted || sequence !== transitionSequenceRef.current) return;

    const criticalImage = destinationPath === '/'
      ? (returnSlug ? prepareProjectCover(returnSlug, 'high') : null)
      : document.querySelector<HTMLImageElement>('main img');
    // Only above-fold destination media gates the reveal. Unrelated fonts and
    // below-fold assets must not hold an otherwise usable page behind white.
    const bounds = criticalImage?.getBoundingClientRect();
    if (criticalImage && (returnSlug || (bounds && bounds.top < window.innerHeight && bounds.bottom > 0))) {
      criticalImage.fetchPriority = 'high';
      await waitForImage(criticalImage, controller.signal);
    }
    if (controller.signal.aborted || sequence !== transitionSequenceRef.current) return;

    routeReadyRef.current = true;
    performance.mark('project-transition-route-ready');
    tryCompleteRef.current();
  }, []);

  const startTransition = useCallback((
    href: string,
    options: TransitionOptions = {},
    navigationAlreadyOccurred = false,
  ) => {
    const overlay = overlayRef.current;
    const solidReveal = solidRevealRef.current;
    const dashedReveal = dashedRevealRef.current;
    if (!overlay || !solidReveal || !dashedReveal || activeRef.current) return;

    const destinationPath = getPathname(href);
    const sequence = transitionSequenceRef.current + 1;
    readinessRef.current?.abort();
    transitionSequenceRef.current = sequence;
    returnSlugRef.current = destinationPath === '/' ? (options.returnProjectSlug ?? readProjectReturnSlug()) : null;
    if (returnSlugRef.current) warmStoredProjectCover(returnSlugRef.current);
    expectedPathRef.current = destinationPath;
    activeRef.current = true;
    completingRef.current = false;
    minimumReachedRef.current = false;
    routeReadyRef.current = false;
    progressRef.current.value = 0;
    lastPercentageRef.current = -1;
    setPercentage();

    const useChineseCopy = document.querySelector('.home-page')?.getAttribute('data-language') === 'zh';
    if (notePrimaryRef.current) {
      notePrimaryRef.current.textContent = useChineseCopy
        ? '[建议最大化或横屏浏览]'
        : '[Best viewed maximized or in landscape]';
    }
    if (noteSecondaryRef.current) {
      noteSecondaryRef.current.textContent = useChineseCopy
        ? '感谢访问我的作品集'
        : 'Thank you for viewing my portfolio.';
    }

    timelineRef.current?.kill();
    overlay.dataset.active = 'true';
    document.documentElement.classList.add('project-transition-active');
    window.dispatchEvent(new CustomEvent('project-transition-state', { detail: true }));
    gsap.set(overlay, { autoAlpha: 0, pointerEvents: 'all' });
    gsap.set([solidReveal, dashedReveal], { attr: { 'stroke-dashoffset': TRANSITION_CIRCLE_LENGTH } });

    const navigate = () => {
      if (navigationAlreadyOccurred) {
        if (currentPathRef.current === destinationPath) void waitForDestination(destinationPath, sequence);
        return;
      }

      options.beforeNavigate?.();
      if (options.action === 'back') {
        window.history.back();
      } else {
        router.push(href, { scroll: options.scroll ?? true });
      }
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set([solidReveal, dashedReveal], { attr: { 'stroke-dashoffset': 0 } });
      progressRef.current.value = 0;
      setPercentage();
      minimumReachedRef.current = true;
      navigate();
      return;
    }

    timelineRef.current = gsap.timeline()
      .to(overlay, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, 0)
      .call(navigate, undefined, 0.25)
      .to(solidReveal, {
        attr: { 'stroke-dashoffset': 0 },
        duration: 0.8,
        ease: 'none',
      }, 0.2)
      .to(dashedReveal, {
        attr: { 'stroke-dashoffset': 0 },
        duration: 0.8,
        ease: 'none',
      }, 0.7)
      .to(progressRef.current, {
        duration: 1.5,
        ease: 'none',
        onUpdate: setPercentage,
        value: 92,
      }, 0)
      .call(() => {
        minimumReachedRef.current = true;
        tryCompleteRef.current();
      }, undefined, 1.5);
  }, [router, setPercentage, waitForDestination]);

  useLayoutEffect(() => {
    const normalizedPathname = normalizePathname(pathname);
    currentPathRef.current = normalizedPathname;
    if (normalizedPathname !== '/') finishProjectReturn();
    if (!activeRef.current || normalizedPathname !== expectedPathRef.current) return;
    void waitForDestination(normalizedPathname, transitionSequenceRef.current);
  }, [pathname, waitForDestination]);

  useEffect(() => {
    if (overlayRef.current) overlayRef.current.dataset.hydrated = 'true';
    completeTransitionRef.current = () => {
      const overlay = overlayRef.current;
      const solidReveal = solidRevealRef.current;
      const dashedReveal = dashedRevealRef.current;
      if (!overlay || !solidReveal || !dashedReveal || completingRef.current) return;

      completingRef.current = true;
      timelineRef.current?.kill();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const finishDuration = reduceMotion ? 0 : 0.1;
      const fadeDuration = reduceMotion ? 0.15 : 0.4;

      timelineRef.current = gsap.timeline({
        onComplete: () => {
          overlay.dataset.active = 'false';
          gsap.set(overlay, { autoAlpha: 0, pointerEvents: 'none' });
          document.documentElement.classList.remove('project-transition-active');
          window.dispatchEvent(new CustomEvent('project-transition-state', { detail: false }));
          activeRef.current = false;
          completingRef.current = false;
          expectedPathRef.current = null;
          returnSlugRef.current = null;
        },
      })
        .to([solidReveal, dashedReveal], {
          attr: { 'stroke-dashoffset': 0 },
          duration: finishDuration,
          ease: 'power1.out',
        }, 0)
        .to(progressRef.current, {
          duration: finishDuration,
          ease: 'power1.out',
          onUpdate: setPercentage,
          value: 100,
        }, 0)
        .to(overlay, {
          autoAlpha: 0,
          duration: fadeDuration,
          ease: 'power1.inOut',
        }, finishDuration);
    };

    tryCompleteRef.current = () => {
      if (!activeRef.current || !minimumReachedRef.current || !routeReadyRef.current) return;
      completeTransitionRef.current();
    };
  }, [setPercentage]);

  useEffect(() => {
    const handlePopState = () => {
      const previousPath = currentPathRef.current;
      const destinationPath = normalizePathname(window.location.pathname);
      if (
        previousPath === destinationPath
        || !isPortfolioRoute(previousPath)
        || !isPortfolioRoute(destinationPath)
        || (!previousPath.startsWith(PROJECT_PATH_PREFIX) && !destinationPath.startsWith(PROJECT_PATH_PREFIX))
      ) return;

      if (activeRef.current) {
        readinessRef.current?.abort();
        transitionSequenceRef.current += 1;
        routeReadyRef.current = false;
        expectedPathRef.current = destinationPath;
        const slug = destinationPath === '/' ? projectSlugFromPath(previousPath) : null;
        returnSlugRef.current = slug;
        if (slug) beginProjectReturn(slug);
        else finishProjectReturn();
        return;
      }

      const returningSlug = destinationPath === '/' ? projectSlugFromPath(previousPath) : null;
      if (returningSlug) beginProjectReturn(returningSlug);
      startTransition(destinationPath, { returnProjectSlug: returningSlug ?? undefined }, true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [startTransition]);

  useEffect(() => () => {
    transitionSequenceRef.current += 1;
    readinessRef.current?.abort();
    timelineRef.current?.kill();
    document.documentElement.classList.remove('project-transition-active');
    // A history traversal may replace the document after a detail refresh.
    // Keep the return intent for the destination boot script in that case.
    if (expectedPathRef.current !== '/') finishProjectReturn();
  }, []);

  const contextValue = useMemo<ProjectTransitionContextValue>(() => ({
    transitionTo: (href, options) => startTransition(href, options),
    prefetch,
  }), [startTransition, prefetch]);

  return (
    <ProjectTransitionContext.Provider value={contextValue}>
      {children}
      <div
        aria-label="Loading project"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={0}
        className="project-transition-overlay"
        data-active="false"
        ref={overlayRef}
        role="progressbar"
      >
        <svg aria-hidden="true" className="project-transition-circle project-transition-circle-left" viewBox="0 0 100 100">
          <defs>
            <mask id="project-transition-solid-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <circle
                className="project-transition-mask-track"
                cx="50"
                cy="50"
                r="47"
                ref={solidRevealRef}
                strokeDasharray={`${TRANSITION_CIRCLE_LENGTH} ${TRANSITION_CIRCLE_LENGTH}`}
                strokeDashoffset={TRANSITION_CIRCLE_LENGTH}
                transform="rotate(-90 50 50)"
              />
            </mask>
          </defs>
          <circle
            className="project-transition-circle-stroke"
            cx="50"
            cy="50"
            mask="url(#project-transition-solid-reveal)"
            r="47"
          />
        </svg>

        <svg aria-hidden="true" className="project-transition-circle project-transition-circle-right" viewBox="0 0 100 100">
          <defs>
            <mask id="project-transition-dashed-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <circle
                className="project-transition-mask-track"
                cx="50"
                cy="50"
                r="47"
                ref={dashedRevealRef}
                strokeDasharray={`${TRANSITION_CIRCLE_LENGTH} ${TRANSITION_CIRCLE_LENGTH}`}
                strokeDashoffset={TRANSITION_CIRCLE_LENGTH}
                transform="rotate(90 50 50)"
              />
            </mask>
          </defs>
          <circle className="project-transition-circle-dashed" cx="50" cy="50" mask="url(#project-transition-dashed-reveal)" r="47" strokeDasharray="4.5px 4px" />
        </svg>

        <span className="project-transition-percentage" ref={percentageRef}>0%</span>
        <p className="project-transition-note">
          <span className="project-transition-note-primary" ref={notePrimaryRef}>[Best viewed maximized or in landscape]</span>
          <span className="project-transition-note-secondary" ref={noteSecondaryRef}>Thank you for viewing my portfolio.</span>
        </p>
      </div>
    </ProjectTransitionContext.Provider>
  );
}

interface ProjectTransitionLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  href: string;
}

export function ProjectTransitionLink({ href, onClick, onPointerEnter, onPointerLeave, onFocus, scroll, ...props }: ProjectTransitionLinkProps) {
  const { transitionTo, prefetch } = useProjectTransition();
  const intentTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(intentTimer.current), []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) return;

    event.preventDefault();
    transitionTo(href, { scroll });
  };

  return <Link {...props} prefetch={false} href={href} onClick={handleClick} scroll={scroll}
    onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) => {
      onPointerEnter?.(event);
      clearTimeout(intentTimer.current);
      intentTimer.current = setTimeout(() => prefetch(href), 120);
    }}
    onPointerLeave={(event: PointerEvent<HTMLAnchorElement>) => { onPointerLeave?.(event); clearTimeout(intentTimer.current); }}
    onFocus={(event: FocusEvent<HTMLAnchorElement>) => { onFocus?.(event); prefetch(href); }}
  />;
}
