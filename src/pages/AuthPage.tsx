import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { AuthCard } from '../components/auth/AuthCard';
import { ArrowLeft, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
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

  const handleSuccess = () => {
    navigate(`/dashboard/${role || 'shipper'}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF4FF 50%, #F8FAFC 100%)' }}
    >
      {/* Background orbs */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6D4AFF 0%, transparent 70%)', filter: 'blur(90px)' }}
      />
      <div
        className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', filter: 'blur(100px)' }}
      />

      {/* ── Minimal Sticky Header ─────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-[#E5E7EB]"
        style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TruckLogo size="sm" />
            <span className="font-extrabold text-base tracking-tight text-[#111827]">CargoLoop</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#6D4AFF] border border-[#DDD6FE]">
              <Zap className="w-2.5 h-2.5" />
              AI
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D4AFF] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">View Features</span>
          </Link>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-5xl mx-auto px-4 py-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full">

          {/* Left: Value Proposition */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] text-[#6D4AFF] text-sm font-semibold">
                <Zap className="w-4 h-4 text-[#F97316]" />
                Page 2 · Portal Authentication
              </span>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111827] leading-tight">
                Sign in to{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #6D4AFF 0%, #8B5CF6 100%)' }}
                >
                  CargoLoop
                </span>
              </h1>
              <p className="text-[#6B7280] text-base leading-relaxed">
                Select your role portal and access the full suite of AI-powered logistics tools in one click.
              </p>
            </div>

            {/* Perks */}
            <div className="space-y-3">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-[#6D4AFF]" />
                  </div>
                  <span className="text-sm text-[#374151] font-medium">{perk}</span>
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#6B7280]">
                <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                Gemini 2.5 Flash Powered
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#6B7280]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                Supabase Auth & Database
              </div>
            </div>
          </motion.div>

          {/* Right: Auth Card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          >
            <AuthCard onSuccess={handleSuccess} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
