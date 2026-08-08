import type { Truck, Driver, Shipment, AnomalyFlag, FutureAvailabilityPrediction, SustainabilityMetrics, QuickRoleDemo } from '../types';

export const DEMO_ROLES: QuickRoleDemo[] = [
  {
    role: 'driver',
    email: 'driver@cargoloop.ai',
    label: 'Driver',
    subtitle: 'Track route, upload docs & view earnings',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  },
  {
    role: 'shipper',
    email: 'shipper@cargoloop.ai',
    label: 'Shipper',
    subtitle: 'NLP booking, AI pricing & truck matching',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  },
  {
    role: 'fleet',
    email: 'fleet@cargoloop.ai',
    label: 'Fleet Owner',
    subtitle: 'Telemetry, future predictor & CO2 hub',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
  },
  {
    role: 'admin',
    email: 'admin@cargoloop.ai',
    label: 'Admin',
    subtitle: 'System telemetry & AI fraud detection',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80',
  },
];

const CITIES = [
  { name: 'Mumbai (JNPT Port)', lat: 18.95, lng: 72.95, stateCode: 'MH' },
  { name: 'Thane Hub', lat: 19.2183, lng: 72.9781, stateCode: 'MH' },
  { name: 'Pune (Chakan Cluster)', lat: 18.75, lng: 73.85, stateCode: 'MH' },
  { name: 'Nashik Logistics Hub', lat: 19.9975, lng: 73.7898, stateCode: 'MH' },
  { name: 'Nagpur Central Hub', lat: 21.1458, lng: 79.0882, stateCode: 'MH' },
  { name: 'Bengaluru (Hosur Highway)', lat: 12.9716, lng: 77.5946, stateCode: 'KA' },
  { name: 'Nelamangala Hub', lat: 13.0988, lng: 77.3912, stateCode: 'KA' },
  { name: 'Chennai (Ennore Port)', lat: 13.25, lng: 80.32, stateCode: 'TN' },
  { name: 'Sriperumbudur Auto Cluster', lat: 12.9667, lng: 79.95, stateCode: 'TN' },
  { name: 'Coimbatore Hub', lat: 11.0168, lng: 76.9558, stateCode: 'TN' },
  { name: 'Delhi NCR Freight Terminal', lat: 28.7041, lng: 77.1025, stateCode: 'DL' },
  { name: 'Gurgaon Manesar Corridor', lat: 28.35, lng: 76.93, stateCode: 'HR' },
  { name: 'Noida Greater Noida Hub', lat: 28.4744, lng: 77.504, stateCode: 'UP' },
  { name: 'Sonipat Logistics Park', lat: 28.9931, lng: 77.0151, stateCode: 'HR' },
  { name: 'Hyderabad (Shamshabad Terminal)', lat: 17.24, lng: 78.43, stateCode: 'TS' },
  { name: 'Vijayawada Highway Cluster', lat: 16.5062, lng: 80.648, stateCode: 'AP' },
  { name: 'Visakhapatnam Sea Port', lat: 17.6868, lng: 83.2185, stateCode: 'AP' },
  { name: 'Kolkata (Dankuni Terminal)', lat: 22.68, lng: 88.3, stateCode: 'WB' },
  { name: 'Haldia Port Terminal', lat: 22.0667, lng: 88.1, stateCode: 'WB' },
  { name: 'Ahmedabad (Sanand Hub)', lat: 23.0, lng: 72.38, stateCode: 'GJ' },
  { name: 'Vadodara Industrial Belt', lat: 22.3072, lng: 73.1812, stateCode: 'GJ' },
  { name: 'Surat Textile Logistics', lat: 21.1702, lng: 72.8311, stateCode: 'GJ' },
  { name: 'Jaipur (Neemrana Freight Hub)', lat: 27.98, lng: 76.38, stateCode: 'RJ' },
  { name: 'Udaipur Logistics Hub', lat: 24.5854, lng: 73.7125, stateCode: 'RJ' },
  { name: 'Indore Pithampur Cluster', lat: 22.62, lng: 75.68, stateCode: 'MP' },
  { name: 'Bhopal Central Hub', lat: 23.2599, lng: 77.4126, stateCode: 'MP' },
  { name: 'Lucknow Transportation Park', lat: 26.8467, lng: 80.9462, stateCode: 'UP' },
  { name: 'Kanpur Freight Terminal', lat: 26.4499, lng: 80.3319, stateCode: 'UP' },
  { name: 'Kochi Sea Port', lat: 9.9312, lng: 76.2673, stateCode: 'KL' },
];

