import { useEffect, useState } from 'react'
import { complianceApi, poolsApi, routesApi } from '../adapters/infrastructure/api'
import type { RouteDTO } from '../core/domain'

type Member = { shipId: string; cb_before: number; cb_after?: number }

export function PoolingBasic() {
  const [routes, setRoutes] = useState<RouteDTO[]>([])
  const [shipId, setShipId] = useState('')
  const [year, setYear] = useState(2024)
  const [members, setMembers] = useState<Member[]>([])
  const [message, setMessage] = useState<string | null>(null)

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

  async function addMember() {
    if (!shipId) return
    try {
      const rec = await complianceApi.cb(shipId, year)
      setMembers(m => [...m, { shipId, cb_before: rec.cb_gco2eq }])
    } catch (e: any) { setMessage(e.message) }
  }

  const sum = members.reduce((s, m) => s + m.cb_before, 0)
  const valid = sum >= 0 && members.some(m => m.cb_before > 0) && members.some(m => m.cb_before < 0)

  async function createPool() {
    try {
      const res = await poolsApi.create(year, members.map(m => ({ shipId: m.shipId, cb_before: m.cb_before })))
      setMembers(res.members)
      setMessage(`Pool ${res.poolId} created`)
    } catch (e: any) { setMessage(e.message) }
  }

  return (
    <div>
      <h2>Pooling</h2>
      {message && <p style={{ color: message.toLowerCase().includes('error') ? 'red' : 'inherit' }}>{message}</p>}
      <div>
        <label>Ship: </label>
        <select value={shipId} onChange={e => setShipId(e.target.value)}>
          <option value="">Select</option>
          {routes.map(r => <option key={r.routeId} value={r.routeId}>{r.routeId} - {r.year}</option>)}
        </select>
      </div>
      <div>
        <label>Year: </label>
        <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={addMember}>Add member</button>
      </div>

      <p style={{ marginTop: 8 }}>Pool sum: {sum.toFixed(2)} gCO2e {sum >= 0 ? '(OK)' : '(Must be >= 0)'}</p>

      <table>
        <thead>
          <tr>
            <th>Ship</th>
            <th>CB before</th>
            <th>CB after</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, idx) => (
            <tr key={idx}>
              <td>{m.shipId}</td>
              <td>{m.cb_before.toFixed(2)}</td>
              <td>{m.cb_after == null ? '--' : m.cb_after.toFixed(2)}</td>
            </tr>
          ))}
          {members.length === 0 && <tr><td colSpan={3}>Add ships to begin pooling.</td></tr>}
        </tbody>
      </table>

      <div style={{ marginTop: 8 }}>
        <button disabled={!valid} onClick={createPool}>Create pool</button>
      </div>
    </div>
  )
}



