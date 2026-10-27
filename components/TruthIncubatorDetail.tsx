import type { ReactNode } from 'react';
import type { Project, ProjectCategory } from '@/types/content';
import { BackToProjectLink } from '@/components/BackToProjectLink';
import { ProjectTransitionLink } from '@/components/ProjectTransition';
import { DecorativeNetwork } from '@/components/DecorativeNetwork';
import { ScrollTransitions } from '@/components/ScrollTransitions';
import { ViewportPauseVideo } from '@/components/ViewportPauseVideo';

interface TruthIncubatorDetailProps {
  category?: ProjectCategory;
  nextProject: Project;
  project: Project;
}

const articleNav = [
  { id: 'information-overload', index: '01', label: 'Information overload' },
  { id: 'production-system', index: '02', label: 'Production system' },
  { id: 'montage-test', index: '03', label: 'Editing validation' },
  { id: 'content-farm', index: '04', label: 'Content farm' },
  { id: 'production-loop', index: '05', label: 'Production loop' },
  { id: 'information-paralysis', index: '06', label: 'Information paralysis' },
  { id: 'contribution', index: '07', label: 'Contribution + boundary' },
];

interface StoryBeat {
  action: string;
  alt?: string;
  matchTone?: 'deep-blue' | 'green' | 'orange' | 'red' | 'sky' | 'teal';
  scene: string;
  src?: string;
  technique?: string;
}

const originalStoryBeats: StoryBeat[] = [
  { scene: 'Black plastic bag', action: 'Taking out the rubbish', src: '/images/projects/truth-incubator/montage/source-01.jpg', alt: 'A man leaving a building while carrying a black plastic bag' },
  { scene: 'Street conversation', action: 'Festival promoter', src: '/images/projects/truth-incubator/montage/source-02.jpg', alt: 'A street promoter holding a Valentine’s Day leaflet', matchTone: 'orange' },
  { scene: 'Street rally crowd', action: 'Holiday event', src: '/images/projects/truth-incubator/montage/source-03.jpg', alt: 'A crowd gathered for a Valentine’s Day street promotion', matchTone: 'deep-blue' },
  { scene: 'Market butcher', action: 'Asking for directions', src: '/images/projects/truth-incubator/montage/source-04.jpg', alt: 'A man speaking with a butcher inside a market', matchTone: 'red' },
  { scene: 'Market florist', action: 'Buying a bouquet', src: '/images/projects/truth-incubator/montage/source-05.jpg', alt: 'A man standing at a flower stall in the market' },
  { scene: 'Passing through the crowd', action: 'Carrying the bouquet', src: '/images/projects/truth-incubator/montage/source-06.jpg', alt: 'A man carrying a wrapped bouquet through a street crowd', matchTone: 'sky' },
  { scene: 'Ticket platform', action: 'Buying a train ticket', src: '/images/projects/truth-incubator/montage/source-07.jpg', alt: 'A man buying a ticket at a station counter', matchTone: 'teal' },
  { scene: 'Park', action: 'Meeting for a date', src: '/images/projects/truth-incubator/montage/source-08.jpg', alt: 'A couple seated together on a park bench', matchTone: 'green' },
];

const manipulatedStoryBeats: StoryBeat[] = [
  { scene: 'Park', action: 'Scouting a hunting site', technique: 'Viewpoint shift · Colour filter', src: '/images/projects/truth-incubator/montage/manipulated-01.jpg', alt: 'Surveillance-style view of a man walking through a park', matchTone: 'green' },
  { scene: 'Poaching news', action: 'Establishing the alleged crime', technique: 'External footage', src: '/images/projects/truth-incubator/montage/manipulated-02.jpg', alt: 'Breaking-news footage alleging the poaching of rare birds' },
  { scene: 'Street rally crowd', action: 'Anti-poaching protest', src: '/images/projects/truth-incubator/montage/manipulated-03.jpg', alt: 'News footage reframing a street crowd as an anti-poaching protest', matchTone: 'deep-blue' },
  { scene: 'Passing through the crowd', action: 'Carrying a rifle', technique: 'Viewpoint shift', src: '/images/projects/truth-incubator/montage/manipulated-04.jpg', alt: 'A man passing through a crowd with a wrapped object implied to be a rifle', matchTone: 'sky' },
  { scene: 'Market butcher', action: 'Processing animals', src: '/images/projects/truth-incubator/montage/manipulated-05.jpg', alt: 'A man standing inside a butcher market framed as an animal-processing site', matchTone: 'red' },
  { scene: 'Street conversation', action: 'Black-market exchange', technique: 'Viewpoint shift', src: '/images/projects/truth-incubator/montage/manipulated-06.jpg', alt: 'Surveillance-style overhead view of a street exchange', matchTone: 'orange' },
  { scene: 'Ticket platform', action: 'Buying a plane ticket', src: '/images/projects/truth-incubator/montage/manipulated-07.jpg', alt: 'A man buying a ticket at a station counter reframed as an airline booking', matchTone: 'teal' },
  { scene: 'Plane takeoff', action: 'Leaving the city', technique: 'Viewpoint shift', src: '/images/projects/truth-incubator/montage/manipulated-08.jpg', alt: 'An aircraft taking off as the implied escape from the city' },
];

const narrativeTestResults = [
  { code: '01', label: 'Hunting site', correct: 42 },
  { code: '02', label: 'Poaching', correct: 46 },
  { code: '03', label: 'Protest', correct: 47 },
  { code: '04', label: 'Rifle', correct: 44 },
  { code: '05', label: 'Processing', correct: 41 },
  { code: '06', label: 'Exchange', correct: 38 },
  { code: '07', label: 'Plane ticket', correct: 47 },
  { code: '08', label: 'Departure', correct: 43 },
] as const;

