// Auth types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string;
  is_superuser: boolean;
  is_staff: boolean;
  assigned_tasks_count: number;
  managed_clients_count: number;
  calendar_events_count: number;
  pending_tasks_count: number;
  completed_tasks_count: number;
  upcoming_events_count: number;
  permissions: Record<string, unknown>;
  can_manage_users: boolean;
  can_manage_clients: boolean;
  can_manage_tasks: boolean;
  can_manage_events: boolean;
  can_delete_clients: boolean;
  can_delete_tasks: boolean;
  can_delete_events: boolean;
  permission_context: {
    is_superuser: boolean;
    is_staff: boolean;
    total_permissions: number;
    permission_apps: string[];
  };
}

export interface UserPermissions {
  canCreateClients: boolean;
  canEditClients: boolean;
  canDeleteClients: boolean;
  canViewClients: boolean;
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canViewTasks: boolean;
  canCreateEvents: boolean;
  canEditEvents: boolean;
  canDeleteEvents: boolean;
  canViewEvents: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Contact types
export interface ContactBase {
  first_name: string;
  last_name: string;
  position: string;
  phone: string;
  email: string;
  is_primary: boolean;
}

export interface ContactCreate extends ContactBase {
  id?: number; // Optional ID for updates
}

export type ContactUpdate = ContactBase;

export interface ContactResponse extends ContactBase {
  id: number;
  client_id: number;
  created_at: string;
}

// Client types
export type LeadStatus = "cold" | "warm" | "hot";

export interface Client {
  id: number;
  created_at: string;
  company_name: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  lead: string;
  related_name: string;
  linkedin_connection: string;
  comments: string;
  first_contact: string | undefined;
  description_contact: string;
  date_of_last_contact: string;
  description_contact_more: string;
  follow_up_action: string;
  date_of_next_contact: string;
  new_business: string;
  recommendation: string;
  owner_id: number;
  latest_task_id?: number;
  task_count?: number;
  // Multi-contact fields
  contacts: ContactResponse[];
  contact_count: number;
  primary_contact?: ContactResponse;
}

export type CreateClientData = Omit<
  Client,
  "id" | "created_at" | "owner_id" | "date_of_last_contact" | "date_of_next_contact" | "contacts" | "contact_count"
> & {
  // Required contacts for creation
  contacts: ContactCreate[];
};

export interface UpdateClientData extends CreateClientData {
  id: number;
}

// Contact-specific response types
export interface ContactListResponse {
  success: boolean;
  data: ContactResponse[];
  error?: string;
}

export interface ContactSingleResponse {
  success: boolean;
  data?: ContactResponse;
  error?: string;
}

//state types
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Task types
export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type TaskType = "follow-up" | "meeting" | "call" | "email" | "other";
export type TaskCreationSource = "manual" | "client" | "calendar" | "follow-up";

export interface Task {
  id: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  title: string;
  description: string;
  status: TaskStatus;
  client_id?: number;
  due_date?: string;
  priority?: TaskPriority;
  type?: TaskType;
  owner_id: number;
}

export type CreateTaskData = Omit<Task, "id" | "created_at" | "updated_at" | "completed_at" | "owner_id">;
export type UpdateTaskData = Omit<Task, "created_at" | "updated_at" | "owner_id">;

export interface TaskCreationContext {
  source: TaskCreationSource;
  client_id?: number;
  date?: string;
  event_id?: string;
  follow_up_action?: string;
  prefilled_data?: {
    title?: string;
    description?: string;
    type?: TaskType;
  };
}

// Calendar types
export type CalendarEventType = "meeting" | "call" | "follow-up" | "deadline" | "personal" | "other";
export type CalendarEventStatus = "scheduled" | "completed" | "cancelled" | "rescheduled";
export type CalendarEventRecurrence = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_date: string; // ISO string
  end_date: string; // ISO string
  all_day: boolean;
  type: CalendarEventType;
  status: CalendarEventStatus;
  client_id?: number; // Optional link to client
  task_id?: number; // Optional link to task
  location?: string;
  recurrence: CalendarEventRecurrence;
  recurrence_end?: string; // ISO string
  created_at: string; // ISO string
  updated_at: string; // ISO string
  owner_id: number;
  item_type: string; // 'event' or 'task'
  due_date: string;
  priority: string;
}

export type CreateCalendarEventData = Omit<CalendarEvent, "id" | "created_at" | "updated_at" | "owner_id">;

export type UpdateCalendarEventData = Partial<CreateCalendarEventData> & {
  id: number;
};

// Calendar View types (for combined calendar events and tasks view)
export interface CalendarViewItem {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  type: string;
  status: string;
  client_id: number;
  task_id: number;
  location: string;
  recurrence: string;
  recurrence_end: string;
  created_at: string;
  updated_at: string;
  item_type: string; // 'event' or 'task'
  priority: string;
  due_date: string;
  completed_at: string;
}

export interface CalendarViewResponse {
  success: boolean;
  data: CalendarViewItem[];
  pagination: PaginationState;
  error?: string;
}

export interface ListCalendarEventsResponse {
  success: boolean;
  data: CalendarEvent[];
  pagination: PaginationState;
  error?: string;
}

export interface CalendarEventResponse {
  success: boolean;
  data?: CalendarEvent;
  error?: string;
}

// New interfaces for calendar view endpoint
export interface CalendarViewParams {
  start_date?: string;
  end_date?: string;
  include_tasks?: boolean;
  include_events?: boolean;
  type?: string;
  client_id?: number;
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ListCalendarEventsParams {
  type?: string;
  search?: string;
  client_id?: number;
  task_id?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  itemsPerPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
