import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';
import { LiveTruckBackground } from './LiveTruckBackground';

export const Layout: React.FC = () => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#0C0D14] text-white">
      {/* Live Moving 3D Trucks Background */}
      <LiveTruckBackground />

      {/* App content layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onOpenCopilot={() => setIsCopilotOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <div className="flex flex-1">
          <Sidebar
            isMobileMenuOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
          <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>

        <AICopilotDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
      </div>
    </div>
  );
};

