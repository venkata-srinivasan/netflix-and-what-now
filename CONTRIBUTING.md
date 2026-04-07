# Contributing to Netflix & What Now

Thanks for your interest in contributing! This project is open source and welcomes contributions of all kinds.

## Getting Started

1. Fork the repo
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/netflix-and-what-now.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env.local` and add your API keys
5. Start dev server: `npm run dev`

## Development

```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Production build (checks for errors)
npm run lint      # Run ESLint
```

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Ensure `npm run build` passes with no errors
4. Ensure `npm run lint` passes
5. Write a clear PR description explaining what and why
6. Submit the PR

## What to Contribute

Check the [Roadmap](README.md#roadmap) for planned features. Some good first issues:

- **Audio fingerprinting** -- Integrate ACRCloud or similar to auto-detect what's playing
- **Smart TV APIs** -- Roku, Fire TV, or Samsung TV integration
- **Multi-language** -- i18n support for the UI and voice recognition
- **Better mobile UX** -- Improve the mobile layout and interactions
- **Tests** -- Add integration tests for API routes

## Code Style

- TypeScript throughout
- Functional components with hooks
- Tailwind CSS for styling (use shadcn/ui components where possible)
- Keep API keys and secrets in `.env.local` (never commit them)

## Questions?

Open an issue or start a discussion. We're happy to help!
