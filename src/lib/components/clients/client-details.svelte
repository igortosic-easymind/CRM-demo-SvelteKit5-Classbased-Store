<!-- src/lib/components/clients/client-details.svelte -->
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import type { Client } from "$lib/types";
  import DeleteClientDialog from "./delete-client-dialog.svelte";
  import ContactList from "./contact-list.svelte";
  import { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import { cn } from "$lib/utils.js";
  import Edit from "@lucide/svelte/icons/edit";
  import Users from "@lucide/svelte/icons/users";
  import { userStore } from "$lib/store/user.svelte";

  // Props
  const { client } = $props<{ client: Client }>();

  const currentUser = $derived(userStore.user);

  // Function to format dates
  function formatDate(dateString: string | undefined) {
    if (!dateString) return "Not set";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  }

  // Function to get lead status class
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
</script>

<Card.Root class="max-w-4xl">
  <Card.Header class="flex flex-row items-center justify-between">
    <div>
      <Card.Title class="text-2xl">{client.company_name || `${client.first_name} ${client.last_name}`}</Card.Title>
      <Card.Description>
        Client information and details
      </Card.Description>
      <div class="mt-2 flex items-center gap-2">
        <span
          class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getLeadStatusClass(client.lead)}`}
        >
          {client.lead} lead
        </span>
        {#if client.contacts && client.contacts.length > 0}
          <Badge variant="outline" class="flex items-center gap-1">
            <Users class="h-3 w-3" />
            {client.contacts.length} {client.contacts.length === 1 ? 'contact' : 'contacts'}
          </Badge>
        {/if}
      </div>
    </div>
    {#if client.owner_id === currentUser?.id}
      <div class="flex gap-2">
        <a href={`/clients/${client.id}/edit`} class={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          <Edit class="mr-2 h-4 w-4" />
          Edit
        </a>
        <DeleteClientDialog {client} />
      </div>
    {/if}
  </Card.Header>

  <Card.Content class="space-y-6">
    <!-- Company Information -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Company Information</h3>
      <div class="grid grid-cols-1 gap-4 rounded-md bg-muted/20 p-4 md:grid-cols-2">
        <div>
          <p class="text-sm text-muted-foreground">Company Name</p>
          <p class="font-medium">{client.company_name || "—"}</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Website</p>
          {#if client.website}
            <a href={client.website} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
              {client.website}
            </a>
          {:else}
            <p>—</p>
          {/if}
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Contact Information</h3>
      {#if client.contacts && client.contacts.length > 0}
        <ContactList contacts={client.contacts} editable={false} />
      {:else}
        <div class="rounded-md border border-dashed p-6 text-center">
          <Users class="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 class="mt-2 text-sm font-semibold">No contacts</h3>
          <p class="mt-1 text-sm text-muted-foreground">No contacts have been added yet.</p>
        </div>
      {/if}
    </div>

    <!-- Address Information -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Address</h3>
      <div class="grid grid-cols-1 gap-4 rounded-md bg-muted/20 p-4 md:grid-cols-2">
        <div class="md:col-span-2">
          <p class="text-sm text-muted-foreground">Street Address</p>
          <p>{client.address || "—"}</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">City</p>
          <p>{client.city || "—"}</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">State/Province</p>
          <p>{client.state || "—"}</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Zip/Postal Code</p>
          <p>{client.zipcode || "—"}</p>
        </div>
      </div>
    </div>

    <!-- Lead Information -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Lead Information</h3>
      <div class="grid grid-cols-1 gap-4 rounded-md bg-muted/20 p-4 md:grid-cols-2">
        <div>
          <p class="text-sm text-muted-foreground">LinkedIn</p>
          {#if client.linkedin_connection}
            <a
              href={client.linkedin_connection}
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:underline"
            >
              View LinkedIn
            </a>
          {:else}
            <p>—</p>
          {/if}
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Related Name</p>
          <p>{client.related_name || "—"}</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">First Contact</p>
          <p>{formatDate(client.first_contact)}</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Last Contact</p>
          <p>{formatDate(client.date_of_last_contact)}</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Next Contact</p>
          <p>{formatDate(client.date_of_next_contact)}</p>
        </div>
      </div>
    </div>

    <!-- Additional Information -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Additional Information</h3>
      <div class="space-y-4 rounded-md bg-muted/20 p-4">
        {#if client.comments}
          <div>
            <p class="text-sm text-muted-foreground">Comments</p>
            <p class="whitespace-pre-line">{client.comments}</p>
          </div>
        {/if}

        {#if client.description_contact}
          <div>
            <p class="text-sm text-muted-foreground">Contact Description</p>
            <p>{client.description_contact}</p>
          </div>
        {/if}

        {#if client.description_contact_more}
          <div>
            <p class="text-sm text-muted-foreground">Additional Contact Notes</p>
            <p>{client.description_contact_more}</p>
          </div>
        {/if}

        {#if client.follow_up_action}
          <div>
            <p class="text-sm text-muted-foreground">Follow-up Action</p>
            <p>{client.follow_up_action}</p>
          </div>
        {/if}

        {#if client.new_business}
          <div>
            <p class="text-sm text-muted-foreground">New Business Potential</p>
            <p>{client.new_business}</p>
          </div>
        {/if}

        {#if client.recommendation}
          <div>
            <p class="text-sm text-muted-foreground">Recommendation</p>
            <p>{client.recommendation}</p>
          </div>
        {/if}
      </div>
    </div>
  </Card.Content>

  <Card.Footer>
    <div class="text-sm text-muted-foreground">
      Client ID: {client.id} | Created: {formatDate(client.created_at)}
    </div>
  </Card.Footer>
</Card.Root>
