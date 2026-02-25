import { deleteContact } from "$lib/server/clients";
import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ cookies, params }) => {
    const clientId = Number(params.id);
    const contactId = Number(params.contact_id);

    if (!clientId || !contactId) {
      throw error(400, "Client ID and Contact ID are required");
    }

    const result = await deleteContact(cookies, clientId, contactId);

    if (!result.success) {
      throw error(500, result.error || "Failed to delete contact");
    }

    // Redirect back to the client edit page
    throw redirect(303, `/clients/${clientId}/edit`);
  },
};
