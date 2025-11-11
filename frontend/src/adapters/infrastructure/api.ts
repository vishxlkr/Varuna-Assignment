import type { BankingAPI, ComplianceAPI, PoolsAPI, RoutesAPI } from '../../core/ports'
import type { ComparisonRowDTO, RouteDTO } from '../../core/domain'

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { headers: { 'Content-Type': 'application/json' }, ...init })
  if (!res.ok) {
    let message = res.statusText
    try { const data = await res.json(); message = data.error || message } catch {}
    throw new Error(message)
  }
  return res.json()
}

export const routesApi: RoutesAPI = {
  list: () => http<RouteDTO[]>('/routes'),
  setBaseline: (id: string) => http<void>(`/routes/${id}/baseline`, { method: 'POST' }),
  comparison: () => http<ComparisonRowDTO[]>('/routes/comparison'),
}

export const complianceApi: ComplianceAPI = {
  cb: (shipId: string, year: number) => http(`/compliance/cb?shipId=${shipId}&year=${year}`),
  adjustedCb: (shipId: string, year: number) => http(`/compliance/adjusted-cb?shipId=${shipId}&year=${year}`),
}

export const bankingApi: BankingAPI = {
  records: (shipId: string, year: number) => http(`/banking/records?shipId=${shipId}&year=${year}`),
  bank: (shipId: string, year: number) => http('/banking/bank', { method: 'POST', body: JSON.stringify({ shipId, year }) }),
  apply: (shipId: string, year: number, amount: number) => http('/banking/apply', { method: 'POST', body: JSON.stringify({ shipId, year, amount }) }),
}

export const poolsApi: PoolsAPI = {
  create: (year: number, members: { shipId: string; cb_before: number }[]) => http('/pools', { method: 'POST', body: JSON.stringify({ year, members }) }),
}

