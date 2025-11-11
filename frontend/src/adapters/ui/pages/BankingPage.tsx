import { useEffect, useMemo, useState } from 'react'
import type { RouteDTO } from '../../../core/domain'
import { bankingApi, complianceApi, routesApi } from '../../infrastructure/api'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Alert } from '../components/Alert'
import { Spinner } from '../components/Spinner'

export function BankingPage() {
  const [routes, setRoutes] = useState<RouteDTO[]>([])
  const [shipId, setShipId] = useState('')
  const [year, setYear] = useState<number | null>(null)
  const [cb, setCb] = useState<number | null>(null)
  const [records, setRecords] = useState<{ id: number; amount_gco2eq: number }[]>([])
  const available = useMemo(() => records.reduce((sum, r) => sum + r.amount_gco2eq, 0), [records])
  const [amount, setAmount] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  async function refresh() {
    if (!shipId || year == null) return
    try {
      setLoading(true)
      const rec = await complianceApi.cb(shipId, year)
      setCb(rec.cb_gco2eq)
      setRecords(await bankingApi.records(shipId, year))
      setMessage(null)
    } catch (e: any) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!shipId || year == null) return
    refresh()
  }, [shipId, year])

  async function bank() {
    if (!shipId || year == null) return
    try {
      const res = await bankingApi.bank(shipId, year)
      setMessage(`Banked surplus: ${res.applied.toFixed(2)} gCO2e`)
      await refresh()
    } catch (e: any) {
      setMessage(e.message)
    }
  }

  async function apply() {
    if (!shipId || year == null) return
    try {
      const res = await bankingApi.apply(shipId, year, amount)
      setMessage(`Applied ${res.applied.toFixed(2)} gCO2e. Balance now ${res.cb_after.toFixed(2)}`)
      await refresh()
    } catch (e: any) {
      setMessage(e.message)
    }
  }

  const cbNum = cb ?? 0
  const disableBank = cbNum <= 0
  const disableApply = cbNum >= 0

  return (
    <div className="space-y-6">
      {message && <Alert tone={message.toLowerCase().includes('error') ? 'error' : 'info'}>{message}</Alert>}
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
            {routes.map(r => (
              <option key={r.routeId} value={r.routeId}>{r.routeId} - {r.year}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-400">Year</label>
          <input type="number" value={year ?? ''} readOnly className="opacity-80" />
        </div>
        <div className="text-sm text-slate-300 flex items-center gap-2">
          {loading && <Spinner />} Current CB: <span className={cbNum >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{cbNum.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Compliance balance"><div className={`${cbNum >= 0 ? 'text-emerald-300' : 'text-rose-300'} text-2xl font-semibold`}>{cbNum.toFixed(2)}</div></Card>
        <Card title="Available banked"><div className="text-2xl font-semibold text-white">{available.toFixed(2)}</div></Card>
        <Card title="Bank / apply">
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled={disableBank} onClick={bank}>Bank surplus</Button>
            <input type="number" className="w-32" placeholder="Amount" value={amount} onChange={e => setAmount(Number(e.target.value) || 0)} />
            <Button variant="secondary" disabled={disableApply || amount <= 0} onClick={apply}>Apply</Button>
          </div>
        </Card>
      </div>

      <Card title="Banking records" right={<span className="text-xs text-slate-400">Running total {available.toFixed(2)}</span>}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="text-left border-b border-white/5"><th className="p-2">#</th><th className="p-2">Amount (gCO2e)</th></tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} className="border-b border-white/5">
                  <td className="p-2">{r.id}</td>
                  <td className={`p-2 ${r.amount_gco2eq >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{r.amount_gco2eq.toFixed(2)}</td>
                </tr>
              ))}
              {records.length === 0 && <tr><td colSpan={2} className="p-3 text-slate-400">No banking records yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
