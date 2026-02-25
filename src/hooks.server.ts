import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // Get the pathname
  const path = event.url.pathname;

  // Get auth token from cookies
  const token = event.cookies.get("token");

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/our-product"];

  // Check if the current path is a protected route
  const isProtectedRoute = !publicRoutes.some((route) => path === route || path.startsWith(`${route}/`));

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    throw redirect(303, `/login?redirect=${path}`);
  }

  // If user is authenticated and tries to access login/register, redirect to dashboard
  if (token && (path === "/login" || path === "/register" || path === "/" || path === "/our-product")) {
    throw redirect(303, "/dashboard");
  }

  // Continue with the request
  return await resolve(event);
};
