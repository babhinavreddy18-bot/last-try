import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Database, RotateCcw, FileCheck, MapPin,
  TrendingUp, ShieldAlert, Bot, ArrowRight, ShieldCheck,
  Truck, CheckCircle2, Award, Building2, UserCheck, ChevronRight
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToAuth = (role?: string) => {
    if (role) {
      navigate(`/auth?role=${role}`);
    } else {
      navigate('/auth');
    }
  };

  const featureCards = [
    {
      id: 'nlp-pricing',
      title: 'Natural Language Freight Creator',
      category: 'AI Logistics Parsing',
      icon: <Sparkles className="w-6 h-6 text-[#2563EB]" />,
      badge: 'Gemini 2.5 Flash',
      description:
        'Enter plain text or voice instructions like "12 tons of frozen food from Mumbai to Pune" to instantly extract cargo parameters, temperature requirements, and route pricing.',
    },
    {
      id: 'erp-wms',
      title: 'ERP & WMS Automated Data Sharing Hub',
      category: 'Enterprise Integration',
      icon: <Database className="w-6 h-6 text-[#2563EB]" />,
      badge: 'Bi-Directional Webhooks',
      description:
        'Seamless zero-code data pipelines connecting SAP S/4HANA, Oracle NetSuite, Manhattan WMS, Infor WMS, Tally Prime, and Govt GST e-Waybill portal.',
    },
    {
      id: 'return-load',
      title: 'AI Return Load Matcher (Deadhead Engine)',
      category: 'Route Optimization',
      icon: <RotateCcw className="w-6 h-6 text-[#2563EB]" />,
      badge: '0% Empty Return Miles',
      description:
        'Intelligent GPS proximity matching that finds high-payout return cargoes for drivers upon destination arrival, reducing empty miles by up to 34%.',
    },
    {
      id: 'doc-scanner',
      title: 'AI Document Verification Center',
      category: 'Compliance & OCR',
      icon: <FileCheck className="w-6 h-6 text-[#2563EB]" />,
      badge: 'Gemini OCR Trust Engine',
      description:
        'Instant mobile camera document scanning and AI trust scoring for Driver License, Vehicle RC, Insurance policy, and PUC certificates.',
    },
    {
      id: 'live-telemetry',
      title: 'Live Interactive Route Telemetry & Maps',
      category: 'Real-Time Tracking',
      icon: <MapPin className="w-6 h-6 text-[#2563EB]" />,
      badge: 'Real-Time GPS',
      description:
        'Interactive Leaflet maps featuring real-time vehicle positions, speed telemetry, temperature monitoring, and turn-by-turn route navigation.',
    },
    {
      id: 'dynamic-pricing',
      title: 'Dynamic AI Pricing & ESG Carbon Hub',
      category: 'Rate Intelligence & Sustainability',
      icon: <TrendingUp className="w-6 h-6 text-[#2563EB]" />,
      badge: 'ESG Carbon Score',
      description:
        'AI-backed spot rate benchmarks and interactive carbon emissions calculator predicting fuel savings, CO2 reduction, and green fleet efficiency.',
    },
    {
      id: 'security-telemetry',
      title: 'AI Security & Anti-Tampering Risk Monitor',
      category: 'System Protection',
      icon: <ShieldAlert className="w-6 h-6 text-[#2563EB]" />,
      badge: 'Fraud Detection',
      description:
        'Continuous automated risk auditing flagging route deviations, driver credential mismatches, and system tampering in real time.',
    },
    {
      id: 'copilot-agent',
      title: 'CargoLoop 24/7 AI Logistics Copilot',
      category: 'Conversational Assistant',
      icon: <Bot className="w-6 h-6 text-[#2563EB]" />,
      badge: '24/7 Gemini Assistant',
      description:
        'Always-on conversational AI assistant answering complex queries about rate benchmarks, driver compliance, route traffic, and carbon metrics.',
    },
  ];

  const rolePortals = [
    {
      role: 'shipper',
      title: 'Shipper AI Logistics Hub',
      icon: <Truck className="w-5 h-5 text-[#2563EB]" />,
      description: 'Book cargo via NLP, dynamic pricing & bi-directional ERP/WMS data sharing.',
    },
    {
      role: 'driver',
      title: 'Driver Companion App',
      icon: <UserCheck className="w-5 h-5 text-[#2563EB]" />,
      description: 'Turn-by-turn turn navigation, OCR document scanner & AI return load matcher.',
    },
    {
      role: 'fleet',
      title: 'Fleet Command Center',
      icon: <Building2 className="w-5 h-5 text-[#2563EB]" />,
      description: 'Multi-truck telemetry, AI capacity predictor & ESG carbon sustainability hub.',
    },
    {
      role: 'admin',
      title: 'Admin Risk & Telemetry',
      icon: <ShieldCheck className="w-5 h-5 text-[#2563EB]" />,
      description: 'Network node health, anti-tampering fraud alerts & security audit logs.',
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-card relative overflow-hidden">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#2563EB] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Autonomous AI Supply Chain Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            CargoLoop Enterprise AI Logistics Platform
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            Discover all 8 core AI modules engineered to automate freight booking, ERP/WMS data pipelines, driver compliance, return load matching, and real-time route telemetry using Deep Navy & Electric Blue enterprise architecture.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => handleGoToAuth()}
              className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Enterprise Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#features-grid"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Explore Features Below</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Live Telemetry Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800 relative z-10">
          <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">On-Time Speed</p>
            <p className="text-xl font-black text-white mt-1">99.8%</p>
          </div>
          <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Freight Savings</p>
            <p className="text-xl font-black text-white mt-1">14.2%</p>
          </div>
          <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ERP/WMS Sync</p>
            <p className="text-xl font-black text-white mt-1">6 Live Systems</p>
          </div>
          <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Empty Miles Saved</p>
            <p className="text-xl font-black text-white mt-1">34% Reduced</p>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div id="features-grid" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
              Complete CargoLoop Feature Suite
            </h2>
            <p className="text-xs text-[#64748B] font-medium">
              Explore all integrated modules powering Shippers, Drivers, Fleet Owners, and Admins.
            </p>
          </div>
          <Badge variant="blue" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            8 Enterprise AI Features
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feat) => (
            <div
              key={feat.id}
              className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <Badge variant="blue" size="sm">
                    {feat.badge}
                  </Badge>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                    {feat.category}
                  </span>
                  <h3 className="font-extrabold text-[#0F172A] text-base mt-0.5 group-hover:text-[#2563EB] transition-colors">
                    {feat.title}
                  </h3>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                  {feat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#2563EB] font-bold">
                <span>Active & Fully Live</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Portal Access Section */}
      <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight">
              Select Your Role & Launch Portal
            </h2>
            <p className="text-xs text-[#64748B] font-medium">
              CargoLoop provides tailored interfaces optimized for every supply chain stakeholder.
            </p>
          </div>
          <Badge variant="blue" icon={<Award className="w-3.5 h-3.5" />}>
            4 Specialized Role Interfaces
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rolePortals.map((p) => (
            <div
              key={p.role}
              onClick={() => handleGoToAuth(p.role)}
              className="p-5 rounded-2xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#BFDBFE] transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-2xs"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shadow-2xs">
                  {p.icon}
                </div>
                <h3 className="font-extrabold text-[#0F172A] text-sm group-hover:text-[#2563EB] transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2563EB]">
                <span>Log in as {p.role}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-8 bg-[#0F172A] text-white rounded-3xl border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-extrabold text-lg text-white">Ready to automate your freight operations?</h3>
          <p className="text-xs text-slate-300">Sign in to your CargoLoop account or register a new enterprise workspace.</p>
        </div>

        <button
          onClick={() => handleGoToAuth()}
          className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Go to Log In Page</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
