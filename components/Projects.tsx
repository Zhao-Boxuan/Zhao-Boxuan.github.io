'use client';

import type { CSSProperties } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isProjectUnavailable, projectCategories, projects } from '@/data/projects';
import {
  finishProjectReturn,
  readProjectIndexPosition,
  readProjectReturnSlug,
  revealProjectReturn,
  saveProjectIndexPosition,
} from '@/lib/projectReturn';
import type { Language } from '@/types/content';
import { AsciiProjectImage } from './AsciiProjectImage';
import { prepareProjectCover, rememberProjectCover, waitForImage } from '@/lib/projectImages';
import { GOOEY_TEXT_REVEAL_EVENT, GooeyTextReveal } from './GooeyTextReveal';
import { ProjectOverview } from './ProjectOverview';
import { ProjectTransitionLink } from './ProjectTransition';
import { SectionHeading } from './SectionHeading';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Projects({ language }: { language: Language }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const updateNoticeSequenceRef = useRef(0);
  const [updateNotice, setUpdateNotice] = useState<{ key: number; slug: string } | null>(null);

  const showUpdateNotice = useCallback((slug: string) => {
    updateNoticeSequenceRef.current += 1;
    setUpdateNotice({ key: updateNoticeSequenceRef.current, slug });
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const sequence = sequenceRef.current;

      if (!section || !stage || !sequence) return;

      const returnProjectSlug = readProjectReturnSlug();
      const isProjectReturn = Boolean(returnProjectSlug);

      const page = section.closest<HTMLElement>('.site-main');
      const backgroundLayers = page
        ? gsap.utils.toArray<HTMLElement>('.line-network-home, .continuous-orbit-layer', page)
        : [];
      const footer = stage.querySelector<HTMLElement>('.project-overview-footer');
      const gallery = stage.querySelector<HTMLElement>('.project-overview-marquee');
      const overviewStatement = stage.querySelector<HTMLElement>('#project-overview-statement');
      const overviewCharacters = overviewStatement
        ? gsap.utils.toArray<HTMLElement>('.project-overview-scrub-char', overviewStatement)
        : [];
      const overviewCategoryItems = gsap.utils.toArray<HTMLElement>('.project-overview-category', stage);
      const overviewCategoryContent = overviewCategoryItems.flatMap((item) => (
        gsap.utils.toArray<HTMLElement>('h3, p', item)
      ));
      const viewport = sequence.querySelector<HTMLElement>('.project-folder-viewport');
      const panels = gsap.utils.toArray<HTMLElement>('.project-folder-panel', sequence);
      const contents = gsap.utils.toArray<HTMLElement>('.project-folder-content', sequence);

      if (!footer || !viewport || panels.length === 0) return;

      const media = gsap.matchMedia();

      media.add(
        {
          desktop: '(min-width: 701px)',
          motion: '(prefers-reduced-motion: no-preference)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { desktop, motion, reduceMotion } = context.conditions as {
            desktop: boolean;
            motion: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set([viewport, ...panels, ...contents], { clearProps: 'transform,willChange' });
            gsap.set(overviewCharacters, { clearProps: 'opacity,willChange' });
            gsap.set(overviewCategoryContent, { clearProps: 'opacity,transform,visibility' });
            if (overviewStatement) gsap.set(overviewStatement, { clearProps: 'color' });
            return;
          }

          if (!motion) return;

          const footerLockOffset = 45;
          let categoryReveal: gsap.core.Timeline | null = null;

          if (desktop && overviewCategoryItems.length > 0 && !isProjectReturn) {
            gsap.set(overviewCategoryContent, { autoAlpha: 0, y: 26 });
            categoryReveal = gsap.timeline({ paused: true });

            overviewCategoryItems.forEach((item, index) => {
              const content = gsap.utils.toArray<HTMLElement>('h3, p', item);
              categoryReveal?.to(content, {
                autoAlpha: 1,
                duration: 0.72,
                ease: 'power2.out',
                stagger: 0.08,
                y: 0,
              }, index * 0.2);
            });
          }

          const railHeight = () => {
            const firstTab = panels[0]?.querySelector<HTMLElement>('.project-folder-tabbar');
            return firstTab?.getBoundingClientRect().height ?? 68;
          };

          const panelOffset = (index: number) => 20 + index * railHeight();
          const panelTravel = (panel: HTMLElement, index: number) => {
            return Math.max(1, panel.clientHeight - panelOffset(index));
          };
          const regularContentTravel = (panel: HTMLElement, content: HTMLElement, index: number) => {
            const visibleHeight = panel.clientHeight - panelOffset(index) - railHeight();
            return Math.max(0, content.scrollHeight - visibleHeight + 80);
          };
          const finalContentTravel = (panel: HTMLElement, content: HTMLElement) => {
            const lastCover = panel.querySelector<HTMLElement>('.project-card:last-child .project-image');

            if (!lastCover) return regularContentTravel(panel, content, panels.length - 1);

            const coverOffset = lastCover.getBoundingClientRect().top - content.getBoundingClientRect().top;
            return Math.max(0, coverOffset - 50);
          };

          gsap.set(panels, {
            y: (_index, panel: HTMLElement) => panel.clientHeight,
            willChange: 'transform',
          });
          gsap.set(contents, { y: 0, willChange: 'transform' });

          const timeline = gsap.timeline({ defaults: { ease: 'none' } });

          if (desktop && overviewStatement && overviewCharacters.length > 0) {
            const referenceCharacterCount = Math.max(
              1,
              section.ownerDocument.querySelectorAll('.about-lead .scroll-scrub-char').length,
            );
            const referenceTweenUnits = 0.5 + Math.max(0, referenceCharacterCount - 1) * 0.05;
            const pixelsPerTweenUnit = window.innerHeight * 2.35 / referenceTweenUnits;
            const inkColor = getComputedStyle(document.documentElement)
              .getPropertyValue('--color-ink')
              .trim() || '#000000';

            gsap.set(overviewStatement, { color: inkColor });
            gsap.set(overviewCharacters, { opacity: 0.22, willChange: 'opacity' });
            timeline.to(overviewCharacters, {
              duration: 0.5 * pixelsPerTweenUnit,
              ease: 'none',
              opacity: 1,
              stagger: 0.05 * pixelsPerTweenUnit,
            });
          }

          panels.forEach((panel, index) => {
            const content = contents[index];
            const categoryNumber = panel.dataset.categoryNumber ?? String(index + 1).padStart(2, '0');
            const categoryTitle = panel.querySelector<HTMLElement>('.project-category-header h3');
            const panelStartTime = timeline.duration();
            const travel = panelTravel(panel, index);

            timeline.to(panel, {
              y: () => panelOffset(index),
              duration: travel,
            });

            if (categoryTitle && !isProjectReturn) {
              const titleOffset = categoryTitle.getBoundingClientRect().top - panel.getBoundingClientRect().top;
              const titleRevealTime = panelStartTime + Math.min(travel, Math.max(0, titleOffset + 40));

              timeline.call(
                () => categoryTitle.dispatchEvent(new Event(GOOEY_TEXT_REVEAL_EVENT)),
                undefined,
                titleRevealTime,
              );
            }
            timeline.addLabel(`cat-${categoryNumber}`);

            if (content) {
              const contentTravel = index === panels.length - 1
                ? finalContentTravel(panel, content)
                : regularContentTravel(panel, content, index);
              const contentStartTime = timeline.duration();

              gsap.utils.toArray<HTMLElement>('.project-card[data-project-slug]', content).forEach((card) => {
                const slug = card.dataset.projectSlug;
                const cover = card.querySelector<HTMLElement>('.project-image');
                if (!slug || !cover) return;

                const coverOffset = cover.getBoundingClientRect().top - content.getBoundingClientRect().top;
                const targetTravel = gsap.utils.clamp(0, contentTravel, coverOffset - 24);
                timeline.addLabel(`project-${slug}`, contentStartTime + targetTravel);
              });

              if (contentTravel > 0) {
                timeline.to(content, {
                  y: () => -(index === panels.length - 1
                    ? finalContentTravel(panel, content)
                    : regularContentTravel(panel, content, index)),
                  duration: contentTravel,
                });
              }
            }
          });

          const coverLabels = Object.entries(timeline.labels)
            .filter(([label]) => label.startsWith('project-'))
            .map(([label, time]) => ({ slug: label.slice('project-'.length), time }))
            .sort((a, b) => a.time - b.time);
          const prepareTimelineCovers = (self: ScrollTrigger) => {
            if (self.scroll() < self.start - window.innerHeight) return;
            if (document.documentElement.classList.contains('project-transition-active')) return;
            const time = timeline.time();
            const ahead = window.innerHeight * 3;
            // The clipped panels cannot provide an IntersectionObserver
            // lookahead. Use the same labels that locate the project covers.
            coverLabels.filter(item => item.time >= time - window.innerHeight && item.time <= time + ahead)
              .slice(0, 4).forEach(item => prepareProjectCover(item.slug, item.time <= time + window.innerHeight * 0.7 ? 'high' : 'low'));
          };

          let galleryTop = 0;
          let galleryCovered = false;
          let cat04OrbitActive = false;
          const syncGalleryCoverage = () => {
            const covered = Number(gsap.getProperty(panels[0], 'y')) <= galleryTop;
            if (covered === galleryCovered) return;
            galleryCovered = covered;
            gallery?.dispatchEvent(new CustomEvent('gallery-coverage-change', { detail: covered }));
          };

          const syncCat04Orbit = () => {
            const cat04Panel = panels[3];
            const active = Boolean(
              cat04Panel
              && Number(gsap.getProperty(cat04Panel, 'y')) <= panelOffset(3) + 0.5
            );

            if (active === cat04OrbitActive) return;
            cat04OrbitActive = active;
            page?.classList.toggle('cat04-orbit-active', active);
          };

          const alignViewportToWindow = () => {
            const stageTop = stage.getBoundingClientRect().top;
            const footerBottom = footer.getBoundingClientRect().bottom;
            const viewportY = footerBottom - stageTop - window.innerHeight + footerLockOffset;
            galleryTop = gallery ? gallery.getBoundingClientRect().top - stageTop - viewportY : 0;

            gsap.set(viewport, {
              y: viewportY,
            });
          };

          let backgroundIsFixed = false;

          const clearFixedBackgroundStyles = () => {
            const owner = page?.dataset.backgroundLockOwner;
            if (owner && owner !== 'projects') {
              backgroundIsFixed = false;
              return;
            }

            backgroundLayers.forEach((layer) => {
              layer.style.removeProperty('position');
              layer.style.removeProperty('top');
              layer.style.removeProperty('right');
              layer.style.removeProperty('bottom');
              layer.style.removeProperty('left');
              layer.style.removeProperty('width');
              layer.style.removeProperty('height');
              layer.style.removeProperty('transform');
            });

            if (page?.dataset.backgroundLockOwner === 'projects') {
              delete page.dataset.backgroundLockOwner;
            }
            backgroundIsFixed = false;
          };

          const fixBackgroundAtCurrentViewportPosition = () => {
            if (
              backgroundIsFixed
              || backgroundLayers.length === 0
              || (page?.dataset.backgroundLockOwner && page.dataset.backgroundLockOwner !== 'projects')
            ) return;

            const rects = backgroundLayers.map((layer) => layer.getBoundingClientRect());

            backgroundLayers.forEach((layer, index) => {
              const rect = rects[index];
              layer.style.position = 'fixed';
              layer.style.top = `${rect.top}px`;
              layer.style.right = 'auto';
              layer.style.bottom = 'auto';
              layer.style.left = `${rect.left}px`;
              layer.style.width = `${rect.width}px`;
              layer.style.height = `${rect.height}px`;
              layer.style.transform = 'none';
            });

            if (page) page.dataset.backgroundLockOwner = 'projects';
            backgroundIsFixed = true;
          };

          const enterBackgroundLock = () => {
            fixBackgroundAtCurrentViewportPosition();
            page?.style.setProperty('--background-lock-projects', '0px');
          };

          const leaveBackgroundLock = (offset: number) => {
            page?.style.setProperty('--background-lock-projects', `${Math.max(0, offset)}px`);
            clearFixedBackgroundStyles();
          };

          const syncBackgroundLock = (self: ScrollTrigger) => {
            const travel = Math.max(0, self.end - self.start);

            if (self.isActive) {
              const currentOffset = gsap.utils.clamp(0, travel, self.scroll() - self.start);

              // Rebuild the fixed snapshot after a refresh without changing its visible position.
              if (backgroundIsFixed) {
                page?.style.setProperty('--background-lock-projects', `${currentOffset}px`);
                clearFixedBackgroundStyles();
              }
              enterBackgroundLock();
              return;
            }

            leaveBackgroundLock(self.scroll() >= self.end ? travel : 0);
          };

          alignViewportToWindow();

          const trigger = ScrollTrigger.create({
            animation: timeline,
            anticipatePin: 1,
            end: () => `+=${Math.max(1, Math.ceil(timeline.duration()))}`,
            id: 'project-folder-sequence',
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              alignViewportToWindow();
              syncBackgroundLock(self);
              syncGalleryCoverage();
              syncCat04Orbit();
              prepareTimelineCovers(self);
            },
            onUpdate: (self) => {
              syncGalleryCoverage();
              syncCat04Orbit();
              prepareTimelineCovers(self);
            },
            onEnter: () => {
              enterBackgroundLock();
              categoryReveal?.play();
            },
            onEnterBack: () => {
              enterBackgroundLock();
              categoryReveal?.play();
            },
            onLeave: (self) => {
              leaveBackgroundLock(self.end - self.start);
            },
            onLeaveBack: () => {
              leaveBackgroundLock(0);
              categoryReveal?.reverse();
              page?.classList.remove('cat04-orbit-active');
              cat04OrbitActive = false;
            },
            pin: stage,
            pinSpacing: true,
            scrub: true,
            start: `bottom bottom-=${footerLockOffset}px`,
            trigger: footer,
          });

          timelineRef.current = timeline;
          scrollTriggerRef.current = trigger;

          return () => {
            gallery?.dispatchEvent(new CustomEvent('gallery-coverage-change', { detail: false }));
            clearFixedBackgroundStyles();
            gsap.set(viewport, { clearProps: 'transform' });
            gsap.set(overviewCharacters, { clearProps: 'opacity,willChange' });
            gsap.set(overviewCategoryContent, { clearProps: 'opacity,transform,visibility' });
            if (overviewStatement) gsap.set(overviewStatement, { clearProps: 'color' });
            page?.style.removeProperty('--background-lock-projects');
            page?.classList.remove('cat04-orbit-active');
            timelineRef.current = null;
            scrollTriggerRef.current = null;
          };
        },
        section,
      );

      return () => media.revert();
    },
    { dependencies: [language], revertOnUpdate: true, scope: sectionRef },
  );

  useLayoutEffect(() => {
    const returnProjectSlug = readProjectReturnSlug();
    if (!returnProjectSlug) {
      revealProjectReturn();
      return;
    }
    const savedPosition = readProjectIndexPosition(returnProjectSlug);
    const returnController = new AbortController();
    const criticalImage = prepareProjectCover(returnProjectSlug, 'high');
    const coverReady = waitForImage(criticalImage, returnController.signal);

    let cancelled = false;
    let retryTimer = 0;
    const settleTimers: number[] = [];
    let attempts = 0;
    let restored = false;
    let firstRevealFrame = 0;
    let secondRevealFrame = 0;

    const revealAfterPositionSettles = (restore: () => void) => {
      if (restored) return;
      restored = true;

      firstRevealFrame = window.requestAnimationFrame(() => {
        restore();
        secondRevealFrame = window.requestAnimationFrame(() => {
          void coverReady.then(() => {
            if (cancelled) return;
            // On a fresh document, other pinned sections may finish mounting
            // after our first layout effect. Recalculate their spacing before
            // revealing the cover instead of correcting it visibly afterwards.
            ScrollTrigger.refresh();
            restore();
            firstRevealFrame = window.requestAnimationFrame(() => {
              if (cancelled) return;
              restore();
              finishProjectReturn();
            });
          });
        });
      });
    };

    const restorePosition = () => {
      if (cancelled) return;

      const timeline = timelineRef.current;
      const trigger = scrollTriggerRef.current;
      const labelTime = timeline?.labels[`project-${returnProjectSlug}`];
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let didRestore = false;

      if (!reduceMotion && timeline && trigger && labelTime !== undefined) {
        const progress = gsap.utils.clamp(0, 1, labelTime / Math.max(1, timeline.duration()));
        const destination = trigger.start + (trigger.end - trigger.start) * progress + 1;
        timeline.progress(progress, true);
        window.scrollTo({ behavior: 'auto', top: destination });
        ScrollTrigger.update();
        timeline.progress(progress, true);
        didRestore = true;
      } else if (savedPosition !== null) {
        window.scrollTo({ behavior: 'auto', top: savedPosition });
        ScrollTrigger.update();
        didRestore = true;
      } else if (reduceMotion) {
        const projectCard = document.getElementById(`project-${returnProjectSlug}`);
        projectCard?.scrollIntoView({ behavior: 'auto', block: 'center' });
        didRestore = Boolean(projectCard);
      } else if (attempts < 20) {
        attempts += 1;
        retryTimer = window.setTimeout(restorePosition, 50);
        return;
      } else {
        const projectCard = document.getElementById(`project-${returnProjectSlug}`);
        projectCard?.scrollIntoView({ behavior: 'auto', block: 'center' });
        didRestore = Boolean(projectCard);
      }

      if (didRestore) revealAfterPositionSettles(restorePosition);
    };

    restorePosition();
    settleTimers.push(
      window.setTimeout(restorePosition, 180),
      window.setTimeout(restorePosition, 620),
      window.setTimeout(() => {
        restorePosition();
      }, 1250),
    );

    return () => {
      cancelled = true;
      returnController.abort();
      window.clearTimeout(retryTimer);
      window.cancelAnimationFrame(firstRevealFrame);
      window.cancelAnimationFrame(secondRevealFrame);
      settleTimers.forEach((timer) => window.clearTimeout(timer));
      finishProjectReturn();
    };
  }, [language]);

  useLayoutEffect(() => {
    const unavailableSlug = new URLSearchParams(window.location.search).get('unavailable');
    if (!unavailableSlug || !isProjectUnavailable(unavailableSlug)) return;

    let cancelled = false;
    let retryTimer = 0;

    const revealNotice = () => {
      if (cancelled) return;
      if (document.documentElement.classList.contains('project-return-pending')) {
        retryTimer = window.setTimeout(revealNotice, 50);
        return;
      }

      showUpdateNotice(unavailableSlug);
      window.history.replaceState(window.history.state, '', '/');
    };

    revealNotice();

    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
    };
  }, [showUpdateNotice]);

  const openCategory = (categoryNumber: string) => {
    const panel = sequenceRef.current?.querySelector<HTMLElement>(`[data-category-number="${categoryNumber}"]`);
    Array.from(panel?.querySelectorAll<HTMLElement>('.project-card[data-project-slug]') ?? [])
      .slice(0, 2).forEach(card => prepareProjectCover(card.dataset.projectSlug!, 'high'));
    const timeline = timelineRef.current;
    const trigger = scrollTriggerRef.current;
    const labelTime = timeline?.labels[`cat-${categoryNumber}`];

    if (!timeline || !trigger || labelTime === undefined) {
      document.getElementById(`cat-${categoryNumber}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const progress = labelTime / timeline.duration();
    const destination = trigger.start + (trigger.end - trigger.start) * progress + 1;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      behavior: reduceMotion ? 'auto' : 'smooth',
      top: destination,
    });
  };

  const rememberIndexedProjectPosition = (projectSlug: string) => {
    const image = prepareProjectCover(projectSlug, 'high');
    if (image) rememberProjectCover(projectSlug, image);
    const timeline = timelineRef.current;
    const trigger = scrollTriggerRef.current;
    const labelTime = timeline?.labels[`project-${projectSlug}`];

    if (!timeline || !trigger || labelTime === undefined) {
      saveProjectIndexPosition(projectSlug);
      return;
    }

    const progress = labelTime / Math.max(1, timeline.duration());
    const indexedPosition = trigger.start + (trigger.end - trigger.start) * progress + 1;
    saveProjectIndexPosition(projectSlug, indexedPosition);
  };

  return (
    <section className="projects" id="projects" data-motion="section" ref={sectionRef}>
      <div className="project-intro-page">
        <div className="page-shell project-intro-inner">
          <SectionHeading
            index="02"
            eyebrow={language === 'en' ? 'Research & Practice' : '研究与实践'}
            title={language === 'en' ? 'Four territories of practice.' : '四个实践研究领域。'}
          />
        </div>
      </div>

      <div className="projects-stack-stage" ref={stageRef}>
        <ProjectOverview language={language} />

        <div className="projects-folder-sequence" ref={sequenceRef}>
          <div className="project-folder-viewport">
            <div className="project-folder-stack">
          {projectCategories.map((group, groupIndex) => {
            const groupProjects = group.projectSlugs
              .map((slug) => projects.find((project) => project.slug === slug))
              .filter((project) => project !== undefined);
            const directoryProjects = groupProjects.filter((project) => !isProjectUnavailable(project.slug));

            return (
              <section
                className={`project-category-block project-folder-panel project-folder-panel-${groupIndex + 1}`}
                data-category-number={group.number}
                id={`cat-${group.number}`}
                key={group.id}
                style={{ '--folder-order': groupIndex + 1 } as CSSProperties}
              >
                <div className="project-folder-tabbar">
                  <button
                    aria-label={`${language === 'en' ? 'Open category' : '打开分类'} ${group.number}: ${group.title[language]}`}
                    className="project-folder-tab-button"
                    onClick={() => openCategory(group.number)}
                    type="button"
                  >
                    <span>CAT / {group.number}</span>
                    <strong>{group.title[language]}</strong>
                    <i aria-hidden="true">↘</i>
                  </button>
                  <span className="project-folder-rail-code" aria-hidden="true">
                    ZBX / WORK-{group.number}
                  </span>
                </div>

                <div className="project-folder-content">
                  <div className="page-shell">
                    <header className="project-category-header">
                      <GooeyTextReveal
                        as="h3"
                        restoreSmoothText
                        trigger="manual"
                        triggerStart="top bottom-=40px"
                      >
                        {group.title[language]}
                      </GooeyTextReveal>
                      <p>{group.description[language]}</p>
                      <details className="folder-index">
                        <summary>
                          <span className="folder-glyph" aria-hidden="true" />
                          <span className="project-category-count">{String(directoryProjects.length).padStart(2, '0')} files</span>
                          <strong>{language === 'en' ? 'Open directory' : '打开目录'}</strong>
                        </summary>
                        <div className="folder-popover">
                          <div className="folder-popover-bar">
                            <span>DIR / CAT-{group.number}</span>
                            <span>INDEXED</span>
                          </div>
                          <ol>
                            {directoryProjects.map((project) => (
                              <li key={project.slug}>
                                <ProjectTransitionLink
                                  href={`/projects/${project.slug}`}
                                  onClick={() => rememberIndexedProjectPosition(project.slug)}
                                >
                                  <span className="folder-file-glyph" aria-hidden="true" />
                                  <span>{project.number}</span>
                                  <strong>{project.title[language]}</strong>
                                  <span>{project.year}</span>
                                </ProjectTransitionLink>
                              </li>
                            ))}
                          </ol>
                          <div className="folder-popover-status">
                            <span>SYS / PROJECT ARCHIVE</span>
                            <span>{String(directoryProjects.length).padStart(2, '0')} RECORDS AVAILABLE</span>
                          </div>
                        </div>
                      </details>
                    </header>

                    <div className="projects-grid">
                      {groupProjects.map((project, index) => {
                        const unavailable = isProjectUnavailable(project.slug);
                        const className = `project-card project-${project.accent} ${index === 0 ? 'project-wide' : ''} ${project.status === 'placeholder' ? 'project-is-placeholder' : ''} ${unavailable ? 'project-card-unavailable' : ''}`;
                        const cardContent = (
                          <>
                          <div className="project-image">
                            {project.image ? (
                              <AsciiProjectImage src={project.image} alt={project.imageAlt} />
                            ) : (
                              <div className="project-placeholder-visual" role="img" aria-label={project.imageAlt}>
                                <span>{project.number}</span>
                                <strong>Documentation pending</strong>
                              </div>
                            )}
                            <span className="media-note">{project.image ? `Project cover / ${project.year}` : 'Placeholder / Awaiting source material'}</span>
                            {updateNotice?.slug === project.slug && (
                              <span
                                aria-live="polite"
                                className="project-update-notice"
                                key={updateNotice.key}
                                onAnimationEnd={() => {
                                  setUpdateNotice((current) => current?.key === updateNotice.key ? null : current);
                                }}
                                role="status"
                              >
                                Currently being updated. Please stay tuned.
                              </span>
                            )}
                          </div>
                          <div className="project-meta">
                            <span className="project-number">/{project.number}</span>
                            <div>
                              <p>{project.category[language]}</p>
                              <h3>
                                {project.slug === 'digi-tao' && (
                                  <span aria-hidden="true" className="project-work-sample-star">★</span>
                                )}
                                {project.title[language]}
                                {project.slug === 'digi-tao' && (
                                  <span className="project-work-sample-note">（Work Sample）</span>
                                )}
                              </h3>
                              <p className="project-summary">{project.summary[language]}</p>
                            </div>
                            <span className="project-arrow" aria-hidden="true">{unavailable ? '···' : '↗'}</span>
                          </div>
                          </>
                        );

                        if (unavailable) {
                          return (
                            <div
                              aria-label={`${project.title[language]}. ${language === 'en' ? 'Currently being updated. Please stay tuned.' : '正在更新中，敬请期待。'}`}
                              className={className}
                              data-motion="project"
                              data-project-slug={project.slug}
                              id={`project-${project.slug}`}
                              key={project.slug}
                              onClick={() => showUpdateNotice(project.slug)}
                              onKeyDown={(event) => {
                                if (event.key !== 'Enter' && event.key !== ' ') return;
                                event.preventDefault();
                                showUpdateNotice(project.slug);
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              {cardContent}
                            </div>
                          );
                        }

                        return (
                          <ProjectTransitionLink
                            className={className}
                            data-motion="project"
                            data-project-slug={project.slug}
                            href={`/projects/${project.slug}`}
                            id={`project-${project.slug}`}
                            key={project.slug}
                            onClick={() => rememberIndexedProjectPosition(project.slug)}
                          >
                            {cardContent}
                          </ProjectTransitionLink>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
