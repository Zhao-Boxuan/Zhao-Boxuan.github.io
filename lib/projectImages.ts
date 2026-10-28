import covers from '@/data/projectCoverImages.json';

export const PREPARE_PROJECT_COVER_EVENT = 'project-cover-prepare';
type Priority = 'high' | 'auto' | 'low';

export function projectCoverImage(source: string) {
  return covers[source as keyof typeof covers];
}

export function prepareCoverImage(image: HTMLImageElement, priority: Priority = 'auto') {
  if (!image.getAttribute('src') && !image.dataset.coverState) {
    image.dataset.coverState = 'loading';
    image.addEventListener('load', () => { image.dataset.coverState = 'loaded'; }, { once: true });
    image.addEventListener('error', () => { image.dataset.coverState = 'error'; }, { once: true });
  }
  if (image.fetchPriority !== priority) image.fetchPriority = priority;
  const width = image.parentElement?.getBoundingClientRect().width;
  if (width && image.dataset.srcset) {
    const sizes = `${Math.ceil(width)}px`;
    if (image.sizes !== sizes) image.sizes = sizes;
    if (!image.srcset) image.srcset = image.dataset.srcset;
  }
  if (!image.getAttribute('src') && image.dataset.src) {
    image.src = image.dataset.src;
    image.dispatchEvent(new Event(PREPARE_PROJECT_COVER_EVENT));
  }
  return image;
}

export function prepareProjectCover(slug: string, priority: Priority = 'auto') {
  const image = document.getElementById(`project-${slug}`)?.querySelector<HTMLImageElement>('img');
  return image ? prepareCoverImage(image, priority) : null;
}

export function rememberProjectCover(slug: string, image: HTMLImageElement) {
  if (image.currentSrc) {
    try { sessionStorage.setItem(`portfolio:cover-source:${slug}`, image.currentSrc); } catch {}
  }
}

export function warmStoredProjectCover(slug: string) {
  try {
    const source = sessionStorage.getItem(`portfolio:cover-source:${slug}`);
    if (!source || new URL(source, location.origin).origin !== location.origin) return;
    const image = new Image();
    image.fetchPriority = 'high';
    image.src = source;
  } catch {}
}

// Resolve on a real decode, error or cancellation; an unbound <img> is not ready.
export function waitForImage(image: HTMLImageElement | null, signal?: AbortSignal) {
  if (!image || signal?.aborted) return Promise.resolve();
  return new Promise<void>(resolve => {
    const finish = () => {
      image.removeEventListener('load', decode);
      image.removeEventListener('error', finish);
      signal?.removeEventListener('abort', finish);
      resolve();
    };
    const decode = () => { void image.decode().catch(() => undefined).then(finish); };
    image.addEventListener('load', decode, { once: true });
    image.addEventListener('error', finish, { once: true });
    signal?.addEventListener('abort', finish, { once: true });
    queueMicrotask(() => {
      if (signal?.aborted) finish();
      else if (image.complete && image.naturalWidth > 0) decode();
      else if (image.dataset.coverState === 'error') finish();
      else if (image.complete && image.currentSrc && image.dataset.coverState !== 'loading') decode();
    });
  });
}
