import { profile } from '@/data/siteData';
import type { Language } from '@/types/content';
import { GooeyTextReveal } from './GooeyTextReveal';

export function Contact({ language }: { language: Language }) {
  return (
    <section className="contact" id="contact" data-motion="section">
      <div className="contact-orbit" aria-hidden="true"><span /></div>
      <div className="contact-blueprint" aria-hidden="true">
        <span className="contact-axis contact-axis-x" />
        <span className="contact-axis contact-axis-y" />
        <span className="contact-ring contact-ring-b" />
        <span className="contact-rect contact-rect-a" />
        <span className="contact-rect contact-rect-b" />
        <span className="contact-guide-node contact-guide-node-a" />
        <span className="contact-guide-node contact-guide-node-b" />
        <span className="contact-guide-label">SYS / CONTACT—04</span>
      </div>
      <div className="page-shell contact-inner">
        <div className="contact-top"><span>(04)</span><span>{language === 'en' ? 'Available for research and selected collaborations' : '开放研究与精选合作机会'}</span></div>
        <div className="contact-main">
          <p className="eyebrow">{language === 'en' ? 'Start a conversation' : '开始对话'}</p>
          <GooeyTextReveal as="h2" duration={1.92} restoreSmoothText>
            {language === 'en' ? 'Let’s build interfaces beyond screens.' : '一起创造超越屏幕的界面。'}
          </GooeyTextReveal>
          <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email} <span>↗</span></a>
        </div>
        <footer className="site-footer">
          <span>© 2026 Zhao Boxuan</span>
          <span>Interaction / Spatial / Research</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </section>
  );
}
