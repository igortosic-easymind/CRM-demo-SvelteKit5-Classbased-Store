<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { calendarStore } from "$lib/store/calendar.svelte";

  // Callback prop for Svelte 5
  let { onviewChange }: { onviewChange?: ((view: "month" | "week") => void) } = $props();

  // Create a reactive reference to the calendar view
  let currentView = $derived(calendarStore.calendarView);

  function handleViewChange(view: "month" | "week") {
    onviewChange?.(view);
  }
</script>

<div class="flex items-center space-x-1 rounded-md border p-1">
  <Button
    variant={currentView === "month" ? "default" : "ghost"}
    size="sm"
    onclick={() => handleViewChange("month")}
    class="px-3 py-1"
  >
    Month
  </Button>
  <Button
    variant={currentView === "week" ? "default" : "ghost"}
    size="sm"
    onclick={() => handleViewChange("week")}
    class="px-3 py-1"
  >
    Week
  </Button>
</div> 