// StickySequence.jsx — sticky-scroll-video sequence with smash-cut transitions.
// Refactored to drive the active project from Framer Motion's useScroll +
// useTransform (instead of a manual scroll listener). Because the body is locked
// and the active route panel is the scroller, useScroll targets that panel via
// the PageScroll context. Letter-by-letter title smash, clip bg reveal, white
// flash on each switch, side-rail jump nav, accent progress bar.

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent, motion } from 'motion/react';
import { AIWall } from '../components/AIWall';
import { asset } from '../lib/assets';
import { useProjectOpener } from '../lib/navigation';
import { usePageScroll } from '../lib/pageScroll';
import { FEATURED_PROJECTS } from '../content/projects';

const FEATURED = FEATURED_PROJECTS;

function SeqTitle({ text, switchKey }) {
  return (
    <h2 className="seq-title">
      {text.split('').map((c, i) => (
        <span key={`${switchKey}-${i}`} className="letter" style={{ animationDelay: `${80 + i * 32}ms` }}>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </h2>
  );
}

function SeqSlide({ p, isActive, isLeaving, switchKey }) {
  const videoRef = useRef(null);
  const type = p.sequenceType || 'image';
  const media = p.sequenceMedia || p.thumb;

  useEffect(() => {
    if (type === 'video' && videoRef.current) {
      videoRef.current.muted = true;
      const tryPlay = () => videoRef.current && videoRef.current.play().catch(() => {});
      tryPlay();
      const id = setTimeout(tryPlay, 120);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [type, media]);

  return (
    <div className={`seq-slide ${isActive ? 'active' : ''} ${isLeaving ? 'leaving' : ''}`}>
      {type === 'video' ? (
        <video ref={videoRef} src={asset(media)} poster={asset(p.sequencePoster)} autoPlay muted loop playsInline preload="auto" />
      ) : (
        <img src={asset(media)} alt={p.title} key={`${p.num}-${isActive ? switchKey : 'idle'}`} />
      )}
      <div className="tint" />
    </div>
  );
}

export function StickySequence() {
  const wrapRef = useRef(null);
  const whiteRef = useRef(null);
  const pageScroll = usePageScroll();
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(0);
  const [switchKey, setSwitchKey] = useState(0);
  const activeRef = useRef(0);
  const openProject = useProjectOpener();

  const { scrollYProgress } = useScroll({
    container: pageScroll || undefined,
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  // Accent progress bar — bound to a motion value so it updates without re-render.
  const fillWidth = useTransform(scrollYProgress, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);

  const fireWhiteFlash = () => {
    const el = whiteRef.current;
    if (!el) return;
    el.classList.remove('fire');
    void el.offsetWidth; // force reflow so the animation re-triggers
    el.classList.add('fire');
  };

  // Derive the active index from scroll progress; only commit on integer change.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(FEATURED.length - 1, Math.max(0, Math.floor(v * FEATURED.length * 0.9999)));
    if (i !== activeRef.current) {
      setPrevActive(activeRef.current);
      activeRef.current = i;
      setActive(i);
      setSwitchKey((k) => k + 1);
      fireWhiteFlash();
    }
  });

  // clear the "leaving" class after the cross-fade settles
  useEffect(() => {
    const t = setTimeout(() => setPrevActive(active), 520);
    return () => clearTimeout(t);
  }, [active]);

  const jumpTo = (i) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const vh = window.innerHeight;
    const total = wrap.offsetHeight - vh;
    const targetPct = (i + 0.05) / FEATURED.length;
    const top = wrap.offsetTop + total * targetPct;
    const container = pageScroll && pageScroll.current;
    if (container) container.scrollTo({ top, behavior: 'smooth' });
    else window.scrollTo({ top, behavior: 'smooth' });
  };

  const cur = FEATURED[active];

  return (
    <div
      ref={wrapRef}
      className="seq-wrap"
      data-screen-label="02 Sticky Scroll Sequence"
      style={{ height: `${FEATURED.length * 100}vh` }}
    >
      <div className="seq-sticky">
        <div className="seq-bg">
          {FEATURED.map((p, i) => {
            const isActive = i === active;
            const isLeaving = !isActive && i === prevActive;
            return <SeqSlide key={p.num} p={p} isActive={isActive} isLeaving={isLeaving} switchKey={switchKey} />;
          })}
          <AIWall density="dense" intensity="soft" interactive />
          <div ref={whiteRef} className="seq-whiteflash" />
          <div className="seq-grain" />
        </div>

        <div className="seq-frame">
          <div className="seq-top">
            <div className="left">
              <span className="seq-counter">
                <span className="now">{cur.num}</span> / {String(FEATURED.length).padStart(2, '0')} &nbsp;·&nbsp; Featured Work
              </span>
            </div>
            <div className="center">
              <span className="seq-tag-pill">Showreel · Auto-Looping · Muted</span>
            </div>
            <div className="right">
              <span className="mono" style={{ opacity: 0.7 }}>
                {cur.client}
              </span>
            </div>
          </div>

          <div className="seq-center">
            <div
              className="seq-slide active"
              key={switchKey}
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}
            >
              <div className="seq-title-stack">
                <div className="seq-client">
                  {cur.client} &nbsp;·&nbsp; {cur.year}
                </div>
                <div className="seq-title-wrap">
                  <SeqTitle text={cur.title} switchKey={switchKey} />
                </div>
                <div className="seq-subtitle">
                  {cur.sequenceTag} &nbsp;—&nbsp; {cur.role}
                </div>
                <div>
                  <button className="seq-view" onClick={() => openProject(cur.id, { state: { lingerLoading: true } })} type="button">
                    View Project <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="seq-bottom">
            <div className="left">
              <div className="mono" style={{ opacity: 0.7, marginBottom: 4 }}>Tag</div>
              <div className="mono">{cur.sequenceTag}</div>
            </div>
            <div className="center">
              <div className="mono" style={{ opacity: 0.55 }}>
                Scroll · {String(active + 1).padStart(2, '0')} of {String(FEATURED.length).padStart(2, '0')}
              </div>
            </div>
            <div className="right">
              <div className="mono" style={{ opacity: 0.7, marginBottom: 4 }}>Year</div>
              <div className="mono">{cur.year}</div>
            </div>
          </div>
        </div>

        <div className="seq-rail">
          {FEATURED.map((p, i) => (
            <button
              key={p.num}
              data-num={p.num}
              className={i === active ? 'active' : ''}
              onClick={() => jumpTo(i)}
              aria-label={`Go to ${p.title}`}
            />
          ))}
        </div>

        <div className="seq-progress">
          <motion.div className="fill" style={{ width: fillWidth }} />
        </div>
      </div>
    </div>
  );
}