const TRUCK_MODELS = [
  'Tata Prima 3538.K',
  'Tata Signa 5530.S',
  'Ashok Leyland AVTR 2820',
  'Ashok Leyland 5525',
  'BharatBenz 2823C',
  'BharatBenz 5528T',
  'Mahindra Blazo X 35',
  'Eicher Pro 6035',
  'Volvo FMX 460',
  'Scania G440 Heavy Hauler',
];

const FIRST_NAMES = [
  'Rajesh', 'Suresh', 'Vikram', 'Amitabh', 'Ramesh', 'Harpreet', 'Anil', 'Deepak', 'Manish', 'Sanjay',
  'Praveen', 'Sunil', 'Vijay', 'Mohammad', 'Ganesh', 'Santosh', 'Nitin', 'Mahesh', 'Ravi', 'Karthik',
  'Subhash', 'Arun', 'Brijesh', 'Dharmendra', 'Eshwar', 'Farhan', 'Girish', 'Hemant', 'Inderjeet', 'Jitin',
  'Karan', 'Lalit', 'Manoj', 'Naveen', 'Omkar', 'Pankaj', 'Qasim', 'Rakesh', 'Sachin', 'Tushar',
  'Umesh', 'Varun', 'Waseem', 'Yash', 'Zubair', 'Ajay', 'Baldev', 'Chandan', 'Devendra', 'Gurpreet'
];

const LAST_NAMES = [
  'Kumar', 'Patel', 'Singh', 'Sharma', 'Yadav', 'Deshmukh', 'Verma', 'Reddy', 'Gupta', 'Nair',
  'Pawar', 'Jadhav', 'Khan', 'Kulkarni', 'Raut', 'Thorat', 'Gowda', 'Teja', 'Raja', 'Bose',
  'Pandey', 'Rao', 'Sheikh', 'Chandra', 'Joshi', 'Gill', 'Mehta', 'Malhotra', 'Bhatia', 'Saxena'
];

export const MOCK_DRIVERS: Driver[] = Array.from({ length: 250 }).map((_, index) => {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(index * 3) % LAST_NAMES.length];
  const name = `${firstName} ${lastName}`;
  const id = `drv-${101 + index}`;
  const rating = Number((4.1 + (index % 9) * 0.1).toFixed(1));
  const completedTrips = 30 + (index * 11) % 350;
  const trustScorePercent = 85 + (index % 15);
  const state = CITIES[index % CITIES.length].stateCode;

  return {
    id,
    name,
    email: index === 0 ? 'driver@cargoloop.ai' : `driver.${id}@cargoloop.ai`,
    phone: `+91 ${98000 + (index % 900)} ${Math.floor(10000 + Math.random() * 90000)}`,
    status: index % 3 === 0 ? 'available' : index % 3 === 1 ? 'in-transit' : 'maintenance',
    rating,
    completedTrips,
    trustScorePercent,
    documentsVerified: true,
    licenseNumber: `DL-${state}${10 + (index % 80)}20200${1000 + index}`,
    licenseExpiry: '2028-11-15',
    rcNumber: `${state}-${10 + (index % 80)}-CL-${2000 + index}`,
    insuranceExpiry: '2026-12-31',
    pucExpiry: '2026-09-30',
    totalEarningsInr: 95000 + index * 8400,
  };
});

