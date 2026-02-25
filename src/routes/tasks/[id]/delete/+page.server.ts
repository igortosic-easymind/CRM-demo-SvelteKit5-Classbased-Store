// src/routes/tasks/[id]/delete/+page.server.ts
import { deleteTask } from "$lib/server/tasks";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  // Redirect to tasks list if someone tries to access this page directly
  throw redirect(303, "/tasks");
};

export const actions: Actions = {
  default: async ({ params, cookies }) => {
    const id = Number(params.id);

    if (isNaN(id)) {
      return { success: false, error: "Invalid task ID" };
    }

    const result = await deleteTask(cookies, id);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Redirect back to tasks list after successful deletion
    throw redirect(303, "/tasks");
  },
};
