import { getUserFromToken } from "$lib/server/auth";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  // Get user if available, but don't throw redirects
  try {
    const user = await getUserFromToken(cookies);
    return { user };
  } catch {
    // If getUserFromToken throws, return empty object
    // This will show unauthenticated UI
    return {};
  }
};
