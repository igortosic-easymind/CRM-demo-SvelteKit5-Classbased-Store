<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Search from "@lucide/svelte/icons/search";
  import RefreshCcw from "@lucide/svelte/icons/refresh-ccw";
  import { clientStore } from "$lib/store/clients.svelte";
  import { goto } from "$app/navigation";
  
  // Track search query in local state, initialize from store
  let searchQuery = $state(clientStore.filters.search || "");
  let searchTimeout: ReturnType<typeof setTimeout>;
  
  // Handle search as user types with debounce
  function handleSearchInput() {
    // Update the store directly for immediate UI feedback
    clientStore.updateFilters({ search: searchQuery });
    
    // Clear existing timeout
    clearTimeout(searchTimeout);
    
    // Debounce the actual navigation
    searchTimeout = setTimeout(() => {
      performSearch();
    }, 500); // 500ms debounce
  }
  
  function performSearch() {
    clientStore.setLoading(true);
    
    // Build URL with search term
    const url = new URL(window.location.href);
    if (searchQuery) {
      url.searchParams.set("search", searchQuery);
    } else {
      url.searchParams.delete("search");
    }
    url.searchParams.delete("page"); // Reset to first page when searching
    
    // Use goto to trigger server-side navigation
    goto(url.toString(), { replaceState: false });
  }
  
  // Reset search
  function handleReset() {
    searchQuery = "";
    clientStore.updateFilters({ search: "" });
    clearTimeout(searchTimeout);
    
    clientStore.setLoading(true);
    
    const url = new URL(window.location.href);
    url.searchParams.delete("search");
    url.searchParams.delete("page");
    
    goto(url.toString(), { replaceState: false });
  }
</script>

<div class="flex gap-2">
  <div class="relative flex-grow">
    <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      type="text"
      placeholder="Search clients..."
      class="pl-8"
      bind:value={searchQuery}
      oninput={handleSearchInput}
    />
  </div>
  {#if searchQuery}
    <Button variant="outline" size="icon" onclick={handleReset}>
      <RefreshCcw class="h-4 w-4" />
      <span class="sr-only">Reset</span>
    </Button>
  {/if}
</div>