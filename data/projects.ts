import type { Project, ProjectCategory, ProjectMedia } from '@/types/content';

const media = (slug: string, captions: string[]): ProjectMedia[] => captions.map((caption, index) => ({
  src: `/images/projects/${slug}/detail-${String(index + 1).padStart(2, '0')}.jpg`,
  caption,
}));

export const unavailableProjectSlugs: readonly string[] = [
  'riyadh-expo-2030',
  'fudi-gymnasium',
];

export const isProjectUnavailable = (slug: string) => unavailableProjectSlugs.includes(slug);

export const projectCategories: ProjectCategory[] = [
  {
    id: 'spatial-computing',
    number: '01',
    title: { en: 'Spatial Interfaces', zh: '空间界面' },
    description: {
      en: 'Research into physical-digital mapping, spatial narrative and embodied interfaces situated within real environments.',
      zh: '研究真实环境中的虚实映射、空间叙事与具身界面。',
    },
    projectSlugs: ['digi-tao', 'truth-incubator', 'penguin-island'],
  },
  {
    id: 'immersive-exhibition',
    number: '02',
    title: { en: 'Embodied Experience', zh: '具身体验' },
    description: {
      en: 'Exhibition systems that translate cultural, institutional and commercial narratives into spatial sequences and sensory encounters.',
      zh: '将文化、机构与商业叙事转化为空间序列和感官体验的展陈系统。',
    },
    projectSlugs: ['hejiang-museum', 'my-museum', 'riyadh-expo-2030', 'bailian-booth', 'attention-economics'],
  },
  {
    id: 'parametric-tectonics',
    number: '03',
    title: { en: 'Computational Systems', zh: '计算系统' },
    description: {
      en: 'Computational studies in which geometry, structure, environmental performance and movement become one legible design system.',
      zh: '将几何、结构、环境性能与运动整合为可读设计系统的计算研究。',
    },
    projectSlugs: ['marine-windpath', 't-rollerrent', 'fudi-gymnasium'],
  },
  {
    id: 'social-space',
    number: '04',
    title: { en: 'Social Frameworks', zh: '社会框架' },
    description: {
      en: 'Urban and rural frameworks that reorganize collective life through productive landscapes, adaptive reuse and shared rituals.',
      zh: '通过生产性景观、适应性再利用与共享活动重组集体生活的城乡框架。',
    },
    projectSlugs: ['super-plantation', 'village', 'neon-harbor'],
  },
];

