import type { BankingPort, BankRecord } from '../../../core/ports/BankingPort';
import { pool } from './client';

export class BankingRepo implements BankingPort {
  async getAvailableBanked(shipId: string, year: number): Promise<number> {
    const { rows } = await pool.query('SELECT COALESCE(SUM(amount_gco2eq), 0) AS total FROM bank_entries WHERE ship_id = $1 AND year = $2', [shipId, year]);
    return Number(rows[0]?.total ?? 0);
  }
  async addBankRecord(record: BankRecord): Promise<void> {
    await pool.query('INSERT INTO bank_entries (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3)', [record.shipId, record.year, record.amount_gco2eq]);
  }
  async listBankRecords(shipId: string, year: number): Promise<BankRecord[]> {
    const { rows } = await pool.query('SELECT id, ship_id, year, amount_gco2eq FROM bank_entries WHERE ship_id = $1 AND year = $2 ORDER BY id ASC', [shipId, year]);
    return rows.map((r: any) => ({ id: r.id, shipId: r.ship_id, year: r.year, amount_gco2eq: Number(r.amount_gco2eq) }));
  }
}

