<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import type { Component } from 'svelte';
  
  interface Props {
    title: string;
    value: number | string;
    description?: string;
    icon?: Component;
    trend?: {
      value: number;
      label: string;
      isPositive: boolean;
    };
  }
  
  let { title, value, description, icon, trend }: Props = $props();
  
  // Capitalize the icon for Svelte component recognition
  const Icon = $derived(icon);
</script>

<Card.Root>
  <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
    <Card.Title class="text-sm font-medium">{title}</Card.Title>
    {#if icon}
      <div class="h-4 w-4 text-muted-foreground">
        <Icon size={16}></Icon>
      </div>
    {/if}
  </Card.Header>
  <Card.Content>
    <div class="text-2xl font-bold">{value}</div>
    {#if description}
      <p class="text-xs text-muted-foreground">{description}</p>
    {/if}
    {#if trend}
      <div class="flex items-center space-x-1 text-xs mt-1">
        <span class="text-{trend.isPositive ? 'green' : 'red'}-600">
          {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
        </span>
        <span class="text-muted-foreground">{trend.label}</span>
      </div>
    {/if}
  </Card.Content>
</Card.Root> 