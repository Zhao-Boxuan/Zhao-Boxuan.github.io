export type AssetStatus = 'confirmed' | 'planned';

export interface ResearchAsset {
  code: string;
  label: string;
  status: AssetStatus;
  ratio?: 'landscape' | 'wide' | 'portrait' | 'square' | 'panorama';
}

export const articleNav = [
  { id: 'technical-boundary', index: '01', label: 'Technical conditions' },
  { id: 'mode-selection', index: '02', label: 'Mode selection' },
  { id: 'first-prototypes', index: '03', label: 'Site-free prototypes' },
  { id: 'low-intervention', index: '04', label: 'Why this district' },
  { id: 'fieldwork', index: '05', label: 'Spatial transformation' },
  { id: 'spatial-narrative', index: '06', label: 'Spatial narrative' },
  { id: 'shared-ar', index: '07', label: 'Shared AR' },
  { id: 'personal-ar', index: '08', label: 'Personal AR' },
  { id: 'headset-design', index: '09', label: 'Headset design' },
  { id: 'evidence-boundary', index: '10', label: 'Contributions + tests' },
];

export const technicalVariables = [
  { index: '01', title: 'Spatial registration', body: 'Can digital content remain aligned with buildings, routes, surfaces and objects while a headset, phone or vehicle moves?' },
  { index: '02', title: 'Display legibility', body: 'Will images remain readable on a headset, handheld screen, transparent display or camera feed under local lighting?' },
  { index: '03', title: 'Processing + connectivity', body: 'Which functions require an immediate local response, and which can rely on edge or cloud services without interrupting the experience?' },
  { index: '04', title: 'Wearability + duration', body: 'How do mass, balance, posture, battery life and session length limit sustained use?' },
  { index: '05', title: 'Audio + co-presence', body: 'How can media remain intelligible while preserving conversation, privacy and awareness of the surroundings?' },
];

export const modeQuadrants = [
  { code: 'Q-01', mode: 'Fixed + Shared', scene: 'Courtyard AR Theatre', equipment: 'Site-calibrated display + public soundfield', advantage: 'High capacity without personal devices', limit: 'Sightlines, daylight and sound spill', audio: 'Public or zoned soundfield', target: 'shared-ar' },
  { code: 'Q-02', mode: 'Fixed + Personal', scene: 'City Wall AR Cinema', equipment: 'Headset + wall anchor + personal audio', advantage: 'Different media in one shared place', limit: 'Device turnover, fatigue and outdoor contrast', audio: 'Individually synchronised audio', target: 'personal-ar' },
  { code: 'Q-03', mode: 'Mobile + Shared', scene: 'AR Bus', equipment: 'Window display + vehicle positioning', advantage: 'A group follows one place-triggered route', limit: 'Positioning, vibration, reflection and motion sickness', audio: 'Shared ambience + optional language channel', target: 'shared-ar' },
  { code: 'Q-04', mode: 'Mobile + Personal', scene: 'Indoor AR Exhibition + Outdoor Trail', equipment: 'Tracked headset indoors + location-linked smartphone extension outdoors', advantage: 'Content follows location, body position and choice', limit: 'Tracking, daylight, compatibility, safety and privacy', audio: 'Personal spatial or device audio with environmental awareness', target: 'personal-ar' },
];

export const selectionQuestions = [
  'What physical object, surface or route anchors the digital content, and does that anchor constrain the viewing position?',
  'How much registration, occlusion and continuous tracking does it require?',
  'Does the user watch from a fixed point, walk, or move with a vehicle?',
  'Is media received and controlled by the public, a group, or an individual?',
  'What limits are introduced by light, sound, posture and duration?',
];

export const prototypes = [
  { code: 'P-01', title: 'Remote Chatroom', group: 'Access-based', question: 'How can a fixed capture and display zone support remote co-presence?', image: '/images/projects/digi-tao/p3/remote-chatroom.webp', alt: 'Remote Chatroom speculative AR collage' },
  { code: 'P-02', title: 'Shared Cinema', group: 'Access-based', question: 'How can people share one place while receiving different media?', image: '/images/projects/digi-tao/p3/shared-cinema.webp', alt: 'Shared Cinema speculative AR collage', carried: true },
  { code: 'P-03', title: 'Meditation / Prayer Space', group: 'Access-based', question: 'How can digital atmosphere extend a bounded contemplative space?', image: '/images/projects/digi-tao/p3/meditation-prayer-space.webp', alt: 'Meditation and Prayer Space speculative AR collage' },
  { code: 'P-04', title: 'Simulated Home Improvement', group: 'Editing-based', question: 'How can AR support comparison before physical change?', image: '/images/projects/digi-tao/p3/simulated-home-improvement.webp', alt: 'Simulated Home Improvement speculative AR collage' },
  { code: 'P-05', title: 'Augmented Public Space Co-habitation', group: 'Editing-based', question: 'Who may edit and see a shared digital layer in public space?', image: '/images/projects/digi-tao/p3/augmented-public-space.webp', alt: 'Augmented Public Space Co-habitation collage in a shared public setting' },
];

