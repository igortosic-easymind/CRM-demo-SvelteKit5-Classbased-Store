<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import type { User } from "$lib/types";

  let { user, children } = $props<{ user: User; children: any }>();
</script>

<div class="min-h-screen bg-background">
  <Sidebar.Provider>
    <AppSidebar />
    <Sidebar.Inset>
      <header class="border-b bg-card shadow-sm">
        <div class="flex h-16 items-center justify-between px-4">
          <Sidebar.Trigger />
          <div class="font-semibold">CRM Easymind</div>
          <div class="flex items-center gap-4">
            <span>{user.username}</span>
            <form method="POST" action="/logout">
              <Button type="submit" variant="link">Logout</Button>
            </form>
          </div>
        </div>
      </header>
      <main class="p-12">
        {@render children()}
      </main>
    </Sidebar.Inset>
  </Sidebar.Provider>
</div>
