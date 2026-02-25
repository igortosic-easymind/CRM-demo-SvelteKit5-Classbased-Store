// src/routes/tasks/[id]/edit/+page.server.ts
import { getTask, updateTask } from "$lib/server/tasks";
import { listClients } from "$lib/server/clients";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const taskId = params.id;

  if (!taskId) {
    throw error(400, "Task ID is required");
  }

  // Fetch both task and clients data
  const [taskResult, clientsResult] = await Promise.all([
    getTask(cookies, taskId),
    listClients(cookies, { itemsPerPage: 100 }), // Get more clients for the dropdown
  ]);

  if (!taskResult.success || !taskResult.data) {
    throw error(404, taskResult.error || "Task not found");
  }

  return {
    task: taskResult.data,
    clients: clientsResult.data || [],
  };
};

export const actions: Actions = {
  default: async ({ request, cookies, params }) => {
    const taskId = params.id;

    if (!taskId) {
      return { success: false, error: "Task ID is required" };
    }

    // Get all form data
    const formData = await request.formData();

    // Create a task data object from the form data
    const taskData = {
      id: Number(taskId),
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      status: (formData.get("status")?.toString() as "todo" | "in-progress" | "completed") || "todo",
      priority: (formData.get("priority")?.toString() as "low" | "medium" | "high" | undefined) || undefined,
      type:
        (formData.get("type")?.toString() as "follow-up" | "meeting" | "call" | "email" | "other" | undefined) ||
        undefined,
      due_date: formData.get("due_date")?.toString() || undefined,
      client_id: formData.get("client_id") ? Number(formData.get("client_id")) : undefined,
    };

    // Update the task in the database
    const result = await updateTask(cookies, taskId, taskData);

    if (!result.success) {
      // Return the error to display in the form
      return {
        success: false,
        error: result.error,
      };
    }

    // If successful, redirect to the task details page
    throw redirect(303, `/tasks/${taskId}`);
  },
};
