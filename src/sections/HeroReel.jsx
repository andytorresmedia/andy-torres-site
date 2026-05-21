// HeroReel.jsx — full-bleed hero reel behind the AI dot-wall.
// The reel is heavy (~16MB), so we defer loading it until after first paint via
// requestIdleCallback to protect LCP, then autoplay muted. No poster is set, so
// there is no poster-flash — the ink canvas + dot-wall sit behind it until play.

import { useState, useEffect, useRef } from 'react';
import { AIWall } from '../components/AIWall';
import { asset } from '../lib/assets';

function Timecode({ running = true, start = 0 }) {
  const [frame, setFrame] = useState(start);
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setFrame((f) => f + 1), 1000 / 24);
    return () => clearInterval(id);
  }, [running]);
  const total = frame;
  const ff = String(total % 24).padStart(2, '0');
  const ss = String(Math.floor(total / 24) % 60).padStart(2, '0');
  const mm = String(Math.floor(total / (24 * 60)) % 60).padStart(2, '0');
  const hh = String(Math.floor(total / (24 * 60 * 60))).padStart(2, '0');
  return (
    <span className="mono">
      {hh}:{mm}:{ss}:{ff}
    </span>
  );
}

export function HeroReel() {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    v.muted = true;
    let cancelled = false;
    let playTimer;

    const load = () => {
      const el = videoRef.current;
      if (cancelled || !el) return;
      el.preload = 'auto';
      el.play().catch(() => {});
      playTimer = setTimeout(() => {
        if (videoRef.current) videoRef.current.play().catch(() => {});
      }, 150);
    };

    const ric = window.requestIdleCallback;
    const handle = ric ? ric(load, { timeout: 1500 }) : setTimeout(load, 350);

    return () => {
      cancelled = true;
      clearTimeout(playTimer);
      if (ric && window.cancelIdleCallback) window.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, []);

  return (
    <section className="hero" data-screen-label="01 Hero Reel">
      <video
        ref={videoRef}
        className="hero-video"
        src={asset('assets/hero-reel.mp4')}
        muted
        loop
        playsInline
        preload="none"
      />
      <div className="hero-vignette" />

      {/* AI-labs dot wall — the "thin wall" the video plays behind */}
      <AIWall density="dense" intensity="soft" tinted />

      <div className="hero-grain" />

      <div className="hero-frame">
        <div className="hero-top-row">
          <div className="hero-tag">
            <span className="blip" />
            <span className="mono">REC · REEL 26 · MUTED LOOP</span>
          </div>
          <div className="mono" style={{ opacity: 0.8 }}>
            <Timecode />
          </div>
        </div>

        <div className="hero-center">
          <h1 className="hero-headline">
            FRONT&nbsp;ROW<span style={{ color: 'var(--accent-live)' }}>.</span>
          </h1>
        </div>

        <div className="hero-bottom">
          <div className="left">
            <div className="mono" style={{ opacity: 0.7, marginBottom: 6 }}>
              Featured · 2023 — 2026
            </div>
            <div className="mono-sm mono" style={{ opacity: 0.55 }}>
              NFL · NBA · NCAA · F1 · WWE · ESPN
            </div>
          </div>
          <div className="center">
            <div className="hero-scroll">
              <span className="mono">Scroll · 5 projects</span>
              <span className="arrow" />
            </div>
          </div>
          <div className="right">
            <div className="mono" style={{ opacity: 0.7, marginBottom: 6 }}>
              Reel runtime
            </div>
            <div className="mono-lg mono">00:00:30:00</div>
          </div>
        </div>
      </div>
    </section>
  );
}
