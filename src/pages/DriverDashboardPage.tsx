import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_DRIVERS, MOCK_SHIPMENTS, MOCK_TRUCKS } from '../mock/data';
import type { TruckStatus, Shipment } from '../types';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { DocumentScanner } from '../components/ai/DocumentScanner';
import { ReturnLoadMatcher } from '../components/ai/ReturnLoadMatcher';
import { DriverBookingCenter } from '../components/driver/DriverBookingCenter';
import { formatCurrency, formatDistance } from '../utils/formatters';
import { Navigation, DollarSign, Award, MapPin, CheckCircle2, ShieldCheck, ArrowRight, Truck as TruckIcon, X, Compass, Route } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const earningsData = [
  { day: 'Mon', earnings: 4200 },
  { day: 'Tue', earnings: 6800 },
  { day: 'Wed', earnings: 5100 },
  { day: 'Thu', earnings: 8900 },
  { day: 'Fri', earnings: 7400 },
  { day: 'Sat', earnings: 9600 },
  { day: 'Sun', earnings: 11200 },
];

import { useLanguage } from '../context/LanguageContext';

export const DriverDashboardPage: React.FC = () => {
  const { t, translateCity, translateMaterial, translateStatus } = useLanguage();
  const location = useLocation();
  const driver = MOCK_DRIVERS[0];
  const [gpsStatus, setGpsStatus] = useState<TruckStatus>('in-transit');
  const [navigatingShipment, setNavigatingShipment] = useState<Shipment | null>(null);
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'in-transit' | 'cold-chain' | 'high-payout' | 'assigned'>('all');
  const [visibleCount, setVisibleCount] = useState(24);

  const activeTruck = MOCK_TRUCKS[0];

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

  const filteredDeliveries = MOCK_SHIPMENTS.filter((s) => {
    if (deliveryFilter === 'in-transit') return s.status === 'in-transit';
    if (deliveryFilter === 'cold-chain') return s.temperatureControlled;
    if (deliveryFilter === 'high-payout') return s.estimatedPriceInr >= 45000;
    if (deliveryFilter === 'assigned') return s.status === 'pending' || s.status === 'assigned';
    return true;
  });

  const visibleDeliveries = filteredDeliveries.slice(0, visibleCount);

  const handleAcceptAndNavigate = (shipment: Shipment) => {
    setNavigatingShipment(shipment);
    setTimeout(() => {
      document.getElementById('live-navigation-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Live GPS Status Toggle */}
      <div className="saas-card rounded-3xl p-6 border-2 border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt={driver.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.4)]"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 gps-pulse-active" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{driver.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#00f3ff]/10 text-[#00cce5] dark:text-[#00f3ff] border border-[#00f3ff]/40 shadow-[0_0_10px_rgba(0,243,255,0.25)] flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#00f3ff]" />
                ⭐ {driver.rating} Rating
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold mt-0.5">
              Lic: {driver.licenseNumber} | Assigned Vehicle: <strong className="text-slate-900 dark:text-white font-extrabold">{activeTruck.plateNumber}</strong>
            </p>
          </div>
        </div>

        {/* Live GPS Status */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-100/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white px-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f3ff] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]" />
            </span>
            <Navigation className="w-4 h-4 text-[#00f3ff]" />
            <span>Live GPS Telemetry:</span>
          </div>

          <div className="flex items-center bg-white/90 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-extrabold">
            {(['available', 'in-transit', 'offline'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setGpsStatus(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  gpsStatus === st
                    ? st === 'in-transit'
                      ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] gps-pulse-active'
                      : 'bg-blue-600 text-white shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Driver Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.totalEarnings}
          value={formatCurrency(driver.totalEarningsInr)}
          change="+18.4% this month"
          icon={<DollarSign className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          title={t.completedTrips}
          value={driver.completedTrips}
          change="+12 trips"
          icon={<TruckIcon className="w-5 h-5" />}
          accentColor="blue"
        />
        <StatCard
          title={t.trustScore}
          value={`${driver.trustScorePercent}%`}
          change="AI Verified"
          icon={<ShieldCheck className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          title={t.onTimeRate}
          value="98.2%"
          change="Top 5% Driver"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="amber"
        />
      </div>

      {/* ══ AI RETURN LOAD MATCHER ─ Core Feature ══ */}
      <div id="ai-return-load-matcher" className="scroll-mt-20">
        <ReturnLoadMatcher
          currentDropCity={activeTruck.destination?.city ?? 'Pune'}
          currentDropLat={activeTruck.destination?.lat ?? activeTruck.currentLocation.lat}
          currentDropLng={activeTruck.destination?.lng ?? activeTruck.currentLocation.lng}
          truckCapacityTons={activeTruck.capacityTons}
          onAccept={handleAcceptAndNavigate}
        />
      </div>

      {/* ══ DRIVER BOOKING CENTER ══ */}
      <div id="driver-booking-center" className="scroll-mt-20">
        <DriverBookingCenter />
      </div>

      {/* ══ AI DOCUMENT VERIFICATION CENTER (Full Width) ══ */}
      <div id="ai-document-scanner" className="w-full scroll-mt-20">
        <DocumentScanner />
      </div>

      {/* Main Content Area: Assigned Deliveries & Telemetry */}
      <div className="w-full space-y-6">
          {/* Active Route Telemetry */}
          {navigatingShipment && (
            <div id="live-navigation-map" className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Navigating: {navigatingShipment.origin.city} → {navigatingShipment.destination.city}</span>
                  </h3>
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                    <Compass className="w-3.5 h-3.5 animate-spin" /> Turn-by-Turn GPS Live Route Telemetry Active
                  </p>
                </div>
                <button
                  onClick={() => setNavigatingShipment(null)}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Stop Telemetry</span>
                </button>
              </div>

              {/* Active Turn-by-Turn Navigation Bar Overlay */}
              <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-md space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-extrabold">
                    <Route className="w-4 h-4 text-amber-300" />
                    <span>{navigatingShipment.title}</span>
                  </div>
                  <span className="bg-white/20 px-2 py-0.5 rounded font-bold text-[11px]">
                    {formatDistance(navigatingShipment.distanceKm)} • Payout: {formatCurrency(navigatingShipment.estimatedPriceInr)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-100 border-t border-white/20 pt-1.5">
                  <span>📍 Next Turn: In 14 km, Merge onto NH-48 Express Highway (Speed: 55 km/h)</span>
                  <span className="font-bold text-amber-200">ETA: ~{Math.round(navigatingShipment.distanceKm / 50 * 60)} mins</span>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Deliveries List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{t.assignedCargo}</h3>
                <p className="text-xs text-slate-500">
                  Showing {visibleDeliveries.length} of {filteredDeliveries.length} trips ({MOCK_SHIPMENTS.length} total in dispatch grid)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                  {MOCK_SHIPMENTS.filter(s => s.temperatureControlled).length} {t.coldChain}
                </span>
                <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  {filteredDeliveries.length} Trips
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {([
                { key: 'all', label: 'All Deliveries' },
                { key: 'in-transit', label: `🚛 ${translateStatus('in-transit')}` },
                { key: 'cold-chain', label: `❄️ ${t.coldChain}` },
                { key: 'high-payout', label: '💰 High Payout (₹45k+)' },
                { key: 'assigned', label: `📋 ${translateStatus('available')}` },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setDeliveryFilter(key); setVisibleCount(24); }}
                  className={`px-3 py-1 font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    deliveryFilter === key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {visibleDeliveries.map((shipment) => (
                <div
                  key={shipment.id}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all"
                >
                  {/* Row 1: Title + badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-bold text-slate-900 text-sm">{shipment.title}</span>
                    <Badge
                      variant={
                        shipment.status === 'in-transit' ? 'blue'
                        : shipment.status === 'delivered' ? 'green'
                        : 'amber'
                      }
                    >
                      {translateStatus(shipment.status)}
                    </Badge>
                    {shipment.temperatureControlled && (
                      <Badge variant="teal">❄️ {t.coldChain}</Badge>
                    )}
                    <Badge variant="gray">{translateMaterial(shipment.material)}</Badge>
                  </div>

                  {/* Row 2: Route */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                    <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="font-semibold text-slate-800">{translateCity(shipment.origin.city)}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <MapPin className="w-3 h-3 text-teal-500 shrink-0" />
                    <span className="font-semibold text-slate-800">{translateCity(shipment.destination.city)}</span>
                  </div>

                  {/* Row 3: Meta + Action */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>📅 <strong className="text-slate-800">{shipment.pickupWindow}</strong></span>
                      <span>📏 <strong className="text-slate-800">{formatDistance(shipment.distanceKm)}</strong></span>
                      <span>⚖️ <strong className="text-slate-800">{shipment.weightTons}T</strong></span>
                      {shipment.temperatureControlled && (
                        <span>🌡️ <strong className="text-slate-800">{t.tempControlled}</strong></span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">{t.tripPayout}</p>
                        <p className="font-extrabold text-slate-900 text-sm">{formatCurrency(shipment.estimatedPriceInr)}</p>
                      </div>
                      <button
                        onClick={() => setNavigatingShipment(shipment)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1 transition-colors shrink-0"
                      >
                        <span>{t.navigate}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More */}
              {visibleCount < filteredDeliveries.length && (
                <button
                  onClick={() => setVisibleCount(prev => Math.min(prev + 12, filteredDeliveries.length))}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition-colors"
                >
                  Load More Deliveries ({filteredDeliveries.length - visibleCount} remaining)
                </button>
              )}
            </div>
          </div>

          {/* Weekly Earnings History Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Weekly Earnings Breakdown</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(value: any) => [`₹${value}`, 'Earnings']} />
                  <Area type="monotone" dataKey="earnings" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      {/* ══ LIVE ROUTE NAVIGATION MAP POP-UP MODAL ══ */}
      {navigatingShipment && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 border border-slate-200 shadow-2xl flex flex-col justify-between">

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Compass className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{navigatingShipment.title}</h3>
                    <Badge variant="teal">Live Navigation Active</Badge>
                  </div>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <strong>{navigatingShipment.origin.city}</strong> → <strong>{navigatingShipment.destination.city}</strong>
                    <span className="mx-1">•</span>
                    <span>Distance: <strong>{formatDistance(navigatingShipment.distanceKm)}</strong></span>
                    <span className="mx-1">•</span>
                    <span>Payout: <strong className="text-slate-900">{formatCurrency(navigatingShipment.estimatedPriceInr)}</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setNavigatingShipment(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Exit Navigation</span>
                </button>
              </div>
            </div>

            {/* Turn-by-Turn Instruction Banner */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-extrabold text-sm">
                  <Route className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>GPS Telemetry: En Route to Destination ({navigatingShipment.destination.city})</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold text-emerald-100">
                  <span className="bg-white/20 px-2.5 py-1 rounded-lg">Speed: 54 km/h</span>
                  <span className="bg-amber-400 text-slate-900 px-2.5 py-1 rounded-lg font-extrabold">ETA: ~{Math.round(navigatingShipment.distanceKm / 50 * 60)} mins</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-50 border-t border-white/20 pt-2 font-medium">
                <span>📍 Next Step: In 12 km, exit right onto NH-48 Express Corridor (Talegaon Toll Plaza)</span>
                <span className="text-[11px] opacity-90 hidden md:inline">Signal: 99.8% GPS Accuracy</span>
              </div>
            </div>

            {/* Embedded Live Telemetry Details Panel */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 border border-slate-800 shadow-inner">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Speed</p>
                  <p className="text-xl font-black text-emerald-400 mt-1">54 km/h</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Distance Remaining</p>
                  <p className="text-xl font-black text-blue-400 mt-1">{formatDistance(navigatingShipment.distanceKm)}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated Payout</p>
                  <p className="text-xl font-black text-amber-400 mt-1">{formatCurrency(navigatingShipment.estimatedPriceInr)}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GPS Status</p>
                  <p className="text-xl font-black text-purple-400 mt-1">99.8% Active</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Origin Hub:</span>
                  <span className="font-bold text-white">{navigatingShipment.origin.city}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-700/60 pt-2">
                  <span className="text-slate-400 font-semibold">Destination Hub:</span>
                  <span className="font-bold text-white">{navigatingShipment.destination.city}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-700/60 pt-2">
                  <span className="text-slate-400 font-semibold">Assigned Vehicle:</span>
                  <span className="font-bold text-emerald-400">{activeTruck.plateNumber}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Live Gemini Telemetry Connected
              </span>
              <button
                onClick={() => setNavigatingShipment(null)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Close Telemetry
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