const credibilityTestResults = [
  { rating: 1, count: 0 },
  { rating: 2, count: 0 },
  { rating: 3, count: 4 },
  { rating: 4, count: 10 },
  { rating: 5, count: 33 },
] as const;

const spatialBands = [
  {
    code: '01',
    label: 'Outer ring',
    types: [
      { name: 'TV Studio', frames: 2 },
      { name: 'Photo Studio', frames: 2 },
    ],
  },
  {
    code: '02',
    label: 'Inner ring',
    types: [
      { name: 'Teahouse', frames: 2 },
      { name: 'Meeting Room', frames: 2 },
    ],
  },
  {
    code: '03',
    label: 'Core',
    types: [
      { name: 'Editing Room', frames: 1 },
      { name: 'Typing Room', frames: 2 },
      { name: 'Supervision Centre', frames: 1 },
    ],
  },
] as const;

const spatialFrameSources: Record<string, string> = {
  'TV Studio-1': '/images/projects/truth-incubator/spatial/scenes/tv-studio-01.jpg',
  'TV Studio-2': '/images/projects/truth-incubator/spatial/scenes/tv-studio-02.jpg',
  'Photo Studio-1': '/images/projects/truth-incubator/spatial/scenes/photo-studio-01.jpg',
  'Photo Studio-2': '/images/projects/truth-incubator/spatial/scenes/photo-studio-02.jpg',
  'Teahouse-1': '/images/projects/truth-incubator/spatial/scenes/teahouse-01.jpg',
  'Teahouse-2': '/images/projects/truth-incubator/spatial/scenes/teahouse-02.jpg',
  'Meeting Room-1': '/images/projects/truth-incubator/spatial/scenes/meeting-room-01.jpg',
  'Meeting Room-2': '/images/projects/truth-incubator/spatial/scenes/meeting-room-02.jpg',
  'Editing Room-1': '/images/projects/truth-incubator/spatial/scenes/editing-room-01.jpg',
  'Typing Room-1': '/images/projects/truth-incubator/spatial/scenes/typing-room-01.jpg',
  'Typing Room-2': '/images/projects/truth-incubator/spatial/scenes/typing-room-02.jpg',
  'Supervision Centre-1': '/images/projects/truth-incubator/spatial/scenes/supervision-centre-01.jpg',
};

const gameFlowSteps = [
  {
    code: '01',
    title: 'Collect footage',
    text: 'Pick up video fragments from screens distributed through the editing room.',
    src: '/images/projects/truth-incubator/game/workflow-01.jpg',
    alt: 'The player collecting a video fragment from a screen in the editing room',
  },
  {
    code: '02',
    title: 'Edit at the console',
    text: 'Arrange the selected fragments into a coherent but redirected narrative.',
    src: '/images/projects/truth-incubator/game/workflow-02.jpg',
    alt: 'The editing interface used to arrange collected video fragments',
  },
  {
    code: '03',
    title: 'Pass both thresholds',
    text: 'Release becomes available after authenticity and expected impact both exceed 60%.',
    src: '/images/projects/truth-incubator/game/workflow-03.jpg',
    alt: 'The editing interface with the required metrics reached and the publish control selected',
  },
  {
    code: '04',
    title: 'Watch the consequence',
    text: 'Play the completed fake news and the social impact produced by its circulation.',
    src: '/images/projects/truth-incubator/game/workflow-04.jpg',
    alt: 'The published news video playing before its social consequences are shown',
  },
] as const;

const contentFarmChapters = [
  {
    code: 'Chapter 01',
    title: 'The Age of Numbness',
    src: '/images/projects/truth-incubator/spatial/chapter-01.jpg',
    alt: 'A dense 2045 New York street saturated with domestic and public image screens',
    text: 'New York, 2045. Every domestic window has become a screen, while an immense information factory dominates the skyline. Images arrive without pause—abundant, repetitive, contradictory and impossible to resolve. Immersed in this continuous excess, citizens gradually lose both the impulse and the capacity to distinguish evidence from noise.',
  },
  {
    code: 'Chapter 02',
    title: 'The Content Farm',
    src: '/images/projects/truth-incubator/spatial/chapter-02.jpg',
    alt: 'The monumental Content Farm rising above the surrounding city blocks',
    text: 'The Content Farm is a new kind of media company born from the expansion of platform-based news production. Self-media dispersed authority across producers; now, the company recentralises power by controlling systems that aggregate, edit and circulate content. It multiplies competing accounts until confusion hardens into information paralysis.',
  },
  {
    code: 'Chapter 03',
    title: 'From Surface to Core',
    src: '/images/projects/truth-incubator/spatial/chapter-03.jpg',
    alt: 'Broadcast, production and monitoring spaces inside the Content Farm',
    text: 'The camera crosses the corporate shell. Broadcast studios conceal editing rooms, coordinated-amplification units, reception suites that recruit distribution networks, and a monitoring centre that reads public response in real time. Architecture follows the operation: each step inward replaces media spectacle with the machinery that directs attention.',
  },
] as const;

