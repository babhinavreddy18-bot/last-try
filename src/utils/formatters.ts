export const formatCurrency = (amountInr: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountInr);
};

export const formatDistance = (distanceKm: number): string => {
  return `${distanceKm.toLocaleString('en-IN')} km`;
};

export const formatWeight = (weightTons: number): string => {
  return `${weightTons} Tons`;
};

export const formatCO2 = (co2Kg: number): string => {
  if (co2Kg >= 1000) {
    return `${(co2Kg / 1000).toFixed(2)} Metric Tons`;
  }
  return `${co2Kg.toFixed(1)} kg`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const calculateETA = (distanceKm: number, averageSpeedKmh: number = 45): string => {
  const hours = distanceKm / averageSpeedKmh;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} mins`;
  return `${h} hrs ${m} mins`;
};
