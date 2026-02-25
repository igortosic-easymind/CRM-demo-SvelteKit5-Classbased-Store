<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import Trash from "@lucide/svelte/icons/trash";
  import type { Client } from "$lib/types";
  import { userStore } from "$lib/store/user.svelte";

  const currentUser = $derived(userStore.user);

  // Props
  const { client, disabled = false } = $props<{
    client: Client;
    disabled?: boolean;
  }>();

  // Local state
  let open = $state(false);

  // Toggle dialog
  function toggleDialog() {
    open = !open;
  }
</script>

<!-- Delete Client Button -->
{#if client.owner_id === currentUser?.id}
  <Button variant="ghost" size="icon" class="text-destructive" {disabled} onclick={toggleDialog}>
    <Trash class="h-4 w-4" />
    <span class="sr-only">Delete</span>
  </Button>
{/if}

<!--  Delete Confirmation Dialog -->
<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Delete Client</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete {client.company_name || `${client.first_name} ${client.last_name}`}? This
          action cannot be undone.
        </Dialog.Description>
      </Dialog.Header>

      <form method="POST" action={`/clients/${client.id}/delete`} class="mt-2">
        <Dialog.Footer>
          <Button variant="outline" type="button" onclick={toggleDialog}>Cancel</Button>
          <Button variant="destructive" type="submit">Delete</Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
