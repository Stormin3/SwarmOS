# SwarmOS

Multi-agent orchestration dashboard — manage a fleet of AI agents with profiles, projects, chat, integrations, and real-time monitoring from one control plane.

View the live demo in AI Studio: https://ai.studio/apps/aa65803b-ca39-4970-961b-e4b23ae87b5e

## Features

- **Agent directory** — browse every agent with detailed profile pages
- **Dashboard** — fleet-wide overview of agents, projects, and activity
- **Projects** — organize work across agents and track progress
- **Chat** — converse with agents directly from the dashboard
- **HR Expert** — AI assistant for team/people questions
- **Integrations** — connect external tools and services
- **Security** — security settings and controls for the agent fleet
- **Brand kit** — centralized branding assets and configuration
- **Real-time updates** — WebSocket-powered live state between server and UI
- **Settings** — app-wide configuration
- **Tests** — Vitest suite with Testing Library coverage

## Quickstart

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Copy the environment template and fill in your values:
   `cp .env.example .env`

   | Variable | Purpose |
   |---|---|
   | `GEMINI_API_KEY` | Powers the AI assistants |
   | `APP_URL` | Public URL for OAuth callbacks and API endpoints |

3. Run the dev servers (frontend + API):
   `npm run dev:all`

   Or run them separately:
   - API only: `npm run server`
   - Frontend only: `npm run dev` (Vite on port 3000)
4. Production build:
   `npm run build`
5. Run tests:
   `npm test`
6. Type-check:
   `npm run lint`

## Tech stack

React 19 · React Router · Express · better-sqlite3 · WebSocket (ws) · Vite · Tailwind CSS 4 · Gemini AI · Zod · Vitest

## Project structure

- `src/pages/` — `Dashboard`, `Directory`, `AgentProfile`, `HRExpert`, `Chat`, `Integrations`, `Projects`, `Security`, `BrandKit`, `Settings`
- `src/components/Layout.tsx` — shared app shell and navigation
- `server/index.ts` — Express API with SQLite storage and WebSocket server

## Notes

- The API server uses SQLite (better-sqlite3) — no external database to configure.
- Real-time UI updates are pushed over WebSocket; the frontend falls back gracefully if the socket drops.
