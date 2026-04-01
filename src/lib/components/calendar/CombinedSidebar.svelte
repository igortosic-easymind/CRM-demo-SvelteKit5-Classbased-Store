<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import CalendarViewItem from "./CalendarViewItem.svelte";
  import { calendarStore } from "$lib/store/calendar.svelte";
  import { taskStore } from "$lib/store/tasks.svelte";
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import CheckSquare from "@lucide/svelte/icons/check-square";
  import Plus from "@lucide/svelte/icons/plus";
  import type { CalendarViewItem as CalendarViewItemType } from "$lib/types";

  interface Props {
    title?: string;
  }

  let {
    title = "Events & Tasks"
  }: Props = $props();

  // Access data from stores
  let events = $derived(calendarStore.calendarEvents);
  let allTasks = $derived(taskStore.tasks);
  let filterState = $derived(calendarStore.calendarFilters);
  let currentCalendarDate = $derived(calendarStore.currentCalendarDate);
  let calendarView = $derived(calendarStore.calendarView);

  // Convert events to CalendarViewItem format
  const convertedEvents = $derived(events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description || "",
    start_date: event.start_date,
    end_date: event.end_date,
    all_day: event.all_day,
    type: event.type,
    status: event.status,
    client_id: event.client_id || 0,
    task_id: event.task_id || 0,
    location: event.location || "",
    recurrence: event.recurrence,
    recurrence_end: event.recurrence_end || "",
    created_at: event.created_at,
    updated_at: event.updated_at,
    item_type: "event" as const,
    priority: "",
    due_date: "",
    completed_at: ""
  })) as CalendarViewItemType[]);

  // Convert tasks to CalendarViewItem format
  const convertedTasks = $derived(allTasks.map(task => ({
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
    item_type: "task" as const,
    priority: task.priority || "",
    due_date: task.due_date || "",
    completed_at: task.completed_at || ""
  })) as CalendarViewItemType[]);

  // Apply date filtering based on current calendar view and date
  const dateFilteredItems = $derived.by(() => {
    if (!currentCalendarDate) {
      return [...convertedEvents, ...convertedTasks];
    }

    const [year, month, day] = currentCalendarDate.split('-').map(Number);
    
    const filterByDate = (item: CalendarViewItemType) => {
      const itemDate = new Date(item.start_date);
      
      if (calendarView === "month") {
        return itemDate.getMonth() === month - 1 && 
               itemDate.getFullYear() === year;
      } else {
        // Week view
        const selectedDate = new Date(year, month - 1, day);
        const dayOfWeek = selectedDate.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        
        // eslint-disable-next-line svelte/prefer-svelte-reactivity
        const weekStart = new Date(selectedDate);
        weekStart.setDate(weekStart.getDate() + mondayOffset);
        weekStart.setHours(0, 0, 0, 0);
        
        // eslint-disable-next-line svelte/prefer-svelte-reactivity
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        
        return itemDate >= weekStart && itemDate <= weekEnd;
      }
    };

    return [...convertedEvents.filter(filterByDate), ...convertedTasks.filter(filterByDate)];
  });

  // Filter items based on store filters
  const filteredItems = $derived(dateFilteredItems.filter(item => {
    // Check visibility settings from store
    if (item.item_type === "event" && !filterState.include_events) return false;
    if (item.item_type === "task" && !filterState.include_tasks) return false;
    
    // Search filter from store
    if (filterState.search) {
      const searchTerm = filterState.search.toLowerCase();
      const titleMatch = item.title?.toLowerCase().includes(searchTerm);
      const descriptionMatch = item.description?.toLowerCase().includes(searchTerm);
      if (!titleMatch && !descriptionMatch) return false;
    }
    
    // Type filter from store
    if (filterState.type && item.type !== filterState.type) {
      return false;
    }
    
    // Status filter from store
    if (filterState.status && item.status !== filterState.status) {
      return false;
    }
    
    // Client filter from store
    if (filterState.client_id && item.client_id !== filterState.client_id) {
      return false;
    }
    
    return true;
  }));

  // Sort items by date
  const sortedItems = $derived(filteredItems.sort((a, b) => {
    const aDate = a.item_type === "task" && a.due_date ? a.due_date : a.start_date;
    const bDate = b.item_type === "task" && b.due_date ? b.due_date : b.start_date;
    return new Date(aDate).getTime() - new Date(bDate).getTime();
  }));

  // Count items by type
  const eventCount = $derived(filteredItems.filter(item => item.item_type === "event").length);
  const taskCount = $derived(filteredItems.filter(item => item.item_type === "task").length);

  function handleCreateEvent() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    calendarStore.createEvent(currentDate, currentTime);
  }
</script>

<div class="combined-sidebar">
  <!-- Header -->
  <div class="flex items-center justify-between mb-4">
    <div>
      <h3 class="text-lg font-semibold">{title}</h3>
      <div class="flex items-center gap-2 mt-1">
        {#if filterState.include_events}
          <Badge variant="outline" class="text-xs">
            <CalendarIcon class="h-3 w-3 mr-1" />
            {eventCount} Events
          </Badge>
        {/if}
        {#if filterState.include_tasks}
          <Badge variant="outline" class="text-xs">
            <CheckSquare class="h-3 w-3 mr-1" />
            {taskCount} Tasks
          </Badge>
        {/if}
      </div>
    </div>
    <Button size="sm" onclick={handleCreateEvent}>
      <Plus class="h-4 w-4 mr-1" />
      Add Event
    </Button>
  </div>

  <!-- Items List -->
  <div class="space-y-2 max-h-96 overflow-y-auto">
    {#if sortedItems.length === 0}
      <div class="text-center py-8 text-gray-500">
        No items found
      </div>
    {:else}
      {#each sortedItems as item (item.id)}
        <CalendarViewItem 
          item={item}
          compact={true}
        />
      {/each}
    {/if}
  </div>
</div>

<style lang="postcss">
  .combined-sidebar {
    @apply w-full h-full;
  }
</style> 