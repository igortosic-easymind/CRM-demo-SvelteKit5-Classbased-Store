// src/routes/clients/[id]/delete/+page.server.ts
import { deleteClient } from "$lib/server/clients";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  // Redirect to clients list if someone tries to access this page directly
  throw redirect(303, "/clients");
};

export const actions: Actions = {
  default: async ({ params, cookies }) => {
    const id = Number(params.id);

    if (isNaN(id)) {
      return { success: false, error: "Invalid client ID" };
    }

    const result = await deleteClient(cookies, id);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Redirect back to clients list after successful deletion
    throw redirect(303, "/clients");
  },
};