export const fieldRequirements = [
  ['Fewer long-term residents; younger operators and visitors dominate current use', 'Prioritise short, updateable cultural and commercial experiences over a resident-governance programme'],
  ['Businesses differ in space, budget and interest', 'Allow businesses to participate at node scale'],
  ['Buildings differ in structure, floor count and access', 'Concentrate fixed systems at maintainable nodes; route mobile systems selectively'],
  ['Narrow streets mix walking, vehicles and stopping', 'Place complex interaction at safe stopping points and keep mobile input light'],
  ['Digital-tourism delivery routes exist', 'Test StoBtoC as a candidate delivery and operating route'],
  ['The temple and city wall provide specific local references', 'Anchor cultural content to these physical places'],
];

export const spatialTransformationResults = [
  { index: '01', title: 'Continuous ground-floor route', body: 'Directly connected to the outdoor street network, the ground floor forms a linear public route through streets and shopfronts.' },
  { index: '02', title: 'Parallel second-floor spaces', body: 'Selected passages between adjacent buildings turn the second floor into an internally connected network of parallel branches.' },
  { index: '03', title: 'Distributed upper-level nodes', body: 'Differences in building height break the upper floors and rooftops into discrete indoor-outdoor nodes, not all directly reachable without changing level.' },
];

export const spatialTransformationSteps = [
  {
    index: '01',
    title: 'Reconnect the site',
    body: 'Open three blocked access roads and clarify the street hierarchy.',
    src: '/images/projects/digi-tao/p5/p5-step-01.webp',
    alt: 'Site access diagram showing the existing road hierarchy and three newly opened north-south connections',
  },
  {
    index: '02',
    title: 'Build the AR bus loop',
    body: 'Add dedicated parking, ticket booths and stops along a continuous route.',
    src: '/images/projects/digi-tao/p5/p5-step-02.webp',
    alt: 'Site circulation diagram showing the AR bus loop, parking areas, ticket office and bus stops',
  },
  {
    index: '03',
    title: 'Identify roof terraces',
    body: 'Use storey heights and existing roof gardens to prioritise south-facing views.',
    src: '/images/projects/digi-tao/p5/p5-step-03.webp',
    alt: 'Building-height diagram identifying roof gardens and south-facing terrace opportunities',
  },
  {
    index: '04',
    title: 'Map ground-floor openness',
    body: 'The city-wall edge is the most open and publicly accessible side.',
    src: '/images/projects/digi-tao/p5/p5-step-04.webp',
    alt: 'Ground-floor permeability diagram comparing open and enclosed buildings and boundaries',
  },
  {
    index: '05',
    title: 'Place AR screen routes',
    body: 'Follow the most open street-facing building frontages.',
    src: '/images/projects/digi-tao/p5/p5-step-05.webp',
    alt: 'Site diagram locating AR screen routes along open street-facing frontages',
  },
  {
    index: '06',
    title: 'Distribute AR interfaces',
    body: 'Locate suspended windows and interactive devices by programme and public-space intensity.',
    src: '/images/projects/digi-tao/p5/p5-step-06.webp',
    alt: 'Site diagram locating AR suspended windows and interactive installations around public spaces',
  },
];

export const narrativePaths = [
  { code: '1F', title: 'Han Xiangzi as a Historical Figure', pattern: 'Linear chronology', body: 'A chronological account of Han Xiangzi as a historical figure unfolds progressively along the continuous ground-floor route.', anchor: 'Ground-floor streets + shopfronts', action: 'Follow one continuous sequence', cue: 'Historical episodes within everyday commercial activity' },
  { code: '2F', title: 'Becoming an Immortal', pattern: 'Parallel variants', body: 'The branching second-floor network presents multiple versions of Han Xiangzi’s path to immortality in parallel, allowing visitors to compare them within one coherent narrative system.', anchor: 'Parallel second-floor rooms', action: 'Choose, compare + return', cue: 'Alternative transformation stories within Daoist themes' },
  { code: '3F', title: 'Han Xiangzi as an Immortal', pattern: 'Distributed episodes', body: 'Stories of Han Xiangzi as one of the Eight Immortals are only loosely chronological, so self-contained episodes occupy distributed upper-level nodes and can be encountered independently.', anchor: 'Scattered third-floor + rooftop nodes', action: 'Discover + pause in any order', cue: 'Self-contained mythic episodes at selective destinations' },
];

