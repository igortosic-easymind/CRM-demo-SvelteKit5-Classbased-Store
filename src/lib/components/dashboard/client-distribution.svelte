<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  
  interface Props {
    distribution: {
      hot: number;
      warm: number;
      cold: number;
    };
  }
  
  let { distribution }: Props = $props();
  
  const total = $derived(distribution.hot + distribution.warm + distribution.cold);
  
  function getPercentage(value: number) {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }
</script>

<Card.Root>
  <Card.Header class="flex flex-row items-center justify-between">
    <Card.Title>Client Distribution</Card.Title>
    <span class="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">Live</span>
  </Card.Header>
  <Card.Content>
    <div class="space-y-4">
      <div class="text-sm text-gray-600 mb-4">Breakdown by lead status</div>
      
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <span class="text-sm font-medium">Hot Leads</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-bold">{distribution.hot}</span>
            <span class="text-xs text-gray-500">{getPercentage(distribution.hot)}%</span>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-orange-500"></div>
            <span class="text-sm font-medium">Warm Leads</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-bold">{distribution.warm}</span>
            <span class="text-xs text-gray-500">{getPercentage(distribution.warm)}%</span>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
            <span class="text-sm font-medium">Cold Leads</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-bold">{distribution.cold}</span>
            <span class="text-xs text-gray-500">{getPercentage(distribution.cold)}%</span>
          </div>
        </div>
      </div>
      
      {#if total === 0}
        <p class="text-sm text-gray-500 text-center py-4">No client data available</p>
      {/if}
    </div>
  </Card.Content>
</Card.Root> 