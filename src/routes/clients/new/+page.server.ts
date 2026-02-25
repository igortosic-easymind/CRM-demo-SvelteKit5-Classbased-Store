import { createClient } from "$lib/server/clients";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

// Define the form result type
interface FormResult {
  success: boolean;
  error?: string;
}

// This ensures our page is protected
export const load: PageServerLoad = async () => {
  // No specific data needed for this page
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }): Promise<FormResult> => {
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

    // Create the client in the database
    const result = await createClient(cookies, clientData);

    if (!result.success) {
      // Return the error to display in the form
      return {
        success: false,
        error: result.error,
      };
    }

    // If successful, redirect to the clients list
    throw redirect(303, "/clients");
  },
};
