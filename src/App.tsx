/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing');

  return (
    <div className="min-h-screen bg-dark-bg text-white selection:bg-neon-cyan selection:text-black">
      {currentPage === 'landing' ? (
        <LandingPage onEnterApp={() => setCurrentPage('dashboard')} />
      ) : (
        <Dashboard onLogout={() => setCurrentPage('landing')} />
      )}
    </div>
  );
}
