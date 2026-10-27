import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { profile } from '@/data/siteData';
import { isProjectUnavailable, projectCategories, projects } from '@/data/projects';
import { XiangzimiaoDetail } from '@/components/XiangzimiaoDetail';
import { TruthIncubatorDetail } from '@/components/TruthIncubatorDetail';
import { HejiangMuseumDetail } from '@/components/HejiangMuseumDetail';
import { StandardProjectDetail } from '@/components/StandardProjectDetail';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects
    .filter((project) => !isProjectUnavailable(project.slug))
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: 'Project not found' };
  if (isProjectUnavailable(slug)) {
    return {
      title: `Project currently updating — ${profile.name}`,
      robots: { follow: false, index: false },
    };
  }
  return { title: `${project.title.en} — ${profile.name}`, description: project.summary.en };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  if (isProjectUnavailable(slug)) {
    redirect(`/?unavailable=${encodeURIComponent(slug)}`);
  }
  const category = projectCategories.find((item) => item.id === project.categoryId);
  const availableProjects = projects.filter((item) => !isProjectUnavailable(item.slug));
  const projectIndex = availableProjects.findIndex((item) => item.slug === project.slug);
  const nextProject = availableProjects[(projectIndex + 1) % availableProjects.length];

  if (project.slug === 'digi-tao') {
    return <XiangzimiaoDetail category={category} nextProject={nextProject} project={project} />;
  }

  if (project.slug === 'truth-incubator') {
    return <TruthIncubatorDetail category={category} nextProject={nextProject} project={project} />;
  }

  if (project.slug === 'hejiang-museum') {
    return <HejiangMuseumDetail category={category} nextProject={nextProject} project={project} />;
  }

  return <StandardProjectDetail category={category} nextProject={nextProject} project={project} />;
}
