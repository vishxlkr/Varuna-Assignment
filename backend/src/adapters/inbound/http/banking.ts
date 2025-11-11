import { Router } from 'express';
import type { BankingPort } from '../../../core/ports/BankingPort';
import type { RoutesPort } from '../../../core/ports/RoutesPort';
import type { CompliancePort } from '../../../core/ports/CompliancePort';
import { computeCbForRoute } from '../../../core/application/ComputeCB';
import { applyBanked, bankSurplus } from '../../../core/application/Banking';
import { BadRequestError, NotFoundError } from '../../../shared/errors';

export function bankingRouter(bankingRepo: BankingPort, routesRepo: RoutesPort, complianceRepo: CompliancePort) {
  const r = Router();

  r.get('/records', async (req, res) => {
    const { shipId, year } = req.query as { shipId?: string; year?: string };
    if (!shipId || !year) throw new BadRequestError('shipId and year are required');
    const records = await bankingRepo.listBankRecords(shipId, Number(year));
    res.json(records);
  });

  r.post('/bank', async (req, res, next) => {
    try {
      const { shipId, year } = req.body as { shipId?: string; year?: number };
      if (!shipId || !year) throw new BadRequestError('shipId and year are required');
      const route = await routesRepo.findByRouteId(shipId);
      if (!route || route.year !== Number(year)) throw new NotFoundError('Matching route/year not found');
      const cb = computeCbForRoute(route);
      await complianceRepo.upsertCompliance({ shipId, year, cb_gco2eq: cb });
      const kpis = await bankSurplus(bankingRepo, shipId, year, cb);
      res.json(kpis);
    } catch (e) { next(e); }
  });

  r.post('/apply', async (req, res, next) => {
    try {
      const { shipId, year, amount } = req.body as { shipId?: string; year?: number; amount?: number };
      if (!shipId || !year || amount == null) throw new BadRequestError('shipId, year, amount are required');
      const route = await routesRepo.findByRouteId(shipId);
      if (!route || route.year !== Number(year)) throw new NotFoundError('Matching route/year not found');
      const cb = computeCbForRoute(route); // deficit if negative
      const kpis = await applyBanked(bankingRepo, shipId, year, cb, amount);
      res.json(kpis);
    } catch (e) { next(e); }
  });

  return r;
}

