import { useEffect, useState } from 'react'
import { bankingApi, complianceApi, routesApi } from '../adapters/infrastructure/api'
import type { RouteDTO } from '../core/domain'

export function BankingBasic() {
  const [routes, setRoutes] = useState<RouteDTO[]>([])
  const [shipId, setShipId] = useState('')
  const [year, setYear] = useState<number>(2024)
  const [amount, setAmount] = useState<number>(0)
  const [message, setMessage] = useState<string | null>(null)
  const [cb, setCb] = useState<number | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const data = await routesApi.list()
        setRoutes(data)
        const initial = data.find(r => r.isBaseline) ?? data[0]
        if (initial) { setShipId(initial.routeId); setYear(initial.year) }
      } catch (e: any) { setMessage(e.message) }
    })()
  }, [])

  async function computeCb() {
    try {
      const rec = await complianceApi.cb(shipId, year)
      setCb(rec.cb_gco2eq)
      setMessage(null)
    } catch (e: any) { setMessage(e.message) }
  }

  async function bank() {
    try { await bankingApi.bank(shipId, year); setMessage('Banked') } catch (e: any) { setMessage(e.message) }
  }

  async function apply() {
    try { await bankingApi.apply(shipId, year, amount); setMessage('Applied') } catch (e: any) { setMessage(e.message) }
  }

  async function records() {
    try { const rec = await bankingApi.records(shipId, year); setMessage(JSON.stringify(rec)) } catch (e: any) { setMessage(e.message) }
  }

  return (
    <div>
      <h2>Banking</h2>
      {message && <p style={{ color: message.toLowerCase().includes('error') ? 'red' : 'inherit' }}>{message}</p>}
      <div>
        <label>Ship: </label>
        <select value={shipId} onChange={e => setShipId(e.target.value)}>
          <option value="">Select</option>
          {routes.map(r => <option key={r.routeId} value={r.routeId}>{r.routeId}</option>)}
        </select>
      </div>
      <div>
        <label>Year: </label>
        <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} />
      </div>
      <div>
        <label>Amount: </label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={computeCb}>Compute CB</button>
        <button onClick={bank}>Bank Surplus</button>
        <button onClick={apply}>Apply Banked</button>
        <button onClick={records}>Show Records</button>
      </div>
      {cb != null && <p>CB (gCO2e): {cb.toFixed(2)}</p>}
    </div>
  )
}