export const MOCK_TRUCKS: Truck[] = Array.from({ length: 250 }).map((_, i) => {
  const cityIndex = i % CITIES.length;
  const destIndex = (i + 5) % CITIES.length;
  const origin = CITIES[cityIndex];
  const dest = CITIES[destIndex];
  const driver = MOCK_DRIVERS[i];

  const fuelType = i % 6 === 0 ? 'cng' : i % 9 === 0 ? 'electric' : 'diesel';
  // Distribution: ~45% in-transit, 45% available, 10% maintenance
  const status: Truck['status'] = i % 10 === 9 ? 'maintenance' : i % 2 === 0 ? 'in-transit' : 'available';

  // For in-transit trucks, interpolate along highway corridor with random scatter for realism
  let currentLat = origin.lat;
  let currentLng = origin.lng;

  if (status === 'in-transit') {
    const progress = 0.15 + (i % 7) * 0.11; // 15% to 81% along route
    currentLat = origin.lat + (dest.lat - origin.lat) * progress + (Math.random() - 0.5) * 0.15;
    currentLng = origin.lng + (dest.lng - origin.lng) * progress + (Math.random() - 0.5) * 0.15;
  } else {
    // Available trucks clustered near hub with slight geographical spread
    currentLat += (Math.random() - 0.5) * 0.25;
    currentLng += (Math.random() - 0.5) * 0.25;
  }

  return {
    id: `trk-${201 + i}`,
    plateNumber: `${origin.stateCode}-${10 + (i % 80)}-CL-${3000 + i}`,
    model: TRUCK_MODELS[i % TRUCK_MODELS.length],
    capacityTons: 10 + (i % 5) * 5, // 10, 15, 20, 25, 30 tons
    currentLocation: {
      lat: Number(currentLat.toFixed(4)),
      lng: Number(currentLng.toFixed(4)),
      city: origin.name,
    },
    destination: status === 'in-transit' ? {
      lat: dest.lat,
      lng: dest.lng,
      city: dest.name,
    } : undefined,
    status,
    driverId: driver.id,
    driverName: driver.name,
    driverRating: driver.rating,
    temperatureControlled: i % 3 === 0,
    fuelType,
    fuelEfficiencyKmpl: fuelType === 'electric' ? 0 : fuelType === 'cng' ? 5.2 : 3.8,
    co2EmissionsPerKmKg: fuelType === 'electric' ? 0 : fuelType === 'cng' ? 1.4 : 2.68,
    matchScore: 82 + (i % 18),
    etaMinutes: status === 'in-transit' ? 25 + (i % 15) * 15 : 0,
  };
});

const MATERIALS_LIST = [
  'Frozen Dairy & Ice Creams',
  'Biopharma Cold Vaccines',
  'Industrial Steel Coils',
  'Automotive Engine Castings',
  'FMCG Packaged Consumer Goods',
  'Solar PV Panels & Inverters',
  'Fresh Farm Produce & Citrus',
  'Heavy Structural Piping',
  'Consumer Electronics & Mobile Displays',
  'Chemical Drums (Hazmat Approved)',
];

export const MOCK_SHIPMENTS: Shipment[] = Array.from({ length: 250 }).map((_, i) => {
  const originIndex = i % CITIES.length;
  const pass = Math.floor(i / CITIES.length);
  const offset = 1 + (pass * 3) + ((i * 7) % (CITIES.length - 2));
  let destIndex = (originIndex + offset) % CITIES.length;
  if (destIndex === originIndex) {
    destIndex = (originIndex + 5) % CITIES.length;
  }
  const origin = CITIES[originIndex];
  const dest = CITIES[destIndex];

  const distanceKm = Math.round(
    Math.sqrt(Math.pow(dest.lat - origin.lat, 2) + Math.pow(dest.lng - origin.lng, 2)) * 111
  );

  const weightTons = 5 + (i % 6) * 5;
  const isTemp = i % 3 === 0;
  const baseRatePerKm = isTemp ? 68 : 46;
  const estimatedPriceInr = Math.round(distanceKm * baseRatePerKm * (weightTons / 10));

  const status: Shipment['status'] = i % 4 === 0 ? 'pending' : i % 4 === 1 ? 'in-transit' : i % 4 === 2 ? 'delivered' : 'assigned';
  const assignedTruck = status !== 'pending' ? MOCK_TRUCKS[i % MOCK_TRUCKS.length] : undefined;
  const material = MATERIALS_LIST[i % MATERIALS_LIST.length];

  return {
    id: `shp-${501 + i}`,
    title: `${weightTons}T ${isTemp ? 'Cold Chain' : 'Express Freight'} (${origin.name.split(' ')[0]} → ${dest.name.split(' ')[0]})`,
    material,
    weightTons,
    temperatureControlled: isTemp,
    temperatureTargetCelsius: isTemp ? -18 : undefined,
    origin: {
      city: origin.name,
      lat: origin.lat,
      lng: origin.lng,
    },
    destination: {
      city: dest.name,
      lat: dest.lat,
      lng: dest.lng,
    },
    distanceKm,
    estimatedPriceInr,
    suggestedPriceMinInr: Math.round(estimatedPriceInr * 0.92),
    suggestedPriceMaxInr: Math.round(estimatedPriceInr * 1.12),
    fuelImpactInr: Math.round(estimatedPriceInr * 0.38),
    estimatedCo2Kg: Math.round(distanceKm * 2.65),
    status,
    assignedTruckId: assignedTruck?.id,
    assignedDriverId: assignedTruck?.driverId,
    shipperId: 'shipper@cargoloop.ai',
    createdAt: new Date(Date.now() - i * 3600000 * 4).toISOString(),
    pickupWindow: i % 2 === 0 ? 'Today 04:00 PM - 08:00 PM' : 'Tomorrow 08:00 AM - 12:00 PM',
  };
});

