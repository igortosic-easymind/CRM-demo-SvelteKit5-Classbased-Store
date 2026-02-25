<!-- src/lib/components/tasks/delete-task-dialog.svelte -->
<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import Trash from "@lucide/svelte/icons/trash";
  import type { Task } from "$lib/types";

  // Props
  const { task, disabled = false } = $props<{
    task: Task;
    disabled?: boolean;
  }>();

  // Local state
  let open = $state(false);

  // Toggle dialog
  function toggleDialog() {
    open = !open;
  }
</script>

<!-- Delete Task Button -->

  <Button variant="ghost" size="icon" class="text-destructive" {disabled} onclick={toggleDialog}>
    <Trash class="h-4 w-4" />
    <span class="sr-only">Delete</span>
  </Button>


<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Delete Task</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
        </Dialog.Description>
      </Dialog.Header>

      <form method="POST" action={`/tasks/${task.id}/delete`} class="mt-2">
        <Dialog.Footer>
          <Button variant="outline" type="button" onclick={toggleDialog}>Cancel</Button>
          <Button variant="destructive" type="submit">Delete</Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
