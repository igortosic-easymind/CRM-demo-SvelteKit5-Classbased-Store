import type { Task, TaskStatus, TaskPriority, PaginationState } from "$lib/types";

export class TaskStore {
  // Base state
  tasks = $state<Task[]>([]);
  pagination = $state<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  filters = $state<{
    search: string;
    status: TaskStatus | null;
    priority: TaskPriority | null;
    type: string | null;
    client_id: number | null;
  }>({
    search: "",
    status: null,
    priority: null,
    type: null,
    client_id: null,
  });
  // Loading and error states
  loading = $state(false);
  error = $state<string | null>(null);

  // Actions
  setTasksData(data: {
    tasks: Task[];
    pagination: PaginationState;
    filters?: {
      search?: string;
      status?: TaskStatus | null;
      priority?: TaskPriority | null;
      type?: string | null;
      client_id?: number | null;
    };
  }): void {
    this.tasks = data.tasks; // Already filtered by backend
    this.pagination = data.pagination;

    if (data.filters) {
      this.filters = {
        search: data.filters.search || "",
        status: data.filters.status || null,
        priority: data.filters.priority || null,
        type: data.filters.type || null,
        client_id: data.filters.client_id || null,
      };
    }
  }

  updateTasksFilters(newFilters: {
    search?: string;
    status?: TaskStatus | null;
    priority?: TaskPriority | null;
    type?: string | null;
    client_id?: number | null;
  }): void {
    this.filters = { ...this.filters, ...newFilters };
  }

  resetTasksFilters(): void {
    this.filters = {
      search: "",
      status: null,
      priority: null,
      type: null,
      client_id: null,
    };
  }

  setTasksLoading(loading: boolean): void {
    this.loading = loading;
  }

  setTasksError(error: string | null): void {
    this.error = error;
  }
}

export const taskStore = new TaskStore();
