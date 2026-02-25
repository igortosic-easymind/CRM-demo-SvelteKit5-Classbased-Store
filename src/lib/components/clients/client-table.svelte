<script lang="ts">
  import type { Client } from "$lib/types";
  import { Button } from "$lib/components/ui/button/index.js";
  import Eye from "@lucide/svelte/icons/eye";
  import Edit from "@lucide/svelte/icons/edit";
  import { clientStore } from "$lib/store/clients.svelte";
  import DeleteClientDialog from "./delete-client-dialog.svelte";
  import { userStore } from "$lib/store/user.svelte";

  const currentUser = $derived(userStore. user);

  // Proper Svelte 5 props syntax
  const { clients = [] } = $props<{ clients?: Client[] }>();

  // Access loading state from store with $derived
  const isLoading = $derived(clientStore.loading);

  function formatDate(dateString: string) {
    if (!dateString) return "—";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getLeadStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case "hot":
        return "bg-red-100 text-red-700";
      case "warm":
        return "bg-amber-100 text-amber-700";
      case "cold":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  // Get primary contact from contacts array
  function getPrimaryContact(client: Client) {
    if (client.contacts && client.contacts.length > 0) {
      const primaryContact = client.contacts.find(contact => contact.is_primary) || client.contacts[0];
      return {
        name: `${primaryContact.first_name} ${primaryContact.last_name}`,
        email: primaryContact.email,
        contactCount: client.contacts.length
      };
    }
    
    // No contacts available
    return {
      name: "No contact",
      email: "No email",
      contactCount: 0
    };
  }
</script>

<!-- Desktop/Laptop Table -->
<div class="relative hidden overflow-x-auto rounded-md border shadow-sm md:block">
  {#if isLoading}
    <div class="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
      <div class="text-sm">Loading clients...</div>
    </div>
  {/if}

  <table class="w-full text-left text-sm">
    <thead class="bg-muted/50 text-xs uppercase text-muted-foreground">
      <tr>
        <th scope="col" class="px-4 py-3">Company</th>
        <th scope="col" class="px-4 py-3">Contact</th>
        <th scope="col" class="px-4 py-3">Email</th>
        <th scope="col" class="px-4 py-3">Status</th>
        <th scope="col" class="px-4 py-3">Created</th>
        <th scope="col" class="px-4 py-3">Last Contact</th>
        <th scope="col" class="px-4 py-3 text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each clients as client}
        {@const primaryContact = getPrimaryContact(client)}
        <tr class="border-b bg-card hover:bg-muted/20">
          <td class="px-4 py-3 font-medium">{client.company_name || "—"}</td>
          <td class="px-4 py-3">
            <div class="flex flex-col">
              <span>{primaryContact.name}</span>
              {#if primaryContact.contactCount > 1}
                <span class="text-xs text-muted-foreground">+{primaryContact.contactCount - 1} more</span>
              {/if}
            </div>
          </td>
          <td class="px-4 py-3">{primaryContact.email}</td>
          <td class="px-4 py-3">
            <span
              class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getLeadStatusClass(client.lead)}`}
            >
              {client.lead}
            </span>
          </td>
          <td class="px-4 py-3">{formatDate(client.created_at)}</td>
          <td class="px-4 py-3">{client.date_of_last_contact ? formatDate(client.date_of_last_contact) : "Never"}</td>
          <td class="px-4 py-3 text-right">
            <div class="flex justify-end gap-2">
              <Button variant="ghost" size="icon" href={`/clients/${client.id}`} disabled={isLoading}>
                <Eye class="h-4 w-4" />
                <span class="sr-only">View</span>
              </Button>
              {#if client.owner_id === currentUser?.id}
                <Button variant="ghost" size="icon" href={`/clients/${client.id}/edit`} disabled={isLoading}>
                  <Edit class="h-4 w-4" />
                  <span class="sr-only">Edit</span>
                </Button>
              {/if}
              <DeleteClientDialog {client} disabled={isLoading} />
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Mobile/Tablet Card Layout -->
<div class="space-y-4 md:hidden">
  {#if isLoading}
    <div class="flex items-center justify-center py-8">
      <div class="text-sm">Loading clients...</div>
    </div>
  {/if}
  {#each clients as client}
    {@const primaryContact = getPrimaryContact(client)}
    <div class="flex flex-col gap-2 rounded-md border bg-card p-4 shadow-sm">
      <div class="flex items-center justify-between gap-2">
        <div>
          <div class="text-base font-semibold">{client.company_name || "—"}</div>
          <div class="text-sm text-muted-foreground">
            {primaryContact.name}
            {#if primaryContact.contactCount > 1}
              <span class="text-xs">+{primaryContact.contactCount - 1} more</span>
            {/if}
          </div>
        </div>
        <span class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getLeadStatusClass(client.lead)}`}
          >{client.lead}</span
        >
      </div>
      <div class="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <div><span class="font-medium">Email:</span> {primaryContact.email}</div>
        <div><span class="font-medium">Created:</span> {formatDate(client.created_at)}</div>
        <div>
          <span class="font-medium">Last Contact:</span>
          {client.date_of_last_contact ? formatDate(client.date_of_last_contact) : "Never"}
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="icon" href={`/clients/${client.id}`} disabled={isLoading}>
          <Eye class="h-4 w-4" />
          <span class="sr-only">View</span>
        </Button>
        {#if client.owner_id === currentUser?.id}
          <Button variant="ghost" size="icon" href={`/clients/${client.id}/edit`} disabled={isLoading}>
            <Edit class="h-4 w-4" />
            <span class="sr-only">Edit</span>
          </Button>
        {/if}
        <DeleteClientDialog {client} disabled={isLoading} />
      </div>
    </div>
  {/each}
</div>

<!-- Empty state -->
{#if clients.length === 0 && !isLoading}
  <div class="flex flex-col items-center justify-center rounded-md border py-16 text-center">
    <p class="mb-4 text-muted-foreground">No clients found</p>
    <Button href="/clients/new">Add your first client</Button>
  </div>
{/if}
