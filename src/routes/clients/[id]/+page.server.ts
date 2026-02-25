import { getClient } from "$lib/server/clients";
import { listTasks } from "$lib/server/tasks";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const clientId = params.id;

  if (!clientId) {
    throw error(400, "Client ID is required");
  }

  const result = await getClient(cookies, clientId);

  if (!result.success || !result.data) {
    throw error(404, result.error || "Client not found");
  }

  const client = result.data;

  // Fetch tasks for this client
  const tasksResult = await listTasks(cookies, {
    client_id: parseInt(clientId),
    itemsPerPage: 50, // Get more tasks for the client details view
  });

  const clientTasks = tasksResult.success ? tasksResult.data : [];

  return {
    client,
    clientTasks,
  };
};