const references = [
  'World Health Organization. (2022). Fifth virtual WHO infodemic management conference, 2, 4, 9 and 11 November 2021: Meeting report—Steps towards measuring the burden of infodemics. https://www.who.int/publications/i/item/9789240047174',
  'Gomez Rodriguez, M., Gummadi, K., & Schoelkopf, B. (2014). Quantifying information overload in social media and its impact on social contagions. Proceedings of the International AAAI Conference on Web and Social Media, 8(1), 170–179. https://doi.org/10.1609/icwsm.v8i1.14549',
  'Vosoughi, S., Roy, D., & Aral, S. (2018). The spread of true and false news online. Science, 359(6380), 1146–1151. https://doi.org/10.1126/science.aap9559',
  'Pennycook, G., Cannon, T. D., & Rand, D. G. (2018). Prior exposure increases perceived accuracy of fake news. Journal of Experimental Psychology: General, 147(12), 1865–1880. https://doi.org/10.1037/xge0000465',
  'Jiang, S. (2022). The roles of worry, social media information overload, and social media fatigue in hindering health fact-checking. Social Media + Society, 8(3). https://doi.org/10.1177/20563051221113070',
  'King, G., Pan, J., & Roberts, M. E. (2017). How the Chinese government fabricates social media posts for strategic distraction, not engaged argument. American Political Science Review, 111(3), 484–501. https://doi.org/10.1017/S0003055417000144',
  'Paul, C., & Matthews, M. (2016). The Russian “firehose of falsehood” propaganda model: Why it might work and options to counter it. RAND Corporation. https://doi.org/10.7249/PE198',
  'Tandoc, E. C., Jr., & Kim, H. K. (2023). Avoiding real news, believing in fake news? Investigating pathways from information overload to misbelief. Journalism, 24(6), 1174–1192. https://doi.org/10.1177/14648849221090744',
] as const;

function SectionHeading({
  index,
  intro,
  kicker,
  title,
}: {
  index: string;
  intro: string;
  kicker: string;
  title: string;
}) {
  return (
    <header className="ti-heading">
      <p className="eyebrow">P{index} / {kicker}</p>
      <h2>{title}</h2>
      <p>{intro}</p>
    </header>
  );
}

function ResearchNote({ children, className = '', title }: { children: ReactNode; className?: string; title: string }) {
  return (
    <aside className={`ti-research-note ${className}`.trim()}>
      <h3>{title}</h3>
      {children}
    </aside>
  );
}

function ImageFigure({
  alt,
  caption,
  className = '',
  code,
  height,
  src,
  title,
  width,
}: {
  alt: string;
  caption: string;
  className?: string;
  code: string;
  height: number;
  src: string;
  title: string;
  width: number;
}) {
  return (
    <figure className={`ti-figure ${className}`.trim()}>
      <img alt={alt} decoding="async" height={height} loading="lazy" src={src} width={width} />
      <figcaption>
        <span>{code} / {title}</span>
        <p>{caption}</p>
      </figcaption>
    </figure>
  );
}

function ChapterSynopsis() {
  return (
    <figure className="ti-chapter-synopsis">
      <header>
        <span>04-A / Story world and chapter synopsis</span>
        <i>Three-part spatial narrative</i>
      </header>
      <div className="ti-chapter-grid">
        {contentFarmChapters.map((chapter) => (
          <article key={chapter.code}>
            <div className="ti-chapter-image">
              <img alt={chapter.alt} decoding="async" height={1985} loading="lazy" src={chapter.src} width={1526} />
            </div>
            <div>
              <span>{chapter.code}</span>
              <h3>{chapter.title}</h3>
              <p>{chapter.text}</p>
            </div>
          </article>
        ))}
      </div>
    </figure>
  );
}

function VideoPlaceholder({
  code,
  poster,
  src,
  summary,
  title,
}: {
  code: string;
  poster?: string;
  src: string;
  summary: string;
  title: string;
}) {
  return (
    <figure className="ti-video">
      <div className="ti-video-player">
        <ViewportPauseVideo label={title} poster={poster} src={src} />
      </div>
      <figcaption>
        <span>{code} / {title}</span>
        <span>{summary}</span>
      </figcaption>
    </figure>
  );
}

function FramePlaceholder({ alt, label, matchTone, src }: { alt?: string; label: string; matchTone?: StoryBeat['matchTone']; src?: string }) {
  return (
    <div className={`ti-frame-placeholder${src ? ' ti-frame-image' : ''}${matchTone ? ` ti-scene-${matchTone}` : ''}`} aria-label={alt ?? `${label} screenshot placeholder`}>
      {src ? (
        <img alt={alt ?? label} decoding="async" height={616} loading="lazy" src={src} width={1095} />
      ) : (
        <>
          <span>{label}</span>
          <i>16:9 frame reserved</i>
        </>
      )}
    </div>
  );
}

