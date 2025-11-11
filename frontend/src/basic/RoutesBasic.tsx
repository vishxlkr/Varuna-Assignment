import { useEffect, useState } from 'react'
import { routesApi } from '../adapters/infrastructure/api'
import type { RouteDTO } from '../core/domain'

export function RoutesBasic() {
  const [routes, setRoutes] = useState<RouteDTO[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try { setRoutes(await routesApi.list()) } catch (e: any) { setError(e.message) }
    })()
  }, [])

  async function setBaseline(id: string) {
    try {
      setSaving(id)
      await routesApi.setBaseline(id)
      setRoutes(await routesApi.list())
    } catch (e: any) { setError(e.message) } finally { setSaving(null) }
  }

  return (
    <div>
      <h2>Routes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Vessel</th>
            <th>Fuel</th>
            <th>Year</th>
            <th>gCO2e/MJ</th>
            <th>Fuel (t)</th>
            <th>Distance (km)</th>
            <th>Emissions (t)</th>
            <th>Baseline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {routes.map(r => (
            <tr key={r.routeId}>
              <td>{r.routeId}</td>
              <td>{r.vesselType}</td>
              <td>{r.fuelType}</td>
              <td>{r.year}</td>
              <td>{r.ghgIntensity.toFixed(2)}</td>
              <td>{r.fuelConsumptionTons}</td>
              <td>{r.distanceKm}</td>
              <td>{r.totalEmissionsTons}</td>
              <td>{r.isBaseline ? 'Yes' : 'No'}</td>
              <td>
                <button disabled={r.isBaseline || saving === r.routeId} onClick={() => setBaseline(r.routeId)}>
                  {saving === r.routeId ? 'Saving...' : 'Set Baseline'}
                </button>
              </td>
            </tr>
          ))}
          {routes.length === 0 && (
            <tr><td colSpan={10}>No routes.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
