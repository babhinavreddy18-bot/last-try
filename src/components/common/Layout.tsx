import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';

export const Layout: React.FC = () => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col font-sans relative text-[#111827]"
      style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF4FF 50%, #F8FAFC 100%)' }}
    >
      {/* Subtle floating ambient background glow elements */}
      <div
        className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none z-0 animate-float-orb"
        style={{
          background: 'radial-gradient(circle, #6D4AFF 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none z-0 animate-float-orb"
        style={{
          background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
          filter: 'blur(100px)',
          animationDelay: '4s',
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

        {/* Main Content Area with Smooth Route Transitions */}
        <div className="mt-[72px] md:ml-[320px] w-full md:w-[calc(100vw-320px)] h-[calc(100vh-72px)] overflow-y-auto p-6 scroll-smooth">
          <main className="w-full max-w-7xl mx-auto space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full space-y-6"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AICopilotDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
    </div>
  );
};

