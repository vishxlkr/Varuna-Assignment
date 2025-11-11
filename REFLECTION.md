# Reflection on Using AI Agents

This exercise highlighted practical ways AI agents speed up full‑stack delivery:

- Boilerplate acceleration: scaffolding TypeScript configs, ports/adapters, and HTTP wiring.
- Consistency: generated code follows naming and structure decisions uniformly.
- Iterative fixes: quick patch cycles to resolve integration details (e.g., CSS imports, proxy, env).

What I learned
- Keep domain/use‑cases pure and small; it makes agent‑generated code easy to validate and test.
- Provide precise prompts for cross‑cutting changes (e.g., Tailwind + proxy + endpoints) to reduce rework.

Efficiency vs manual coding
- Agent cut setup time drastically; I focused on domain math and constraints.
- Still required careful review for small mismatches and runtime assumptions (e.g., mapping routeId to shipId).

Improvements next time
- Add a dedicated Ship entity and proper adjusted‑CB calculation including banking deltas.
- Expand tests (integration with Supertest and edge cases) and CI.
- Add charts library for richer Compare visuals.

