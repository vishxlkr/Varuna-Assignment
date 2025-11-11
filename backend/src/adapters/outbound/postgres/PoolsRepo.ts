import type { PoolsPort, PoolMemberEntity } from '../../../core/ports/PoolsPort';
import { pool } from './client';

export class PoolsRepo implements PoolsPort {
  async createPool(year: number, members: PoolMemberEntity[]): Promise<number> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query('INSERT INTO pools (year) VALUES ($1) RETURNING id', [year]);
      const poolId = rows[0].id as number;
      for (const m of members) {
        await client.query(
          'INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after) VALUES ($1, $2, $3, $4)',
          [poolId, m.shipId, m.cb_before, m.cb_after]
        );
      }
      await client.query('COMMIT');
      return poolId;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}

