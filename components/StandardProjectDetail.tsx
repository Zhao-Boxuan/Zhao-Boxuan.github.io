import type { Project, ProjectCategory } from '@/types/content';
import { BackToProjectLink } from '@/components/BackToProjectLink';
import { ProjectTransitionLink } from '@/components/ProjectTransition';
import { DecorativeNetwork } from '@/components/DecorativeNetwork';
import { ScrollTransitions } from '@/components/ScrollTransitions';

interface StandardProjectDetailProps {
  category?: ProjectCategory;
  nextProject: Project;
  project: Project;
}

interface FinalizedProjectCopy {
  areaLabel?: string;
  areaLocation: string;
  bidResult?: string;
  clientProfile?: string;
  heroProposition?: string;
  overviewBody?: string;
  overviewHeading?: string;
  participationStages: string;
  reflectionBody: string;
  reflectionHeading: string;
}

const finalizedProjectCopy: Record<string, FinalizedProjectCopy> = {
  'attention-economics': {
    areaLocation: '150 sqm · Shanghai, China',
    clientProfile: 'Co-branding with an aluminium-profile supplier',
    heroProposition: 'Coordinating Spatial and Multimedia Systems from Concept to Installation',
    overviewBody: 'Created by VAVE STUDIO × Flamingos for Design Shanghai 2025, the “Information Jungle” explores how attention is captured, fragmented and redirected within dense media environments. A field of 60×60×420 mm aluminium modules forms both spatial structure and visual rhythm, while custom LED arrays scatter fragments of digital content through the installation. Translucent gauze threads between the modules like mist, softening boundaries and inviting exploration. At the centre, the curtained “Focus-on” Room isolates one visitor with noise-cancelling earmuffs and a timed pick-up-sticks game, turning sustained concentration into a direct bodily experience.',
    overviewHeading: 'A Concept Pavilion for Design Shanghai 2025',
    participationStages: 'Schematic design · Design development',
    reflectionHeading: 'Resolving Art Through Technical Detail',
    reflectionBody: 'Following this conceptual art booth through detailed design and construction taught me how an abstract spatial idea is translated into a buildable installation. When a supplier change required the display system to shift from LCD to LED, I coordinated repeated adjustments to screen edging, heat dissipation, overall thickness and visual integration. Pre-assembly and equipment commissioning sharpened my judgement of materials, fabrication tolerances and on-site contingencies. Within the compact open booth, I also coordinated circulation, human-scale clearances and visitor safety, while arranging overhead elements to preserve the effective coverage of the venue’s fire sprinklers. The process strengthened my ability to protect a clear artistic concept through precise technical decisions.',
  },
  'bailian-booth': {
    areaLocation: '1,000 sqm · Shanghai, China',
    bidResult: 'Won the bid',
    clientProfile: 'Department-store and import-trade brands · State-owned company',
    heroProposition: 'Coordinating Spatial and Multimedia Design from Concept to Construction',
    overviewBody: 'Presented at the China International Import Expo in Shanghai, the booth gave Bailian—one of China’s largest commercial distribution groups—a distinctive identity within a field of global brands. The concept translated the brand’s “the Balancing” philosophy into a folded surface inspired by the two sides of a sheet of paper. Repeated cuts, curves and inversions generated positive and negative spaces, creating a recognisable identity while adapting to varied exhibits. A buildable steel-frame system carried this language across display counters, suspended bands and partitions, while three integrated media screens, zoning and choreographed circulation formed a coherent visitor journey.',
    overviewHeading: 'A Brand Pavilion at China’s Premier Import Expo',
    participationStages: 'Schematic design · Design development · Construction documents',
    reflectionHeading: 'Making Coherence Buildable',
    reflectionBody: 'I led every stage of this project, from concept development and the bid through detailing and on-site delivery. Its compressed schedule required rapid coordination with fabricators, contractors and media teams, sharpening my judgement about materials, construction methods, tolerances and sequencing. Pre-assembly and equipment testing taught me to anticipate failure points and respond decisively on site. The challenge was carrying one curved spatial language across display fixtures, screens, printed graphics and circulation. Translating between design intent and fabrication constraints showed me that technical knowledge is what allows a concept to adapt without losing its clarity.',
  },
  'my-museum': {
    areaLocation: '1,800 sqm · Beijing, China',
    clientProfile: 'Top-tier pharmaceutical company · State-owned company',
    heroProposition: 'Detailing Spatial Sequences Through Embodied Interactive Exhibits',
    overviewBody: 'Sinovac — [My] Museum frames life science as a personal investigation across seven gallery-like zones. A decentralised first-person narrative unfolds through multisensory exhibits that invite visitors to learn through movement, touch and perception. At the centre, an oversized bust of [Me] anchors the full-height atrium and turns the building into a spatial portrait of the visitor. Carefully placed openings create moments of self-dialogue across galleries, linking distinct embodied encounters into a coherent sequence of discovery, reflection and renewed curiosity.',
    overviewHeading: 'An Exploratory Life Science Museum',
    participationStages: 'Design development · Construction documents',
    reflectionHeading: 'Making Interaction Feel Instinctive',
    reflectionBody: 'I was involved only during detailed design and construction, focusing primarily on refining interactive exhibit props. Working with prop and screen suppliers and the multimedia-content team, I repeatedly adjusted physical details, sensor behaviour and media responses to achieve natural interactions within cost and schedule constraints. This work introduced me to the practical logic of varied sensors and information media, while requiring each exhibit to be resolved at human scale. I learned to coordinate structure, power, lighting control, heat dissipation and maintenance access as interconnected parts of the experience, translating interaction concepts into robust, buildable systems.',
  },
  'marine-windpath': {
    areaLabel: 'Project system',
    areaLocation: 'Port–island environmental infrastructure · Five programmed floors',
    clientProfile: 'Private commission · Owner of Sultan Island',
    heroProposition: 'Translating Desalination Systems into Computational Design and Structural Simulation',
    overviewBody: 'Commissioned by the owner of Sultan Island, Marine Windpath reimagines the island as a seawater-purification and plant-cultivation base. Its access bridge integrates laboratories for these programmes while acting as a wind-harvesting net between island and port, making airflow visible and supplying energy to the facilities. An eight-metre steel-truss grid forms the primary structure; at circulation nodes, supports split into paired slender columns to connect adjoining spans. Parametric rules generated structural variations, which were tested and refined in Karamba before a final cost estimate was developed.',
    overviewHeading: 'A Steel-Truss Bridge Complex',
    participationStages: 'Concept design · Computational design · Structural simulation · Cost estimation',
    reflectionHeading: 'Designing Through Structural Evidence',
    reflectionBody: 'Marine Windpath was my first opportunity to carry an architectural project through a complete engineering workflow for an actual client. Working under Professor Joseph Lim, a structural specialist, shifted my attention from formal intention toward decisions grounded in fabrication, assembly and structural behaviour. Each design adjustment had to remain legible as both an architectural idea and a buildable system. Developing parametric variations, testing them through structural simulation and comparing their cost implications strengthened my ability to organise and interpret data. More importantly, the process established a more scientific and rigorous working method, where form is tested, evaluated and revised through evidence, allowing measurable feedback to guide intuition.',
  },
  'penguin-island': {
    areaLocation: '1,000 sqm opening zone · 10,000 sqm total · Shenzhen, China',
    bidResult: 'Won the bid',
    clientProfile: 'Top-tier technology and game company',
    heroProposition: 'Developing an Immersive Theme-Park Experience Through XR',
    overviewBody: 'Within Tencent’s planned 2030 “Internet+” technology city, MAD’s “Tencent Eye” is conceived as a 10,000 sqm game-IP experience hall. Its opening sequence, “Night at the Office,” transforms a familiar workplace through responsive lighting, fragmented screen imagery and XR encounters: orderly desks dissolve into an enlarged nocturnal world where sketches, interfaces and IP characters appear to come alive. A closed-loop ride, using paired gaming-chair vehicles and gentle gradients, threads through the sequence, while concealed vehicle-return and maintenance routes integrate operation into the spatial choreography.',
    overviewHeading: 'A 2030 Game IP Experience Hall',
    participationStages: 'Schematic design',
    reflectionHeading: 'Designing for Uncertain Realities',
    reflectionBody: 'I independently developed “Night at the Office” while also contributing spatial design to several other zones. Because the bid projected five years ahead, its technologies could not be treated as fixed. I researched emerging MR systems, mapped their spatial implications and prepared alternative scenarios so the concept could survive changes in hardware and capability. Collaboration with game-experience specialists helped translate screen-based play into embodied encounters, sharpening my understanding of how virtual content, movement and physical space can reinforce one another. The volume of custom IP imagery also prompted me to establish a standardised AI-assisted workflow from the outset, improving speed while keeping each asset traceable, editable and consistent throughout development.',
  },
  'super-plantation': {
    areaLabel: 'Project site',
    areaLocation: 'Former Kaixue Flour Mill · Kaifu District, Changsha, China',
    heroProposition: 'From Public Sentiment to Spatial Form: A Social-Stitching Strategy',
    overviewBody: 'The former Kaixue Flour Mill had long anchored the local economy, yet its enclosed industrial presence, pollution and noise also strained surrounding public life. After its closure, these accumulated tensions intensified as jobs disappeared and public distrust remained. Based on research with elderly residents, laid-off workers and migrant workers, the proposal embeds a counter-urbanisation logic by turning the landmark silos into vertical farms and reorganising the site as a productive complex combining farming, markets, dining, education and parkland. Formally, a divisible inverted-arch system, derived from the silos’ concrete geometry, supports planted roofs while spatially stitching the scale difference between high-rise housing to the east and informal low-rise settlements to the west.',
    overviewHeading: 'Adaptive Reuse of the Kaixue Flour Mill',
    participationStages: 'Site research · Urban strategy · Architectural and landscape design',
    reflectionHeading: 'Urban Renewal Begins by Reorganising Relationships',
    reflectionBody: 'This project consolidated my approach to urban renewal as a process of reorganising ecological and social relationships across a district. I learned to begin with patient investigation of conflict and lived needs, then test those findings through spatial-syntax analysis, building assessment and stakeholder mapping. Translating evidence into a coherent architectural system taught me how design can connect public sentiment, employment, heritage and open space without flattening their tensions. It established a method I continue to use: move from social research to measurable analysis, then turn that knowledge into precise spatial decisions.',
  },
  'village': {
    areaLabel: 'Project scale',
    areaLocation: '147,860 sqm site · 134,420 sqm total construction area',
    heroProposition: 'Developing Bottom-Up Urban Renewal through a Spatial Plug-in System',
    overviewBody: 'Set within an underdeveloped urban fringe at the foot of Yuelu Mountain, VillaGE begins with a systematic assessment of buildings, terrain and fragmented land ownership. Rather than imposing a comprehensive top-down redevelopment, the proposal organizes an incremental, voluntary process around the area’s existing small-scale cultivation economy. Resource exchange aligns the interests of residents, government and developers, while adaptable spatial plug-ins activate courtyards, roofs, residual ground and building edges. Together, these interventions improve production, connect scattered activities and allow renewal to emerge through negotiated participation instead of wholesale displacement.',
    overviewHeading: 'Urban Village Renewal at Yuelu Foothills',
    participationStages: 'Urban research · Productive-landscape strategy · Typology development · Masterplanning',
    reflectionHeading: 'Design as Negotiation',
    reflectionBody: 'Working at the scale of urban systems changed how I understood the designer’s role. A proposal cannot simply project individual intent onto a community; it must uncover the needs, leverage and constraints of residents, developers and government, then turn those competing positions into workable relationships. VillaGE taught me to treat design as a framework for negotiation: intervening selectively, preserving agency and using limited spatial moves to create conditions in which several stakeholders can benefit.',
  },
  'neon-harbor': {
    areaLabel: 'Project site',
    areaLocation: 'Xi’an city wall · street and park edges',
    heroProposition: 'A Social Inquiry into Urban Homelessness and a Spatial Proposition',
    overviewBody: 'During COVID-19, people experiencing homelessness were among the city’s most vulnerable groups, while hostile features—from spikes beneath overpasses to divided benches—continued to deny them places to rest. Around Xi’an’s city wall, I mapped possessions, resting locations and daily movements through repeated observation, informal interviews and contextual research into homelessness in China. These findings informed an operating model that reframed survival in residual urban space as reciprocal coexistence. An adaptive dwelling structure attached lightly to the wall provides shelter, storage and livelihood support, enabling more dignified participation in city life.',
    overviewHeading: 'An Adaptive Dwelling Structure beneath the City Wall',
    participationStages: 'Urban observation · Social research · System design · Micro-architecture development',
    reflectionHeading: 'What Design Could Not Resolve',
    reflectionBody: 'This self-initiated project began outside any course brief as a social inquiry. Its idealised design remained speculative, but the fieldwork taught me to look beyond visible conditions towards the systems producing exclusion. It also seeded a question later developed in AR District: how can heritage-constrained areas sustain active urban life? After the pandemic, I could barely find the people I had observed nearby, and I still do not know where they went. I regret that I could not follow their stories further. That uncertainty made me confront the limits of my access, knowledge and agency as a designer.',
  },
  't-rollerrent': {
    areaLabel: 'Project scale',
    areaLocation: '17,732 sqm site · 83,023 sqm total construction area',
    heroProposition: 'Translating Spatial Equity\ninto Parametric Machine Architecture',
    overviewBody: 'Drawing on observations of urban movement, programme distribution and public-space use, the proposal addresses the mismatch between fixed architecture and shifting spatial demand. Inspired by Le Corbusier’s centralised city model, two towers are joined at their crowns while conventional fixed floors give way to mechanical tracks and standardised modules. A vortex-shaped podium draws movement inward and releases the ground level as public space. Residential, workplace and commercial capsules circulate along the track system, forming a vertical city where mobile private spaces intersect with stable public infrastructure and spatial access can be continually redistributed.',
    overviewHeading: 'A Twin-Tower High-Rise Building',
    participationStages: 'Academic research · Urban-system design · Architectural development',
    reflectionHeading: 'Technology as Social Expression',
    reflectionBody: 'This project became an experiment in dissolving the boundary between architecture and machinery. Without a fixed construction budget, Zhang Jiasheng and I used its speculative scope to articulate spatial equity and the architect’s social responsibility through a mechanically reconfigurable high-rise. Our tutor encouraged us to test that ambition technically at tower scale, translating a provocative premise into parametric systems, circulation logic and detailed drawings. Fabrication, operation and safety would still require substantial resolution, yet advancing the proposal from an audacious idea to a technically described mechanism showed me how social commitments can become spatially explicit through design.',
  },
};

