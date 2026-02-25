// src/routes/tasks/new/+page.server.ts
import { createTask } from "$lib/server/tasks";
import { listClients } from "$lib/server/clients";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

// Define the form result type
interface FormResult {
  success: boolean;
  error?: string;
}

// Load clients for the dropdown
export const load: PageServerLoad = async ({ cookies }) => {
  const clientsResult = await listClients(cookies, { itemsPerPage: 100 });

  return {
    clients: clientsResult.data || [],
  };
};

export const actions: Actions = {
  default: async ({ request, cookies }): Promise<FormResult> => {
    // Get all form data
    const formData = await request.formData();

    // Create a task data object from the form data
    const taskData = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      due_date: formData.get("due_date")?.toString() || undefined,
      priority: (formData.get("priority")?.toString() as "low" | "medium" | "high" | undefined) || undefined,
      status: (formData.get("status")?.toString() as "todo" | "in-progress" | "completed") || "todo",
      type:
        (formData.get("type")?.toString() as "follow-up" | "meeting" | "call" | "email" | "other" | undefined) ||
        undefined,

      // client_id: formData.get("client_id") ? Number(formData.get("client_id")) : undefined,
    };

    // Create the task in the database
    const result = await createTask(cookies, taskData);

    if (!result.success) {
      // Return the error to display in the form
      return {
        success: false,
        error: result.error,
      };
    }

    // If successful, redirect to the tasks list
    throw redirect(303, "/tasks");
  },
};
