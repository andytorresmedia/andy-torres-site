// AIWall.jsx — reusable AI-labs dot-grid overlay.
// A dim dot grid with a cursor-following radial brighten mask (driven by the
// --cx/--cy CSS custom properties). No pulses — the brightening tracks the
// cursor within the parent element. Used on the hero, sticky sequence, work-row
// thumbnails, and the about hero/philosophy/capabilities sections.

import { useEffect, useRef } from 'react';
import clsx from 'clsx';

export function AIWall({
  variant = '',
  density = '',
  intensity = '',
  tinted = false,
  hover = false,
  hoverOn = false,
  scanline = false,
  interactive = true,
  stealth = false,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!interactive) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const parent = el.parentElement;
    if (!parent) return undefined;
    let raf = null;

    const onMove = (e) => {
      const rect = parent.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--cx', `${x}%`);
        el.style.setProperty('--cy', `${y}%`);
      });
    };
    const onLeave = () => {
      el.style.setProperty('--cx', '50%');
      el.style.setProperty('--cy', '50%');
    };

    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);
    return () => {
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [interactive]);

  const cls = clsx(
    'ai-wall',
    variant,
    density && `aw-${density}`,
    intensity && `aw-${intensity}`,
    tinted && 'aw-tinted',
    hover && 'aw-hover',
    hover && hoverOn && 'on',
    interactive && 'aw-interactive',
    stealth && 'aw-stealth',
  );

  return (
    <div className={cls} ref={ref} aria-hidden="true">
      <div className="aw-grid" />
      {scanline && <div className="aw-scanline" />}
    </div>
  );
}
