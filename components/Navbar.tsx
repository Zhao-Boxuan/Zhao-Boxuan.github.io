'use client';

import { navigation, profile } from '@/data/siteData';
import type { Language } from '@/types/content';

interface NavbarProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function Navbar({ language, onLanguageChange }: NavbarProps) {
  return (
    <header className="navbar">
      <a className="brand" href="#top" aria-label="Back to top">
        <span className="brand-mark">{profile.initials}</span>
        <span className="brand-role">Spatial / Interaction</span>
      </a>

      <nav className="nav-links" aria-label="Primary navigation">
        {navigation.map((item) => (
          <a href={`#${item.id}`} key={item.id}>{item.label[language]}</a>
        ))}
      </nav>

      <div className="nav-actions">
        <div className="language-switch" aria-label="Language selector">
          <button className={language === 'en' ? 'is-active' : ''} onClick={() => onLanguageChange('en')} type="button">EN</button>
          <span>/</span>
          <button className={language === 'zh' ? 'is-active' : ''} onClick={() => onLanguageChange('zh')} type="button">中</button>
        </div>
        <a className="contact-pill" href="#contact">{language === 'en' ? 'Let’s talk' : '联系我'} <span>↗</span></a>
      </div>
    </header>
  );
}
