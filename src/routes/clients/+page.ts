import type { PageLoad } from "./$types";
import { clientStore } from "$lib/store/clients.svelte";
import { browser } from "$app/environment";

export const load: PageLoad = async ({ data, depends }) => {
  // Register a dependency to ensure the data is re-fetched when navigating
  depends("app:clients");

  // If we're in the browser, update the store with the data from the server
  if (browser) {
    clientStore.setClientsData({
      clients: data.clients,
      pagination: data.pagination,
      filters: data.filters,
    });

    // Reset loading state when new data is loaded
    clientStore.setLoading(false);
  }

  // Return the data as-is for the page component
  return data;
};
