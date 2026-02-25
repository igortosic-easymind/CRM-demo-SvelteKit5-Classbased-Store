import { login } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, url }: RequestEvent) => {
  // If user is already logged in, redirect to dashboard
  const token = cookies.get("token");
  if (token) {
    throw redirect(302, "/dashboard");
  }

  // If there's a redirect parameter, return it
  const redirectTo = url.searchParams.get("redirect") || "/dashboard";
  return { redirectTo };
};

export const actions: Actions = {
  default: async ({ request, cookies, url }: RequestEvent) => {
    const formData = await request.formData();
    const username = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!username || !password) {
      return { success: false, error: "Email and password are required" };
    }

    const result = await login({ username, password }, cookies);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Get redirect URL from query params or default to dashboard
    const redirectTo = url.searchParams.get("redirect") || "/dashboard";

    // Successfully logged in, redirect to intended destination or dashboard
    throw redirect(302, redirectTo);
  },
};
