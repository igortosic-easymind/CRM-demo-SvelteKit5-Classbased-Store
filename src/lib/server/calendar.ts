// src/lib/server/calendar.ts
import { env } from "$env/dynamic/private";
import type {
  CreateCalendarEventData,
  UpdateCalendarEventData,
  ListCalendarEventsParams,
  CalendarViewParams,
  ListCalendarEventsResponse,
  CalendarViewResponse,
  CalendarEventResponse,
} from "../types";
import type { Cookies } from "@sveltejs/kit";

const API_URL = env.API_URL || "http://127.0.0.1:8000/api";

// Helper function to get token from cookies
function getAuthToken(cookies: Cookies): string | undefined {
  return cookies.get("token");
}

// Helper function to handle API errors
async function handleApiError(response: Response) {
  const error = await response.json();
  throw new Error(error.message || "API request failed");
}

export async function listCalendarEvents(
  cookies: Cookies,
  params: ListCalendarEventsParams = {},
): Promise<ListCalendarEventsResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return {
        success: false,
        error: "Authentication required",
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        },
      };
    }

    const queryParams = new URLSearchParams();
    if (params.type) {
      queryParams.append("type", params.type);
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (params.client_id) {
      queryParams.append("client_id", params.client_id.toString());
    }
    if (params.task_id) {
      queryParams.append("task_id", params.task_id.toString());
    }
    if (params.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params.end_date) {
      queryParams.append("end_date", params.end_date);
    }
    if (typeof params.page === "number") {
      queryParams.append("page", params.page.toString());
    }
    if (typeof params.itemsPerPage === "number") {
      queryParams.append("per_page", params.itemsPerPage.toString());
    }
    if (params.sortBy) {
      queryParams.append("sort_by", params.sortBy);
    }
    if (params.sortOrder) {
      queryParams.append("sort_order", params.sortOrder);
    }

    const response = await fetch(`${API_URL}/calendar/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch calendar events",
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
    };
  }
}

export async function getCalendarView(
  cookies: Cookies,
  params: CalendarViewParams = {},
): Promise<CalendarViewResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return {
        success: false,
        error: "Authentication required",
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 50,
        },
      };
    }

    const queryParams = new URLSearchParams();
    if (params.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params.end_date) {
      queryParams.append("end_date", params.end_date);
    }
    if (typeof params.include_tasks === "boolean") {
      queryParams.append("include_tasks", params.include_tasks.toString());
    }
    if (typeof params.include_events === "boolean") {
      queryParams.append("include_events", params.include_events.toString());
    }
    if (params.type) {
      queryParams.append("type", params.type);
    }
    if (params.client_id) {
      queryParams.append("client_id", params.client_id.toString());
    }
    if (params.status) {
      queryParams.append("status", params.status);
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (typeof params.page === "number") {
      queryParams.append("page", params.page.toString());
    }
    if (typeof params.per_page === "number") {
      queryParams.append("per_page", params.per_page.toString());
    }

    const response = await fetch(
      `${API_URL}/calendar/calendar-view${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch calendar view",
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 50,
      },
    };
  }
}

export async function getCalendarEvent(cookies: Cookies, id: string): Promise<CalendarEventResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/calendar/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch calendar event",
    };
  }
}

export async function createCalendarEvent(
  cookies: Cookies,
  eventData: CreateCalendarEventData,
): Promise<CalendarEventResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/calendar/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();

    // Handle nested response structure from backend
    if (data.success && data.data) {
      return { success: true, data: data.data };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create calendar event",
    };
  }
}

export async function updateCalendarEvent(
  cookies: Cookies,
  id: string,
  eventData: UpdateCalendarEventData,
): Promise<CalendarEventResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/calendar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update calendar event",
    };
  }
}

export async function deleteCalendarEvent(cookies: Cookies, id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/calendar/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete calendar event",
    };
  }
}