const studentProjectTeams: Record<string, string> = {
  'marine-windpath': 'Individual project (initial site design with Zhang Jiasheng)',
  'neon-harbor': 'Individual project',
  'super-plantation': 'Individual project',
  't-rollerrent': 'With Zhang Jiasheng',
  'fudi-gymnasium': 'With Zhang Jiasheng',
  'village': 'With Zhang Jiasheng, Deng Ziyu and Xu Zhengwen',
};

const studentProjectSupervisors: Record<string, string> = {
  'marine-windpath': 'Joseph Lim',
  'neon-harbor': 'Hong Yang',
  'super-plantation': 'Li Xu, Hong Yang',
  't-rollerrent': 'Lu Jiansong',
  'fudi-gymnasium': 'Lu Jiansong',
  'village': 'Jiang Suqi',
};

export function StandardProjectDetail({ category, nextProject, project }: StandardProjectDetailProps) {
  const isStudentProject = project.slug in studentProjectTeams || /academic|student/i.test(project.role.en);
  const finalizedCopy = finalizedProjectCopy[project.slug];
  const projectNature = isStudentProject ? 'Student project' : 'Professional project';
  const projectTeam = studentProjectTeams[project.slug] ?? 'To be completed';
  const projectSupervisor = studentProjectSupervisors[project.slug];
  const placeholderCount = finalizedCopy ? project.gallery.length : Math.max(3, project.gallery.length);

  return (
    <main className={`project-detail standard-project-detail standard-project-detail--${project.slug}`}>
      <DecorativeNetwork variant="detail" />
      <ScrollTransitions variant="detail" />

      <header className="detail-nav page-shell hj-topbar">
        <BackToProjectLink projectSlug={project.slug} />
        <span>Work sample / {project.number}</span>
      </header>

      <section className="hj-hero page-shell" id="overview">
        <div className="hj-hero-meta">
          <p className="eyebrow">{project.category.en}</p>
          <span>{project.year}</span>
          <span>{projectNature}</span>
        </div>

        <div className="hj-hero-title">
          <p>{category?.title.en ?? project.category.en}</p>
          <h1>{project.title.en}</h1>
        </div>

        <div className="hj-hero-deck">
          <p className="hj-hero-role">{project.role.en}</p>
          <p className="hj-hero-proposition">{finalizedCopy?.heroProposition ?? project.summary.en}</p>
        </div>

        {project.image && (
          <figure className="hj-hero-figure">
            <img
              alt={project.imageAlt}
              decoding="async"
              src={project.image}
            />
          </figure>
        )}
      </section>

      <section className="hj-introduction page-shell" id="project-overview">
        <div className="hj-overview-body">
          <div className="hj-overview-copy">
            <header className="hj-section-heading">
              <p className="eyebrow">01 / Project overview</p>
              <h2>{finalizedCopy?.overviewHeading ?? project.summary.en}</h2>
            </header>
            <p className="hj-author-intro">{finalizedCopy?.overviewBody ?? project.description.en}</p>
          </div>

          <dl className="hj-project-data" aria-label="Project information">
            <div><dt>Project period</dt><dd>{project.year}</dd></div>
            <div><dt>Project nature</dt><dd>{projectNature}</dd></div>
            <div><dt>{finalizedCopy?.areaLabel ?? (finalizedCopy ? 'Project area / location' : 'Project type')}</dt><dd>{finalizedCopy?.areaLocation ?? project.category.en}</dd></div>
            {finalizedCopy?.clientProfile && <div><dt>Client profile</dt><dd>{finalizedCopy.clientProfile}</dd></div>}
            {projectSupervisor && <div><dt>Supervisor</dt><dd>{projectSupervisor}</dd></div>}
            <div>
              <dt>{isStudentProject ? 'Project team' : 'Participation stages'}</dt>
              <dd>{isStudentProject ? projectTeam : (finalizedCopy?.participationStages ?? 'To be completed')}</dd>
            </div>
            <div><dt>Responsibilities</dt><dd>{project.role.en}</dd></div>
            {finalizedCopy?.bidResult && <div><dt>Bid result</dt><dd>{finalizedCopy.bidResult}</dd></div>}
            {!finalizedCopy && !isStudentProject && <div><dt>Bid result</dt><dd>To be completed</dd></div>}
          </dl>
        </div>
      </section>

      <section className="hj-portfolio" id="portfolio-sequence" aria-label="02 / Portfolio page placeholders">
        <div className="hj-sheet-list page-shell">
          {Array.from({ length: placeholderCount }, (_, index) => {
            const sheet = project.gallery[index];

            return (
            <figure key={sheet?.src ?? `${project.slug}-placeholder-${index + 1}`}>
              <figcaption className="hj-sheet-title">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{sheet?.caption ?? `Portfolio page ${String(index + 1).padStart(2, '0')}`}</p>
              </figcaption>
              {finalizedCopy && sheet ? (
                <img
                  alt={`${project.title.en} — ${sheet.caption}`}
                  decoding="async"
                  loading="lazy"
                  src={sheet.src}
                />
              ) : (
                <div
                  className="standard-sheet-placeholder"
                  role="img"
                  aria-label={`${project.title.en} portfolio page ${index + 1} placeholder`}
                >
                  <span>Image placeholder</span>
                  <p>Replace with final portfolio page</p>
                </div>
              )}
            </figure>
            );
          })}
        </div>
      </section>

      <section className="hj-reflection page-shell" id="personal-reflection">
        <header className="hj-section-heading">
          <p className="eyebrow">03 / Personal reflection</p>
          <h2>{finalizedCopy?.reflectionHeading ?? 'Project-specific reflection to be completed.'}</h2>
        </header>
        <p className="hj-reflection-copy">{finalizedCopy?.reflectionBody ?? 'This section is reserved for a concise reflection on what I learned from the project, the decisions I made, and how the work influenced my later design practice.'}</p>
      </section>

      <section className="detail-next page-shell hj-next">
        <div><p className="eyebrow">Next project</p><p>{nextProject.title.en}</p></div>
        <ProjectTransitionLink href={`/projects/${nextProject.slug}`}>Continue <span>↗</span></ProjectTransitionLink>
      </section>
    </main>
  );
}
