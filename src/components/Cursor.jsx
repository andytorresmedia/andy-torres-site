// Cursor.jsx — context-aware custom cursor: a small dot plus a trailing ring,
// both following the mouse via rAF. Over an element with [data-cursor="..."] it
// expands into a label pill / play / drag puck (and reads [data-cursor-label]).
// Native cursor is hidden app-wide in overrides.css; touch devices hide this via
// the (hover: none) media query in cursor.css.

import { useEffect, useRef, useState, Fragment } from 'react';

export function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [variant, setVariant] = useState('default');
  const [label, setLabel] = useState('');

  useEffect(() => {
    let raf = null;
    let mx = -100;
    let my = -100;
    let rx = -100; // ring trails the dot
    let ry = -100;
    let curTarget = null;

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target && e.target.closest && e.target.closest('[data-cursor]');
      if (t !== curTarget) {
        curTarget = t;
        if (t) {
          setVariant(t.getAttribute('data-cursor') || 'default');
          setLabel(t.getAttribute('data-cursor-label') || '');
        } else {
          setVariant('default');
          setLabel('');
        }
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const hasLabel = (variant === 'view' || variant === 'link' || variant === 'drag') && label;
  const ringClasses = `cursor-ring ${variant !== 'default' ? 'over-target' : ''}`;

  return (
    <Fragment>
      <div ref={ringRef} className={ringClasses} aria-hidden="true" />
      <div ref={dotRef} className={`cursor cursor-${variant}`} aria-hidden="true">
        {hasLabel && <span className="cursor-label">{label}</span>}
      </div>
    </Fragment>
  );
}
