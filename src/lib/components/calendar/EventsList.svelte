<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import Eye from "@lucide/svelte/icons/eye";
  import Edit from "@lucide/svelte/icons/edit";
  import Trash from "@lucide/svelte/icons/trash";
  import { calendarStore } from "$lib/store/calendar.svelte";
  import type { CalendarEvent, CalendarEventType } from "$lib/types";

  export let events: CalendarEvent[] = [];
  export let title = "Events";

  let searchTerm = "";
  let filterType: CalendarEventType | "all" = "all";

  // Filter events based on search and type
  $: filteredEvents = events.filter(event => {
    const matchesSearch = !searchTerm || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "all" || event.type === filterType;
    
    return matchesSearch && matchesType;
  });

  function handleEventView(event: CalendarEvent) {
    calendarStore.viewEvent(event);
  }

  function handleEventEdit(event: CalendarEvent) {
    calendarStore.editEvent(event);
  }

  function handleEventDelete(event: CalendarEvent) {
    calendarStore.deleteEvent(event);
  }

  function handleCreateEvent() {
    // Get current date and time for pre-filling the event form
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    calendarStore.createEvent(currentDate, currentTime);
  }

  function getEventTypeColor(type: string): string {
    const colors = {
      meeting: "bg-blue-500",
      call: "bg-green-500", 
      "follow-up": "bg-yellow-500",
      deadline: "bg-red-500",
      personal: "bg-purple-500",
      other: "bg-gray-500"
    };
    return colors[type as keyof typeof colors] || colors.other;
  }

  function formatEventDateTime(startDate: string, endDate: string, allDay: boolean): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (allDay) {
      return start.toLocaleDateString([], { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = start.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    
    return `${date} ${startTime} - ${endTime}`;
  }

  function getStatusColor(status: string): string {
    const colors = {
      scheduled: "text-blue-600",
      completed: "text-green-600",
      cancelled: "text-red-600",
      rescheduled: "text-yellow-600"
    };
    return colors[status as keyof typeof colors] || "text-gray-600";
  }
</script>

<div class="events-list">
  <!-- Header -->
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold">{title}</h3>
    <Button size="sm" onclick={handleCreateEvent}>
      Add Event
    </Button>
  </div>

  <!-- Filters -->
  <div class="space-y-3 mb-4">
    <!-- Search -->
    <Input
      bind:value={searchTerm}
      placeholder="Search events..."
      class="w-full"
    />
    
    <!-- Type Filter -->
    <select
      bind:value={filterType}
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <option value="all">All Types</option>
      <option value="meeting">Meeting</option>
      <option value="call">Call</option>
      <option value="follow-up">Follow-up</option>
      <option value="deadline">Deadline</option>
      <option value="personal">Personal</option>
      <option value="other">Other</option>
    </select>
  </div>

  <!-- Events List -->
  <div class="space-y-2 max-h-96 overflow-y-auto">
    {#if filteredEvents.length === 0}
      <div class="text-center py-8 text-gray-500">
        {searchTerm || filterType !== "all" ? "No events match your filters" : "No events found"}
      </div>
    {:else}
      {#each filteredEvents as event}
        <div class="w-full p-3 rounded-lg border hover:bg-gray-50 transition-colors">
          <div class="flex items-start space-x-3">
            <!-- Event Type Indicator -->
            <div class="w-3 h-3 rounded-full {getEventTypeColor(event.type)} mt-1 flex-shrink-0"></div>
            
            <!-- Event Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h4 class="font-medium truncate">{event.title}</h4>
                <span class="text-xs {getStatusColor(event.status)} capitalize">
                  {event.status}
                </span>
              </div>
              
              <p class="text-sm text-gray-600 mt-1">
                {formatEventDateTime(event.start_date, event.end_date, event.all_day)}
              </p>
              
              {#if event.location}
                <p class="text-sm text-gray-500 mt-1 truncate">
                  📍 {event.location}
                </p>
              {/if}
              
              {#if event.description}
                <p class="text-sm text-gray-500 mt-1 line-clamp-2">
                  {event.description}
                </p>
              {/if}
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-1 flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onclick={() => handleEventView(event)}
                title="View event"
                class="h-8 w-8 p-0"
              >
                <Eye class="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onclick={() => handleEventEdit(event)}
                title="Edit event"
                class="h-8 w-8 p-0"
              >
                <Edit class="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onclick={() => handleEventDelete(event)}
                title="Delete event"
                class="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Summary -->
  {#if events.length > 0}
    <div class="mt-4 pt-4 border-t text-sm text-gray-500">
      Showing {filteredEvents.length} of {events.length} events
    </div>
  {/if}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style> 