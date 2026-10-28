import type { Metadata } from 'next';
import { CustomCursor } from '@/components/CustomCursor';
import { ProjectTransitionProvider } from '@/components/ProjectTransition';
import { projects, unavailableProjectSlugs } from '@/data/projects';
import { PROJECT_RETURN_PENDING_CLASS, PROJECT_RETURN_STORAGE_KEY } from '@/lib/projectReturn';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/manrope/500.css';
import '@fontsource-variable/roboto-mono/wght.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zhao Boxuan — Cross-disciplinary Spatial Practitioner / Researcher',
  description: 'Research and practice by Zhao Boxuan across spatial interaction, XR, immersive media and controllable spatial intelligence.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const projectReturnBootScript = `
    try {
      const unavailableSlug = new URLSearchParams(window.location.search).get('unavailable');
      const returningSlug = new URLSearchParams(window.location.search).get('return');
      const projectSlugs = ${JSON.stringify(projects.map(project => project.slug))};
      const unavailableProjects = ${JSON.stringify(unavailableProjectSlugs)};
      if (window.location.pathname === '/' && projectSlugs.includes(returningSlug)) {
        window.sessionStorage.setItem('${PROJECT_RETURN_STORAGE_KEY}', returningSlug);
      }
      if (window.location.pathname === '/' && unavailableProjects.includes(unavailableSlug)) {
        window.sessionStorage.setItem('${PROJECT_RETURN_STORAGE_KEY}', unavailableSlug);
      }
      if (window.location.pathname === '/' && window.sessionStorage.getItem('${PROJECT_RETURN_STORAGE_KEY}')) {
        document.documentElement.classList.add('${PROJECT_RETURN_PENDING_CLASS}');
        if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
      }
    } catch {}
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: projectReturnBootScript }} />
      </head>
      <body>
        <ProjectTransitionProvider>
          {children}
          <CustomCursor />
        </ProjectTransitionProvider>
      </body>
    </html>
  );
}
