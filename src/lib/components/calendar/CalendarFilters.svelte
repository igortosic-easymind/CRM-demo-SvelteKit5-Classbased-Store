<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import Search from "@lucide/svelte/icons/search";
  import Filter from "@lucide/svelte/icons/filter";
  import X from "@lucide/svelte/icons/x";
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import CheckSquare from "@lucide/svelte/icons/check-square";
  import type { Client, CalendarEventType, CalendarEventStatus } from "$lib/types";
  import { clientStore } from "$lib/store/clients.svelte";
  import { calendarStore } from "$lib/store/calendar.svelte";

  interface Props {
    hideSearchOnMobile?: boolean;
  }

  let { hideSearchOnMobile = false }: Props = $props();

  const clients = $derived(clientStore.clients);
  const filterState = $derived(calendarStore.calendarFilters);

  let showFilters = $state(false);

  const eventTypes: { value: CalendarEventType; label: string }[] = [
    { value: "meeting", label: "Meeting" },
    { value: "call", label: "Call" },
    { value: "follow-up", label: "Follow-up" },
    { value: "deadline", label: "Deadline" },
    { value: "personal", label: "Personal" },
    { value: "other", label: "Other" }
  ];

  const statusOptions: { value: CalendarEventStatus; label: string }[] = [
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "rescheduled", label: "Rescheduled" }
  ];

  function handleReset() {
    calendarStore.resetCalendarFilters();
  }

  function toggleFilters() {
    showFilters = !showFilters;
  }

  function handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    calendarStore.updateCalendarFilters({
      ...filterState,
      search: target.value,
    });
  }

  // Calculate active filter count
  const activeFilters = $derived.by(() => {
    return [
      filterState.search,
      filterState.type,
      filterState.status,
      filterState.client_id,
      filterState.start_date,
      filterState.end_date,
      !filterState.include_tasks ? "exclude_tasks" : null,
      !filterState.include_events ? "exclude_events" : null,
    ].filter(Boolean).length;
  });

  function handleTypeChange(value: string | undefined) {
    calendarStore.updateCalendarFilters({
      ...filterState,
      type: (value as CalendarEventType) || null,
    });
  }

  function handleStatusChange(value: string | undefined) {
    calendarStore.updateCalendarFilters({
      ...filterState,
      status: (value as CalendarEventStatus) || null,
    });
  }

  function handleClientChange(value: string | undefined) {
    calendarStore.updateCalendarFilters({
      ...filterState,
      client_id: value ? Number(value) : null,
    });
  }

  function handleEventsToggle(checked: boolean) {
    calendarStore.updateCalendarFilters({
      ...filterState,
      include_events: checked,
    });
  }

  function handleTasksToggle(checked: boolean) {
    calendarStore.updateCalendarFilters({
      ...filterState,
      include_tasks: checked,
    });
  }

  function handleDateChange() {
    calendarStore.updateCalendarFilters(filterState);
  }

  function handleCompletedToggle(checked: boolean) {
    calendarStore.updateCalendarFilters({
      ...filterState,
      status: checked ? "completed" : null,
    });
  }

  function handleRescheduledToggle(checked: boolean) {
    calendarStore.updateCalendarFilters({
      ...filterState,
      status: checked ? "rescheduled" : null,
    });
  }

  // Helper function to get client display name
  function getClientDisplayName(client: Client): string {
    return client.company_name || "Unknown Client";
  }
</script>

