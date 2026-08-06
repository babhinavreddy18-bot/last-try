import React, { useState } from 'react';
import { MOCK_SHIPMENTS, MOCK_TRUCKS } from '../mock/data';
import type { Shipment } from '../types';
import { NLPShipmentParser } from '../components/ai/NLPShipmentParser';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { formatCurrency, formatDistance } from '../utils/formatters';
import { PackageCheck, Truck as TruckIcon, Clock, DollarSign, ArrowRight, ShieldCheck, MapPin, X } from 'lucide-react';

export const ShipperDashboardPage: React.FC = () => {
  const activeShipments = MOCK_SHIPMENTS.slice(0, 5);
  const [trackedShipment, setTrackedShipment] = useState<Shipment | null>(null);

  const selectedTrackedTruck = trackedShipment?.assignedTruckId
    ? MOCK_TRUCKS.find((t) => t.id === trackedShipment.assignedTruckId) || MOCK_TRUCKS[0]
    : MOCK_TRUCKS[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shipper AI Logistics Hub</h1>
          <p className="text-xs text-slate-500 font-medium">Book cargo via NLP, dynamic pricing benchmarks & live carrier matching</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="blue" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            Verified Shipper Tier
          </Badge>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <NLPShipmentParser />

      {/* Live Map & Active Shipments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Live Available Carriers Map
              </h3>
              <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">Real-time</span>
            </div>
            <InteractiveMap trucks={MOCK_TRUCKS} className="h-[500px]" />
          </div>
        </div>

        {/* Right Column: Active Shipments Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Active Cargo Listings & Status</h3>
              <span className="text-xs text-slate-500 font-medium">Sorted by pickup priority</span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {MOCK_SHIPMENTS.slice(0, 16).map((shp) => (
                <div
                  key={shp.id}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{shp.title}</span>
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

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>Weight: <strong className="text-slate-800">{shp.weightTons}T</strong></span>
                      <span>Est. Price: <strong className="text-slate-800">{formatCurrency(shp.estimatedPriceInr)}</strong></span>
                      <span>Dist: <strong className="text-slate-800">{formatDistance(shp.distanceKm)}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTrackedShipment(shp)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-colors shrink-0"
                    >
                      View Telemetry
                    </button>
                    <button
                      onClick={() => setTrackedShipment(shp)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-2xs flex items-center gap-1 transition-colors shrink-0"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
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
              <InteractiveMap trucks={[selectedTrackedTruck]} selectedTruckId={selectedTrackedTruck.id} className="h-[250px]" />

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
