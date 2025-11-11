import type { CompliancePort } from '../../../core/ports/CompliancePort';
import type { ComplianceRecord } from '../../../core/domain/Compliance';
import { pool } from './client';

export class ComplianceRepo implements CompliancePort {
  async upsertCompliance(record: ComplianceRecord): Promise<void> {
    await pool.query(
      `INSERT INTO ship_compliance (ship_id, year, cb_gco2eq)
       VALUES ($1, $2, $3)
       ON CONFLICT (ship_id, year) DO UPDATE SET cb_gco2eq = EXCLUDED.cb_gco2eq`,
      [record.shipId, record.year, record.cb_gco2eq]
    );
  }
  async getCompliance(shipId: string, year: number): Promise<ComplianceRecord | null> {
    const { rows } = await pool.query('SELECT ship_id, year, cb_gco2eq FROM ship_compliance WHERE ship_id = $1 AND year = $2 LIMIT 1', [shipId, year]);
    if (!rows[0]) return null;
    return { shipId: rows[0].ship_id, year: rows[0].year, cb_gco2eq: Number(rows[0].cb_gco2eq) };
  }
}

