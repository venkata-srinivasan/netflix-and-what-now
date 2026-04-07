# CLAUDE.md

## Project
Netflix & What Now — open-source AI TV companion. Point your phone at the TV, ask anything.

## Session Start
1. Read docs/STATUS.md
2. Pick up in-progress task or ask

## Workflow
After every code change:
1. `npm run lint` — fix issues
2. `npm run build` — fix failures
3. `npm test` — ensure tests pass
4. Commit with conventional prefix (feat/fix/refactor/test/docs)

## Architecture

### Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui (Base UI primitives)
- AI SDK + OpenAI GPT-4o (vision + chat)
- TMDB API (show/movie metadata)
- Web Speech API (voice input/output)
- PWA (installable on phone)

### Key Paths
```
src/app/page.tsx              — Landing page
src/app/(app)/watch/page.tsx  — Main app (camera + chat + voice)
src/app/api/chat/route.ts     — Streaming AI chat
src/app/api/identify/route.ts — Vision AI (identify show from screenshot)
src/app/api/tmdb/route.ts     — TMDB proxy
src/hooks/use-camera.ts       — Camera capture hook
src/hooks/use-voice.ts        — Web Speech API hook
src/components/               — UI components
src/lib/tmdb.ts               — TMDB API helper
src/lib/rate-limit.ts         — In-memory rate limiter
src/lib/bot-protection.ts     — Bot detection + rate limiting
__tests__/                    — Vitest integration tests
```

### Conventions
- BYOK (Bring Your Own Key) — users set OPENAI_API_KEY and TMDB_API_KEY in .env.local
- No auth, no payments, no database
- Dark theme by default
- Mobile-first design
- Open source — MIT license

## Commands
```
npm run dev        — Start dev server
npm run build      — Production build
npm run lint       — Run ESLint
npm test           — Run Vitest tests
npm run test:watch — Run tests in watch mode
```
