# STATUS — Netflix & What Now

## Current State: Production Quality MVP

### What's Done
- [x] Landing page (hero, stats, how-it-works, features, FAQ, JSON-LD)
- [x] App at /watch (camera + chat + voice + show search)
- [x] GPT-4o Vision — identifies shows from TV screenshots
- [x] AI chat — streaming answers with show context
- [x] TMDB integration — show search, cast, plot, episodes
- [x] Voice input — Web Speech API, hands-free questions
- [x] Show context sidebar — search + select what you're watching
- [x] PWA — installable on phone home screen
- [x] Rate limiting + bot protection on all API routes
- [x] Error boundary, loading skeleton, 404 page
- [x] SEO — sitemap.xml, robots.txt, OG image, JSON-LD schemas
- [x] Integration tests — 15 passing (Vitest)
- [x] Deployed to Vercel
- [x] Open source — MIT license, BYOK, CONTRIBUTING.md

### What's Next
- [ ] Test on actual phone with real TV
- [ ] Audio fingerprinting (ACRCloud) for auto-detect
- [ ] Conversation memory across sessions
- [ ] VocalBridge AI integration for better voice
- [ ] Multi-language support

### Known Issues
- `<img>` lint warnings (intentional — base64 data URLs + TMDB external images)
- Speech recognition requires HTTPS (works on Vercel deploy)

### Last Updated
2026-04-07
