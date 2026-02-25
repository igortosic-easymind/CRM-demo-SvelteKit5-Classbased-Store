<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import ClientDetails from "$lib/components/clients/client-details.svelte";
  import ClientTasks from "$lib/components/clients/client-tasks.svelte";
  import type { PageData } from "./$types";
  import { userStore } from "$lib/store/user.svelte";

  // Get the data from the server load function
  let { data } = $props<{ data: PageData }>();

  const currentUser = $derived(userStore.user);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Client Details</h1>
    <div class="flex gap-2">
      <Button variant="outline" href="/clients">Back to Clients</Button>
      {#if data.client.owner_id === currentUser?.id}
        <Button href="/clients/{data.client.id}/edit">Edit Client</Button>
      {/if}
    </div>
  </div>

  <!-- Client details and tasks side by side -->
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <div class="lg:col-span-2">
      <ClientDetails client={data.client} />
    </div>
    <div class="lg:col-span-1">
      <ClientTasks clientId={data.client.id} tasks={data.clientTasks} />
    </div>
  </div>
</div>
