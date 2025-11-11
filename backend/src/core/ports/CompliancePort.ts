import type { ComplianceRecord } from "../domain/Compliance";

export interface CompliancePort {
  upsertCompliance(record: ComplianceRecord): Promise<void>;
  getCompliance(shipId: string, year: number): Promise<ComplianceRecord | null>;
}