export const MOCK_ANOMALIES: AnomalyFlag[] = [
  {
    id: 'anom-1',
    type: 'document_tampering',
    severity: 'critical',
    title: 'Suspicious Insurance Expiry Edit',
    description: 'Driver DL-MH12202000104 uploaded an insurance document with font misalignment near expiry date.',
    entityId: 'drv-104',
    entityType: 'driver',
    timestamp: '10 mins ago',
    resolved: false,
  },
  {
    id: 'anom-2',
    type: 'pricing_outlier',
    severity: 'high',
    title: 'Unusual Low Freight Bid (-35%)',
    description: 'Shipment shp-503 (Mumbai to Kolkata) posted at ₹42,000 against AI benchmark of ₹68,500.',
    entityId: 'shp-503',
    entityType: 'shipment',
    timestamp: '25 mins ago',
    resolved: false,
  },
  {
    id: 'anom-3',
    type: 'gps_mismatch',
    severity: 'medium',
    title: 'Route Telemetry Deviation',
    description: 'Truck MH-12-CL-3012 deviated 18km from optimal NH-48 corridor without traffic alert.',
    entityId: 'trk-212',
    entityType: 'truck',
    timestamp: '1 hour ago',
    resolved: true,
  },
  {
    id: 'anom-4',
    type: 'duplicate_listing',
    severity: 'low',
    title: 'Identical Cargo Request Detected',
    description: 'Two identical requests for 15T FMCG Goods from Bengaluru to Chennai within 5 minutes.',
    entityId: 'shp-508',
    entityType: 'shipment',
    timestamp: '2 hours ago',
    resolved: false,
  },
];

export const MOCK_AVAILABILITY_PREDICTIONS: FutureAvailabilityPrediction[] = [
  { timeframe: '1h', city: 'Mumbai', predictedAvailableTrucks: 48, confidenceScorePercent: 95, demandForecast: 'High' },
  { timeframe: '1h', city: 'Pune', predictedAvailableTrucks: 32, confidenceScorePercent: 92, demandForecast: 'Medium' },
  { timeframe: '1h', city: 'Bengaluru', predictedAvailableTrucks: 56, confidenceScorePercent: 96, demandForecast: 'High' },
  { timeframe: '6h', city: 'Mumbai', predictedAvailableTrucks: 84, confidenceScorePercent: 90, demandForecast: 'High' },
  { timeframe: '6h', city: 'Delhi', predictedAvailableTrucks: 76, confidenceScorePercent: 91, demandForecast: 'Medium' },
  { timeframe: '24h', city: 'Chennai', predictedAvailableTrucks: 110, confidenceScorePercent: 88, demandForecast: 'Low' },
  { timeframe: '24h', city: 'Hyderabad', predictedAvailableTrucks: 92, confidenceScorePercent: 89, demandForecast: 'Medium' },
  { timeframe: '3d', city: 'Mumbai', predictedAvailableTrucks: 185, confidenceScorePercent: 84, demandForecast: 'High' },
  { timeframe: '3d', city: 'Bengaluru', predictedAvailableTrucks: 160, confidenceScorePercent: 82, demandForecast: 'High' },
];

export const MOCK_SUSTAINABILITY: SustainabilityMetrics = {
  totalDistanceDrivenKm: 1842900,
  litersFuelSaved: 78450,
  co2ReducedKg: 210240,
  fleetEfficiencyScorePercent: 94.2,
  treeEquivalentPlanted: 9550,
};

export const MOCK_TIME_SERIES = [
  { month: 'Jan', revenue: 4200000, tripCount: 580, co2Saved: 12500 },
  { month: 'Feb', revenue: 4800000, tripCount: 650, co2Saved: 15400 },
  { month: 'Mar', revenue: 5450000, tripCount: 740, co2Saved: 18900 },
  { month: 'Apr', revenue: 6100000, tripCount: 820, co2Saved: 22100 },
  { month: 'May', revenue: 6850000, tripCount: 910, co2Saved: 26800 },
  { month: 'Jun', revenue: 7850000, tripCount: 1050, co2Saved: 31200 },
  { month: 'Jul', revenue: 8900000, tripCount: 1220, co2Saved: 38400 },
];
