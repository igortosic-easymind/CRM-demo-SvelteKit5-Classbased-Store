<!-- src/routes/clients/[id]/edit/+page.svelte -->
<script lang="ts">
  import ClientForm from "$lib/components/clients/client-form.svelte";
  import type { PageData } from "./$types";
  
  // Get the data from the server load function
  let { data, form = {} } = $props<{
    data: PageData;
    form?: { success?: boolean; error?: string };
  }>();
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Edit Client</h1>
  </div>
  
  <!-- Pass the client data to the form component -->
  <ClientForm client={data.client} {form} />
</div>