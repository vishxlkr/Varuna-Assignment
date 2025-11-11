import { useEffect, useState } from 'react'
import { complianceApi, poolsApi, routesApi } from '../../infrastructure/api'
import { Button } from '../components/Button'
import { Alert } from '../components/Alert'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import type { RouteDTO } from '../../../core/domain'

interface Member { shipId: string; cb_before: number; cb_after?: number }

export function PoolingPage() {
  const [routes, setRoutes] = useState<RouteDTO[]>([])
  const [year, setYear] = useState(2024)
  const [shipId, setShipId] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const data = await routesApi.list()
        setRoutes(data)
        const initial = data.find(r => r.isBaseline) ?? data[0]
        if (initial) {
          setShipId(initial.routeId)
          setYear(initial.year)
        }
      } catch (e: any) {
        setMessage(e.message)
      }
    })()
  }, [])

  async function addMember() {
    try {
      if (!shipId) return
      const rec = await complianceApi.cb(shipId, year)
      setMembers(m => [...m, { shipId, cb_before: rec.cb_gco2eq }])
      setMessage(null)
    } catch (e: any) { setMessage(e.message) }
  }

  const sum = members.reduce((s, m) => s + m.cb_before, 0)
  const valid = sum >= 0 && members.length > 0 && members.some(m => m.cb_before > 0) && members.some(m => m.cb_before < 0)

  async function createPool() {
    try {
      const res = await poolsApi.create(year, members.map(m => ({ shipId: m.shipId, cb_before: m.cb_before })))
      setMembers(res.members)
      setMessage(`Pool ${res.poolId} created`)
    } catch (e: any) { setMessage(e.message) }
  }

  return (
    <div className="space-y-6">
      {message && <Alert tone={message.toLowerCase().includes('error') ? 'error' : 'success'}>{message}</Alert>}
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Build pool" right={<span className="text-xs text-slate-400">Article 21 safeguards</span>}>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400">Ship</label>
              <select value={shipId} onChange={e => {
                const id = e.target.value
                setShipId(id)
                const match = routes.find(r => r.routeId === id)
                if (match) setYear(match.year)
              }}>
                <option value="">Select</option>
                {routes.map(r => <option key={r.routeId} value={r.routeId}>{r.routeId} - {r.year}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400">Year</label>
              <input type="number" value={year} readOnly className="opacity-80" />
            </div>
            <Button onClick={addMember}>Add member</Button>
          </div>
        </Card>
        <Card title="Validation">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>- Pool sum must be &gt;= 0 -&gt; {sum >= 0 ? <Badge color="green">OK</Badge> : <Badge color="red">Fail</Badge>}</li>
            <li>- Need at least one surplus and one deficit vessel -&gt; {valid ? <Badge color="green">OK</Badge> : <Badge color="red">Add members</Badge>}</li>
          </ul>
        </Card>
      </div>

      <div className="text-sm flex items-center gap-2">Pool sum: {sum >= 0 ? <Badge color="green">{sum.toFixed(2)}</Badge> : <Badge color="red">{sum.toFixed(2)}</Badge>}</div>

      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/40">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-white/5 bg-slate-900/60">
              <th className="p-3">Ship</th>
              <th className="p-3">CB before</th>
              <th className="p-3">CB after</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, idx) => (
              <tr key={idx} className="border-b border-white/5">
                <td className="p-3 font-semibold text-white">{m.shipId}</td>
                <td className={`p-3 ${m.cb_before >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{m.cb_before.toFixed(2)}</td>
                <td className={`p-3 ${m.cb_after == null ? 'text-slate-400' : m.cb_after >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{m.cb_after == null ? '--' : m.cb_after.toFixed(2)}</td>
              </tr>
            ))}
            {members.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-slate-400">Add ships to begin pooling.</td></tr>}
          </tbody>
        </table>
      </div>

      <Button variant="secondary" disabled={!valid} onClick={createPool}>Create pool</Button>
    </div>
  )
}

