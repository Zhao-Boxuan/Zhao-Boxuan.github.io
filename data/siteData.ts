import type { ExperienceItem, LocalizedText, Strength } from '@/types/content';

export const profile = {
  name: 'Zhao Boxuan',
  initials: 'ZBX',
  role: { en: 'Interaction Designer', zh: '交互设计师' } satisfies LocalizedText,
  intro: {
    en: 'Working at the intersection of cross-media interaction and computational design, I investigate how physical–digital systems shape spatial experience, translating research questions into testable prototypes and buildable environments.',
    zh: '我在跨媒介交互与计算设计的交叉领域展开研究，探索物理—数字系统如何塑造空间体验，并将研究问题转化为可测试的原型与可建造的环境。',
  } satisfies LocalizedText,
  statement: {
    en: 'Current research focus — Physical–Digital Interaction and Computational Design.',
    zh: '当前研究核心——跨媒介交互和计算设计。',
  } satisfies LocalizedText,
  email: 'zbx18220554169@gmail.com',
  phone: '+86 18220554169',
  location: 'Shanghai / Singapore',
};

export const navigation = [
  { id: 'about', label: { en: 'About', zh: '关于' } },
  { id: 'projects', label: { en: 'Projects', zh: '项目' } },
  { id: 'strengths', label: { en: 'Strengths', zh: '优势' } },
  { id: 'contact', label: { en: 'Contact', zh: '联系' } },
] as const;

export const researchTags = [
  { en: 'Embodied Interaction', zh: '具身交互' },
  { en: 'XR Development', zh: 'XR 开发' },
  { en: 'Installation Realisation', zh: '装置深化搭建' },
  { en: 'Unreal Engine 5', zh: 'UE5 引擎' },
  { en: 'Computational Design', zh: '计算设计' },
  { en: 'HCI', zh: '人机交互' },
  { en: 'Structural Simulation', zh: '结构模拟' },
  { en: 'AI-Assisted Spatial Workflows', zh: 'AI 辅助空间工作流' },
  { en: 'Exhibition Design', zh: '展览设计' },
  { en: 'Spatial Performance Analysis', zh: '空间性能分析' },
  { en: 'Multimedia Integration', zh: '多媒体系统集成' },
] satisfies LocalizedText[];

