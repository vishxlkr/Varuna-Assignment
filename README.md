# FuelEU Maritime — Full-Stack Assignment

This repository contains a minimal FuelEU Maritime compliance module implemented with a hexagonal architecture.

- Frontend: React + TypeScript + TailwindCSS (Vite)
- Backend: Node.js + TypeScript + PostgreSQL (Express + pg)
- Architecture: Ports & Adapters (hexagonal)

## Structure

- `frontend/` — UI (tabs: Routes, Compare, Banking, Pooling)
- `backend/` — APIs and domain logic
- `AGENT_WORKFLOW.md` — AI agent usage log (mandatory)
- `REFLECTION.md` — Reflection on using AI agents

## Hexagonal Overview

Core (pure TS) is isolated from frameworks and I/O:

Backend `src/`
- `core/` — domain entities, use-cases, ports
- `adapters/` — inbound HTTP (Express) and outbound Postgres repos
- `infrastructure/` — server startup, DB migrations and seeds
- `shared/` — errors and common types

Frontend `src/`
- `core/` — domain DTOs and ports
- `adapters/` — `ui/` pages and `infrastructure/` API client

## Backend: Setup

Prerequisites: PostgreSQL running and a database created (e.g., `fueleu`).

1. Copy `backend/.env.example` to `backend/.env` and set `POSTGRES_URL`.
2. Install dependencies and run migrations + seeds:

```
cd backend
npm i
npm run db:migrate
npm run db:seed
```

3. Start the API server (dev):

```
npm run dev
```

Server runs on `http://localhost:5000`.

## Frontend: Setup

```
cd frontend
npm i
npm run dev
```

Vite dev server proxies API calls to `http://localhost:5000`.

## API Endpoints

- `GET /routes` — list routes
- `POST /routes/:id/baseline` — mark baseline
- `GET /routes/comparison` — baseline vs others (with `%` and `compliant`)
- `GET /compliance/cb?shipId&year` — compute/store CB snapshot
- `GET /compliance/adjusted-cb?shipId&year` — fetch stored CB (simplified)
- `GET /banking/records?shipId&year` — list bank entries
- `POST /banking/bank` — bank positive CB (KPIs)
- `POST /banking/apply` — apply banked surplus to deficit (KPIs)
- `POST /pools` — create pool with greedy allocation

## Notes

- For simplicity, `shipId` equals `routeId` in this implementation.
- Energy approximation uses `41,000 MJ/t`.
- 2025 target: `89.3368 gCO₂e/MJ`.

## Testing

Unit tests (Vitest) are set up for backend use-cases. Run:

```
cd backend
npm run test
```

## Sample Requests

- Set baseline:
```
curl -X POST http://localhost:5000/routes/R001/baseline
```

- Comparison:
```
curl http://localhost:5000/routes/comparison
```

- Compute CB:
```
curl "http://localhost:5000/compliance/cb?shipId=R001&year=2024"
```

- Bank surplus:
```
curl -X POST http://localhost:5000/banking/bank -H "Content-Type: application/json" -d '{"shipId":"R001","year":2024}'
```

- Apply banked:
```
curl -X POST http://localhost:5000/banking/apply -H "Content-Type: application/json" -d '{"shipId":"R003","year":2024,"amount":1000}'
```

- Create pool:
```
curl -X POST http://localhost:5000/pools -H "Content-Type: application/json" \
  -d '{"year":2024,"members":[{"shipId":"R002","cb_before":5000},{"shipId":"R003","cb_before":-4000}]}'
```

## Screenshots

- See running app for the four tabs. You can capture screens after starting both servers.

