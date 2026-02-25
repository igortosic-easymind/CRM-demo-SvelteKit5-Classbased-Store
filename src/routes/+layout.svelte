<script lang="ts">
  import "../app.css";
  import ProtectedLayout from "$lib/components/layouts/protected-layout.svelte";
  import { userStore } from "$lib/store/user.svelte";
  import type { LayoutData } from "./$types";

  let { data, children } = $props<{ data: LayoutData; children: any }>();

  // Initialize user store with data from server
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
