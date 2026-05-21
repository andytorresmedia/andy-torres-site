// CaseStudyPage.jsx — the /work/:slug route. Cinematic backdrop (Mux Player when
// a playback ID is set, else the local mp4 + custom HUD controls), agentic HUD
// chrome, and a floating graded "case file" card with real 3D depth: a hand-rolled
// tilt smoothed by Framer Motion springs (inertia), with the Z-layered children
// from case-study.css. Tabs: About / Gallery (manual wheel/click + keyboard) / R&D (autoplay).

import { useCallback, useEffect, useMemo, useRef, useState, Fragment } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'motion/react';
import MuxPlayer from '@mux/mux-player-react';
import { asset } from '../lib/assets';
import { getProjectBySlug } from '../content/projects';
import { getMuxPlaybackId } from '../content/videos';

/* ─────────── Custom video controls (local-mp4 fallback) ─────────── */

function VideoControls({ videoRef }) {
  const [playing, setPlaying] = useState(true);
  const [pct, setPct] = useState(0);
  const [dur, setDur] = useState(0);
  const [cur, setCur] = useState(0);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [quality, setQuality] = useState('1080p');
  const [showQ, setShowQ] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const onTime = () => {
      setCur(v.currentTime || 0);
      setDur(v.duration || 0);
      if (v.duration) setPct((v.currentTime / v.duration) * 100);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onTime);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onTime);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, [videoRef]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const scrub = (e) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    v.currentTime = x * v.duration;
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const onVolume = (e) => {
    const v = videoRef.current;
    const value = +e.target.value;
    setVolume(value);
    if (v) {
      v.volume = value;
      if (value > 0 && v.muted) {
        v.muted = false;
        setMuted(false);
      }
    }
  };
  const fmt = (t) => {
    if (!Number.isFinite(t)) return '00:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="cs-controls">
      <button className="cs-play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? (
          <span className="cs-icon pause">
            <i />
            <i />
          </span>
        ) : (
          <span className="cs-icon play" />
        )}
      </button>
      <div className="cs-time mono">{fmt(cur)}</div>
      <div className="cs-scrubber" onClick={scrub}>
        <div className="cs-scrubber-track" />
        <div className="cs-scrubber-fill" style={{ width: `${pct}%` }} />
        <div className="cs-scrubber-head" style={{ left: `${pct}%` }} />
      </div>
      <div className="cs-time mono" style={{ opacity: 0.55 }}>
        {fmt(dur)}
      </div>

      <div className="cs-vol">
        <button className="cs-vol-btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? (
            <svg viewBox="0 0 18 18" width="16" height="16">
              <path d="M3 6h3l4-3v12l-4-3H3z M12 6l4 6 M16 6l-4 6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 18 18" width="16" height="16">
              <path d="M3 6h3l4-3v12l-4-3H3z M12 5c2 1.5 2 6.5 0 8 M14.5 3c3 2.5 3 9.5 0 12" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} onChange={onVolume} className="cs-vol-slider" aria-label="Volume" />
      </div>

      <div className="cs-qual">
        <button className="cs-qual-btn" onClick={() => setShowQ((v) => !v)} aria-label="Quality">
          <svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="9" cy="9" r="2.5" />
            <path d="M9 1.5v2 M9 14.5v2 M16.5 9h-2 M3.5 9h-2 M14.3 3.7l-1.4 1.4 M5.1 12.9l-1.4 1.4 M14.3 14.3l-1.4-1.4 M5.1 5.1L3.7 3.7" />
          </svg>
        </button>
        {showQ && (
          <div className="cs-qual-menu mono">
            <div className="cs-qual-head">Quality</div>
            {['Auto', '4K', '1080p', '720p', '480p'].map((qual) => (
              <button key={qual} className={`cs-qual-opt ${qual === quality ? 'active' : ''}`} onClick={() => { setQuality(qual); setShowQ(false); }}>
                <span className="check">{qual === quality ? '●' : '○'}</span>
                <span>{qual}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────── Tabs ─────────── */

function AboutTab({ project }) {
  const a = project.about;
  return (
    <div>
      <div className="cs-about-row">
        <h4>Summary</h4>
        <p>{a.summary}</p>
      </div>
      <div className="cs-about-row">
        <h4>The challenge</h4>
        <p>{a.challenge}</p>
      </div>
      <div className="cs-about-row">
        <h4>The approach</h4>
        <p>{a.approach}</p>
      </div>
      <div className="cs-about-row">
        <h4>Deliverables</h4>
        <ul>
          {a.deliverables.map((d, i) => (
            <li key={i}>
              <span style={{ color: 'var(--accent-live)', minWidth: 32 }}>{String(i + 1).padStart(2, '0')}</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="cs-about-row">
        <h4>Credits</h4>
        <ul>
          {project.credits.map((c, i) => (
            <li key={i}>
              <span style={{ minWidth: 140, color: 'var(--mute)' }}>{c.role}</span>
              <span className="who">{c.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GalleryTab({ project }) {
  const items = project.gallery || [];
  const [idx, setIdx] = useState(0);
  const [smashKey, setSmashKey] = useState(0);
  const wheelStateRef = useRef({ delta: 0, locked: false, timeout: null });

  useEffect(() => {
    const wheelState = wheelStateRef.current;
    return () => {
      if (wheelState.timeout) clearTimeout(wheelState.timeout);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (!items.length) return;
      if (e.key === 'ArrowLeft') {
        setIdx((i) => (i - 1 + items.length) % items.length);
        setSmashKey((k) => k + 1);
      }
      if (e.key === 'ArrowRight') {
        setIdx((i) => (i + 1) % items.length);
        setSmashKey((k) => k + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [items.length]);

  const showFrame = (updater) => {
    if (!items.length) return;
    setIdx((i) => (typeof updater === 'function' ? updater(i) : updater));
    setSmashKey((k) => k + 1);
  };
  const prev = () => {
    showFrame((i) => (i - 1 + items.length) % items.length);
  };
  const next = () => {
    showFrame((i) => (i + 1) % items.length);
  };
  const onGalleryWheel = (e) => {
    if (items.length < 2) return;

    const primaryDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(primaryDelta) < 2) return;

    const state = wheelStateRef.current;
    if (state.locked) return;

    state.delta += primaryDelta;
    if (Math.abs(state.delta) < 48) {
      if (state.timeout) clearTimeout(state.timeout);
      state.timeout = setTimeout(() => {
        state.delta = 0;
        state.timeout = null;
      }, 180);
      return;
    }

    if (state.timeout) clearTimeout(state.timeout);
    if (state.delta > 0) next();
    else prev();
    state.delta = 0;
    state.locked = true;
    state.timeout = setTimeout(() => {
      state.locked = false;
      state.timeout = null;
    }, 240);
  };
  const cur = items[idx] || {};

  return (
    <div className="cs-gallery">
      <div className="cs-gallery-stage" style={{ '--bg-img': `url(${asset(cur.src)})` }} onWheel={onGalleryWheel}>
        <div className="cs-gallery-bg" />
        <div key={smashKey} className="cs-gallery-frame">
          <img src={asset(cur.src)} alt={cur.caption} />
          <div className="cs-gallery-flash" />
        </div>
        <button className="cs-gallery-half left" onClick={prev} aria-label="Previous" data-cursor="drag" data-cursor-label="Prev">
          <span className="arr">←</span>
        </button>
        <button className="cs-gallery-half right" onClick={next} aria-label="Next" data-cursor="drag" data-cursor-label="Next">
          <span className="arr">→</span>
        </button>
        <div className="cs-gallery-caption">
          <span className="cap-tag mono">FRAME</span>
          <span>{cur.caption}</span>
          <span>
            <span className="count">{String(idx + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}
          </span>
        </div>
        <span className="cell-bracket tl" />
        <span className="cell-bracket tr" />
        <span className="cell-bracket bl" />
        <span className="cell-bracket br" />
      </div>
      <div className="cs-gallery-thumbs">
        {items.map((it, i) => (
          <button
            key={i}
            className={`cs-gallery-thumb ${i === idx ? 'active' : ''}`}
            onClick={() => {
              showFrame(i);
            }}
            aria-label={`Show frame ${i + 1}`}
          >
            <img src={asset(it.src)} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

function RDTile({ item, idx }) {
  const vRef = useRef(null);
  useEffect(() => {
    if (item.type === 'video' && vRef.current) {
      vRef.current.muted = true;
      const tryPlay = () => vRef.current && vRef.current.play().catch(() => {});
      tryPlay();
      const id = setTimeout(tryPlay, 200);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [item.type]);

  return (
    <div className="cs-rd-tile">
      <div className="cs-rd-tag mono">
        <span className="dot" />
        {item.tag || `CH.${String(idx + 1).padStart(2, '0')} · R&D`}
      </div>
      <span className="cell-bracket tl" />
      <span className="cell-bracket tr" />
      <span className="cell-bracket bl" />
      <span className="cell-bracket br" />
      {item.type === 'video' ? (
        <video ref={vRef} src={asset(item.src)} poster={asset(item.poster)} autoPlay muted loop playsInline preload="auto" />
      ) : (
        <img src={asset(item.src)} alt={item.caption} />
      )}
      <div className="cs-rd-readout mono">
        <div className="rd-caption">{item.caption}</div>
        <div className="rd-meta">
          {item.type === 'video' ? 'AUTOPLAY' : 'STILL'} · 8K MASTER · CH.{String(idx + 1).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}

function RDTab({ project }) {
  const items = project.rd || [];
  return (
    <div>
      <p style={{ color: 'var(--bone)', fontSize: 14, lineHeight: 1.55, margin: '0 0 24px', maxWidth: '64ch' }}>
        Selected R&D and behind-the-scenes from the build — material tests, previs passes, look-dev, screen recordings
        from the rig. Gallery frames advance by click, wheel, or keyboard.
      </p>
      <div className="cs-rd-grid">
        {items.map((it, i) => (
          <RDTile key={i} item={it} idx={i} />
        ))}
      </div>
    </div>
  );
}

/* ─────────── Loading ─────────── */

const LOADING_PHASES = ['Connecting media', 'Authenticating', 'Routing'];
const CASE_STUDY_LOAD_MS = 1400;
const FEATURED_CASE_STUDY_LOAD_MS = 1900;

// Rest facing straight at the camera; the slab only tilts while you move over it.
const REST_RX = 0;
const REST_RY = 0;
const POINTER_TILT_X = 20;
const POINTER_TILT_Y = 24;
const CONTROL_TILT_SCALE = 0;
const DEVICE_TILT_X = 7;
const DEVICE_TILT_Y = 8;
const DEVICE_TILT_RANGE = 24;
const CARD_TILT_SPRING = { stiffness: 160, damping: 24, mass: 0.7 };
const CARD_STABLE_TARGETS = 'button, a, input, textarea, select, [role="button"], [role="link"]';
const CARD_FREE_TILT_TARGETS = '.cs-gallery-half';
const CARD_TOUCH_STABLE_TARGETS = `${CARD_STABLE_TARGETS}, .cs-card-body`;
const CARD_TABS = ['about', 'gallery', 'rd'];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const isTouchTiltDevice = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(pointer: coarse)').matches ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
    'ontouchstart' in window
  );
};

const requestOrientationTilt = async () => {
  if (typeof window === 'undefined' || !window.DeviceOrientationEvent) return false;
  const requestPermission = window.DeviceOrientationEvent.requestPermission;

  if (typeof requestPermission === 'function') {
    try {
      return (await requestPermission()) === 'granted';
    } catch {
      return false;
    }
  }

  return true;
};

const isCardStableTarget = (target) => {
  if (!(target instanceof Element)) return false;
  const stableTarget = target.closest(CARD_STABLE_TARGETS);
  return Boolean(stableTarget && !stableTarget.closest(CARD_FREE_TILT_TARGETS));
};
const isCardTouchStableTarget = (target) => target instanceof Element && Boolean(target.closest(CARD_TOUCH_STABLE_TARGETS));

const readCardLayoutRect = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: element.offsetWidth || rect.width,
    height: element.offsetHeight || rect.height,
  };
};

const cardPointFromClient = (clientX, clientY, rect) => {
  if (!rect.width || !rect.height) return { x: 0.5, y: 0.5 };
  return {
    x: clamp((clientX - rect.left) / rect.width, 0, 1),
    y: clamp((clientY - rect.top) / rect.height, 0, 1),
  };
};

function LoadingPhases() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % LOADING_PHASES.length), 720);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="cs-loading-phases">
      <span key={i} className="phase">
        {LOADING_PHASES[i]}
      </span>
    </div>
  );
}

/* ─────────── Page ─────────── */

export function CaseStudyPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const project = useMemo(() => getProjectBySlug(slug), [slug]);
  const muxId = project ? getMuxPlaybackId(project.id) : null;
  const loadingDelay = location.state?.lingerLoading ? FEATURED_CASE_STUDY_LOAD_MS : CASE_STUDY_LOAD_MS;

  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [gyroTiltActive, setGyroTiltActive] = useState(false);
  const [tab, setTab] = useState('about');
  const videoRef = useRef(null);
  const cardTabsRef = useRef(null);
  const cardCloseRef = useRef(null);
  const cardHoverRectRef = useRef(null);
  const orientationBaseRef = useRef(null);
  const touchDragRef = useRef(null);
  const touchInteractingRef = useRef(false);

  // 3D tilt — only the rotation updates per mouse move (a cheap GPU transform);
  // the glow/sheen layers are static, so hover stays fluid even on huge displays.
  const rxRaw = useMotionValue(REST_RX);
  const ryRaw = useMotionValue(REST_RY);
  const rx = useSpring(rxRaw, CARD_TILT_SPRING);
  const ry = useSpring(ryRaw, CARD_TILT_SPRING);
  // perspective() must be the first transform function (the CSS `perspective`
  // property didn't survive the backdrop-filtered wrapper).
  const cardTransform = useMotionTemplate`perspective(1600px) rotateX(${rx}deg) rotateY(${ry}deg)`;

  const closeRoute = useCallback(() => {
    const returnTo = location.state?.returnTo;
    if (returnTo?.pathname) {
      navigate(returnTo.pathname, { state: returnTo.state });
      return;
    }
    navigate('/work');
  }, [location.state, navigate]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), loadingDelay);
    return () => clearTimeout(t);
  }, [slug, loadingDelay]);

  useEffect(() => {
    document.body.classList.add('case-study-active');
    return () => document.body.classList.remove('case-study-active');
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (detailsOpen) setDetailsOpen(false);
        else closeRoute();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detailsOpen, closeRoute]);

  useEffect(() => {
    if (detailsOpen) return;
    setGyroTiltActive(false);
    orientationBaseRef.current = null;
    cardHoverRectRef.current = null;
    touchDragRef.current = null;
    touchInteractingRef.current = false;
    rxRaw.set(REST_RX);
    ryRaw.set(REST_RY);
  }, [detailsOpen, gyroTiltActive, rxRaw, ryRaw]);

  useEffect(() => {
    if (!detailsOpen || !gyroTiltActive) return undefined;

    const onOrientation = (event) => {
      if (touchInteractingRef.current || typeof event.beta !== 'number' || typeof event.gamma !== 'number') return;

      if (!orientationBaseRef.current) {
        orientationBaseRef.current = { beta: event.beta, gamma: event.gamma };
      }

      const deltaBeta = clamp(event.beta - orientationBaseRef.current.beta, -DEVICE_TILT_RANGE, DEVICE_TILT_RANGE);
      const deltaGamma = clamp(event.gamma - orientationBaseRef.current.gamma, -DEVICE_TILT_RANGE, DEVICE_TILT_RANGE);
      ryRaw.set(REST_RY + (deltaGamma / DEVICE_TILT_RANGE) * DEVICE_TILT_Y);
      rxRaw.set(REST_RX + (-deltaBeta / DEVICE_TILT_RANGE) * DEVICE_TILT_X);
    };

    window.addEventListener('deviceorientation', onOrientation, true);
    return () => window.removeEventListener('deviceorientation', onOrientation, true);
  }, [detailsOpen, gyroTiltActive, rxRaw, ryRaw]);

  if (!project) return <Navigate to="/work" replace />;

  const easeCardTiltToRest = () => {
    rxRaw.set(rxRaw.get() + (REST_RX - rxRaw.get()) * 0.25);
    ryRaw.set(ryRaw.get() + (REST_RY - ryRaw.get()) * 0.25);
  };
  const setCardTiltFromPoint = (clientX, clientY, rect, scale = 1) => {
    const { x, y } = cardPointFromClient(clientX, clientY, rect);
    ryRaw.set(REST_RY + (x - 0.5) * POINTER_TILT_Y * scale);
    rxRaw.set(REST_RX + (0.5 - y) * POINTER_TILT_X * scale);
  };

  const onDetailsButtonClick = async () => {
    if (detailsOpen) {
      setDetailsOpen(false);
      return;
    }

    orientationBaseRef.current = null;
    setGyroTiltActive(false);
    setDetailsOpen(true);

    if (isTouchTiltDevice()) {
      setGyroTiltActive(await requestOrientationTilt());
    }
  };

  const isPointOverCardClose = (clientX, clientY) => {
    const closeEl = cardCloseRef.current;
    if (!closeEl) return false;

    const rect = closeEl.getBoundingClientRect();
    const closeSlack = 18;
    return (
      clientX >= rect.left - closeSlack &&
      clientX <= rect.right + closeSlack &&
      clientY >= rect.top - closeSlack &&
      clientY <= rect.bottom + closeSlack
    );
  };

  const closeCardFromPointer = (e) => {
    if (e.button !== undefined && e.button !== 0) return false;
    if (!isPointOverCardClose(e.clientX, e.clientY)) return false;

    setDetailsOpen(false);
    e.preventDefault();
    e.stopPropagation();
    return true;
  };

  const onCardWrapPointerDownCapture = (e) => {
    closeCardFromPointer(e);
  };

  const onCardPointerDownCapture = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (closeCardFromPointer(e)) return;

    const cardRect = readCardLayoutRect(e.currentTarget);
    const x = e.clientX - cardRect.left;
    const y = e.clientY - cardRect.top;

    const tabsEl = cardTabsRef.current;
    if (!tabsEl) return;

    const left = tabsEl.offsetLeft;
    const top = tabsEl.offsetTop;
    const width = tabsEl.offsetWidth;
    const height = tabsEl.offsetHeight;
    const verticalSlack = 18;

    if (x < left || x > left + width || y < top - verticalSlack || y > top + height + verticalSlack) return;

    const index = Math.min(CARD_TABS.length - 1, Math.max(0, Math.floor(((x - left) / width) * CARD_TABS.length)));
    setTab(CARD_TABS[index]);
    e.preventDefault();
    e.stopPropagation();
  };

  const onCardMouseEnter = (e) => {
    cardHoverRectRef.current = readCardLayoutRect(e.currentTarget);
  };
  const onCardMouseMove = (e) => {
    const rect = cardHoverRectRef.current || readCardLayoutRect(e.currentTarget);
    const scale = isCardStableTarget(e.target) ? CONTROL_TILT_SCALE : 1;
    setCardTiltFromPoint(e.clientX, e.clientY, rect, scale);
  };
  const onCardMouseLeave = () => {
    cardHoverRectRef.current = null;
    rxRaw.set(REST_RX);
    ryRaw.set(REST_RY);
  };
  const onCardTouchStart = (e) => {
    touchInteractingRef.current = true;

    if (isCardTouchStableTarget(e.target)) {
      touchDragRef.current = null;
      easeCardTiltToRest();
      return;
    }

    const touch = e.touches[0];
    if (!touch) return;
    touchDragRef.current = { rect: readCardLayoutRect(e.currentTarget) };
  };
  const onCardTouchMove = (e) => {
    const touch = e.touches[0];
    if (!touch || !touchDragRef.current) {
      if (isCardTouchStableTarget(e.target)) easeCardTiltToRest();
      return;
    }

    const { rect } = touchDragRef.current;
    const { x, y } = cardPointFromClient(touch.clientX, touch.clientY, rect);
    ryRaw.set(REST_RY + (x - 0.5) * DEVICE_TILT_Y * 2);
    rxRaw.set(REST_RX + (0.5 - y) * DEVICE_TILT_X * 2);
  };
  const onCardTouchEnd = () => {
    touchInteractingRef.current = false;
    touchDragRef.current = null;
    easeCardTiltToRest();
  };

  return (
    <div className={`cs-overlay ${detailsOpen ? 'details-open' : ''}`} data-screen-label="Case Study">
      {loading ? (
        <div className="cs-loading">
          <div className="loading-logo">
            <img className="loading-mark" src={asset('assets/at-mark.png')} alt="" />
            <span className="loading-word">
              FRONT&nbsp;ROW<span className="dot">.</span>
            </span>
          </div>
          <div className="dots">
            <span />
            <span />
            <span />
          </div>
          <div className="label">Loading project file · {project.title}</div>
          <LoadingPhases />
        </div>
      ) : (
        <Fragment>
          <div className="cs-video-wrap">
            {muxId ? (
              <MuxPlayer
                playbackId={muxId}
                streamType="on-demand"
                autoPlay="muted"
                loop
                muted
                accentColor="#ff5b1f"
                poster={asset(project.poster)}
                metadata={{ video_title: project.title }}
              />
            ) : (
              <video ref={videoRef} className="cs-video" src={asset(project.video)} poster={asset(project.poster)} autoPlay muted loop playsInline />
            )}
            <div className="cs-vignette" />
          </div>

          <div className="cs-top">
            <div className="cs-top-l">
              <span className="blip" />
              <span className="mono">REC · {project.client.toUpperCase()}</span>
            </div>
            <div className="cs-top-c">
              <div className="ttl">{project.title}</div>
              <div className="meta">
                {project.client} · {project.year} · {project.sequenceTag || project.tags[0]}
              </div>
            </div>
            <div className="cs-top-r">
              <button className="cs-close" onClick={closeRoute}>
                Close ✕
              </button>
            </div>
          </div>

          <div className="cs-lower">
            <div className="ag-state mono">
              <span className="dot" /> {detailsOpen ? 'Reading · Project file' : 'Playing · Live loop'}
            </div>
            <h2>{project.title}</h2>
            <div className="sub mono">
              {project.client} · {project.year} · {project.role || project.tags.join(' · ')}
            </div>
          </div>

          <span className="section-bracket tl" />
          <span className="section-bracket tr" />
          <span className="section-bracket bl" />
          <span className="section-bracket br" />

          <button className="cs-details-btn" onClick={onDetailsButtonClick}>
            {detailsOpen ? 'Hide File' : 'Open Project File'}
          </button>

          {!detailsOpen && !muxId && <VideoControls videoRef={videoRef} />}

          {detailsOpen && (
            <div
              className="cs-card-wrap"
              onPointerDownCapture={onCardWrapPointerDownCapture}
              onClick={(e) => {
                if (e.target === e.currentTarget) setDetailsOpen(false);
              }}
            >
              <div
                className="cs-card-float"
                onPointerDownCapture={onCardPointerDownCapture}
                onMouseEnter={onCardMouseEnter}
                onMouseMove={onCardMouseMove}
                onMouseLeave={onCardMouseLeave}
                onTouchStart={onCardTouchStart}
                onTouchMove={onCardTouchMove}
                onTouchEnd={onCardTouchEnd}
                onTouchCancel={onCardTouchEnd}
              >
              <div className="cs-card-shadow" aria-hidden="true" />
              <motion.div
                className="cs-card"
                style={{ transform: cardTransform }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.28 }}
              >
                <div className="cs-card-back" />
                <span className="slab-wall top" aria-hidden="true" />
                <span className="slab-wall right" aria-hidden="true" />
                <span className="slab-wall bottom" aria-hidden="true" />
                <span className="slab-wall left" aria-hidden="true" />
                <div className="cs-card-inset">
                <div className="cs-card-grade">
                  <span className="grade-l mono">[FR-{(project.id || '').toUpperCase()}] · CASE FILE</span>
                  <span className="grade-c mono">MASTER FILE</span>
                  <span className="grade-r mono">{project.year}</span>
                </div>
                <div className="cs-card-title">
                  <div className="mono" style={{ color: 'var(--accent-live)', fontSize: 9, letterSpacing: '0.22em' }}>
                    ● 1 OF 1 · {project.year}
                  </div>
                  <h2>{project.title}</h2>
                  <div className="mono" style={{ color: 'var(--mute)', fontSize: 10, letterSpacing: '0.2em', marginTop: 4 }}>
                    {project.client} · {project.sequenceTag || project.tags[0]}
                  </div>
                </div>
                <div className="cs-card-tabs" ref={cardTabsRef}>
                  <button className={`cs-tab ${tab === 'about' ? 'active' : ''}`} onClick={() => setTab('about')}>
                    About
                  </button>
                  <button className={`cs-tab ${tab === 'gallery' ? 'active' : ''}`} onClick={() => setTab('gallery')}>
                    Gallery<span className="count">{project.gallery.length}</span>
                  </button>
                  <button className={`cs-tab ${tab === 'rd' ? 'active' : ''}`} onClick={() => setTab('rd')}>
                    R&amp;D<span className="count">{project.rd.length}</span>
                  </button>
                </div>
                <div className="cs-card-body">
                  {tab === 'about' && <AboutTab project={project} />}
                  {tab === 'gallery' && <GalleryTab project={project} />}
                  {tab === 'rd' && <RDTab project={project} />}
                </div>
                <div className="cs-card-foot">
                  <div>
                    <span className="lbl">CHANNEL</span>
                    <span className="val">{project.sequenceTag || project.tags[0]}</span>
                  </div>
                  <div>
                    <span className="lbl">YEAR</span>
                    <span className="val">{project.year}</span>
                  </div>
                  <div>
                    <span className="lbl accent">CLIENT</span>
                    <span className="val accent">{project.client}</span>
                  </div>
                </div>
                <div className="cs-card-glass" />
                </div>
                <span className="card-corner tl" />
                <span className="card-corner tr" />
                <span className="card-corner bl" />
                <span className="card-corner br" />
                <button
                  ref={cardCloseRef}
                  className="cs-card-close"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDetailsOpen(false);
                  }}
                  onClick={() => setDetailsOpen(false)}
                  aria-label="Close file"
                  type="button"
                >
                  ✕
                </button>
              </motion.div>
              </div>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
}