function StorylineRow({
  beats,
  code,
  description,
  title,
}: {
  beats: StoryBeat[];
  code: string;
  description: string;
  title: string;
}) {
  return (
    <article className="ti-storyline-row">
      <header>
        <span>{code}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </header>
      <div className="ti-storyline-scroll" tabIndex={0} aria-label={`${title} sequence; scroll horizontally on narrow screens`}>
        <ol className="ti-storyline-list">
          {beats.map((beat, index) => (
            <li key={`${code}-${beat.scene}`}>
              <FramePlaceholder alt={beat.alt} label={`${String(index + 1).padStart(2, '0')} / ${beat.scene}`} matchTone={beat.matchTone} src={beat.src} />
              <p><strong>{beat.scene}</strong><span>{beat.action}</span></p>
              {beat.technique ? <small><b>Technique</b>{beat.technique}</small> : null}
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function SpatialTypeMatrix() {
  return (
    <section className="ti-space-matrix" aria-label="Spatial types and film frame placeholders">
      <header><span>Spatial correspondence</span><i>Film frame index</i></header>
      <div className="ti-space-matrix-scroll" tabIndex={0} aria-label="Three spatial layers; scroll horizontally on narrow screens">
        <div className="ti-space-matrix-canvas">
          {spatialBands.map((band) => {
            const frames = band.types.flatMap((type) =>
              Array.from({ length: type.frames }, (_, index) => ({
                index: index + 1,
                src: spatialFrameSources[`${type.name}-${index + 1}`],
                type: type.name,
              })),
            );

            return (
              <article className="ti-space-band" key={band.label}>
                <header><span>{band.code}</span><h3>{band.label}</h3></header>
                <div className="ti-space-frame-row">
                  {frames.map((frame) => (
                    <section className="ti-space-sample" key={`${frame.type}-${frame.index}`}>
                      <FramePlaceholder label={`${frame.type} / ${String(frame.index).padStart(2, '0')}`} src={frame.src} />
                      <p className={frame.index > 1 ? 'ti-space-sample-continuation' : undefined}>
                        {frame.index === 1 ? <strong>{frame.type}</strong> : null}
                        <span>Frame {String(frame.index).padStart(2, '0')}</span>
                      </p>
                    </section>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GameFlowFigure() {
  return (
    <figure className="ti-game-flow">
      <div className="ti-game-flow-scroll" tabIndex={0} aria-label="Four-step game workflow; scroll horizontally on narrow screens">
        <div className="ti-game-flow-canvas">
          <ol className="ti-game-flow-list">
            {gameFlowSteps.map((step) => (
              <li key={step.code}>
                <FramePlaceholder alt={step.alt} label={`${step.code} / ${step.title}`} src={step.src} />
                <span>Step {step.code}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="ti-game-return">
            <svg viewBox="0 0 1000 56" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <marker id="ti-game-flow-arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" />
                </marker>
              </defs>
              <path className="ti-game-return-path" d="M 875 0 V 32 H 125 V 0" markerEnd="url(#ti-game-flow-arrowhead)" />
            </svg>
            <span>Complete three fake-news releases to clear the game</span>
          </div>
        </div>
      </div>
      <figcaption>
        <span>05-B / Playable production workflow</span>
        <p>Four actions turn one body of footage into a repeatable publication loop.</p>
      </figcaption>
    </figure>
  );
}

function NarrativeAccuracyChart() {
  const plotLeft = 142;
  const plotWidth = 380;

  return (
    <figure className="ti-survey-chart">
      <header><span>Result 01</span><strong>Narrative reconstruction</strong></header>
      <svg aria-labelledby="ti-narrative-chart-title ti-narrative-chart-desc" role="img" viewBox="0 0 600 350">
        <title id="ti-narrative-chart-title">Correct identification rate for eight manipulated plot beats</title>
        <desc id="ti-narrative-chart-desc">Across 47 participants, correct responses range from 38 to 47, with an overall accuracy of 92.6 percent.</desc>
        <g className="ti-chart-grid">
          {Array.from({ length: 5 }, (_, index) => {
            const x = plotLeft + index * (plotWidth / 4);
            return <line key={`narrative-grid-${index}`} x1={x} x2={x} y1="38" y2="282" />;
          })}
          {narrativeTestResults.map((result, index) => {
            const y = 58 + index * 30;
            return <line key={`narrative-row-${result.code}`} x1={plotLeft} x2={plotLeft + plotWidth} y1={y} y2={y} />;
          })}
        </g>
        <g className="ti-chart-axis-labels">
          <text x="12" y="26">PLOT BEAT</text>
          <text textAnchor="end" x="586" y="26">CORRECT / 47</text>
          {[0, 25, 50, 75, 100].map((tick, index) => (
            <text key={`narrative-tick-${tick}`} textAnchor="middle" x={plotLeft + index * (plotWidth / 4)} y="305">{tick}%</text>
          ))}
        </g>
        <g className="ti-chart-data">
          {narrativeTestResults.map((result, index) => {
            const y = 58 + index * 30;
            const x = plotLeft + (result.correct / 47) * plotWidth;
            return (
              <g key={result.code}>
                <text className="ti-chart-row-code" x="12" y={y + 3}>{result.code}</text>
                <text className="ti-chart-row-label" x="42" y={y + 3}>{result.label}</text>
                <line className="ti-chart-value-line" x1={plotLeft} x2={x} y1={y} y2={y} />
                <rect className="ti-chart-marker" height="8" width="8" x={x - 4} y={y - 4} />
                <text className="ti-chart-value" textAnchor="end" x="586" y={y + 3}>{result.correct} / 47</text>
              </g>
            );
          })}
        </g>
        <path className="ti-chart-baseline" d={`M ${plotLeft} 282 H ${plotLeft + plotWidth}`} />
        <text className="ti-chart-axis-title" textAnchor="middle" x={plotLeft + plotWidth / 2} y="334">CORRECT IDENTIFICATION RATE</text>
      </svg>
      <figcaption><span>348 / 376</span><p>92.6% overall accuracy · 7.4 of 8 plot beats identified per participant</p></figcaption>
    </figure>
  );
}

function CredibilityDistributionChart() {
  const plotTop = 34;
  const plotBottom = 282;
  const plotHeight = plotBottom - plotTop;
  const xPositions = [78, 196, 314, 432, 550];
  const pointString = credibilityTestResults
    .map((result, index) => `${xPositions[index]},${plotBottom - (result.count / 35) * plotHeight}`)
    .join(' ');

  return (
    <figure className="ti-survey-chart">
      <header><span>Result 02</span><strong>Perceived credibility</strong></header>
      <svg aria-labelledby="ti-credibility-chart-title ti-credibility-chart-desc" role="img" viewBox="0 0 600 350">
        <title id="ti-credibility-chart-title">Distribution of credibility ratings from one to five</title>
        <desc id="ti-credibility-chart-desc">No participant selected one or two, four selected three, ten selected four and thirty-three selected five.</desc>
        <g className="ti-chart-grid">
          {Array.from({ length: 8 }, (_, index) => {
            const y = plotBottom - index * (plotHeight / 7);
            return <line key={`credibility-grid-${index}`} x1="44" x2="568" y1={y} y2={y} />;
          })}
          {xPositions.map((x, index) => <line key={`credibility-column-${index}`} x1={x} x2={x} y1={plotTop} y2={plotBottom} />)}
        </g>
        <g className="ti-chart-axis-labels">
          {[0, 5, 10, 15, 20, 25, 30, 35].map((tick, index) => (
            <text key={`credibility-tick-${tick}`} textAnchor="end" x="34" y={plotBottom - index * (plotHeight / 7) + 3}>{tick}</text>
          ))}
          {credibilityTestResults.map((result, index) => (
            <text key={`rating-${result.rating}`} textAnchor="middle" x={xPositions[index]} y="307">{result.rating}</text>
          ))}
        </g>
        <g className="ti-chart-data">
          {credibilityTestResults.map((result, index) => {
            const x = xPositions[index];
            const y = plotBottom - (result.count / 35) * plotHeight;
            return (
              <g key={result.rating}>
                <line className="ti-chart-stem" x1={x} x2={x} y1={plotBottom} y2={y} />
                <rect className="ti-chart-marker" height="9" width="9" x={x - 4.5} y={y - 4.5} />
                <text className="ti-chart-value" textAnchor="middle" x={x} y={result.count === 0 ? y - 12 : y - 14}>{result.count}</text>
              </g>
            );
          })}
          <polyline className="ti-chart-profile" points={pointString} />
        </g>
        <g className="ti-chart-callout">
          <rect height="38" rx="7" width="132" x="430" y="2" />
          <text x="442" y="17">RATING 5</text>
          <text x="442" y="31">33 / 47 · 70.2%</text>
        </g>
        <path className="ti-chart-baseline" d="M 44 282 H 568" />
        <text className="ti-chart-axis-title" textAnchor="middle" x="306" y="334">CREDIBILITY RATING / 1–5</text>
      </svg>
      <figcaption><span>4.62 / 5</span><p>Mean rating · 91.5% of participants selected either 4 or 5</p></figcaption>
    </figure>
  );
}

export function TruthIncubatorDetail({ category, nextProject, project }: TruthIncubatorDetailProps) {
  return (
    <main className="project-detail truth-incubator-detail">
      <DecorativeNetwork variant="detail" />
      <ScrollTransitions variant="detail" />

      <header className="detail-nav page-shell ti-topbar">
        <BackToProjectLink projectSlug={project.slug} />
        <span>Work sample / {project.number}</span>
      </header>

      <section className="ti-hero page-shell" id="overview">
        <div className="ti-hero-meta">
          <p className="eyebrow">Interactive Film · Critical Media Research</p>
          <span>2023</span>
          <span>With Xuanyi Liu</span>
          <span className="ti-hero-supervisor"><small>Supervisor</small><strong>Simone Chung</strong></span>
        </div>

        <div className="ti-hero-title">
          <p>{category?.title.en ?? 'Spatial Interfaces'}</p>
          <h1>Truth<br />Incubator</h1>
        </div>

        <div className="ti-hero-deck">
          <p className="ti-hero-role">My role / Film environment building and animation—independent. Game interaction, research and visualisation—collaborative.</p>
          <p className="ti-hero-proposition">Information manipulation does not need one convincing lie. It can make the original event lose priority among competing narratives.</p>
        </div>

        <div className="ti-technical-strip ti-keywords">
          Information overload <span>/</span> Disinformation <span>/</span> Montage <span>/</span> Spatial narrative <span>/</span> UE5 <span>/</span> Game design
        </div>

        <figure className="ti-hero-figure">
          <img
            alt="News-editing interface layered over the dark core editing room of the fictional content farm"
            decoding="async"
            height="1518"
            src="/images/projects/truth-incubator/hero-interface.webp"
            width="2800"
          />
          <figcaption>
            <span>P0-A / Truth Incubator</span>
            <p>The employee interface turns clips, editing choices and publication thresholds into a visible production system. UE5 game capture, project archive, 2023.</p>
          </figcaption>
        </figure>

        <div className="ti-question">
          <span>Research question</span>
          <p>How can repeated and competing narratives redirect public attention when they are produced from the same body of evidence?</p>
        </div>

        <div className="ti-overview-copy">
          <p>Truth Incubator is a research-led interactive film about a future content farm: a normal media company on its outer face and a disinformation industry at its core. A montage experiment tests how editing can redirect interpretation. The final film and game then spatialise that mechanism and ask the player to produce three conflicting stories from one event.</p>
          <div className="ti-method-note">Media research · Editing taxonomy · Montage experiment · Spatial narrative · Playable prototype</div>
        </div>
      </section>

      <div className="ti-article-layout page-shell">
        <nav className="ti-bookmarks" aria-label="In this article">
          <p>In this article</p>
          <ol>
            {articleNav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}><span>{item.index}</span><i>{item.label}</i></a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="ti-article">
          <section className="ti-section" id="information-overload">
            <SectionHeading
              index="01"
              intro="The project shifts the question from whether one item is false to how many plausible versions compete for limited attention."
              kicker="Research focus"
              title="From Falsehood to Information Overload"
            />

            <div className="ti-copy-pair">
              <p className="ti-lead">Traditional deception attempts to replace a fact with a false account. Platform-era manipulation can work differently: it can publish many partial, emotional and contradictory accounts until verification becomes too costly and the original issue loses visibility.</p>
              <p>The project calls this condition <i>information paralysis</i>. It is a design model assembled from research on information overload, repetition, fatigue, avoidance and strategic distraction—not a universal diagnosis or a claim that all false information works in the same way.</p>
            </div>

            <blockquote className="ti-statement">When production exceeds the public&apos;s capacity to compare and verify, control can operate through volume rather than consensus.</blockquote>

            <div className="ti-chain" aria-label="Information overload mechanism">
              <span>Limited attention</span><i>→</i><span>Competing versions</span><i>→</i><span>Repetition</span><i>→</i><span>Fatigue</span><i>→</i><span>Loss of focus</span>
            </div>

            <ImageFigure
              alt="Research map tracing the transition from traditional and social-media news production to the organisational programme of the fictional content farm"
              caption="The research traces a shift from institutional outbound production to accelerated, participatory circulation, then translates the expanded motives and methods of fabrication into the Content Farm’s editorial, penetration, amplification and supervision functions."
              className="ti-figure-bordered"
              code="01-A"
              height={4720}
              src="/images/projects/truth-incubator/research/media-transition-content-farm.jpg"
              title="From Media Transition to the Content Farm"
              width={4134}
            />

            <ResearchNote title="Evidence boundary">
              <p>Research on social-media attention, repetition and fatigue supports the project&apos;s concern that more information does not automatically create better understanding. These studies do not establish one universal causal chain, so the page treats “information paralysis” as a project synthesis rather than a settled academic term.</p>
            </ResearchNote>
          </section>

          <section className="ti-section" id="production-system">
            <SectionHeading
              index="02"
              intro="A credible false story is assembled from sources, editing operations and distribution incentives rather than invented in one step."
              kicker="Production grammar"
              title="A Production System for Plausible Falsehoods"
            />

            <div className="ti-copy-pair">
              <p className="ti-lead">The preliminary study mapped three connected layers: what kind of false story is being produced, what material gives it a sense of evidence, and which editing operation turns that material into a directed narrative.</p>
              <p>Authority, data, images, interviews, outdated information and first-person experience can all function as credible-looking inputs. Framing, grafting, irrelevant juxtaposition, logical deduction, exaggeration, post-effects, journalistic performance and scripting then reorganise those inputs.</p>
            </div>

            <div className="ti-three-column">
              <article><span>01 / Motive</span><h3>Why it is produced</h3><p>Commercial marketing, crisis public relations, political incitement, page-view revenue or deliberate paralysis.</p></article>
              <article><span>02 / Evidence</span><h3>What makes it look credible</h3><p>Institutions, statistics, found footage, interviews, older reports or situated personal testimony.</p></article>
              <article><span>03 / Syntax</span><h3>How interpretation is directed</h3><p>Selection, omission, reframing, montage, sound, filters, titles and staged journalistic cues.</p></article>
            </div>

            <ImageFigure
              alt="Integrated research taxonomy connecting rumour conditions, fake-news types, credible evidence and editing techniques"
              caption="The taxonomy links conditions of rumour propagation to three operational layers—fake-news type, credible evidence and editing syntax—and codes archived cases across the resulting technique matrix. Xuanyi Liu independently produced the visual drawing from collaboratively developed research."
              className="ti-figure-bordered"
              code="02-A"
              height={4201}
              src="/images/projects/truth-incubator/research/fake-news-production-grammar.jpg"
              title="A Production Grammar of Fake News"
              width={4134}
            />
          </section>

          <section className="ti-section" id="montage-test">
            <SectionHeading
              index="03"
              intro="This experiment puts the editing-technique library from Section 02 into practice and tests whether its operations can redirect how an audience reads the same source event."
              kicker="Applied validation"
              title="Testing the Editing Library through Re-editing"
            />

            <div className="ti-copy-pair ti-validation-rationale">
              <p className="ti-lead">Section 02 produced a taxonomy; Section 03 asks whether it can operate as a production method. An original short film is treated as the source material, then re-edited into a second story with a different identity, event and sequence of actions.</p>
              <p>The intervention extends beyond changing shot order. It removes and inserts clips, switches viewpoints, reframes images, applies colour filters, adds music and external news footage, and alters the relation between sound, image and context. Each operation is drawn from the preceding editing library.</p>
            </div>

            <div className="ti-story-comparison">
              <article>
                <span>Part 01 / Original narrative</span>
                <h3>A Valentine&apos;s Day journey</h3>
                <p>A man takes out the rubbish, passes a street celebration, buys flowers and a ticket, then rides the metro to meet his girlfriend.</p>
              </article>
              <article>
                <span>Part 02 / Manipulated narrative</span>
                <h3>The Poaching Incident</h3>
                <p>The source film is cut, expanded, reframed, filtered and rescored to imply that an armed poacher hunts rare birds, processes and transfers them, then leaves the city by plane.</p>
              </article>
            </div>

            <blockquote className="ti-statement ti-statement-narrow">Can a library of editing operations turn an ordinary journey into a different but still legible and credible event?</blockquote>

            <div className="ti-video-pair">
              <VideoPlaceholder
                code="03-A"
                poster="/images/projects/truth-incubator/video-posters/original-narrative-02m21s.png"
                src="/media/truth-incubator/videos/original-narrative.mp4"
                summary="The unaltered short film establishes the source event and provides a baseline for comparison."
                title="Original Narrative"
              />
              <VideoPlaceholder
                code="03-B"
                src="/media/truth-incubator/videos/manipulated-narrative.mp4"
              poster="/images/projects/truth-incubator/video-posters/manipulated-narrative-00m00s500ms.png"
                summary="Selection, insertion, viewpoint, colour, music and external footage reconstruct the journey as a crime story."
                title="Manipulated Narrative"
              />
            </div>

            <section className="ti-storyline-comparison" aria-label="Shot-by-shot narrative comparison">
              <header><span>03-C / Narrative reconstruction</span><p>One source film · two constructed narratives</p></header>
              <StorylineRow
                beats={originalStoryBeats}
                code="Original"
                description="An ordinary Valentine’s Day journey reconstructed in chronological order."
                title="Source storyline"
              />
              <StorylineRow
                beats={manipulatedStoryBeats}
                code="Edited"
                description="Removed and inserted clips, changed viewpoints, filters, music and external footage imply a poaching operation without direct evidence."
                title="Manipulated storyline"
              />
            </section>

            <div className="ti-process-strip" aria-label="Montage experiment method">
              <article><span>01</span><strong>Establish baseline</strong><p>Record the original plot, footage and sequence as the source event.</p></article>
              <article><span>02</span><strong>Apply the library</strong><p>Use selection, insertion, viewpoint, colour, sound and montage operations.</p></article>
              <article><span>03</span><strong>Screen the re-edit</strong><p>Show the completed manipulated film without disclosing its intended plot.</p></article>
              <article><span>04</span><strong>Evaluate reception</strong><p>Compare audience reconstruction and credibility ratings with the intended narrative.</p></article>
            </div>

            <div className="ti-audience-test" id="audience-test">
              <header><span>03-D / Exploratory audience test</span><strong>47 valid responses</strong></header>
              <div className="ti-audience-meta">
                <p><b>Audience</b>Predominantly 20–30 years old; around 10% were 30–50.</p>
                <p><b>Task 01</b>After viewing the complete re-edit, choose one of three interpretations for each of its eight plot beats.</p>
                <p><b>Task 02</b>Rate the manipulated version&apos;s credibility from 1 to 5.</p>
              </div>
              <div className="ti-survey-charts">
                <NarrativeAccuracyChart />
                <CredibilityDistributionChart />
              </div>
              <footer>Across all eight plot beats, 348 of 376 selections matched the intended narrative · the manipulated film received a mean credibility rating of 4.62 / 5 · together, the results show that the combined editing operations communicated the intended alternative story to this test group.</footer>
            </div>

            <ResearchNote title="Validation, use and boundary">
              <p>The survey was designed and collected by Xuanyi Liu. The 92.6% reconstruction accuracy and 4.62 / 5 mean credibility rating provide project-specific evidence that this combination of editing operations could direct interpretation. This result allowed the library to be carried forward as the production logic for the final Content Farm film and game in Section 04. The 47-person, age-concentrated sample remains exploratory evidence, not a representative account of general media behaviour or a controlled measure of real-world belief.</p>
            </ResearchNote>

            <div className="ti-chain ti-validation-chain" aria-label="Validation sequence from research library to final output">
              <span>Editing library</span><i>→</i><span>Applied re-edit</span><i>→</i><span>Audience reconstruction</span><i>→</i><span>Project-specific validation</span><i>→</i><span>04 / Final production</span>
            </div>
          </section>

          <section className="ti-section" id="content-farm">
            <SectionHeading
              index="04"
              intro="With the editing library tested through the re-edited film and audience response, the final work scales those operations into an architectural and playable production system."
              kicker="Spatial narrative"
              title="Spatialising the Content Farm"
            />

            <ChapterSynopsis />

            <VideoPlaceholder
              code="04-B"
              poster="/images/projects/truth-incubator/video-posters/content-farm-beginning-01m44s.png"
              src="/media/truth-incubator/videos/content-farm-beginning.mp4"
              summary="The opening film moves from an overloaded city into the company’s public studios and finally towards its concealed production core."
              title="Inside the Content Farm"
            />

            <div className="ti-spatial-grid">
              <ImageFigure
                alt="Concentric floor plan with public media functions at the perimeter and supervision and editing spaces towards the centre"
                caption="The final plan links industrial hierarchy to spatial depth: public studios form the visible perimeter, shared production occupies the inner ring, and editing, typing and supervision converge at the core."
                code="04-C"
                height={2504}
                src="/images/projects/truth-incubator/spatial/content-farm-plan-01.webp"
                title="Final content-farm plan"
                width={1800}
              />
              <SpatialTypeMatrix />
            </div>

          </section>

          <section className="ti-section" id="production-loop">
            <SectionHeading
              index="05"
              intro="The second film segment moves the viewer from observing the company to performing its editorial task."
              kicker="Playable system"
              title="Playing the Production Loop"
            />

            <VideoPlaceholder
              code="05-A"
              poster="/images/projects/truth-incubator/video-posters/content-farm-interaction-interface.jpg"
              src="/media/truth-incubator/videos/content-farm-interaction.mp4"
              summary="Gameplay demonstration: collect footage, edit a coherent and dramatic story, publish it, then repeat the operation with the same event."
              title="Gameplay Demonstration"
            />

            <div className="ti-copy-pair">
              <p className="ti-lead">The film leads the player into the core editing room. Video fragments are distributed across screens in the space; the player collects them, returns to the editing console and arranges them into a publishable story.</p>
              <p>The interface does not measure objective truth. It models the company&apos;s internal production criteria: whether the story feels coherent enough to pass and dramatic enough to attract attention.</p>
            </div>

            <GameFlowFigure />

            <div className="ti-metric-grid">
              <article><span>Metric 01</span><h3>Authenticity</h3><strong>&gt; 60%</strong><p>Internal logic and narrative continuity—not correspondence with the original event.</p></article>
              <article><span>Metric 02</span><h3>Expected impact</h3><strong>&gt; 60%</strong><p>Dramatic intensity, topical potential and the company&apos;s estimate of public attention.</p></article>
            </div>

            <div className="ti-loop" aria-label="Game production loop">
              <span>Enter core</span><i>→</i><span>Collect clips</span><i>→</i><span>Edit</span><i>→</i><span>Pass both thresholds</span><i>→</i><span>Publish</span><i>→</i><span>Watch impact</span><i>↺</i>
            </div>

            <blockquote className="ti-statement">Three releases are not simply three acts of fabrication. Together they form one information-overload operation.</blockquote>

            <ResearchNote title="Clear condition">
              <p>The player must use one original event to publish three fake-news versions with substantially different plots. Each release automatically plays the edited video and its social consequence. After the third successful release, the system declares that the player has produced information paralysis.</p>
            </ResearchNote>
          </section>

          <section className="ti-section" id="information-paralysis">
            <SectionHeading
              index="06"
              intro="The ending returns the player&apos;s three releases to the public information environment and shows volume itself becoming a control mechanism."
              kicker="System outcome"
              title="When Volume Becomes Control"
            />

            <VideoPlaceholder
              code="06-A"
              poster="/images/projects/truth-incubator/video-posters/content-farm-ending-00m07s.png"
              src="/media/truth-incubator/videos/content-farm-ending.mp4"
              summary="The closing film shows conflicting stories occupying public attention after the player completes the third release."
              title="Information Paralysis"
            />

            <div className="ti-copy-pair">
              <p className="ti-lead">The company does not need everyone to accept one false story. It succeeds when discussion is redirected towards competing versions, verification becomes exhausting and the original event is no longer the centre of attention.</p>
              <p>In this project, information paralysis names that designed condition: the truth has not disappeared, but it has become difficult to identify, maintain as a priority or continue caring about.</p>
            </div>

            <blockquote className="ti-closing-statement">The most effective concealment may not be removing the truth, but making it only one version among many.</blockquote>
          </section>

          <section className="ti-section" id="contribution">
            <SectionHeading
              index="07"
              intro="The project makes a normally hidden production mechanism spatial, cinematic and playable while keeping its claims within the limits of the available evidence."
              kicker="Contribution + boundary"
              title="Making the Production Mechanism Visible"
            />

            <div className="ti-contribution-grid">
              <article><span>01</span><h3>From truth value to attention</h3><p>The research asks not only which story is false, but which stories keep occupying attention and which events disappear as a result.</p></article>
              <article><span>02</span><h3>From taxonomy to interaction</h3><p>The editing library becomes an experimental method and then a set of choices, thresholds and consequences inside the game.</p></article>
              <article><span>03</span><h3>From industry to architecture</h3><p>The content farm turns a public media façade, a production layer and a hidden control core into one legible spatial sequence.</p></article>
            </div>

            <div className="ti-role-grid">
              <header><span>Team and contribution</span><strong>Boxuan Zhao · Xuanyi Liu</strong></header>
              <article><span>Independent</span><h3>Boxuan Zhao</h3><p>Environment building and animation production for both film components.</p></article>
              <article><span>Collaborative</span><h3>Shared work</h3><p>Game interaction development, preliminary research text, most research diagrams and all other unspecified production.</p></article>
              <article><span>Independent</span><h3>Xuanyi Liu</h3><p>Visual drawing of the editing-technique library; design and collection of the Kuleshov-effect audience survey.</p></article>
            </div>

            <div className="ti-boundary-grid">
              <article><span>Test boundary</span><p>The 47 valid survey responses are age-concentrated exploratory feedback, not a representative media-effects study.</p></article>
              <article><span>Concept boundary</span><p>Information paralysis is the project&apos;s synthesis of overload, fatigue, avoidance and strategic distraction—not a single established diagnosis.</p></article>
              <article><span>System boundary</span><p>The two game metrics are narrative feedback inside a simplified production model, not a validated prediction of real-world circulation.</p></article>
            </div>

            <div className="ti-chain ti-method-chain" aria-label="Project method chain">
              <span>Media research</span><i>→</i><span>Editing taxonomy</span><i>→</i><span>Montage test</span><i>→</i><span>Spatialisation</span><i>→</i><span>Film</span><i>→</i><span>Game</span><i>→</i><span>Information paralysis</span>
            </div>

            <ResearchNote className="ti-references-note" title="References">
              <div className="ti-references">
                {references.map((reference) => (
                  <p key={reference}>{reference}</p>
                ))}
              </div>
            </ResearchNote>
          </section>
        </article>
      </div>

      <section className="detail-next page-shell ti-next">
        <div><p className="eyebrow">Next project</p><p>{nextProject.title.en}</p></div>
        <ProjectTransitionLink href={`/projects/${nextProject.slug}`}>Continue <span>↗</span></ProjectTransitionLink>
      </section>
    </main>
  );
}
