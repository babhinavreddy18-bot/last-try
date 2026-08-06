import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_SHIPMENTS, MOCK_TRUCKS } from '../mock/data';
import type { Shipment } from '../types';
import { NLPShipmentParser } from '../components/ai/NLPShipmentParser';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { formatCurrency, formatDistance } from '../utils/formatters';
import { PackageCheck, Truck as TruckIcon, Clock, DollarSign, ArrowRight, ShieldCheck, MapPin, X, ArrowUpDown } from 'lucide-react';

import { ErpWmsIntegration } from '../components/ai/ErpWmsIntegration';

export const ShipperDashboardPage: React.FC = () => {
  const location = useLocation();
  const [trackedShipment, setTrackedShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    if (location.hash === '#erp-wms-sharing') {
      setTimeout(() => {
        document.getElementById('ai-erp-wms-sharing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (location.hash === '#nlp-pricing') {
      setTimeout(() => {
        document.getElementById('ai-nlp-pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (location.hash === '#dynamic-benchmarks') {
      setTimeout(() => {
        document.getElementById('ai-dynamic-benchmarks')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.hash]);

  const selectedTrackedTruck = trackedShipment?.assignedTruckId
    ? MOCK_TRUCKS.find((t) => t.id === trackedShipment.assignedTruckId) || MOCK_TRUCKS[0]
    : MOCK_TRUCKS[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shipper AI Logistics Hub</h1>
          <p className="text-xs text-slate-500 font-medium">Book cargo via NLP, ERP/WMS automated data sharing & live carrier matching</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="blue" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            Verified Shipper Tier
          </Badge>
        </div>
      </div>

      {/* ══ ERP & WMS AUTOMATED DATA SHARING HUB ══ */}
      <div id="ai-erp-wms-sharing" className="scroll-mt-20">
        <ErpWmsIntegration />
      </div>

      {/* Metrics Row */}
      <div id="ai-dynamic-benchmarks" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 scroll-mt-20">
        <StatCard
          title="Active Shipments"
          value="18 Cargoes"
          change="+4 today"
          icon={<PackageCheck className="w-5 h-5" />}
          accentColor="blue"
        />
        <StatCard
          title="Avg Freight Savings"
          value="14.2%"
          change="via AI Pricing"
          icon={<DollarSign className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          title="Matched Carriers"
          value="42 Trucks"
          change="Available nearby"
          icon={<TruckIcon className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          title="Avg Delivery Speed"
          value="99.1%"
          change="On-time ETA"
          icon={<Clock className="w-5 h-5" />}
          accentColor="amber"
        />
      </div>

      {/* Natural Language Creator & Pricing Engine */}
      <div id="ai-nlp-pricing" className="scroll-mt-20">
        <NLPShipmentParser />
      </div>

      {/* Live Map & Active Shipments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
                Live Available Carriers Map
              </h3>
              <span className="text-[11px] text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded">Real-time</span>
            </div>
            <InteractiveMap trucks={MOCK_TRUCKS} className="h-[500px]" />
          </div>
        </div>

        {/* Right Column: Active Shipments Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Active Cargo Listings & Status</h3>
              <span className="text-[11px] text-purple-300 font-extrabold bg-purple-500/20 border border-purple-500/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
                <span>Sorted by pickup priority</span>
              </span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {MOCK_SHIPMENTS.slice(0, 16).map((shp) => (
                <div
                  key={shp.id}
                  className="bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{shp.title}</span>
                      <Badge
                        variant={
                          shp.status === 'in-transit'
                            ? 'blue'
                            : shp.status === 'delivered'
                            ? 'green'
                            : 'amber'
                        }
                      >
                        {shp.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span>Weight: <strong className="text-slate-800 dark:text-slate-200">{shp.weightTons}T</strong></span>
                      <span>Est. Price: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(shp.estimatedPriceInr)}</strong></span>
                      <span>Dist: <strong className="text-slate-800 dark:text-slate-200">{formatDistance(shp.distanceKm)}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTrackedShipment(shp)}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg border border-slate-200 dark:border-slate-600 transition-colors shrink-0 cursor-pointer"
                    >
                      View Telemetry
                    </button>
                    <button
                      onClick={() => setTrackedShipment(shp)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-2xs flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                    >
                      <span>Track Truck</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Track Shipment Modal */}
      {trackedShipment && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{trackedShipment.title}</h3>
                <p className="text-xs text-slate-500">Tracking Code: {trackedShipment.id}</p>
              </div>
              <button
                onClick={() => setTrackedShipment(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <InteractiveMap
                trucks={[selectedTrackedTruck]}
                selectedTruckId={selectedTrackedTruck.id}
                activeRoute={{
                  origin: trackedShipment.origin,
                  destination: trackedShipment.destination,
                  title: trackedShipment.title,
                  driverName: selectedTrackedTruck.driverName,
                  truckId: selectedTrackedTruck.plateNumber,
                  speedKmH: 94,
                  nextStopEta: selectedTrackedTruck.etaMinutes ? `${selectedTrackedTruck.etaMinutes}m` : '1h 36m',
                  temperatureC: trackedShipment.temperatureTargetCelsius || 4,
                  fuelPercent: 67,
                }}
                onCloseRoute={() => setTrackedShipment(null)}
                className="h-[360px]"
              />

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-medium">Assigned Driver:</span>
                  <p className="font-bold text-slate-900">{selectedTrackedTruck.driverName} (⭐{selectedTrackedTruck.driverRating})</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">ETA to Destination:</span>
                  <p className="font-bold text-blue-600">{selectedTrackedTruck.etaMinutes ? `${selectedTrackedTruck.etaMinutes} Mins` : 'In Transit'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setTrackedShipment(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Close Telemetry Tracker
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
