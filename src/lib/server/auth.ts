import { env } from "$env/dynamic/private";
import { dev } from "$app/environment";
import type { User, LoginCredentials, LoginResponse } from "../types";
import { redirect } from "@sveltejs/kit";
import type { Cookies } from "@sveltejs/kit";

// Configure based on your environment
const API_URL = env.API_URL || "http://127.0.0.1:8000/api";

export async function login(credentials: LoginCredentials, cookies: Cookies) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data: LoginResponse = await response.json();

    // Set the token in cookies
    cookies.set("token", data.token, {
      httpOnly: true,
      secure: !dev,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Fetch user data
    const userResponse = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData: User = await userResponse.json();
    return { success: true, user: userData };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

export async function logout(cookies: Cookies) {
  try {
    cookies.delete("token", { path: "/" });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to logout",
    };
  }
}

export async function getUserFromToken(cookies: Cookies): Promise<User | null> {
  const token = cookies.get("token");

  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Token might be invalid or expired
      cookies.delete("token", { path: "/" });
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching user data:", err);
    return null;
  }
}

// Helper to check if user is authenticated - useful for protected routes
export async function requireAuth(cookies: Cookies, redirectTo = "/login") {
  const user = await getUserFromToken(cookies);

  if (!user) {
    throw redirect(303, redirectTo);
  }

  return user;
}
