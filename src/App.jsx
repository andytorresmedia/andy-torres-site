// App.jsx — Front Row application shell.
// react-router routes with a horizontal page-slide transition (AnimatePresence).
// The body is locked (pages.css); each route is an absolutely-positioned panel
// that slides in from the right on enter and out to the left on exit, and scrolls
// internally. Nav / Cursor / CmdK persist across routes (outside the stage).

import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';

import { Cursor } from './components/Cursor';
import { Nav } from './components/Nav';
import { CmdK } from './components/CmdK';
import { PageScrollContext } from './lib/pageScroll';

import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { CaseStudyPage } from './pages/CaseStudyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

const TRANSITION = { duration: 0.62, ease: [0.83, 0, 0.17, 1] };

function Page({ children }) {
  const scrollRef = useRef(null);
  return (
    <motion.div
      ref={scrollRef}
      className="fr-page"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={TRANSITION}
    >
      <PageScrollContext.Provider value={scrollRef}>
        {children}
      </PageScrollContext.Provider>
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const [transitioning, setTransitioning] = useState(false);

  // Freeze panel scroll/pointer-events briefly while the slide plays.
  useEffect(() => {
    setTransitioning(true);
    const t = setTimeout(() => setTransitioning(false), 680);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className={clsx('fr-stage', transitioning && 'is-transitioning')}>
      <AnimatePresence initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><HomePage /></Page>} />
          <Route path="/work" element={<Page><WorkPage /></Page>} />
          <Route path="/work/:slug" element={<Page><CaseStudyPage /></Page>} />
          <Route path="/about" element={<Page><AboutPage /></Page>} />
          <Route path="/contact" element={<Page><ContactPage /></Page>} />
          <Route path="*" element={<Page><HomePage /></Page>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <CmdK />
      <Nav />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
