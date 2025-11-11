import { useEffect, useMemo, useState } from 'react'
import { routesApi } from '../../infrastructure/api'
import type { ComparisonRowDTO } from '../../../core/domain'
import { TARGET_2025 } from '../../../core/domain'
import { Badge } from '../components/Badge'
import { Spinner } from '../components/Spinner'
import { Alert } from '../components/Alert'
import { Card } from '../components/Card'

export function ComparePage() {
  const [rows, setRows] = useState<ComparisonRowDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { (async () => {
    try { setRows(await routesApi.comparison()) } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  })() }, [])

  const maxGhg = useMemo(() => rows.reduce((m, r) => Math.max(m, r.comparisonGhg, r.baselineGhg), TARGET_2025), [rows])
  const compliant = rows.filter(r => r.compliant).length
  const avgDelta = rows.length ? rows.reduce((sum, r) => sum + r.percentDiff, 0) / rows.length : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
        <span>Target intensity: {TARGET_2025.toFixed(4)} gCO2e/MJ</span>
        <Badge color="blue">2% below 2025 limit</Badge>
      </div>
      {error && <Alert tone="error">{error}</Alert>}

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Compliant routes">
          <p className="text-3xl font-semibold text-white">{compliant}/{rows.length || '--'}</p>
          <p className="text-xs text-slate-400">{rows.length ? Math.round((compliant / rows.length) * 100) : 0}% meeting target</p>
        </Card>
        <Card title="Average delta">
          <p className={`text-3xl font-semibold ${avgDelta <= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>{avgDelta.toFixed(2)}%</p>
          <p className="text-xs text-slate-400">Vs baseline across comparisons</p>
        </Card>
        <Card title="Highest intensity">
          {rows.length ? (
            <div>
              <p className="text-xl font-semibold text-white">{rows.reduce((max, r) => r.comparisonGhg > max.comparisonGhg ? r : max, rows[0]).routeId}</p>
              <p className="text-xs text-slate-400">{rows.reduce((max, r) => r.comparisonGhg > max.comparisonGhg ? r : max, rows[0]).comparisonGhg.toFixed(2)} gCO2e/MJ</p>
            </div>
          ) : <p className="text-sm text-slate-400">No comparison data</p>}
        </Card>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/40">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-white/5 bg-slate-900/70">
              <th className="p-3">Route</th>
              <th className="p-3">Baseline</th>
              <th className="p-3">Comparison</th>
              <th className="p-3">% Diff</th>
              <th className="p-3">Compliant</th>
            </tr>
          </thead>
          <tbody>
            {loading && (<tr><td colSpan={5} className="p-4"><Spinner /> <span className="ml-2 text-sm text-slate-400">Loading comparisons...</span></td></tr>)}
            {!loading && rows.map(r => (
              <tr key={r.routeId} className="border-b border-white/5 hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">{r.routeId}</td>
                <td className="p-3">{r.baselineGhg.toFixed(2)}</td>
                <td className="p-3">{r.comparisonGhg.toFixed(2)}</td>
                <td className={`p-3 ${r.percentDiff <= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>{r.percentDiff.toFixed(2)}%</td>
                <td className="p-3">{r.compliant ? <Badge color="green">Compliant</Badge> : <Badge color="red">Non-compliant</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3">
        {rows.map(r => (
          <div key={r.routeId} className="rounded-xl bg-slate-900/40 p-4">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-white">{r.routeId}</span>
              <span>{r.comparisonGhg.toFixed(2)} gCO2e/MJ</span>
            </div>
            <div className="relative mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="absolute inset-y-0 left-0 bg-blue-500/50" style={{ width: `${(r.baselineGhg / maxGhg) * 100}%` }} />
              <div className={`absolute inset-y-0 left-0 ${r.compliant ? 'bg-emerald-400' : 'bg-rose-400'}`} style={{ width: `${(r.comparisonGhg / maxGhg) * 100}%` }} />
              <div className="absolute inset-y-0 w-0.5 bg-white/60" style={{ left: `${(TARGET_2025 / maxGhg) * 100}%` }} />
            </div>
          </div>
        ))}
        {!rows.length && !loading && <p className="text-sm text-slate-400">No comparison data yet.</p>}
      </div>
    </div>
  )
}
