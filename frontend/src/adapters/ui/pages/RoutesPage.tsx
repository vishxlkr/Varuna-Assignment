import { useEffect, useMemo, useState } from 'react'
import { routesApi } from '../../infrastructure/api'
import type { RouteDTO, VesselType, FuelType } from '../../../core/domain'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { Spinner } from '../components/Spinner'
import { Alert } from '../components/Alert'
import { Card } from '../components/Card'

export function RoutesPage() {
  const [routes, setRoutes] = useState<RouteDTO[]>([])
  const [filters, setFilters] = useState<{ vesselType?: VesselType; fuelType?: FuelType; year?: number }>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { (async () => {
    try { setRoutes(await routesApi.list()) } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  })() }, [])

  const filtered = useMemo(() => routes.filter(r =>
    (!filters.vesselType || r.vesselType === filters.vesselType) &&
    (!filters.fuelType || r.fuelType === filters.fuelType) &&
    (!filters.year || r.year === filters.year)
  ), [routes, filters])

  const vesselTypes = Array.from(new Set(routes.map(r => r.vesselType)))
  const fuelTypes = Array.from(new Set(routes.map(r => r.fuelType)))
  const years = Array.from(new Set(routes.map(r => r.year)))

  const totalEmissions = useMemo(() => routes.reduce((sum, r) => sum + r.totalEmissionsTons, 0), [routes])
  const avgIntensity = useMemo(() => routes.length ? routes.reduce((sum, r) => sum + r.ghgIntensity, 0) / routes.length : 0, [routes])
  const baseline = routes.find(r => r.isBaseline)

  const [savingId, setSavingId] = useState<string | null>(null)
  async function setBaseline(routeId: string) {
    try {
      setSavingId(routeId)
      await routesApi.setBaseline(routeId)
      setRoutes(await routesApi.list())
    } catch (e: any) { setError(e.message) } finally { setSavingId(null) }
  }

  return (
    <div className="space-y-6">
      {error && <Alert tone="error">{error}</Alert>}

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Total emissions">
          <p className="text-2xl font-semibold text-white">{totalEmissions.toLocaleString()} t</p>
          <p className="text-xs text-slate-400">Across {routes.length || '--'} routes</p>
        </Card>
        <Card title="Average intensity">
          <p className="text-2xl font-semibold text-white">{avgIntensity.toFixed(2)} gCO2e/MJ</p>
          <p className="text-xs text-slate-400">Weighted by listed routes</p>
        </Card>
        <Card title="Baseline">
          {baseline ? (
            <div>
              <p className="text-xl font-semibold text-white">{baseline.routeId}</p>
              <p className="text-xs text-slate-400">{baseline.vesselType} · {baseline.year}</p>
            </div>
          ) : <p className="text-sm text-slate-400">No baseline selected</p>}
        </Card>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-400">Vessel</label>
          <select value={filters.vesselType ?? ''} onChange={e => setFilters(f => ({ ...f, vesselType: (e.target.value || undefined) as VesselType }))}>
            <option value="">All</option>
            {vesselTypes.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-400">Fuel</label>
          <select value={filters.fuelType ?? ''} onChange={e => setFilters(f => ({ ...f, fuelType: (e.target.value || undefined) as FuelType }))}>
            <option value="">All</option>
            {fuelTypes.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-400">Year</label>
          <select value={filters.year ?? ''} onChange={e => setFilters(f => ({ ...f, year: e.target.value ? Number(e.target.value) : undefined }))}>
            <option value="">All</option>
            {years.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <Button variant="ghost" onClick={() => setFilters({})}>Clear</Button>
        <div className="text-sm text-slate-300">{filtered.length} of {routes.length} routes</div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/40">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-white/5 bg-slate-900/70">
              <th className="p-3">Route</th>
              <th className="p-3">Vessel</th>
              <th className="p-3">Fuel</th>
              <th className="p-3">Year</th>
              <th className="p-3">gCO2e/MJ</th>
              <th className="p-3">Fuel (t)</th>
              <th className="p-3">Distance (km)</th>
              <th className="p-3">Emissions (t)</th>
              <th className="p-3">Baseline</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={10} className="p-4"><Spinner /> <span className="ml-2 text-sm text-slate-400">Loading routes...</span></td></tr>
            )}
            {!loading && filtered.map((r, idx) => (
              <tr key={r.routeId} className={`border-b border-white/5 ${idx % 2 ? 'bg-slate-900/30' : 'bg-slate-900/10'} hover:bg-slate-800/50`}>
                <td className="p-3 font-semibold text-white">{r.routeId}</td>
                <td className="p-3">{r.vesselType}</td>
                <td className="p-3">{r.fuelType}</td>
                <td className="p-3">{r.year}</td>
                <td className="p-3">{r.ghgIntensity.toFixed(2)}</td>
                <td className="p-3">{r.fuelConsumptionTons}</td>
                <td className="p-3">{r.distanceKm}</td>
                <td className="p-3">{r.totalEmissionsTons}</td>
                <td className="p-3">{r.isBaseline ? <Badge color="blue">Baseline</Badge> : ''}</td>
                <td className="p-3">
                  <Button disabled={r.isBaseline || savingId === r.routeId} onClick={() => setBaseline(r.routeId)}>
                    {savingId === r.routeId ? (<><Spinner size={14}/> <span className="ml-2">Saving...</span></>) : 'Set Baseline'}
                  </Button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={10} className="p-6 text-center text-slate-400">No routes match the selected filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
