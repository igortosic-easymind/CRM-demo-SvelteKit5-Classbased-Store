# ERP Frontend — SvelteKit 5

A modern ERP system built with SvelteKit 5 and Svelte 5 runes. Features client management, task tracking, calendar scheduling, and a dashboard — all powered by class-based reactive stores with zero external state management libraries.

## Features

- **Client Management** — CRUD, contact management, lead filtering, search, pagination
- **Task Tracking** — Status/priority filters, client association, pagination
- **Calendar** — Month/week views, event CRUD, combined events + tasks view
- **Dashboard** — Statistics, client distribution, growth charts, recent activity
- **Authentication** — Token-based auth with httpOnly cookies, route protection
- **Responsive UI** — Tailwind CSS 4, bits-ui components, mobile-aware layout

## Tech Stack

| Layer            | Technology                                       |
| ---------------- | ------------------------------------------------ |
| Framework        | SvelteKit 5 (`@sveltejs/kit ^2.16`)              |
| UI               | Svelte 5 (`^5.0`) + TypeScript 5                 |
| Styling          | Tailwind CSS 4, bits-ui, tailwind-variants       |
| State Management | Svelte 5 runes — class-based stores (no library) |
| Icons            | Lucide Svelte                                    |
| Testing          | Vitest (unit), Playwright (e2e)                  |
| Backend          | Django REST API (separate repo)                  |
| Auth             | JWT tokens in httpOnly cookies                   |
| Package Manager  | pnpm                                             |

## Documentation

Detailed documentation is in the [docs/](docs/) directory:

- [Project Overview](docs/README.md) — structure, data flow patterns, dev commands
- [State Management Architecture](docs/architecture/state-management.md) — class-based stores, server→store→component flow, store inventory

## Demo Access

This is a **demo repository**. The app requires a test user account to log in.

To request demo credentials, contact: **info@easymindstudio.com**

## Getting Started

1. **Clone and install:**

```bash
git clone <repository-url>
cd frontend
pnpm install
```

2. **Environment variables:**

Create a `.env` file:

```env
API_URL="https://easymind-erp-api.onrender.com/api"
```

Point `API_URL` to your Django backend instance.

3. **Run development server:**

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project Structure

```
src/
├── hooks.server.ts            # Auth guard — redirects unauthenticated users
├── routes/
│   ├── +layout.server.ts      # Loads user from token (shared across all pages)
│   ├── +layout.svelte         # Hydrates userStore, renders ProtectedLayout
│   ├── dashboard/             # Read-only — uses data props, no store
│   ├── clients/               # Interactive — class store + server load + bridge
│   │   ├── +page.server.ts    # Server: fetches clients with filters from URL
│   │   ├── +page.ts           # Bridge: hydrates clientStore in browser
│   │   ├── +page.svelte       # Renders <ClientList />
│   │   ├── [id]/              # Client detail / edit
│   │   └── new/               # New client form
│   ├── tasks/                 # Same pattern as clients
│   ├── calendar/              # Same pattern + form actions for CRUD
│   ├── login/                 # Public route
│   └── settings/
├── lib/
│   ├── store/                 # Svelte 5 class-based stores
│   │   ├── user.svelte.ts     # Auth, permissions, display name
│   │   ├── clients.svelte.ts  # Clients, contacts, filters, modals
│   │   ├── tasks.svelte.ts    # Tasks, filters, pagination
│   │   └── calendar.svelte.ts # Events, filters, view state, modals
│   ├── server/                # Server-only API modules
│   │   ├── auth.ts            # Login, token validation, user fetching
│   │   ├── clients.ts         # Client API calls
│   │   ├── tasks.ts           # Task API calls
│   │   └── calendar.ts        # Calendar API calls
│   ├── types/index.ts         # Shared TypeScript interfaces
│   ├── components/            # UI components by domain
│   │   ├── clients/           # client-list, client-table, filters, search-bar...
│   │   ├── tasks/             # task-list, task components
│   │   ├── calendar/          # month/week views, event modal, filters
│   │   ├── dashboard/         # stats-card, charts, recent activity
│   │   ├── layouts/           # protected-layout, sidebar
│   │   └── ui/                # Shared primitives (button, input, dialog...)
│   └── hooks/                 # Svelte hooks (is-mobile)
├── app.html                   # HTML template
└── app.css                    # Global styles (Tailwind)
```

## Architecture Highlights

### State Management — No External Libraries

All client-side state is managed through **Svelte 5 class-based stores** using runes (`$state`, `$derived`, `$effect`). No Redux, Zustand, or any third-party state library.

```typescript
// Example: src/lib/store/clients.svelte.ts
export class ClientStore {
  clients = $state<Client[]>([]);
  loading = $state(false);
  filters = $state<{ search: string; lead: LeadStatus | null }>({ search: "", lead: null });

  setClientsData(data: { clients: Client[]; pagination: PaginationState }) {
    this.clients = data.clients;
    this.pagination = data.pagination;
  }

  updateFilters(newFilters: { search?: string; lead?: LeadStatus | null }) {
    this.filters = { ...this.filters, ...newFilters };
  }
}

export const clientStore = new ClientStore();
```

### Data Flow: Server → Bridge → Store → Components

```
+page.server.ts  →  +page.ts (bridge)  →  class store  →  components
     server-only       if (browser) {          $state        $derived(store.field)
     cookies, API       store.setData()       }
```

Interactive pages (clients, tasks, calendar) use this pattern. Read-only pages (dashboard) pass data as `$props` directly — no store needed.

## Scripts

```bash
pnpm dev            # Start dev server
pnpm build          # Production build
pnpm preview        # Preview production build
pnpm check          # Type check (svelte-check)
pnpm lint           # ESLint + Prettier check
pnpm format         # Format with Prettier
pnpm test:unit      # Vitest
pnpm test:e2e       # Playwright
pnpm test           # Run all tests
```

## Learn More

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/$state)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [bits-ui](https://bits-ui.com)

---

Last Updated: February 2026
