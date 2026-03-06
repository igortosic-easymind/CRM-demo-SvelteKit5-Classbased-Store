<!-- src/lib/components/clients/client-tasks.svelte -->
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { taskStore } from "$lib/store/tasks.svelte";
  import type { Task } from "$lib/types";
  import Plus from "@lucide/svelte/icons/plus";
  import Eye from "@lucide/svelte/icons/eye";
  import Edit from "@lucide/svelte/icons/edit";
  import CalendarDays from "@lucide/svelte/icons/calendar-days";

  // Props
  const { clientId, tasks: propTasks = [] }: { clientId: number; tasks?: Task[] } = $props();

  // Use tasks from props if available, otherwise filter from store
  const clientTasks = $derived(
    propTasks.length > 0 
      ? propTasks.filter((task: Task) => task.client_id === clientId)
      : taskStore.tasks.filter((task: Task) => task.client_id === clientId)
  );

  function formatDate(dateString: string | undefined) {
    if (!dateString) return "No due date";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "todo":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getPriorityClass(priority: string | undefined): string {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }
</script>

<Card.Root class="h-fit">
  <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-3">
    <Card.Title class="text-lg">Related Tasks</Card.Title>
    <Button href="/tasks/new?client_id={clientId}" size="sm">
      <Plus class="mr-2 h-4 w-4" />
      Add Task
    </Button>
  </Card.Header>

  <Card.Content>
    {#if clientTasks.length === 0}
      <div class="flex flex-col items-center justify-center py-8 text-center">
        <CalendarDays class="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 class="mt-2 text-sm font-semibold">No tasks</h3>
        <p class="mt-1 text-sm text-muted-foreground">No tasks have been created for this client yet.</p>
        <Button href="/tasks/new?client_id={clientId}" size="sm" class="mt-4">
          <Plus class="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>
    {:else}
      <div class="space-y-3">
        {#each clientTasks as task (task.id)}
          <div class="flex flex-col gap-2 rounded-md border p-3 hover:bg-muted/50">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <h4 class="font-medium truncate">{task.title}</h4>
                {#if task.description}
                  <p class="text-sm text-muted-foreground truncate mt-1">{task.description}</p>
                {/if}
              </div>
              <div class="flex gap-1">
                <Button variant="ghost" size="sm" href="/tasks/{task.id}">
                  <Eye class="h-4 w-4" />
                </Button>
                
                  <Button variant="ghost" size="sm" href="/tasks/{task.id}/edit">
                    <Edit class="h-4 w-4" />
                  </Button>
             
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2 text-xs">
              <Badge class={getStatusClass(task.status)}>
                {task.status}
              </Badge>
              {#if task.priority}
                <Badge variant="outline" class={getPriorityClass(task.priority)}>
                  {task.priority}
                </Badge>
              {/if}
              {#if task.due_date}
                <span class="text-muted-foreground">{formatDate(task.due_date)}</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>
      
      {#if clientTasks.length > 3}
        <div class="mt-4 text-center">
          <Button variant="outline" href="/tasks?client_id={clientId}">
            View All Tasks ({clientTasks.length})
          </Button>
        </div>
      {/if}
    {/if}
  </Card.Content>
</Card.Root> 