import type { CalendarEvent, CalendarEventType, CalendarEventStatus, PaginationState } from "$lib/types";

export class CalendarStore {
  // Base state
  calendarEvents = $state<CalendarEvent[]>([]);
  calendarPagination = $state<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  calendarFilters = $state<{
    search: string;
    type: CalendarEventType | null;
    status: CalendarEventStatus | null;
    client_id: number | null;
    start_date: string | null;
    end_date: string | null;
    include_tasks: boolean;
    include_events: boolean;
  }>({
    search: "",
    type: null,
    status: null,
    client_id: null,
    start_date: null,
    end_date: null,
    include_tasks: false,
    include_events: false,
  });

  // Loading and error states
  loading = $state(false);
  error = $state<string | null>(null);

  // UI action states
  eventModalOpen = $state(false);
  eventModalMode = $state<"create" | "edit" | "view">("create");
  selectedEvent = $state<CalendarEvent | null>(null);
  selectedDateForEvent = $state<string | null>(null);
  selectedTimeForEvent = $state<string | null>(null);

  // Delete modal states
  deleteModalOpen = $state(false);
  eventToDelete = $state<CalendarEvent | null>(null);

  // Calendar view state
  calendarView = $state<"month" | "week">("month");
  currentCalendarDate = $state<string | null>(null);

  // Calendar data actions
  setCalendarEventsData(data: {
    events: CalendarEvent[];
    pagination: PaginationState;
    filters?: {
      search?: string;
      type?: CalendarEventType | null;
      status?: CalendarEventStatus | null;
      client_id?: number | null;
      start_date?: string | null;
      end_date?: string | null;
      include_tasks?: boolean;
      include_events?: boolean;
    };
  }): void {
    this.calendarEvents = data.events; // Already filtered by backend
    this.calendarPagination = data.pagination;

    if (data.filters) {
      this.calendarFilters = {
        search: data.filters.search || "",
        type: data.filters.type || null,
        status: data.filters.status || null,
        client_id: data.filters.client_id || null,
        start_date: data.filters.start_date || null,
        end_date: data.filters.end_date || null,
        include_tasks: data.filters.include_tasks !== false,
        include_events: data.filters.include_events !== false,
      };
    }
  }

  // Filter actions
  updateCalendarFilters(newFilters: {
    search?: string;
    type?: CalendarEventType | null;
    status?: CalendarEventStatus | null;
    client_id?: number | null;
    start_date?: string | null;
    end_date?: string | null;
    include_tasks?: boolean;
    include_events?: boolean;
  }): void {
    this.calendarFilters = { ...this.calendarFilters, ...newFilters };
  }

  resetCalendarFilters(): void {
    this.calendarFilters = {
      search: "",
      type: null,
      status: null,
      client_id: null,
      start_date: null,
      end_date: null,
      include_tasks: false,
      include_events: false,
    };
  }

  // Loading and error actions
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  setError(error: string | null): void {
    this.error = error;
  }

  // Event modal actions
  createEvent(date?: string, time?: string): void {
    this.selectedDateForEvent = date || null;
    this.selectedTimeForEvent = time || null;
    this.eventModalMode = "create";
    this.selectedEvent = null;
    this.eventModalOpen = true;
  }

  viewEvent(event: CalendarEvent): void {
    this.selectedEvent = event;
    this.eventModalMode = "view";
    this.eventModalOpen = true;
  }

  editEvent(event: CalendarEvent): void {
    this.selectedEvent = event;
    this.eventModalMode = "edit";
    this.eventModalOpen = true;
  }

  deleteEvent(event: CalendarEvent): void {
    this.eventToDelete = event;
    this.deleteModalOpen = true;
  }

  closeEventModal(): void {
    this.eventModalOpen = false;
    this.selectedEvent = null;
    this.selectedDateForEvent = null;
    this.selectedTimeForEvent = null;
  }

  // Delete modal actions
  openDeleteModal(event: CalendarEvent): void {
    this.eventToDelete = event;
    this.deleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.deleteModalOpen = false;
    this.eventToDelete = null;
  }

  // Calendar view actions
  setCalendarView(view: "month" | "week"): void {
    this.calendarView = view;
  }

  setCurrentCalendarDate(date: string | null): void {
    this.currentCalendarDate = date;
  }

  setCalendarViewAndDate(view: "month" | "week", date: string | null): void {
    this.calendarView = view;
    this.currentCalendarDate = date;
  }

  // Event CRUD helpers
  addEvent(event: CalendarEvent): void {
    this.calendarEvents = [...this.calendarEvents, event];
    this.calendarPagination.totalItems += 1;
  }

  updateEvent(updatedEvent: CalendarEvent): void {
    this.calendarEvents = this.calendarEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event));
  }

  removeEvent(eventId: number): void {
    this.calendarEvents = this.calendarEvents.filter((event) => event.id !== eventId);
    this.calendarPagination.totalItems -= 1;
  }
}

export const calendarStore = new CalendarStore();
