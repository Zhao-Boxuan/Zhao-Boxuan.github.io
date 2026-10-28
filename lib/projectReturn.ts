export const PROJECT_RETURN_STORAGE_KEY = 'portfolio:return-project';
export const PROJECT_RETURN_PENDING_CLASS = 'project-return-pending';
export const PROJECT_RETURN_READY_EVENT = 'project-return-ready';
const PROJECT_POSITION_STORAGE_PREFIX = 'portfolio:project-position:';
const PROJECT_INDEX_HISTORY_KEY = 'portfolio:index-history-project';

export function readProjectReturnSlug() {
  if (typeof window === 'undefined') return null;

  return window.sessionStorage.getItem(PROJECT_RETURN_STORAGE_KEY);
}

export function saveProjectReturnSlug(slug: string) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(PROJECT_RETURN_STORAGE_KEY, slug);
}

export function beginProjectReturn(slug: string) {
  if (typeof window === 'undefined') return;

  saveProjectReturnSlug(slug);
  window.document.documentElement.classList.add(PROJECT_RETURN_PENDING_CLASS);

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
}

export function revealProjectReturn() {
  if (typeof window === 'undefined') return;
  window.document.documentElement.classList.remove(PROJECT_RETURN_PENDING_CLASS);
  window.dispatchEvent(new Event(PROJECT_RETURN_READY_EVENT));
}

export function clearProjectReturnSlug() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(PROJECT_RETURN_STORAGE_KEY);
}

export function saveProjectIndexPosition(slug: string, position = window.scrollY) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(`${PROJECT_POSITION_STORAGE_PREFIX}${slug}`, String(position));
  window.sessionStorage.setItem(PROJECT_INDEX_HISTORY_KEY, slug);
}

export function canReturnToProjectIndexHistory(slug: string) {
  if (typeof window === 'undefined') return false;

  return window.history.length > 1
    && window.sessionStorage.getItem(PROJECT_INDEX_HISTORY_KEY) === slug;
}

export function clearProjectIndexHistory() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(PROJECT_INDEX_HISTORY_KEY);
}

export function readProjectIndexPosition(slug: string) {
  if (typeof window === 'undefined') return null;
  const storedValue = window.sessionStorage.getItem(`${PROJECT_POSITION_STORAGE_PREFIX}${slug}`);
  if (storedValue === null) return null;

  const value = Number(storedValue);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function finishProjectReturn() {
  clearProjectReturnSlug();
  revealProjectReturn();
  if (typeof window !== 'undefined' && window.location.pathname === '/') {
    const url = new URL(window.location.href);
    if (url.searchParams.has('return')) {
      url.searchParams.delete('return');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    }
  }
}
