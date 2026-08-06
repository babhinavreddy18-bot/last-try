import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';
import { LiveTruckBackground } from './LiveTruckBackground';

export const Layout: React.FC = () => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #0D1525 40%, #0A1628 70%, #06111E 100%)' }}>

      {/* Live animated truck background */}
      <LiveTruckBackground />

      {/* Ambient glow orbs */}
      <div className="bg-orb-1" />
      <div className="bg-orb-2" />
      <div className="bg-orb-3" />
      <div className="bg-orb-4" />

      {/* Grid overlay */}
      <div className="bg-grid-overlay" />

      {/* App content — sits above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onOpenCopilot={() => setIsCopilotOpen(true)} />

        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>

        <AICopilotDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
      </div>
    </div>
  );
};
