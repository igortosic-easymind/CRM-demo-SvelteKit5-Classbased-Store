<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import type { CalendarEvent } from '$lib/types';
  
  interface Props {
    events: CalendarEvent[];
  }
  
  let { events }: Props = $props();
  
  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  function getEventTypeIcon(type: string) {
    switch(type) {
      case 'meeting': return '👥';
      case 'call': return '📞';
      case 'follow-up': return '📋';
      case 'deadline': return '⏰';
      default: return '📅';
    }
  }
</script>

<Card.Root>
  <Card.Header class="flex flex-row items-center justify-between">
    <Card.Title>Upcoming Events</Card.Title>
    <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">Live</span>
  </Card.Header>
  <Card.Content>
    <div class="space-y-4">
      {#each events as event}
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <span class="text-lg">{getEventTypeIcon(event.type)}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {event.title}
            </p>
            <p class="text-sm text-gray-500">{formatDateTime(event.start_date)}</p>
            {#if event.location}
              <p class="text-xs text-gray-400">📍 {event.location}</p>
            {/if}
          </div>
          <div class="flex-shrink-0">
            <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
              {event.type}
            </span>
          </div>
        </div>
      {/each}
      {#if events.length === 0}
        <p class="text-sm text-gray-500 text-center py-4">No upcoming events</p>
      {/if}
    </div>
  </Card.Content>
</Card.Root> 