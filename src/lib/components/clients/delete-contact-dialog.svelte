<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import Trash from "@lucide/svelte/icons/trash";
  import type { ContactCreate } from "$lib/types";

  // Props
  const { contact, clientId, disabled = false } = $props<{
    contact: ContactCreate & { id?: number };
    clientId: number;
    disabled?: boolean;
  }>();

  // Local state
  let open = $state(false);

  // Toggle dialog
  function toggleDialog() {
    open = !open;
  }

  // Only show delete button if contact has an ID (exists on server)
  const canDelete = $derived(contact.id && contact.id > 0);
</script>

<!-- Delete Contact Button -->
{#if canDelete}
  <Button variant="ghost" size="icon" class="h-6 w-6 text-destructive" {disabled} onclick={toggleDialog}>
    <Trash class="h-3 w-3" />
    <span class="sr-only">Delete Contact</span>
  </Button>
{/if}

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Delete Contact</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete {contact.first_name} {contact.last_name}? This action cannot be undone.
        </Dialog.Description>
      </Dialog.Header>

      <form method="POST" action={`/clients/${clientId}/contacts/${contact.id}/delete`} class="mt-2">
        <Dialog.Footer>
          <Button variant="outline" type="button" onclick={toggleDialog}>Cancel</Button>
          <Button variant="destructive" type="submit">Delete</Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root> 