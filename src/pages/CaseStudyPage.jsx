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
  const stageRef = useRef(null);
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

  const showFrame = useCallback((updater) => {
    if (!items.length) return;
    setIdx((i) => (typeof updater === 'function' ? updater(i) : updater));
    setSmashKey((k) => k + 1);
  }, [items.length]);
  const prev = useCallback(() => {
    showFrame((i) => (i - 1 + items.length) % items.length);
  }, [showFrame, items.length]);
  const next = useCallback(() => {
    showFrame((i) => (i + 1) % items.length);
  }, [showFrame, items.length]);
  const handleGalleryWheelDelta = useCallback((deltaX, deltaY) => {
    if (items.length < 2) return;

    const primaryDelta = Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;
    if (Math.abs(primaryDelta) < 2) return false;

    const state = wheelStateRef.current;
    if (state.locked) return true;

    state.delta += primaryDelta;
    if (Math.abs(state.delta) < 48) {
      if (state.timeout) clearTimeout(state.timeout);
      state.timeout = setTimeout(() => {
        state.delta = 0;
        state.timeout = null;
      }, 180);
      return true;
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

    return true;
  }, [items.length, next, prev]);
  const onGalleryWheel = useCallback((e) => {
    if (!handleGalleryWheelDelta(e.deltaX, e.deltaY)) return;
    e.preventDefault();
    e.stopPropagation();
  }, [handleGalleryWheelDelta]);
  const onStagePointerDownCapture = (e) => {
    if (items.length < 2 || (e.button !== undefined && e.button !== 0)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const direction = galleryDirectionFromPoint(e.clientX, rect);
    if (!direction) return;

    const action = direction === 'prev' ? prev : next;
    e.preventDefault();
    e.stopPropagation();
    action();
  };
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const onGalleryNav = (event) => {
      if (event.detail?.direction === 'prev') prev();
      else next();
    };
    const onGalleryShow = (event) => {
      const index = event.detail?.index;
      if (typeof index === 'number') showFrame(index);
    };
    const onGalleryWheelProxy = (event) => {
      handleGalleryWheelDelta(event.detail?.deltaX || 0, event.detail?.deltaY || 0);
    };

    stage.addEventListener('wheel', onGalleryWheel, { passive: false });
    stage.addEventListener(GALLERY_NAV_EVENT, onGalleryNav);
    stage.addEventListener(GALLERY_SHOW_EVENT, onGalleryShow);
    stage.addEventListener(GALLERY_WHEEL_EVENT, onGalleryWheelProxy);
    return () => {
      stage.removeEventListener('wheel', onGalleryWheel);
      stage.removeEventListener(GALLERY_NAV_EVENT, onGalleryNav);
      stage.removeEventListener(GALLERY_SHOW_EVENT, onGalleryShow);
      stage.removeEventListener(GALLERY_WHEEL_EVENT, onGalleryWheelProxy);
    };
  }, [onGalleryWheel, prev, next, showFrame, handleGalleryWheelDelta]);
  const onPointerAction = (e, action) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    action();
  };
  const onKeyboardAction = (e, action) => {
    e.stopPropagation();
    if (e.detail === 0) action();
  };
  const cur = items[idx] || {};

  return (
    <div className="cs-gallery">
      <div
        ref={stageRef}
        className="cs-gallery-stage"
        style={{ '--bg-img': `url(${asset(cur.src)})` }}
        onPointerDownCapture={onStagePointerDownCapture}
      >
        <div className="cs-gallery-bg" />
        <div key={smashKey} className="cs-gallery-frame">
          <img src={asset(cur.src)} alt={cur.caption} />
          <div className="cs-gallery-flash" />
        </div>
        <button
          className="cs-gallery-half left"
          onPointerDown={(e) => onPointerAction(e, prev)}
          onClick={(e) => onKeyboardAction(e, prev)}
          aria-label="Previous"
          data-cursor="drag"
          data-cursor-label="Prev"
        >
          <span className="arr">
            <span className="arr-glyph">&larr;</span>
            <span className="arr-kicker">Prev</span>
          </span>
        </button>
        <button
          className="cs-gallery-half right"
          onPointerDown={(e) => onPointerAction(e, next)}
          onClick={(e) => onKeyboardAction(e, next)}
          aria-label="Next"
          data-cursor="drag"
          data-cursor-label="Next"
        >
          <span className="arr">
            <span className="arr-kicker">Next</span>
            <span className="arr-glyph">&rarr;</span>
          </span>
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
            onPointerDown={(e) => onPointerAction(e, () => showFrame(i))}
            onClick={(e) => onKeyboardAction(e, () => showFrame(i))}
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
const CONTROL_TILT_SCALE = 0.65;
const DEVICE_TILT_X = 7;
const DEVICE_TILT_Y = 8;
const DEVICE_TILT_RANGE = 24;
const CARD_TILT_SPRING = { stiffness: 160, damping: 24, mass: 0.7 };
const CARD_STABLE_TARGETS = 'button, a, input, textarea, select, [role="button"], [role="link"]';
const CARD_FREE_TILT_TARGETS = '.cs-gallery-stage, .cs-gallery-half';
const CARD_TOUCH_STABLE_TARGETS = `${CARD_STABLE_TARGETS}, .cs-card-body`;
const CARD_TABS = ['about', 'gallery', 'rd'];
const GALLERY_NAV_EVENT = 'frontrow:gallery-nav';
const GALLERY_SHOW_EVENT = 'frontrow:gallery-show';
const GALLERY_WHEEL_EVENT = 'frontrow:gallery-wheel';
const GALLERY_EDGE_HIT_RATIO = 1 / 3;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const isPointInRect = (clientX, clientY, rect, slack = 0) => (
  clientX >= rect.left - slack &&
  clientX <= rect.right + slack &&
  clientY >= rect.top - slack &&
  clientY <= rect.bottom + slack
);
const galleryDirectionFromPoint = (clientX, rect) => {
  const x = (clientX - rect.left) / rect.width;
  if (x <= GALLERY_EDGE_HIT_RATIO) return 'prev';
  if (x >= 1 - GALLERY_EDGE_HIT_RATIO) return 'next';
  return null;
};

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
  const [galleryHoverZone, setGalleryHoverZone] = useState('none');
  const videoRef = useRef(null);
  const cardTabsRef = useRef(null);
  const cardFloatRef = useRef(null);
  const cardBodyRef = useRef(null);
  const cardCloseRef = useRef(null);
  const cardHoverRectRef = useRef(null);
  const galleryHoverZoneRef = useRef('none');
  const orientationBaseRef = useRef(null);
  const touchDragRef = useRef(null);
  const touchInteractingRef = useRef(false);
  const detailsBtnRef = useRef(null);
  const dialogWasOpenRef = useRef(false);

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

  // Dialog focus management: move focus into the card (its close button) on open,
  // and restore it to the trigger when the card closes. Guarded so it never steals
  // focus on the initial page load (only after the dialog has actually been opened).
  useEffect(() => {
    if (detailsOpen) {
      dialogWasOpenRef.current = true;
      const raf = requestAnimationFrame(() => cardCloseRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
    if (dialogWasOpenRef.current) detailsBtnRef.current?.focus();
    return undefined;
  }, [detailsOpen]);

  // Focus trap: keep Tab / Shift+Tab inside the dialog while it's open, so aria-modal
  // is honest. Focusables are recomputed on each keypress because the active tab's
  // content (and thus its focusable elements) changes.
  useEffect(() => {
    if (!detailsOpen) return undefined;
    const root = cardFloatRef.current;
    if (!root) return undefined;
    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        root.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          last.focus();
          e.preventDefault();
        }
      } else if (active === last || !root.contains(active)) {
        first.focus();
        e.preventDefault();
      }
    };
    root.addEventListener('keydown', onKeyDown);
    return () => root.removeEventListener('keydown', onKeyDown);
  }, [detailsOpen]);

  useEffect(() => {
    if (detailsOpen) return;
    setGyroTiltActive(false);
    orientationBaseRef.current = null;
    cardHoverRectRef.current = null;
    touchDragRef.current = null;
    touchInteractingRef.current = false;
    galleryHoverZoneRef.current = 'none';
    setGalleryHoverZone('none');
    rxRaw.set(REST_RX);
    ryRaw.set(REST_RY);
  }, [detailsOpen, gyroTiltActive, rxRaw, ryRaw]);

  useEffect(() => {
    if (tab === 'gallery') return;
    galleryHoverZoneRef.current = 'none';
    setGalleryHoverZone('none');
  }, [tab]);

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

  useEffect(() => {
    if (!detailsOpen) return undefined;
    const wheelRoot = cardFloatRef.current;
    const body = cardBodyRef.current;
    if (!wheelRoot || !body) return undefined;

    const onContentWheel = (event) => {
      if (!(event.target instanceof Element)) return;

      if (tab === 'gallery') {
        const galleryStage = body.querySelector('.cs-gallery-stage');
        if (galleryStage && isPointInRect(event.clientX, event.clientY, galleryStage.getBoundingClientRect(), 24)) {
          event.preventDefault();
          event.stopPropagation();
          galleryStage.dispatchEvent(
            new CustomEvent(GALLERY_WHEEL_EVENT, {
              detail: { deltaX: event.deltaX, deltaY: event.deltaY },
            }),
          );
          return;
        }
      }

      if (event.target.closest('.cs-gallery-stage, .cs-gallery-thumbs')) return;
      if (body.scrollHeight <= body.clientHeight + 1) return;

      const primaryDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(primaryDelta) < 1) return;

      event.preventDefault();
      event.stopPropagation();
      body.scrollTop += primaryDelta;
    };

    wheelRoot.addEventListener('wheel', onContentWheel, { passive: false, capture: true });
    return () => wheelRoot.removeEventListener('wheel', onContentWheel, { capture: true });
  }, [detailsOpen, tab]);

  useEffect(() => {
    if (muxId || !videoRef.current) return undefined;
    const v = videoRef.current;
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    const t = setTimeout(tryPlay, 120);
    return () => clearTimeout(t);
  }, [muxId, project?.video]);

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
  const updateGalleryHoverZone = (zone) => {
    const nextZone = zone || 'none';
    if (galleryHoverZoneRef.current === nextZone) return;
    galleryHoverZoneRef.current = nextZone;
    setGalleryHoverZone(nextZone);
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

    if (tab === 'gallery') {
      const galleryStage = cardBodyRef.current?.querySelector('.cs-gallery-stage');
      const galleryThumbs = Array.from(cardBodyRef.current?.querySelectorAll('.cs-gallery-thumb') || []);
      if (galleryStage) {
        const thumbIndex = galleryThumbs.findIndex((thumb) => isPointInRect(e.clientX, e.clientY, thumb.getBoundingClientRect(), 8));
        if (thumbIndex >= 0) {
          galleryStage.dispatchEvent(
            new CustomEvent(GALLERY_SHOW_EVENT, {
              detail: { index: thumbIndex },
            }),
          );
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        const rect = galleryStage.getBoundingClientRect();
        const hitSlack = 14;
        const isGalleryHit = isPointInRect(e.clientX, e.clientY, rect, hitSlack);

        if (isGalleryHit) {
          const direction = galleryDirectionFromPoint(e.clientX, rect);
          if (!direction) return;

          galleryStage.dispatchEvent(
            new CustomEvent(GALLERY_NAV_EVENT, {
              detail: { direction },
            }),
          );
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    }

    // Tabs: map the pointer's SCREEN-space X across the tab strip's live bounding box
    // (getBoundingClientRect, consistent with clientX) and clamp to a tab index. The
    // old version mixed float-relative screen-x with inset-relative offsetLeft — the
    // ~16px chrome frame between those origins skewed the index and tipped near-edge
    // clicks into the wrong tab. We clamp (rather than require the point to land inside
    // a tab rect) so an edge click never misses once the tilt shifts the strip.
    const tabsEl = cardTabsRef.current;
    if (!tabsEl) return;

    const stripRect = tabsEl.getBoundingClientRect();
    if (!stripRect.width) return;
    const verticalSlack = 18;
    if (e.clientY < stripRect.top - verticalSlack || e.clientY > stripRect.bottom + verticalSlack) return;

    const frac = (e.clientX - stripRect.left) / stripRect.width;
    const index = clamp(Math.floor(frac * CARD_TABS.length), 0, CARD_TABS.length - 1);
    setTab(CARD_TABS[index]);
    e.preventDefault();
    e.stopPropagation();
  };

  const onCardMouseEnter = (e) => {
    cardHoverRectRef.current = readCardLayoutRect(e.currentTarget);
  };
  const onCardMouseMove = (e) => {
    if (tab === 'gallery') {
      const galleryStage = cardBodyRef.current?.querySelector('.cs-gallery-stage');
      if (galleryStage) {
        const rect = galleryStage.getBoundingClientRect();
        updateGalleryHoverZone(isPointInRect(e.clientX, e.clientY, rect, 14) ? galleryDirectionFromPoint(e.clientX, rect) : null);
      }
    }

    const rect = cardHoverRectRef.current || readCardLayoutRect(e.currentTarget);
    const scale = isCardStableTarget(e.target) ? CONTROL_TILT_SCALE : 1;
    setCardTiltFromPoint(e.clientX, e.clientY, rect, scale);
  };
  const onCardMouseLeave = () => {
    cardHoverRectRef.current = null;
    updateGalleryHoverZone(null);
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
    <div className={`cs-overlay ${loading ? 'is-loading' : ''} ${detailsOpen ? 'details-open' : ''}`} data-screen-label="Case Study">
      <div className="cs-video-wrap">
        {muxId ? (
          <MuxPlayer
            playbackId={muxId}
            streamType="on-demand"
            autoPlay="muted"
            loop
            muted
            accentColor="#ff5b1f"
            metadata={{ video_title: project.title }}
          />
        ) : (
          <video ref={videoRef} className="cs-video" src={asset(project.video)} autoPlay muted loop playsInline preload="auto" />
        )}
        <div className="cs-vignette" />
      </div>

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

          <button ref={detailsBtnRef} className="cs-details-btn" onClick={onDetailsButtonClick}>
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
                ref={cardFloatRef}
                className={`cs-card-float gallery-zone-${galleryHoverZone}`}
                role="dialog"
                aria-modal="true"
                aria-label={`${project.title} — project file`}
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
                <div className="cs-card-body" ref={cardBodyRef}>
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
