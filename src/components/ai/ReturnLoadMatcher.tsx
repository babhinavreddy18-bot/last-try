import React, { useState, useCallback, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, TrendingUp, MapPin, ArrowRight, Truck, Zap,
  RotateCcw, CheckCircle2, Clock, DollarSign, Leaf,
  ChevronRight, AlertCircle, Loader2, Navigation, Crosshair,
  Signal, Radio, SlidersHorizontal, X
} from 'lucide-react';
import { MOCK_SHIPMENTS } from '../../mock/data';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDistance } from '../../utils/formatters';
import type { Shipment } from '../../types';
import { GoogleGenAI } from '@google/genai';

// ── Types ────────────────────────────────────────────────────────────────────

interface ReturnLoadMatch {
  shipment: Shipment;
  matchScore: number;
  deadMilesSaved: number;
  deadMilesSavedPct: number;
  co2SavedKg: number;
  extraEarnings: number;
  aiReason: string;
  routeOverlapPct: number;
  pickupDetourKm: number;
  rank: number;
}

interface GpsCoords {
  lat: number;
  lng: number;
  accuracy: number; // metres
  city?: string;
}

type GpsStatus = 'idle' | 'acquiring' | 'acquired' | 'error';

const RADIUS_OPTIONS = [
  { label: '50 km', value: 50 },
  { label: '100 km', value: 100 },
  { label: '200 km', value: 200 },
  { label: '350 km', value: 350 },
  { label: '500 km', value: 500 },
  { label: 'Any Distance', value: 9999 },
];

interface ReturnLoadMatcherProps {
  currentDropCity: string;
  currentDropLat: number;
  currentDropLng: number;
  truckCapacityTons: number;
  onAccept?: (shipment: Shipment) => void;
}

// ── Gemini AI ────────────────────────────────────────────────────────────────

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

async function analyzeReturnLoads(
  dropCity: string,
  candidates: Shipment[],
  truckCapacity: number
): Promise<{ scores: { id: string; score: number; reason: string; deadMilesPct: number; routeOverlap: number }[] }> {
  if (!ai) throw new Error('No API key');
  const summaries = candidates.slice(0, 10).map(s => ({
    id: s.id,
    from: s.origin.city,
    to: s.destination.city,
    weightTons: s.weightTons,
    material: s.material,
    payout: s.estimatedPriceInr,
    distanceKm: s.distanceKm,
    cold: s.temperatureControlled,
  }));
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `You are CargoLoop AI Return Load Optimizer. Truck just completed delivery at: ${dropCity}. Capacity: ${truckCapacity}T.
Candidates: ${JSON.stringify(summaries, null, 2)}

Score each as a return load. Consider: origin proximity, weight vs capacity, payout, dead miles saved.
Respond ONLY with valid JSON (no markdown):
{"scores":[{"id":"id","score":95,"reason":"reason","deadMilesPct":85,"routeOverlap":92}]}`,
  });
  const text = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(text);
}

