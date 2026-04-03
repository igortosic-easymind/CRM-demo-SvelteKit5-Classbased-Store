<script lang="ts">
  import TaskSearchBar from "./task-search-bar.svelte";
  import TaskFilters from "./task-filters.svelte";
  import TaskTable from "./task-table.svelte";
  import TaskRefreshButton from "./task-refresh-button.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import Plus from "@lucide/svelte/icons/plus";
  import { goto } from "$app/navigation";

  import { taskStore } from "$lib/store/tasks.svelte";
  
  // Use store values directly with $ prefix and $derived for reactivity
  const paginationData = $derived(taskStore.pagination);
  const currentFilters = $derived(taskStore.filters);
  const isLoading = $derived(taskStore.loading);
  
  // Compute number of tasks found
  const tasksFound = $derived(
    `${paginationData.totalItems} ${paginationData.totalItems === 1 ? 'task' : 'tasks'} found`
  );

  // Function to handle pagination click
  function handlePageChange(pageNum: number) {
    if (pageNum === paginationData.currentPage) return; // Skip if it's the current page
    
    // Build URL with current filters
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(pageNum));
    
    // Update loading state before navigation
    taskStore.setTasksLoading(true);
    
    // Use goto for client-side navigation
    goto(url.toString(), { replaceState: false });
    taskStore.setTasksLoading(false); // Reset loading state after navigation
  }
</script>

<div class="space-y-4">
  <!-- Header section with title and add button -->
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Tasks</h1>
    <div class="flex items-center gap-2">
      <TaskRefreshButton />
      <Button href="/tasks/new">
        <Plus class="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </div>
  </div>
  
  <!-- Search and filters row -->
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
    <div class="w-full sm:max-w-md">
      <TaskSearchBar />
    </div>
    <div class="w-full sm:w-auto">
      <TaskFilters activeFilter={currentFilters.status || "all"} />
    </div>
  </div>
  
  <!-- Results count -->
  <div class="text-sm text-muted-foreground">
    {tasksFound}
  </div>
  
  <!-- Task table - now using the filtered tasks from store -->
  <TaskTable />
  
  <!-- Pagination -->
  {#if paginationData.totalPages > 1}
    <div class="flex justify-center gap-2 pt-4">
      {#each Array(paginationData.totalPages) as _, i (`page-${i}`)}
        {@const pageNum = i + 1}
        {@const isCurrent = pageNum === paginationData.currentPage}
        
        <Button 
          variant={isCurrent ? "default" : "outline"}
          onclick={() => handlePageChange(pageNum)}
          disabled={isCurrent && isLoading}
          class="h-8 w-8 p-0"
        >
          {pageNum}
        </Button>
      {/each}
    </div>
  {/if}
</div>