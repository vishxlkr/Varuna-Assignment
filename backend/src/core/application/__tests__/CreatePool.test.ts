import { describe, it, expect } from 'vitest'
import { createPoolGreedy } from '../CreatePool'

describe('createPoolGreedy', () => {
  it('allocates surplus to deficits and preserves constraints', () => {
    const res = createPoolGreedy([
      { shipId: 'A', cb_before: 300 },
      { shipId: 'B', cb_before: -100 },
      { shipId: 'C', cb_before: -200 },
    ])
    const a = res.find(r => r.shipId === 'A')!
    const b = res.find(r => r.shipId === 'B')!
    const c = res.find(r => r.shipId === 'C')!
    expect(a.cb_after).toBe(0)
    expect(b.cb_after).toBe(0)
    expect(c.cb_after).toBe(0)
  })
})

