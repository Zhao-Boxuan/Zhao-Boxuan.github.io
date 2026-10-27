import { profile } from '@/data/siteData';
import type { Language } from '@/types/content';
import { HeroReveal } from './HeroReveal';

export function Hero({ language }: { language: Language }) {
  return (
    <section className="hero" id="top" data-motion="section">
      <div className="hero-media" aria-hidden="true">
        <div className="hero-wash" />
        <div className="hero-grid" />
        <div className="hero-drafting">
          <span className="hero-drafting-axis hero-drafting-axis-x" />
          <span className="hero-drafting-axis hero-drafting-axis-y" />
          <span className="hero-drafting-orbit hero-drafting-orbit-inner" />
          <span className="hero-drafting-orbit hero-drafting-orbit-side" />
          <span className="hero-drafting-rect hero-drafting-rect-a" />
          <span className="hero-drafting-rect hero-drafting-rect-b" />
          <span className="hero-drafting-node hero-drafting-node-a"><i>R / 0420</i></span>
          <span className="hero-drafting-node hero-drafting-node-b"><i>X / 08.33</i></span>
        </div>
      </div>

      <HeroReveal />

      <div className="hero-content page-shell">
        <div className="hero-kicker" data-motion="reveal">
          <span className="signal-dot" />
          <span>{language === 'en' ? 'Interaction · Spatial · Research' : '交互 · 空间 · 研究'}</span>
          <span className="hero-coordinate">31.23°N / 121.47°E</span>
        </div>

        <div className="hero-title-wrap" data-motion="reveal">
          <div className="hero-title-meta">
            <p className="eyebrow">{profile.role[language]}</p>
            <span>{language === 'en' ? 'Research & Practice / Selected Projects 2021—2026' : '研究与实践 / 精选项目 2021—2026'}</span>
          </div>
          <h1>
            <span>{language === 'en' ? 'Zhao' : '赵'}</span>
            <span className="outline-word">{language === 'en' ? 'Boxuan' : '伯轩'}</span>
          </h1>
          <div className="hero-statement">
            <span className="hero-cross">+</span>
            <p>{language === 'en' ? 'Researching spatial intelligence across physical and digital realities.' : '研究物理与数字现实之间的空间智能。'}</p>
          </div>
        </div>

        <div className="hero-footer">
          <p>{profile.statement[language]}</p>
          <span className="hero-spec">SYS.ZBX / REV.01<br />MAX-W 1700 / GRID 12</span>
          <div className="hero-scroll-prompt">
            <span>{language === 'en' ? 'Explore Research & Practice' : '向下滚动，浏览研究与实践'}</span>
            <span aria-hidden="true">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
