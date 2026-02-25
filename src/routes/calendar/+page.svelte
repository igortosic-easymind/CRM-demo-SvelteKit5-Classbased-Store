<script lang="ts">
  import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";

  import CalendarViewToggle from "$lib/components/calendar/CalendarViewToggle.svelte";
  import CalendarMonthView from "$lib/components/calendar/CalendarMonthView.svelte";
  import CalendarWeekView from "$lib/components/calendar/CalendarWeekView.svelte";
  import CalendarFilters from "$lib/components/calendar/CalendarFilters.svelte";
  import CalendarViewItem from "$lib/components/calendar/CalendarViewItem.svelte";
  import CombinedSidebar from "$lib/components/calendar/CombinedSidebar.svelte";
  import EventModal from "$lib/components/calendar/EventModal.svelte";
  import DeleteEventModal from "$lib/components/calendar/DeleteEventModal.svelte";
  import type { CalendarEvent, CalendarViewItem as CalendarViewItemType, Task } from "$lib/types";
  import { calendarStore } from "$lib/store/calendar.svelte";
  import { taskStore } from "$lib/store/tasks.svelte";
  import { clientStore } from "$lib/store/clients.svelte";

  // Initialize view and date from URL parameters or defaults
  let selectedDate = $state<CalendarDate>(today(getLocalTimeZone()));
  let initialized = $state(false);
  let showCombinedView = $state(false); // Toggle between classic calendar view and combined list view
  
  // Filter state
  let filterState = $derived(calendarStore.calendarFilters);

  // Initialize from URL parameters on mount
  onMount(() => {
    const urlView = page.url.searchParams.get("view") as "month" | "week" | null;
    const urlDate = page.url.searchParams.get("date");
    
    // Set view from URL or default to month
    const view = urlView || "month";
    calendarStore.setCalendarView(view);
    
    // Set date from URL or default to today
    if (urlDate) {
      try {
        const [year, month, day] = urlDate.split('-').map(Number);
        selectedDate = new CalendarDate(year, month, day);
        calendarStore.setCurrentCalendarDate(urlDate);
      } catch {
        selectedDate = today(getLocalTimeZone());
        calendarStore.setCurrentCalendarDate(formatDateForURL(selectedDate));
      }
    } else {
      selectedDate = today(getLocalTimeZone());
      calendarStore.setCurrentCalendarDate(formatDateForURL(selectedDate));
    }
    
    initialized = true;
  });

  // Data from stores (reactive to server updates)
  let events = $derived(calendarStore.calendarEvents);
  let allTasks = $derived(taskStore.tasks);
  let calendarItems = $derived(calendarStore.calendarEvents || []);
  let clients = $derived(clientStore.clients || []);

  // Convert tasks to CalendarViewItem format for unified display
  let convertedTasks = $derived(allTasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || "",
    start_date: task.due_date || task.created_at, // Use due_date as start_date for tasks
    end_date: task.due_date || task.created_at,
    all_day: false,
    type: task.type || "other",
    status: task.status,
    client_id: task.client_id || 0,
    task_id: task.id,
    location: "",
    recurrence: "none",
    recurrence_end: "",
    created_at: task.created_at,
    updated_at: task.updated_at,
    item_type: "task",
    priority: task.priority || "",
    due_date: task.due_date || "",
    completed_at: task.completed_at || ""
  })) as CalendarViewItemType[]);

  // Combine all items for display
  let allCalendarItems = $derived([...calendarItems, ...convertedTasks]);

  function formatDateForURL(date: CalendarDate): string {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }

  function updateURL(view?: "month" | "week", date?: CalendarDate, filters?: any) {
    if (!initialized) return; // Don't update URL during initialization
    
    const url = new URL(page.url);
    
    if (view) {
      url.searchParams.set("view", view);
    }
    
    if (date) {
      url.searchParams.set("date", formatDateForURL(date));
    }

    // Update filter parameters
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== null && value !== undefined && value !== "") {
          url.searchParams.set(key, value.toString());
        } else {
          url.searchParams.delete(key);
        }
      });
    }
    
    goto(url.toString(), { replaceState: true, invalidateAll: true });
  }

  function handleDateSelect(detail: { date: any; events: CalendarEvent[] }) {
    selectedDate = detail.date;
    calendarStore.setCurrentCalendarDate(formatDateForURL(selectedDate));
    updateURL(undefined, selectedDate);
  }

  function handleWeekChange(date: any) {
    selectedDate = date;
    calendarStore.setCurrentCalendarDate(formatDateForURL(selectedDate));
    updateURL(undefined, selectedDate);
  }

  function handleViewChange(newView: "month" | "week") {
    calendarStore.setCalendarView(newView);
    updateURL(newView, selectedDate);
  }

  function handleFilterChange(detail: any) {
    filterState = { ...detail };
    updateURL(undefined, undefined, filterState);
  }

  function handleFilterReset() {
    filterState = {
      search: "",
      type: null,
      status: null,
      client_id: null,
      start_date: null,
      end_date: null,
      include_tasks: true,
      include_events: true,
    };
    updateURL(undefined, undefined, filterState);
  }

  // Helper function to apply client-side filtering (for traditional calendar view)
  function applyClientSideFilters(items: any[]): any[] {
    return items.filter(item => {
      // Check visibility settings
      if (item.item_type === "event" && !filterState.include_events) return false;
      if (item.item_type === "task" && !filterState.include_tasks) return false;
      
      // Search filter
      if (filterState.search) {
        const searchTerm = filterState.search.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(searchTerm);
        const descriptionMatch = item.description?.toLowerCase().includes(searchTerm);
        if (!titleMatch && !descriptionMatch) return false;
      }
      
      // Type filter
      if (filterState.type && item.type !== filterState.type) {
        return false;
      }
      
      // Status filter
      if (filterState.status && item.status !== filterState.status) {
        return false;
      }
      
      // Client filter
      if (filterState.client_id && item.client_id !== filterState.client_id) {
        return false;
      }
      
      return true;
    });
  }

  // Filter events for current view - only if initialized
  let filteredEvents = $derived(initialized && selectedDate ? (() => {
    // First apply date filtering
    const dateFilteredEvents = events.filter(event => {
      if (calendarStore.calendarView === "month") {
        // Show events for the current month
        const eventDate = new Date(event.start_date);
        return eventDate.getMonth() === selectedDate.month - 1 && 
               eventDate.getFullYear() === selectedDate.year;
      } else {
        // Show events for the current week
        const eventDate = new Date(event.start_date);
        const weekStart = selectedDate.toDate(getLocalTimeZone());
        const dayOfWeek = weekStart.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        weekStart.setDate(weekStart.getDate() + mondayOffset);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return eventDate >= weekStart && eventDate <= weekEnd;
      }
    });
    
    // Then apply user filters
    return applyClientSideFilters(dateFilteredEvents);
  })() : []);

  // Filter calendar items for combined view
  let filteredCalendarItems = $derived(applyClientSideFilters(allCalendarItems));

  // Filter tasks for traditional calendar view (date-based)
  let filteredTasksForCalendar = $derived(initialized && selectedDate ? (() => {
    // Apply date filtering to tasks
    const dateFilteredTasks = allTasks.filter(task => {
      const taskDate = new Date(task.due_date || task.created_at);
      
      if (calendarStore.calendarView === "month") {
        return taskDate.getMonth() === selectedDate.month - 1 && 
               taskDate.getFullYear() === selectedDate.year;
      } else {
        const weekStart = selectedDate.toDate(getLocalTimeZone());
        const dayOfWeek = weekStart.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        weekStart.setDate(weekStart.getDate() + mondayOffset);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return taskDate >= weekStart && taskDate <= weekEnd;
      }
    });
    
    // Apply user filters
    return applyClientSideFilters(dateFilteredTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || "",
      start_date: task.due_date || task.created_at,
      end_date: task.due_date || task.created_at,
      all_day: false,
      type: task.type || "other",
      status: task.status,
      client_id: task.client_id || 0,
      task_id: task.id,
      location: "",
      recurrence: "none",
      recurrence_end: "",
      created_at: task.created_at,
      updated_at: task.updated_at,
      item_type: "task",
      priority: task.priority || "",
      due_date: task.due_date || "",
      completed_at: task.completed_at || ""
    })));
  })() : []);

