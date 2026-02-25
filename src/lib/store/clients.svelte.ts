import type { Client, LeadStatus, PaginationState, ContactResponse } from "$lib/types";

export class ClientStore {
  // Base state
  clients = $state<Client[]>([]);
  pagination = $state<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  filters = $state<{
    search: string;
    lead: LeadStatus | null;
  }>({
    search: "",
    lead: null,
  });

  // Loading and error states
  loading = $state(false);
  error = $state<string | null>(null);

  // Contact-specific states
  selectedClientContacts = $state<ContactResponse[]>([]);
  contactsLoading = $state(false);
  contactsError = $state<string | null>(null);
  selectedContact = $state<ContactResponse | null>(null);

  // Contact modal states
  contactModalOpen = $state(false);
  contactModalMode = $state<"create" | "edit" | "view">("create");
  deleteContactModalOpen = $state(false);
  contactToDelete = $state<ContactResponse | null>(null);

  // Client data actions
  setClientsData(data: {
    clients: Client[];
    pagination: PaginationState;
    filters?: { search?: string; lead?: LeadStatus | null };
  }): void {
    this.clients = data.clients;
    this.pagination = data.pagination;

    if (data.filters) {
      this.filters = {
        ...this.filters,
        search: data.filters.search || "",
        lead: data.filters.lead || null,
      };
    }
  }

  // Filter actions
  updateFilters(newFilters: { search?: string; lead?: LeadStatus | null }): void {
    this.filters = { ...this.filters, ...newFilters };
  }

  resetFilters(): void {
    this.filters = { search: "", lead: null };
  }

  // Loading and error actions
  setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  setError(errorMessage: string | null): void {
    this.error = errorMessage;
  }

  // Contact management actions
  setContactsData(contacts: ContactResponse[]): void {
    this.selectedClientContacts = contacts;
  }

  setContactsLoading(isLoading: boolean): void {
    this.contactsLoading = isLoading;
  }

  setContactsError(errorMessage: string | null): void {
    this.contactsError = errorMessage;
  }
  // Contact modal actions
  viewContact(contact: ContactResponse): void {
    this.selectedContact = contact;
    this.contactModalMode = "view";
    this.contactModalOpen = true;
  }

  editContact(contact: ContactResponse): void {
    this.selectedContact = contact;
    this.contactModalMode = "edit";
    this.contactModalOpen = true;
  }

  createContact(): void {
    this.selectedContact = null;
    this.contactModalMode = "create";
    this.contactModalOpen = true;
  }

  deleteContact(contact: ContactResponse): void {
    this.contactToDelete = contact;
    this.deleteContactModalOpen = true;
  }

  closeContactModal(): void {
    this.contactModalOpen = false;
    this.selectedContact = null;
  }

  closeDeleteContactModal(): void {
    this.deleteContactModalOpen = false;
    this.contactToDelete = null;
  }

  // Client contact helper methods
  updateClientContacts(clientId: number, contacts: ContactResponse[]): void {
    this.clients = this.clients.map((client) =>
      client.id === clientId ? { ...client, contacts, contact_count: contacts.length } : client,
    );
  }

  addContactToClient(clientId: number, contact: ContactResponse): void {
    this.clients = this.clients.map((client) =>
      client.id === clientId
        ? {
            ...client,
            contacts: [...client.contacts, contact],
            contact_count: client.contacts.length + 1,
          }
        : client,
    );

    this.selectedClientContacts = [...this.selectedClientContacts, contact];
  }

  updateContactInClient(clientId: number, updatedContact: ContactResponse): void {
    this.clients = this.clients.map((client) =>
      client.id === clientId
        ? {
            ...client,
            contacts: client.contacts.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact)),
          }
        : client,
    );

    this.selectedClientContacts = this.selectedClientContacts.map((contact) =>
      contact.id === updatedContact.id ? updatedContact : contact,
    );
  }

  removeContactFromClient(clientId: number, contactId: number): void {
    this.clients = this.clients.map((client) =>
      client.id === clientId
        ? {
            ...client,
            contacts: client.contacts.filter((contact) => contact.id !== contactId),
            contact_count: client.contacts.length - 1,
          }
        : client,
    );

    this.selectedClientContacts = this.selectedClientContacts.filter((contact) => contact.id !== contactId);
  }
}

export const clientStore = new ClientStore();
