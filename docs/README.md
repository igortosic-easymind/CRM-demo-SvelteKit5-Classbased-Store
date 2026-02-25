# ERP Frontend Documentation

> SvelteKit 5 + Svelte 5 runes — class-based state management, server-first data loading, Django REST backend.

## Architecture

- [State Management](architecture/state-management.md) — Class-based stores with `$state` / `$derived`, the `+page.server.ts` → `+page.ts` → store data flow, and when to use stores vs props.

## Tech Stack

| Layer           | Technology                                 |
| --------------- | ------------------------------------------ |
| Framework       | SvelteKit 5 (`@sveltejs/kit ^2.16`)        |
| Language        | Svelte 5 (`^5.0`) + TypeScript 5           |
| Styling         | Tailwind CSS 4, bits-ui, tailwind-variants |
| Testing         | Vitest (unit), Playwright (e2e)            |
| Backend         | Django REST API (separate repo)            |
| Auth            | Token-based, stored in httpOnly cookies    |
| Package Manager | pnpm (workspace)                           |

## Project Structure

```
src/
├── hooks.server.ts          # Auth guard — redirects unauthenticated users
├── routes/
│   ├── +layout.server.ts    # Loads user from token → shared across all pages
│   ├── +layout.svelte       # Hydrates userStore, renders ProtectedLayout
│   ├── dashboard/            # Read-only — uses data props, no store
│   ├── clients/              # Interactive — store + server load + bridge
│   ├── tasks/                # Interactive — store + server load + bridge
│   ├── calendar/             # Interactive — store + server load + bridge
│   ├── login/                # Public route
│   └── settings/             # User settings
├── lib/
│   ├── store/                # Svelte 5 class-based stores
│   │   ├── user.svelte.ts
│   │   ├── clients.svelte.ts
│   │   ├── tasks.svelte.ts
│   │   └── calendar.svelte.ts
│   ├── server/               # Server-only API modules (auth, clients, tasks, calendar)
│   ├── types/index.ts        # Shared TypeScript interfaces
│   ├── components/           # UI components by domain
│   └── hooks/                # Svelte hooks (e.g. is-mobile)
```

## Data Flow Patterns

This application uses two distinct patterns depending on the page:

### Interactive pages (clients, tasks, calendar)

```
+page.server.ts  →  +page.ts (bridge)  →  class-based store  →  components
     server              hydrates store         $state / $derived      import store directly
```

Components import the store instance and read with `$derived()`. No prop drilling.

### Read-only pages (dashboard)

```
+page.server.ts  →  +page.svelte  →  child components via props
     server              let { data } = $props()
```

Data flows through `$props` — simpler, no store needed.

See [State Management](architecture/state-management.md) for full details and code examples.

## Development

```bash
pnpm install
pnpm dev          # Start dev server
pnpm check        # Type checking
pnpm lint         # Lint + format check
pnpm test:unit    # Vitest
pnpm test:e2e     # Playwright
pnpm build        # Production build
```

Requires `API_URL` environment variable pointing to the Django backend (defaults to `http://127.0.0.1:8000/api`).
