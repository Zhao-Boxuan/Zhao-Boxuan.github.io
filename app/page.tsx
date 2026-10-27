'use client';

import { useState } from 'react';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { DecorativeNetwork } from '@/components/DecorativeNetwork';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { Projects } from '@/components/Projects';
import { ScrollTransitions } from '@/components/ScrollTransitions';
import { Strengths } from '@/components/Strengths';
import type { Language } from '@/types/content';

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <div className="home-page" data-language={language} lang={language === 'zh' ? 'zh-CN' : 'en'}>
      <Navbar language={language} onLanguageChange={setLanguage} />
      <main className="site-main">
        <DecorativeNetwork />
        <ScrollTransitions variant="home" />
        <Hero language={language} />
        <About language={language} />
        <Projects language={language} />
        <Strengths language={language} />
        <Contact language={language} />
      </main>
    </div>
  );
}
