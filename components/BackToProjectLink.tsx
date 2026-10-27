'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import { useProjectTransition } from '@/components/ProjectTransition';
import {
  beginProjectReturn,
  canReturnToProjectIndexHistory,
  clearProjectIndexHistory,
} from '@/lib/projectReturn';

export function BackToProjectLink({ projectSlug }: { projectSlug: string }) {
  const { transitionTo } = useProjectTransition();

  const returnToIndex = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) return;

    event.preventDefault();
    const returnThroughHistory = canReturnToProjectIndexHistory(projectSlug);
    transitionTo('/', {
      action: returnThroughHistory ? 'back' : 'push',
      beforeNavigate: () => {
        beginProjectReturn(projectSlug);
        if (returnThroughHistory) clearProjectIndexHistory();
      },
      scroll: false,
    });
  };

  return (
    <Link
      className="brand"
      href="/"
      onClick={returnToIndex}
      scroll={false}
    >
      <span className="brand-mark">ZBX</span>
      <span className="brand-role">Back to index</span>
    </Link>
  );
}
