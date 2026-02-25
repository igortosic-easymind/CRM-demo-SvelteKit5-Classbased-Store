<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Search from "@lucide/svelte/icons/search";
  import RefreshCcw from "@lucide/svelte/icons/refresh-ccw";
  import { taskStore } from "$lib/store/tasks.svelte";
  import { goto } from "$app/navigation";
  
  // Track search query in local state, initialize from store
  let searchQuery = $state(taskStore.filters.search || "");
  
  // Handle search as user types
  function handleSearchInput() {
    // Update the store directly
    taskStore.updateTasksFilters({ search: searchQuery });
    
    // Update URL without page reload for shareable URLs
    const url = new URL(window.location.href);
    if (searchQuery) {
      url.searchParams.set("search", searchQuery);
    } else {
      url.searchParams.delete("search");
    }
    url.searchParams.delete("page"); // Reset to first page when searching
    goto(url.toString());
  }
  
  // Reset search
  function handleReset() {
    searchQuery = "";
    taskStore.updateTasksFilters({ search: "" });
    
    const url = new URL(window.location.href);
    url.searchParams.delete("search");
    url.searchParams.delete("page");
    goto(url.toString());
  }
</script>

<div class="flex gap-2 w-full">
  <div class="relative flex-grow">
    <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      type="text"
      placeholder="Search tasks..."
      class="pl-8 w-full"
      bind:value={searchQuery}
      oninput={handleSearchInput}
    />
  </div>
  {#if searchQuery}
    <Button variant="outline" size="icon" onclick={handleReset} class="shrink-0">
      <RefreshCcw class="h-4 w-4" />
      <span class="sr-only">Reset</span>
    </Button>
  {/if}
</div>