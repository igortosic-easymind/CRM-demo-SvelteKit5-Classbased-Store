<!-- src/routes/tasks/new/+page.svelte -->
<script lang="ts">
    import TaskForm from "$lib/components/tasks/task-form.svelte";
    import type { PageProps } from "./$types";
    
    // Get the data from the server load function
    let { data, form }: PageProps = $props();
  </script>
  
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Add New Task</h1>
    </div>
    
    <!-- Pass the clients data to the form component -->
    <TaskForm clients={data.clients} {form} />
  </div>