export const experiences: ExperienceItem[] = [
  {
    organization: 'VAVE Studio Shanghai', period: '2025.02 — 2026.02',
    logo: '/images/experience-logos/vave-mark.png', logoStyle: 'image',
    role: { en: 'Interaction Designer', zh: '交互设计师' },
    description: { en: 'Developed interaction concepts, physical and multimedia exhibits, integrated spatial systems and on-site delivery for museums, cultural venues, brand halls and large-scale exhibitions. Contributed to 10+ proposals and helped secure and deliver 5 major spatial interaction projects.', zh: '负责博物馆、文化馆、企业展厅与大型会展的交互概念、实体及多媒体展项、空间一体化设计与现场落地；参与 10 余个提案，并推动 5 个重点空间交互项目落地。' },
    descriptionSections: [
      {
        keyword: { en: 'Interaction Design', zh: '交互设计' },
        body: {
          en: 'Developed spatial interaction and multimedia experiences for museums and exhibitions, connecting physical participation, digital feedback and spatial narratives. Translated content and experience goals into exhibit functions and media configurations.',
          zh: '面向博物馆与会展，开展空间交互及多媒体体验设计，组织身体参与、数字反馈与空间叙事的关系，将内容与体验目标转化为展项功能和媒介配置。',
        },
      },
      {
        keyword: { en: 'Installation Development', zh: '装置深化' },
        body: {
          en: 'Developed physical installations for fabrication, installation and maintenance, coordinating structures, displays and hardware. Worked with fabricators and content teams to reconcile interaction quality with engineering and maintenance requirements.',
          zh: '将交互要求落实为可制作、安装和维护的实体装置，协调构造、显示及设备集成，与制作商和内容团队共同解决体验效果、工程条件及维护需求之间的具体问题。',
        },
      },
      {
        keyword: { en: 'Iterative Delivery', zh: '迭代交付' },
        body: {
          en: 'Independently developed winning concepts and advanced projects through detailing and construction, addressing equipment changes through pre-assembly and on-site commissioning. Contributed to four built projects, independently leading construction coordination for two.',
          zh: '独立完成概念设计并推动中标，持续推进深化与搭建，通过预搭建和现场调试应对设备变更。参与4个落地项目，其中2项独立带队对接施工。',
        },
      },
    ],
  },
  {
    organization: 'National University of Singapore', period: '2022.08 — 2024.06',
    logo: '/images/experience-logos/nus-mark.png', logoStyle: 'image',
    role: { en: 'Master of Architecture', zh: '建筑学硕士' },
    description: { en: 'Focused on exhibition and spatial design, AR interaction, architectural cinema, digital structures, computation and integrated construction.', zh: '聚焦展览与空间设计、AR 交互、建筑电影、数字结构、计算设计与施工一体化。' },
    descriptionSections: [
      {
        keyword: { en: 'Relevant Coursework', zh: '相关课程' },
        body: {
          en: 'Exhibition planning and spatial design, AR interaction design, architectural cinema, contemporary architectural criticism, digital structures and spatial design, integrated design and construction, and a studio project on transforming atrium social spaces.',
          zh: '展览策划与空间设计、AR交互体验设计、建筑电影学、当代建筑批判、数字化结构与空间设计、建筑施工一体化，以及中庭社交空间改造相关课题。',
        },
      },
      {
        keyword: { en: 'Thesis Research', zh: '毕业研究' },
        body: {
          en: 'Under the supervision of Professor Simone Chung, investigated applications of AR in spatial environments. Combined technical and literature reviews, site-free prototype studies and fieldwork in Xi’an’s Xiangzi Temple District to translate site constraints and activity needs into media choices, viewing arrangements and spatial narratives, extending the research to an AR-headset concept and centre-of-gravity configuration analysis.',
          zh: '在Simone Chung教授的指导下，开展AR技术在空间环境中的应用研究。通过技术与文献调研、无场地原型探索及西安湘子庙街区调查，将场地约束与活动需求转化为媒介选择、观看方式和空间叙事方案，并延伸至AR头显概念及重心配置分析。',
        },
      },
      {
        keyword: { en: 'Exhibitions', zh: '作品展览' },
        body: {
          en: 'Marine Windpath was selected as an outstanding NUS student project and exhibited at ArchiVAL 2023. The film BOTTLE represented the department at the Melaka International Film Festival.',
          zh: '“Marine Windpath”获选为NUS优秀学生作品，入选“ArchiVAL 2023”展览。电影作品“BOTTLE”代表学院参加马六甲国际电影节。',
        },
      },
    ],
  },
  {
    organization: 'Hunan University', period: '2016.09 — 2021.06',
    logo: '/images/experience-logos/hnu-mark.png', logoStyle: 'image',
    role: { en: 'Bachelor of Architecture', zh: '建筑学学士' },
    description: { en: 'Studied computational design, parametric structures, architectural materials and building physics.', zh: '学习计算设计、参数化结构、建筑材料与建筑物理。' },
    descriptionSections: [
      {
        keyword: { en: 'Relevant Coursework', zh: '相关课程' },
        body: {
          en: 'Computational design, parametric structural design, architectural materials and building physics. Project work further covered mechanised spatial systems, structural analysis, space syntax and urban regeneration strategies.',
          zh: '计算设计、参数化结构设计、建筑材料与建筑物理。项目实践进一步涉及机械化空间系统、结构分析、空间句法及城市更新策略。',
        },
      },
      {
        keyword: { en: 'Publication', zh: '论文发表' },
        body: {
          en: 'Contributed to the publication “Restorative Potential of Public Green Spaces in University Residential Environments: A Case Study of Hunan University’s Tianma Student Apartments”, selected for the 14th International Conference on Environment–Behavior Studies.',
          zh: '参与出版《高校居住环境公共绿地恢复性潜能探究——以湖南大学天马学生公寓为例》，入选第14届国际环境行为研究会议。',
        },
      },
      {
        keyword: { en: 'Student Honours', zh: '学生荣誉' },
        body: {
          en: 'Received Hunan University’s Single-Category Scholarship for four consecutive academic years: 2016–2017, 2017–2018, 2018–2019 and 2019–2020. Twice named a university-level Outstanding Student Cadre in 2017–2018 and 2018–2019.',
          zh: '连续四学年获得湖南大学单项奖学金：2016–2017、2017–2018、2018–2019、2019–2020学年。两次获评湖南大学校级优秀学生干部：2017–2018、2018–2019学年。',
        },
      },
    ],
  },
];

export const strengths: Strength[] = [
  { number: 'A', title: { en: 'Spatial × Interaction', zh: '空间 × 交互' }, description: { en: 'Study how human movement, physical form and responsive media jointly shape spatial experience.', zh: '研究人的移动、实体形态与响应式媒介如何共同塑造空间体验。' } },
  { number: 'B', title: { en: 'Research × Delivery', zh: '研究 × 落地' }, description: { en: 'Translate research questions into explicit frameworks, testable prototypes and technically feasible applications.', zh: '将研究问题转化为明确框架、可测试原型与技术可行的实践应用。' } },
  { number: 'C', title: { en: 'Visual × Computational', zh: '视觉 × 计算' }, description: { en: 'Use spatial visualization, simulation, game engines and AI-assisted workflows to analyze and test spatial systems.', zh: '运用空间可视化、模拟、游戏引擎与 AI 辅助工作流分析并测试空间系统。' } },
  { number: 'D', title: { en: 'Narrative × Systems', zh: '叙事 × 系统' }, description: { en: 'Structure complex information and narratives through spatial sequences, interaction rules and embodied interpretation.', zh: '通过空间序列、交互规则与具身化阐释，组织复杂信息与叙事。' } },
];
