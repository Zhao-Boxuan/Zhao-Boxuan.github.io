import { strengths } from '@/data/siteData';
import type { Language } from '@/types/content';
import { SectionHeading } from './SectionHeading';

export function Strengths({ language }: { language: Language }) {
  return (
    <section className="strengths section-space" id="strengths" data-motion="section">
      <div className="page-shell">
        <SectionHeading index="03" eyebrow={language === 'en' ? 'Core / Capabilities' : '核心 / 能力'} title={language === 'en' ? 'Connecting Inquiry, Methods and Application.' : '连接问题研究、方法与实践应用。'} />
        <div className="strength-grid">
          {strengths.map((strength) => (
            <article className="strength-card" key={strength.number} data-motion="reveal" tabIndex={0}>
              <span>{strength.number}</span>
              <div><h3>{strength.title[language]}</h3><p>{strength.description[language]}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
