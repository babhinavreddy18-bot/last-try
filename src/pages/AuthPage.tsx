import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { AuthCard } from '../components/auth/AuthCard';
import type { UserRole } from '../types';
import { ArrowLeft, Sparkles, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TruckLogo } from '../components/common/TruckLogo';

const perks = [
  'AI-powered freight booking via natural language',
  'Real-time GPS telemetry & interactive maps',
  'OCR document verification for compliance',
  'ESG carbon hub & dynamic pricing engine',
  'AI Return Load Matcher — 0% empty miles',
  '24/7 Gemini AI Logistics Copilot',
];

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const handleSuccess = (targetRole?: UserRole) => {
    const destinationRole = targetRole || role || 'shipper';
    navigate(`/dashboard/${destinationRole}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] relative flex flex-col lg:flex-row overflow-x-hidden font-sans">
      
      {/* ── LEFT HERO SECTION (Cinematic Truck Sunset Background) ─────────────── */}
      <div className="relative flex-1 lg:w-[54%] min-h-[480px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden">
        
        {/* Background Cargo Truck Image */}
        <img
          src="/images/cargoloop_truck_sunset.png"
          alt="CargoLoop Sunset Semi-Truck"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 scale-105"
        />

        {/* Ambient Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#1E1B4B]/75 to-[#6D4AFF]/30 mix-blend-multiply z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-transparent to-[#0F172A]/50 z-1" />

        {/* Header Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <TruckLogo size="sm" />
            </div>
            <span className="font-black text-xl tracking-tight text-white drop-shadow-md">
              CargoLoop
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#EDE9FE]/90 text-[#6D4AFF] border border-[#DDD6FE] shadow-sm backdrop-blur-md">
              <Zap className="w-2.5 h-2.5 fill-[#6D4AFF]" />
              AI
            </span>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C084FC]" />
            <span>View Features</span>
          </Link>
        </div>

        {/* Hero Body Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 my-auto py-8 space-y-6 max-w-xl"
        >
          {/* Page 2 Portal Authentication Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE9FE]/95 backdrop-blur-md border border-[#DDD6FE] text-[#6D4AFF] text-xs font-extrabold shadow-md">
            <Zap className="w-3.5 h-3.5 text-[#F97316] fill-[#F97316]" />
            <span>Page 2 · Portal Authentication</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-lg">
            Sign in to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#C084FC] to-[#8B5CF6]">
              CargoLoop
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium drop-shadow-sm max-w-lg">
            Select your role portal and access the full suite of AI-powered logistics tools in one click.
          </p>

          {/* Checklist Perks */}
          <div className="space-y-2.5 pt-2">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#6D4AFF]/30 border border-[#C084FC]/50 backdrop-blur-md flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C084FC]" />
                </div>
                <span className="text-xs sm:text-sm text-slate-100 font-semibold drop-shadow-xs">{perk}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Glassmorphism Badges */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 pt-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Gemini 2.5 Flash Powered</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Supabase Auth & Database</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT AUTHENTICATION CARD SECTION ───────────────────────────────── */}
      <div
        className="flex-1 lg:w-[46%] min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-20"
        style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 50%, #F1F5F9 100%)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="w-full max-w-md"
        >
          <AuthCard onSuccess={handleSuccess} />
        </motion.div>
      </div>

    </div>
  );
};