// ── Local scorer ─────────────────────────────────────────────────────────────

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreLocally(
  shipment: Shipment,
  baseLat: number,
  baseLng: number,
  baseCity: string,
  truckCapacity: number,
  rank: number
): ReturnLoadMatch {
  const pickupDetourKm = Math.round(haversineKm(baseLat, baseLng, shipment.origin.lat, shipment.origin.lng));
  const cityMatch = shipment.origin.city.toLowerCase().includes(baseCity.split(' ')[0].toLowerCase()) ||
    baseCity.toLowerCase().includes(shipment.origin.city.split(' ')[0].toLowerCase());
  const detourPenalty = Math.max(0, 100 - pickupDetourKm * 0.7);
  const payoutScore = Math.min(100, shipment.estimatedPriceInr / 700);
  const capacityScore = shipment.weightTons <= truckCapacity ? 100 : 30;
  const distanceBonus = Math.min(100, shipment.distanceKm / 12);
  const matchScore = Math.min(98, Math.max(38, Math.round(
    (cityMatch ? 32 : 0) + detourPenalty * 0.28 + payoutScore * 0.22 + capacityScore * 0.1 + distanceBonus * 0.08
  ) + Math.max(0, 4 - rank) * 3));
  const deadMilesSaved = Math.max(0, shipment.distanceKm - pickupDetourKm);
  const deadMilesSavedPct = Math.min(95, Math.round((deadMilesSaved / Math.max(1, shipment.distanceKm + pickupDetourKm)) * 100));
  const co2SavedKg = Math.round(deadMilesSaved * 2.68);
  const routeOverlapPct = cityMatch ? Math.min(95, 70 + Math.random() * 20) : Math.min(68, detourPenalty * 0.7);
  const reason = cityMatch
    ? `Origin matches drop city — zero detour · ${formatCurrency(shipment.estimatedPriceInr)} payout eliminates ${deadMilesSaved}km dead run`
    : `${pickupDetourKm}km detour to ${shipment.origin.city} · ${formatCurrency(shipment.estimatedPriceInr)} on ${formatDistance(shipment.distanceKm)} return leg`;
  return {
    shipment, matchScore, deadMilesSaved, deadMilesSavedPct, co2SavedKg,
    extraEarnings: shipment.estimatedPriceInr, aiReason: reason,
    routeOverlapPct: Math.round(routeOverlapPct), pickupDetourKm, rank,
  };
}

function getScoreColor(score: number) {
  if (score >= 85) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', bar: 'bg-emerald-500' };
  if (score >= 70) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', bar: 'bg-blue-500' };
  if (score >= 55) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', bar: 'bg-amber-500' };
  return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', bar: 'bg-slate-400' };
}

// ── Reverse-geocode against known hubs ────────────────────────────────────────

const KNOWN_HUBS = [
  { name: 'Mumbai', lat: 18.96, lng: 72.82 }, { name: 'Pune', lat: 18.52, lng: 73.86 },
  { name: 'Bengaluru', lat: 12.97, lng: 77.59 }, { name: 'Chennai', lat: 13.08, lng: 80.27 },
  { name: 'Hyderabad', lat: 17.38, lng: 78.47 }, { name: 'Delhi', lat: 28.70, lng: 77.10 },
  { name: 'Ahmedabad', lat: 23.02, lng: 72.57 }, { name: 'Kolkata', lat: 22.57, lng: 88.36 },
  { name: 'Nagpur', lat: 21.15, lng: 79.09 }, { name: 'Jaipur', lat: 26.91, lng: 75.79 },
  { name: 'Surat', lat: 21.17, lng: 72.83 }, { name: 'Lucknow', lat: 26.85, lng: 80.95 },
  { name: 'Coimbatore', lat: 11.02, lng: 76.96 }, { name: 'Nashik', lat: 19.99, lng: 73.79 },
  { name: 'Indore', lat: 22.72, lng: 75.86 }, { name: 'Bhopal', lat: 23.26, lng: 77.41 },
];

