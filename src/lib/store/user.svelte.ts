import type { User, UserPermissions } from "$lib/types";

export class UserStore {
  // Base state
  user = $state<User | null>(null);
  loading = $state(false);
  error = $state<string | null>(null);

  // Computed getters (replace derived stores)
  get isAuthenticated() {
    return this.user !== null;
  }

  get permissions(): UserPermissions | null {
    if (!this.user) return null;

    return {
      canCreateClients: this.user.can_manage_clients,
      canEditClients: this.user.can_manage_clients,
      canDeleteClients: this.user.can_delete_clients,
      canViewClients: this.user.can_manage_clients,
      canCreateTasks: this.user.can_manage_tasks,
      canEditTasks: this.user.can_manage_tasks,
      canDeleteTasks: this.user.can_delete_tasks,
      canViewTasks: this.user.can_manage_tasks,
      canCreateEvents: this.user.can_manage_events,
      canEditEvents: this.user.can_manage_events,
      canDeleteEvents: this.user.can_delete_events,
      canViewEvents: this.user.can_manage_events,
      canManageUsers: this.user.can_manage_users,
      canViewReports: true,
      canExportData: true,
      isAdmin: this.user.is_superuser || this.user.is_staff,
    };
  }

  get displayName(): string | null {
    if (!this.user) return null;

    if (this.user.first_name && this.user.last_name) {
      return `${this.user.first_name} ${this.user.last_name}`;
    } else if (this.user.first_name) {
      return this.user.first_name;
    } else {
      return this.user.username;
    }
  }

  get userRole(): "superuser" | "staff" | "user" | null {
    if (!this.user) return null;
    if (this.user.is_superuser) return "superuser";
    if (this.user.is_staff) return "staff";
    return "user";
  }

  // Helper method to check specific permission
  hasPermission(permission: keyof UserPermissions): boolean {
    if (!this.permissions) return false;
    return this.permissions[permission] || false;
  }

  // Actions
  setUser(userData: User | null): void {
    this.user = userData;
    this.error = null;
  }

  clearUser(): void {
    this.user = null;
    this.error = null;
    this.loading = false;
  }

  updateUser(updates: Partial<User>): void {
    if (!this.user) return;
    this.user = { ...this.user, ...updates };
  }

  setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  setError(errorMessage: string | null): void {
    this.error = errorMessage;
  }
}

export const userStore = new UserStore();
