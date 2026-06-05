# Kiri

Kiri is a local, read-only React Native desktop viewer for exploring repository topography on **macOS** and **iPadOS**. The MVP focuses on cloning public git repositories and browsing highlighted source files in a fixed 3-zone layout.

## MVP scope

- Clone public git repositories into **virtual sandbox storage** (LightningFS + isomorphic-git)
- Browse a file tree and view syntax-highlighted code in a read-only Shiki WebView canvas
- Persist cloned repo snapshots via AsyncStorage (no native filesystem paths)
- No editing, local execution, commenting, or Cursor Agent SDK integration

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│                      KIRI WORKSPACE                          │
├──────┬────────────────────┬────────────────────────────────┤
│ Repo │ File Tree (260px)    │ Immutable Code Canvas (flex)   │
│ Rail │                      │ Shiki via WebView              │
│ 70px │                      │                                │
└──────┴────────────────────┴────────────────────────────────┘
```

## Requirements

- Node.js 20+
- npm
- Xcode 16+ (macOS + iPad simulator builds)
- CocoaPods

## Setup

```bash
npm install
cd ios && pod install && cd ..
cd macos && pod install && cd ..
```

## Run

**Recommended** — starts Metro and the app together:

```bash
npm run dev:macos    # macOS
npm run dev:ios      # iPad simulator
```

Or use two terminals (Metro does not stay running if you stop it before launching the app):

```bash
# Terminal 1
npm start

# Terminal 2 (from project root, not macos/)
npm run macos
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:macos` | Start Metro + macOS app (recommended) |
| `npm run dev:ios` | Start Metro + iPad simulator (recommended) |
| `npm start` | Metro bundler only |
| `npm run macos` | Build and run macOS app (requires Metro in another terminal) |
| `npm run ios` | Build and run on iPad Pro 13-inch simulator (requires Metro) |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Storage model

Repositories are cloned into per-repo **LightningFS** instances backed by an in-memory virtual filesystem (React Native has no IndexedDB on the JS thread). Indexed file contents are kept in memory and snapshotted to AsyncStorage. macOS and iPadOS use the same code path — there is no direct host filesystem access.

MVP guardrails:

- Max ~512 KB per indexed file
- Max ~2,000 indexed files per repository

## Shiki highlighting

The code canvas loads an inline HTML shell that fetches Shiki from `esm.sh` at runtime. Network access is required for first-load syntax highlighting; a plain-text fallback renders if Shiki fails to load.

## Future integration

Post-MVP agent workflows can hook into [`src/integrations/cursorAgent.ts`](src/integrations/cursorAgent.ts) via `@cursor/sdk`.