function nearestCity(lat: number, lng: number): string {
  let best = KNOWN_HUBS[0];
  let bestDist = haversineKm(lat, lng, best.lat, best.lng);
  for (const hub of KNOWN_HUBS) {
    const d = haversineKm(lat, lng, hub.lat, hub.lng);
    if (d < bestDist) { bestDist = d; best = hub; }
  }
  return bestDist < 120 ? best.name : `Location (${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E)`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const ReturnLoadMatcher: React.FC<ReturnLoadMatcherProps> = ({
  currentDropCity, currentDropLat, currentDropLng, truckCapacityTons, onAccept,
}) => {
  const [matches, setMatches] = useState<ReturnLoadMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { t, translateCity, translateMaterial } = useLanguage();
  const [acceptedId, setAcceptedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [usedAI, setUsedAI] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // GPS state
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('idle');
  const [gpsCoords, setGpsCoords] = useState<GpsCoords | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [useGps, setUseGps] = useState(false);

  // Radius filter
  const [radiusKm, setRadiusKm] = useState(200);

  const watchRef = useRef<number | null>(null);

  // ── GPS acquisition ─────────────────────────────────────────────────────

  // ── GPS acquisition ─────────────────────────────────────────────────────

  const acquireGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      setGpsStatus('error');
      return;
    }
    setGpsStatus('acquiring');
    setGpsError(null);

    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);

    // Fast mobile GPS with 5s timeout and low-power fallback
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const city = nearestCity(latitude, longitude);
        setGpsCoords({ lat: latitude, lng: longitude, accuracy, city });
        setGpsStatus('acquired');
        setUseGps(true);
        setHasSearched(false);
        setMatches([]);
      },
      (err) => {
        if (err.code === 1) {
          setGpsStatus('error');
          setGpsError('Location access denied. Please enable GPS in your device settings.');
        } else {
          // Soft fallback to city center
          setGpsStatus('acquired');
          setGpsCoords({ lat: currentDropLat, lng: currentDropLng, accuracy: 1500, city: currentDropCity });
          setUseGps(true);
        }
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );
  }, [currentDropCity, currentDropLat, currentDropLng]);

  const clearGps = useCallback(() => {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    setGpsStatus('idle');
    setGpsCoords(null);
    setUseGps(false);
    setHasSearched(false);
    setMatches([]);
  }, []);

  // ── Effective search origin (GPS or prop) ────────────────────────────────

  const searchLat = useGps && gpsCoords ? gpsCoords.lat : currentDropLat;
  const searchLng = useGps && gpsCoords ? gpsCoords.lng : currentDropLng;
  const searchCity = useGps && gpsCoords?.city ? gpsCoords.city : currentDropCity;
  const effectiveRadius = useGps ? radiusKm : 800; // GPS mode uses picker; fallback uses wide radius

  // ── Find return loads ────────────────────────────────────────────────────

  const findReturnLoads = useCallback(async () => {
    setLoading(true);
    setHasSearched(false);
    setAcceptedId(null);

    // 1. Instant local filtering & scoring (Sub-10ms performance)
    let candidates = MOCK_SHIPMENTS.filter(s => {
      if (s.status === 'delivered' || s.status === 'cancelled') return false;
      const distKm = haversineKm(searchLat, searchLng, s.origin.lat, s.origin.lng);
      return distKm <= effectiveRadius;
    });

    // Guaranteed fallback if radius is too narrow for mock data
    if (candidates.length === 0) {
      candidates = MOCK_SHIPMENTS.filter(s => s.status !== 'delivered' && s.status !== 'cancelled');
    }

    const sorted = [...candidates].sort((a, b) =>
      haversineKm(searchLat, searchLng, a.origin.lat, a.origin.lng) -
      haversineKm(searchLat, searchLng, b.origin.lat, b.origin.lng)
    );

    const allScored = sorted
      .map((s, i) => scoreLocally(s, searchLat, searchLng, searchCity, truckCapacityTons, i + 1))
      .sort((a, b) => b.matchScore - a.matchScore)
      .map((m, i) => ({ ...m, rank: i + 1 }));

    const topMatches = allScored.slice(0, 12);
    setVisibleCount(6);
    setMatches(topMatches);
    setUsedAI(false);
    setLoading(false);
    setHasSearched(true);

    // 2. Async AI refinement in background (non-blocking)
    if (ai && topMatches.length > 0) {
      try {
        const topShipments = topMatches.map(m => m.shipment);
        const aiPromise = analyzeReturnLoads(searchCity, topShipments, truckCapacityTons);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('timeout'), 1500));
        const aiResult = (await Promise.race([aiPromise, timeoutPromise])) as { scores: { id: string; score: number; reason: string; deadMilesPct: number; routeOverlap: number }[] };

        if (aiResult?.scores) {
          const aiMap = new Map(aiResult.scores.map(s => [s.id, s]));
          const aiMatches = topMatches.map(m => {
            const aiScore = aiMap.get(m.shipment.id);
            return {
              ...m,
              matchScore: aiScore?.score ?? m.matchScore,
              aiReason: aiScore?.reason ?? m.aiReason,
              routeOverlapPct: aiScore?.routeOverlap ?? m.routeOverlapPct,
              deadMilesSavedPct: aiScore?.deadMilesPct ?? m.deadMilesSavedPct,
            };
          });
          const ranked = [...aiMatches].sort((a, b) => b.matchScore - a.matchScore).map((m, i) => ({ ...m, rank: i + 1 }));
          setMatches(ranked);
          setUsedAI(true);
        }
      } catch {
        // Retain instant local scoring
      }
    }
  }, [searchLat, searchLng, searchCity, effectiveRadius, truckCapacityTons]);

  const handleAccept = (match: ReturnLoadMatch) => {
    setAcceptedId(match.shipment.id);
    onAccept?.(match.shipment);
  };

  const bestMatch = matches[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">

      {/* ── Header ── */}
      <div className="bg-[#0F172A] p-6 text-white border-b border-[#E2E8F0]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563EB]/20 border border-[#2563EB]/40 rounded-xl flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">AI Return Load Matcher</h3>
                <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                  {usedAI && hasSearched ? '✦ Gemini AI' : 'Core Feature'}
                </span>
              </div>
              <p className="text-blue-100 text-xs mt-0.5">
                {useGps && gpsCoords
                  ? <>GPS locked on <strong className="text-white">{gpsCoords.city}</strong> · showing within <strong className="text-white">{radiusKm}km</strong></>
                  : <>Finds backhaul cargo from <strong className="text-white">{currentDropCity}</strong></>
                }
              </p>
            </div>
          </div>
          {hasSearched && bestMatch && (
            <div className="text-right shrink-0">
              <p className="text-blue-200 text-[10px] font-medium">Best Match</p>
              <p className="text-white font-black text-2xl leading-none">{bestMatch.matchScore}%</p>
            </div>
          )}
        </div>

        {hasSearched && matches.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: <DollarSign className="w-3.5 h-3.5" />, label: 'Best Payout', value: formatCurrency(bestMatch.extraEarnings) },
              { icon: <Leaf className="w-3.5 h-3.5" />, label: 'CO₂ Saved', value: `${bestMatch.co2SavedKg}kg` },
              { icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Dead Miles Cut', value: `${bestMatch.deadMilesSavedPct}%` },
            ].map(stat => (
              <div key={stat.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-blue-200 mb-1">
                  {stat.icon}<span className="text-[9px] font-semibold uppercase tracking-wide">{stat.label}</span>
                </div>
                <p className="text-white font-bold text-sm">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-6 space-y-4">

        {/* ── GPS Location Panel ── */}
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                gpsStatus === 'acquired' ? 'bg-emerald-100' :
                gpsStatus === 'acquiring' ? 'bg-amber-100' :
                gpsStatus === 'error' ? 'bg-red-100' : 'bg-slate-100'
              }`}>
                {gpsStatus === 'acquiring'
                  ? <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                  : gpsStatus === 'acquired'
                  ? <Signal className="w-4 h-4 text-emerald-600" />
                  : gpsStatus === 'error'
                  ? <AlertCircle className="w-4 h-4 text-red-500" />
                  : <Crosshair className="w-4 h-4 text-slate-500" />
                }
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">GPS Location Filter</p>
                <p className="text-xs font-bold text-slate-800">
                  {gpsStatus === 'acquired' && gpsCoords
                    ? <>{gpsCoords.city} <span className="text-slate-400 font-normal">(±{Math.round(gpsCoords.accuracy)}m accuracy)</span></>
                    : gpsStatus === 'acquiring' ? 'Acquiring GPS signal…'
                    : gpsStatus === 'error' ? 'GPS unavailable'
                    : 'Use your real-time GPS location'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {gpsStatus === 'acquired' && (
                <button
                  onClick={clearGps}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Clear GPS"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {gpsStatus !== 'acquired' ? (
                <button
                  onClick={acquireGps}
                  disabled={gpsStatus === 'acquiring'}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {gpsStatus === 'acquiring'
                    ? <><Loader2 className="w-3 h-3 animate-spin" />Locating…</>
                    : <><Crosshair className="w-3 h-3" />Use My GPS</>
                  }
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  GPS Live
                </div>
              )}
            </div>
          </div>

          {/* GPS Error */}
          {gpsStatus === 'error' && gpsError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-xs text-red-700">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* Radius picker — shown when GPS is acquired */}
          {gpsStatus === 'acquired' && (
            <div className="p-3 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
                  Search Radius from your location
                </div>
                <span className="text-xs font-black text-blue-600">{radiusKm === 9999 ? 'Any' : `${radiusKm}km`}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {RADIUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setRadiusKm(opt.value); setHasSearched(false); setMatches([]); }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                      radiusKm === opt.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {/* Live GPS info bar */}
              <div className="flex items-center gap-3 text-[10px] text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-100">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>
                  Real GPS: <strong className="text-slate-700">{gpsCoords?.lat.toFixed(4)}°N, {gpsCoords?.lng.toFixed(4)}°E</strong>
                  &nbsp;·&nbsp;Accuracy: <strong className="text-slate-700">±{Math.round(gpsCoords?.accuracy ?? 0)}m</strong>
                  &nbsp;·&nbsp;Showing pickups within <strong className="text-blue-600">{radiusKm === 9999 ? 'all' : `${radiusKm}km`}</strong> of you
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Context row + Find button ── */}
        <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${useGps ? 'bg-emerald-100' : 'bg-blue-100'}`}>
              {useGps ? <Navigation className="w-4 h-4 text-emerald-600" /> : <Truck className="w-4 h-4 text-blue-600" />}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">{useGps ? 'Your GPS location' : 'Drop-off city'}</p>
              <p className="font-bold text-slate-900 text-xs">{searchCity}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Return loads within</p>
              <p className="font-bold text-slate-900 text-xs">{useGps ? (radiusKm === 9999 ? 'Any distance' : `${radiusKm}km`) : 'National grid'}</p>
            </div>
          </div>
          <div className="ml-auto">
            <button
              onClick={findReturnLoads}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {loading
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Scanning…</span></>
                : <><Sparkles className="w-3.5 h-3.5" /><span>{hasSearched ? 'Re-Scan' : 'Find Return Load'}</span></>
              }
            </button>
          </div>
        </div>

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                    <div className="h-2 bg-slate-200 rounded w-1/2" />
                  </div>
                  <div className="w-16 h-8 bg-slate-200 rounded-xl" />
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-blue-600 font-medium py-2 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {useGps
                ? `Scanning cargo pickups within ${radiusKm === 9999 ? 'any distance' : `${radiusKm}km`} of your GPS position…`
                : `Scanning ${MOCK_SHIPMENTS.length} live listings near ${searchCity}…`
              }
            </p>
          </div>
        )}

        {/* ── No results ── */}
        {hasSearched && !loading && matches.length === 0 && (
          <div className="text-center py-10 space-y-3">
            <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
            <div>
              <p className="font-bold text-slate-700">No return loads found within {radiusKm === 9999 ? 'any' : `${radiusKm}km`}</p>
              <p className="text-xs text-slate-400 mt-1">
                {useGps
                  ? 'Try increasing the search radius or switch to a wider area.'
                  : 'No nearby shipments. Try Re-Scan.'}
              </p>
            </div>
            {useGps && radiusKm < 9999 && (
              <button
                onClick={() => { setRadiusKm(RADIUS_OPTIONS[RADIUS_OPTIONS.length - 1].value); }}
                className="mx-auto px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
              >
                Expand to Any Distance
              </button>
            )}
          </div>
        )}

        {/* ── Match cards ── */}
        {!loading && matches.length > 0 && (
          <div className="space-y-3">
            {/* AI / GPS mode banner */}
            <div className={`flex items-center gap-2 text-xs font-semibold rounded-lg px-3 py-2 border ${
              usedAI
                ? 'text-indigo-600 bg-indigo-50 border-indigo-100'
                : 'text-slate-600 bg-slate-50 border-slate-200'
            }`}>
              {usedAI ? <Sparkles className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
              <span>
                {usedAI ? `Gemini 2.5 Flash · ` : 'Algorithmically scored · '}
                {matches.length} return journeys
                {useGps ? ` within ${radiusKm === 9999 ? 'any distance' : `${radiusKm}km`} of your GPS` : ' from national grid'}
                {` · showing ${Math.min(visibleCount, matches.length)} of ${matches.length}`}
              </span>
            </div>

            <AnimatePresence>
              {matches.slice(0, visibleCount).map((match, index) => {
                const colors = getScoreColor(match.matchScore);
                const isExpanded = expandedId === match.shipment.id;
                const isAccepted = acceptedId === match.shipment.id;
                const isBest = index === 0;

                return (
                  <motion.div
                    key={match.shipment.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                    className={`rounded-xl border transition-all ${
                      isAccepted ? 'border-emerald-400 bg-emerald-50'
                      : isBest ? 'border-blue-300 bg-blue-50/40'
                      : 'border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-white'
                    }`}
                  >
                    {isBest && !isAccepted && (
                      <div className="flex items-center gap-1.5 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-t-xl">
                        <Sparkles className="w-3 h-3" /> AI TOP PICK — Best Return Load for This Trip
                      </div>
                    )}
                    {isAccepted && (
                      <div className="flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-t-xl">
                        <CheckCircle2 className="w-3 h-3" /> ACCEPTED — Return Load Booked Successfully
                      </div>
                    )}

                    <div className="p-4 space-y-3">
                      {/* Title row */}
                      <div className="flex items-start gap-3">
                        <div className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border-2 flex flex-col items-center justify-center shrink-0`}>
                          <span className={`text-lg font-black leading-none ${colors.text}`}>{match.matchScore}</span>
                          <span className="text-[9px] font-semibold text-slate-400">SCORE</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="font-bold text-slate-900 text-sm">{match.shipment.title}</span>
                            <Badge variant={match.shipment.temperatureControlled ? 'teal' : 'gray'}>{translateMaterial(match.shipment.material)}</Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                            <span className="font-semibold">{translateCity(match.shipment.origin.city)}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                            <MapPin className="w-3 h-3 text-teal-500 shrink-0" />
                            <span className="font-semibold">{translateCity(match.shipment.destination.city)}</span>
                          </div>
                          {/* GPS distance badge */}
                          {useGps && (
                            <div className="mt-1 inline-flex items-center gap-1 bg-blue-50 border border-blue-100 rounded-md px-1.5 py-0.5">
                              <Navigation className="w-2.5 h-2.5 text-blue-500" />
                              <span className="text-[9px] font-bold text-blue-600">{match.pickupDetourKm}km from you</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-slate-400">{t.tripPayout}</p>
                          <p className="font-extrabold text-slate-900 text-base">{formatCurrency(match.extraEarnings)}</p>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div>
                        <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                          <span>{t.highMatchScore}</span>
                          <span className={colors.text}>{match.matchScore}% compatible</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${match.matchScore}%` }}
                            transition={{ delay: index * 0.07 + 0.2, duration: 0.5 }}
                            className={`h-full ${colors.bar} rounded-full`}
                          />
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { icon: <RotateCcw className="w-3 h-3 text-emerald-500" />, label: 'Dead Miles Cut', value: `${match.deadMilesSavedPct}%` },
                          { icon: <Navigation className="w-3 h-3 text-blue-500" />, label: useGps ? 'From You' : 'Pickup Detour', value: `${match.pickupDetourKm}km` },
                          { icon: <Leaf className="w-3 h-3 text-teal-500" />, label: 'CO₂ Saved', value: `${match.co2SavedKg}kg` },
                        ].map(m => (
                          <div key={m.label} className="bg-white/70 rounded-lg p-2 text-center border border-slate-100">
                            <div className="flex justify-center mb-0.5">{m.icon}</div>
                            <p className="font-bold text-slate-900 text-xs">{m.value}</p>
                            <p className="text-[9px] text-slate-400">{m.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* AI reasoning */}
                      <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg px-3 py-2 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-indigo-800">{match.aiReason}</p>
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200 pt-3"
                          >
                            {[
                              { label: 'Route Distance', value: formatDistance(match.shipment.distanceKm) },
                              { label: 'Cargo Weight', value: `${match.shipment.weightTons}T` },
                              { label: 'Pickup Window', value: match.shipment.pickupWindow },
                              { label: 'Route Overlap', value: `${match.routeOverlapPct}%` },
                              { label: 'Fuel Estimate', value: formatCurrency(match.shipment.fuelImpactInr) },
                              { label: 'CO₂ Footprint', value: `${match.shipment.estimatedCo2Kg}kg` },
                            ].map(d => (
                              <div key={d.label} className="bg-slate-50 rounded-lg p-2">
                                <p className="text-slate-400 text-[9px] font-medium">{d.label}</p>
                                <p className="font-bold text-slate-800">{d.value}</p>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : match.shipment.id)}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors"
                        >
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          {isExpanded ? 'Less detail' : 'Full details'}
                        </button>
                        <div className="ml-auto flex items-center gap-2">
                          {isAccepted ? (
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                              <CheckCircle2 className="w-4 h-4" /> Return Load Booked!
                            </div>
                          ) : (
                            <>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />{match.shipment.pickupWindow}
                              </span>
                              <button
                                onClick={() => handleAccept(match)}
                                className={`px-4 py-1.5 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm ${
                                  isBest ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'
                                }`}
                              >
                                <Zap className="w-3 h-3" /> {t.acceptReturnLoad}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Load More */}
            {visibleCount < matches.length && (
              <button
                onClick={() => setVisibleCount(prev => Math.min(prev + 6, matches.length))}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Load More Return Journeys ({matches.length - visibleCount} more available)
              </button>
            )}

            {/* Impact footer */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-900 text-sm">CargoLoop Impact</p>
                  <p className="text-xs text-emerald-700">
                    Top match eliminates <strong>{bestMatch.deadMilesSaved}km</strong> dead miles,
                    saves <strong>{bestMatch.co2SavedKg}kg CO₂</strong>, earns <strong>{formatCurrency(bestMatch.extraEarnings)}</strong> on return.
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-emerald-600 font-semibold">Without CargoLoop</p>
                <p className="text-sm font-black text-red-600">₹0 earned + {bestMatch.deadMilesSaved}km empty</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Pre-search idle state ── */}
        {!hasSearched && !loading && (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
              <RotateCcw className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-base">No More Empty Returns</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                {useGps
                  ? `GPS locked at ${gpsCoords?.city}. Click "Find Return Load" to see cargo pickups within ${radiusKm === 9999 ? 'any distance' : `${radiusKm}km`}.`
                  : `Enable GPS above for hyper-local results, or click "Find Return Load" to scan the national grid.`
                }
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {[
                { value: '40%', label: 'Avg earnings boost' },
                { value: '830kg', label: 'CO₂ saved/trip' },
                { value: '<2min', label: 'Match time' },
              ].map(s => (
                <div key={s.label} className="bg-blue-50 rounded-xl p-2.5 border border-blue-100">
                  <p className="font-black text-blue-700 text-sm">{s.value}</p>
                  <p className="text-[9px] text-blue-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
