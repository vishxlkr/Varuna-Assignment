export type VesselType = 'Container' | 'BulkCarrier' | 'Tanker' | 'RoRo';
export type FuelType = 'HFO' | 'LNG' | 'MGO';

export interface RouteEntity {
  id: number; // db id
  routeId: string; // business id like R001
  vesselType: VesselType;
  fuelType: FuelType;
  year: number;
  ghgIntensity: number; // gCO2e/MJ
  fuelConsumptionTons: number; // tons
  distanceKm: number; // kilometers
  totalEmissionsTons: number; // tons
  isBaseline: boolean;
}

export const TARGET_2025 = 89.3368; // gCO2e/MJ
export const APPROX_MJ_PER_TON = 41000; // fuel energy density MJ/t

