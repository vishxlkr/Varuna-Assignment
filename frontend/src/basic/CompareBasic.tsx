import { useEffect, useState } from 'react'
import { routesApi } from '../adapters/infrastructure/api'
import type { ComparisonRowDTO } from '../core/domain'

export function CompareBasic() {
  const [rows, setRows] = useState<ComparisonRowDTO[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try { setRows(await routesApi.comparison()) } catch (e: any) { setError(e.message) }
    })()
  }, [])

  return (
    <div>
      <h2>Compare</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Baseline gCO2e/MJ</th>
            <th>Comparison gCO2e/MJ</th>
            <th>Diff %</th>
            <th>Compliant</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.routeId}</td>
              <td>{r.baselineGhg.toFixed(2)}</td>
              <td>{r.comparisonGhg.toFixed(2)}</td>
              <td>{r.percentDiff.toFixed(2)}</td>
              <td>{r.compliant ? 'Yes' : 'No'}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={5}>No data.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
