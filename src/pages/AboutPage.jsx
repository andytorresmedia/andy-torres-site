// AboutPage.jsx — studio positioning: hero, pitch, philosophy, process, capabilities.
import { Fragment } from 'react';
import { AIWall } from '../components/AIWall';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';

const PROCESS = [
  { num: '01', name: 'Brief', lane: 'INTAKE', copy: 'Discovery call, scope, timeline, budget. We pre-qualify on the first call — no proposals built for projects we can’t honestly serve.' },
  { num: '02', name: 'Treatment', lane: 'CONCEPT', copy: 'Boards, look references, motion direction, a written treatment. One round of internal review before client sees it.' },
  { num: '03', name: 'Look-dev', lane: 'R&D', copy: 'Material tests, camera tests, character/asset look-dev. We lock the look before production scales. No surprises on the back end.' },
  { num: '04', name: 'Production', lane: 'BUILD', copy: 'Senior bench staffs the brief. 3D, comp, design, sound — all under one creative direction. Daily reels for the client; nothing waits a week.' },
  { num: '05', name: 'Finish', lane: 'POLISH', copy: 'Final comp, color, sound, conform. Multi-format delivery for broadcast, IMAG, social. QC against spec sheet, line by line.' },
  { num: '06', name: 'Air', lane: 'DELIVERED', copy: 'Master + every deliverable named correctly, delivered on the schedule we set on day one. Post-air, you get the BTS reel and a project archive.' },
];

const CAPABILITIES = [
  { num: '01', tag: '3D / CGI', title: '3D & CGI', items: ['Photoreal product CG', 'Stadium / arena builds', 'FOOH / digital OOH', 'Character & mascot'] },
  { num: '02', tag: 'VFX / COMP', title: 'VFX & Comp', items: ['On-air integration', 'Plate cleanup & finish', 'Atmospherics & FX', 'HDR / Rec.2100 delivery'] },
  { num: '03', tag: 'DESIGN / MOTION', title: 'Design & Motion', items: ['Show opens & pregame', 'Promo packages', 'Lower-thirds + graphics', 'Title sequences'] },
  { num: '04', tag: 'LIVE / IN-VENUE', title: 'Live & In-Venue', items: ['Jumbotron / IMAG content', 'LED volume content', 'Projection mapping', 'Live cut-down delivery'] },
  { num: '05', tag: 'DIRECTION', title: 'Direction & Concept', items: ['Boards & treatments', 'Look development', 'Player-feature films', 'Brand storytelling'] },
  { num: '06', tag: 'PIPELINE', title: 'Tools', items: ['Cinema 4D · Houdini · Maya', 'Nuke · After Effects', 'Unreal · Octane · Redshift', 'DaVinci · Pro Tools'] },
];

