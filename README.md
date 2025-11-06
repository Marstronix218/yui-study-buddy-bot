# YUI – Study Buddy

An opinionated Vite + React + TypeScript app with a simple Node/Express API that powers an AI study companion. Pick a character, chat for guidance, and track your study sessions.

## Tech stack

- React 18 + Vite 5 (TypeScript)
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- TanStack Query for data fetching/state
- Express server for the chat API

## Requirements

- Node.js 18+ and npm
- An OpenAI API key

## Getting started

1) Install dependencies

```bash
npm install
```

2) Configure environment variables

Create a file named `.env.local` in the project root:

```ini
# Required by the local API server
OPENAI_API_KEY=your_openai_api_key

# Optional (defaults to 3000)
PORT=3000
```

3) Run the app (two terminals)

- Terminal A – start the API server:

```bash
npm run server
```

- Terminal B – start the frontend dev server:

```bash
npm run dev
```

Frontend: http://localhost:8080  (proxied API at /api → http://localhost:3000)

## Available scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run build:dev` — development-mode build (useful for debugging bundles)
- `npm run preview` — preview the production build locally (run API separately)
- `npm run server` — start the local Express API (`server.ts`)
- `npm run lint` — run ESLint

## Project structure

```
src/
	pages/            # Views: Index (character select), Chat, StudyLog
	shared/           # Shared logic (API client, chat logic, timer)
	components/       # UI components (shadcn/ui)
server.ts           # Express chat API (OpenAI-backed)
vite.config.ts      # Vite config with /api proxy → :3000
```

## Development notes

- The frontend calls `POST /api/chat`; Vite proxies that to the local API server.
- The API requires `OPENAI_API_KEY` and will read it from `.env.local`.
- When using `npm run preview` or deploying the built frontend, make sure the API is hosted and the client can reach it at the same path or adjust the base URL accordingly.

## Deployment

You can deploy the frontend as static assets (e.g., Netlify, Vercel static) and run the Node API separately (e.g., a small VM, Render, Fly.io). Ensure the frontend points its `/api` calls to your API domain or configure an edge proxy.

High-level steps:

1) Build the frontend:

```bash
npm run build
```

2) Host the contents of `dist/` on your static host.

3) Deploy the Node API (from `server.ts`) on your preferred Node host with `OPENAI_API_KEY` set. Expose it at e.g. `https://api.example.com`, and either:

- Serve the API under the same origin as the frontend (recommended), or
- Configure the frontend host to proxy `/api` to your API origin.

## License

This project is provided as-is; add your preferred license if needed.
