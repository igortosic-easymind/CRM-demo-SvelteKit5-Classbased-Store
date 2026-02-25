<script lang="ts">
  import StatsCard from '$lib/components/dashboard/stats-card.svelte';
  import RecentClients from '$lib/components/dashboard/recent-clients.svelte';
  import UpcomingEvents from '$lib/components/dashboard/upcoming-events.svelte';
  import ClientDistribution from '$lib/components/dashboard/client-distribution.svelte';
  import ClientGrowth from '$lib/components/dashboard/client-growth.svelte';
  import { Users, UserPlus, Phone, Calendar, CheckSquare } from '@lucide/svelte';
  import type { PageData } from './$types';

  let { data } = $props<{data: PageData}>();
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Dashboard</h1>
  </div>
  
  <!-- First Row: Statistics Cards -->
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
    <StatsCard 
      title="Total Clients" 
      value={data.statistics.totalClients}
      description="Demo"
      icon={Users}
      trend={{ value: 12, label: "increase", isPositive: true }}
    />
    
    <StatsCard 
      title="New Clients" 
      value={data.statistics.newClients}
      description="Demo"
      icon={UserPlus}
      trend={{ value: 8, label: "this month", isPositive: true }}
    />
    
    <StatsCard 
      title="Follow-ups Due" 
      value={data.statistics.followUpsDue}
      description="Demo"
      icon={Phone}
      trend={{ value: 3, label: "overdue", isPositive: false }}
    />
    
    <StatsCard 
      title="Meetings This Week" 
      value={data.statistics.meetingsThisWeek}
      description="Next in 2 days"
      icon={Calendar}
    />
    
    <StatsCard 
      title="Active Tasks" 
      value={data.statistics.activeTasks}
      description="5 due today"
      icon={CheckSquare}
    />
  </div>
  
  <!-- Second Row: Client Growth and Recent Clients -->
  <div class="grid gap-4 md:grid-cols-2">
    <ClientGrowth growthData={data.clientGrowthData} />
    <RecentClients clients={data.recentClients} />
  </div>
  
  <!-- Third Row: Upcoming Events and Client Distribution -->
  <div class="grid gap-4 md:grid-cols-2">
    <UpcomingEvents events={data.upcomingEvents} />
    <ClientDistribution distribution={data.clientDistribution} />
  </div>
</div>