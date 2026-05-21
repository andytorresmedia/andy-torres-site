// WorkPage.jsx — Larsen-inspired thin-row list of projects, filterable by lane.
import { useState, Fragment } from 'react';
import { AIWall } from '../components/AIWall';
import { Footer } from '../components/Footer';
import { asset } from '../lib/assets';
import { useProjectOpener } from '../lib/navigation';
import { PROJECTS, matchesFilter } from '../content/projects';
import { WORK_FILTERS } from '../content/site';

function WorkRow({ p, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      className="work-row"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(p.id)}
      data-cursor="view"
      data-cursor-label="View Project"
      style={{ width: '100%', textAlign: 'left' }}
    >
      <div className="num">#{p.num}</div>
      <div className="thumb">
        <img src={asset(p.thumb)} alt={p.title} />
        <AIWall density="micro" intensity="soft" hover hoverOn={hover} scanline={false} tinted interactive={false} />
      </div>
      <div>
        <div className="ttl">{p.title}</div>
        <span className="client">
          {p.client} · {p.category}
        </span>
      </div>
      <div className="tags">
        {p.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      <div className="year">{p.year}</div>
      <div className="arr">→</div>
    </button>
  );
}

export function WorkPage() {
  const [filter, setFilter] = useState('All');
  const openProject = useProjectOpener();
  const visible = PROJECTS.filter((p) => matchesFilter(p, filter));
  const counts = WORK_FILTERS.reduce((acc, f) => {
    acc[f] = PROJECTS.filter((p) => matchesFilter(p, f)).length;
    return acc;
  }, {});

  return (
    <Fragment>
      <section className="work-head" data-screen-label="01 Work Head">
        <div className="work-head-row">
          <h1 className="work-head-title">
            All <em>Work.</em>
          </h1>
          <div className="work-head-meta mono">
            {PROJECTS.length} projects · 2018 — 2026
            <br />
            Filter by lane below
          </div>
        </div>
        <div className="work-filters">
          {WORK_FILTERS.map((f) => (
            <button key={f} className={`work-filter ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
              <span className="count">[{counts[f]}]</span>
            </button>
          ))}
        </div>
      </section>

      <section className="work-list" data-screen-label="02 Work List">
        {visible.map((p) => (
          <WorkRow key={p.num} p={p} onOpen={openProject} />
        ))}
      </section>

      <div className="work-tail">
        <div className="mono">
          End of list · {visible.length} of {PROJECTS.length}
        </div>
      </div>

      <Footer />
    </Fragment>
  );
}
