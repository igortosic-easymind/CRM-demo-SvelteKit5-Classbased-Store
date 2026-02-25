import { getTask } from "$lib/server/tasks";
import { getClient } from "$lib/server/clients";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const taskId = params.id;

  if (!taskId) {
    throw error(400, "Task ID is required");
  }

  const result = await getTask(cookies, taskId);

  if (!result.success || !result.data) {
    throw error(404, result.error || "Task not found");
  }

  const task = result.data;
  let client = null;

  // If task has a client_id, fetch the client information
  if (task.client_id) {
    const clientResult = await getClient(cookies, task.client_id.toString());
    if (clientResult.success && clientResult.data) {
      client = clientResult.data;
    }
  }

  return {
    task,
    client,
  };
};
