<script lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "$lib/components/ui/dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { calendarStore } from "$lib/store/calendar.svelte";


  let open = $derived(calendarStore.deleteModalOpen);
  let event = $derived(calendarStore.eventToDelete);

  let isSubmitting = $state(false);

  function closeModal() {
   calendarStore.closeDeleteModal();
  }

  function formatEventDateTime(startDate: string, endDate: string, allDay: boolean): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (allDay) {
      return start.toLocaleDateString([], { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = start.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return `${date} from ${startTime} to ${endTime}`;
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

      async function handleEventSuccess() {
    // Immediately update the local store to remove the deleted event
    if (calendarStore.eventToDelete) {
      calendarStore.removeEvent(calendarStore.eventToDelete.id);
    }
    
    // Also refresh data from server to ensure consistency
    await invalidateAll();
  }
</script>

<Dialog bind:open onOpenChange={closeModal}>
  <DialogContent class="sm:max-w-md">
    <DialogHeader>
      <DialogTitle class="text-red-600">Delete Event</DialogTitle>
    </DialogHeader>

    {#if event}
      <div class="space-y-4">
        <!-- Event Info -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="flex items-start space-x-3">
            <div class="w-4 h-4 rounded-full {getEventTypeColor(event.type)} mt-1 shrink-0"></div>
            <div class="flex-1">
              <h4 class="font-semibold text-lg">{event.title}</h4>
              <p class="text-sm text-gray-600 mt-1">
                {formatEventDateTime(event.start_date, event.end_date, event.all_day)}
              </p>
              {#if event.location}
                <p class="text-sm text-gray-500 mt-1">
                  📍 {event.location}
                </p>
              {/if}
              {#if event.description}
                <p class="text-sm text-gray-600 mt-2">
                  {event.description}
                </p>
              {/if}
            </div>
          </div>
        </div>

        <!-- Warning Message -->
        <div class="text-center">
          <p class="text-gray-700">
            Are you sure you want to delete this event?
          </p>
          <p class="text-sm text-red-600 mt-1">
            This action cannot be undone.
          </p>
        </div>

        <!-- Delete Form -->
        <form
          method="POST"
          action="?/delete"
          use:enhance={() => {
            isSubmitting = true;
            return async ({ result }) => {
              isSubmitting = false;
              if (result.type === 'success') {
                handleEventSuccess();
                closeModal();
              }
            };
          }}
        >
          <input type="hidden" name="id" value={event.id} />
          
          <DialogFooter class="gap-2">
            <Button
              type="button"
              variant="outline"
              onclick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete Event"}
            </Button>
          </DialogFooter>
        </form>
      </div>
    {/if}
  </DialogContent>
</Dialog> 