export const projects: Project[] = [
  {
    slug: 'digi-tao', number: '01.1', title: { en: 'Situated AR for a Protected Historic District', zh: '受保护历史街区中的情境式 AR' }, categoryId: 'spatial-computing',
    category: { en: 'Spatial AR / Research-through-Design', zh: '空间增强现实 / 研究型设计' },
    summary: { en: 'Translating heritage constraints, visitor movement and viewing conditions into an explicit AR mode-selection system spanning district interventions, shared media and embodied headset research.', zh: '将遗产保护限制、访客移动与观看条件转化为明确的 AR 模式选择系统，贯通街区介入、共享媒介与具身头显研究。' },
    description: { en: 'Selecting shared and personal AR modes under physical conservation constraints.', zh: '在实体保护限制下选择共享与个人AR介入模式。' },
    year: '2024', role: { en: 'Independent academic project', zh: '独立学术项目' }, status: 'documented',
    image: '/images/projects/digi-tao/cover.jpg', imageAlt: 'Situated AR mode-selection study for a protected historic district', accent: 'ice',
    tags: ['Situated AR', 'Mode Selection', 'Embodied Interaction', 'Heritage'],
    gallery: media('digi-tao', ['Narrative database, route logic and spatial anchors.', 'Situated AR scenes and mobile viewpoints across the district.', 'District-scale axonometric mapping and scene distribution.']),
    researchSections: [
      { index: 'R1', title: 'Research question', body: 'How should different AR modes be selected and combined in a historic district where physical redevelopment is tightly restricted?' },
      { index: 'R2', title: 'Method and system', body: 'Site evidence is translated into a fixed/mobile × shared/personal mode-selection framework, then applied to four district interventions.' },
      { index: 'R3', title: 'Contribution', body: 'The project connects site-led mode selection, audiovisual distribution and embodied headset requirements through an explicit evaluation programme.' },
    ],
  },
  {
    slug: 'truth-incubator', number: '01.2', title: { en: 'Truth Incubator', zh: '真相孵化器' }, categoryId: 'spatial-computing',
    category: { en: 'Interactive Film / Critical Media Research', zh: '交互电影 / 批判性媒介研究' },
    summary: { en: 'Testing how competing narratives redirect attention through a UE5 interactive film and playable news-editing system.', zh: '通过 UE5 交互电影与可玩的新闻编辑系统，检验竞争性叙事如何转移公众注意力。' },
    description: { en: 'Truth Incubator translates disinformation research into a speculative content-farm architecture, a montage experiment and a playable news-editing loop in which the same event is repeatedly reorganised into conflicting narratives.', zh: 'Truth Incubator 将虚假信息研究转化为内容农场建筑、蒙太奇实验与可玩的新闻编辑循环，让同一事件被反复重组为彼此冲突的叙事。' },
    year: '2023', role: { en: 'Collaborative academic project', zh: '合作学术项目' }, status: 'documented',
    image: '/images/projects/truth-incubator/hero-interface.webp', imageAlt: 'Truth Incubator news-editing interface inside the content farm', accent: 'smoke',
    tags: ['Information Overload', 'Disinformation', 'Interactive Film', 'UE5', 'Montage', 'Game Design'],
    gallery: media('truth-incubator', ['Content-farm city, tower and concentric production spaces.', 'Film and game sequence from public media façade to hidden editing core.']),
    researchSections: [
      { index: 'R1', title: 'Research question', body: 'How can repeated and competing narratives redirect public attention when they are produced from the same body of evidence?' },
      { index: 'R2', title: 'Method', body: 'Media research and an editing-technique taxonomy inform a Kuleshov-effect experiment, a speculative content-farm architecture and a playable news-production loop.' },
      { index: 'R3', title: 'Contribution', body: 'The project shifts attention from identifying one false claim to experiencing how volume, repetition and conflicting versions can displace an original event.' },
    ],
  },
  {
    slug: 'penguin-island', number: '01.3', title: { en: 'Tencent — Penguin Island Experience Hall', zh: '腾讯 — 企鹅岛体验馆' }, categoryId: 'spatial-computing',
    category: { en: 'Phygital Experience / Game IP', zh: '虚实融合体验 / 游戏 IP' },
    summary: { en: 'Developing an XR-enabled theme-park journey where game IP, physical space and embodied interfaces converge.', zh: '将熟悉的腾讯办公室转化为游戏 IP 奇妙夜游线的 1000 平方米室内主题乐园分区。' },
    description: { en: 'Located within a 10,000 sqm experience centre in Shenzhen, the concept moves visitors from a boarding queue and an ordinary office through scale transition, “Night at the Office,” a holographic theatre and a time-space tunnel. The winning schematic design tested both a closed-loop indoor roller-coaster route and an operationally simpler pedestrian version, while a standardized AI-assisted image workflow coordinated the large volume of game-IP scenes.', zh: '项目位于深圳一座 10000 平方米体验中心内，以 1000 平方米开篇分区串联候乘区、日常办公室、尺度转换、“办公室奇妙夜”、全息剧场与时空隧道。中标概念方案同时测试闭环室内过山车与更易运营的步行版本，并以标准化 AI 辅助图像流程协调大量游戏 IP 场景。' },
    year: '2025', role: { en: 'Independent concept design for “Night at the Office” · Spatial design across additional zones', zh: '“办公室奇妙夜”独立概念设计 · 参与多个展区空间设计' }, status: 'documented', image: '/images/projects/penguin-island/cover.jpg', imageAlt: 'Tencent Penguin Island immersive game experience environment', accent: 'silver',
    tags: ['Game IP', 'Indoor Theme Park', 'Narrative Journey', 'AI-assisted Workflow'],
    gallery: media('penguin-island', ['Project scope, spatial scene annotation and the office-to-fantasy transition.', '“Night at the Office” narrative sequence and closed-loop indoor roller-coaster system.', 'Pedestrian alternative, AI collaborative workflow and developed game-IP scenes.']),
    researchSections: [
      { index: 'R1', title: 'Scenario premise', body: 'The experience begins in a recognizable Tencent office before light, screens, manuscripts and holographic characters gradually transform everyday work into a game-IP night journey.' },
      { index: 'R2', title: 'Experience system', body: 'A closed-loop ride route coordinates boarding, recovery and maintenance, while a pedestrian alternative supports small groups exploring the same narrative scenes at their own pace.' },
      { index: 'R3', title: 'Production method', body: 'A staged AI-assisted workflow links target style, spatial reference, style transfer, multi-perspective correction, partial edits and high-definition output so generated scenes remain traceable and editable.' },
    ],
  },
  {
    slug: 'hejiang-museum', number: '02.1', title: { en: 'Hejiang Soy Sauce Study Base Museum', zh: '合江酱油研学基地博物馆' }, categoryId: 'immersive-exhibition',
    category: { en: 'Cultural Tourism Museum / Multi-sensory Narrative', zh: '文旅博物馆 / 多感官叙事' },
    summary: { en: 'Designing an exploratory museum journey through multisensory interaction, situated storytelling and active visitor discovery.', zh: '将河流生态、发酵知识与传统工艺转译为具身体验序列的博物馆。' },
    description: { en: 'The museum organizes soy-sauce culture through three shifts in visitor cognition: being seen, being understood and being favored. Landscape, brewing craft and contemporary production are connected through theatrical scenes and tangible interaction.', zh: '博物馆以“被看见、被理解、被喜爱”的认知递进组织酱油文化，通过戏剧化场景与实体交互连接山水环境、酿造工艺和现代生产。' },
    year: '2025', role: { en: 'Concept, interaction and graphic design', zh: '概念、交互与平面设计' }, status: 'documented', image: '/images/projects/hejiang-museum/cover.jpg', imageAlt: 'Hejiang museum fermentation gallery', accent: 'smoke',
    tags: ['Museum', 'Cultural Narrative', 'Embodied Learning', 'Craft Interaction'],
    gallery: media('hejiang-museum', ['Narrative strategy and the world-cuisine table.', 'River-of-history chapter and flashlight-mediated discovery.', 'Physical craft interaction, fermentation observation and production-line interpretation.']),
    researchSections: [
      { index: 'R1', title: 'Interpretive framework', body: 'The research asks how an everyday condiment can be repositioned as an ecological, technical and cultural system rather than a collection of isolated artifacts.' },
      { index: 'R2', title: 'Spatial method', body: 'Three narrative chapters move from landscape-scale context to microscopic fermentation and finally to craft and industrial production. Each chapter combines a spatial metaphor with a specific visitor action.' },
      { index: 'R3', title: 'Contribution', body: 'The museum demonstrates a multi-sensory model of heritage interpretation in which looking, illuminating, touching, smelling and comparing become complementary modes of knowledge production.' },
    ],
  },
  {
    slug: 'my-museum', number: '02.2', title: { en: 'Sinovac — [My] Museum', zh: '科兴 — [我]博物馆' }, categoryId: 'immersive-exhibition',
    category: { en: 'Corporate Museum / Decentralized Narrative', zh: '企业博物馆 / 去中心化叙事' },
    summary: { en: 'Developing an embodied museum sequence where interactive exhibits, multisensory cues and spatial choreography lead self-discovery.', zh: '以去中心化的自我发现旅程取代产品时间线的 1800 平方米生命科学博物馆。' },
    description: { en: 'Designed for a leading state-owned pharmaceutical company in Beijing, the museum organizes ten scenes around the theme of “Me”: encounter, formation, invisibility, imperfection, acceptance, improvement, thought, creation, ego and reflection. A modernist art-museum atmosphere, a giant portrait sculpture and windows opening toward the atrium turn the corporate exhibition into a dialogue between visitor and self.', zh: '项目位于北京，为头部国有制药企业打造。博物馆以“我”为主题，将相遇、形成、不可见、不完美、接纳、变得更好、思考、创造、自我与回响组织为十个场景；现代主义艺术馆氛围、巨型人像雕塑与面向中庭的窗口，使企业展览转化为观众与自我的对话。' },
    year: '2025', role: { en: 'Exhibit development · Construction documentation · Site follow-up in a four-person team', zh: '四人团队展项深化 · 施工图制作 · 施工现场跟进' }, status: 'documented', image: '/images/projects/my-museum/cover.jpg', imageAlt: 'My Museum personalized exhibition concept', accent: 'ice',
    tags: ['Life-science Museum', 'Self-discovery', 'Decentralized Narrative', 'Prop-media Alignment'],
    gallery: media('my-museum', ['Project scope, participation stages and ten-scene spatial annotation.', 'Decentralized self-discovery narrative, atrium portrait and modernist gallery strategy.', 'Prop-media alignment, suitcase projector development and completed interactive exhibits.']),
    researchSections: [
      { index: 'R1', title: 'Narrative premise', body: 'The museum moves away from product-led corporate display and conventional science popularization, using a journey of self-discovery to frame life as both subject and object.' },
      { index: 'R2', title: 'Spatial strategy', body: 'A sequence from “Encountering Me” to “The Echo of Ego” is distributed around a tall central portrait. Gallery windows repeatedly reconnect each chapter to the atrium, creating moments of dialogue, confession and reflection.' },
      { index: 'R3', title: 'Detailed contribution', body: 'Exhibit development aligned physical props, interactive media and serviceable hardware. The suitcase projector integrates a reinforced aluminium frame, passive screen cooling, anti-reflective film, routed power and magnetic maintenance panels.' },
    ],
  },
  {
    slug: 'riyadh-expo-2030', number: '02.3', title: { en: 'Riyadh Expo 2030 — Interactive Wristband System', zh: '利雅得 2030 世博会 — 交互手环系统' }, categoryId: 'immersive-exhibition',
    category: { en: 'Interactive Wearable / Experience System', zh: '交互穿戴设备 / 体验系统' },
    summary: { en: "Inside the Riyadh Expo 2030 cultural pavilion, I independently designed a series of indoor interactions around a venue-issued modular wristband. Its translucent acrylic upper module houses the core sensing components, echoes F+P's architectural form and magnetically connects to a woven band with Saudi weaving motifs. Visitors keep the textile band as a souvenir, while the electronic module is collected and reused, balancing cultural identity, visitor memory and operating cost.", zh: '在利雅得 2030 世博会文化馆内部，我独立设计了一系列围绕场馆统一发放模块化手环展开的室内交互体验。半透明亚克力上部模块容纳核心感应元件，呼应 F+P 设计的场馆建筑造型，并通过磁吸与融入沙特编织纹样的织物腕带连接。参观结束后，织物腕带可作为纪念品带走，电子模块则统一回收复用，从而兼顾文化识别、个人纪念价值与长期运营成本。' },
    description: { en: 'The project is confirmed by the resume, but no matching pages were identifiable in the supplied portfolio files. The page remains a placeholder until original documentation is available.', zh: '该项目由简历确认，但两份作品集中未识别到对应页面，因此暂以占位形式保留，等待原始材料。' },
    year: '2025', role: { en: 'Competition design team', zh: '竞标设计团队' }, status: 'placeholder', image: '/images/projects/riyadh-expo-2030/cover.jpg', imageAlt: 'Riyadh Expo 2030 interactive wearable concept', accent: 'silver',
    tags: ['Interactive Wearable', 'Experience System', 'Modular Design'], gallery: [], researchSections: [],
  },
  {
    slug: 'bailian-booth', number: '02.4', title: { en: 'Bailian Booth, 8th CIIE', zh: '百联第八届进博会展台' }, categoryId: 'immersive-exhibition',
    category: { en: 'Brand Experience / Large-scale Exhibition', zh: '品牌体验 / 大型会展' },
    summary: { en: 'Turning Commercial Logic into a Built Interactive Exhibition Space: Curved-Surface Fabrication, Multimedia Integration and On-Site Commissioning.', zh: '以曲面墙、悬挂带与产品展陈场构成双表皮系统的 1000 平方米展览景观。' },
    description: { en: 'Designed for a 1,000 sqm booth in Shanghai, the project brings department-store and import-trade brands into one coherent identity. Repeated curved surfaces organize ten exhibition and support zones while balancing visibility, circulation, product display and construction. The proposal won the bid and was developed from schematic design through construction documentation and on-site follow-up.', zh: '项目为上海一座 1000 平方米展台而设计，将百货与进口贸易品牌整合为统一的空间形象。重复的曲面系统组织十个展陈与后勤分区，并协调识别度、动线、产品展示与建造。方案中标后从概念设计推进至施工图及现场跟进。' },
    year: '2025', role: { en: 'Independent concept design · Detailed design lead · Construction follow-up', zh: '独立概念设计 · 深化设计主责 · 施工现场跟进' }, status: 'documented', image: '/images/projects/bailian-booth/cover.jpg', imageAlt: 'Bailian booth at the 8th CIIE', accent: 'silver',
    tags: ['Brand Space', 'Dual-surface System', 'Exhibition Construction', 'Wayfinding'],
    gallery: media('bailian-booth', ['Programme, participation scope and spatial scene annotation.', 'Dual-surface concept development, structural adjustment and exhibition scenes.', 'Completed booth, construction process and material / craft details.']),
    researchSections: [
      { index: 'R1', title: 'Design problem', body: 'How can a large trade-fair booth remain visually coherent while accommodating changing brands, product types and operational requirements?' },
      { index: 'R2', title: 'Tectonic method', body: 'A family of curved surfaces operates at multiple scales: as wall, table, canopy, signage carrier and suspended landmark. Repetition creates identity while controlled variation assigns local functions.' },
      { index: 'R3', title: 'Contribution', body: 'The project treats temporary exhibition construction as a configurable spatial system, coordinating experiential continuity with fabrication tolerances, installation sequence and later adjustment.' },
    ],
  },
  {
    slug: 'attention-economics', number: '02.5', title: { en: 'Institute of Attention Economics', zh: '注意力经济研究所' }, categoryId: 'immersive-exhibition',
    category: { en: 'Design Shanghai 2025 / Interactive Installation', zh: '设计上海 2025 / 交互装置' },
    summary: { en: 'Realising the Attention-Economy Concept as an Embodied Exhibition through Modular Construction and On-Site Media Integration.', zh: '将碎片化浏览转化为“信息丛林”，并围绕专注房间展开的 150 平方米互动装置。' },
    description: { en: 'Developed in Shanghai as a co-branded concept booth with an aluminium-profile supplier, the installation uses 60 × 60 × 420 mm modular members, distributed LED screens and translucent gauze to stage information overload as a navigable forest. At its centre, a curtained room isolates a time-limited stick-removal game; visitors outside can observe how attention succeeds or fails through openings at the four corners.', zh: '项目位于上海，是与铝型材供应商联合呈现的概念展台。装置以 60 × 60 × 420 毫米铝型材模块、分布式 LED 屏与半透明纱幕，将信息过载转化为可穿行的森林；中心黑幕房间则以限时抽签游戏测试专注，外部观众可从四角观察参与者的注意过程。' },
    year: '2025', role: { en: 'Independent concept design · Detailed design lead in a two-person team · Construction follow-up', zh: '独立概念设计 · 两人团队深化设计主责 · 施工现场跟进' }, status: 'documented', image: '/images/projects/attention-economics/cover.jpg', imageAlt: 'Institute of Attention Economics installation', accent: 'smoke',
    tags: ['Attention Economy', 'Information Jungle', 'Interactive Installation', 'Modular Aluminium'],
    gallery: media('attention-economics', ['Project scope, spatial annotation and the contrast between Information Jungle and Focus-on room.', 'Information Jungle concept, modular aluminium system and completed exhibition.', 'Focus-on interaction, visitor observation and construction-detail adjustments.']),
    researchSections: [
      { index: 'R1', title: 'Research premise', body: 'The project examines attention as both a private cognitive capacity and an economic resource continuously captured by contemporary media environments.' },
      { index: 'R2', title: 'Spatial translation', body: 'Distributed translucent screens create a peripheral field of fragmented signals, while a compact central room isolates one slow manual task. The contrast converts an abstract media condition into bodily experience.' },
      { index: 'R3', title: 'Contribution', body: 'Rather than visualize attention as statistics alone, the installation constructs a public experiment in which distraction, focus, observation and self-awareness coexist within one spatial apparatus.' },
    ],
  },
  {
    slug: 'marine-windpath', number: '03.1', title: { en: 'Marine Windpath', zh: '海洋风径' }, categoryId: 'parametric-tectonics',
    category: { en: 'Seawater Desalination Bridge Complex', zh: '海水淡化桥梁综合体' },
    summary: { en: 'Generating and structurally simulating a wind-responsive truss bridge integrating desalination laboratories, cultivation and public passage.', zh: '将海水净化、可食种植与公共休闲组织为可见流程的港区桥梁—岛屿系统。' },
    description: { en: 'Toxic seawater first enters an island lagoon, where microbial cells and adsorbers remove sulfide and sludge before the purified flow supports edible planting. A ring boardwalk, floating dining tables, test-and-purify lampposts and working gardens turn that process into public experience. The connected bridge stacks water play, equipment, laboratories, offices, catering and roof leisure across five levels.', zh: '有毒海水先进入岛上潟湖，经微生物单元与吸附装置去除硫化物和污泥，再以净化水支持可食植物种植。环形栈道、漂浮餐桌、可检测净化水体的漂浮灯柱与生产花园，将处理过程转化为公共体验；相连桥体则在五层中整合戏水、设备、实验室、办公餐饮与屋顶休闲。' },
    year: '2022', role: { en: 'Independent architectural design · Parametric modelling · Karamba structural simulation · Cost estimation', zh: '独立建筑设计 · 参数化建模 · Karamba 结构模拟 · 造价估算' }, status: 'documented', image: '/images/projects/marine-windpath/cover.jpg', imageAlt: 'Marine Windpath bridge complex', accent: 'ice',
    tags: ['Seawater Purification', 'Productive Island', 'Public Infrastructure', 'Structural Integration'],
    gallery: media('marine-windpath', ['Island programming, seawater-treatment sequence, port connection and physical models.', 'Five-level programme, sectional structure and the bridge–island environmental system.']),
    researchSections: [
      { index: 'R1', title: 'Environmental sequence', body: 'The island makes primary seawater purification observable, then reuses the treated flow for landscape conservation and hybrid seawater–rainwater cultivation of edible plants.' },
      { index: 'R2', title: 'Public programming', body: 'A ring boardwalk connects gardens, water play, floating dining, workshops and viewing points, while the bridge extends the system vertically through equipment, laboratory, office, catering and leisure floors.' },
      { index: 'R3', title: 'Contribution', body: 'The project treats infrastructure as a civic and educational landscape, aligning environmental processing, productive planting, port circulation and public occupation within one sectional framework.' },
    ],
  },
  {
    slug: 't-rollerrent', number: '03.2', title: { en: 'T-rollerrent — Mechanical Architecture', zh: 'T-rollerrent — 机械建筑' }, categoryId: 'parametric-tectonics',
    category: { en: 'Convertible Tower / Spatial Equality', zh: '可变塔楼 / 空间平权' },
    summary: { en: 'Using parametric systems to turn spatial equality into a mechanical high-rise of circulating units and shared public ground.', zh: '将固定公共空间与沿机械轨道循环的 4.5 × 7.5 × 2.6 米移动单元结合的高层城市中心。' },
    description: { en: 'The project reworks the centralized logic of the Radiant City into a dynamic urban model: a gathering podium leads into stacked libraries, commercial floors, stadia and hanging gardens, while customizable “corn-kernel” units circulate continuously around the twin towers. Plug-in foundations, service connections, guide plates and transmission tracks allow each unit to shift among residential, office and commercial uses instead of fixing spatial privilege permanently.', zh: '项目将“光辉城市”的集中式逻辑改写为动态城市模型：汇聚人流的裙房连接图书馆、商业、体育与空中花园等固定公共空间，可定制的“玉米粒”单元则沿双塔持续循环。插接式底盘、设备接口、导向板与传动轨道使单元可在居住、办公与商业之间转换，避免空间优势被永久固化。' },
    year: '2019', role: { en: 'Urban research · Parametric mechanical-system design · Technical drawing', zh: '城市研究 · 参数化机械系统设计 · 技术图纸绘制' }, status: 'documented', image: '/images/projects/t-rollerrent/cover.jpg', imageAlt: 'T-rollerrent mechanical architecture tower', accent: 'smoke',
    tags: ['Mechanical Architecture', 'Mobile Monomer', 'Plug-in Services', 'Spatial Equality'],
    gallery: media('t-rollerrent', ['Urban argument and the sequence from gathering and stacking to mobile monomers.', 'Monomer construction, service connections, component families and tower section.', 'Site plan, public-space floors, standard monomer plans and roof gardens.']),
    researchSections: [
      { index: 'R1', title: 'Urban premise', body: 'The study asks whether fairness can emerge from the relationship between flowing personal space and stable, richly programmed public space rather than from absolute spatial sameness.' },
      { index: 'R2', title: 'Mechanical system', body: 'A continuous track moves customizable monomers around the towers. Hydraulic transmission, guide plates, plug-in services and a shared component catalogue support changing occupancy and combination.' },
      { index: 'R3', title: 'Contribution', body: 'The proposal links a political argument about spatial access to explicit dimensions, service connections, circulation loops and floor plans, making reversibility an architectural system rather than an image alone.' },
    ],
  },
  {
    slug: 'fudi-gymnasium', number: '03.3', title: { en: 'FuDI — Hunan University Second Gymnasium', zh: 'FuDI — 湖南大学第二体育馆' }, categoryId: 'parametric-tectonics',
    category: { en: 'Parametric Building / University Facility', zh: '参数化建筑 / 校园设施' },
    summary: { en: 'A parametric proposal for Hunan University’s second gymnasium.', zh: '湖南大学第二体育馆的参数化设计提案。' },
    description: { en: 'The project is included in the resume, but its detailed portfolio documentation is not present in the supplied files. It remains a placeholder rather than borrowing unrelated drawings from the “Otherworks” pages.', zh: '该项目已列入简历，但所提供文件中没有对应的详细作品页，因此保留为占位，不使用“其他作品”中的无关图纸替代。' },
    year: '—', role: { en: 'Academic project', zh: '学术项目' }, status: 'placeholder', image: '/images/projects/fudi-gymnasium/cover.jpg', imageAlt: 'FuDI gymnasium architectural landscape proposal', accent: 'silver',
    tags: ['Parametric Design', 'Sports Architecture', 'Campus'], gallery: [], researchSections: [],
  },
  {
    slug: 'super-plantation', number: '04.1', title: { en: 'Super Plantation Urban Complex', zh: '超级种植园城市综合体' }, categoryId: 'social-space',
    category: { en: 'Productive Urbanism / Adaptive Reuse', zh: '生产性城市 / 适应性再利用' },
    summary: { en: 'Reorganising the former flour mill’s social relations through vertical farming, shared production and a spatial framework for urban repair.', zh: '将长沙原凯雪面粉厂更新为融合垂直农业、市场与公共生活的生产性园区。' },
    description: { en: 'The project responds to a locally prominent but socially contested industrial site. After the mill’s 2018 bankruptcy, redundant structures, laid-off workers, congested streets, noise and pollution remained embedded in the surrounding neighbourhood. The proposal selectively removes temporary buildings, retains the eastern industrial frontage and converts the silo groups into controlled vertical farms. A unified roof, bridges, ramps and shared nodes connect cultivation rooms, logistics, markets, education and roof landscapes, transforming an inward production compound into a public circular-economy district.', zh: '项目回应一处辨识度很高、但与周边社区关系紧张的工业遗址。面粉厂于2018年破产后，闲置结构、下岗工人、拥堵街道、噪声与污染问题持续影响周边社区。方案选择性拆除临时建筑、保留东侧工业界面，并将筒仓组改造为受控垂直农场；统一屋顶、连桥、坡道与共享节点把种植、物流、市场、教育和屋顶景观连接起来，使封闭的生产大院转化为面向公众的循环经济街区。' },
    year: '2019', role: { en: 'Independent academic project · Site and social research · Urban strategy · Architectural and landscape design', zh: '个人独立学术项目 · 场地与社会调研 · 城市策略 · 建筑与景观设计' }, status: 'documented', image: '/images/projects/super-plantation/cover.jpg', imageAlt: 'Super Plantation urban complex', accent: 'ice',
    tags: ['Adaptive Reuse', 'Urban Agriculture', 'Circular Economy', 'Industrial Heritage'],
    gallery: media('super-plantation', ['Site history, community research and the shift from flour-mill production to a public planting park.', 'General renewal strategy and the transformation of retained silos into a controlled vertical-farming hub.', 'Public landscape perspectives and the integrated roof, structural and circulation system.']),
    researchSections: [
      { index: 'R1', title: 'Research question', body: 'How can obsolete industrial infrastructure support a new urban metabolism without erasing the labor and production histories embedded in the site?' },
      { index: 'R2', title: 'Urban method', body: 'The proposal maps material flows, cultivation cycles and public programs onto retained silos and factory structures. New circulation turns production into an observable part of everyday urban life.' },
      { index: 'R3', title: 'Contribution', body: 'The project reframes adaptive reuse as an operational system rather than a stylistic preservation exercise, linking heritage, food production, education and public space.' },
    ],
  },
  {
    slug: 'village', number: '04.2', title: { en: 'VillaGE — Planting Experience Hub', zh: 'VillaGE — 种植体验基地' }, categoryId: 'social-space',
    category: { en: 'Green Cultural Village / Productive Landscape', zh: '绿色文旅村落 / 生产性景观' },
    summary: { en: 'Enabling bottom-up urban renewal through voluntary resource exchange, productive landscapes and adaptable spatial plug-ins.', zh: '连接季节作物、共享公共空间与适应性建筑类型的生产性村落。' },
    description: { en: 'VillaGE uses planting as the operating framework for rural renewal. A year-round crop calendar connects cultivation, processing, retail and visitor participation, while modular planting components adapt to ground, roofs, façades and leftover spaces. At masterplan scale, traffic, building renewal, infrastructure, landscape and productive routes are coordinated so residents, government and developers can share the value created by greener public space.', zh: 'VillaGE 以种植系统作为乡村更新的运行框架。全年作物日历连接种植、加工、零售与访客参与，模块化种植构件则适配地面、屋顶、立面和剩余空间；在总体规划尺度上，交通、建筑更新、基础设施、景观与生产路径被统一组织，使居民、政府与开发主体能够共享绿色公共空间创造的价值。' },
    year: '2020', role: { en: 'Urban research · Productive-landscape strategy · Typology development · Masterplanning', zh: '城市研究 · 生产性景观策略 · 类型设计 · 总体规划' }, status: 'documented', image: '/images/projects/village/cover.jpg', imageAlt: 'VillaGE planting experience village', accent: 'silver',
    tags: ['Rural Regeneration', 'Productive Landscape', 'Seasonal Cycles', 'Urban Typologies'],
    gallery: [
      { src: '/images/projects/village/detail-01.jpg', caption: 'Existing conditions, everyday use and spatial typologies across the urban village.' },
      { src: '/images/projects/village/detail-02.jpg', caption: 'Productive planting strategy, seasonal crop cycles and adaptive spatial typologies.' },
      { src: '/images/projects/village/productive-cycle.webp', caption: 'Productive cycle connecting cultivation, processing, distribution and the V-FarmIE service app.', width: 2560, height: 1397 },
      { src: '/images/projects/village/detail-03.jpg', caption: 'Masterplan integrating traffic, building renewal, infrastructure, landscape and planting systems.' },
      { src: '/images/projects/village/flower-street.webp', caption: 'Flower Street — planting roofs, renewed street frontages and shared public space along Lushan South Road.', width: 2560, height: 1756 },
      { src: '/images/projects/village/terraced-landscape.webp', caption: 'Terraced productive landscape connecting cultivated slopes, buildings and everyday village routes.', width: 2560, height: 1432 },
      { src: '/images/projects/village/courtyard-gardens.webp', caption: 'Courtyard gardens, adaptable greenhouses and shared spaces within the renewed village.', width: 2560, height: 1432 },
    ],
    researchSections: [
      { index: 'R1', title: 'Research premise', body: 'The project asks how tourism can reinforce productive rural life rather than replace it with a staged image of the countryside.' },
      { index: 'R2', title: 'Generative method', body: 'Crop characteristics, seasonal cycles and participation modes are translated into building and landscape types. Combinations of these types generate neighborhoods with distinct productive identities.' },
      { index: 'R3', title: 'Contribution', body: 'VillaGE proposes a planning language in which agriculture is simultaneously economy, ecology, education and public experience.' },
    ],
  },
  {
    slug: 'neon-harbor', number: '04.3', title: { en: 'Neon Harbor — Urban Mooring Plan', zh: '霓虹港湾 — 城市系泊计划' }, categoryId: 'social-space',
    category: { en: 'Micro Housing / Social Infrastructure', zh: '微型居住 / 社会基础设施' },
    summary: { en: 'Turning urban observation into a social-support framework and adaptive dwelling system for people experiencing homelessness.', zh: '依托城墙边缘设置居住与工作支持系统，为街头生活者重建自主性与尊严。' },
    description: { en: 'Neon Harbor begins with observations and interviews around Xi’an’s city wall, where street and park edges become informal places of rest and gathering. Instead of treating temporary shelter as the final answer, the proposal combines compact private rooms with a work-voucher and material-recycling system. Solar-powered, replaceable units attach lightly to the wall and provide sleeping, seating, storage and privacy while creating a gradual route toward self-reliance and renewed participation in urban life.', zh: 'Neon Harbor 始于对西安城墙周边的观察与访谈，街道和公园边缘在此成为非正式的休息与聚集场所。方案不把临时收容视为终点，而是将紧凑的私人居住单元与劳动凭证、材料回收机制结合；采用太阳能和可替换构件的单元轻触式依附于城墙，提供睡眠、就坐、储物与隐私空间，并建立一条逐步通向自主生活和重新参与城市的路径。' },
    year: '2021', role: { en: 'Independent urban observation · Social-system design · Micro-architecture and visualization', zh: '独立城市观察 · 社会系统设计 · 微型建筑与视觉表达' }, status: 'documented', image: '/images/projects/neon-harbor/cover.jpg', imageAlt: 'Neon Harbor urban mooring plan', accent: 'smoke',
    tags: ['Micro Housing', 'Social Infrastructure', 'Material Reuse', 'Urban Dignity'],
    gallery: media('neon-harbor', ['City-wall observation and mapping of informal occupation around Xi’an.', 'Social-boundary research, recycled-material workflow and operational model.', 'Compact dwelling prototype, construction details and attachment to the city wall.', 'Nighttime scenarios moving from exclusion toward dignity and urban symbiosis.']),
    researchSections: [
      { index: 'R1', title: 'Research question', body: 'How can residual urban space provide dignity, visibility and temporary belonging without requiring a singular permanent program?' },
      { index: 'R2', title: 'Incremental method', body: 'The proposal combines site observation with a kit of small architectural units, reused materials and lighting strategies. Interventions can accumulate, relocate and support different daily and nighttime uses.' },
      { index: 'R3', title: 'Contribution', body: 'The project frames “mooring” as a social-spatial condition: a place can offer support and identity while remaining open to movement, negotiation and changing occupancy.' },
    ],
  },
];
