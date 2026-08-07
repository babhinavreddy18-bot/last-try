import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, MapPin, ArrowRight, Package,
  Thermometer, Filter, CheckCircle2,
  Clock, Route, Truck, Star, ChevronDown, ChevronUp,
  Zap, X, Send, AlertCircle, Weight
} from 'lucide-react';
import { MOCK_SHIPMENTS } from '../../mock/data';
import type { Shipment } from '../../types';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDistance } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

interface BookingFilters {
  search: string;
  originCity: string;
  destinationCity: string;
  cargoType: 'all' | 'general' | 'cold-chain';
  minPayout: number;
  maxDistance: number;
  sortBy: 'payout-high' | 'payout-low' | 'distance-near' | 'distance-far' | 'weight-light';
}

interface BookingRequest {
  shipment: Shipment;
  status: 'pending';
  requestedAt: string;
}

const ALL_CITIES = [
  'Mumbai', 'Pune', 'Bengaluru', 'Chennai', 'Delhi', 'Hyderabad',
  'Kolkata', 'Ahmedabad', 'Surat', 'Jaipur', 'Nagpur', 'Indore',
  'Visakhapatnam', 'Coimbatore', 'Nashik',
];

const PAYOUT_OPTIONS = [
  { label: 'Any', value: 0 },
  { label: '₹20k+', value: 20000 },
  { label: '₹35k+', value: 35000 },
  { label: '₹50k+', value: 50000 },
  { label: '₹75k+', value: 75000 },
  { label: '₹1L+', value: 100000 },
];

const DISTANCE_OPTIONS = [
  { label: 'Any', value: 9999 },
  { label: '≤200 km', value: 200 },
  { label: '≤500 km', value: 500 },
  { label: '≤1000 km', value: 1000 },
  { label: '≤1500 km', value: 1500 },
];

