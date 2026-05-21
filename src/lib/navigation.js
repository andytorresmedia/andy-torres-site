// navigation.js — bridges the prototype's page-name navigation onto react-router.
// Ported components keep calling `nav('work')`; here that maps to a real route.

import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const PAGE_PATHS = {
  home: '/',
  work: '/work',
  about: '/about',
  contact: '/contact',
};

/** Returns nav(page) where page is 'home' | 'work' | 'about' | 'contact'. */
export function useNav() {
  const navigate = useNavigate();
  return useCallback(
    (page) => navigate(PAGE_PATHS[page] || page),
    [navigate],
  );
}

/** Returns openProject(id) → navigates to that project's case study. */
export function useProjectOpener() {
  const navigate = useNavigate();
  return useCallback((id) => navigate(`/work/${id}`), [navigate]);
}

/** Current top-level page name, derived from the path. */
export function useCurrentPage() {
  const { pathname } = useLocation();
  if (pathname === '/' || pathname === '') return 'home';
  if (pathname.startsWith('/work')) return 'work';
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/contact')) return 'contact';
  return 'home';
}
