import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_ROLES, MOCK_TRUCKS } from '../mock/data';
import type { UserRole } from '../types';
import { Badge } from '../components/common/Badge';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { Sparkles, ArrowRight, Truck as TruckIcon, Leaf, FileCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsRole } = useAuth();

  const handleRoleLaunch = (targetRole: UserRole) => {
    loginAsRole(targetRole);
    navigate(`/dashboard/${targetRole}`);
  };

  const featureCards = [
    {
      title: 'Gemini 2.5 NLP Freight Creator',
      desc: 'Type natural language cargo descriptions and let Gemini extract weight, material, temp controls, and dynamic pricing.',
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
      badge: 'Natural Language AI',
    },
    {
      title: 'AI Document OCR Scanner',
      desc: 'Simulated real-time computer vision scanner auditing driver DL, RC, insurance, and PUC for trust score & expiration.',
      icon: <FileCheck className="w-6 h-6 text-teal-600" />,
      badge: 'Trust & Safety',
    },
    {
      title: 'Future Availability Predictor',
      desc: 'Tabbed time-series forecasts predicting truck capacity in 1h, 6h, 24h, and 3-day windows across key logistics hubs.',
      icon: <TruckIcon className="w-6 h-6 text-amber-600" />,
      badge: 'Predictive Analytics',
    },
    {
      title: 'Carbon Sustainability Hub',
      desc: 'Interactive ESG calculator measuring fuel saved, CO₂ reduced in metric tons, and tree-equivalent carbon offsets.',
      icon: <Leaf className="w-6 h-6 text-emerald-600" />,
      badge: 'Green Logistics',
    },
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span>CargoLoop Hackathon MVP • Powered by Gemini 2.5 Flash</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]"
        >
          Next-Gen AI Logistics & Freight Intelligence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-600 text-base sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Automate cargo booking, verify driver compliance in real-time, predict fleet availability, and optimize carbon emissions with hyper-intelligent workflows.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>Launch Interactive Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleRoleLaunch('fleet')}
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 shadow-xs hover:shadow transition-all"
          >
            Explore Fleet Command Demo
          </button>
        </motion.div>
      </section>

      {/* Quick Demo Role Cards Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Explore Role-Specific Dashboards</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Click any persona to instantly jump into their live operational portal</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_ROLES.map((roleInfo) => (
            <motion.div
              key={roleInfo.role}
              whileHover={{ y: -4 }}
              onClick={() => handleRoleLaunch(roleInfo.role)}
              className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle hover:shadow-float cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={roleInfo.avatar}
                  alt={roleInfo.label}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">
                    {roleInfo.label}
                  </h3>
                  <span className="text-[11px] text-slate-400 capitalize font-medium">{roleInfo.email}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal font-medium">{roleInfo.subtitle}</p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-indigo-400">
                <span>Enter Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Matrix Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Core AI Intelligence Modules</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">High-impact features engineered for logistics transparency</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureCards.map((feat, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">{feat.icon}</div>
                <Badge variant="blue">{feat.badge}</Badge>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">{feat.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Map Live Telemetry Preview */}
      <section className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">National Corridor Telemetry Grid</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">250 active fleet vehicles tracked across major corridors & ports</p>
          </div>
          <Badge variant="teal" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            System Online • 99.9% Telemetry Signal
          </Badge>
        </div>
        <InteractiveMap trucks={MOCK_TRUCKS} className="h-[560px]" />
      </section>
    </div>
  );
};

