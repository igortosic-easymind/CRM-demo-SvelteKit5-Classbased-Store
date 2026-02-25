// src/routes/calendar/+page.server.ts
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent, getCalendarView } from "$lib/server/calendar";
import { listClients } from "$lib/server/clients";
import { listTasks } from "$lib/server/tasks";
import type { PageServerLoad, Actions } from "./$types";
import type {
  CalendarEvent,
  CalendarEventType,
  CalendarEventStatus,
  PaginationState,
  CreateCalendarEventData,
  CalendarViewItem,
} from "$lib/types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies, url }) => {
  // Get query parameters
  const page = Number(url.searchParams.get("page") || "1");
  const search = url.searchParams.get("search") || "";
  const typeParam = url.searchParams.get("type");
  const type = typeParam ? (typeParam as CalendarEventType) : undefined;
  const statusParam = url.searchParams.get("status");
  const status = statusParam ? (statusParam as CalendarEventStatus) : undefined;
  const client_id = Number(url.searchParams.get("client_id")) || undefined;
  const start_date = url.searchParams.get("start_date") || undefined;
  const end_date = url.searchParams.get("end_date") || undefined;

  // New parameters for combined view
  const include_tasks = url.searchParams.get("include_tasks") !== "false"; // default true
  const include_events = url.searchParams.get("include_events") !== "false"; // default true
  const per_page = Number(url.searchParams.get("per_page") || "50");

  // Get view and date parameters for calendar state
  const view = url.searchParams.get("view") as "month" | "week" | null;
  const date = url.searchParams.get("date") || undefined;

  // Fetch calendar data, clients data, and tasks data
  const [calendarResponse, clientsResponse, tasksResponse] = await Promise.all([
    getCalendarView(cookies, {
      page,
      per_page,
      search,
      type,
      status,
      client_id,
      start_date,
      end_date,
      include_tasks,
      include_events,
    }),
    listClients(cookies, { itemsPerPage: 100 }), // Get clients for dropdown
    listTasks(cookies, { itemsPerPage: 100 }), // Get tasks for traditional calendar view
  ]);

  // Helper function to convert CalendarViewItem to CalendarEvent for backward compatibility
  function convertToCalendarEvent(item: CalendarViewItem): CalendarEvent {
    return {
      id: item.id,
      title: item.title,
      description: item.description || "",
      start_date: item.start_date,
      end_date: item.end_date,
      all_day: item.all_day,
      type: item.type as CalendarEventType,
      status: item.status as CalendarEventStatus,
      client_id: item.client_id || undefined,
      task_id: item.task_id || undefined,
      location: item.location || "",
      recurrence: item.recurrence as "none" | "daily" | "weekly" | "monthly" | "yearly",
      recurrence_end: item.recurrence_end || undefined,
      created_at: item.created_at,
      updated_at: item.updated_at,
      owner_id: 1, // Default owner_id for backward compatibility
      item_type: item.item_type,
      due_date: item.due_date,
      priority: item.priority,
    };
  }

  return {
    calendarItems: calendarResponse.data as CalendarViewItem[],
    // Keep backwards compatibility for existing components
    events: calendarResponse.data.filter((item) => item.item_type === "event").map(convertToCalendarEvent),
    tasks: calendarResponse.data.filter((item) => item.item_type === "task"),
    // Add separate tasks data for traditional calendar view
    allTasks: tasksResponse.data || [],
    clients: clientsResponse.data || [], // Add clients data
    pagination: calendarResponse.pagination as PaginationState,
    filters: {
      search,
      type,
      status,
      client_id,
      start_date,
      end_date,
      include_tasks,
      include_events,
    },
    // Add view state to the returned data
    viewState: {
      view: view || "month",
      date: date || null,
    },
  };
};

export const actions: Actions = {
  create: async ({ request, cookies }) => {
    const formData = await request.formData();

    // Helper function to convert datetime-local to ISO string
    function formatDateTimeForAPI(dateTimeLocal: string): string {
      if (!dateTimeLocal) return "";
      // datetime-local gives us "2025-05-28T00:00", we need to add timezone
      const date = new Date(dateTimeLocal);
      return date.toISOString(); // This gives us "2025-05-28T00:00:00.000Z"
    }

    const eventData: CreateCalendarEventData = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      start_date: formatDateTimeForAPI(formData.get("start_date")?.toString() || ""),
      end_date: formatDateTimeForAPI(formData.get("end_date")?.toString() || ""),
      all_day: formData.get("all_day") === "on", // Fix: checkbox sends "on" when checked, not "true"
      type: (formData.get("type")?.toString() as CalendarEventType) || "meeting",
      status: (formData.get("status")?.toString() as CalendarEventStatus) || "scheduled",
      location: formData.get("location")?.toString() || "",
      recurrence:
        (formData.get("recurrence")?.toString() as "none" | "daily" | "weekly" | "monthly" | "yearly") || "none",
      client_id: formData.get("client_id") ? Number(formData.get("client_id")) : undefined,
      task_id: formData.get("task_id") ? Number(formData.get("task_id")) : undefined,
      recurrence_end: formData.get("recurrence_end")?.toString() || undefined,
      item_type: formData.get("item_type")?.toString() || "event",
      due_date: formData.get("due_date")?.toString() || "",
      priority: formData.get("priority")?.toString() || "normal",
    };

    const result = await createCalendarEvent(cookies, eventData);

    if (!result.success) {
      return fail(400, { error: result.error });
    }
    return { success: true, event: result.data };
  },

  update: async ({ request, cookies }) => {
    const formData = await request.formData();
    const eventId = formData.get("id")?.toString();

    if (!eventId) {
      return fail(400, { error: "Event ID is required" });
    }

    // Helper function to convert datetime-local to ISO string
    function formatDateTimeForAPI(dateTimeLocal: string): string {
      if (!dateTimeLocal) return "";
      // datetime-local gives us "2025-05-28T00:00", we need to add timezone
      const date = new Date(dateTimeLocal);
      return date.toISOString(); // This gives us "2025-05-28T00:00:00.000Z"
    }

    const eventData = {
      id: Number(eventId),
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      start_date: formatDateTimeForAPI(formData.get("start_date")?.toString() || ""),
      end_date: formatDateTimeForAPI(formData.get("end_date")?.toString() || ""),
      all_day: formData.get("all_day") === "on", // Fix: checkbox sends "on" when checked, not "true"
      type: (formData.get("type")?.toString() as CalendarEventType) || "meeting",
      status: (formData.get("status")?.toString() as CalendarEventStatus) || "scheduled",
      location: formData.get("location")?.toString() || "",
      recurrence:
        (formData.get("recurrence")?.toString() as "none" | "daily" | "weekly" | "monthly" | "yearly") || "none",
      client_id: formData.get("client_id") ? Number(formData.get("client_id")) : undefined,
      task_id: formData.get("task_id") ? Number(formData.get("task_id")) : undefined,
      recurrence_end: formData.get("recurrence_end")?.toString() || undefined,
    };

    const result = await updateCalendarEvent(cookies, eventId, eventData);

    if (!result.success) {
      return fail(400, { error: result.error });
    }

    return { success: true, event: result.data };
  },

  delete: async ({ request, cookies }) => {
    const formData = await request.formData();
    const eventId = formData.get("id")?.toString();

    if (!eventId) {
      return fail(400, { error: "Event ID is required" });
    }

    const result = await deleteCalendarEvent(cookies, Number(eventId));

    if (!result.success) {
      return fail(400, { error: result.error });
    }

    return { success: true };
  },
};
