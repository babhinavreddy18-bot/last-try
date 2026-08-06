import React, { useState, useEffect } from 'react';
import type { Truck, TruckStatus } from '../../types';
import { Navigation, Thermometer, Maximize2, Clock, Gauge, Fuel, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import clsx from 'clsx';

export interface ActiveRouteInfo {
  origin: { lat: number; lng: number; city: string };
  destination: { lat: number; lng: number; city: string };
  title?: string;
  driverName?: string;
  truckId?: string;
  speedKmH?: number;
  nextStopEta?: string;
  temperatureC?: number;
  fuelPercent?: number;
}

interface InteractiveMapProps {
  trucks: Truck[];
  selectedTruckId?: string;
  activeRoute?: ActiveRouteInfo | null;
  singleRouteOnly?: boolean;
  onSelectTruck?: (truck: Truck) => void;
  onCloseRoute?: () => void;
  className?: string;
}

// Cache for OSRM highway route geometries
const routePolylineCache: Record<string, [number, number][]> = {};

// Fallback curve generator for National Highways when OSRM API is loading or offline
const getCurvedHighwayPoints = (
  p1: [number, number],
  p2: [number, number],
  steps: number = 24
): [number, number][] => {
  const points: [number, number][] = [];
  const midLat = (p1[0] + p2[0]) / 2;
  const midLng = (p1[1] + p2[1]) / 2;

  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const offset = 0.08;
  const ctrlLat = midLat - dy * offset;
  const ctrlLng = midLng + dx * offset;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = (1 - t) * (1 - t) * p1[0] + 2 * (1 - t) * t * ctrlLat + t * t * p2[0];
    const lng = (1 - t) * (1 - t) * p1[1] + 2 * (1 - t) * t * ctrlLng + t * t * p2[1];
    points.push([lat, lng]);
  }
  return points;
};