<div class="calendar-filters">
  <!-- Filter Header -->
  <div class="mb-4">
    <!-- Search input - conditionally hidden on mobile -->
    {#if !hideSearchOnMobile}
      <div class="mb-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search events and tasks..."
            value={filterState.search}
            oninput={handleSearchChange}
            class="pl-10"
          />
        </div>
      </div>
    {/if}

    <!-- Toggles and Filter Button: Responsive layout -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mt-2">
      <!-- Toggles row -->
      <div class="flex items-center gap-6 w-full sm:w-auto">
        <div class="flex items-center space-x-3">
          <Switch
            id="include-events"
            checked={filterState.include_events}
            onCheckedChange={handleEventsToggle}
          />
          <Label for="include-events" class="flex items-center gap-2 text-sm font-medium">
            <CalendarIcon class="h-4 w-4" />
            Events
          </Label>
        </div>
        <div class="flex items-center space-x-3">
          <Switch
            id="include-tasks"
            checked={filterState.include_tasks}
            onCheckedChange={handleTasksToggle}
          />
          <Label for="include-tasks" class="flex items-center gap-2 text-sm font-medium">
            <CheckSquare class="h-4 w-4" />
            Tasks
          </Label>
        </div>
      </div>
      <!-- Filter Button row -->
      <div class="w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          onclick={toggleFilters}
          class="relative w-full sm:w-auto"
        >
          <Filter class="h-4 w-4 mr-2" />
          Filters
          {#if activeFilters > 0}
            <Badge variant="secondary" class="ml-2">
              {activeFilters}
            </Badge>
          {/if}
        </Button>
      </div>
    </div>
  </div>

  <!-- Advanced Filters Panel -->
  {#if showFilters}
    <Card class="mb-4">
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <CardTitle class="text-sm font-medium">Advanced Filters</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onclick={handleReset}
            class="h-auto p-1 text-gray-500 hover:text-gray-700"
          >
            <X class="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Type Filter -->
          <div class="space-y-2">
            <Label for="type-select">Type</Label>
            <select
              id="type-select"
              value={filterState.type || ""}
              onchange={(e) => handleTypeChange((e.target as HTMLSelectElement)?.value || undefined)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All types</option>
              {#each eventTypes as eventType (eventType.value)}
                <option value={eventType.value}>{eventType.label}</option>
              {/each}
            </select>
          </div>

          <!-- Status Filter -->
          <div class="space-y-2">
            <Label for="status-select">Status</Label>
            <select
              id="status-select"
              value={filterState.status || ""}
              onchange={(e) => handleStatusChange((e.target as HTMLSelectElement)?.value || undefined)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All statuses</option>
              {#each statusOptions as statusOption (statusOption.value)}
                <option value={statusOption.value}>{statusOption.label}</option>
              {/each}
            </select>
          </div>

          <!-- Date Range -->
          <div class="space-y-2">
            <Label for="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={filterState.start_date || ""}
              onchange={handleDateChange}
            />
          </div>

          <div class="space-y-2">
            <Label for="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={filterState.end_date || ""}
              onchange={handleDateChange}
            />
          </div>
        </div>

        <!-- Client Filter -->
        <div class="space-y-2">
          <Label for="client-select">Client</Label>
          <select
            id="client-select"
            value={filterState.client_id || ""}
            onchange={(e) => handleClientChange((e.target as HTMLSelectElement)?.value || undefined)}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All clients</option>
            {#each clients as client (client.id)}
              <option value={client.id}>
                {getClientDisplayName(client)}
              </option>
            {/each}
          </select>
        </div>

        <!-- Quick Filter Actions -->
        <div class="flex items-center justify-between pt-4 border-t">
          <div class="flex items-center gap-4">
            <div class="flex items-center space-x-2">
              <Checkbox
                id="show-completed"
                checked={filterState.status === "completed"}
                onCheckedChange={handleCompletedToggle}
              />
              <Label for="show-completed" class="text-sm">Only completed</Label>
            </div>
            
            <div class="flex items-center space-x-2">
              <Checkbox
                id="show-rescheduled"
                checked={filterState.status === "rescheduled"}
                onCheckedChange={handleRescheduledToggle}
              />
              <Label for="show-rescheduled" class="text-sm">Show rescheduled</Label>
            </div>
          </div>
          
          <Button size="sm" onclick={() => showFilters = false}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  {/if}
</div>

<style>
  .calendar-filters {
    @apply w-full;
  }
</style> 