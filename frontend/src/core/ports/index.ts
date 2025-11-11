import type { ComparisonRowDTO, KPI, RouteDTO } from '../domain'

export interface RoutesAPI {
  list(): Promise<RouteDTO[]>
  setBaseline(id: string): Promise<void>
  comparison(): Promise<ComparisonRowDTO[]>
}

export interface BankingAPI {
  records(shipId: string, year: number): Promise<{ id: number; amount_gco2eq: number }[]>
  bank(shipId: string, year: number): Promise<KPI>
  apply(shipId: string, year: number, amount: number): Promise<KPI>
}

export interface ComplianceAPI {
  cb(shipId: string, year: number): Promise<{ shipId: string; year: number; cb_gco2eq: number }>
  adjustedCb(shipId: string, year: number): Promise<{ shipId: string; year: number; cb_gco2eq: number }>
}

export interface PoolsAPI {
  create(year: number, members: { shipId: string; cb_before: number }[]): Promise<{ poolId: number; members: { shipId: string; cb_before: number; cb_after: number }[] }>
}