// Controller component to handle map flying & bounds recalculation
const MapViewController: React.FC<{
  trucks: Truck[];
  selectedTruck?: Truck;
  activeRoute?: ActiveRouteInfo | null;
  highwayPolyline?: [number, number][] | null;
  resetTrigger: number;
}> = ({ trucks, selectedTruck, activeRoute, highwayPolyline, resetTrigger }) => {
  const map = useMap();

  useEffect(() => {
    if (highwayPolyline && highwayPolyline.length > 0) {
      const bounds = L.latLngBounds(highwayPolyline);
      map.flyToBounds(bounds, { padding: [80, 80], animate: true, duration: 1.8, easeLinearity: 0.15 });
    } else if (activeRoute) {
      const bounds = L.latLngBounds([
        [activeRoute.origin.lat, activeRoute.origin.lng],
        [activeRoute.destination.lat, activeRoute.destination.lng],
      ]);
      map.flyToBounds(bounds, { padding: [80, 80], animate: true, duration: 1.8, easeLinearity: 0.15 });
    } else if (selectedTruck) {
      map.flyTo([selectedTruck.currentLocation.lat, selectedTruck.currentLocation.lng], 10, {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.15,
      });
    }
  }, [activeRoute, highwayPolyline, selectedTruck, map]);

  useEffect(() => {
    if (resetTrigger > 0 && trucks.length > 0) {
      const bounds = L.latLngBounds(trucks.map((t) => [t.currentLocation.lat, t.currentLocation.lng]));
      map.flyToBounds(bounds, { padding: [60, 60], animate: true, duration: 1.5, easeLinearity: 0.15 });
    }
  }, [resetTrigger, trucks, map]);

  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  trucks,
  selectedTruckId,
  activeRoute,
  singleRouteOnly = false,
  onSelectTruck,
  onCloseRoute,
  className,
}) => {
  const [activeFilter, setActiveFilter] = useState<TruckStatus | 'all'>('all');
  const [resetTrigger, setResetTrigger] = useState(0);
  const [activeHighwayPolyline, setActiveHighwayPolyline] = useState<[number, number][] | null>(null);
  const [glidingTruckPos, setGlidingTruckPos] = useState<[number, number] | null>(null);

  const filteredTrucks = singleRouteOnly
    ? trucks.filter((t) => t.id === selectedTruckId || t.status === 'in-transit').slice(0, 1)
    : trucks.filter((t) => (activeFilter === 'all' ? true : t.status === activeFilter));

  const selectedTruck = trucks.find((t) => t.id === selectedTruckId) || trucks[0];

  useEffect(() => {
    if (!activeRoute) {
      setActiveHighwayPolyline(null);
      setGlidingTruckPos(null);
      return;
    }

    const key = `${activeRoute.origin.lat.toFixed(4)},${activeRoute.origin.lng.toFixed(4)}_${activeRoute.destination.lat.toFixed(4)},${activeRoute.destination.lng.toFixed(4)}`;

    if (routePolylineCache[key]) {
      setActiveHighwayPolyline(routePolylineCache[key]);
      return;
    }

    let isMounted = true;

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${activeRoute.origin.lng},${activeRoute.origin.lat};${activeRoute.destination.lng},${activeRoute.destination.lat}?overview=full&geometries=geojson`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.routes && data.routes[0] && data.routes[0].geometry && data.routes[0].geometry.coordinates) {
          const rawCoords = data.routes[0].geometry.coordinates as [number, number][];
          const leafCoords: [number, number][] = rawCoords.map(([lng, lat]) => [lat, lng]);
          routePolylineCache[key] = leafCoords;
          setActiveHighwayPolyline(leafCoords);
        } else {
          const fallback = getCurvedHighwayPoints(
            [activeRoute.origin.lat, activeRoute.origin.lng],
            [activeRoute.destination.lat, activeRoute.destination.lng]
          );
          routePolylineCache[key] = fallback;
          setActiveHighwayPolyline(fallback);
        }
      })
      .catch(() => {
        if (isMounted) {
          const fallback = getCurvedHighwayPoints(
            [activeRoute.origin.lat, activeRoute.origin.lng],
            [activeRoute.destination.lat, activeRoute.destination.lng]
          );
          setActiveHighwayPolyline(fallback);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeRoute]);

  // 60FPS Continuous Gliding Truck Motion Loop along turn-by-turn polyline
  useEffect(() => {
    if (!activeHighwayPolyline || activeHighwayPolyline.length < 2) {
      if (activeRoute) {
        setGlidingTruckPos([
          activeRoute.origin.lat + (activeRoute.destination.lat - activeRoute.origin.lat) * 0.42,
          activeRoute.origin.lng + (activeRoute.destination.lng - activeRoute.origin.lng) * 0.42,
        ]);
      } else {
        setGlidingTruckPos(null);
      }
      return;
    }

    let animId: number;
    let progress = 0.15;
    const totalPoints = activeHighwayPolyline.length;

    const animateTruck = () => {
      progress += 0.0007; // smooth highway cruising speed
      if (progress > 0.88) progress = 0.15;

      const floatIndex = progress * (totalPoints - 1);
      const index1 = Math.floor(floatIndex);
      const index2 = Math.min(index1 + 1, totalPoints - 1);
      const t = floatIndex - index1;

      const p1 = activeHighwayPolyline[index1];
      const p2 = activeHighwayPolyline[index2];

      const lat = p1[0] + (p2[0] - p1[0]) * t;
      const lng = p1[1] + (p2[1] - p1[1]) * t;

      setGlidingTruckPos([lat, lng]);
      animId = requestAnimationFrame(animateTruck);
    };

    animId = requestAnimationFrame(animateTruck);
    return () => cancelAnimationFrame(animId);
  }, [activeHighwayPolyline, activeRoute]);

  // Split active highway polyline into 3 segments: On Route (cyan), Stops (green), Traffic (red)
  const polyLen = activeHighwayPolyline ? activeHighwayPolyline.length : 0;
  const seg1 = activeHighwayPolyline ? activeHighwayPolyline.slice(0, Math.floor(polyLen * 0.55)) : [];
  const seg2 = activeHighwayPolyline ? activeHighwayPolyline.slice(Math.floor(polyLen * 0.53), Math.floor(polyLen * 0.80)) : [];
  const seg3 = activeHighwayPolyline ? activeHighwayPolyline.slice(Math.floor(polyLen * 0.78)) : [];

  // Major Indian Logistics Corridors
  const corridorDelhiMumbaiPuneBengaluruChennai: [number, number][] = [
    [28.7041, 77.1025], [23.0225, 72.5714], [19.076, 72.8777], [18.5204, 73.8567], [17.385, 78.4867], [12.9716, 77.5946], [13.0827, 80.2707]
  ];

  const createCustomTruckIcon = (truck: Truck, isSelected: boolean) => {
    const statusColors: Record<TruckStatus, string> = {
      available: '#0D9488',
      'in-transit': '#06B6D4',
      maintenance: '#E11D48',
      offline: '#64748B',
    };

    const color = statusColors[truck.status];

    const html = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; cursor: pointer;">
        <div style="position: absolute; width: 52px; height: 52px; border-radius: 50%; border: 2px solid #FFFFFF; box-shadow: 0 0 16px rgba(6, 182, 212, 0.8); animation: pulse-ring 2s infinite cubic-bezier(0.4, 0, 0.6, 1);"></div>
        <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%);"></div>
        <div style="
          position: relative;
          width: ${isSelected ? '38px' : '32px'};
          height: ${isSelected ? '38px' : '32px'};
          border-radius: 12px;
          background: linear-gradient(135deg, ${color} 0%, #090D16 100%);
          border: 2px solid #FFFFFF;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 10;
        ">
          <svg width="${isSelected ? '22' : '18'}" height="${isSelected ? '22' : '18'}" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="2" fill="white" fill-opacity="0.3"/>
            <path d="M16 8h4l3 3v5h-7V8z" fill="white" fill-opacity="0.4"/>
            <circle cx="5.5" cy="18.5" r="2" fill="#0F172A" stroke="white" stroke-width="1.2"/>
            <circle cx="18.5" cy="18.5" r="2" fill="#0F172A" stroke="white" stroke-width="1.2"/>
          </svg>
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-truck-marker',
      iconSize: [56, 56],
      iconAnchor: [28, 28],
      popupAnchor: [0, -20],
    });
  };

  const createPinIcon = (color: string, label: string) => {
    const html = `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="background-color: ${color}; color: #ffffff; font-weight: 800; font-size: 11px; padding: 4px 12px; border-radius: 9999px; box-shadow: 0 4px 14px rgba(0,0,0,0.5); border: 2px solid #ffffff; white-space: nowrap;">
          ${label}
        </div>
        <div style="width: 3px; height: 12px; background-color: ${color};"></div>
      </div>
    `;
    return L.divIcon({
      html,
      className: 'custom-route-pin',
      iconSize: [120, 36],
      iconAnchor: [60, 36],
    });
  };

  const isNavActive = Boolean(activeRoute || selectedTruck);
  const activeTruckTitle = activeRoute?.truckId || selectedTruck?.plateNumber || 'TRK-02';
  const activeDriverName = activeRoute?.driverName || selectedTruck?.driverName || 'Carlos Rivera';
  const activeSpeed = activeRoute?.speedKmH || 94;
  const activeEta = activeRoute?.nextStopEta || (selectedTruck?.etaMinutes ? `${selectedTruck.etaMinutes}m` : '1h 36m');
  const activeTemp = activeRoute?.temperatureC !== undefined ? `${activeRoute.temperatureC}°C` : (selectedTruck?.temperatureControlled ? '4°C' : 'Ambient');
  const activeFuel = activeRoute?.fuelPercent || 67;

  return (
    <div className={clsx('relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 font-sans', className)}>
      
      {/* ── 1. Top Legend Overlay ── */}
      <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 shadow-2xl flex items-center gap-4 text-xs text-white font-bold">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400 shadow-glow-blue inline-block" />
          <span>On Route</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 inline-block" />
          <span>Stops</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
          <span>Traffic</span>
        </span>
      </div>

      {/* Map Filter Controls */}
      {!singleRouteOnly && !activeRoute && (
        <div className="absolute top-4 right-4 z-[400] flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-md text-xs">
          {(['all', 'available', 'in-transit'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={clsx(
                'px-2.5 py-1 rounded-lg font-bold capitalize transition-all text-xs cursor-pointer',
                activeFilter === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              {st}
            </button>
          ))}
          <button
            onClick={() => setResetTrigger((prev) => prev + 1)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      )}

      {/* ── 2. Bottom Floating Telemetry HUD Card ── */}
      {isNavActive && (
        <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/95 backdrop-blur-xl p-4.5 rounded-2xl border border-slate-800 shadow-2xl text-white w-72 sm:w-80 space-y-3 font-sans animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-sm text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{activeTruckTitle} • {activeDriverName}</span>
            </div>
            {onCloseRoute && (
              <button onClick={onCloseRoute} className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer" title="Close Navigation View">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Next Stop
              </span>
              <p className="font-black text-sm text-white mt-0.5">{activeEta}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-slate-400" /> Speed
              </span>
              <p className="font-black text-sm text-white mt-0.5">{activeSpeed} km/h</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-slate-400" /> Temperature
              </span>
              <p className="font-black text-sm text-white mt-0.5">{activeTemp}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-slate-400" /> Fuel
              </span>
              <p className="font-black text-sm text-white mt-0.5">{activeFuel}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaflet Map Canvas with Smooth Sub-pixel Motion */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        zoomSnap={0.25}
        zoomDelta={0.25}
        zoomAnimation={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
        wheelDebounceTime={40}
        wheelPxPerZoomLevel={120}
        inertia={true}
        inertiaDeceleration={3000}
        inertiaMaxSpeed={2000}
        easeLinearity={0.15}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[300px] z-10"
      >
        <MapViewController
          trucks={filteredTrucks}
          selectedTruck={selectedTruck}
          activeRoute={activeRoute}
          highwayPolyline={activeHighwayPolyline}
          resetTrigger={resetTrigger}
        />

        {/* CartoDB Dark Matter High-Tech Night Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* ── 3. Multi-color Glowing Neon Highway Routes ── */}
        {activeRoute && activeHighwayPolyline && activeHighwayPolyline.length > 5 ? (
          <>
            {/* Segment 1: On Route (Cyan) */}
            <Polyline positions={seg1} pathOptions={{ color: '#06B6D4', weight: 6, opacity: 0.95, lineCap: 'round' }} />
            <Polyline positions={seg1} pathOptions={{ color: '#67E8F9', weight: 12, opacity: 0.35, lineCap: 'round' }} />

            {/* Segment 2: Stops (Green) */}
            <Polyline positions={seg2} pathOptions={{ color: '#22C55E', weight: 6, opacity: 0.95, lineCap: 'round' }} />
            <Polyline positions={seg2} pathOptions={{ color: '#86EFAC', weight: 12, opacity: 0.35, lineCap: 'round' }} />

            {/* Segment 3: Heavy Traffic (Red) */}
            <Polyline positions={seg3} pathOptions={{ color: '#EF4444', weight: 6, opacity: 0.95, lineCap: 'round' }} />
            <Polyline positions={seg3} pathOptions={{ color: '#FCA5A5', weight: 12, opacity: 0.35, lineCap: 'round' }} />

            {/* Pickup & Drop Markers */}
            <Marker position={[activeRoute.origin.lat, activeRoute.origin.lng]} icon={createPinIcon('#2563EB', `Pickup: ${activeRoute.origin.city}`)} />
            <Marker position={[activeRoute.destination.lat, activeRoute.destination.lng]} icon={createPinIcon('#22C55E', `Drop: ${activeRoute.destination.city}`)} />
          </>
        ) : (
          !singleRouteOnly && (
            <Polyline positions={corridorDelhiMumbaiPuneBengaluruChennai} pathOptions={{ color: '#06B6D4', weight: 3, dashArray: '6, 8', opacity: 0.6 }} />
          )
        )}

        {/* 60FPS Live Animated Gliding Truck Marker with White Pulsing Sonar Ring */}
        {glidingTruckPos && (
          <Marker
            position={glidingTruckPos}
            icon={createCustomTruckIcon(
              {
                id: 'nav-truck-live',
                plateNumber: activeTruckTitle,
                status: 'in-transit',
                driverName: activeDriverName,
                currentLocation: { lat: glidingTruckPos[0], lng: glidingTruckPos[1], city: 'En Route' },
                capacityTons: 16,
                rating: 4.9,
              } as unknown as Truck,
              true
            )}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1.5 space-y-1 font-sans text-xs text-slate-800">
                <div className="font-extrabold text-cyan-600 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 animate-spin" />
                  <span>{activeTruckTitle} • Live Navigation</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">{activeRoute?.origin.city || 'Origin'} → {activeRoute?.destination.city || 'Destination'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Other Fleet Truck Markers */}
        {!singleRouteOnly && filteredTrucks.map((truck) => {
          const isSelected = selectedTruckId === truck.id;
          return (
            <Marker
              key={truck.id}
              position={[truck.currentLocation.lat, truck.currentLocation.lng]}
              icon={createCustomTruckIcon(truck, isSelected)}
              eventHandlers={{ click: () => onSelectTruck?.(truck) }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

