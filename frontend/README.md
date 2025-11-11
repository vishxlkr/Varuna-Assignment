# FuelEU Maritime UI

A lightweight React + TypeScript interface for exploring FuelEU Maritime compliance data. The UI focuses on clarity over visual effects so compliance, banking, and pooling information stay front and center.

## Features
- **Route insights** – fetch routes from the backend, inspect intensity, and set a baseline with one click.
- **Comparison view** – contrast routes against the saved baseline and surface compliance gaps.
- **Banking workspace** – review calculated compliance balance (CB) values and trigger banking/apply calls.
- **Pooling overview** – list pool members, contributions, and allocations for Article 21 scenarios.

## Tech Stack
- React 18 + TypeScript
- Vite dev server and build pipeline
- TailwindCSS utility layer with a few handcrafted styles in App.css
- Ports & adapters layout that keeps src/core framework-agnostic

## Getting Started
1. Install dependencies:
   `ash
   npm install
   `
2. (Optional) Configure the API base in rontend/.env using VITE_API_URL. Defaults to http://localhost:5000 which matches the backend service.
3. Launch the dev server:
   `ash
   npm run dev
   `
4. Build for production:
   `ash
   npm run build
   npm run preview
   `

## Project Structure
`
frontend/
├─ public/
├─ src/
│  ├─ adapters/
│  │  ├─ infrastructure/    # REST client for the backend
│  │  └─ ui/                # Components + pages rendered in App
│  ├─ core/                 # Domain DTOs and ports (framework-free)
│  ├─ assets/               # Static assets (logos, svgs, ...)
│  ├─ App.tsx               # Simple shell with tab navigation
│  ├─ App.css               # Minimal custom styling
│  └─ index.css             # Tailwind base layer
└─ vite.config.ts
`

## Available Scripts
- 
pm run dev – start Vite with HMR
- 
pm run build – produce a production bundle
- 
pm run preview – preview the production build locally
- 
pm run lint – run the default ESLint config

## Notes
- The UI expects the backend to expose the routes, comparison, banking, and pooling endpoints documented at the root project level.
- Error boundaries are intentionally simple; backend validation messages are surfaced verbatim to keep the interface lean.
- If you add new API calls, mirror the existing port definitions inside src/core/ports for consistency.
