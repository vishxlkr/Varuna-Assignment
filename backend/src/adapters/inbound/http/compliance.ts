import { Router } from 'express';
import type { RoutesPort } from '../../../core/ports/RoutesPort';
import type { CompliancePort } from '../../../core/ports/CompliancePort';
import { computeCbForRoute } from '../../../core/application/ComputeCB';
import { BadRequestError, NotFoundError } from '../../../shared/errors';

export function complianceRouter(routesRepo: RoutesPort, complianceRepo: CompliancePort) {
  const r = Router();

  r.get('/cb', async (req, res, next) => {
    try {
      const { shipId, year } = req.query as { shipId?: string; year?: string };
      if (!shipId || !year) throw new BadRequestError('shipId and year are required');
      const route = await routesRepo.findByRouteId(shipId);
      if (!route || route.year !== Number(year)) throw new NotFoundError('Matching route/year not found');
      const cb = computeCbForRoute(route);
      await complianceRepo.upsertCompliance({ shipId, year: Number(year), cb_gco2eq: cb });
      res.json({ shipId, year: Number(year), cb_gco2eq: cb });
    } catch (e) { next(e); }
  });

  r.get('/adjusted-cb', async (req, res, next) => {
    try {
      const { shipId, year } = req.query as { shipId?: string; year?: string };
      if (!shipId || !year) throw new BadRequestError('shipId and year are required');
      const rec = await complianceRepo.getCompliance(shipId, Number(year));
      if (!rec) throw new NotFoundError('Compliance record not found');
      // In this simplified model, adjusted CB = cb + sum(bank_entries), but complianceRepo does not include bank; client should query banking records separately.
      res.json(rec);
    } catch (e) { next(e); }
  });

  return r;
}

