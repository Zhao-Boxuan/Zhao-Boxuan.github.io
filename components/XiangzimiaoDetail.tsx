import type { ReactNode } from 'react';
import type { Project, ProjectCategory } from '@/types/content';
import { BackToProjectLink } from '@/components/BackToProjectLink';
import { ProjectTransitionLink } from '@/components/ProjectTransition';
import { BeforeAfterComparison } from '@/components/BeforeAfterComparison';
import { DecorativeNetwork } from '@/components/DecorativeNetwork';
import { P8BreathingAxonometric } from '@/components/P8BreathingAxonometric';
import { ScrollTransitions } from '@/components/ScrollTransitions';
import { SitePhotoCarousel } from '@/components/SitePhotoCarousel';
import {
  articleNav,
  evidenceGroups,
  fieldRequirements,
  headsetStudies,
  modeQuadrants,
  narrativePaths,
  nextTests,
  personalScenes,
  prototypes,
  selectionQuestions,
  sharedScenes,
  spatialTransformationResults,
  spatialTransformationSteps,
  technicalVariables,
  type ResearchAsset,
} from '@/data/xiangzimiao';

interface XiangzimiaoDetailProps {
  category?: ProjectCategory;
  nextProject: Project;
  project: Project;
}

function AssetPlaceholder({ asset, caption }: { asset: ResearchAsset; caption?: string }) {
  return (
    <figure className={`sar-asset sar-asset-${asset.ratio ?? 'landscape'}`}>
      <div role="img" aria-label={`${asset.label} placeholder`}>
        <span>{asset.code}</span>
        <strong>{asset.label}</strong>
        <i>{asset.status === 'confirmed' ? 'Existing material' : 'To be produced'}</i>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function SectionHeading({ index, kicker, title, intro }: { index: string; kicker: string; title: string; intro?: string }) {
  return (
    <header className="sar-heading">
      <p className="eyebrow">P{index} / {kicker}</p>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </header>
  );
}

function EvidenceLabel({ children }: { children: string }) {
  return <span className="sar-evidence-label">{children}</span>;
}

function ResearchNote({ children, className = '', title }: { children: ReactNode; className?: string; title: string }) {
  return (
    <section className={`sar-research-note ${className}`.trim()}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function SecondaryEvidenceFigure({
  alt,
  caption,
  code,
  height,
  src,
  title,
  wide = false,
  width,
}: {
  alt: string;
  caption: string;
  code: string;
  height: number;
  src: string;
  title: string;
  wide?: boolean;
  width: number;
}) {
  return (
    <figure className={`sar-secondary-evidence${wide ? ' sar-secondary-evidence-wide' : ''}`}>
      <div className="sar-secondary-evidence-viewport">
        <img alt={alt} decoding="async" height={height} loading="lazy" src={src} width={width} />
      </div>
      <figcaption>
        <span>{code} / {title}</span>
        <p>{caption}</p>
      </figcaption>
    </figure>
  );
}

const technicalDeviceLabels = [
  'LiDAR mobile device',
  'Optical see-through HMD',
  '5G radio + edge node',
  'HMD + external battery',
  'Open-ear audio',
];

function FiveTechnicalConditionsDiagram() {
  return (
    <figure className="sar-technical-diagram" aria-labelledby="five-conditions-title">
      <header className="sar-technical-diagram-head">
        <span>01-A / Boundary model</span>
        <strong id="five-conditions-title">Five Conditions for Site-ready AR</strong>
        <i>Linked conditions, assessed together</i>
      </header>

      <div className="sar-technical-stage">
        <svg aria-hidden="true" className="sar-technical-field" viewBox="0 0 1200 620" preserveAspectRatio="none">
          <defs>
            <pattern id="technical-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.55" />
            </pattern>
          </defs>
          <rect width="1200" height="620" fill="url(#technical-grid)" opacity="0.32" />
          <path
            className="sar-technical-helix"
            d="M38 345 C129.5 190 312.5 190 404 345 C492.5 500 669.5 500 758 345 C859 190 1061 190 1162 345"
            fill="none"
            strokeWidth="2.08"
            strokeDasharray="6 5.6"
            transform="translate(0 -35)"
          />
          <path
            className="sar-technical-helix"
            d="M38 345 C129.5 500 312.5 500 404 345 C492.5 190 669.5 190 758 345 C859 500 1061 500 1162 345"
            fill="none"
            strokeWidth="1.456"
            transform="translate(0 -35)"
          />
          <path d="M120 88 V548 M360 88 V548 M600 88 V548 M840 88 V548 M1080 88 V548" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 9" />
          <g fill="currentColor">
            <circle cx="120" cy="340" r="4" /><circle cx="360" cy="340" r="4" /><circle cx="600" cy="340" r="4" /><circle cx="840" cy="340" r="4" /><circle cx="1080" cy="340" r="4" />
          </g>
        </svg>

        <img
          aria-hidden="true"
          className="sar-technical-devices"
          src="/images/projects/digi-tao/p1-device-group-v3.png"
          alt=""
        />

        <div className="sar-technical-cells">
          {technicalVariables.map((item, index) => (
            <article key={item.index}>
              <div className="sar-technical-cell-head">
                <span>{item.index}</span>
                <h3>{item.title}</h3>
                {index === 2 && (
                  <div className="sar-edge-inset" aria-label="Device, edge and cloud computation chain">
                    <span>Device</span><i>↔</i><span>Edge</span><i>↔</i><span>Cloud</span>
                  </div>
                )}
              </div>
              <div className="sar-technical-cell-space" />
              <div className="sar-technical-cell-copy">
                <b>{technicalDeviceLabels[index]}</b>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="sar-technical-conclusion">
        <strong>Technical capacity <span>→</span> spatial fit</strong>
        <p>On-site feasibility depends on all five conditions working as one system.</p>
      </div>
      <figcaption>
        Device-class references: <a href="https://www.apple.com/ipad-pro/" target="_blank" rel="noreferrer">Apple iPad Pro with LiDAR</a>, <a href="https://learn.microsoft.com/en-us/hololens/hololens2-hardware" target="_blank" rel="noreferrer">Microsoft HoloLens 2</a>, a representative 5G small cell and edge node, <a href="https://www.apple.com/newsroom/2023/06/introducing-apple-vision-pro/" target="_blank" rel="noreferrer">Apple Vision Pro with external battery</a>, and <a href="https://www.bose.com/p/open-earbuds/bose-ultra-open-earbuds/ULT-HEADPHONEOPN-MSBL-WW.html" target="_blank" rel="noreferrer">Bose Ultra Open Earbuds</a>.
      </figcaption>
    </figure>
  );
}

function ModeGlyph({ code }: { code: string }) {
  if (code === 'Q-01') {
    return (
      <svg className="sar-mode-glyph" viewBox="0 0 240 150" aria-hidden="true">
        <g className="sar-mode-glyph-base">
          <path d="M28 75H212M120 18V132" />
          <path d="M50 35V24H61M179 24H190V35M50 115V126H61M179 126H190V115" />
        </g>
        <g className="sar-mode-glyph-accent">
          <circle cx="120" cy="75" r="49" />
          <circle cx="120" cy="75" r="31" strokeDasharray="4 7" />
          <circle cx="120" cy="75" r="5" className="sar-mode-glyph-fill" />
        </g>
      </svg>
    );
  }

  if (code === 'Q-02') {
    return (
      <svg className="sar-mode-glyph" viewBox="0 0 240 150" aria-hidden="true">
        <g className="sar-mode-glyph-base">
          <path d="M28 75H212M120 18V132" />
          <circle cx="120" cy="75" r="19" />
          <path d="M120 56L77 36M139 75L184 75M120 94L82 117M103 70L61 82" strokeDasharray="4 7" />
        </g>
        <g className="sar-mode-glyph-accent">
          <circle cx="77" cy="36" r="9" /><circle cx="184" cy="75" r="9" />
          <circle cx="82" cy="117" r="9" /><circle cx="61" cy="82" r="9" />
          <circle cx="120" cy="75" r="4" className="sar-mode-glyph-fill" />
        </g>
      </svg>
    );
  }

  if (code === 'Q-03') {
    return (
      <svg className="sar-mode-glyph" viewBox="0 0 240 150" aria-hidden="true">
        <g className="sar-mode-glyph-base">
          <path d="M24 112C35 107 45 95 57 84C82 61 96 34 119 37C143 40 154 105 178 91C194 82 204 72 216 69" strokeDasharray="4 7" />
          <path d="M216 69L205 62M216 69L207 80" />
          <path d="M29 122H211" />
        </g>
        <g className="sar-mode-glyph-accent">
          <circle cx="57" cy="84" r="18" /><circle cx="119" cy="37" r="24" /><circle cx="178" cy="91" r="20" />
          <circle cx="57" cy="84" r="4" className="sar-mode-glyph-fill" />
          <circle cx="119" cy="37" r="4" className="sar-mode-glyph-fill" />
          <circle cx="178" cy="91" r="4" className="sar-mode-glyph-fill" />
        </g>
      </svg>
    );
  }

  return (
    <svg className="sar-mode-glyph" viewBox="0 0 240 150" aria-hidden="true">
      <g className="sar-mode-glyph-base">
        <path d="M85 32L61 56" strokeDasharray="4 7" /><path d="M61 56L63 46M61 56L71 55" />
        <path d="M183 47H150" strokeDasharray="4 7" /><path d="M150 47L158 39M150 47L158 55" />
        <path d="M103 77L141 93" strokeDasharray="4 7" /><path d="M141 93L131 83M141 93L128 96" />
        <path d="M47 93L73 67" strokeDasharray="4 7" /><path d="M73 67L71 77M73 67L63 68" />
        <path d="M195 88L171 108" strokeDasharray="4 7" /><path d="M171 108L173 98M171 108L182 106" />
        <path d="M140 119H175" strokeDasharray="4 7" /><path d="M175 119L167 111M175 119L167 127" />
      </g>
      <g className="sar-mode-glyph-accent">
        <circle cx="85" cy="32" r="9" /><circle cx="183" cy="47" r="9" />
        <circle cx="103" cy="77" r="9" /><circle cx="47" cy="93" r="9" />
        <circle cx="195" cy="88" r="9" /><circle cx="140" cy="119" r="9" />
      </g>
    </svg>
  );
}

const audioSequence = [
  { code: 'Q-01', scene: 'Courtyard theatre', audio: 'Public / zoned soundfield', media: 'shared' },
  { code: 'Q-03', scene: 'AR bus', audio: 'Shared ambience + optional language', media: 'shared' },
  { code: 'Q-02', scene: 'City wall cinema', audio: 'Personal synchronised audio', media: 'personal' },
  { code: 'Q-04', scene: 'Indoor exhibition / outdoor trail', audio: 'Personal spatial or device audio', media: 'personal' },
];

function SceneCard({ scene, index }: { scene: (typeof sharedScenes)[number] | (typeof personalScenes)[number]; index: number }) {
  return (
    <article className="sar-scene-card">
      {scene.code === 'Q-01' ? (
        <BeforeAfterComparison
          afterAlt="Courtyard AR Theatre augmenting a live performance with registered mythic scenery and narrative media"
          afterSrc="/images/projects/digi-tao/scenes/courtyard-ar-theatre-ar.webp"
          beforeAlt="Physical courtyard theatre with performers and audiences before augmented-reality content is activated"
          beforeSrc="/images/projects/digi-tao/scenes/courtyard-ar-theatre-physical.webp"
          title={scene.title}
        />
      ) : scene.code === 'Q-02' ? (
        <BeforeAfterComparison
          afterAlt="City Wall AR Cinema with a personal augmented-reality film aligned to the historic wall"
          afterSrc="/images/projects/digi-tao/scenes/city-wall-cinema-ar.webp"
          beforeAlt="Physical rooftop cinema terrace facing the unaltered Xi'an City Wall"
          beforeSrc="/images/projects/digi-tao/scenes/city-wall-cinema-physical.webp"
          title={scene.title}
        />
      ) : scene.code === 'Q-03' ? (
        <BeforeAfterComparison
          afterAlt="AR Bus view augmenting the city wall route and nearby shopfronts with spatial information and mythic content"
          afterSrc="/images/projects/digi-tao/scenes/ar-bus-ar.webp"
          beforeAlt="Physical view from inside the AR Bus travelling beside Xi'an City Wall"
          beforeSrc="/images/projects/digi-tao/scenes/ar-bus-physical.webp"
          showHint={false}
          title={scene.title}
        />
      ) : scene.code === 'Q-04' ? (
        <BeforeAfterComparison
          afterAlt="Indoor AR exhibition with spatial interpretations of Daoist artefacts and the Eight Immortals"
          afterSrc="/images/projects/digi-tao/scenes/indoor-ar-exhibition-ar-v2.webp"
          beforeAlt="Physical indoor exhibition displaying Daoist artefacts before augmented-reality content is activated"
          beforeSrc="/images/projects/digi-tao/scenes/indoor-ar-exhibition-physical.webp"
          showHint={false}
          title={scene.title}
        />
      ) : (
        <AssetPlaceholder asset={{ code: scene.code, label: `${scene.title} Design Illustration`, status: 'confirmed', ratio: 'wide' }} />
      )}
      <div className="sar-scene-head"><span>{scene.code}</span><span>{scene.mode}</span></div>
      <h3>{scene.title}</h3>
      <p>{scene.body}</p>
      <dl className="sar-scene-facts">
        <div><dt>Anchor</dt><dd>{scene.anchor}</dd></div>
        <div><dt>Audience</dt><dd>{scene.audience}</dd></div>
        <div><dt>Audio</dt><dd>{scene.audio}</dd></div>
        <div><dt>Constraint</dt><dd>{scene.constraint}</dd></div>
      </dl>
      <span className="sar-scene-index">0{index + 1}</span>
    </article>
  );
}

export function XiangzimiaoDetail({ category, nextProject, project }: XiangzimiaoDetailProps) {
  return (
    <main className="project-detail situated-ar-detail">
      <DecorativeNetwork className="line-network-ar" variant="detail" />
      <ScrollTransitions variant="detail" />

      <header className="detail-nav page-shell sar-topbar">
        <BackToProjectLink projectSlug={project.slug} />
        <span>Work sample / {project.number}</span>
      </header>

      <section className="sar-hero page-shell" id="overview">
        <div className="sar-hero-meta">
          <p className="eyebrow">Master&apos;s Thesis · Research-through-Design</p>
          <span>2023–2024</span>
          <span className="sar-hero-role-credit">
            <span>{project.role.en}</span>
            <span aria-hidden="true">·</span>
            <span className="sar-hero-supervisor"><small>Supervisor</small><strong>Simone Chung</strong></span>
          </span>
        </div>
        <div className="sar-hero-title">
          <p>{category?.title.en ?? 'Spatial AR'}</p>
          <h1>Situated AR for a Protected Historic District</h1>
        </div>
        <div className="sar-hero-deck">
          <h2>Selecting shared and personal AR modes under physical conservation constraints.</h2>
          <p>Original thesis: <i>Potential of AR Technology in Spatial Environments in the 5G Era.</i></p>
        </div>
        <div className="sar-technical-strip sar-keywords">Situated AR <span>/</span> Mode selection <span>/</span> Embodied interaction <span>/</span> Heritage district</div>
        <figure className="sar-asset sar-cover-collage">
          <img
            alt="Early concept collage combining Xiangzi Temple District, Xi'an City Wall and proposed augmented-reality experiences"
            decoding="async"
            height="1085"
            src="/images/projects/digi-tao/p0/concept-collage-cover.webp"
            width="2400"
          />
          <figcaption className="sar-caption-with-credit">
            <span>P0-A / Early concept collage — the district, city wall and proposed AR experiences are introduced as one spatial field.</span>
            <span className="sar-image-credit">Illustration by the author.</span>
          </figcaption>
        </figure>
        <div className="sar-question">
          <span>Research question</span>
          <p>How should different AR modes be selected and combined in a historic district where physical redevelopment is tightly restricted?</p>
        </div>
        <div className="sar-overview-copy">
          <p>The study began with a technical review and five speculative spatial prototypes, then reframed their questions through Xiangzi Temple District beside Xi&apos;an&apos;s city wall. Because conservation constraints limit physical redevelopment, the central problem shifted from technological adoption to the fit between each AR mode, its physical anchor, and the visitor&apos;s movement and viewing position.</p>
          <div className="sar-method-note">Technical review · Spatial survey · Stakeholder interviews · Research-through-design</div>
        </div>
        <div className="sar-stage-strip" aria-label="Three connected stages">
          <div><span>Stage 1</span><strong>Exploratory Prototypes</strong><p>Technical review and five site-free prototypes.</p></div>
          <div><span>Stage 2</span><strong>Situated Design</strong><p>Site records turned into explicit requirements, a spatial narrative and four mode configurations.</p></div>
          <div><span>Extension</span><strong>Headset Research</strong><p>Viewing posture, sound and co-presence developed into balance, audio and public-wearability criteria.</p></div>
        </div>
        <div className="sar-contributions">
          <article><span>01</span><h3>Site-led Mode Selection</h3><p>Relate fixed/mobile and shared/personal modes to physical anchors, movement and media distribution.</p></article>
          <article><span>02</span><h3>Shared Place, Different Media</h3><p>Coordinate image, sound and bodily action across four mode configurations in the district.</p></article>
          <article><span>03</span><h3>Scene-driven Headset Design</h3><p>Develop headset requirements from viewing posture, sound and co-presence.</p></article>
        </div>
        <ResearchNote className="sar-hero-note" title="How the research evolved">
          <p>Stage 1 combined a technical and market review with five site-free prototypes. These exploratory design probes surfaced recurring variables: spatial anchoring, movement, media distribution, public visibility and bodily participation.</p>
          <p>Stage 2 turned spatial survey, policy review, field observation, stakeholder interviews and narrative-source analysis into explicit site requirements. Comparing four proposals against those requirements formalised the fixed/mobile × shared/personal matrix and connected each mode to a distinct relation between site, movement, audience and media.</p>
        </ResearchNote>
      </section>

      <div className="sar-article-layout page-shell">
        <aside className="sar-bookmarks" aria-label="In this article">
          <p>In this article</p>
          <ol>{articleNav.map((item) => <li key={item.id}><a href={`#${item.id}`}><span>{item.index}</span><i>{item.label}</i></a></li>)}</ol>
        </aside>

        <article className="sar-article">
          <section className="sar-section" id="technical-boundary">
            <SectionHeading index="01" kicker="Technical conditions" title="From AR Systems to On-site Feasibility" intro="The technology and market review maps the systems, devices and implementation roles available when the study began. It then distils five on-site conditions used to compare the early prototypes, screen later mode configurations and define spatial and device requirements." />
            <div className="sar-statement-row"><blockquote>On-site feasibility depends on five conditions working as one system.</blockquote><p>Network and edge–cloud capacity support data delivery. Actual fit with a place depends on spatial registration, display legibility, processing and connectivity, wearability over time, and audio within a social setting.</p></div>
            <FiveTechnicalConditionsDiagram />
            <figure className="sar-ar-timeline">
              <img
                alt="Timeline of augmented-reality development from early exploratory devices to contemporary consumer AR"
                decoding="async"
                height="2651"
                loading="lazy"
                src="/images/projects/digi-tao/p1/ar-development-timeline-v2.webp"
                width="3200"
              />
              <figcaption className="sar-caption-with-credit">
                <span>01-B / Condensed AR Development Timeline</span>
                <span className="sar-image-credit">Illustration by the author.</span>
              </figcaption>
            </figure>
            <ResearchNote className="sar-market-scan" title="Technology, suppliers and implementation capacity">
              <p>The review separates sensing, rendering, display and content delivery across local, edge and cloud resources. It also maps available display types, tracking components, supplier roles and the policy context that shaped implementation capacity in 2023.</p>
              <div className="sar-secondary-evidence-stack">
                <SecondaryEvidenceFigure
                  alt="Three augmented-reality system architectures: monitor-based, video see-through and optical see-through"
                  caption="The three architectures locate capture, synthesis and display differently, establishing the technical alternatives behind later device and site choices."
                  code="01-C"
                  height={710}
                  src="/images/projects/digi-tao/evidence/three-ar-system-architectures.webp"
                  title="Three AR System Architectures"
                  wide
                  width={4319}
                />
                <SecondaryEvidenceFigure
                  alt="Augmented-reality industry chain from upstream hardware and software through content production and delivery to consumer and business applications"
                  caption="The chain connects upstream hardware and software to content production, delivery and downstream applications, locating cultural tourism within a wider service ecology."
                  code="01-D"
                  height={1350}
                  src="/images/projects/digi-tao/evidence/ar-industry-chain.webp"
                  title="AR Industry Chain"
                  width={2362}
                />
                <SecondaryEvidenceFigure
                  alt="Global augmented-reality vendors and representative products available by early 2023"
                  caption="The early-2023 comparison records substantial variation in display resolution, field of view, battery life and price across available devices."
                  code="01-E"
                  height={1525}
                  src="/images/projects/digi-tao/evidence/global-ar-vendor-layout-early-2023.webp"
                  title="Global AR Vendor Layout · Early 2023"
                  width={1878}
                />
                <SecondaryEvidenceFigure
                  alt="Comparison of United States augmented-reality companies by industry segment and area of strength"
                  caption="Representative U.S. firms divide across headset, display, sensing, input and computer-vision roles."
                  code="01-F"
                  height={1538}
                  src="/images/projects/digi-tao/evidence/us-ar-industry-players-strengths.webp"
                  title="U.S. AR Industry Players and Strengths"
                  width={2047}
                />
                <SecondaryEvidenceFigure
                  alt="Summary of key Chinese policies relevant to augmented and virtual reality from 2016 to 2022"
                  caption="National policies connect AR with 5G, cultural tourism, publishing, consumer devices and technical standards. They expand implementation capacity; local spatial conditions determine where and how a system is used."
                  code="01-G"
                  height={2003}
                  src="/images/projects/digi-tao/evidence/china-ar-policy-summary.webp"
                  title="China AR Policy Summary"
                  width={1878}
                />
              </div>
              <p>This material defines the project&apos;s delivery envelope: what could be assembled, who could provide it and which dependencies had to be considered. Later design decisions narrow that envelope through physical anchors, viewer movement, media distribution, local lighting, body load and operational support.</p>
            </ResearchNote>
          </section>

          <section className="sar-section sar-mode-section" id="mode-selection">
            <SectionHeading index="02" kicker="Mode selection" title="A Comparative Matrix for AR Modes" intro="Fixed or mobile × shared or personal: two independent choices for comparing how an AR experience relates to its site and how its media is distributed." />
            <div className="sar-copy-pair"><p className="sar-lead">Before entering the matrix, each activity is tested against two questions: does spatial alignment add clear functional value, and can the required installation and service work be supported? Conventional media, mixed delivery and no intervention remain valid outcomes.</p><p>Fixed and mobile describe the relation between viewing and a physical reference: the viewpoint is either prescribed or the content responds as the visitor moves. Shared and personal describe media distribution: viewers receive either a common visual stream or independent streams. Crossing the axes makes four configurations comparable through registration, pacing, control, equipment, audio and support work.</p></div>
            <EvidenceLabel>Author research</EvidenceLabel>
            <figure className="sar-mode-framework" aria-labelledby="mode-framework-title">
              <header className="sar-mode-framework-head">
                <span>P2-A / Selection framework</span>
                <strong id="mode-framework-title">2×2 AR Mode-selection Matrix</strong>
                <i>Two independent axes · no preferred quadrant</i>
              </header>
              <div className="sar-mode-grid">
                <div className="sar-mode-corner"><span>Media distribution →</span><i>Spatial relation ↓</i></div>
                <div className="sar-mode-column sar-mode-column-shared"><strong>Shared media</strong><span>One common stream or rhythm</span></div>
                <div className="sar-mode-column sar-mode-column-personal"><strong>Personal media</strong><span>Independent view, language or pace</span></div>
                <div className="sar-mode-row sar-mode-row-fixed"><strong>Fixed</strong><span>Viewing-position constrained</span><i>Designed around a prescribed point, direction or display</i></div>
                <div className="sar-mode-row sar-mode-row-mobile"><strong>Mobile</strong><span>Movement-responsive</span><i>Recalculated across a person or vehicle route</i></div>
                {modeQuadrants.map((mode) => {
                  const mediaClass = mode.mode.includes('Shared') ? 'sar-mode-shared' : 'sar-mode-personal';
                  const mobilityClass = mode.mode.includes('Fixed') ? 'sar-mode-fixed' : 'sar-mode-mobile';
                  const codeClass = `sar-mode-${mode.code.toLowerCase()}`;
                  return (
                    <article aria-label={`${mode.code}: ${mode.scene}`} className={`sar-quadrant ${mediaClass} ${mobilityClass} ${codeClass}`} key={mode.code} tabIndex={0}>
                      <header><span>{mode.code}</span><i>{mode.mode}</i></header>
                      <ModeGlyph code={mode.code} />
                      <div className="sar-quadrant-copy">
                        <h3>{mode.scene}</h3><p>{mode.equipment}</p>
                        <dl><div><dt>Advantage</dt><dd>{mode.advantage}</dd></div><div><dt>Constraint</dt><dd>{mode.limit}</dd></div><div><dt>Audio</dt><dd>{mode.audio}</dd></div></dl>
                      </div>
                    </article>
                  );
                })}
              </div>
              <figcaption>Read across a row to compare shared and personal streams under the same movement condition; read down a column to see what changes when movement enters the experience. Colour identifies media distribution; geometry identifies the spatial relation.</figcaption>
            </figure>
            <figure className="sar-audio-thread-figure" aria-labelledby="audio-thread-title">
              <header><span>P2-B / Sensory distribution</span><strong id="audio-thread-title">Audio Thread</strong><i>Cross-cutting requirement</i></header>
              <div className="sar-audio-sequence">
                {audioSequence.map((item) => (
                  <div className={`sar-audio-step sar-audio-${item.media}`} key={item.code}>
                    <span>{item.code}</span>
                    <strong>{item.audio}</strong>
                    <small>{item.scene}</small>
                  </div>
                ))}
              </div>
              <div className="sar-audio-rationale">
                <article>
                  <span>Shared visual stream</span>
                  <p>A common or zoned soundtrack supplies shared cues and creates openings for commentary and mutual response. Personal language channels can still accompany one common visual pace.</p>
                </article>
                <article>
                  <span>Personal visual stream</span>
                   <p>Independent content, language or start times require synchronised, low-leakage audio. Stronger isolation can suppress nearby speech, so pause, volume and acoustic-transparency controls must keep companions and staff reachable.</p>
                </article>
                <article>
                  <span>Fixed ↔ Mobile</span>
                  <p>Fixed modes let coverage and spill be planned around a stable listening area. Mobile modes require audio transitions to follow location or content without masking warnings, companions or relevant environmental sound.</p>
                </article>
              </div>
              <figcaption>Sound is evaluated across all four configurations. Media distribution determines common attention, language choice and timing, while spatial relation determines coverage, transitions and environmental-awareness needs. Conversation, instructions and alerts remain part of the same design decision.</figcaption>
            </figure>
            <div className="sar-selection-questions">
              {selectionQuestions.map((question, index) => <p key={question}><span>{String(index + 1).padStart(2, '0')}</span>{question}</p>)}
            </div>
            <p className="sar-boundary-note">Applied sequentially, the five questions expose trade-offs and record why a configuration suits a particular activity and setting. The result is a qualitative comparison. Section 03 retraces how these criteria emerged from the earlier site-free prototypes.</p>
            <ResearchNote title="Evidence behind the selection questions">
              <p>The two axes emerged from comparing the early prototypes with research on situated visualisation, spatial AR and co-located interaction. Prior studies distinguish content anchored to objects, surfaces, routes and viewpoints, while showing that co-located visitors may still receive independent media streams. Lighting, vehicle positioning and physical load act as feasibility filters. Audio is evaluated separately because every configuration must support both its media content and nearby conversation or alerts.</p>
              <p>The resulting matrix is a qualitative decision aid. P04 and P05 apply it to Xiangzi Temple District through regulatory, spatial and operating conditions.</p>
            </ResearchNote>
          </section>

          <section className="sar-section" id="first-prototypes">
            <SectionHeading index="03" kicker="Site-free prototypes" title="From Site-free Prototypes to Selection Criteria" intro="Before a site was selected, five speculative prototypes developed the technical review into spatial questions about access, co-presence, editing and bodily participation. Their comparison exposed recurring variables: physical anchor, viewing position, movement, media distribution, public visibility and body load." />
            <div className="sar-probe-grid">
              {prototypes.map((prototype) => (
                <article key={prototype.code}>
                  <figure className="sar-probe-visual">
                    <img
                      alt={prototype.alt}
                      className="sar-probe-artwork"
                      decoding="async"
                      height={1400}
                      loading="lazy"
                      src={prototype.image}
                      width={1400}
                    />
                  </figure>
                  <div className="sar-probe-meta"><span>{prototype.code} · {prototype.group}</span>{prototype.carried && <b>Carried forward → P08</b>}</div>
                  <h3>{prototype.title}</h3><p>{prototype.question}</p>
                </article>
              ))}
            </div>
            <div className="sar-transfer-notes"><p>Spatial anchor and movement require separate decisions.</p><p>Co-location can support a common stream or independent streams.</p><p>Public visibility and bodily participation affect feasibility.</p></div>
            <ResearchNote title="How the prototypes shaped the site study">
              <p>The early access-based/editing-based grouping described what users could do with digital content. A second layer of comparison was needed to explain how each experience was anchored, how it responded to movement and who received its media. Xiangzi Temple District later turned these open variables into explicit requirements; retrospective comparison formalised the fixed/mobile × shared/personal matrix presented in Section 02.</p>
              <p>The prototypes surfaced the variables; the site study turned them into requirements; retrospective comparison formalised the matrix. Shared Cinema carried forward most directly into the City Wall Cinema, while the other prototypes contributed comparison criteria and feasibility limits.</p>
            </ResearchNote>
          </section>

          <div className="sar-section-reference-orbit" aria-hidden="true" />

          <section className="sar-section" id="low-intervention">
            <SectionHeading index="04" kicker="Why this district" title="Conservation Controls Set the Scale of Intervention" intro="Xiangzi Temple District combines strong cultural resources and visitor activity with strict limits on demolition, height and façade change. Mapping, observation and operating conditions point to selective connections, reusable interiors and digitally layered routes as the appropriate scale of intervention." />
            <div className="sar-copy-pair"><p className="sar-lead">Beside Xi&apos;an&apos;s city wall, the district combines strong cultural and visitor resources with tight limits on conventional redevelopment.</p><p>Measured from the wall&apos;s inner edge, the first 20 metres are reserved for clearance, the restored horse path or green space; buildings within 100 metres are limited to nine metres. Beyond that, massing must step away from the wall. Some existing homes reached three or four floors, so demolition and reconstruction could reduce usable area while adding relocation, approval and construction costs.</p></div>
            <figure className="sar-site-analysis">
              <div className="sar-site-analysis-grid">
                <img src="/images/projects/digi-tao/p4/p4-01-historic-city-context.svg" alt="Xi'an historic-city context locating the south wall, Yongning Gate, Xiangzi Temple and the approximate research area" />
                <img src="/images/projects/digi-tao/p4/p4-03-site-relationship.svg" alt="Site relationship map showing the approximate research area between the city wall, Xiangzi Temple and Yongning Gate" />
                <img src="/images/projects/digi-tao/p4/p4-04-control-section.svg" alt="Control section translating the twenty-metre clearance, nine-metre limit and stepped transition into a low-intervention strategy" />
                <img src="/images/projects/digi-tao/p4/p4-02-protection-constraint.svg" alt="Protection-constraint map showing the twenty-metre clearance strip, one-hundred-metre height-control zone and gate radius" />
              </div>
              <figcaption><span>04-A–D / Site analysis</span><p>The protection rule is read at four scales; the turquoise outline defines the study extent used for spatial analysis.</p></figcaption>
            </figure>
            <div className="sar-evidence-triad">
              <article><EvidenceLabel>Site problem</EvidenceLabel><h3>Physical change is constrained.</h3><p>Height control, mixed building conditions and limited internal stopping space make uniform redevelopment costly and inappropriate.</p></article>
              <article><EvidenceLabel>External precedent</EvidenceLabel><h3>Comparable delivery formats provide technical precedent.</h3><p>Hangzhou Asian Games cases demonstrate fixed, mobile and group-delivery formats at event scale; local spatial conditions guide their use in this district.</p></article>
              <article><EvidenceLabel>Implementation condition</EvidenceLabel><h3>A provider–operator–visitor chain supports implementation.</h3><p>Technology and headset suppliers can support museums or local commercial operators, who maintain the equipment and deliver experiences to visitors.</p></article>
            </div>
            <ResearchNote className="sar-site-feasibility-note" title="Site evidence and feasibility">
              <p>The site study combines four sources with distinct roles. Regulation defines the physical limits of intervention; mapping and field observation describe the district&apos;s spatial conditions; external precedents identify available delivery formats; and the provider–operator–visitor chain indicates a feasible implementation route. This connects physical limits, spatial opportunities, technical precedents and operating roles.</p>
              <SitePhotoCarousel />
              <div className="sar-secondary-evidence-stack sar-precedent-policy-pair">
                <SecondaryEvidenceFigure
                  alt="Diagram of how central and local Chinese policy and planning use fiscal, monetary, industrial and trade instruments to influence industry"
                  caption="Central and local policy planning can affect the industry through fiscal, monetary, industrial and trade instruments. Local spatial records still determine how these capacities are used."
                  code="04-F"
                  height={1062}
                  src="/images/projects/digi-tao/evidence/china-ar-policy-incentive-modes.webp"
                  title="Policy Support Mechanism"
                  width={1841}
                />
                <SecondaryEvidenceFigure
                  alt="Hangzhou Asian Games AR precedent collage showing fixed screens, mobile interactions, navigation, transport and public-space media"
                  caption="Hangzhou Asian Games cases combine fixed screens, mobile AR, transport, route guidance and interactive public media, providing technical precedents for later site-specific decisions."
                  code="04-G"
                  height={2034}
                  src="/images/projects/digi-tao/evidence/hangzhou-ar-precedent-collage.webp"
                  title="Hangzhou AR Precedent Collage"
                  width={2349}
                />
              </div>
              <p>The regulation effective in 2026 retains the 20 m clearance, 100 m / 9 m control and stepped transition. Combined with existing floor area and development conditions, these controls led the study to prioritise selective connections, reusable interiors and digitally augmented routes over extensive reconstruction.</p>
            </ResearchNote>
          </section>

          <section className="sar-section" id="fieldwork">
            <SectionHeading index="05" kicker="Spatial transformation" title="From Existing Fabric to AR Placement" intro="Six analytical and spatial moves turn field observations into three spatial types and placement rules for the four AR configurations." />
            <p className="sar-section-lead sar-section-lead-wide">The district consists mainly of dense two- and three-storey frame structures. Opening selected boundaries improves continuity within each floor; vertical transitions interrupt both visitor movement and media alignment, so most narrative sequences are organised laterally. Differences in access, openness and height produce three spatial types—continuous, parallel and distributed—which guide the placement of fixed nodes, mobile routes and business-led interventions.</p>
            <figure className="sar-transformation-sequence" aria-labelledby="sar-transformation-sequence-title">
              <header className="sar-transformation-sequence-head">
                <span>05-D</span>
                <strong id="sar-transformation-sequence-title">Six Analytical and Spatial Moves</strong>
                <i>Access → circulation → spatial type → AR placement</i>
              </header>
              <div className="sar-transformation-grid">
                {spatialTransformationSteps.map((step) => (
                  <figure className="sar-transformation-step" key={step.index}>
                    <img
                      alt={step.alt}
                      decoding="async"
                      height="907"
                      loading="lazy"
                      src={step.src}
                      width="1600"
                    />
                    <figcaption>
                      <span>{step.index}</span>
                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.body}</p>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </figure>
            <div className="sar-transformation-results">
              {spatialTransformationResults.map((result) => (
                <article key={result.index}>
                  <span>{result.index}</span>
                  <h3>{result.title}</h3>
                  <p>{result.body}</p>
                </article>
              ))}
            </div>
            <ResearchNote title="Field evidence → design requirements">
              <p>Field photographs, access observations, business conditions and stakeholder accounts revealed six recurring spatial and operating issues. Each became a design requirement.</p>
              <div className="sar-requirement-list sar-requirement-list-details">
                {fieldRequirements.map(([evidence, requirement], index) => <div key={evidence}><span>{String(index + 1).padStart(2, '0')}</span><p>{evidence}</p><strong>{requirement}</strong></div>)}
              </div>
              <p>The resulting strategy concentrates maintainable fixed installations at selected nodes, keeps mobile interaction lightweight along constrained routes, lets businesses participate at node scale, and anchors content to recognisable places. This creates the bridge from site study to mode allocation.</p>
            </ResearchNote>
          </section>

          <section className="sar-section" id="spatial-narrative">
            <SectionHeading index="06" kicker="Spatial narrative" title="Three Content Layers, Three Spatial Rhythms" intro="Programme → cultural source → narrative structure; continuous → branching → distributed" />
            <p className="sar-section-lead sar-section-lead-wide">Each floor combines three layers: existing businesses define the programme, Daoist sources provide the cultural content, and the temporal structure of Han Xiangzi&apos;s stories guides the visitor sequence. Continuous, branching and distributed spatial conditions are paired with chronological, parallel-variant and episodic narratives. This mapping sets the content rhythm of each floor; the viewing task at each node still determines its AR configuration.</p>
            <figure className="sar-narrative-master">
              <div className="sar-narrative-image">
                <img
                  alt="Three-layer narrative framework aligning existing commercial activities, Daoist cultural themes and Han Xiangzi stories with three floors of the Xiangzi Temple District"
                  decoding="async"
                  height="3233"
                  loading="lazy"
                  src="/images/projects/digi-tao/p6/triple-narrative.webp"
                  width="3200"
                />
              </div>
              <figcaption className="sar-caption-with-credit">
                <span>06-A / Three-layer narrative framework</span>
                <span className="sar-image-credit">Illustration by the author. All Chinese-style painting elements were generated by the author using Midjourney; none are authentic historical artworks.</span>
              </figcaption>
            </figure>
            <div className="sar-narrative-grid">
              {narrativePaths.map((path) => <article key={path.code}><span>{path.code} · {path.pattern}</span><h3>{path.title}</h3><p>{path.body}</p><dl><div><dt>Spatial correspondence</dt><dd>{path.anchor}</dd></div><div><dt>Visitor movement</dt><dd>{path.action}</dd></div><div><dt>Content expression</dt><dd>{path.cue}</dd></div></dl></article>)}
            </div>
            <ResearchNote title="Narrative method + evaluation">
              <p>The narrative structure follows differences among the sources: historical accounts can be arranged chronologically; versions of Han Xiangzi&apos;s transformation diverge; and stories following his immortality are largely self-contained.</p>
              <p>Planned evaluation will examine narrative comprehension, dwell time, route choice and cultural interpretation.</p>
            </ResearchNote>
          </section>

          <div className="sar-section-reference-orbit" aria-hidden="true" />

          <section className="sar-section" id="shared-ar">
            <SectionHeading index="07" kicker="Shared AR" title="Shared AR: Anchored and in Motion" intro="Fixed/shared media gathers an audience around one anchored event; movement-responsive/shared media keeps a group synchronised along a route." />
            <div className="sar-scene-pair">{sharedScenes.map((scene, index) => <SceneCard scene={scene} index={index} key={scene.code} />)}</div>
            <div className="sar-audio-thread"><span>Shared audio</span><p>Public / zoned soundfield → shared ambience with an optional personal language layer</p></div>
            <ResearchNote title="Why these shared modes fit these locations">
              <p>The courtyard theatre combines a defined viewing area, site-calibrated visual layers and live performance. A public or zoned soundfield coordinates collective attention without requiring personal devices. The AR bus uses vehicle positioning and a calibrated window display to align shared content with buildings and the city wall along a controlled route.</p>
              <p>These configurations concentrate support work in display calibration, viewing geometry, public sound, vehicle positioning and operator coordination. They remain proposed implementation requirements for later testing.</p>
            </ResearchNote>
          </section>

          <section className="sar-section sar-personal-section" id="personal-ar">
            <SectionHeading index="08" kicker="Personal AR" title="Personal AR: Anchored and in Motion" intro="Personal media shifts timing, language and audio control to each visitor while preserving environmental and social awareness." />
            <div className="sar-scene-pair">{personalScenes.map((scene, index) => <SceneCard scene={scene} index={index + 2} key={scene.code} />)}</div>
            <div className="sar-av-compare">
              <div><span>Q-02 / Fixed + Personal</span><strong>City wall cinema</strong><p>Headset · fixed terrace · wall-profile anchor · personal synchronised stream</p></div>
              <div><span>Q-04 / Mobile + Personal</span><strong>Indoor AR Exhibition + Outdoor Trail</strong><p>Tracked headset exhibition · location-linked smartphone extension · movement-responsive content</p></div>
            </div>
            <div className="sar-district-climax">
              <P8BreathingAxonometric />
            </div>
            <ResearchNote title="Why these personal modes fit these locations">
              <p>The city-wall cinema is fixed/personal: a known terrace viewpoint allows each registered film to align with the protected wall while visitors choose their own language and start time. The indoor exhibition is movement-responsive/personal: tracked content changes with each visitor&apos;s position, route and chosen objects. A location-linked smartphone trail extends the experience outdoors when a headset is unnecessary.</p>
              <p>These configurations shift support work towards fitting, calibration, device compatibility, charging and turnover. Individual audio must also preserve conversation, alerts and awareness of the surroundings.</p>
            </ResearchNote>
          </section>

          <section className="sar-section" id="headset-design">
            <SectionHeading index="09" kicker="Headset design" title="From Spatial Use to Headset Design" intro="The fixed city-wall cinema and mobile indoor exhibition feed into a shared headset study, while the outdoor trail continues through a visitor-owned smartphone." />
            <div className="sar-headset-render-gallery" aria-label="AR headset design renders">
              <figure className="sar-headset-render-main">
                <figcaption><span>09-A / Design Renderings</span></figcaption>
                <img
                  alt="Two views of the proposed white AR headset with an external rear support band"
                  decoding="async"
                  height="948"
                  loading="lazy"
                  src="/images/projects/digi-tao/p9/headset-main.webp"
                  width="2600"
                />
              </figure>
              <div className="sar-headset-render-details">
                <figure>
                  <img
                    alt="Close-up of the proposed AR headset power connection and side ventilation"
                    decoding="async"
                    height="973"
                    loading="lazy"
                    src="/images/projects/digi-tao/p9/headset-detail-01.webp"
                    width="1200"
                  />
                </figure>
                <figure>
                  <img
                    alt="Close-up of the proposed AR headset rear support, padding and adjustment mechanism"
                    decoding="async"
                    height="973"
                    loading="lazy"
                    src="/images/projects/digi-tao/p9/headset-detail-02.webp"
                    width="1200"
                  />
                </figure>
                <figure>
                  <img
                    alt="Close-up of the proposed AR headset camera and sensor assembly"
                    decoding="async"
                    height="973"
                    loading="lazy"
                    src="/images/projects/digi-tao/p9/headset-detail-03.webp"
                    width="1200"
                  />
                </figure>
              </div>
              <div className="sar-headset-render-caption">
                <p>A. Matte VDI 25 etch · B. Injection-moulded · C. Translucent PC + UV coat + laser etch · D. Mirror polish · E. Fine matte grain + foam infill · F. Fabric-wrapped frame · G. Die-cut · H. Injection-moulded · I. Brushed polish</p>
              </div>
            </div>
            <p className="sar-section-lead">Q-02 requires stable viewing and personal media over longer periods; Q-04 adds directional cues, environmental awareness and changing postures during movement. These demands become three design variables—balance, audio and social form—and are compared through layout studies, estimated centre-of-mass scenarios and wear-test criteria.</p>
            <div className="sar-headset-analysis-sequence">
              <figure className="sar-headset-analysis-figure">
                <figcaption>
                  <span>09-B / Exploded Assembly</span>
                </figcaption>
                <img
                  alt="Exploded assembly of the proposed AR headset with numbered components"
                  decoding="async"
                  height="1154"
                  loading="lazy"
                  src="/images/projects/digi-tao/p9/headset-exploded-view.webp"
                  width="3200"
                />
              </figure>
              <figure className="sar-headset-analysis-figure">
                <figcaption>
                  <span>09-C / Module Distribution Comparison</span>
                </figcaption>
                <img
                  alt="Functional-module comparison between the new AR headset concept and Microsoft HoloLens 2"
                  decoding="async"
                  height="838"
                  loading="lazy"
                  src="/images/projects/digi-tao/p9/headset-module-distribution-v2.webp"
                  width="3200"
                />
              </figure>
            </div>
            <figure className="sar-headset-analysis-figure sar-headset-centre-figure">
              <img
                alt="Estimated head-borne mass and centre-of-mass comparison across internal-power, external-power and rebalanced external-power AR headset layouts"
                decoding="async"
                height="1700"
                loading="lazy"
                src="/images/projects/digi-tao/p9/headset-centre-of-mass-analysis.svg?rev=9"
                width="3200"
              />
              <figcaption>
                <span>09-D / Estimated Head-Borne Mass Balance</span>
              </figcaption>
            </figure>
            <div className="sar-technical-strip sar-formula" aria-label="Centre-of-mass and relative static-moment equations">
              <span>r<sub>COM</sub> = Σ(mᵢrᵢ) / Σmᵢ</span>
              <span>|τ<sub>O</sub>| = m<sub>head</sub>g|x<sub>COM</sub>|</span>
              <span>M* = (m<sub>head</sub> / m<sub>ref</sub>) × |x<sub>COM</sub>| / L</span>
            </div>
            <div className="sar-headset-studies">{headsetStudies.map((study, index) => <article key={study.title}><span>0{index + 1}</span><h3>{study.title}</h3><dl><div><dt>Spatial demand</dt><dd>{study.demand}</dd></div><div><dt>Design response</dt><dd>{study.response}</dd></div><div><dt>Remaining test</dt><dd>{study.test}</dd></div></dl></article>)}</div>
            <div className="sar-audio-thread"><span>Two use states</span><p>Anchored cinema: clarity + independent stream ↔ Moving exhibition: direction + environmental awareness</p></div>
            <ResearchNote title="Device layout and ergonomic evaluation method">
              <p>The comparison combines component placement, existing headset references, full-scale fit prototyping and the device&apos;s visible public form. Moving the battery off the head reduces head-borne mass while transferring part of the load to the body. The layout is assessed through component mass, coordinate origin, reference posture, lever arm, centre of mass and estimated static moment. Because component-level masses are not publicly disclosed, 09-D constrains scenario ranges with published whole-device specifications instead of presenting them as prototype measurements.</p>
              <div className="sar-headset-fit-gallery" aria-label="AR headset wear rendering and ergonomic prototype process">
                <figure><img alt="Full-scale headset form prototype during 3D printing" decoding="async" height="1158" loading="lazy" src="/images/projects/digi-tao/p9/headset-prototype-print.webp" width="1200" /></figure>
                <figure><img alt="Handheld full-scale headset form prototype for ergonomic evaluation" decoding="async" height="810" loading="lazy" src="/images/projects/digi-tao/p9/headset-prototype-handheld-v4.webp" width="1200" /></figure>
                <figure><img alt="Manual finishing of the headset form prototype" decoding="async" height="1200" loading="lazy" src="/images/projects/digi-tao/p9/headset-prototype-finishing.webp" width="896" /></figure>
                <figure><img alt="Headset form prototype used to inspect fit and facial clearance" decoding="async" height="1200" loading="lazy" src="/images/projects/digi-tao/p9/headset-prototype-fit-model.webp" width="900" /></figure>
              </div>
              <p>The physical mock-ups test fit, face clearance, contact position and support geometry only; they are not functioning electronic devices. Further wear trials will assess pressure and posture, while acoustic tests will compare transparency, intelligibility and leakage, and social evaluation will examine the deliberately visible public form.</p>
            </ResearchNote>
          </section>

          <section className="sar-section sar-evidence-section" id="evidence-boundary">
            <SectionHeading index="10" kicker="Contributions + evaluation plan" title="Contributions, Limits and Next Tests" intro="This study contributes a traceable method for moving from site records and activity goals to media choice, AR configuration, spatial organisation and support requirements. Cross-case comparison of four configurations shows where installation, calibration, attention, audio and service work move as the mode changes. A thesis extension derives headset criteria from viewing posture, body load and co-presence. These are design findings from retrospective comparison; validation remains the next phase." />
            <div className="sar-evidence-groups">{evidenceGroups.map((group) => <article key={group.title}><EvidenceLabel>{group.label}</EvidenceLabel><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
            <div className="sar-technical-strip sar-evidence-chain" aria-label="Research evidence chain"><span>Technical review + site-free prototypes</span><i>→</i><span>Site records</span><i>→</i><span>Explicit requirements</span><i>→</i><span>Media choice</span><i>→</i><span>Mode comparison</span><i>→</i><span>Spatial + narrative applications</span><i>→</i><span>Headset extension</span><i>→</i><span>Evaluation</span></div>
            <div className="sar-next-tests">{nextTests.map((test) => <article key={test.index}><span>{test.index}</span><h3>{test.title}</h3><p>{test.body}</p></article>)}</div>
            <ResearchNote className="sar-references" title="References">
              <p>Lee, B., Sedlmair, M., &amp; Schmalstieg, D. (2024). Design patterns for situated visualization in augmented reality. IEEE Transactions on Visualization and Computer Graphics, 30(1), 1324–1335. <a href="https://doi.org/10.1109/TVCG.2023.3327398" rel="noreferrer" target="_blank">https://doi.org/10.1109/TVCG.2023.3327398</a></p>
              <p>Dima, M. (2022). A design framework for smart glass augmented reality experiences in heritage sites. Journal on Computing and Cultural Heritage, 15(4), 1–19. <a href="https://doi.org/10.1145/3490393" rel="noreferrer" target="_blank">https://doi.org/10.1145/3490393</a></p>
              <p>Joshi, N., Lakier, M., Vogel, D., &amp; Zhao, J. (2022). A design framework for contextual and embedded information visualizations in spatial augmented reality. In Proceedings of Graphics Interface 2022 (pp. 241–253). Canadian Information Processing Society. <a href="https://doi.org/10.20380/GI2022.24" rel="noreferrer" target="_blank">https://doi.org/10.20380/GI2022.24</a></p>
              <p>Dagan, E., Cárdenas Gasca, A. M., Robinson, A., Noriega, A., Tham, Y. J., Vaish, R., &amp; Monroy-Hernández, A. (2022). Project IRL: Playful co-located interactions with mobile augmented reality. Proceedings of the ACM on Human-Computer Interaction, 6(CSCW1), 1–27. <a href="https://doi.org/10.1145/3512909" rel="noreferrer" target="_blank">https://doi.org/10.1145/3512909</a></p>
              <p>Tonn, C., Petzold, F., Bimber, O., Grundhöfer, A., &amp; Donath, D. (2008). Spatial augmented reality for architecture—Designing and planning with and within existing buildings. International Journal of Architectural Computing, 6(1), 41–58. <a href="https://doi.org/10.1260/147807708784640126" rel="noreferrer" target="_blank">https://doi.org/10.1260/147807708784640126</a></p>
              <p>Chen, J., Li, P., Lei, Y., Zhang, Y., Lai, C., Chen, B., Liu, J., &amp; Schnabel, M. A. (2025). Leveraging augmented reality for historic streetscape regeneration decision-making: A big and small data approach with social media and stakeholder participation integration. Cities, 166, Article 106214. <a href="https://doi.org/10.1016/j.cities.2025.106214" rel="noreferrer" target="_blank">https://doi.org/10.1016/j.cities.2025.106214</a></p>
              <p>Billinghurst, M., Clark, A., &amp; Lee, G. (2015). A survey of augmented reality. Foundations and Trends in Human–Computer Interaction, 8(2–3), 73–272. <a href="https://doi.org/10.1561/1100000049" rel="noreferrer" target="_blank">https://doi.org/10.1561/1100000049</a></p>
              <p>Carmigniani, J., Furht, B., Anisetti, M., Ceravolo, P., Damiani, E., &amp; Ivkovic, M. (2011). Augmented reality technologies, systems and applications. Multimedia Tools and Applications, 51(1), 341–377. <a href="https://doi.org/10.1007/s11042-010-0660-6" rel="noreferrer" target="_blank">https://doi.org/10.1007/s11042-010-0660-6</a></p>
              <p>van Krevelen, D. W. F., &amp; Poelman, R. (2010). A survey of augmented reality technologies, applications and limitations. International Journal of Virtual Reality, 9(2), 1–20. <a href="https://doi.org/10.20870/IJVR.2010.9.2.2767" rel="noreferrer" target="_blank">https://doi.org/10.20870/IJVR.2010.9.2.2767</a></p>
              <p className="sar-reference-left">iResearch Consulting Group. (2023). Research report on China&apos;s augmented reality (AR) industry [Industry report]. <a href="https://pdf.dfcfw.com/pdf/H3_AP202302141583119132_1.pdf" rel="noreferrer" target="_blank">https://pdf.dfcfw.com/pdf/H3_AP202302141583119132_1.pdf</a></p>
              <p>Counterpoint Research. (n.d.). Global AR/VR value chain [Industry analysis]. <a href="https://www.counterpointresearch.com/insights/global-arvr-value-chain/" rel="noreferrer" target="_blank">https://www.counterpointresearch.com/insights/global-arvr-value-chain/</a></p>
              <p>Kim, H., &amp; Lee, I.-K. (2025). In-vehicle full-window augmented reality system (FARS) for passengers: Effects on spatial knowledge and user experience. Virtual Reality, 29(1), Article 34. <a href="https://doi.org/10.1007/s10055-024-01068-y" rel="noreferrer" target="_blank">https://doi.org/10.1007/s10055-024-01068-y</a></p>
              <p>Ito, K., Tada, M., Ujike, H., &amp; Hyodo, K. (2021). Effects of the weight and balance of head-mounted displays on physical load. Applied Sciences, 11(15), Article 6802. <a href="https://doi.org/10.3390/app11156802" rel="noreferrer" target="_blank">https://doi.org/10.3390/app11156802</a></p>
              <p>Chihara, T., &amp; Seo, A. (2018). Evaluation of physical workload affected by mass and center of mass of head-mounted display. Applied Ergonomics, 68, 204–212. <a href="https://doi.org/10.1016/j.apergo.2017.11.016" rel="noreferrer" target="_blank">https://doi.org/10.1016/j.apergo.2017.11.016</a></p>
              <p>Astrologo, A. N., Nano, S., Klemm, E. M., Shefelbine, S. J., &amp; Dennerlein, J. T. (2024). Determining the effects of AR/VR HMD design parameters (mass and inertia) on cervical spine joint torques. Applied Ergonomics, 116, Article 104183. <a href="https://doi.org/10.1016/j.apergo.2023.104183" rel="noreferrer" target="_blank">https://doi.org/10.1016/j.apergo.2023.104183</a></p>
              <p>Erickson, A., Kim, K., Bruder, G., &amp; Welch, G. F. (2020). Exploring the limitations of environment lighting on optical see-through head-mounted displays. In Proceedings of the 2020 ACM Symposium on Spatial User Interaction (pp. 1–8). Association for Computing Machinery. <a href="https://doi.org/10.1145/3385959.3418445" rel="noreferrer" target="_blank">https://doi.org/10.1145/3385959.3418445</a></p>
              <p>McGill, M., Brewster, S., McGookin, D., &amp; Wilson, G. (2020). Acoustic transparency and the changing soundscape of auditory mixed reality. In Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems (pp. 1–16). Association for Computing Machinery. <a href="https://doi.org/10.1145/3313831.3376702" rel="noreferrer" target="_blank">https://doi.org/10.1145/3313831.3376702</a></p>
              <p>Rauschnabel, P. A., Hein, D. W. E., He, J., Ro, Y. K., Rawashdeh, S., &amp; Krulikowski, B. (2016). Fashion or technology? A fashnology perspective on the perception and adoption of augmented reality smart glasses. i-com, 15(2), 179–194. <a href="https://doi.org/10.1515/icom-2016-0021" rel="noreferrer" target="_blank">https://doi.org/10.1515/icom-2016-0021</a></p>
              <p>Cheng, H., Cang, M., &amp; Zhou, W. (2025). Evaluating knowledge transfer mechanisms and outcomes of VR/AR for cultural-heritage serious games. npj Heritage Science, 13(1), Article 661. <a href="https://doi.org/10.1038/s40494-025-02247-z" rel="noreferrer" target="_blank">https://doi.org/10.1038/s40494-025-02247-z</a></p>
              <p>Hu, J. (2024). Individually integrated virtual/augmented reality environment for interactive perception of cultural heritage. Journal on Computing and Cultural Heritage, 17(1), 1–14. <a href="https://doi.org/10.1145/3631145" rel="noreferrer" target="_blank">https://doi.org/10.1145/3631145</a></p>
            </ResearchNote>
          </section>
        </article>
      </div>

      <section className="detail-next page-shell sar-next">
        <div><p className="eyebrow">Next project</p><p>{nextProject.title.en}</p></div>
        <ProjectTransitionLink href={`/projects/${nextProject.slug}`}>Continue <span>↗</span></ProjectTransitionLink>
      </section>
    </main>
  );
}
