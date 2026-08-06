import React, { useState } from 'react';
import { parseShipmentPrompt, type ExtractedShipmentDetails } from '../../services/geminiService';
import { MOCK_TRUCKS } from '../../mock/data';
import type { Truck } from '../../types';
import { formatCurrency, formatDistance, formatCO2, calculateETA } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Sparkles, Truck as TruckIcon, Thermometer, ArrowRight, Zap, RefreshCw, DollarSign, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const NLPShipmentParser: React.FC = () => {
  const [prompt, setPrompt] = useState(
    'Need to transport 12 tons of frozen food from Mumbai to Pune tomorrow morning'
  );
  const [parsing, setParsing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [assignedCarrier, setAssignedCarrier] = useState<Truck | null>(null);

  const [details, setDetails] = useState<ExtractedShipmentDetails | null>({
    title: '12T Refrigerated Cargo (Mumbai → Pune)',
    material: 'Frozen Dairy & Processed Food',
    weightTons: 12,
    temperatureControlled: true,
    originCity: 'Mumbai',
    destinationCity: 'Pune',
    distanceKm: 148,
    estimatedPriceInr: 11500,
    suggestedPriceMinInr: 10800,
    suggestedPriceMaxInr: 12400,
    fuelImpactInr: 4200,
    estimatedCo2Kg: 390,
    pickupWindow: 'Tomorrow 08:00 AM - 12:00 PM',
  });

  const handleParse = async () => {
    if (!prompt.trim()) return;
    setParsing(true);
    try {
      const res = await parseShipmentPrompt(prompt);
      setDetails(res);
    } catch (err) {
      console.error('NLP Parse error:', err);
    } finally {
      setParsing(false);
    }
  };

  const samplePrompts = [
    'Need 15 tons of steel pipes from Delhi to Mumbai next Monday',
    'Transport 8 tons of pharmaceuticals in cold chain from Bengaluru to Chennai',
    'Ship 20 tons of FMCG goods from Hyderabad to Pune tomorrow',
  ];

  const recommendedTrucks = MOCK_TRUCKS.filter(
    (t) => t.status === 'available' || t.status === 'in-transit'
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* NLP Prompt Box Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Natural Language Freight Creator</h3>
            <p className="text-xs text-slate-500">Powered by Gemini 2.5 Flash for instant cargo extraction</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Need to transport 12 tons of frozen food from Mumbai to Pune tomorrow morning..."
              className="w-full p-3.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 font-medium text-slate-900 resize-none"
            />
            <button
              onClick={handleParse}
              disabled={parsing || !prompt.trim()}
              className="absolute bottom-3 right-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {parsing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-300" />}
              <span>{parsing ? 'Parsing...' : 'Generate Shipment'}</span>
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400">Quick Samples:</span>
            {samplePrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(s);
                  parseShipmentPrompt(s).then(setDetails);
                }}
                className="text-[11px] font-medium text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-md border border-slate-200 transition-colors truncate max-w-[280px] cursor-pointer"
              >
                "{s}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Extracted Details & Dynamic AI Pricing Card */}
      {details && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Extracted Parameters Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-4 lg:col-span-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Extracted Cargo</span>
              {details.temperatureControlled && (
                <Badge variant="teal" icon={<Thermometer className="w-3 h-3" />}>
                  Cold Chain
                </Badge>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Cargo Title:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{details.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium">Weight:</span>
                  <p className="font-semibold text-slate-800">{details.weightTons} Tons</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Material:</span>
                  <p className="font-semibold text-slate-800">{details.material}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 font-medium">Route Corridor:</span>
                <div className="flex items-center gap-2 mt-1 font-bold text-slate-900">
                  <span>{details.originCity}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  <span>{details.destinationCity}</span>
                  <span className="text-xs text-slate-500 font-normal">({formatDistance(details.distanceKm)})</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 font-medium">Pickup Window:</span>
                <p className="font-semibold text-slate-800">{details.pickupWindow}</p>
              </div>
            </div>
          </div>

          {/* Dynamic AI Freight Pricing Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-card space-y-5 lg:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Dynamic AI Freight Pricing Card</h4>
                  <p className="text-xs text-slate-400">Benchmarked against fuel indices & backhaul demand</p>
                </div>
              </div>
              <Badge variant="teal">AI Guaranteed Rate</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Recommended Rate</span>
                <div className="text-2xl font-black text-white mt-0.5">
                  {formatCurrency(details.estimatedPriceInr)}
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Optimal Market Benchmark</span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Suggested Range</span>
                <div className="text-sm font-bold text-slate-200 mt-1">
                  {formatCurrency(details.suggestedPriceMinInr)} - {formatCurrency(details.suggestedPriceMaxInr)}
                </div>
                <span className="text-[11px] text-slate-400">Flexibility bandwidth</span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Fuel & CO₂ Impact</span>
                <div className="text-sm font-bold text-amber-300 mt-1">
                  {formatCurrency(details.fuelImpactInr)} fuel
                </div>
                <span className="text-[11px] text-slate-400">{formatCO2(details.estimatedCo2Kg)} est. CO₂</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-300">
              <span>Estimated Transit Duration: <strong>{calculateETA(details.distanceKm)}</strong></span>
              <button
                onClick={() => setPublishedSuccess(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Publish Shipment Listing →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Recommended Trucks List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TruckIcon className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-base">AI Ranked & Matched Carriers</h4>
          </div>
          <span className="text-xs text-slate-500 font-medium">Ranked by Match Score (%) & ETA</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedTrucks.map((truck) => (
            <div
              key={truck.id}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-subtle transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{truck.plateNumber}</h5>
                  <p className="text-[11px] text-slate-500">{truck.model}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-lg border border-emerald-200">
                  {truck.matchScore}% Match
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver:</span>
                  <span className="font-semibold">{truck.driverName} (⭐{truck.driverRating})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Capacity:</span>
                  <span className="font-semibold">{truck.capacityTons} Tons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ETA to Pickup:</span>
                  <span className="font-semibold text-blue-600">{truck.etaMinutes} mins</span>
                </div>
              </div>

              <button
                onClick={() => setAssignedCarrier(truck)}
                className="w-full py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Select & Assign Carrier
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Published Success Modal */}
      {publishedSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Shipment Published to CargoLoop Grid!</h3>
              <p className="text-xs text-slate-500 mt-1">Carriers are currently bidding. You will be notified when a truck confirms.</p>
            </div>
            <button
              onClick={() => setPublishedSuccess(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Assigned Carrier Modal */}
      {assignedCarrier && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
              <TruckIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Carrier {assignedCarrier.plateNumber} Assigned!</h3>
              <p className="text-xs text-slate-500 mt-1">Driver <strong>{assignedCarrier.driverName}</strong> (⭐{assignedCarrier.driverRating}) has accepted the dispatch request.</p>
            </div>
            <button
              onClick={() => setAssignedCarrier(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              View Dispatch Tracking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