export function AboutPage() {
  return (
    <Fragment>
      <section className="about-hero" data-screen-label="01 About Hero">
        <AIWall density="loose" intensity="soft" stealth interactive tinted />
        <span className="section-bracket tl" />
        <span className="section-bracket tr" />
        <span className="section-bracket bl" />
        <span className="section-bracket br" />
        <div className="about-hero-eyebrow mono">About the studio</div>
        <h1>
          A studio built for the moments that <em>have to land.</em>
        </h1>
        <div className="about-hero-grid">
          <div className="mono" style={{ color: 'var(--bone)', lineHeight: 1.6, maxWidth: '52ch', fontSize: 14, letterSpacing: '0.06em', textTransform: 'none' }}>
            We operate as a{' '}
            <em style={{ color: 'var(--paper)', fontStyle: 'normal' }}>studio with a senior bench</em> — a tight
            creative core, with a vetted network of senior creatives scaling around the brief by the job. Premium
            output at boutique speed.
          </div>
          <div className="mono" style={{ color: 'var(--bone)', lineHeight: 1.6, maxWidth: '52ch', fontSize: 14, letterSpacing: '0.06em', textTransform: 'none' }}>
            Work credited on{' '}
            <em style={{ color: 'var(--accent-live)', fontStyle: 'normal' }}>Emmy®-nominated broadcasts</em>. Featured
            artist on Kit Bash 3D. Building for clients across the NFL, NBA, NCAA, MLS, F1 and the Super Bowl.
          </div>
        </div>
      </section>

      <section className="about-pitch" data-screen-label="02 About Pitch">
        <h3>The pitch</h3>
        <div className="about-pitch-body">
          <p>
            Front Row is a cinematic 3D, VFX, and motion studio for sports, entertainment, and live-event content —
            built for broadcasters, leagues, agencies and brands who need premium work delivered
            <em> on the air-date</em>, not in the abstract.
          </p>
          <p>
            We started inside the room: sideline shoots, jumbotron content, halftime films, pregame opens. The work
            has to play behind a player walking out, a host going to break, or 70,000 people on their feet —{' '}
            <em>so it has to land the first time</em>.
          </p>
          <p>
            We&apos;re not trying to be the biggest studio. We&apos;re trying to be the call you make when the project
            matters and the clock is real.
          </p>
        </div>
      </section>

      <section className="about-philosophy" data-screen-label="03 Philosophy">
        <AIWall density="loose" intensity="soft" stealth interactive />
        <span className="section-bracket tl" />
        <span className="section-bracket tr" />
        <span className="section-bracket bl" />
        <span className="section-bracket br" />
        <div className="about-philosophy-head">
          <div className="mono" style={{ color: 'var(--mute)', letterSpacing: '0.18em', marginBottom: 24 }}>
            How we work
          </div>
          <h2>
            Three rules. <em>No exceptions.</em>
          </h2>
        </div>
        <div className="about-philosophy-grid">
          <div className="phil-card">
            <div className="phil-num mono">RULE 01</div>
            <h4>Hit the air-date.</h4>
            <p>
              The work has to land when it has to land. Every pipeline decision — from look-dev tools to comp passes to
              delivery formats — is made backwards from the broadcast slot.
            </p>
          </div>
          <div className="phil-card">
            <div className="phil-num mono">RULE 02</div>
            <h4>Senior hands only.</h4>
            <p>
              No juniors learning on your project. Every brief is staffed with credited senior creatives — the same
              names you see in the credits of the work that inspired the call.
            </p>
          </div>
          <div className="phil-card">
            <div className="phil-num mono">RULE 03</div>
            <h4>Make it stadium-loud.</h4>
            <p>
              The work plays behind real moments — a tip-off, a kickoff, a host returning from break. It has to read in
              a half-second from row Z. Subtle has its place; this isn&apos;t it.
            </p>
          </div>
        </div>
      </section>

      <section className="about-process" data-screen-label="04 Process">
        <div className="about-process-head">
          <div className="mono" style={{ color: 'var(--mute)', letterSpacing: '0.18em', marginBottom: 18 }}>
            How a project moves
          </div>
          <h2>
            Brief to <em>air-date.</em>
          </h2>
        </div>
        <ol className="process-list">
          {PROCESS.map((step) => (
            <li key={step.num} className="process-step">
              <span className="cell-bracket tl" />
              <span className="cell-bracket tr" />
              <span className="cell-bracket bl" />
              <span className="cell-bracket br" />
              <div className="process-step-num">
                <span className="mono lane">{step.lane}</span>
                <span className="big">{step.num}</span>
              </div>
              <div className="process-step-body">
                <h4>{step.name}</h4>
                <p>{step.copy}</p>
              </div>
              <div className="process-step-arc" />
            </li>
          ))}
        </ol>
      </section>

      <section className="about-capabilities" data-screen-label="05 Capabilities">
        <AIWall density="loose" intensity="soft" stealth interactive />
        <span className="section-bracket tl" />
        <span className="section-bracket tr" />
        <span className="section-bracket bl" />
        <span className="section-bracket br" />
        <div className="about-capabilities-head">
          <h2>
            What we <em>actually</em> do.
          </h2>
          <div className="meta">Pipeline · Tools · Deliverables</div>
        </div>
        <div className="about-capabilities-grid">
          {CAPABILITIES.map((c) => (
            <div key={c.num} className="cap-cell">
              <span className="cell-bracket tl" />
              <span className="cell-bracket tr" />
              <span className="cell-bracket bl" />
              <span className="cell-bracket br" />
              <div className="cap-cell-top">
                <div className="num">
                  [{c.num}] · {c.tag}
                </div>
              </div>
              <div>
                <h4>{c.title}</h4>
                <ul>
                  {c.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTA />
      <Footer />
    </Fragment>
  );
}
