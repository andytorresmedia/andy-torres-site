// HomeSections.jsx — Clients logo grid, Press/Recognition strip, Services lanes.
import { useState } from 'react';
import { useNav } from '../lib/navigation';
import { asset } from '../lib/assets';
import { CLIENTS, SERVICES, AWARDS_PROJECTS } from '../content/site';

function ClientCell({ c }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={`cell ${hover ? 'hover' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="cell-shockwave" />
      <span className="cell-shockwave delay" />
      {c.src ? (
        <img src={asset(c.src)} alt={c.name} />
      ) : (
        <span className="mono" style={{ color: 'var(--mute)', fontSize: 14, position: 'relative', zIndex: 5 }}>
          {c.label}
        </span>
      )}
    </div>
  );
}

export function Clients() {
  return (
    <section className="clients" id="clients" data-screen-label="03 Clients">
      <div className="clients-head">
        <h2>
          Trusted by the
          <br />
          names you <em>recognize.</em>
        </h2>
        <div className="meta">
          Selected Clients ·<br />
          Sports · Broadcast · Brand<br />
          2018 — 2026
        </div>
      </div>
      <div className="clients-grid">
        {CLIENTS.map((c, i) => (
          <ClientCell key={i} c={c} />
        ))}
      </div>
    </section>
  );
}

export function Press() {
  return (
    <section className="press" data-screen-label="05 Press & Recognition">
      <span className="section-bracket tl" />
      <span className="section-bracket tr" />
      <span className="section-bracket bl" />
      <span className="section-bracket br" />
      <div className="press-head">
        <h2 className="press-title">Recognition.</h2>
        <div className="press-sub mono">Press features · Award-credited broadcasts · 2022 — 2026</div>
      </div>

      <div className="press-grid">
        <a
          href="https://kitbash3d.com"
          target="_blank"
          rel="noreferrer"
          className="press-cell press-feature"
          data-cursor="link"
          data-cursor-label="Read Feature"
        >
          <div className="press-tag mono">● Featured in</div>
          <div className="press-source">
            Kit Bash 3D <em>Artist Spotlight.</em>
          </div>
          <div className="press-detail mono">Read the feature →</div>
        </a>

        <div className="press-cell press-award">
          <div className="press-tag mono">● Award-credited</div>
          <div className="press-source">
            Work credited on <em>Emmy®-nominated broadcasts.</em>
          </div>
          <ul className="press-projects mono">
            {AWARDS_PROJECTS.map((p) => (
              <li key={p.title}>
                <span className="proj">{p.title}</span>
                <span className="meta">
                  · {p.client} · {p.year}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="press-cell press-metric">
          <div className="press-tag mono">● Projects on broadcast</div>
          <div className="press-num">{AWARDS_PROJECTS.length}</div>
          <div className="press-source-small mono">
            Emmy®-nominated airings.
            <br />
            Studio work credited; not studio-attributed Emmy.
          </div>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const nav = useNav();
  return (
    <section className="services" id="services" data-screen-label="04 Services">
      <div className="services-head">
        <h2>
          Built for the <em>moments</em> that don&apos;t get a second take.
        </h2>
        <div className="meta">
          We work across five lanes.<br />
          Studio-led. Senior bench. Global crew.<br />
          Always shipping on the air-date.
        </div>
      </div>
      <ul className="svc-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {SERVICES.map((s) => (
          <li key={s.num} className="svc-row" onClick={() => nav('work')}>
            <div className="num">{s.num}</div>
            <div className="name">{s.name}</div>
            <div className="desc">{s.desc}</div>
            <div className="arrow">View Work →</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
