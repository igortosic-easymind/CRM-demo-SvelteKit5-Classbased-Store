import { logout } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

// This prevents direct access to /logout as a page
export const load: PageServerLoad = async () => {
  throw redirect(302, "/login");
};

// This handles the POST request from the logout button
export const actions: Actions = {
  default: async ({ cookies }) => {
    const result = await logout(cookies);

    if (!result.success) {
      // If logout fails, you could handle this differently
      console.error("Logout failed:", result.error);
    }

    // Always redirect to login page
    throw redirect(302, "/login");
  },
};
