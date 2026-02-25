import { env } from "$env/dynamic/private";
import type {
  Client,
  CreateClientData,
  UpdateClientData,
  PaginationState,
  ContactCreate,
  ContactUpdate,
  ContactListResponse,
  ContactSingleResponse,
} from "../types";
import type { Cookies } from "@sveltejs/kit";

const API_URL = env.API_URL || "http://127.0.0.1:8000/api";

// Helper function to get token from cookies
function getAuthToken(cookies: Cookies): string | undefined {
  return cookies.get("token");
}

// Helper function to handle API errors
async function handleApiError(response: Response) {
  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const error = await response.json();
      throw new Error(error.message || `API request failed with status ${response.status}`);
    } else {
      // Handle non-JSON responses (like HTML error pages)
      const text = await response.text();
      console.error("API Error Response:", text);
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
  } catch {
    // If we can't parse the error response, provide a generic error
    throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
  }
}

interface ListClientsParams {
  lead?: "cold" | "warm" | "hot";
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  itemsPerPage?: number;
}

interface ListClientsResponse {
  success: boolean;
  data: Client[];
  pagination: PaginationState;
  error?: string;
}

export async function listClients(cookies: Cookies, params: ListClientsParams = {}): Promise<ListClientsResponse> {
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
    if (params.lead) {
      queryParams.append("lead", params.lead);
    }
    if (params.search) {
      queryParams.append("search", params.search);
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

    const response = await fetch(`${API_URL}/clients/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`, {
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
      error: error instanceof Error ? error.message : "Failed to fetch clients",
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

interface ClientResponse {
  success: boolean;
  data?: Client;
  error?: string;
}

export async function getClient(cookies: Cookies, id: string): Promise<ClientResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/clients/${id}`, {
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
      error: error instanceof Error ? error.message : "Failed to fetch client",
    };
  }
}

export async function createClient(cookies: Cookies, clientData: CreateClientData): Promise<ClientResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/clients/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create client",
    };
  }
}

export async function updateClient(
  cookies: Cookies,
  id: string,
  clientData: UpdateClientData,
): Promise<ClientResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update client",
    };
  }
}

export async function deleteClient(cookies: Cookies, id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/clients/${id}`, {
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
      error: error instanceof Error ? error.message : "Failed to delete client",
    };
  }
}

// Contact management functions
export async function listContacts(cookies: Cookies, clientId: number): Promise<ContactListResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return {
        success: false,
        data: [],
      };
    }

    const response = await fetch(`${API_URL}/clients/${clientId}/contacts`, {
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
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch contacts",
    };
  }
}

export async function getContact(
  cookies: Cookies,
  clientId: number,
  contactId: number,
): Promise<ContactSingleResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/clients/${clientId}/contacts/${contactId}`, {
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
      error: error instanceof Error ? error.message : "Failed to fetch contact",
    };
  }
}

export async function createContact(
  cookies: Cookies,
  clientId: number,
  contactData: ContactCreate,
): Promise<ContactSingleResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/clients/${clientId}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create contact",
    };
  }
}

export async function updateContact(
  cookies: Cookies,
  clientId: number,
  contactId: number,
  contactData: ContactUpdate,
): Promise<ContactSingleResponse> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/clients/${clientId}/contacts/${contactId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update contact",
    };
  }
}

export async function deleteContact(
  cookies: Cookies,
  clientId: number,
  contactId: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAuthToken(cookies);
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/clients/${clientId}/contacts/${contactId}`, {
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
      error: error instanceof Error ? error.message : "Failed to delete contact",
    };
  }
}
