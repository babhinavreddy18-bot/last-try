import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthCard } from '../components/auth/AuthCard';
import { Badge } from '../components/common/Badge';
import {
  Sparkles, Database, RotateCcw, FileCheck, MapPin,
  TrendingUp, ShieldAlert, Bot, ArrowRight, CheckCircle2
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleSuccess = () => {
    navigate(`/dashboard/${role || 'shipper'}`);
  };

  const featureCards = [
    {
      title: 'Natural Language Freight Creator',
      category: 'AI Parsing',
      icon: <Sparkles className="w-5 h-5 text-[#2563EB]" />,
      badge: 'Gemini 2.5 Flash',
      description: 'Extract cargo parameters, cold chain needs, and pricing from natural language prompts.',
    },
    {
      title: 'ERP & WMS Automated Data Sharing',
      category: 'Enterprise Integration',
      icon: <Database className="w-5 h-5 text-[#2563EB]" />,
      badge: 'Bi-Directional Sync',
      description: 'Zero-code pipelines for SAP S/4HANA, NetSuite, Manhattan WMS, Tally & Govt e-Waybill.',
    },
    {
      title: 'AI Return Load Matcher',
      category: 'Route Optimization',
      icon: <RotateCcw className="w-5 h-5 text-[#2563EB]" />,
      badge: '0% Deadhead Miles',
      description: 'Eliminates empty return trips for drivers with instant GPS backhaul matching.',
    },
    {
      title: 'AI Document Verification Center',
      category: 'Compliance & OCR',
      icon: <FileCheck className="w-5 h-5 text-[#2563EB]" />,
      badge: 'OCR Trust Engine',
      description: 'Instant mobile camera verification for DL, RC, Insurance & PUC compliance.',
    },
    {
      title: 'Live Route Telemetry & Interactive Maps',
      category: 'Real-Time Tracking',
      icon: <MapPin className="w-5 h-5 text-[#2563EB]" />,
      badge: 'Real-Time GPS',
      description: 'Interactive Leaflet map tracking, speed telemetry, and turn-by-turn navigation.',
    },
    {
      title: 'Dynamic AI Pricing & ESG Carbon Hub',
      category: 'Rate & ESG Intelligence',
      icon: <TrendingUp className="w-5 h-5 text-[#2563EB]" />,
      badge: 'ESG Carbon Score',
      description: 'Spot rate benchmarks and interactive ESG carbon offset calculator.',
    },
    {
      title: 'AI Security & Anti-Tampering Monitor',
      category: 'System Protection',
      icon: <ShieldAlert className="w-5 h-5 text-[#2563EB]" />,
      badge: 'Fraud Detection',
      description: 'Automated tamper alerts, geofence anomaly auditing & security logs.',
    },
    {
      title: 'CargoLoop 24/7 AI Copilot',
      category: 'Conversational Agent',
      icon: <Bot className="w-5 h-5 text-[#2563EB]" />,
      badge: '24/7 AI Assistant',
      description: 'Always-on conversational AI answering queries about rates, trucks & compliance.',
    },
  ];

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      {/* Top Pre-Login Banner */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#2563EB] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Autonomous Supply Chain Network</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            CargoLoop Total Feature Suite Overview
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            Review all application features below before logging in. Select your portal role or sign in using quick demo credentials.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href="#login-form"
            className="w-full sm:w-auto px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Log In Form</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Layout: Feature Cards (Left) & Login Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Total Features Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h2 className="text-lg font-black text-[#0F172A] tracking-tight">
                Total Application Features Used
              </h2>
              <p className="text-xs text-[#64748B] font-medium">
                8 Enterprise AI modules active in this application
              </p>
            </div>
            <Badge variant="blue" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              8 Total Features
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featureCards.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-card hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
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
                    <h3 className="font-extrabold text-[#0F172A] text-sm mt-0.5">
                      {feat.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div id="login-form" className="lg:col-span-5 scroll-mt-24">
          <AuthCard onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};
