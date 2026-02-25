import { listClients } from "$lib/server/clients";
import type { PageServerLoad } from "./$types";
import type { LeadStatus } from "$lib/types";

export const load: PageServerLoad = async ({ cookies, url }) => {
  // Get query parameters
  const page = Number(url.searchParams.get("page") || "1");
  const search = url.searchParams.get("search") || "";
  const lead = url.searchParams.get("lead") as LeadStatus | null;

  // Fetch data with filters
  const clientsResponse = await listClients(cookies, {
    page,
    itemsPerPage: 10,
    search,
    lead: lead || undefined,
  });

  return {
    clients: clientsResponse.data,
    pagination: clientsResponse.pagination,
    filters: {
      search,
      lead,
    },
  };
};
