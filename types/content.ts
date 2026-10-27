export type Language = 'en' | 'zh';

export type LocalizedText = Record<Language, string>;

export interface ExperienceDescriptionSection {
  keyword: LocalizedText;
  body: LocalizedText;
}

export interface ExperienceItem {
  organization: string;
  period: string;
  logo: string;
  logoStyle: 'image' | 'luminance-mask';
  role: LocalizedText;
  description: LocalizedText;
  descriptionSections?: ExperienceDescriptionSection[];
}

export interface Project {
  slug: string;
  number: string;
  title: LocalizedText;
  categoryId: string;
  category: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  year: string;
  role: LocalizedText;
  status: 'documented' | 'placeholder';
  image: string | null;
  imageAlt: string;
  accent: 'silver' | 'smoke' | 'ice';
  tags: string[];
  gallery: ProjectMedia[];
  researchSections: ProjectResearchSection[];
}

export interface ProjectMedia {
  src: string;
  caption: string;
}

export interface ProjectResearchSection {
  index: string;
  title: string;
  body: string;
}

export interface ProjectCategory {
  id: string;
  number: string;
  title: LocalizedText;
  description: LocalizedText;
  projectSlugs: string[];
}

export interface Strength {
  number: string;
  title: LocalizedText;
  description: LocalizedText;
}
