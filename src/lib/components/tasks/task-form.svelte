<!-- src/lib/components/tasks/task-form.svelte -->
<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import type { Task, Client } from "$lib/types";
    import { enhance } from "$app/forms";
    
    // Props with default values for a new task
    let { 
      task = undefined,
      clients = [],
      form = {},
      isSubmitting = false
    } = $props<{
      task?: Task;
      clients?: Client[];
      form?: any;
      isSubmitting?: boolean;
    }>();
    
    const isEditMode = $derived(!!task);
    const formTitle = $derived(isEditMode ? 'Edit Task' : 'Add New Task');
    const submitText = $derived(isEditMode ? 'Update Task' : 'Create Task');
    
    // Form enhancement to handle loading state
    function handleSubmit() {
      isSubmitting = true;
      
      return async ({ update }: { update: () => Promise<void> }) => {
        await update();
        isSubmitting = false;
      };
    }
  </script>
  
  <Card.Root class="w-full max-w-3xl mx-auto">
    <Card.Header>
      <Card.Title class="text-2xl">{formTitle}</Card.Title>
      <Card.Description>
        {isEditMode ? 'Update task information' : 'Enter information to create a new task'}
      </Card.Description>
    </Card.Header>
    
    <form method="POST" use:enhance={handleSubmit} class="space-y-8">
      <Card.Content class="space-y-6">
        {#if form?.error}
          <div class="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
            {form.error}
          </div>
        {/if}
        
        <!-- Basic Information -->
        <div>
          <h3 class="font-medium mb-4">Task Information</h3>
          <div class="grid gap-4">
            <div class="space-y-2">
              <Label for="title">Task Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={task?.title || ''} 
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <textarea
                id="description"
                name="description"
                rows="4"
                placeholder="Enter task description"
                required
                class="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >{task?.description || ''}</textarea>
            </div>
          </div>
        </div>
        
        <!-- Task Details -->
        <div>
          <h3 class="font-medium mb-4">Task Details</h3>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="status">Status</Label>
              <select 
                id="status" 
                name="status" 
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="todo" selected={task?.status === 'todo' || !task}>To Do</option>
                <option value="in-progress" selected={task?.status === 'in-progress'}>In Progress</option>
                <option value="completed" selected={task?.status === 'completed'}>Completed</option>
              </select>
            </div>
            
            <div class="space-y-2">
              <Label for="priority">Priority</Label>
              <select 
                id="priority" 
                name="priority" 
                required
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">No priority</option>
                <option value="low" selected={task?.priority === 'low'}>Low</option>
                <option value="medium" selected={task?.priority === 'medium'}>Medium</option>
                <option value="high" selected={task?.priority === 'high'}>High</option>
              </select>
            </div>
            
            <div class="space-y-2">
              <Label for="type">Type</Label>
              <select 
                id="type" 
                name="type"
                required
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select type</option>
                <option value="follow-up" selected={task?.type === 'follow-up'}>Follow-up</option>
                <option value="meeting" selected={task?.type === 'meeting'}>Meeting</option>
                <option value="call" selected={task?.type === 'call'}>Call</option>
                <option value="email" selected={task?.type === 'email'}>Email</option>
                <option value="other" selected={task?.type === 'other'}>Other</option>
              </select>
            </div>
            
            <div class="space-y-2">
              <Label for="due_date">Due Date</Label>
              <Input 
                id="due_date" 
                name="due_date" 
                type="date"
                required 
                value={task?.due_date ? task.due_date.split('T')[0] : ''}
              />
            </div>
          </div>
        </div>
        
        <!-- Client Association -->
        <div>
          <h3 class="font-medium mb-4">Client Association</h3>
          <div class="space-y-2">
            <Label for="client_id">Related Client (Optional)</Label>
            <select 
              id="client_id" 
              name="client_id" 
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">No client selected</option>
              {#each clients as client}
                <option value={client.id} selected={task?.client_id === client.id}>
                  {client.company_name || `${client.first_name} ${client.last_name}`}
                </option>
              {/each}
            </select>
          </div>
        </div>
      </Card.Content>
      
      <Card.Footer class="flex justify-between">
        <Button type="button" variant="outline" href="/tasks">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitText}
        </Button>
      </Card.Footer>
    </form>
  </Card.Root>