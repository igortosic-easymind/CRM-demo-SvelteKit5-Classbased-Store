<script lang="ts">
  import { BarChart3, UserCircle, Calendar, Settings as SettingsIcon, CheckSquare, HelpCircle } from "@lucide/svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";

  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: UserCircle,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CheckSquare,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
  ];

  const sidebar = useSidebar();

  function handleLinkClick() {
    if (sidebar.isMobile) {
      sidebar.setOpenMobile(false);
    }
  }
</script>
 
<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>CRM System</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={item.url} {...props} on:click={handleLinkClick}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>