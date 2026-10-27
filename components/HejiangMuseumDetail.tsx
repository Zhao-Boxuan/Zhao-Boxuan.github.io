import type { Project, ProjectCategory } from '@/types/content';
import { BackToProjectLink } from '@/components/BackToProjectLink';
import { ProjectTransitionLink } from '@/components/ProjectTransition';
import { DecorativeNetwork } from '@/components/DecorativeNetwork';
import { ScrollTransitions } from '@/components/ScrollTransitions';

interface HejiangMuseumDetailProps {
  category?: ProjectCategory;
  nextProject: Project;
  project: Project;
}

const portfolioSheets = [
  {
    alt: 'Project details, participation stages, responsibilities, spatial axonometric and three principal museum scenes',
    height: 2227,
    src: '/images/projects/hejiang-museum/portfolio-02.jpg',
    title: 'Project overview',
  },
  {
    alt: 'Narrative strategy for global brewing culture and the interactive world cuisine table',
    height: 2227,
    src: '/images/projects/hejiang-museum/portfolio-03.jpg',
    title: 'Narrative strategy · Global brewing',
  },
  {
    alt: 'Planting exploration area with landscape studies, brewing cabin diagram and immersive gallery scenes',
    height: 2228,
    src: '/images/projects/hejiang-museum/portfolio-04.jpg',
    title: 'Planting exploration',
  },
  {
    alt: 'Chishui River narrative, flashlight interaction diagram and river valley exhibition scenes',
    height: 2227,
    src: '/images/projects/hejiang-museum/portfolio-05.jpg',
    title: 'Chishui thread',
  },
  {
    alt: 'Hejiang craftsmanship chapter with timber framing studies and traditional production gallery scenes',
    height: 2227,
    src: '/images/projects/hejiang-museum/portfolio-06.jpg',
    title: 'Hejiang craftsmanship',
  },
  {
    alt: 'Traditional craft interactions, fermentation observation installations and interpreted workshop scenes',
    height: 2228,
    src: '/images/projects/hejiang-museum/portfolio-07.jpg',
    title: 'Traditional craftsmanship',
  },
  {
    alt: 'Modern production line diagrams, koji-making interaction and contemporary production gallery scenes',
    height: 2228,
    src: '/images/projects/hejiang-museum/portfolio-08.jpg',
    title: 'Modern production line',
  },
];

export function HejiangMuseumDetail({ category, nextProject, project }: HejiangMuseumDetailProps) {
  return (
    <main className="project-detail hejiang-museum-detail">
      <DecorativeNetwork variant="detail" />
      <ScrollTransitions variant="detail" />

      <header className="detail-nav page-shell hj-topbar">
        <BackToProjectLink projectSlug={project.slug} />
        <span>Work sample / {project.number}</span>
      </header>

      <section className="hj-hero page-shell" id="overview">
        <div className="hj-hero-meta">
          <p className="eyebrow">Cultural Tourism Museum</p>
          <span>{project.year}</span>
          <span>Professional project</span>
        </div>

        <div className="hj-hero-title">
          <p>{category?.title.en ?? 'Embodied Experience'}</p>
          <h1>Hejiang Soy Sauce<br />Study Base Museum</h1>
        </div>

        <div className="hj-hero-deck">
          <p className="hj-hero-role">Hejiang · Luzhou, Sichuan</p>
          <p className="hj-hero-proposition">Designing Exploratory Learning Through Multisensory Interaction</p>
        </div>

        <div className="hj-technical-strip hj-keywords">
          Cultural tourism <span>/</span> Chishui River <span>/</span> Brewing culture <span>/</span> Hejiang craftsmanship <span>/</span> Interactive exhibition
        </div>

        <figure className="hj-hero-figure">
          <img
            alt="Visitors exploring the illuminated fermentation-vat wall and interactive tables in the Hejiang soy sauce museum"
            decoding="async"
            height="1040"
            src="/images/projects/hejiang-museum/cover-carousel.jpg"
            width="1920"
          />
          <figcaption>
            <span>P0-A / Hejiang Soy Sauce Study Base Museum</span>
            <p>The exhibition connects river ecology, global brewing cultures and local soy-sauce craftsmanship through one continuous visitor journey.</p>
          </figcaption>
        </figure>
      </section>

      <section className="hj-introduction page-shell" id="project-overview">
        <div className="hj-overview-body">
          <div className="hj-overview-copy">
            <header className="hj-section-heading">
              <p className="eyebrow">01 / Project overview</p>
              <h2>An Intangible Cultural Heritage Museum</h2>
            </header>
            <p className="hj-author-intro">Set beside the Chishui River, long shaped by brewing culture, the Hejiang Soy Sauce Study Base combines production, learning and tourism. Its museum uses soy sauce to explore relationships between fermentation, craft and place through a layered journey from nature to industry. Replacing one-way interpretation with visitor-led discovery, the design embeds digital content within physical settings inspired by landscapes and workshops. Polarising lenses reveal microscopic fermentation, while flashlight-triggered projections uncover hidden stories. Information unfolds through action, creating a clear content hierarchy and transforming heritage learning into an exploratory, multisensory journey.</p>
          </div>

          <dl className="hj-project-data" aria-label="Project information">
            <div><dt>Project period</dt><dd>2025</dd></div>
            <div><dt>Project nature</dt><dd>Professional project</dd></div>
            <div><dt>Project type</dt><dd>Cultural tourism museum · Research &amp; study base</dd></div>
            <div><dt>Participation stages</dt><dd>Schematic design · Design development</dd></div>
            <div><dt>Responsibilities</dt><dd>Preliminary planning · Concept spatial design · Graphic and signage design · Detailed design — undertaken independently</dd></div>
            <div><dt>Bid result</dt><dd>Won the bid</dd></div>
          </dl>
        </div>
      </section>

      <section className="hj-portfolio" id="portfolio-sequence" aria-label="02 / Selected portfolio pages">
        <div className="hj-sheet-list page-shell">
          {portfolioSheets.map((sheet, index) => (
            <figure key={sheet.src}>
              <figcaption className="hj-sheet-title">
                <span>{String(index + 2).padStart(2, '0')}</span>
                <p>{sheet.title}</p>
              </figcaption>
              <img
                alt={sheet.alt}
                decoding="async"
                height={sheet.height}
                loading="lazy"
                src={sheet.src}
                width="3200"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="hj-reflection page-shell" id="personal-reflection">
        <header className="hj-section-heading">
          <p className="eyebrow">03 / Personal reflection</p>
          <h2>Designing Through Restraint</h2>
        </header>
        <p className="hj-reflection-copy">As my first professional project, this work required me to move quickly from theory into application. I independently led early-stage planning, spatial concept design, graphic design, and interaction design, shaping the proposal that won the bid before carrying it into design development. Working across these scales gave me hands-on knowledge of multisensory interaction, but the more important lesson was one of restraint. Rather than adding technology as spectacle, I learned to conceal it within physical encounters, reveal information progressively, and decide what visitors should notice—and when. Coordinating narrative, spatial sequence, media, and technical feasibility taught me to treat interaction as an organising principle for experience, not an isolated feature. That shift continues to inform how I translate research ideas into coherent, buildable environments.</p>
      </section>

      <section className="detail-next page-shell hj-next">
        <div><p className="eyebrow">Next project</p><p>{nextProject.title.en}</p></div>
        <ProjectTransitionLink href={`/projects/${nextProject.slug}`}>Continue <span>↗</span></ProjectTransitionLink>
      </section>
    </main>
  );
}
