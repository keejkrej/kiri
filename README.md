# Kiri

Kiri is a local, read-only viewer for exploring repository topography. Clone public git repositories into virtual sandbox storage and browse syntax-highlighted source files in a fixed 3-zone workspace.

## Monorepo layout

```
kiri/
├── apps/
│   ├── web/      # Vite + React + coss-ui + Effect Atom (primary)
│   └── native/   # React Native macOS + iPadOS shell
├── packages/
│   └── domain/   # Shared Effect Schema + file tree utilities
└── scripts/
```

## MVP scope

- Clone public git repositories into **virtual sandbox storage** (LightningFS + isomorphic-git)
- Browse a file tree and view syntax-highlighted code in a read-only canvas
- Persist cloned repo snapshots (localStorage on web, AsyncStorage on native)
- No editing, local execution, commenting, or Cursor Agent SDK integration

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│                      KIRI WORKSPACE                          │
├──────┬────────────────────┬────────────────────────────────┤
│ Repo │ File Tree (280px)    │ Immutable Code Canvas (flex)   │
│ Rail │                      │ Shiki highlighting           │
│ 72px │                      │                                │
└──────┴────────────────────┴────────────────────────────────┘
```

## Requirements

- Bun 1.2+ (or Node.js 20+)
- Xcode 16+ (native macOS + iPad simulator builds)
- CocoaPods (native only)

## Setup

```bash
bun install
cd apps/native/ios && pod install && cd ../../..
cd apps/native/macos && pod install && cd ../../..
```

## Run

### Web (recommended for development)

```bash
bun run dev:web
```

Opens the cartographic workspace at `http://localhost:5173`.

### Native macOS / iPad

```bash
bun run dev:macos    # macOS
bun run dev:ios      # iPad simulator
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev:web` | Start Vite web app |
| `bun run dev:macos` | Start Metro + macOS app |
| `bun run dev:ios` | Start Metro + iPad simulator |
| `bun run typecheck` | Typecheck all packages |
| `bun run build` | Build web app |
| `bun run verify:clone` | Verify isomorphic-git clone in memory |

## Storage model

Repositories are cloned into per-repo **LightningFS** instances. Indexed file contents are snapshotted to persistent storage (localStorage on web, AsyncStorage on native). There is no direct host filesystem access.

MVP guardrails:

- Max ~512 KB per indexed file
- Max ~2,000 indexed files per repository

## Future integration

Post-MVP agent workflows can hook into [`apps/native/src/integrations/cursorAgent.ts`](apps/native/src/integrations/cursorAgent.ts) via `@cursor/sdk`.
