// pageScroll.js — the body is locked (only the active route panel scrolls), so
// scroll-driven components (the sticky sequence) need a handle to the current
// page's scroll container. The <Page> shell provides this ref via context.

import { createContext, useContext } from 'react';

/** Holds the active page panel's scroll element: { current: HTMLElement | null }. */
export const PageScrollContext = createContext(null);

export function usePageScroll() {
  return useContext(PageScrollContext);
}
