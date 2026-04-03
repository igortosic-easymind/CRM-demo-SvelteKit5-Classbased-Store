<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import type { Client } from '$lib/types';
  
  interface Props {
    clients: Client[];
  }
  
  let { clients }: Props = $props();
  
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }
  
  function getLeadBadgeClass(lead: string) {
    switch(lead) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-orange-100 text-orange-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  function getPrimaryContact(client: Client) {
    return client.primary_contact || client.contacts?.[0] || { first_name: '', last_name: '' };
  }
  
  function getInitials(client: Client) {
    const contact = getPrimaryContact(client);
    const firstInitial = contact.first_name?.charAt(0) || '';
    const lastInitial = contact.last_name?.charAt(0) || '';
    return firstInitial + lastInitial || client.company_name?.charAt(0) || '?';
  }
</script>

<Card.Root>
  <Card.Header class="flex flex-row items-center justify-between">
    <Card.Title>Recent Clients</Card.Title>
    <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Live</span>
  </Card.Header>
  <Card.Content>
    <div class="space-y-4">
      {#each clients as client (`client-${client.id}`)}
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="shrink-0">
              <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span class="text-sm font-medium text-gray-700">
                  {getInitials(client)}
                </span>
              </div>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">
                {getPrimaryContact(client).first_name} {getPrimaryContact(client).last_name}
              </p>
              <p class="text-sm text-gray-500">{client.company_name}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getLeadBadgeClass(client.lead)}">
              {client.lead.charAt(0).toUpperCase() + client.lead.slice(1)}
            </span>
            <span class="text-xs text-gray-500">{formatDate(client.created_at)}</span>
          </div>
        </div>
      {/each}
      {#if clients.length === 0}
        <p class="text-sm text-gray-500 text-center py-4">No recent clients</p>
      {/if}
    </div>
  </Card.Content>
</Card.Root> 