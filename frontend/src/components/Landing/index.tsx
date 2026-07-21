/**
 * Landing/ — entire home page, split by section
 *
 * Sections (top → bottom):
 *   Hero · DemoSection · Stats · WorkflowSection · CapabilitySection ·
 *   Industries · PlatformSection · ArchitectureSection · BusinessImpact ·
 *   Security · CaseStudySection · Resources · Principles · CTA
 */
import React from 'react';
import Hero from './Hero';
import DemoSection from './DemoSection';
import Stats from './Stats';
import WorkflowSection from './WorkflowSection';
import CapabilitySection from './CapabilitySection';
import Industries from './Industries';
import { PlatformSection } from './PlatformSection';
import { ArchitectureSection } from './ArchitectureSection';
import BusinessImpact from './BusinessImpact';
import Security from './Security';
import CaseStudySection from './CaseStudySection';
import Resources from './Resources';
import { Principles } from './Principles';
import CTA from './CTA';

interface LandingPageProps {
  onOpenContact: (source?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onOpenContact }) => (
  <main>
    <Hero onOpenContact={onOpenContact} />
    {/* Opaque from here down — the hero's photo is pinned to the viewport
        (position: fixed), so everything below needs a solid background to
        cover it as it scrolls up, instead of letting it bleed through. */}
    <div className="lp-body">
      <DemoSection />
      <Stats />
      <WorkflowSection />
      <CapabilitySection />
      <Industries />
      <BusinessImpact />
      <Security />
      <CaseStudySection />
      <Resources onOpenContact={onOpenContact} />
      <Principles />
      <CTA onOpenContact={onOpenContact} />
    </div>
  </main>
);

export default LandingPage;
export { PlatformSection as Platform, ArchitectureSection as Architecture, Principles };
