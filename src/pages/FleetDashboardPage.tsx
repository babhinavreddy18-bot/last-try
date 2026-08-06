import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_TRUCKS, MOCK_AVAILABILITY_PREDICTIONS, MOCK_SUSTAINABILITY, MOCK_TIME_SERIES } from '../mock/data';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { formatCO2 } from '../utils/formatters';
import { Building2, Truck as TruckIcon, TrendingUp, Leaf, Clock, MapPin, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import { ErpWmsIntegration } from '../components/ai/ErpWmsIntegration';

export const FleetDashboardPage: React.FC = () => {
  const location = useLocation();
  const [timeframe, setTimeframe] = useState<'1h' | '6h' | '24h' | '3d'>('1h');
  const [distanceKmInput, setDistanceKmInput] = useState(15000);

  useEffect(() => {
    if (!location.hash) return;
    const cleanHash = location.hash.replace('#', '');
    const targetId = cleanHash.startsWith('ai-') ? cleanHash : 'ai-' + cleanHash;
    const timer = setTimeout(() => {
      const el = document.getElementById(targetId) || document.getElementById(cleanHash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-[#2563EB]', 'ring-offset-2', 'transition-all', 'duration-500');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-[#2563EB]', 'ring-offset-2');
        }, 2000);
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [location.hash]);

  const predictions = MOCK_AVAILABILITY_PREDICTIONS.filter((p) => p.timeframe === timeframe);

  // Carbon math calculations for dynamic interactive calculator
  const calculatedFuelSavedLiters = Math.round((distanceKmInput / 3.8) * 0.16); // 16% route efficiency gain
  const calculatedCo2ReducedKg = Math.round(calculatedFuelSavedLiters * 2.68);
  const calculatedTreesPlanted = Math.round(calculatedCo2ReducedKg / 22);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Fleet Owner Command Center</h1>
          <p className="text-xs text-slate-500 font-medium">Telemetry, ERP/WMS data sharing, availability predictor & carbon hub</p>
        </div>
        <Badge variant="amber" icon={<Building2 className="w-3.5 h-3.5" />}>
          250 Active Fleet Vehicles
        </Badge>
      </div>

      {/* ══ ERP & WMS AUTOMATED DATA SHARING HUB ══ */}
      <div id="ai-erp-wms-sharing" className="scroll-mt-20">
        <ErpWmsIntegration />
      </div>

      {/* Fleet Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Fleet Revenue"
          value="₹32.8 Lakhs"
          change="+16.4% YoY"
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="blue"
        />
        <StatCard
          title="Truck Utilization Rate"
          value="91.6%"
          change="+4.2% optimized"
          icon={<TruckIcon className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          title="Fuel Saved (Liters)"
          value={`${MOCK_SUSTAINABILITY.litersFuelSaved.toLocaleString()} L`}
          change="AI Route Efficiency"
          icon={<Zap className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          title="CO₂ Offset Impact"
          value={formatCO2(MOCK_SUSTAINABILITY.co2ReducedKg)}
          change="2,240 Trees equivalent"
          icon={<Leaf className="w-5 h-5" />}
          accentColor="amber"
        />
      </div>

      {/* Fleet Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Trip Trend Area Chart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Fleet Revenue Growth (Monthly)</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Recharts Telemetry</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_TIME_SERIES}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip formatter={(value: any) => [`₹${(value / 100000).toFixed(2)} Lakhs`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO2 Savings Bar Chart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Monthly CO₂ Savings (kg)</h3>
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
              Carbon Neutrality Goal
            </span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_TIME_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip formatter={(value: any) => [`${value} kg`, 'CO₂ Reduced']} />
                <Bar dataKey="co2Saved" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Future Availability Predictor Section */}
      <div id="ai-availability-predictor" className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 border border-blue-100 dark:border-indigo-800">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Future Availability Predictor</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Predicted fleet capacity based on traffic, turnarounds, & backhauls</p>
            </div>
          </div>

          {/* Timeframe Selector Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700">
            {(['1h', '6h', '24h', '3d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg uppercase transition-all cursor-pointer ${
                  timeframe === tf ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-indigo-400 shadow-2xs font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Prediction Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {predictions.map((pred, i) => (
            <div key={i} className="bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {pred.city}
                </span>
                <Badge variant={pred.demandForecast === 'High' ? 'red' : 'blue'}>
                  {pred.demandForecast} Demand
                </Badge>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{pred.predictedAvailableTrucks}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">trucks ready</span>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>AI Confidence:</span>
                <strong className="text-emerald-700 dark:text-emerald-400">{pred.confidenceScorePercent}%</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carbon Emissions & Sustainability Hub Interactive Calculator */}
      <div id="ai-carbon-hub" className="scroll-mt-20">
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Carbon Emissions & Sustainability Hub</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Interactive ESG calculator & green fleet optimizer</p>
              </div>
            </div>
            <Badge variant="teal">Fleet Score: 92.4% Efficient</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Simulation controls */}
            <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Simulate Monthly Fleet Distance (KM)
              </label>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={distanceKmInput}
                onChange={(e) => setDistanceKmInput(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                <span>{distanceKmInput.toLocaleString()} km</span>
                <span>100,000 km</span>
              </div>
            </div>

            {/* Interactive Calculator Outputs */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fuel Saved</span>
                <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
                  {calculatedFuelSavedLiters.toLocaleString()} L
                </div>
              </div>

              <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CO₂ Reduced</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatCO2(calculatedCo2ReducedKg)}
                </div>
              </div>

              <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tree Offset</span>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                  {calculatedTreesPlanted.toLocaleString()} 🌿
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Live Telemetry Map */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Full Fleet Live Tracking Map</h3>
        <InteractiveMap trucks={MOCK_TRUCKS} className="h-[560px]" />
      </div>
    </div>
  );
};
