import React from 'react';
import { Platform, Architecture } from './LandingPage';

const PlatformPage: React.FC = () => (
  <main style={{ paddingTop: '80px' }}>
    <div className="lp-body">
      <Platform />
      <Architecture />
    </div>
  </main>
);

export default PlatformPage;
