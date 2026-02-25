# State Management Architecture

## Overview

This application uses **Svelte 5 class-based stores** with runes (`$state`, `$derived`, `$effect`) for all client-side state management. No external libraries — no Redux, Zustand, or Pinia. The stores are plain TypeScript classes whose fields are made reactive by the Svelte 5 compiler.

Data reaches the stores through SvelteKit's server-first loading chain: `+page.server.ts` → `+page.ts` → store → components.

## Store Structure

```
src/lib/store/
├── user.svelte.ts       # Auth, permissions, display name
├── clients.svelte.ts    # Clients, contacts, filters, modals
├── tasks.svelte.ts      # Tasks, filters, pagination
└── calendar.svelte.ts   # Events, filters, view state, modals
```

Each store is a class exported as a singleton instance:

```typescript
export class ClientStore {
  clients = $state<Client[]>([]);
  loading = $state(false);
  // ...methods
}

export const clientStore = new ClientStore();
```

## Core Pattern: Class-Based Stores with Runes

### State as `$state` fields

```typescript
export class TaskStore {
  tasks = $state<Task[]>([]);
  pagination = $state<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  filters = $state<{
    search: string;
    status: TaskStatus | null;
    priority: TaskPriority | null;
  }>({ search: "", status: null, priority: null });

  loading = $state(false);
  error = $state<string | null>(null);
}
```

The `$state` rune is a compiler instruction — Svelte generates reactive plumbing at build time. At runtime this is just a JavaScript class.

### Methods as actions

```typescript
setTasksData(data: { tasks: Task[]; pagination: PaginationState; filters?: {...} }): void {
  this.tasks = data.tasks;
  this.pagination = data.pagination;
  if (data.filters) {
    this.filters = { ...this.filters, ...data.filters };
  }
}

setTasksLoading(loading: boolean): void {
  this.loading = loading;
}
```

No action types. No reducers. No dispatch. Call the method directly.

### Computed properties as getters

```typescript
export class UserStore {
  user = $state<User | null>(null);

  get isAuthenticated() {
    return this.user !== null;
  }

  get displayName(): string | null {
    if (!this.user) return null;
    if (this.user.first_name && this.user.last_name) {
      return `${this.user.first_name} ${this.user.last_name}`;
    }
    return this.user.first_name || this.user.username;
  }

  get permissions(): UserPermissions | null {
    if (!this.user) return null;
    return {
      canCreateClients: this.user.can_manage_clients,
      canDeleteClients: this.user.can_delete_clients,
      isAdmin: this.user.is_superuser || this.user.is_staff,
      // ...
    };
  }
}
```

Standard JS getters. Because they read `$state` properties, Svelte tracks them as derived values automatically — they recompute when dependencies change.

## Data Flow: Server → Store → Component

### Step 1: `+page.server.ts` — Server-only data loading

Runs exclusively on the server. Has access to cookies, env vars, and backend API. Returns typed data.

```typescript
// src/routes/clients/+page.server.ts
export const load: PageServerLoad = async ({ cookies, url }) => {
  const page = Number(url.searchParams.get("page") || "1");
  const search = url.searchParams.get("search") || "";
  const lead = url.searchParams.get("lead") as LeadStatus | null;

  const clientsResponse = await listClients(cookies, {
    page,
    itemsPerPage: 10,
    search,
    lead: lead || undefined,
  });

  return {
    clients: clientsResponse.data,
    pagination: clientsResponse.pagination,
    filters: { search, lead },
  };
};
```

### Step 2: `+page.ts` — Bridge (hydrates the store)

Runs on both server and client. On the client side, it pours server data into the store.

```typescript
// src/routes/clients/+page.ts
export const load: PageLoad = async ({ data, depends }) => {
  depends("app:clients"); // invalidation key

  if (browser) {
    clientStore.setClientsData({
      clients: data.clients,
      pagination: data.pagination,
      filters: data.filters,
    });
    clientStore.setLoading(false);
  }

  return data;
};
```

`depends("app:clients")` registers a cache key. Calling `invalidate("app:clients")` later re-runs the full chain.

### Step 3: Components read from the store

```svelte
<script lang="ts">
  import { clientStore } from "$lib/store/clients.svelte";

  const clientsList = $derived(clientStore.clients);
  const paginationData = $derived(clientStore.pagination);
</script>

{#each clientsList as client}
  <ClientRow {client} />
{/each}
```

Components import the store directly — no props needed, no Provider wrapper.

### The feedback loop

When users interact (filter, search, paginate), the cycle repeats:

1. Component updates store for instant UI feedback: `clientStore.updateFilters({ lead: "hot" })`
2. Component navigates via `goto()` with new URL params
3. SvelteKit re-runs `+page.server.ts` with new params
4. `+page.ts` hydrates the store with fresh server data
5. Components re-render through `$derived`

## When to Use Stores vs Props

### Use a store when:

- Multiple sibling components share the same state (e.g. `SearchBar`, `Filters`, `ClientTable` all read `clientStore`)
- State must persist across client-side navigation
- Interactive features: filtering, pagination, modals, CRUD operations

**Examples:** clients page, tasks page, calendar page

### Use `data` props when:

- Data flows one direction: server → page → child components
- Read-only views with no shared mutable state
- No filtering, pagination, or complex interactions

**Example:** dashboard page

```svelte
<!-- Dashboard: props, no store -->
<script lang="ts">
  import type { PageData } from "./$types";
  let { data } = $props<{ data: PageData }>();
</script>

<StatsCard title="Total Clients" value={data.statistics.totalClients} />
```

### Use component-local `$state` when:

