<script lang="ts">
  import  { taskStore } from "$lib/store/tasks.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { goto } from "$app/navigation";
  import type { TaskStatus } from "$lib/types";
  
  const { activeFilter = "all" } = $props<{ activeFilter?: TaskStatus | "all" }>();
  
  // Access store directly with $derived
  const isLoading = $derived(taskStore.loading);
  const storeFilters = $derived(taskStore.filters);
  
  const filterOptions: { value: TaskStatus | "all"; label: string; color: string }[] = [
    { value: "all", label: "All Tasks", color: "bg-gray-100" },
    { value: "todo", label: "To Do", color: "bg-gray-100 text-gray-700" },
    { value: "in-progress", label: "In Progress", color: "bg-blue-100 text-blue-700" },
    { value: "completed", label: "Completed", color: "bg-green-100 text-green-700" }
  ];
  
  function handleFilterChange(filter: TaskStatus | "all") {
    // Update store to reflect the new filter
    if (filter === "all") {
      taskStore.updateTasksFilters({ status: null });
    } else {
      taskStore.updateTasksFilters({ status: filter });
    }
    
    // Build URL with new filter
    const url = new URL(window.location.href);
    if (filter === "all") {
      url.searchParams.delete("status");
    } else {
      url.searchParams.set("status", filter);
    }
    url.searchParams.delete("page"); // Reset to first page when filtering
    
    // Use goto to trigger server-side navigation and reload
    goto(url.toString());
  }
</script>

<div class="flex flex-wrap gap-2 w-full">
  {#each filterOptions as filter}
    <Button 
      variant={activeFilter === filter.value ? "default" : "outline"}
      size="sm"
      disabled={isLoading}
      onclick={() => handleFilterChange(filter.value)}
      class="flex-1 min-w-[120px] sm:min-w-0"
    >
      {#if filter.value !== "all"}
        <span class={`inline-block h-2 w-2 rounded-full mr-1.5 ${
          filter.value === "completed" ? "bg-green-500" : 
          filter.value === "in-progress" ? "bg-blue-500" : 
          "bg-gray-500"
        }`}></span>
      {/if}
      {filter.label}
    </Button>
  {/each}
</div>