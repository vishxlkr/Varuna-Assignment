import { APPROX_MJ_PER_TON } from './Route';

export interface ComplianceRecord {
  id?: number;
  shipId: string; // reusing routeId as shipId for simplicity
  year: number;
  cb_gco2eq: number; // Compliance Balance in gCO2e
}

export function computeComplianceBalance(targetIntensity: number, actualIntensity: number, fuelConsumptionTons: number) {
  const energyMJ = fuelConsumptionTons * APPROX_MJ_PER_TON;
  // CB = (Target - Actual) * Energy
  return (targetIntensity - actualIntensity) * energyMJ;
}

