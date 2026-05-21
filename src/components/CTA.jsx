// CTA.jsx — closing call-to-action band (home + about).
import { useNav } from '../lib/navigation';
import { STUDIO_EMAIL } from '../content/site';

export function CTA() {
  const nav = useNav();
  return (
    <section className="cta" data-screen-label="05 CTA">
      <div className="eyebrow">Got an air-date? Start here.</div>
      <h2>
        Let&apos;s make <em>the moment</em>.
      </h2>
      <div className="row">
        <button className="primary" onClick={() => nav('contact')}>
          Start a Project →
        </button>
        <a className="ghost" href={`mailto:${STUDIO_EMAIL}`}>
          {STUDIO_EMAIL}
        </a>
      </div>
      <div className="note">Most projects start around $8–10K · Rapid-turn packages available</div>
    </section>
  );
}
