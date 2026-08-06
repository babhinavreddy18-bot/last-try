import React, { useState, useEffect } from 'react';
import type { Truck, TruckStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Truck as TruckIcon, Navigation, Thermometer, Maximize2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import clsx from 'clsx';

interface InteractiveMapProps {
  trucks: Truck[];
  selectedTruckId?: string;
  onSelectTruck?: (truck: Truck) => void;
  className?: string;
}

// Controller component to handle map flying & bounds recalculation
const MapViewController: React.FC<{
  trucks: Truck[];
  selectedTruck?: Truck;
  resetTrigger: number;
}> = ({ trucks, selectedTruck, resetTrigger }) => {
  const map = useMap();

  // Re-center on selected truck smoothly when selectedTruck changes
  useEffect(() => {
    if (selectedTruck) {
      map.flyTo([selectedTruck.currentLocation.lat, selectedTruck.currentLocation.lng], 10, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [selectedTruck, map]);

  // Fit bounds when resetTrigger fires
  useEffect(() => {
    if (resetTrigger > 0 && trucks.length > 0) {
      const bounds = L.latLngBounds(trucks.map((t) => [t.currentLocation.lat, t.currentLocation.lng]));
      map.flyToBounds(bounds, { padding: [40, 40], animate: true, duration: 1.2 });
    }
  }, [resetTrigger, trucks, map]);

  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  trucks,
  selectedTruckId,
  onSelectTruck,
  className,
}) => {
  const [activeFilter, setActiveFilter] = useState<TruckStatus | 'all'>('all');
  const [resetTrigger, setResetTrigger] = useState(0);

  const filteredTrucks = trucks.filter((t) => (activeFilter === 'all' ? true : t.status === activeFilter));
  const selectedTruck = trucks.find((t) => t.id === selectedTruckId);

  // Major Indian Logistics Corridors (coordinates [lat, lng])
  const corridorDelhiMumbaiPuneBengaluruChennai: [number, number][] = [
    [28.7041, 77.1025], // Delhi
    [23.0225, 72.5714], // Ahmedabad
    [19.076, 72.8777],  // Mumbai
    [18.5204, 73.8567],  // Pune
    [17.385, 78.4867],   // Hyderabad
    [12.9716, 77.5946],  // Bengaluru
    [13.0827, 80.2707],  // Chennai
  ];

  const corridorKolkata: [number, number][] = [
    [22.5726, 88.3639], // Kolkata
    [17.385, 78.4867],   // Hyderabad
  ];

  // Helper to create custom animated Leaflet DivIcon for trucks
  const createCustomTruckIcon = (truck: Truck, isSelected: boolean) => {
    const statusColors: Record<TruckStatus, string> = {
      available: '#0D9488', // Teal
      'in-transit': '#2563EB', // Royal Blue
      maintenance: '#E11D48', // Red
      offline: '#64748B',
    };

    const color = statusColors[truck.status];

    const html = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; cursor: pointer;">
        ${
          truck.status === 'in-transit'
            ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: ${color}; opacity: 0.3; animation: pulse-ring 2s infinite ease-in-out;"></div>`
            : ''
        }
        <div style="
          position: absolute;
          width: ${isSelected ? '28px' : '22px'};
          height: ${isSelected ? '28px' : '22px'};
          border-radius: 50%;
          background-color: ${color};
          opacity: 0.25;
          transition: all 0.2s ease;
        "></div>
        <div style="
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: ${color};
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.4);
          z-index: 10;
        "></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-truck-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -14],
    });
  };

  return (
    <div className={clsx('relative rounded-2xl overflow-hidden shadow-card border border-slate-200 bg-slate-900', className)}>
      {/* Map Header & Filter Controls */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md text-xs">
        <span className="text-slate-500 font-bold px-1.5 text-[11px] uppercase tracking-wider">Fleet Filter:</span>
        {(['all', 'available', 'in-transit', 'maintenance'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setActiveFilter(st)}
            className={clsx(
              'px-2.5 py-1 rounded-lg font-bold capitalize transition-all text-xs',
              activeFilter === st
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}
          >
            {st} ({st === 'all' ? trucks.length : trucks.filter((t) => t.status === st).length})
          </button>
        ))}

        <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Smooth Fit All / Re-center Button */}
        <button
          onClick={() => setResetTrigger((prev) => prev + 1)}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1 text-xs"
          title="Smooth fit map to all active fleet locations"
        >
          <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Fit All Fleet</span>
        </button>
      </div>

      {/* Leaflet Map Canvas with Smooth Zooming and Inertia */}
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        zoomSnap={0.5}
        zoomDelta={0.5}
        wheelDebounceTime={40}
        inertia={true}
        inertiaDeceleration={3000}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[250px] z-10"
      >
        <MapViewController trucks={filteredTrucks} selectedTruck={selectedTruck} resetTrigger={resetTrigger} />

        {/* CartoDB Voyager Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Corridor Route Lines */}
        <Polyline positions={corridorDelhiMumbaiPuneBengaluruChennai} pathOptions={{ color: '#2563EB', weight: 2.5, dashArray: '6, 6', opacity: 0.7 }} />
        <Polyline positions={corridorKolkata} pathOptions={{ color: '#0D9488', weight: 2.5, dashArray: '6, 6', opacity: 0.7 }} />

        {/* Truck Markers */}
        {filteredTrucks.map((truck) => {
          const isSelected = selectedTruckId === truck.id;
          return (
            <Marker
              key={truck.id}
              position={[truck.currentLocation.lat, truck.currentLocation.lng]}
              icon={createCustomTruckIcon(truck, isSelected)}
              eventHandlers={{
                click: () => onSelectTruck?.(truck),
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 space-y-2 text-slate-800 font-sans min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <div>
                      <div className="flex items-center gap-1 font-extrabold text-slate-900 text-xs">
                        <TruckIcon className="w-3.5 h-3.5 text-blue-600 inline" />
                        <span>{truck.plateNumber}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">{truck.model}</p>
                    </div>
                    <Badge
                      size="sm"
                      variant={
                        truck.status === 'available'
                          ? 'teal'
                          : truck.status === 'in-transit'
                          ? 'blue'
                          : 'red'
                      }
                    >
                      {truck.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400 font-medium">Location:</span>
                      <p className="font-semibold text-slate-800 truncate">{truck.currentLocation.city}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Driver:</span>
                      <p className="font-semibold text-slate-800 truncate">{truck.driverName}</p>
                    </div>
                  </div>

                  {truck.destination && (
                    <div className="text-[11px] bg-blue-50/80 p-1.5 rounded border border-blue-100 text-blue-900 flex items-center justify-between">
                      <span>Dest: <strong>{truck.destination.city}</strong></span>
                      {truck.etaMinutes ? <span className="font-bold text-blue-700">{truck.etaMinutes}m ETA</span> : null}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-blue-600" />
                      Cap: {truck.capacityTons}T
                    </span>
                    {truck.temperatureControlled && (
                      <span className="flex items-center gap-1 text-teal-700 font-bold">
                        <Thermometer className="w-3 h-3" /> Cold
                      </span>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
