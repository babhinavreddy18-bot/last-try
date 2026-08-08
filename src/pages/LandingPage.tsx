import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Database, RotateCcw, FileCheck, MapPin,
  TrendingUp, ShieldAlert, Bot, ArrowRight, ShieldCheck,
  Truck, CheckCircle2, Award, Building2, UserCheck, ChevronRight, ChevronDown, Zap,
  Mail, Headphones, Briefcase, Handshake
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { TruckLogo } from '../components/common/TruckLogo';
import { ThemeToggle } from '../components/common/ThemeToggle';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoToAuth = (role?: string) => {
    navigate(role ? `/auth?role=${role}` : '/auth');
  };

  const featureCards = [
    {
      id: 'nlp-pricing',
      title: 'Natural Language Freight Creator',
      category: 'AI Logistics Parsing',
      icon: <Sparkles className="w-6 h-6" />,
      badge: 'Gemini 2.5 Flash',
      badgeVariant: 'orange' as const,
      description: 'Enter plain text like "12 tons frozen food Mumbai→Pune" to instantly extract cargo parameters, temperature requirements, and route pricing.',
    },
    {
      id: 'erp-wms',
      title: 'ERP & WMS Data Sharing Hub',
      category: 'Enterprise Integration',
      icon: <Database className="w-6 h-6" />,
      badge: 'Bi-Directional Sync',
      badgeVariant: 'purple' as const,
      description: 'Zero-code pipelines for SAP S/4HANA, Oracle NetSuite, Manhattan WMS, Tally Prime, and Govt GST e-Waybill portal.',
    },
    {
      id: 'return-load',
      title: 'AI Return Load Matcher',
      category: 'Route Optimization',
      icon: <RotateCcw className="w-6 h-6" />,
      badge: '0% Deadhead Miles',
      badgeVariant: 'green' as const,
      description: 'GPS proximity matching that finds high-payout return cargoes for drivers upon destination arrival, reducing empty miles by 34%.',
    },
    {
      id: 'doc-scanner',
      title: 'AI Document Verification',
      category: 'Compliance & OCR',
      icon: <FileCheck className="w-6 h-6" />,
      badge: 'OCR Trust Engine',
      badgeVariant: 'orange' as const,
      description: 'Instant document scanning and AI trust scoring for Driver License, RC, Insurance, and PUC certificates.',
    },
    {
      id: 'live-telemetry',
      title: 'Live Route Telemetry & Maps',
      category: 'Real-Time Tracking',
      icon: <MapPin className="w-6 h-6" />,
      badge: 'Real-Time GPS',
      badgeVariant: 'purple' as const,
      description: 'Interactive Leaflet maps with real-time vehicle positions, speed telemetry, temperature monitoring, and turn-by-turn navigation.',
    },
    {
      id: 'dynamic-pricing',
      title: 'Dynamic AI Pricing & ESG Hub',
      category: 'Rate Intelligence & ESG',
      icon: <TrendingUp className="w-6 h-6" />,
      badge: 'ESG Carbon Score',
      badgeVariant: 'green' as const,
      description: 'AI-backed spot rate benchmarks with interactive carbon emissions calculator for green fleet efficiency and ESG compliance.',
    },
    {
      id: 'security-telemetry',
      title: 'AI Security Risk Monitor',
      category: 'System Protection',
      icon: <ShieldAlert className="w-6 h-6" />,
      badge: 'Fraud Detection',
      badgeVariant: 'orange' as const,
      description: 'Continuous automated risk auditing flagging route deviations, driver credential mismatches, and system tampering in real time.',
    },
    {
      id: 'copilot-agent',
      title: 'CargoLoop 24/7 AI Copilot',
      category: 'Conversational Assistant',
      icon: <Bot className="w-6 h-6" />,
      badge: '24/7 Gemini AI',
      badgeVariant: 'orange' as const,
      description: 'Always-on conversational AI answering queries about rate benchmarks, driver compliance, route traffic, and carbon metrics.',
    },
  ];

  const rolePortals = [
    {
      role: 'shipper',
      title: 'Shipper AI Logistics Hub',
      icon: <Truck className="w-5 h-5" />,
      description: 'Book cargo via NLP, dynamic pricing & bi-directional ERP/WMS data sharing.',
      color: '#6D4AFF',
    },
    {
      role: 'driver',
      title: 'Driver Companion App',
      icon: <UserCheck className="w-5 h-5" />,
      description: 'Turn-by-turn navigation, OCR document scanner & AI return load matcher.',
      color: '#22C55E',
    },
    {
      role: 'fleet',
      title: 'Fleet Command Center',
      icon: <Building2 className="w-5 h-5" />,
      description: 'Multi-truck telemetry, AI capacity predictor & ESG carbon sustainability hub.',
      color: '#F97316',
    },
    {
      role: 'admin',
      title: 'Admin Risk & Telemetry',
      icon: <ShieldCheck className="w-5 h-5" />,
      description: 'Network node health, anti-tampering fraud alerts & security audit logs.',
      color: '#EF4444',
    },
  ];

  const stats = [
    { label: 'On-Time Speed', value: '99.8%' },
    { label: 'Avg Freight Savings', value: '14.2%' },
    { label: 'ERP/WMS Systems', value: '6 Live' },
    { label: 'Empty Miles Saved', value: '34%' },
  ];

  return (
    <div
      className="min-h-screen relative"
      style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF4FF 50%, #F8FAFC 100%)' }}
    >
      {/* Subtle background orbs */}
      <div
        className="fixed top-0 right-0 w-[700px] h-[700px] rounded-full opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6D4AFF 0%, transparent 70%)', filter: 'blur(100px)' }}
      />
      <div
        className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', filter: 'blur(120px)' }}
      />

      {/* ── Minimal Sticky Header ─────────────────────────────── */}
      <header
        className="sticky top-0 z-30 border-b border-[#E5E7EB]"
        style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TruckLogo size="sm" />
            <span className="font-extrabold text-base tracking-tight text-[#111827]">CargoLoop</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#6D4AFF] border border-[#DDD6FE]">
              <Zap className="w-2.5 h-2.5" />
              AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/auth"
              className="btn-purple text-sm py-2 px-6"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Fixed Floating "Scroll to Explore" Indicator ─────────────────── */}
      <AnimatePresence>
        {showScrollIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
          >
            <button
              onClick={() => {
                document.getElementById('features-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#DDD6FE] hover:border-[#6D4AFF] shadow-[0_4px_20px_rgba(109,74,255,0.18)] hover:shadow-[0_6px_25px_rgba(109,74,255,0.28)] transition-all cursor-pointer"
            >
              <span className="text-xs font-extrabold tracking-wide text-[#4B5563] group-hover:text-[#6D4AFF] transition-colors">
                Scroll to Explore
              </span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <ChevronDown className="w-4 h-4 text-[#6D4AFF]" />
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

        {/* ═══ HERO ══════════════════════════════════════════════ */}
        <motion.div
          className="text-center space-y-8 pt-8 relative"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] text-[#6D4AFF] text-sm font-semibold">
              <Zap className="w-4 h-4 text-[#F97316]" />
              Autonomous AI Supply Chain Network
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#111827] leading-none"
          >
            Freight Intelligence,{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #6D4AFF 0%, #8B5CF6 100%)' }}
            >
              Reinvented.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-[#6B7280] font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Discover all 8 core AI modules engineered to automate freight booking, ERP/WMS data pipelines, driver compliance, return load matching, and real-time route telemetry.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleGoToAuth()}
              className="btn-purple text-sm py-3.5 px-8"
            >
              <span>Launch Enterprise Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#features-grid"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-outline text-sm py-3.5 px-8"
            >
              <span>Explore All Features</span>
              <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-[#E5E7EB] text-center"
              >
                <p className="text-2xl font-black text-[#6D4AFF]">{s.value}</p>
                <p className="text-xs text-[#6B7280] font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ═══ FEATURE CARDS (Smooth Viewport Fade-In & Slide-Up) ════════════════ */}
        <motion.div
          id="features-grid"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 scroll-mt-24"
        >
          <div className="text-center space-y-3">
            <Badge variant="orange" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              8 Enterprise AI Features
            </Badge>
            <h2 className="text-4xl font-black text-[#111827] tracking-tight">
              Complete Feature Suite
            </h2>
            <p className="text-[#6B7280] text-base max-w-xl mx-auto">
              Explore all integrated modules powering Shippers, Drivers, Fleet Owners, and Admins.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
          >
            {featureCards.map((feat) => (
              <motion.div
                key={feat.id}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-3xl p-6 border border-[#E5E7EB] flex flex-col justify-between space-y-4 group cursor-default"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(109,74,255,0.04)' }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#6D4AFF] group-hover:scale-110 transition-transform duration-200">
                      {feat.icon}
                    </div>
                    <Badge variant={feat.badgeVariant} size="sm">{feat.badge}</Badge>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                      {feat.category}
                    </span>
                    <h3 className="font-bold text-[#111827] text-[15px] mt-1 leading-snug group-hover:text-[#6D4AFF] transition-colors">
                      {feat.title}
                    </h3>
                  </div>

                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F3F4F6] flex items-center gap-1.5 text-xs text-[#6D4AFF] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  <span>Active & Fully Live</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ═══ ROLE PORTALS (Smooth Viewport Fade-In & Slide-Up) ════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="text-center space-y-3">
            <Badge variant="purple" icon={<Award className="w-3.5 h-3.5" />}>
              4 Specialized Role Interfaces
            </Badge>
            <h2 className="text-4xl font-black text-[#111827] tracking-tight">
              Your Role. Your Portal.
            </h2>
            <p className="text-[#6B7280] text-base max-w-xl mx-auto">
              CargoLoop provides tailored interfaces optimized for every supply chain stakeholder.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
          >
            {rolePortals.map((p) => (
              <motion.div
                key={p.role}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.18 }}
                onClick={() => handleGoToAuth(p.role)}
                className="bg-white rounded-3xl p-6 border border-[#E5E7EB] cursor-pointer flex flex-col justify-between space-y-5 group"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(109,74,255,0.04)' }}
              >
                <div className="space-y-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 duration-200"
                    style={{ background: `${p.color}18`, color: p.color }}
                  >
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827] text-[15px] group-hover:text-[#6D4AFF] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed mt-1">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: p.color }}
                >
                  <span>Log in as {p.role}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ═══ CTA BANNER ══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl p-10 sm:p-14 overflow-hidden text-center space-y-6"
          style={{ background: 'linear-gradient(135deg, #6D4AFF 0%, #8B5CF6 100%)' }}
        >
          {/* Orb */}
          <div
            className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)', filter: 'blur(60px)' }}
          />

          <div className="relative z-10 space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-sm font-semibold">
              <Zap className="w-4 h-4 text-[#F97316]" />
              Ready to automate your freight operations?
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Start using CargoLoop today.
            </h3>
            <p className="text-white/75 text-base max-w-md mx-auto">
              Sign in to your account or register a new enterprise workspace in seconds.
            </p>
            <button
              onClick={() => handleGoToAuth()}
              className="inline-flex items-center gap-2 bg-white text-[#6D4AFF] font-bold text-sm py-3.5 px-8 rounded-full transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <span>Go to Log In Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

      </div>

      {/* ═══ FOOTER SECTION ════════════════════════════════════════ */}
      <motion.footer
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="bg-white border-t border-[#E5E7EB] relative z-10 text-[#111827] mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 space-y-16">

          {/* 3-Column Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

            {/* LEFT SECTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <TruckLogo size="sm" />
                <span className="font-black text-xl tracking-tight text-[#111827]">CargoLoop</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#6D4AFF] border border-[#DDD6FE]">
                  <Zap className="w-2.5 h-2.5" />
                  AI
                </span>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed font-normal">
                AI-powered logistics intelligence platform connecting shippers, carriers, and fleet operators through smart automation, predictive analytics, and real-time freight optimization.
              </p>
            </div>

            {/* CENTER SECTION */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-[#111827] tracking-tight">
                Quick Links
              </h4>
              <ul className="grid grid-cols-2 gap-2.5 text-sm text-[#6B7280]">
                {[
                  { label: 'About Us', href: '#' },
                  { label: 'Features', href: '#features-grid' },
                  { label: 'Pricing', href: '#' },
                  { label: 'Solutions', href: '#' },
                  { label: 'Privacy Policy', href: '#' },
                  { label: 'Terms & Conditions', href: '#' },
                  { label: 'Contact Us', href: '#contact-section' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-[#6D4AFF] hover:translate-x-1 transition-all duration-200 inline-block font-medium cursor-pointer"
                    >
                      • {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT SECTION */}
            <div id="contact-section" className="space-y-4">
              <h4 className="text-base font-bold text-[#111827] tracking-tight">
                Contact Us
              </h4>
              <div className="space-y-2 text-sm">
                <a
                  href="mailto:support@cargoloop.ai"
                  className="flex items-center gap-3 p-2 rounded-xl text-[#6B7280] hover:text-[#6D4AFF] hover:bg-[#F5F3FF] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#6D4AFF] group-hover:scale-105 transition-transform">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Support</p>
                    <p className="font-semibold text-[#111827] group-hover:text-[#6D4AFF] transition-colors">support@cargoloop.ai</p>
                  </div>
                </a>

                <a
                  href="mailto:business@cargoloop.ai"
                  className="flex items-center gap-3 p-2 rounded-xl text-[#6B7280] hover:text-[#6D4AFF] hover:bg-[#F5F3FF] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#6D4AFF] group-hover:scale-105 transition-transform">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Business</p>
                    <p className="font-semibold text-[#111827] group-hover:text-[#6D4AFF] transition-colors">business@cargoloop.ai</p>
                  </div>
                </a>

                <a
                  href="mailto:sales@cargoloop.ai"
                  className="flex items-center gap-3 p-2 rounded-xl text-[#6B7280] hover:text-[#6D4AFF] hover:bg-[#F5F3FF] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#6D4AFF] group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Sales</p>
                    <p className="font-semibold text-[#111827] group-hover:text-[#6D4AFF] transition-colors">sales@cargoloop.ai</p>
                  </div>
                </a>

                <a
                  href="mailto:partners@cargoloop.ai"
                  className="flex items-center gap-3 p-2 rounded-xl text-[#6B7280] hover:text-[#6D4AFF] hover:bg-[#F5F3FF] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#6D4AFF] group-hover:scale-105 transition-transform">
                    <Handshake className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Partnerships</p>
                    <p className="font-semibold text-[#111827] group-hover:text-[#6D4AFF] transition-colors">partners@cargoloop.ai</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* SOCIAL MEDIA SECTION */}
          <div className="pt-8 border-t border-[#F3F4F6] text-center space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">
              Follow Us
            </h4>
            <div className="flex items-center justify-center gap-3">
              {[
                {
                  name: 'LinkedIn',
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
                    </svg>
                  ),
                  href: 'https://linkedin.com',
                },
                {
                  name: 'X (Twitter)',
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                  href: 'https://x.com',
                },
                {
                  name: 'Instagram',
                  icon: (
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  ),
                  href: 'https://instagram.com',
                },
                {
                  name: 'YouTube',
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                  href: 'https://youtube.com',
                },
                {
                  name: 'Facebook',
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                  href: 'https://facebook.com',
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className="w-10 h-10 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#6D4AFF] hover:bg-[#F5F3FF] hover:border-[#DDD6FE] hover:scale-110 transition-all duration-200 cursor-pointer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="pt-8 border-t border-[#E5E7EB] text-center text-xs text-[#6B7280] space-y-1.5 font-medium">
            <p>© 2026 CargoLoop. All rights reserved.</p>
            <p>
              Developed by{' '}
              <span
                className="bg-clip-text text-transparent font-bold"
                style={{ backgroundImage: 'linear-gradient(135deg, #6D4AFF 0%, #8B5CF6 100%)' }}
              >
                Code Conquerers
              </span>
            </p>
          </div>

        </div>
      </motion.footer>
    </div>
  );
};
