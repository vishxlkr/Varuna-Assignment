export type VesselType = 'Container' | 'BulkCarrier' | 'Tanker' | 'RoRo'
export type FuelType = 'HFO' | 'LNG' | 'MGO'

export interface RouteDTO {
  id: number
  routeId: string
  vesselType: VesselType
  fuelType: FuelType
  year: number
  ghgIntensity: number
  fuelConsumptionTons: number
  distanceKm: number
  totalEmissionsTons: number
  isBaseline: boolean
}

export interface ComparisonRowDTO {
  routeId: string
  baselineGhg: number
  comparisonGhg: number
  percentDiff: number
  compliant: boolean
}

export interface KPI {
  cb_before: number
  applied: number
  cb_after: number
}

export const TARGET_2025 = 89.3368

