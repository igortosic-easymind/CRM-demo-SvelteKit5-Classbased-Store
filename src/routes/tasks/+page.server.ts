import { listTasks } from "$lib/server/tasks";
import type { PageServerLoad } from "./$types";
import type { Task } from "$lib/types";
import type { PaginationState } from "$lib/types";

export const load: PageServerLoad = async ({ cookies, url }) => {
  // Get query parameters
  const page = Number(url.searchParams.get("page") || "1");
  const search = url.searchParams.get("search") || "";
  const statusParam = url.searchParams.get("status");
  const status = statusParam ? (statusParam as "todo" | "in-progress" | "completed") : undefined;
  const client_id = Number(url.searchParams.get("client_id")) || undefined;

  // Fetch data with filters
  const tasksResponse = await listTasks(cookies, {
    page,
    itemsPerPage: 10,
    search,
    status,
    client_id,
  });

  return {
    tasks: tasksResponse.data as Task[],
    pagination: tasksResponse.pagination as PaginationState,
    filters: {
      search,
      status,
      client_id,
    },
  };
};