export const DriverBookingCenter: React.FC = () => {
  const { translateCity, translateMaterial, translateStatus } = useLanguage();

  const [filters, setFilters] = useState<BookingFilters>({
    search: '',
    originCity: '',
    destinationCity: '',
    cargoType: 'all',
    minPayout: 0,
    maxDistance: 9999,
    sortBy: 'payout-high',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [confirmModal, setConfirmModal] = useState<Shipment | null>(null);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => {
    let result = MOCK_SHIPMENTS.filter((s) => {
      if (s.status === 'delivered' || s.status === 'cancelled') return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !s.title.toLowerCase().includes(q) &&
          !s.origin.city.toLowerCase().includes(q) &&
          !s.destination.city.toLowerCase().includes(q) &&
          !s.material.toLowerCase().includes(q)
        ) return false;
      }
      if (filters.originCity && !s.origin.city.toLowerCase().includes(filters.originCity.toLowerCase())) return false;
      if (filters.destinationCity && !s.destination.city.toLowerCase().includes(filters.destinationCity.toLowerCase())) return false;
      if (filters.cargoType === 'cold-chain' && !s.temperatureControlled) return false;
      if (filters.cargoType === 'general' && s.temperatureControlled) return false;
      if (s.estimatedPriceInr < filters.minPayout) return false;
      if (s.distanceKm > filters.maxDistance) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case 'payout-high': return b.estimatedPriceInr - a.estimatedPriceInr;
        case 'payout-low': return a.estimatedPriceInr - b.estimatedPriceInr;
        case 'distance-near': return a.distanceKm - b.distanceKm;
        case 'distance-far': return b.distanceKm - a.distanceKm;
        case 'weight-light': return a.weightTons - b.weightTons;
        default: return 0;
      }
    });
    return result;
  }, [filters]);

  const visible = filtered.slice(0, visibleCount);
  const alreadyRequested = (id: string) => bookingRequests.some((r) => r.shipment.id === id);

  const confirmBooking = () => {
    if (!confirmModal) return;
    setBookingRequests((prev) => [
      { shipment: confirmModal, status: 'pending', requestedAt: new Date().toLocaleTimeString() },
      ...prev,
    ]);
    setSuccessAlert(`Booking request sent for "${confirmModal.title}". You'll be notified once confirmed.`);
    setConfirmModal(null);
    setTimeout(() => setSuccessAlert(null), 5000);
  };

  const clearFilters = () =>
    setFilters({ search: '', originCity: '', destinationCity: '', cargoType: 'all', minPayout: 0, maxDistance: 9999, sortBy: 'payout-high' });

  const activeFilterCount = [
    filters.originCity,
    filters.destinationCity,
    filters.cargoType !== 'all',
    filters.minPayout > 0,
    filters.maxDistance < 9999,
  ].filter(Boolean).length;

  return (
    <div id="driver-booking-center" className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E3A5F] to-[#0F172A] p-6 text-white">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 border border-blue-400/40 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">Driver Booking Center</h3>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  ✦ Choose Your Trip
                </span>
              </div>
              <p className="text-blue-200 text-xs mt-0.5">Browse & request shipments that match your preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="bg-white/10 text-blue-200 px-3 py-1.5 rounded-lg">{filtered.length} trips available</span>
            {bookingRequests.length > 0 && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                {bookingRequests.length} requested
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">

        {/* Success Alert */}
        <AnimatePresence>
          {successAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="font-semibold">{successAlert}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search + Filter Row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search by route, cargo or material…"
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as BookingFilters['sortBy'] }))}
            className="py-2.5 px-3 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer"
          >
            <option value="payout-high">💰 Highest Payout</option>
            <option value="payout-low">💸 Lowest Payout</option>
            <option value="distance-near">📍 Nearest First</option>
            <option value="distance-far">🛣️ Longest Route</option>
            <option value="weight-light">⚖️ Light Cargo</option>
          </select>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-xl border transition-all ${
              showFilters || activeFilterCount > 0
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Filter className="w-3.5 h-3.5 text-blue-500" />
                    Filter by Your Preference
                  </div>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-rose-500 font-bold hover:text-rose-700 flex items-center gap-1">
                      <X className="w-3 h-3" /> Clear All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pickup City</label>
                    <select
                      value={filters.originCity}
                      onChange={(e) => setFilters((f) => ({ ...f, originCity: e.target.value }))}
                      className="w-full py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-400"
                    >
                      <option value="">Any City</option>
                      {ALL_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Drop-Off City</label>
                    <select
                      value={filters.destinationCity}
                      onChange={(e) => setFilters((f) => ({ ...f, destinationCity: e.target.value }))}
                      className="w-full py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-400"
                    >
                      <option value="">Any City</option>
                      {ALL_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cargo Type</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {([
                        { key: 'all', label: 'All' },
                        { key: 'general', label: '📦 General' },
                        { key: 'cold-chain', label: '❄️ Cold Chain' },
                      ] as const).map(({ key, label }) => (
                        <button key={key} onClick={() => setFilters((f) => ({ ...f, cargoType: key }))}
                          className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                            filters.cargoType === key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                          }`}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Minimum Payout</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {PAYOUT_OPTIONS.map(({ label, value }) => (
                        <button key={value} onClick={() => setFilters((f) => ({ ...f, minPayout: value }))}
                          className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                            filters.minPayout === value ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                          }`}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Max Trip Distance</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {DISTANCE_OPTIONS.map(({ label, value }) => (
                        <button key={value} onClick={() => setFilters((f) => ({ ...f, maxDistance: value }))}
                          className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                            filters.maxDistance === value ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                          }`}>{label}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* My Requests Strip */}
        {bookingRequests.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <Clock className="w-3 h-3" /> My Booking Requests
            </p>
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {bookingRequests.map((req, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 truncate max-w-[60%]">{req.shipment.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{req.requestedAt}</span>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 font-bold rounded text-[10px]">⏳ Pending</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipment Cards */}
        {visible.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-500">No trips match your filters</p>
            <button onClick={clearFilters} className="text-xs text-blue-600 font-bold hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((shipment) => {
              const isExpanded = expandedId === shipment.id;
              const isRequested = alreadyRequested(shipment.id);
              const isHighPayout = shipment.estimatedPriceInr >= 50000;
              return (
                <motion.div key={shipment.id} layout
                  className={`rounded-xl border transition-all ${
                    isRequested ? 'border-emerald-200 bg-emerald-50/30'
                    : isHighPayout ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
                    : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          {isHighPayout && (
                            <span className="text-[10px] font-black text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Zap className="w-2.5 h-2.5" /> TOP PAY
                            </span>
                          )}
                          <span className="font-bold text-slate-900 text-sm truncate">{shipment.title}</span>
                          <Badge variant={shipment.status === 'in-transit' ? 'blue' : shipment.status === 'delivered' ? 'green' : 'amber'}>
                            {translateStatus(shipment.status)}
                          </Badge>
                          {shipment.temperatureControlled && <Badge variant="teal">❄️ Cold Chain</Badge>}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                          <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                          <span className="font-semibold text-slate-800">{translateCity(shipment.origin.city)}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                          <MapPin className="w-3 h-3 text-teal-500 shrink-0" />
                          <span className="font-semibold text-slate-800">{translateCity(shipment.destination.city)}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Route className="w-3 h-3" /><strong className="text-slate-700">{formatDistance(shipment.distanceKm)}</strong></span>
                          <span className="flex items-center gap-1"><Weight className="w-3 h-3" /><strong className="text-slate-700">{shipment.weightTons}T</strong></span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /><strong className="text-slate-700">{shipment.pickupWindow}</strong></span>
                          <span className="flex items-center gap-1"><Package className="w-3 h-3" /><strong className="text-slate-700">{translateMaterial(shipment.material)}</strong></span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-medium">Trip Payout</p>
                          <p className={`font-black text-lg leading-tight ${isHighPayout ? 'text-amber-600' : 'text-slate-900'}`}>
                            {formatCurrency(shipment.estimatedPriceInr)}
                          </p>
                        </div>
                        {isRequested ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Requested
                          </span>
                        ) : (
                          <button
                            onClick={() => setConfirmModal(shipment)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            <Send className="w-3 h-3" /> Book Trip
                          </button>
                        )}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : shipment.id)}
                          className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-0.5 font-semibold cursor-pointer"
                        >
                          Details {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-slate-100 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Min Rate</p>
                            <p className="font-bold text-slate-700 text-xs mt-0.5">{formatCurrency(shipment.suggestedPriceMinInr)}</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Max Rate</p>
                            <p className="font-bold text-slate-700 text-xs mt-0.5">{formatCurrency(shipment.suggestedPriceMaxInr)}</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Fuel Cost</p>
                            <p className="font-bold text-slate-700 text-xs mt-0.5">{formatCurrency(shipment.fuelImpactInr)}</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">CO₂ Est.</p>
                            <p className="font-bold text-slate-700 text-xs mt-0.5">{shipment.estimatedCo2Kg} kg</p>
                          </div>
                          {shipment.temperatureControlled && shipment.temperatureTargetCelsius !== undefined && (
                            <div className="col-span-2 sm:col-span-4 p-2.5 rounded-lg bg-teal-50 border border-teal-100 flex items-center gap-2">
                              <Thermometer className="w-4 h-4 text-teal-600 shrink-0" />
                              <span className="text-xs font-bold text-teal-700">
                                Temperature-controlled cargo · Target: {shipment.temperatureTargetCelsius}°C
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {visibleCount < filtered.length && (
              <button
                onClick={() => setVisibleCount((v) => v + 8)}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Load More ({filtered.length - visibleCount} remaining)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Confirm Booking Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-base">Confirm Booking Request</h3>
                <button onClick={() => setConfirmModal(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <p className="font-bold text-slate-900 text-sm">{confirmModal.title}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  <span className="font-semibold">{confirmModal.origin.city}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <MapPin className="w-3 h-3 text-teal-500" />
                  <span className="font-semibold">{confirmModal.destination.city}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-400 text-[10px]">Distance</p>
                    <p className="font-bold text-slate-800">{formatDistance(confirmModal.distanceKm)}</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-400 text-[10px]">Weight</p>
                    <p className="font-bold text-slate-800">{confirmModal.weightTons}T</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-emerald-600 text-[10px] font-semibold">Payout</p>
                    <p className="font-black text-emerald-700">{formatCurrency(confirmModal.estimatedPriceInr)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50 rounded-xl p-3 border border-blue-100">
                <Star className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Your request will be sent to the shipper. You'll be notified once they confirm your booking.</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setConfirmModal(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={confirmBooking} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Send className="w-4 h-4" /> Send Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
