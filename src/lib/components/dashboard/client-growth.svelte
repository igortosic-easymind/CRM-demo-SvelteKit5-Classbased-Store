<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  
  interface Props {
    growthData: Array<{
      month: string;
      clients: number;
    }>;
  }
  
  let { growthData }: Props = $props();
  
  const maxClients = $derived(Math.max(...growthData.map(data => data.clients), 1));
</script>

<Card.Root>
  <Card.Header class="flex flex-row items-center justify-between">
    <Card.Title>Client Growth</Card.Title>
    <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">Demo</span>
  </Card.Header>
  <Card.Content>
    <div class="space-y-4">
      <div class="text-sm text-gray-600 mb-4">Total clients over the last 6 months</div>
      
      <div class="space-y-2">
        {#each growthData as data (`growth-${data.month}`)}
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium w-12">{data.month}</span>
            <div class="flex-1 mx-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out" 
                  style="width: {maxClients > 0 ? (data.clients / maxClients) * 100 : 0}%"
                ></div>
              </div>
            </div>
            <span class="text-sm font-bold w-8 text-right">{data.clients}</span>
          </div>
        {/each}
      </div>
      
      {#if growthData.length === 0}
        <p class="text-sm text-gray-500 text-center py-4">No growth data available</p>
      {/if}
    </div>
  </Card.Content>
</Card.Root> 