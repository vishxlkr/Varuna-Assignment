import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { routesRouter } from '../../adapters/inbound/http/routes';
import { complianceRouter } from '../../adapters/inbound/http/compliance';
import { bankingRouter } from '../../adapters/inbound/http/banking';
import { poolsRouter } from '../../adapters/inbound/http/pools';
import { RoutesRepo } from '../../adapters/outbound/postgres/RoutesRepo';
import { ComplianceRepo } from '../../adapters/outbound/postgres/ComplianceRepo';
import { BankingRepo } from '../../adapters/outbound/postgres/BankingRepo';
import { PoolsRepo } from '../../adapters/outbound/postgres/PoolsRepo';
import { NotFoundError, BadRequestError } from '../../shared/errors';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 5000);

app.use(cors({ origin: [/localhost:\\d+$/], credentials: false }));
app.use(express.json());

const routesRepo = new RoutesRepo();
const complianceRepo = new ComplianceRepo();
const bankingRepo = new BankingRepo();
const poolsRepo = new PoolsRepo();

app.use('/routes', routesRouter(routesRepo));
app.use('/compliance', complianceRouter(routesRepo, complianceRepo));
app.use('/banking', bankingRouter(bankingRepo, routesRepo, complianceRepo));
app.use('/pools', poolsRouter(poolsRepo));

app.get('/health', (_req, res) => res.json({ ok: true }));

if (process.env.NODE_ENV === 'production') {
  const dist = path.resolve(process.cwd(), '..', 'frontend', 'dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  const status = err?.status ?? 500;
  res.status(status).json({ error: err?.message ?? 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
