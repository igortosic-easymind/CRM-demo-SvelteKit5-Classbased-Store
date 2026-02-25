import { env } from "$env/dynamic/private";
import type { Task, CreateTaskData, UpdateTaskData, PaginationState } from "../types";
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

interface ListTasksParams {
  status?: "todo" | "in-progress" | "completed";
  search?: string;
  client_id?: number;
  page?: number;
  itemsPerPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ListTasksResponse {
  success: boolean;
  data: Task[];
  pagination: PaginationState;
  error?: string;
}

export async function listTasks(cookies: Cookies, params: ListTasksParams = {}): Promise<ListTasksResponse> {
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
    if (params.status) {
      queryParams.append("status", params.status);
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (params.client_id) {
      queryParams.append("client_id", params.client_id.toString());
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

    const response = await fetch(`${API_URL}/tasks/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`, {
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
      error: error instanceof Error ? error.message : "Failed to fetch tasks",
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

interface TaskResponse {
  success: boolean;
  data?: Task;
  error?: string;
}

export async function getTask(cookies: Cookies, id: string): Promise<TaskResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/tasks/${id}`, {
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
      error: error instanceof Error ? error.message : "Failed to fetch task",
    };
  }
}

export async function createTask(cookies: Cookies, taskData: CreateTaskData): Promise<TaskResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create task",
    };
  }
}

export async function updateTask(cookies: Cookies, id: string, taskData: UpdateTaskData): Promise<TaskResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update task",
    };
  }
}

export async function deleteTask(cookies: Cookies, id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/tasks/${id}`, {
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
      error: error instanceof Error ? error.message : "Failed to delete task",
    };
  }
}
