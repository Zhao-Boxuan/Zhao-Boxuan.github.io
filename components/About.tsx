'use client';

import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { experiences, profile, researchTags } from '@/data/siteData';
import type { Language } from '@/types/content';
import { ScrubPortrait } from './ScrubPortrait';
import { SectionHeading } from './SectionHeading';
import { ScrollScrubText } from './ScrollScrubText';

export function About({ language }: { language: Language }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const experienceListRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    const portrait = grid?.querySelector<HTMLElement>('.portrait-card');
    if (!grid || !portrait) return;

    // Match the visible top after the portrait's existing center-based scale.
    const alignCopy = () => {
      const scale = Number.parseFloat(getComputedStyle(portrait).getPropertyValue('--portrait-card-scale')) || 1;
      const height = Number.parseFloat(getComputedStyle(portrait).height);
      grid.style.setProperty('--portrait-top-inset', `${height * (1 - scale) / 2}px`);
    };
    alignCopy();
    const observer = new ResizeObserver(alignCopy);
    observer.observe(portrait);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const list = experienceListRef.current;
    if (!list) return;
    const shell = list.parentElement;

    const equalizeRows = () => {
      list.classList.remove('experience-list-equalized');
      list.style.removeProperty('--experience-row-height');
      shell?.style.removeProperty('--experience-row-height-offset');

      if (window.matchMedia('(max-width: 700px)').matches) return;

      const rows = Array.from(list.querySelectorAll<HTMLElement>('.experience-row'));
      if (!rows.length) return;

      const originalTotalRowHeight = rows.reduce(
        (total, row) => total + row.getBoundingClientRect().height,
        0,
      );
      const firstRowHeight = rows[0].getBoundingClientRect().height;
      const addedRowHeight = Math.max(0, firstRowHeight * rows.length - originalTotalRowHeight);

      list.style.setProperty('--experience-row-height', `${firstRowHeight}px`);
      shell?.style.setProperty('--experience-row-height-offset', `${addedRowHeight}px`);
      list.classList.add('experience-list-equalized');
    };

    equalizeRows();
    window.addEventListener('resize', equalizeRows);

    return () => {
      window.removeEventListener('resize', equalizeRows);
      list.classList.remove('experience-list-equalized');
      list.style.removeProperty('--experience-row-height');
      shell?.style.removeProperty('--experience-row-height-offset');
    };
  }, [language]);

  return (
    <section className="about section-space" id="about" data-motion="section">
      <span className="network-orbit about-orbit-copy" aria-hidden="true" />
      <div className="page-shell">
        <SectionHeading index="01" eyebrow={language === 'en' ? 'Profile / Direction' : '个人 / 方向'} title={language === 'en' ? 'Spatial Practice Across Interaction and Computation.' : '横跨交互与计算的空间实践。'} />

        <div className="about-intro-scroll">
          <div className="about-grid" ref={gridRef}>
            <ScrubPortrait language={language} />

            <div className="about-copy">
              <ScrollScrubText className="about-lead">
                {profile.intro[language]}
              </ScrollScrubText>
              <div className="contact-meta">
                <span>{profile.email}</span>
                <span>{profile.phone}</span>
                <span>{profile.location}</span>
              </div>
              <div className="tag-list" aria-label={language === 'en' ? 'Research directions' : '研究方向'}>
                {researchTags.map((tag) => <span key={tag.en}>{tag[language]}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div ref={experienceListRef} className="experience-list">
          {experiences.map((item) => (
            <article className="experience-row" key={item.organization} tabIndex={0}>
              <div className="experience-period">{item.period}</div>
              <div className="experience-identity">
                {item.logoStyle === 'luminance-mask' ? (
                  <span
                    aria-hidden="true"
                    className="experience-logo experience-logo-mask"
                    style={{ '--experience-logo': `url(${item.logo})` } as CSSProperties}
                  />
                ) : (
                  <span aria-hidden="true" className="experience-logo">
                    <img src={item.logo} alt="" loading="lazy" decoding="async" />
                  </span>
                )}
                <div className="experience-organization">
                  <h3>{item.organization}</h3>
                  <p>{item.role[language]}</p>
                </div>
              </div>
              {item.descriptionSections ? (
                <div className="experience-description experience-description-sections">
                  {item.descriptionSections.map((section) => (
                    <p key={section.keyword.en}>
                      <strong className="experience-description-keyword">{section.keyword[language]}｜</strong>
                      {section.body[language]}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="experience-description">{item.description[language]}</p>
              )}
            </article>
          ))}
        </div>

        <div className="cv-download-row">
          <a
            className="cv-download-link"
            href="/downloads/Zhao-Boxuan-CV.pdf"
            download="Zhao-Boxuan-CV.pdf"
          >
            <span className="folder-glyph" aria-hidden="true" />
            <strong>Download my CV</strong>
          </a>
        </div>
      </div>
    </section>
  );
}
