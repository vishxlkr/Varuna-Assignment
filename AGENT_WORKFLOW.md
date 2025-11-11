# AI Agent Workflow Log

## Agents Used
- OpenAI Codex CLI (primary agent for scaffolding and refactors)

## Prompts & Outputs
- Prompt: "Scaffold a hexagonal Node TS backend with Express + PostgreSQL for routes/compliance/banking/pooling; and a React+TS+Tailwind frontend with tabs."
  - Output: Generated backend ports, adapters, migrations, seeds, HTTP routers, and frontend pages with Tailwind-powered UI.
- Prompt refinement: "Add Vite proxy for API and Tailwind config; implement banking KPIs and greedy pooling."
  - Output: Vite proxy mapping, Tailwind config files, banking/pooling logic and UI.

## Validation / Corrections
- Ensured TypeScript strict options in backend tsconfig.
- Replaced default Vite CSS with Tailwind directives; corrected import location to avoid duplication.
- Added SQL migrations and seed scripts to align DB schema with domain.

## Observations
- Agent accelerated boilerplate generation (files, wiring, consistent naming).
- Needed manual decisions for ambiguous parts (e.g., mapping routeId to shipId for simplicity).
- Iterative patching surfaced small mismatches (CSS file contents) that were corrected.

## Best Practices Followed
- Hexagonal layering: core domain/use-cases/ports separate from adapters.
- Minimal dependencies; pure functions in use-cases for testability.
- Clear scripts for migrations, seeding, dev, build, and tests.

