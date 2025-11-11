import { describe, it, expect } from 'vitest'
import { computeCbForRoute } from '../ComputeCB'

describe('computeCbForRoute', () => {
  it('computes positive CB when actual < target', () => {
    const route = {
      id: 1,
      routeId: 'R002',
      vesselType: 'BulkCarrier',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumptionTons: 4800,
      distanceKm: 11500,
      totalEmissionsTons: 4200,
      isBaseline: false,
    } as any
    const cb = computeCbForRoute(route)
    expect(cb).toBeGreaterThan(0)
  })
})