- Temporary UI state: form inputs, toggle flags, debounce timers
- State not needed by sibling/parent components

```svelte
<script lang="ts">
  let searchQuery = $state("");
  let searchTimeout: ReturnType<typeof setTimeout>;
</script>
```

## Store Inventory

### UserStore (`user.svelte.ts`)

| Field / Getter    | Type                               | Purpose                              |
| ----------------- | ---------------------------------- | ------------------------------------ |
| `user`            | `$state<User \| null>`             | Current authenticated user           |
| `loading`         | `$state<boolean>`                  | Auth loading state                   |
| `error`           | `$state<string \| null>`           | Auth error                           |
| `isAuthenticated` | getter → `boolean`                 | Derived from `user !== null`         |
| `permissions`     | getter → `UserPermissions \| null` | Maps API fields to permission object |
| `displayName`     | getter → `string \| null`          | Computed display name                |
| `userRole`        | getter → `string \| null`          | superuser / staff / user             |

Hydrated in `+layout.svelte` via `$effect` from layout server data.

### ClientStore (`clients.svelte.ts`)

| Field                                                       | Type                        | Purpose                      |
| ----------------------------------------------------------- | --------------------------- | ---------------------------- |
| `clients`                                                   | `$state<Client[]>`          | Client list                  |
| `pagination`                                                | `$state<PaginationState>`   | Page state                   |
| `filters`                                                   | `$state<{search, lead}>`    | Active filters               |
| `loading` / `error`                                         | `$state`                    | Loading / error states       |
| `selectedClientContacts`                                    | `$state<ContactResponse[]>` | Contacts for selected client |
| `contactModalOpen` / `contactModalMode` / `selectedContact` | `$state`                    | Contact modal state          |

Key methods: `setClientsData()`, `updateFilters()`, `viewContact()`, `editContact()`, `createContact()`, `closeContactModal()`, `addContactToClient()`, `removeContactFromClient()`

### TaskStore (`tasks.svelte.ts`)

| Field               | Type                                                  | Purpose                |
| ------------------- | ----------------------------------------------------- | ---------------------- |
| `tasks`             | `$state<Task[]>`                                      | Task list              |
| `pagination`        | `$state<PaginationState>`                             | Page state             |
| `filters`           | `$state<{search, status, priority, type, client_id}>` | Active filters         |
| `loading` / `error` | `$state`                                              | Loading / error states |

Key methods: `setTasksData()`, `updateTasksFilters()`, `resetTasksFilters()`

### CalendarStore (`calendar.svelte.ts`)

| Field                                                 | Type                                                                              | Purpose                   |
| ----------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------- |
| `calendarEvents`                                      | `$state<CalendarEvent[]>`                                                         | Event list                |
| `calendarPagination`                                  | `$state<PaginationState>`                                                         | Page state                |
| `calendarFilters`                                     | `$state<{search, type, status, client_id, dates, include_tasks, include_events}>` | Filters                   |
| `loading` / `error`                                   | `$state`                                                                          | Loading / error states    |
| `eventModalOpen` / `eventModalMode` / `selectedEvent` | `$state`                                                                          | Event modal state         |
| `deleteModalOpen` / `eventToDelete`                   | `$state`                                                                          | Delete confirmation modal |
| `calendarView`                                        | `$state<"month" \| "week">`                                                       | Current view mode         |
| `currentCalendarDate`                                 | `$state<string \| null>`                                                          | Currently displayed date  |

Key methods: `setCalendarEventsData()`, `createEvent()`, `viewEvent()`, `editEvent()`, `deleteEvent()`, `closeEventModal()`, `addEvent()`, `updateEvent()`, `removeEvent()`, `setCalendarViewAndDate()`

## User Authentication Flow

The user store is hydrated at the layout level, not per-page:

```typescript
// src/routes/+layout.server.ts
export const load: LayoutServerLoad = async ({ cookies }) => {
  try {
    const user = await getUserFromToken(cookies);
    return { user };
  } catch {
    return {};
  }
};
```

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { userStore } from "$lib/store/user.svelte";
  let { data, children } = $props<{ data: LayoutData; children: any }>();

  $effect(() => {
    if (data.user) {
      userStore.setUser(data.user);
    } else {
      userStore.setUser(null);
    }
  });
</script>

{#if data.user}
  <ProtectedLayout user={data.user}>
    {@render children()}
  </ProtectedLayout>
{:else}
  {@render children()}
{/if}
```

Route protection is enforced in `hooks.server.ts` — unauthenticated requests to protected routes redirect to `/login`.

## Best Practices

1. **One store per domain** — `ClientStore`, `TaskStore`, `CalendarStore`, `UserStore`. Don't make a single god-store.

2. **Methods for mutations, getters for derivations** — Keep the class pattern clean. Methods change state; getters compute from state.

3. **Bridge in `+page.ts`, not in components** — Store hydration happens in the `+page.ts` load function, not in `onMount` or `$effect` inside components.

4. **`if (browser)` guard** — Always wrap store hydration in `+page.ts` with `if (browser)` to avoid running on the server during SSR.

5. **Use `depends()` for invalidation** — Register cache keys in `+page.ts` so you can re-fetch with `invalidate()`.

6. **Don't over-store** — If data only flows server → template (dashboard), use `$props` instead.

7. **URL as source of truth for server queries** — Filters and pagination live in URL search params. Components update the URL; `+page.server.ts` reads the URL. The store reflects the result.

---

**Last Updated:** February 2026
**SvelteKit:** 5.x | **Svelte:** 5.x | **TypeScript:** 5.x
