// src/routes/calendar/+page.ts
import type { PageLoad } from "./$types";
import { calendarStore } from "$lib/store/calendar.svelte";
import { taskStore } from "$lib/store/tasks.svelte";
import { clientStore } from "$lib/store/clients.svelte";
import { browser } from "$app/environment";
import type { TaskStatus } from "$lib/types";

export const load: PageLoad = async ({ data, depends }) => {
  // Register a dependency to ensure the data is re-fetched when navigating
  depends("app:calendar");
  depends("calendar:events");

  // If we're in the browser, update the store with the data from the server
  if (browser) {
    calendarStore.setCalendarEventsData({
      events: data.events,
      pagination: data.pagination,
      filters: data.filters,
    });

    // Set the view state from URL parameters
    if (data.viewState) {
      calendarStore.setCalendarViewAndDate(data.viewState.view, data.viewState.date);
    }
    if (data.allTasks) {
      taskStore.setTasksData({
        tasks: data.allTasks,
        pagination: data.pagination,
        filters: {
          search: data.filters.search,
          status: data.filters.status as TaskStatus,
          client_id: data.filters.client_id,
        },
      });
    }
    if (data.clients) {
      clientStore.setClientsData({
        clients: data.clients,
        pagination: data.pagination,
        filters: data.filters,
      });
    }
  }

  // Return the data as-is for the page component
  return data;
};
