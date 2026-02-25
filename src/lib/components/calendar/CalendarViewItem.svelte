<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { goto } from "$app/navigation";
  import Eye from "@lucide/svelte/icons/eye";
  import Edit from "@lucide/svelte/icons/edit";
  import Trash from "@lucide/svelte/icons/trash";
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import CheckSquare from "@lucide/svelte/icons/check-square";
  import Clock from "@lucide/svelte/icons/clock";
  import MapPin from "@lucide/svelte/icons/map-pin";
  import User from "@lucide/svelte/icons/user";
  import AlertCircle from "@lucide/svelte/icons/alert-circle";
  import type { CalendarViewItem, CalendarEvent } from "$lib/types";
  import { calendarStore } from "$lib/store/calendar.svelte";

  interface Props {
    item: CalendarViewItem | CalendarEvent;
    compact?: boolean;
  }

  let { item, compact = false }: Props = $props();

  function isCalendarEvent(obj: any): obj is CalendarEvent {
    return 'recurrence' in obj && 'all_day' in obj;
  }

  function handleView() {
    if (item.item_type === 'event') {
      // Convert CalendarViewItem to CalendarEvent if needed
      const event = isCalendarEvent(item) ? item : {
        ...item,
        owner_id: 1,
      } as CalendarEvent;
      calendarStore.viewEvent(event);
    } else if (item.item_type === 'task') {
      // Navigate to task view page
      goto(`/tasks/${item.id}`);
    }
  }

  function handleEdit() {
    if (item.item_type === 'event') {
      // Convert CalendarViewItem to CalendarEvent if needed
      const event = isCalendarEvent(item) ? item : {
        ...item,
        owner_id: 1,
      } as CalendarEvent;
      calendarStore.editEvent(event);
    } else if (item.item_type === 'task') {
      // Navigate to task edit page
      goto(`/tasks/${item.id}/edit`);
    }
  }

  function handleDelete() {
    if (item.item_type === 'event') {
      // Convert CalendarViewItem to CalendarEvent if needed
      const event = isCalendarEvent(item) ? item : {
        ...item,
        owner_id: 1,
      } as CalendarEvent;
      calendarStore.openDeleteModal(event);
    }
    // Tasks don't have delete from calendar view
  }

  function getItemTypeColor(itemType: string): string {
    return itemType === 'task' 
      ? "bg-green-500" 
      : "bg-blue-500";
  }

  function getItemTypeBorder(itemType: string): string {
    return itemType === 'task' 
      ? "border-l-green-500" 
      : "border-l-blue-500";
  }

  function getTypeColor(type: string, itemType: string): string {
    if (itemType === 'task') {
      const taskColors = {
        'follow-up': "bg-yellow-500",
        'meeting': "bg-blue-500",
        'call': "bg-green-500",
        'email': "bg-purple-500",
        'other': "bg-gray-500"
      };
      return taskColors[type as keyof typeof taskColors] || taskColors.other;
    } else {
      const eventColors = {
        meeting: "bg-blue-500",
        call: "bg-green-500", 
        "follow-up": "bg-yellow-500",
        deadline: "bg-red-500",
        personal: "bg-purple-500",
        other: "bg-gray-500"
      };
      return eventColors[type as keyof typeof eventColors] || eventColors.other;
    }
  }

  function getStatusColor(status: string, itemType: string): string {
    if (itemType === 'task') {
      const taskStatusColors = {
        todo: "text-gray-600",
        "in-progress": "text-blue-600",
        completed: "text-green-600"
      };
      return taskStatusColors[status as keyof typeof taskStatusColors] || "text-gray-600";
    } else {
      const eventStatusColors = {
        scheduled: "text-blue-600",
        completed: "text-green-600",
        cancelled: "text-red-600",
        rescheduled: "text-yellow-600"
      };
      return eventStatusColors[status as keyof typeof eventStatusColors] || "text-gray-600";
    }
  }

  function formatDateTime(dateTime: string, allDay: boolean): string {
    if (allDay) return "All day";
    
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleDateString();
  }

  // For tasks, show due date instead of start/end date
  const displayDate = $derived(item.item_type === 'task' && item.due_date 
    ? item.due_date 
    : item.start_date);

  const isOverdue = $derived(item.item_type === 'task' && item.due_date && item.status !== 'completed' && new Date(item.due_date) < new Date());
</script>

<div class="calendar-view-item w-full p-3 rounded-lg border-l-4 {getItemTypeBorder(item.item_type)} bg-white hover:bg-gray-50 transition-colors shadow-sm">
  <div class="flex items-start space-x-3">
    <!-- Item Type Icon -->
    <div class="shrink-0 mt-0.5">
      <div class="w-8 h-8 rounded-full {getItemTypeColor(item.item_type)} flex items-center justify-center">
        {#if item.item_type === 'task'}
          <CheckSquare class="h-4 w-4 text-white" />
        {:else}
          <CalendarIcon class="h-4 w-4 text-white" />
        {/if}
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <!-- Header Row -->
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <!-- Title -->
            <h4 class="font-medium text-gray-900 truncate">{item.title}</h4>
            
            <!-- Item Type Badge -->
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
              {item.item_type === 'task' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
              {item.item_type}
            </span>

            <!-- Priority Badge for Tasks -->
            {#if item.item_type === 'task' && item.priority}
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                {item.priority === 'high' ? 'bg-red-100 text-red-800' : 
                 item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                 'bg-green-100 text-green-800'}">
                {item.priority}
              </span>
            {/if}

            <!-- Overdue Badge for Tasks -->
            {#if isOverdue}
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                <AlertCircle class="h-3 w-3 mr-1" />
                Overdue
              </span>
            {/if}
          </div>

          <!-- Description -->
          {#if item.description && !compact}
            <p class="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
          {/if}

          <!-- Metadata Row -->
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <!-- Date/Time -->
            <div class="flex items-center gap-1">
              <Clock class="h-4 w-4" />
              {#if item.item_type === 'task' && item.due_date}
                <span>Due: {formatDate(item.due_date)}</span>
              {:else}
                <span>{formatDate(displayDate)} {formatDateTime(displayDate, item.all_day)}</span>
              {/if}
            </div>

            <!-- Location -->
            {#if item.location}
              <div class="flex items-center gap-1">
                <MapPin class="h-4 w-4" />
                <span class="truncate">{item.location}</span>
              </div>
            {/if}

            <!-- Client -->
            {#if item.client_id}
              <div class="flex items-center gap-1">
                <User class="h-4 w-4" />
                <span>Client {item.client_id}</span>
              </div>
            {/if}

            <!-- Status -->
            <span class="capitalize {getStatusColor(item.status, item.item_type)}">
              {item.status.replace('-', ' ')}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-1 shrink-0 ml-2">
          <Button
            size="sm"
            variant="ghost"
            onclick={handleView}
            title="View {item.item_type}"
            class="h-8 w-8 p-0"
          >
            <Eye class="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onclick={handleEdit}
            title="Edit {item.item_type}"
            class="h-8 w-8 p-0"
          >
            <Edit class="h-4 w-4" />
          </Button>
          {#if item.item_type !== 'task'}
            <Button
              size="sm"
              variant="ghost"
              onclick={handleDelete}
              title="Delete {item.item_type}"
              class="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash class="h-4 w-4" />
            </Button>
          {/if}
        </div>
      </div>

      <!-- Type Indicator -->
      <div class="flex items-center mt-2">
        <div class="w-3 h-3 rounded-full {getTypeColor(item.type, item.item_type)} mr-2"></div>
        <span class="text-xs text-gray-500 capitalize">{item.type.replace('-', ' ')}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style> 