// HomePage.jsx — composes the home panel.
import { Fragment } from 'react';
import { HeroReel } from '../sections/HeroReel';
import { StickySequence } from '../sections/StickySequence';
import { Clients, Press, Services } from '../sections/HomeSections';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';

export function HomePage() {
  return (
    <Fragment>
      <HeroReel />
      <StickySequence />
      <Clients />
      <Press />
      <Services />
      <CTA />
      <Footer />
    </Fragment>
  );
}
