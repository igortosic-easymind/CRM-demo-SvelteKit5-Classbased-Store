<script lang="ts">
  import ClientForm from "$lib/components/clients/client-form.svelte";
  
  // Form data will be passed if there's an error after submission
  let { form = {} } = $props<{ form?: { success?: boolean; error?: string } }>();
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Add New Client</h1>
  </div>
  
  <ClientForm {form} />
</div>