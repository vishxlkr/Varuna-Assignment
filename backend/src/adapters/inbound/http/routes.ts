import { Router } from 'express';
import type { RoutesPort } from '../../../core/ports/RoutesPort';
import { computeComparison } from '../../../core/application/ComputeComparison';
import { BadRequestError, NotFoundError } from '../../../shared/errors';

export function routesRouter(routesRepo: RoutesPort) {
  const r = Router();

  r.get('/', async (_req, res) => {
    const routes = await routesRepo.listAll();
    res.json(routes);
  });

  r.post('/:id/baseline', async (req, res, next) => {
    try {
      const id = req.params.id;
      const route = await routesRepo.findByRouteId(id);
      if (!route) throw new NotFoundError('Route not found');
      await routesRepo.setBaseline(id);
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  r.get('/comparison', async (_req, res) => {
    const all = await routesRepo.listAll();
    const baseline = all.find(r => r.isBaseline) ?? null;
    const result = computeComparison(baseline, all);
    res.json(result);
  });

  return r;
}

