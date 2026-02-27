# SnowRunner Guide Forum

Full-stack TypeScript forum for SnowRunner map guides: guides, markers (Leaflet maps), and comments.

## Structure

- **client/** – Vite + React + TypeScript (strict)
- **server/** – Node.js + Express + TypeScript (strict)
- **shared/** – Types and Zod schemas used by both

## Quick Start (Recommended)

For a complete automated setup, use the provided scripts:

**Windows:**
```bash
.\start-dev.bat
```

**Linux/macOS:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

This script will:
- Install dependencies (if needed)
- Build the shared module
- Run database migrations
- Start both development servers

## Manual Setup

1. **Install dependencies** (from repo root):

   ```bash
   pnpm install
   ```

2. **Database** (PostgreSQL, e.g. Supabase or Neon):

   - Create a database and get `DATABASE_URL`.
   - Copy `.env.example` to `.env` in the project root and set:
     - `DATABASE_URL`
     - `JWT_SECRET` (min 32 characters)
     - Optionally `PORT` (default 3001)

3. **Run migrations** (from repo root, with `.env` set):

   ```bash
   cd server && pnpm run db:push
   ```

   Or generate and run migrations:

   ```bash
   cd server && pnpm run db:generate && pnpm run db:migrate
   ```

4. **Build shared** (needed for server and for client type-check):
   ```bash
   cd shared && pnpm run build && cd ..
   ```

5. **Start dev**:

   - Terminal 1 – API:
     ```bash
     pnpm run dev:server
     ```
   - Terminal 2 – Client:
     ```bash
     pnpm run dev
     ```

   Client runs at http://localhost:5173 and proxies `/api` to the server (default http://localhost:3001).  
   For a fresh clone, run `pnpm run build` in `shared` first so client and server can resolve shared types.

## Scripts (from root)

- `pnpm run dev` – start client dev server
- `pnpm run dev:server` – start API dev server (tsx watch)
- `pnpm run build` – build client
- `pnpm run build:server` – build server (tsc)
- `pnpm run preview` – preview client build

## Tech

- **Client:** Vite, React, React Router, Leaflet, Zod
- **Server:** Express, Drizzle ORM (PostgreSQL), JWT (jsonwebtoken), bcrypt, Zod
- **Shared:** TypeScript interfaces, Zod schemas, no `any` (strict TS)

## API

- `POST /api/auth/register` – register
- `POST /api/auth/login` – login
- `GET /api/auth/me` – current user (auth required)
- `GET /api/guides` – list guides (query: page, limit, mapId, published)
- `GET /api/guides/slug/:slug` – guide by slug
- `GET /api/guides/:id` – guide by id
- `POST /api/guides` – create guide (auth)
- `PATCH /api/guides/:id` – update guide (author)
- `DELETE /api/guides/:id` – delete guide (author)
- `GET /api/guides/:guideId/markers` – markers for a guide
- `POST /api/markers` – create marker (auth, guide author)
- `PATCH /api/markers/:id` – update marker
- `DELETE /api/markers/:id` – delete marker
- `GET /api/comments/guide/:guideId` – comments for guide
- `POST /api/comments` – create comment (auth)
- `PATCH /api/comments/:id` – update comment (author)
- `DELETE /api/comments/:id` – delete comment (author)
