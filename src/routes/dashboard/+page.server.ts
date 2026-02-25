import { listClients } from "$lib/server/clients";
import { listTasks } from "$lib/server/tasks";
import { listCalendarEvents } from "$lib/server/calendar";
import type { Cookies } from "@sveltejs/kit";

export const load = async ({ cookies }: { cookies: Cookies }) => {
  // Fetch all necessary data for dashboard statistics
  const [allClientsResponse, allTasksResponse, allEventsResponse] = await Promise.all([
    // Get all clients (with high limit to get full count)
    listClients(cookies, { itemsPerPage: 1000 }),
    // Get all tasks (with high limit to get full count)
    listTasks(cookies, { itemsPerPage: 1000 }),
    // Get calendar events for current week and upcoming
    listCalendarEvents(cookies, { itemsPerPage: 1000 }),
  ]);

  const clients = allClientsResponse.data || [];
  const tasks = allTasksResponse.data || [];
  const events = allEventsResponse.data || [];

  // Calculate statistics
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));

  // Total clients
  const totalClients = clients.length;

  // New clients (created in last week)
  const newClients = clients.filter((client) => {
    const createdAt = new Date(client.created_at);
    return createdAt >= oneWeekAgo;
  }).length;

  // Follow-ups due (tasks with type 'follow-up' that are not completed)
  const followUpsDue = tasks.filter(
    (task) =>
      task.type === "follow-up" &&
      task.status !== "completed" &&
      (!task.due_date || new Date(task.due_date) <= new Date()),
  ).length;

  // Meetings this week (calendar events with type 'meeting' in current week)
  const meetingsThisWeek = events.filter((event) => {
    const eventDate = new Date(event.start_date);
    return (
      event.type === "meeting" && event.status === "scheduled" && eventDate >= startOfWeek && eventDate <= endOfWeek
    );
  }).length;

  // Active tasks (tasks that are not completed)
  const activeTasks = tasks.filter((task) => task.status !== "completed").length;

  // Recent clients (last 5 clients)
  const recentClients = clients
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Upcoming events (next 5 events)
  const upcomingEvents = events
    .filter((event) => new Date(event.start_date) > new Date() && event.status === "scheduled")
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 5);

  // Client distribution by lead status
  const clientDistribution = {
    hot: clients.filter((client) => client.lead === "hot").length,
    warm: clients.filter((client) => client.lead === "warm").length,
    cold: clients.filter((client) => client.lead === "cold").length,
  };

  // Client growth data (simplified - just monthly counts for last 6 months)
  const clientGrowthData = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() - i);
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    const clientsInMonth = clients.filter((client) => {
      const createdAt = new Date(client.created_at);
      return createdAt >= monthStart && createdAt <= monthEnd;
    }).length;

    clientGrowthData.push({
      month: monthDate.toLocaleString("default", { month: "short" }),
      clients: clientsInMonth,
    });
  }

  return {
    statistics: {
      totalClients,
      newClients,
      followUpsDue,
      meetingsThisWeek,
      activeTasks,
    },
    recentClients,
    upcomingEvents,
    clientDistribution,
    clientGrowthData,
  };
};