export const sharedScenes = [
  { code: 'Q-01', title: 'Courtyard AR Theatre', mode: 'Fixed + Shared', body: 'Site-calibrated displays layer registered figures, effects and interpretive information onto a live courtyard performance for a high-capacity audience.', anchor: 'Circular courtyard', audience: 'Public', audio: 'Public / zoned', constraint: 'Sightlines + daylight + spill' },
  { code: 'Q-03', title: 'AR Bus', mode: 'Mobile + Shared', body: 'A positioned window display aligns characters, labels and story fragments with buildings and the city wall along a controlled route.', anchor: 'Vehicle route + landmarks', audience: 'Group', audio: 'Shared ambience + optional language channel', constraint: 'Positioning + vibration + reflection' },
];

export const personalScenes = [
  { code: 'Q-02', title: 'City Wall AR Cinema', mode: 'Fixed + Personal', body: 'From a known terrace viewpoint, each visitor receives a film registered to the protected wall and can choose an individual language and start time.', anchor: 'Wall profile + fixed viewing point', audience: 'Co-located individuals', audio: 'Personal synchronised stream', constraint: 'Contrast + fatigue + leakage' },
  { code: 'Q-04', title: 'Indoor AR Exhibition + Outdoor Trail', mode: 'Mobile + Personal', body: 'Inside, tracked content changes with each visitor’s position, route and chosen objects. Outside, a location-linked smartphone trail extends the experience when a headset is unnecessary.', anchor: 'Spatial map + exhibits / outdoor route', audience: 'Individual visitors', audio: 'Tracked headset / personal device', constraint: 'Tracking + daylight + compatibility + safety' },
];

export const headsetStudies = [
  { title: 'Balance', demand: 'Looking up and walking change load direction, while longer sessions accumulate pressure and discomfort.', response: 'Move power off the head, distribute sensing and compute modules, and compare three centres of mass.', test: 'Compare the three layouts across forward, upward and downward viewing postures.' },
  { title: 'Audio', demand: 'Personal media must coexist with dialogue, obstacles and public warning sounds.', response: 'Integrate near-ear audio, then compare closed, open and adjustable acoustic-transparency states.', test: 'Measure intelligibility, leakage, eavesdropping, warnings and audiovisual synchronisation.' },
  { title: 'Social form', demand: 'Because the headset remains visible throughout public use, its form affects both the wearer and nearby people.', response: 'Treat the device as a visible public wearable and test how strongly its technical character should be expressed.', test: 'Use wear trials and interviews to compare recognition, acceptance and perceived social distance.' },
];

export const evidenceGroups = [
  { label: 'Traceable method', title: 'What was developed', items: ['Requirements derived from conservation, spatial, social-sensory, operational and narrative records.', 'Media choice followed by a two-axis configuration comparison.', 'Decision records retaining alternatives and the reasons behind each choice.'] },
  { label: 'Cross-case findings', title: 'What the cases show', items: ['Shared modes concentrate support in public displays, soundfields, route timing and operator coordination.', 'Personal modes add fitting, calibration, individual timing, privacy and device turnover.', 'Movement-responsive modes require continuous positioning and stronger environmental awareness.', 'Narrative structure guides movement between scenes, while each viewing task determines its configuration.'] },
  { label: 'Research boundary', title: 'What remains to be tested', items: ['Current evidence comes from retrospective design comparison; deployment and user testing belong to the next phase.', 'The headset studies comprise layout and estimated mass-distribution scenarios; electronic prototyping remains future work.', 'Transfer to another site must be examined through a second design study.'] },
];

export const nextTests = [
  { index: '01', title: 'Technical + spatial performance', body: 'Test fixed-view alignment and visibility, bus positioning, exhibition tracking and outdoor headset readability.' },
  { index: '02', title: 'Wearability + audio', body: 'Compare fit, pressure, posture, discomfort, intelligibility, leakage, alerts and audiovisual synchronisation.' },
  { index: '03', title: 'Operations + access', body: 'Evaluate device preparation, calibration, turnover, staff speech, scheduling, capacity and operating cost.' },
  { index: '04', title: 'Visitor experience + transfer', body: 'Study cultural understanding, route choice, exploratory autonomy, co-presence and the use of decision records at a second site.' },
];
