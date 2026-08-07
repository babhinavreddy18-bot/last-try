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

      {/* Fixed Top Navbar */}
      <Navbar
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Layout Wrapper: Fixed Left Navbar + Content Area */}
      <div className="flex flex-1 pt-16 relative z-10">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 md:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
          <Outlet />
        </main>
      </div>

      <AICopilotDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
    </div>
  );
};

