import { describe, it, expect } from 'vitest'
import { applyBanked, bankSurplus } from '../Banking'

class FakeBanking {
  total = 0
  async getAvailableBanked() { return this.total }
  async addBankRecord(r: { amount_gco2eq: number }) { this.total += r.amount_gco2eq }
  async listBankRecords() { return [] as any }
}

describe('Banking', () => {
  it('banks positive CB and zeros after', async () => {
    const b = new FakeBanking() as any
    const res = await bankSurplus(b, 'S1', 2024, 100)
    expect(res.applied).toBe(100)
    expect(res.cb_after).toBe(0)
    expect(await b.getAvailableBanked()).toBe(100)
  })

  it('applies within available and deficit', async () => {
    const b = new FakeBanking() as any
    await bankSurplus(b, 'S1', 2024, 200)
    const res = await applyBanked(b, 'S1', 2024, -150, 120)
    expect(res.applied).toBe(120)
    expect(res.cb_after).toBe(-30)
    expect(await b.getAvailableBanked()).toBe(80)
  })
})