</script>

{#if initialized}
<div class="w-full max-w-full sm:container sm:mx-auto p-0 sm:p-6">
  <div class="space-y-4 sm:space-y-0">
    <!-- 1. Desktop: Title left, controls right -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">Calendar</h1>
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <button
          onclick={() => showCombinedView = !showCombinedView}
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium cursor-pointer rounded-md border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0"
        >
          {showCombinedView ? "Calendar View" : "Combined View"}
        </button>
        <div class="w-full sm:w-auto">
          <CalendarViewToggle onviewChange={(view) => handleViewChange(view)} />
        </div>
      </div>
    </div>

    <!-- 2. Desktop: Toggles and Filters right -->
    <div class="w-full sm:flex sm:justify-end">
      <div class="sm:w-auto">
        <CalendarFilters
          hideSearchOnMobile={true}
        />
      </div>
    </div>
  </div>

  {#if showCombinedView}
    <!-- Combined List View -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Events & Tasks</h2>
      <div class="space-y-3">
        {#each filteredCalendarItems as item}
          <CalendarViewItem 
            {item}
          />
        {/each}
        {#if filteredCalendarItems.length === 0}
          <div class="text-center py-8 text-gray-500">
            <p>No events or tasks found matching your filters.</p>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <!-- Traditional Calendar View -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Calendar View -->
      <div class="lg:col-span-2">
        {#if calendarStore.calendarView === "month"}
          <CalendarMonthView 
            events={filteredEvents}
            bind:selectedDate
            onDateSelect={handleDateSelect}
          />
        {:else}
          <CalendarWeekView 
            events={filteredEvents}
            bind:selectedDate
            onweekChange={handleWeekChange}
          />
        {/if}
      </div>

      <!-- Events List Sidebar -->
      <div class="lg:col-span-1">
        <CombinedSidebar 
          title={calendarStore.calendarView === "month" ? "This Month" : "This Week"}
        />
      </div>
    </div>
  {/if}

  <!-- Event Modal -->
  <EventModal />

  <!-- Delete Event Modal -->
  <DeleteEventModal/>
</div>
{/if}