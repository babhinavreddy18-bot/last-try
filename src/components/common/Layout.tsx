import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';

export const Layout: React.FC = () => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col font-sans relative text-[#111827]"
      style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF4FF 50%, #F8FAFC 100%)' }}
    >
      {/* Very subtle animated hero orbs */}
      <div
        className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, #6D4AFF 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Fixed Top Navbar (height: 72px) */}
      <Navbar
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Layout Container Shell */}
      <div className="flex flex-1 w-full h-full relative z-10 overflow-hidden">
        {/* Fixed Left Sidebar (width: 320px) */}
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area
            - Positioned directly below 72px navbar (mt-[72px])
            - Positioned directly right of 320px sidebar (md:ml-[320px])
            - Resized to remaining viewport space (md:w-[calc(100vw-320px)])
            - Occupies remaining height (h-[calc(100vh-72px)])
            - Consistent 24px padding (p-6)
            - Overflow-y-auto for content-only scrolling
        */}
        <div className="mt-[72px] md:ml-[320px] w-full md:w-[calc(100vw-320px)] h-[calc(100vh-72px)] overflow-y-auto p-6">
          <main className="w-full max-w-7xl mx-auto space-y-6">
            <Outlet />
          </main>
        </div>
      </div>

      <AICopilotDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
    </div>
  );
};

