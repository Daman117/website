import React from 'react';
import { Platform, Architecture } from './Landing';

const PlatformPage: React.FC = () => (
  <main className="u-pt-80">
    <div className="lp-body">
      <Platform />
      <Architecture />
    </div>
  </main>
);

export default PlatformPage;
