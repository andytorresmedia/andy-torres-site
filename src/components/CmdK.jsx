// CmdK.jsx — agentic ⌘K search overlay built on the `cmdk` library (keyboard +
// selection) and fuse.js (fuzzy ranking). Opens on ⌘/Ctrl-K or the Nav trigger's
// 'frontrow:open-search' event. Searches pages, projects, and services; Enter
// navigates. cmdk's own filter is disabled — we feed it Fuse-ranked results and
// keep the prototype's chrome (brackets, "Analyzing" pulse, grouped rows, kbd).

import { useEffect, useMemo, useRef, useState, Fragment } from 'react';
import { Command } from 'cmdk';
import Fuse from 'fuse.js';
import { useNav, useProjectOpener } from '../lib/navigation';
import { PROJECTS } from '../content/projects';
import { SERVICES } from '../content/site';

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const GROUP_ORDER = ['Page', 'Project', 'Service'];
const GROUP_LABELS = { Page: 'Pages', Project: 'Projects', Service: 'Services' };

export function CmdK() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [thinking, setThinking] = useState(false);
  const openRef = useRef(false);

  const nav = useNav();
  const openProject = useProjectOpener();

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const items = useMemo(() => {
    const list = [];
    ['home', 'work', 'about', 'contact'].forEach((p) =>
      list.push({ id: `page-${p}`, kind: 'Page', title: cap(p), meta: `↗  ${p}`, iconSym: '▣', search: `page ${p}`, run: () => nav(p) }),
    );
    PROJECTS.forEach((p) =>
      list.push({
        id: `proj-${p.id}`, kind: 'Project', title: p.title, meta: `${p.client} · ${p.year}`,
        iconSym: p.num, search: `${p.title} ${p.client} ${p.category} ${p.tags.join(' ')} ${p.year}`,
        run: () => openProject(p.id),
      }),
    );
    SERVICES.forEach((s) =>
      list.push({ id: `svc-${s.num}`, kind: 'Service', title: s.name, meta: `Lane · ${s.num}`, iconSym: '◐', search: `${s.name} ${s.desc}`, run: () => nav('work') }),
    );
    return list;
  }, [nav, openProject]);

  const fuse = useMemo(
    () => new Fuse(items, { keys: ['title', 'search'], threshold: 0.4, ignoreLocation: true }),
    [items],
  );

  const filtered = useMemo(() => {
    if (!q.trim()) return items.slice(0, 14);
    return fuse.search(q).map((r) => r.item).slice(0, 24);
  }, [q, fuse, items]);

  const groups = useMemo(() => {
    const map = {};
    filtered.forEach((it) => {
      (map[it.kind] = map[it.kind] || []).push(it);
    });
    return GROUP_ORDER.filter((k) => map[k]).map((k) => ({ kind: k, label: GROUP_LABELS[k], items: map[k] }));
  }, [filtered]);

  // open/close: ⌘/Ctrl-K toggles, Esc closes, custom event opens (Nav trigger)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape' && openRef.current) {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('frontrow:open-search', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('frontrow:open-search', onOpen);
    };
  }, []);

  // reset query on open
  useEffect(() => {
    if (open) setQ('');
  }, [open]);

  // brief "analyzing" pulse on query change — sells the agentic feel
  useEffect(() => {
    if (!q) {
      setThinking(false);
      return undefined;
    }
    setThinking(true);
    const t = setTimeout(() => setThinking(false), 380);
    return () => clearTimeout(t);
  }, [q]);

  if (!open) return null;

  const run = (it) => {
    it.run();
    setOpen(false);
  };

  return (
    <div
      className="cmdk-scrim"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <Command className="cmdk" shouldFilter={false} loop label="Front Row search">
        <span className="cmdk-bracket tl" />
        <span className="cmdk-bracket tr" />
        <span className="cmdk-bracket bl" />
        <span className="cmdk-bracket br" />

        <div className="cmdk-head">
          <div className="left">
            {thinking ? (
              <Fragment>
                <span className="ag-dots">
                  <span />
                  <span />
                  <span />
                </span>{' '}
                Analyzing
              </Fragment>
            ) : (
              <Fragment>
                <span className="dot" /> Front Row · Search
              </Fragment>
            )}
          </div>
          <div className="right">
            <kbd>ESC</kbd>
          </div>
        </div>

        <div className="cmdk-input-wrap">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="9" cy="9" r="6" />
            <path d="m13.5 13.5 4 4" />
          </svg>
          <Command.Input autoFocus value={q} onValueChange={setQ} placeholder="Search projects, clients, services…" />
        </div>

        <Command.List className="cmdk-results">
          <Command.Empty className="cmdk-empty">No matches · try a client or year</Command.Empty>
          {groups.map((g) => (
            <Fragment key={g.kind}>
              <div className="cmdk-group-head">
                {g.label} · {g.items.length}
              </div>
              {g.items.map((it) => (
                <Command.Item key={it.id} value={it.id} onSelect={() => run(it)} className="cmdk-row">
                  <span className="icon">{it.iconSym}</span>
                  <span>
                    <span className="title">{it.title}</span>
                    <div className="meta">{it.meta}</div>
                  </span>
                  <span className="meta">{it.kind}</span>
                </Command.Item>
              ))}
            </Fragment>
          ))}
        </Command.List>

        <div className="cmdk-foot">
          <span>
            <kbd>↑↓</kbd>Navigate
          </span>
          <span>
            <kbd>↵</kbd>Open
          </span>
          <span>
            <kbd>⌘K</kbd>Toggle
          </span>
        </div>
      </Command>
    </div>
  );
}
