export type UserRole = 'driver' | 'shipper' | 'fleet' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  phone?: string;
  rating?: number;
}

export type TruckStatus = 'available' | 'in-transit' | 'maintenance' | 'offline';
export type FuelType = 'diesel' | 'electric' | 'cng' | 'hybrid';

export interface Truck {
  id: string;
  plateNumber: string;
  model: string;
  capacityTons: number;
  currentLocation: {
    lat: number;
    lng: number;
    city: string;
  };
  destination?: {
    lat: number;
    lng: number;
    city: string;
  };
  status: TruckStatus;
  driverId: string;
  driverName: string;
  driverRating: number;
  temperatureControlled: boolean;
  fuelType: FuelType;
  fuelEfficiencyKmpl: number;
  co2EmissionsPerKmKg: number;
  matchScore?: number; // Calculated match score for shippers
  etaMinutes?: number;
}

export type ShipmentStatus = 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'cancelled';

export interface Shipment {
  id: string;
  title: string;
  material: string;
  weightTons: number;
  temperatureControlled: boolean;
  temperatureTargetCelsius?: number;
  origin: {
    city: string;
    lat: number;
    lng: number;
  };
  destination: {
    city: string;
    lat: number;
    lng: number;
  };
  distanceKm: number;
  estimatedPriceInr: number;
  suggestedPriceMinInr: number;
  suggestedPriceMaxInr: number;
  fuelImpactInr: number;
  estimatedCo2Kg: number;
  status: ShipmentStatus;
  assignedTruckId?: string;
  assignedDriverId?: string;
  shipperId: string;
  createdAt: string;
  pickupWindow: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: TruckStatus;
  currentTruckId?: string;
  rating: number;
  completedTrips: number;
  trustScorePercent: number;
  documentsVerified: boolean;
  licenseNumber: string;
  licenseExpiry: string;
  rcNumber: string;
  insuranceExpiry: string;
  pucExpiry: string;
  totalEarningsInr: number;
}

export interface DocumentVerificationResult {
  trustScorePercent: number;
  confidenceBadge: 'High Confidence' | 'Medium Confidence' | 'Needs Review';
  expiryChecks: {
    documentName: string;
    isValid: boolean;
    expiryDate: string;
    extractedText: string;
  }[];
  isAuthentic: boolean;
  aiFlags: string[];
}

export interface AnomalyFlag {
  id: string;
  type: 'document_tampering' | 'pricing_outlier' | 'duplicate_listing' | 'gps_mismatch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  entityId: string;
  entityType: 'driver' | 'shipment' | 'truck';
  timestamp: string;
  resolved: boolean;
}

export interface FutureAvailabilityPrediction {
  timeframe: '1h' | '6h' | '24h' | '3d';
  city: string;
  predictedAvailableTrucks: number;
  confidenceScorePercent: number;
  demandForecast: 'High' | 'Medium' | 'Low';
}

export interface SustainabilityMetrics {
  totalDistanceDrivenKm: number;
  litersFuelSaved: number;
  co2ReducedKg: number;
  fleetEfficiencyScorePercent: number;
  treeEquivalentPlanted: number;
}

export interface QuickRoleDemo {
  role: UserRole;
  email: string;
  label: string;
  subtitle: string;
  avatar: string;
}
