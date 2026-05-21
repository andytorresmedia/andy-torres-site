// Nav.jsx — fixed top nav. Logo → home, center search trigger, route links.
// Persists across route changes (rendered outside the sliding stage).

import clsx from 'clsx';
import { useNav, useCurrentPage } from '../lib/navigation';
import { asset } from '../lib/assets';
import { PROJECTS } from '../content/projects';

function CmdKHint() {
  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || '');
  const open = () => window.dispatchEvent(new CustomEvent('frontrow:open-search'));
  return (
    <button
      className="cmdk-trigger"
      onClick={open}
      aria-label="Open search"
      data-cursor="link"
      data-cursor-label="Search"
    >
      <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="7" cy="7" r="4.5" />
        <path d="m10.5 10.5 3 3" />
      </svg>
      <span>Search</span>
      <kbd>{isMac ? '⌘' : '⌃'}K</kbd>
    </button>
  );
}

export function Nav() {
  const nav = useNav();
  const page = useCurrentPage();
  return (
    <header className="nav" data-screen-label="00 Nav">
      <div className="nav-left">
        <button
          onClick={() => nav('home')}
          style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'none', border: 0, padding: 0 }}
          aria-label="Front Row home"
        >
          <img className="at-glyph" src={asset('assets/at-mark.png')} alt="" />
          <span className="nav-word">FRONT&nbsp;ROW<span className="dot">.</span></span>
        </button>
      </div>
      <div className="nav-center">
        <CmdKHint />
      </div>
      <nav className="nav-right">
        <button className={clsx('nav-link', page === 'work' && 'on')} onClick={() => nav('work')}>
          Work<sup>{PROJECTS.length}</sup>
        </button>
        <button className={clsx('nav-link', page === 'about' && 'on')} onClick={() => nav('about')}>
          About
        </button>
        <button className={clsx('nav-link', page === 'contact' && 'on')} onClick={() => nav('contact')}>
          Contact
        </button>
      </nav>
    </header>
  );
}
