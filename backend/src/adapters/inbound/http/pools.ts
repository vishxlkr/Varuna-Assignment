import { Router } from 'express';
import type { PoolsPort } from '../../../core/ports/PoolsPort';
import { createPoolGreedy, type PoolMemberInput } from '../../../core/application/CreatePool';
import { BadRequestError } from '../../../shared/errors';

export function poolsRouter(poolsRepo: PoolsPort) {
  const r = Router();

  r.post('/', async (req, res, next) => {
    try {
      const { year, members } = req.body as { year?: number; members?: PoolMemberInput[] };
      if (!year || !members || !Array.isArray(members) || members.length === 0) {
        throw new BadRequestError('year and members[] are required');
      }
      const result = createPoolGreedy(members);
      const poolId = await poolsRepo.createPool(year, result.map(m => ({ shipId: m.shipId, cb_before: m.cb_before, cb_after: m.cb_after })));
      res.json({ poolId, members: result });
    } catch (e) { next(e); }
  });

  return r;
}

