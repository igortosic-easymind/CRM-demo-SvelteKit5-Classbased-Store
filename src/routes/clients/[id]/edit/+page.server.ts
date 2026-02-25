import { getClient, updateClient } from "$lib/server/clients";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const clientId = params.id;

  if (!clientId) {
    throw error(400, "Client ID is required");
  }

  const result = await getClient(cookies, clientId);

  if (!result.success || !result.data) {
    throw error(404, result.error || "Client not found");
  }

  return {
    client: result.data,
  };
};

export const actions: Actions = {
  default: async ({ request, cookies, params }) => {
    const clientId = params.id;

    if (!clientId) {
      return { success: false, error: "Client ID is required" };
    }

    // Get all form data
    const formData = await request.formData();

    // Parse contacts data
    let contacts = [];
    try {
      const contactsData = formData.get("contacts")?.toString();
      if (contactsData) {
        contacts = JSON.parse(contactsData);
      }
    } catch {
      return {
        success: false,
        error: "Invalid contact data format",
      };
    }

    // Create a client data object from the form data
    const clientData = {
      id: Number(clientId),
      company_name: formData.get("company_name")?.toString() || "",
      website: formData.get("website")?.toString() || "",
      address: formData.get("address")?.toString() || "",
      city: formData.get("city")?.toString() || "",
      state: formData.get("state")?.toString() || "",
      zipcode: formData.get("zipcode")?.toString() || "",
      lead: (formData.get("lead")?.toString() as "cold" | "warm" | "hot") || "cold",
      related_name: formData.get("related_name")?.toString() || "",
      linkedin_connection: formData.get("linkedin_connection")?.toString() || "",
      comments: formData.get("comments")?.toString() || "",
      first_contact: formData.get("first_contact")?.toString() || undefined,
      description_contact: formData.get("description_contact")?.toString() || "",
      description_contact_more: formData.get("description_contact_more")?.toString() || "",
      follow_up_action: formData.get("follow_up_action")?.toString() || "",
      date_of_next_contact: formData.get("date_of_next_contact")?.toString() || "",
      new_business: formData.get("new_business")?.toString() || "",
      recommendation: formData.get("recommendation")?.toString() || "",
      contacts: contacts,
    };

    // Update the client in the database
    const result = await updateClient(cookies, clientId, clientData);

    if (!result.success) {
      // Return the error to display in the form
      return {
        success: false,
        error: result.error,
      };
    }

    // If successful, redirect to the client details page
    throw redirect(303, `/clients/${clientId}`);
  },
};
