import { describe, it, expect } from 'vitest'
import { computeComparison } from '../ComputeComparison'

describe('computeComparison', () => {
  it('computes percent difference and compliance', () => {
    const baseline = { routeId: 'R001', ghgIntensity: 91.0 } as any
    const others = [
      baseline,
      { routeId: 'R002', ghgIntensity: 88.0 } as any,
    ]
    const rows = computeComparison(baseline, others)
    expect(rows).toHaveLength(1)
    expect(rows[0].routeId).toBe('R002')
    expect(rows[0].percentDiff).toBeCloseTo((88/91 - 1) * 100)
    expect(rows[0].compliant).toBe(true)
  })
})

