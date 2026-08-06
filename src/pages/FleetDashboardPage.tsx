import React, { useState } from 'react';
import { MOCK_TRUCKS, MOCK_AVAILABILITY_PREDICTIONS, MOCK_SUSTAINABILITY, MOCK_TIME_SERIES } from '../mock/data';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { formatCO2 } from '../utils/formatters';
import { Building2, Truck as TruckIcon, TrendingUp, Leaf, Clock, MapPin, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const FleetDashboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'1h' | '6h' | '24h' | '3d'>('1h');
  const [distanceKmInput, setDistanceKmInput] = useState(15000);

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
          <p className="text-xs text-slate-500 font-medium">Telemetry, future availability predictor & carbon sustainability hub</p>
        </div>
        <Badge variant="amber" icon={<Building2 className="w-3.5 h-3.5" />}>
          250 Active Fleet Vehicles
        </Badge>
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
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Fleet Revenue Growth (Monthly)</h3>
            <span className="text-xs text-slate-500 font-medium">Recharts Telemetry</span>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip formatter={(value: any) => [`₹${(value / 100000).toFixed(2)} Lakhs`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO2 Savings Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Monthly CO₂ Savings (kg)</h3>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
              Carbon Neutrality Goal
            </span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_TIME_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
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
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Future Availability Predictor</h3>
              <p className="text-xs text-slate-500">Predicted fleet capacity based on traffic, turnarounds, & backhauls</p>
            </div>
          </div>

          {/* Timeframe Selector Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['1h', '6h', '24h', '3d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg uppercase transition-all ${
                  timeframe === tf ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tf} Window
              </button>
            ))}
          </div>
        </div>

        {/* Prediction Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {predictions.map((pred, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {pred.city}
                </span>
                <Badge variant={pred.demandForecast === 'High' ? 'red' : 'blue'}>
                  {pred.demandForecast} Demand
                </Badge>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-black text-slate-900">{pred.predictedAvailableTrucks}</span>
                <span className="text-xs text-slate-500">trucks ready</span>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                <span>AI Confidence:</span>
                <strong className="text-emerald-700">{pred.confidenceScorePercent}%</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carbon Emissions & Sustainability Hub Interactive Calculator */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-teal-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Carbon Emissions & Sustainability Hub</h3>
              <p className="text-xs text-teal-200/70">Interactive ESG calculator & green fleet optimizer</p>
            </div>
          </div>
          <Badge variant="teal">Fleet Score: 92.4% Efficient</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Slider input */}
          <div className="space-y-3 bg-slate-800/80 p-5 rounded-xl border border-slate-700">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Simulate Monthly Fleet Distance (KM)
            </label>
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={distanceKmInput}
              onChange={(e) => setDistanceKmInput(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-xs font-semibold text-teal-300">
              <span>{distanceKmInput.toLocaleString()} km</span>
              <span>100,000 km</span>
            </div>
          </div>

          {/* Interactive Calculator Outputs */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Fuel Saved</span>
              <div className="text-2xl font-black text-teal-400 mt-1">
                {calculatedFuelSavedLiters.toLocaleString()} L
              </div>
              <span className="text-[11px] text-slate-400">via smart backhauls</span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">CO₂ Reduced</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {formatCO2(calculatedCo2ReducedKg)}
              </div>
              <span className="text-[11px] text-slate-400">Emissions prevented</span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tree Offset Equiv.</span>
              <div className="text-2xl font-black text-amber-300 mt-1">
                {calculatedTreesPlanted.toLocaleString()} 🌿
              </div>
              <span className="text-[11px] text-slate-400">Annual carbon sink</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Live Telemetry Map */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Full Fleet Live Tracking Map</h3>
        <InteractiveMap trucks={MOCK_TRUCKS} className="h-[560px]" />
      </div>
    </div>
  );
};
